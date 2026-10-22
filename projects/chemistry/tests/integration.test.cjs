'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createApp}=require('./dom-harness.cjs');
const lab=require('../dist/lab.js');
const data=require('../dist/data.js');

const labButton=(action,extra='')=>`[data-lab-action="${action}"]${extra}`;
function setup(a,e,{ports=false}={}){
  for(const id of e.gear)a.click(labButton('place',`[data-id="${id}"]`));
  for(const [from,to] of e.links){
    if(ports){a.click(labButton('port',`[data-id="${from}"]`));a.click(labButton('port',`[data-id="${to}"]`));}
    else{a.input('[data-lab-endpoint="from"]',from,'change');a.input('[data-lab-endpoint="to"]',to,'change');a.click(labButton('connect'));}
  }
  for(const r of e.reagents)a.click(labButton('add',`[data-material="${r.id}"][data-target="${r.target}"]`));
}
function operate(a,e){a.click(labButton('predict','[data-index="0"]'));for(const op of e.operations)a.click(labButton('operate',`[data-operation="${op.id}"]`));}
function instance(a){return a.el('#main-content').chemLabInstance;}

for(const mode of ['kids','advanced'])for(const route of ['home','lab','periodic','atom','stoich','decay','separation','ions','life','quests','notebook','sources']){
  test(`完整应用挂载：${mode}/${route}`,async()=>{const a=await createApp({mode,route});assert.equal(a.document.querySelector('.app-error'),null,JSON.stringify(a.errors));assert.ok(a.text().length>150);assert.deepEqual(a.errors,[]);a.close();});
}
for(const mode of ['kids','advanced'])for(const [index,e]of lab.experiments.entries()){
  test(`实验全流程 DOM：${mode}/${e.id}`,async()=>{
    const a=await createApp({mode,route:'lab?experiment='+e.id});
    assert.equal(a.el('[data-lab-recipe]').value,e.id);
    setup(a,e,{ports:index%2===0});
    assert.equal(a.window.ChemLab.validateSetup(instance(a).getState()).ok,true);
    operate(a,e);
    assert.equal(instance(a).getState().phase,'running',a.el('.lab-feedback').textContent);
    a.click(labButton('pause'));const elapsed=instance(a).getState().elapsed;a.tick(1000);assert.equal(instance(a).getState().elapsed,elapsed,'Paused experiment clock must not advance');a.click(labButton('pause'));
    a.input('[data-lab-control="speed"]',4,'change');a.tick(30000);
    assert.equal(instance(a).getState().phase,'done',a.el('.lab-feedback').textContent);
    assert.match(a.el('.lab-result').textContent,/观察完成/);
    assert.equal(a.el('.lab-observation-meter').getAttribute('aria-valuenow'),'100');
    assert.ok(!/NaN|undefined|Infinity/.test(a.el('.lab-result').textContent));
    const saved=JSON.parse(a.storage.get('wanwu-chemistry-v1'));assert.equal(saved.completed.filter(x=>x.id==='lab-'+e.id).length,1);
    a.click(labButton('save-note'));assert.match(JSON.parse(a.storage.get('wanwu-chemistry-v1')).notes[0].body,new RegExp(e.title));
    a.click(labButton('restart'));assert.equal(instance(a).getState().phase,'setup');assert.equal(Object.keys(instance(a).getState().gear).length,e.gear.length);
    a.click(labButton('reset'));assert.equal(Object.keys(instance(a).getState().gear).length,0);assert.equal(a.all('[data-draggable-gear]').length,0);
    assert.deepEqual(a.errors,[]);a.close();
  });
}
test('实验错误不推进：漏装置、错连接、漏材料、操作越序',async()=>{const e=lab.experiments[0],a=await createApp({route:'lab?experiment='+e.id});a.click(labButton('operate',`[data-operation="${e.operations[0].id}"]`));assert.equal(instance(a).getState().performed.length,0);assert.match(a.el('.lab-feedback').textContent,/先|请|还/);for(const id of e.gear)a.click(labButton('place',`[data-id="${id}"]`));const port=e.links[0][0];a.input('[data-lab-endpoint="from"]',port,'change');a.input('[data-lab-endpoint="to"]',port,'change');a.click(labButton('connect'));assert.equal(instance(a).getState().connections.length,0);for(const [from,to]of e.links){a.input('[data-lab-endpoint="from"]',from,'change');a.input('[data-lab-endpoint="to"]',to,'change');a.click(labButton('connect'));}a.click(labButton('predict','[data-index="0"]'));a.click(labButton('operate',`[data-operation="${e.operations[0].id}"]`));assert.equal(instance(a).getState().performed.length,0);for(const r of e.reagents)a.click(labButton('add',`[data-material="${r.id}"][data-target="${r.target}"]`));if(e.operations.length>1){a.click(labButton('operate',`[data-operation="${e.operations.at(-1).id}"]`));assert.equal(instance(a).getState().performed.length,0);}assert.deepEqual(a.errors,[]);a.close();});
test('实验中途切换儿童/进阶模式保留器材与材料',async()=>{const e=lab.experiments[0],a=await createApp({route:'lab?experiment='+e.id});setup(a,e);const before=JSON.stringify(instance(a).getState().contents);a.click('.mode-switch [data-mode="advanced"]');assert.equal(JSON.stringify(instance(a).getState().contents),before);assert.equal(Object.keys(instance(a).getState().gear).length,e.gear.length);a.close();});
test('离开实验路由取消动画，返回后从保留状态继续',async()=>{const e=lab.experiments[0],a=await createApp({route:'lab?experiment='+e.id});setup(a,e);operate(a,e);a.tick(400);a.go('home');a.tick(30000);assert.equal(JSON.parse(a.storage.get('wanwu-chemistry-v1')).completed.length,0);a.go('lab?experiment='+e.id);assert.equal(instance(a).getState().phase,'running');a.tick(30000);assert.equal(instance(a).getState().phase,'done');a.close();});
test('器材键盘位置调整与清空后重新选择配方',async()=>{const a=await createApp({route:'lab'}),e=lab.experiments[0];a.click(labButton('place',`[data-id="${e.gear[0]}"]`));const before=instance(a).getState().gear[e.gear[0]].x;a.click(labButton('move','[data-direction="right"]'));assert.equal(instance(a).getState().gear[e.gear[0]].x,before+24);for(const e2 of lab.experiments){a.input('[data-lab-recipe]',e2.id,'change');assert.equal(instance(a).getState().experimentId,e2.id);assert.equal(Object.keys(instance(a).getState().gear).length,0);}a.close();});
test('白磷只显示模型卡与观察盒，页面没有数字投料或现实点火操作',async()=>{const a=await createApp({mode:'advanced',route:'lab?experiment=phosphorus'}),e=lab.experiments.find(x=>x.id==='phosphorus');for(const id of e.gear)a.click(labButton('place',`[data-id="${id}"]`));assert.equal(a.all('[data-lab-dose]').length,0);assert.match(a.text(),/封闭|模型卡/);assert.match(a.text(),/不提供现实操作/);a.close();});
test('118张元素卡在两种模式逐一展开，资料和属性均存在',async()=>{for(const mode of ['kids','advanced']){const a=await createApp({mode,route:'periodic'});assert.equal(a.all('[data-element]').length,118);for(const e of data.elements){a.click(`[data-element="${e.number}"]`);const detail=a.el('#cx-element-detail').textContent;assert.ok(detail.includes(e.symbol));assert.ok(detail.includes(e.name));assert.ok(detail.includes('化学性格'));assert.ok(!/undefined|NaN/.test(detail));}assert.deepEqual(a.errors,[]);a.close();}});
test('应用内每次切换路由都会卸载旧事件，不重复保存或推进',async()=>{const a=await createApp();for(let pass=0;pass<3;pass++)for(const route of ['lab','atom','decay','separation','ions','life','periodic','home'])a.go(route);a.go('notebook');a.input('#note-body','只保存一次');a.el('#note-form').dispatchEvent(new a.window.Event('submit',{bubbles:true,cancelable:true}));assert.equal(JSON.parse(a.storage.get('wanwu-chemistry-v1')).notes.length,1);assert.deepEqual(a.errors,[]);a.close();});
