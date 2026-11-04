'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createApp}=require('./dom-harness.cjs');
const lab=require('../dist/lab.js'),timeline=require('../experiments/model.js'),formula=require('../../../shared/formula.js');
const at='2026-10-01T00:00:00.000Z';
const note=(id,body=id)=>({id,title:'我的发现',body,at});
const footprint=id=>({id,title:'已学会的知识',at});
const backup=(notes=[],completed=[])=>({app:'wanwu-chemistry',version:1,notes,completed});
async function importFile(a,value){const input=a.el('#import-file');Object.defineProperty(input,'files',{configurable:true,value:[{size:100,text:async()=>typeof value==='string'?value:JSON.stringify(value)}]});input.dispatchEvent(new a.window.Event('change',{bubbles:true}));await new Promise(resolve=>setImmediate(resolve));a.tick(2);}
function hidden(a,value){Object.defineProperty(a.document,'hidden',{configurable:true,value});a.document.dispatchEvent(new a.window.Event('visibilitychange'));}
function prepare(a,e){for(const id of e.gear)a.click(`[data-lab-action="place"][data-id="${id}"]`);for(const [from,to]of e.links){a.input('[data-lab-endpoint="from"]',from,'change');a.input('[data-lab-endpoint="to"]',to,'change');a.click('[data-lab-action="connect"]');}for(const r of e.reagents)a.click(`[data-lab-action="add"][data-material="${r.id}"][data-target="${r.target}"]`);a.click('[data-lab-action="predict"][data-index="0"]');for(const op of e.operations)a.click(`[data-lab-action="operate"][data-operation="${op.id}"]`);}

test('JSON备份兼容旧本机笔记，重复编号保留本机手记和已掌握项目',async()=>{
 const current={mode:'advanced',notes:[note('old','原来的观察')],completed:[footprint('quiz-1')]};
 const a=await createApp({route:'notebook',storage:{'wanwu-chemistry-v1':JSON.stringify(current)}});
 a.click('#export-backup');const exported=JSON.parse(await a.downloads[0].text());assert.equal(exported.app,'wanwu-chemistry');assert.equal(exported.notes[0].body,'原来的观察');assert.equal(a.window.ChemAppTesting.validateBackup(exported).notes.length,1);
 await importFile(a,backup([note('old','不能覆盖这句话'),note('new','新的观察')],[{...footprint('quiz-1'),title:'不能覆盖已掌握'},footprint('lab-new')]));
 const saved=JSON.parse(a.storage.get('wanwu-chemistry-v1'));assert.equal(saved.mode,'advanced');assert.equal(saved.notes.length,2);assert.equal(saved.notes.find(n=>n.id==='old').body,'原来的观察');assert.equal(saved.completed.find(n=>n.id==='quiz-1').title,'已学会的知识');assert.equal(saved.completed.length,2);assert.equal(a.all('.notebook-card').length,2);
 await importFile(a,exported);assert.equal(JSON.parse(a.storage.get('wanwu-chemistry-v1')).notes.length,2);assert.deepEqual(a.errors,[]);a.close();
});
test('损坏、错误版本、重复编号、过长内容与坏日期备份不写入任何旧记录',async()=>{
 const a=await createApp({route:'notebook',storage:{'wanwu-chemistry-v1':JSON.stringify({notes:[note('keep')],completed:[footprint('keep')]})}});const original=a.storage.get('wanwu-chemistry-v1');
 const invalid=['{bad',{}, {...backup(),version:2},backup([note('x'),note('x')]),backup([note('x','a'.repeat(12001))]),backup([{...note('x'),at:'not-a-date'}]),backup([note('valid')],[{id:'broken'}])];
 for(const value of invalid){await importFile(a,value);assert.equal(a.storage.get('wanwu-chemistry-v1'),original);assert.equal(a.all('.notebook-card').length,1);assert.match(a.el('#toast').textContent,/原记录没有改变/);}
 const api=a.window.ChemAppTesting;assert.throws(()=>api.mergeBackup({notes:Array.from({length:300},(_,i)=>note('n'+i)),completed:[]},api.validateBackup(backup([note('extra')]))));a.close();
});
test('衰变在后台和pagehide持久暂停，返回后明确播放才继续',async()=>{
 const a=await createApp({route:'decay'});a.click('[data-decay-play]');a.tick(450);const time=Number(a.el('#cx-decay-time').value);assert.ok(time>0);hidden(a,true);a.tick(4000);hidden(a,false);a.tick(4000);assert.equal(Number(a.el('#cx-decay-time').value),time);assert.equal(a.el('[data-decay-play]').getAttribute('aria-pressed'),'false');a.click('[data-decay-play]');a.tick(300);assert.ok(Number(a.el('#cx-decay-time').value)>time);a.window.dispatchEvent(new a.window.Event('pagehide'));const stopped=Number(a.el('#cx-decay-time').value);a.tick(3000);assert.equal(Number(a.el('#cx-decay-time').value),stopped);a.go('home');hidden(a,true);assert.deepEqual(a.errors,[]);a.close();
});
test('实验室隐藏、pagehide与路由卸载不推进时钟且不会在返回时自动继续',async()=>{
 const e=lab.experiments[0],a=await createApp({route:'lab?experiment='+e.id});prepare(a,e);a.tick(400);const state=()=>a.el('#main-content').chemLabInstance.getState();const time=state().elapsed;hidden(a,true);a.tick(1000);hidden(a,false);a.tick(1000);assert.equal(state().elapsed,time);assert.equal(state().paused,true);a.click('[data-lab-action="pause"]');a.tick(100);assert.ok(state().elapsed>time);a.window.dispatchEvent(new a.window.Event('pagehide'));const stopped=state().elapsed;a.tick(1000);assert.equal(state().elapsed,stopped);assert.equal(state().paused,true);a.go('home');hidden(a,true);assert.deepEqual(a.errors,[]);a.close();
});
async function theatre(){
 const DOM=await import('./vendor/linkedom-worker.mjs'),document=DOM.parseHTML(fs.readFileSync(path.resolve(__dirname,'../experiments/index.html'),'utf8')).document;let now=0,callback;
 const events=new DOM.EventTarget(),context={document,Formula:formula,location:{hash:''},history:{replaceState(){}},performance:{now:()=>now},requestAnimationFrame:fn=>{callback=fn;},addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events)};context.window=context;context.globalThis=context;vm.createContext(context);
 document.getElementById('particles').checked=true;for(const name of ['model.js','app.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../experiments',name),'utf8'),context,{filename:name});
 return {context,document,el:id=>document.getElementById(id),tick(ms){const steps=Math.ceil(ms/20);for(let i=0;i<steps;i++){now+=20;callback(now);}},hidden(value){Object.defineProperty(document,'hidden',{configurable:true,value});document.dispatchEvent(new DOM.Event('visibilitychange'));},pagehide(){events.dispatchEvent(new DOM.Event('pagehide'));}};
}
test('剧场隐藏后保持暂停，恢复播放、拖动与重置共用实际进度',async()=>{
 const a=await theatre();a.el('play').onclick();a.tick(500);const time=a.context.ChemLabTest.getState().time;assert.ok(time>0);a.hidden(true);a.tick(500);a.hidden(false);a.tick(500);assert.equal(a.context.ChemLabTest.getState().time,time);assert.equal(a.context.ChemLabTest.getState().playing,false);a.el('play').onclick();a.tick(100);assert.ok(a.context.ChemLabTest.getState().time>time);a.pagehide();assert.equal(a.context.ChemLabTest.getState().playing,false);a.el('timeline').oninput({target:{value:'750'}});assert.equal(a.context.ChemLabTest.getState().time,.75);a.el('reset').onclick();assert.equal(a.context.ChemLabTest.getState().time,0);assert.equal(a.el('timeline').value,'0');
});
test('氧气示踪开关同步填色；铁在接触前不反应，两个半反应标签同步变化',async()=>{
 const a=await theatre(),api=a.context.ChemLabTest,scene=a.el('experiment-svg');api.seek(.6);assert.ok(scene.querySelector('[fill="#a2d9df"]'));a.el('particles').checked=false;a.el('particles').onchange();assert.equal(scene.querySelector('[fill="#a2d9df"]'),null);a.el('particles').checked=true;api.select('iron-copper');assert.equal(scene.querySelector('[fill="#ba8b32"]'),null);assert.match(scene.textContent,/Cu²⁺/);assert.ok(!scene.textContent.includes('Fe²⁺'));const start=timeline.sample('iron-copper',0);assert.equal(start.contact,0);assert.equal(start.progress,0);assert.equal(timeline.sample('iron-copper',.24).progress,0);api.seek(.4);assert.ok(scene.querySelector('[fill="#ba8b32"]'));api.seek(.65);assert.match(scene.textContent,/Fe²⁺/);assert.ok(!scene.textContent.includes('Cu²⁺'));api.seek(1);assert.equal(scene.querySelector('[fill="#ba8b32"]'),null);assert.equal(timeline.sample('iron-copper',1).progress,1);
});

test('从实际显示TeX中独立解析系数、下标和电荷，所有剧场反应守恒',()=>{
 const core=require('../dist/core.js');
 function sides(tex){const regular=tex.indexOf('\\longrightarrow');if(regular>=0)return [tex.slice(0,regular),tex.slice(regular+'\\longrightarrow'.length)];const start=tex.indexOf('\\xrightarrow');assert.ok(start>=0);let end=start+'\\xrightarrow'.length,depth=0;do{const c=tex[end++];if(c==='{')depth++;if(c==='}')depth--;}while(depth>0&&end<tex.length);return [tex.slice(0,start),tex.slice(end)];}
 function count(side){const atoms={};let charge=0,species=0;const pattern=/(\d*)\\mathrm\{([^}]+)\}(?:\^\{(\d*)([+-])\})?/g;for(const match of side.matchAll(pattern)){species++;const coefficient=Number(match[1]||1),chemical=match[2].replace(/_/g,'');if(chemical!=='e')for(const [element,n]of Object.entries(core.parseFormula(chemical)))atoms[element]=(atoms[element]||0)+coefficient*n;if(match[4])charge+=coefficient*Number(match[3]||1)*(match[4]==='+'?1:-1);}assert.ok(species>0);return {atoms:Object.fromEntries(Object.entries(atoms).sort()),charge};}
 for(const [id,equation]of Object.entries(timeline.equations)){const [left,right]=sides(equation.tex);assert.deepEqual(count(left),count(right),id);}
});

test('坏JSON与未来版本的本机原始数据不会被模式/保存/合并自动覆写',async()=>{
 for(const raw of ['{broken-json',JSON.stringify({version:99,notes:[note('future')],completed:[]})]){
  const a=await createApp({route:'notebook',storage:{'wanwu-chemistry-v1':raw}});a.click('.mode-switch [data-mode="advanced"]');a.input('#note-title','暂存');a.input('#note-body','新的观察');a.el('#note-form').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));a.tick(2);assert.equal(a.storage.get('wanwu-chemistry-v1'),raw);assert.match(a.text(),/原有数据不会被自动覆盖/);await importFile(a,backup([note('imported')]));assert.equal(a.storage.get('wanwu-chemistry-v1'),raw);assert.equal(a.all('.notebook-card').length,2);a.click('#export-backup');assert.equal(JSON.parse(await a.downloads[0].text()).notes.length,2);a.close();
 }
});
