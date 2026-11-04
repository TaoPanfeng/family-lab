'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');

async function boot(raw){
 const DOM=await import('../../chemistry/tests/vendor/linkedom-worker.mjs');const document=DOM.parseHTML(fs.readFileSync(path.resolve(__dirname,'../src/index.template.html'),'utf8')).document;
 const descriptor=Object.getOwnPropertyDescriptor(DOM.HTMLSelectElement.prototype,'value');if(!descriptor?.set)Object.defineProperty(DOM.HTMLSelectElement.prototype,'value',{configurable:true,get(){const options=Array.from(this.querySelectorAll('option'));return (options.find(o=>o.hasAttribute('selected'))||options[0])?.value||'';},set(value){this.querySelectorAll('option').forEach(o=>{if(o.value===String(value))o.setAttribute('selected','');else o.removeAttribute('selected');});}});
 let active=null;Object.defineProperty(document,'activeElement',{configurable:true,get:()=>active});const store=new Map(raw===undefined?[]:[['guanwu.physics.v1',raw]]),events=new DOM.EventTarget(),timers=new Map(),downloads=[];let nextTimer=0;
 const context={document,console,Intl,Date,Math,JSON,Number,Set,Map,performance:{now:()=>0},localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)},requestAnimationFrame(){},setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer;},clearTimeout(id){timers.delete(id);},Blob,URL:{createObjectURL(blob){downloads.push(blob);return 'blob:physics-test';},revokeObjectURL(){}},addEventListener:events.addEventListener.bind(events),scrollTo(){},LabScene:{draw(){return {handles:[]};},graph(){}}};context.window=context;context.globalThis=context;vm.createContext(context);
 for(const file of ['catalog.js','physics.js','app.js'])vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src',file),'utf8'),context,{filename:file});
 return {context,document,store,events,DOM,downloads,setActive(value){active=value;},flush(){let limit=100;while(timers.size&&limit-->0){const [id,fn]=timers.entries().next().value;timers.delete(id);fn();}assert.ok(limit>0);}};
}

test('聚焦数字框提交空值/非法值/重复越界值时，显示立即恢复实际模型参数',async()=>{
 const app=await boot(),{context,document}=app;let active;
 const api=context.GuanWu;for(const value of ['', 'not-a-number']){active=document.getElementById('value-height');app.setActive(active);active.value=value;active.dispatchEvent(new app.DOM.Event('change',{bubbles:true}));assert.equal(active.value,String(api.getState().params.height));assert.match(document.getElementById('toast').textContent,/已恢复当前参数/);assert.equal(api.getResults().speed,Math.sqrt(2*9.81*10));}
 active.value='5';active.dispatchEvent(new app.DOM.Event('change',{bubbles:true}));assert.equal(api.getState().params.height,5);assert.equal(api.getResults().speed,Math.sqrt(2*9.81*5));
 for(const [limit,beyond]of [[20,100],[.5,-1]]){api.setParam('height',limit);active.value=String(beyond);active.dispatchEvent(new app.DOM.Event('change',{bubbles:true}));assert.equal(active.value,String(limit));assert.equal(api.getState().params.height,limit);}
});

for(const [label,raw]of [['坏JSON','{broken-json'],['未来版本',JSON.stringify({app:'guanwu-physics',version:99,notes:[]})]])test(label+'本机记录在启动、参数操作、导入和pagehide后保持原raw，暂存记录可导出',async()=>{
 const app=await boot(raw),{context,document,store,events,DOM}=app,api=context.GuanWu;
 app.flush();assert.equal(store.get('guanwu.physics.v1'),raw);assert.equal(api.getState().storage,false);assert.equal(document.getElementById('storage-warning').hidden,false);assert.match(document.getElementById('storage-warning').textContent,/导出/);
 api.setMode('research');api.setParam('height',5);api.setTime(.5);app.flush();assert.equal(store.get('guanwu.physics.v1'),raw);
 const note={id:'new-memory-note',title:'本次暂存',guess:'',discovery:'新的实验观察',question:'',created:'2026-11-04T00:00:00.000Z',scene:{lab:'jet',params:context.Physics.defaults('jet'),time:0,baseline:null,compare:false,mode:'family'}};
 await api.importFile({size:100,text:async()=>JSON.stringify({app:'guanwu-physics',version:1,notes:[note]})});app.flush();assert.equal(api.getNotes().length,1);assert.equal(api.backup().notes[0].discovery,note.discovery);
 events.dispatchEvent(new DOM.Event('pagehide'));app.flush();assert.equal(store.get('guanwu.physics.v1'),raw);
 api.showPage('notes');document.getElementById('export-backup').dispatchEvent(new DOM.Event('click',{bubbles:true}));assert.equal(app.downloads.length,1);assert.equal(JSON.parse(await app.downloads[0].text()).notes[0].discovery,note.discovery);app.flush();assert.equal(store.get('guanwu.physics.v1'),raw);
});

test('正常旧版物理记录沿用同一个key，参数操作仍可保存',async()=>{
 const app=await boot(JSON.stringify({app:'guanwu-physics',version:1,notes:[]})),api=app.context.GuanWu;assert.equal(api.getState().storage,true);api.setMode('research');api.setParam('height',5);app.flush();const raw=JSON.parse(app.store.get('guanwu.physics.v1'));assert.equal(raw.app,'guanwu-physics');assert.equal(raw.version,1);assert.equal(raw.scene.params.height,5);assert.equal(raw.scene.mode,'research');assert.deepEqual([...app.store.keys()],['guanwu.physics.v1']);
});
