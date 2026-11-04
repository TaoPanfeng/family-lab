'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../projects/history/node_modules/jsdom');
const C=require('../shared/core.js'),root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');

// Real DOM focus and event dispatch, with storage/downloads kept in memory.
// This harness does not claim layout, trusted keyboard/touch or browser coverage.
function fixture(t,{width=1440,raw=null,quota=false,key}={}){
 const d=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://family-lab.test/projects/biology/index.html',runScripts:'outside-only',pretendToBeVisual:true}),w=d.window;
 const values=new Map(raw===null?[]:[[key,raw]]),writes=[],downloads=[],blobs=new Map();let nextBlob=0;
 Object.defineProperty(w,'innerWidth',{configurable:true,value:width});
 w.matchMedia=query=>({matches:/prefers-reduced-motion/.test(query)?false:/max-width:\s*(\d+)/.test(query)?width<=Number(query.match(/max-width:\s*(\d+)/)[1]):false,addEventListener(){},removeEventListener(){}});
 w.requestAnimationFrame=()=>0;w.cancelAnimationFrame=()=>{};w.structuredClone=structuredClone;w.Blob=Blob;
 w.HTMLElement.prototype.scrollIntoView=function(){};w.HTMLCanvasElement.prototype.getContext=()=>({});
 Object.defineProperty(w,'localStorage',{configurable:true,value:{getItem:k=>values.get(k)??null,setItem(k,v){writes.push([k,String(v)]);if(quota)throw new Error('QuotaExceededError');values.set(k,String(v));}}});
 w.URL.createObjectURL=blob=>{const url='blob:family-lab-audit/'+(++nextBlob);blobs.set(url,blob);return url;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){downloads.push({name:this.download,blob:blobs.get(this.href)});};
 w.LabTouch={bind:()=>({cancel(){},dispose(){}})};
 t.after(()=>w.close());return {w,doc:w.document,values,writes,downloads};
}
const lesson=id=>({id,title:id==='one'?'第一课：细胞':'第二课：遗传',intro:'先观察，再改变条件。',child:'观察眼前的变化。',adult:'比较条件和观察结果。',question:'你观察到了什么？',correct:0,answers:['先比较再判断','直接猜答案'],feedback:'先比较条件。',controls:[],sources:[],steps:['观察','改变','解释'],home:'在家观察。',work:'理解模型。',trap:'不能以偏概全。',limits:'这是教学示意。'});
function shell(t,options={}){
 const f=fixture(t,{...options,key:'family-lab.biology.learning.1'}),w=f.w;
 w.eval(read('shared/core.js'));w.Museum={id:'biology',name:'生物',en:'BIOLOGY',lessons:['one','two'].map(lesson),render:()=>({})};
 w.eval(read('shared/shell.js'));return f;
}
function workshop(t,options={}){
 const f=fixture(t,{...options,key:'family-lab.workshop.computing.1'}),w=f.w;let mounted;
 w.eval(read('shared/workshop/models.js'));w.Workshop={id:'computing',name:'编程',en:'COMPUTING',slogan:'先动手，再思考。',lessons:['one','two'].map(lesson),mount(id,ctx){mounted=ctx;return {};}};
 w.eval(read('shared/workshop/core.js'));return {...f,api:()=>mounted};
}
function scene3d(t){
 const f=fixture(t),w=f.w,T=require('../projects/astronomy/vendor/three.r140.min.js'),renders=[],observers=[];let gestureDisposed=false;
 f.doc.body.innerHTML='<div id="visual" data-touch-mode="model"><canvas id="canvas"></canvas></div>';
 const container=f.doc.querySelector('#visual');container.getBoundingClientRect=()=>({width:640,height:400});
 w.eval(read('shared/core.js'));w.THREE={...T,WebGLRenderer:class {
  constructor(){this.domElement=f.doc.createElement('canvas');this.disposed=false;this.contextLost=false;}
  setPixelRatio(){}setClearColor(){}setSize(){}render(scene,camera){renders.push({position:camera.position.toArray(),quaternion:camera.quaternion.toArray()});}
  dispose(){this.disposed=true;}forceContextLoss(){this.contextLost=true;}
 }};
 w.ResizeObserver=class {constructor(){this.disconnected=false;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 w.LabTouch={bind:()=>({dispose(){gestureDisposed=true;}})};w.eval(read('shared/scene3d.js'));
 const view=w.Lab3D.make(container,{distance:4,yaw:.6,pitch:.25}),canvas=view.renderer.domElement;
 t.after(()=>{if(!view.renderer.disposed)view.dispose();});return {...f,T,container,view,canvas,renders,observers,gestureDisposed:()=>gestureDisposed};
}
function click(f,selector){const el=f.doc.querySelector(selector);assert(el,selector+' exists');el.focus();el.click();return el;}
function input(f,selector,value){const el=f.doc.querySelector(selector);assert(el,selector+' exists');el.value=value;el.dispatchEvent(new f.w.Event('input',{bubbles:true}));return el;}
async function download(f,selector){const before=f.downloads.length;click(f,selector);await Promise.resolve();assert.equal(f.downloads.length,before+1,'one download is created');const item=f.downloads.at(-1);assert(item.blob,'download refers to a generated Blob');return {...item,text:await item.blob.text()};}
async function importJSON(f,value){const el=f.doc.querySelector('#import'),text=JSON.stringify(value);Object.defineProperty(el,'files',{configurable:true,value:[{size:Buffer.byteLength(text),text:async()=>text}]});el.dispatchEvent(new f.w.Event('change',{bubbles:true}));await new Promise(resolve=>setImmediate(resolve));}
const note=i=>({topic:'观察 '+i,text:'发现 '+i,date:'2026-11-04T00:00:'+String(i).padStart(2,'0')+'Z'});
const backup=(extra={})=>({app:'family-lab-learning',version:1,subject:'biology',mode:'child',favorites:['one'],solved:['two'],notes:[note(1)],...extra});

test('shell drafts belong to their lesson through switching, reset and saving',async t=>{
 const f=shell(t);
 input(f,'#note','第一课还没有保存的观察');click(f,'[data-lesson="two"]');assert.equal(f.doc.querySelector('#note').value,'');
 input(f,'#note','第二课自己的观察');click(f,'[data-lesson="one"]');assert.equal(f.doc.querySelector('#note').value,'第一课还没有保存的观察');
 click(f,'#reset');assert.equal(f.doc.querySelector('#note').value,'第一课还没有保存的观察','reset keeps this lesson draft');
 click(f,'#save-note');assert.equal(f.doc.querySelector('#note').value,'','saving clears only the current draft');
 click(f,'[data-lesson="two"]');assert.equal(f.doc.querySelector('#note').value,'第二课自己的观察');
 click(f,'[data-lesson="one"]');assert.equal(f.doc.querySelector('#note').value,'');
 const saved=JSON.parse((await download(f,'#export')).text);assert.equal(saved.notes.length,1);assert.equal(saved.notes[0].text,'第一课还没有保存的观察');assert.match(saved.notes[0].topic,/第一课/);
});
test('shell full export and DOM import retain all learning fields and reject foreign records atomically',async t=>{
 const f=shell(t);click(f,'#mode');click(f,'#favorite');click(f,'[data-answer="0"]');input(f,'#note','已经保存的观察');click(f,'#save-note');
 const original=JSON.parse((await download(f,'#export')).text);assert.equal(original.app,'family-lab-learning');assert.equal(original.version,1);assert.equal(original.subject,'biology');assert.equal(original.mode,'adult');assert.deepEqual(original.favorites,['one']);assert.deepEqual(original.solved,['one']);assert.equal(original.notes.length,1);
 await importJSON(f,backup({favorites:['two'],solved:['two'],notes:[original.notes[0],note(2)]}));
 const merged=JSON.parse((await download(f,'#export')).text);assert.equal(merged.mode,'adult');assert.deepEqual(merged.favorites,['one','two']);assert.deepEqual(merged.solved,['one','two']);assert.equal(merged.notes.length,2);
 await importJSON(f,backup({subject:'cosmos'}));assert.deepEqual(JSON.parse((await download(f,'#export')).text),merged);
 await importJSON(f,{version:1,notes:[note(3)]});const legacy=JSON.parse((await download(f,'#export')).text);assert.equal(legacy.notes.length,3);assert.deepEqual(legacy.favorites,merged.favorites);assert.deepEqual(legacy.solved,merged.solved);assert.equal(legacy.mode,'adult');
});
test('shell page exit stops playback without resuming on pageshow',t=>{
 const f=shell(t);click(f,'#play');assert.equal(f.w.LabTest.getState().playing,true);f.w.dispatchEvent(new f.w.Event('pagehide'));assert.equal(f.w.LabTest.getState().playing,false);assert.equal(f.doc.querySelector('#play').getAttribute('aria-pressed'),'false');f.w.dispatchEvent(new f.w.Event('pageshow'));assert.equal(f.w.LabTest.getState().playing,false);
});

for(const [name,make]of [['shell',shell],['workshop',workshop]]){
 test(name+' lesson navigation retains a connected desktop button focus',t=>{
  const f=make(t);click(f,'[data-lesson="two"]');assert.equal(f.doc.activeElement.dataset.lesson,'two');assert(f.doc.activeElement.isConnected);
  click(f,'[data-lesson="one"]');assert.equal(f.doc.activeElement.dataset.lesson,'one');
 });
 test(name+' mobile lesson selection focuses the visible main reading start',t=>{
  const f=make(t,{width:390});const toggle=f.doc.querySelector('#nav-toggle');if(toggle)click(f,'#nav-toggle');click(f,'[data-lesson="two"]');
  assert.equal(f.doc.activeElement.id,'main');assert.equal(f.doc.activeElement.getAttribute('tabindex'),'-1');assert(!f.doc.activeElement.closest('[hidden]'));
 });
 test(name+' empty search can be cleared with focus returned to search',t=>{
  const f=make(t);input(f,'#search','不会出现的关键词');assert.equal(f.doc.querySelectorAll('[data-lesson]').length,0);assert.equal(f.doc.querySelector('#empty').hidden,false);
  const clear=f.doc.querySelector('#clear-search');assert(clear,'an explicit clear search button exists');assert(!clear.hidden&&!clear.closest('[hidden]'));
  click(f,'#clear-search');assert.equal(f.doc.querySelector('#search').value,'');assert.equal(f.doc.querySelectorAll('[data-lesson]').length,2);assert.equal(f.doc.activeElement.id,'search');
 });
}

test('workshop quota failure keeps work in memory and never announces browser save success',async t=>{
 const f=workshop(t,{quota:true}),pixels=Array(36).fill(1);f.api().saveWork('pixels',pixels);
 assert.doesNotMatch(f.doc.querySelector('#status').textContent,/已保存在这个浏览器/);assert.match(f.doc.querySelector('#status').textContent,/内存|暂存|未能|无法|不可用|导出/);
 const saved=JSON.parse((await download(f,'#export')).text);assert.deepEqual(saved.works.pixels,pixels);assert.equal(f.values.size,0);
});

for(const [name,make,key,bad]of [
 ['shell',shell,'family-lab.biology.learning.1','{"mode":"child","favorites":[],"solved":[],"notes":[{"topic":"旧观察","text":123,"date":"2026"}]}'],
 ['workshop',workshop,'family-lab.workshop.computing.1','{"app":"family-lab-workshop","version":1,"subject":"computing","favorites":[],"notes":{"one":123},"works":{}}']
])for(const [kind,raw]of [['unparseable','{"important":"原始记录",'],['invalid fields',bad],['empty string','']]){
 test(name+' preserves '+kind+' local records and exports exact original text',async t=>{
  const f=make(t,{raw});assert.equal(f.values.get(key),raw);assert.equal(f.writes.length,0,'loading a bad record must not overwrite it');
  const original=f.doc.querySelector('#export-original');assert(original&&!original.hidden&&!original.closest('[hidden]'),'original-record export is available');
  const originalFile=await download(f,'#export-original');assert.match(originalFile.name,/\.txt$/i);assert.equal(originalFile.text,raw);
  input(f,'#note','本页新观察');click(f,'#save-note');assert.equal(f.values.get(key),raw);assert.equal(f.writes.length,0,'new in-memory records must not overwrite unread old data');
  const current=JSON.parse((await download(f,'#export')).text);assert(current.notes,'current in-memory records can still be exported');
  if(name==='shell')assert(current.notes.some(n=>n.text==='本页新观察'));else assert.equal(current.notes.one,'本页新观察');
  assert.equal(f.values.get(key),raw);
 });
}

test('complete learning backup validates its museum, identifiers, fields and literal notes',()=>{
 assert.equal(typeof C.validateLearningBackup,'function');const input=backup({favorites:['one','one'],notes:[{...note(1),text:'<script>不执行</script>',private:'discard'}],private:'discard'}),before=structuredClone(input);
 const clean=C.validateLearningBackup(input,'biology',['one','two']);assert.deepEqual(clean.favorites,['one']);assert.deepEqual(clean.solved,['two']);assert.equal(clean.mode,'child');assert.equal(clean.notes[0].text,'<script>不执行</script>');assert.equal(clean.notes[0].private,undefined);assert.equal(clean.private,undefined);assert.deepEqual(input,before);
 clean.notes[0].text='另一个值';assert.deepEqual(input,before,'validation does not share mutable notes with its input');
 for(const invalid of [null,{},backup({app:'other'}),backup({version:2}),backup({subject:'cosmos'}),backup({favorites:['unknown']}),backup({solved:['__proto__']}),backup({favorites:'one'}),backup({solved:null}),backup({notes:[{...note(1),text:123}]}),backup({notes:[{...note(1),text:'a'.repeat(2001)}]}),backup({notes:Array.from({length:101},(_,i)=>note(i))})])assert.throws(()=>C.validateLearningBackup(invalid,'biology',['one','two']));
 assert.equal(C.validateLearningBackup(backup({notes:Array.from({length:100},(_,i)=>note(i))}),'biology',['one','two']).notes.length,100);
});
test('legacy notes-only backup remains importable without foreign-app fallback',()=>{
 const legacy={version:1,notes:[note(1)]},before=structuredClone(legacy),clean=C.validateLearningBackup(legacy,'biology',['one','two']);assert.deepEqual(clean.notes,legacy.notes);assert.deepEqual(clean.favorites,[]);assert.deepEqual(clean.solved,[]);assert.deepEqual(legacy,before);
 assert.throws(()=>C.validateLearningBackup({app:'foreign',version:1,notes:[note(1)]},'biology',['one','two']));
});
test('learning merge unions progress, deduplicates exact notes and keeps current mode',()=>{
 assert.equal(typeof C.mergeLearningBackup,'function');const a=backup({mode:'adult',favorites:['one'],solved:[],notes:[note(1)]}),b=backup({mode:'child',favorites:['two'],solved:['two'],notes:[note(1),note(2)]}),beforeA=structuredClone(a),beforeB=structuredClone(b);
 const result=C.mergeLearningBackup(a,b);assert.equal(result.mode,'adult');assert.deepEqual(result.favorites,['one','two']);assert.deepEqual(result.solved,['two']);assert.deepEqual(result.notes,[note(1),note(2)]);assert.deepEqual(a,beforeA);assert.deepEqual(b,beforeB);
 result.notes[0].text='修改合并结果';assert.deepEqual(a,beforeA,'merged notes do not mutate the old record');assert.deepEqual(b,beforeB);
});
test('learning merge rejects more than 100 combined notes atomically, while duplicates do not consume slots',()=>{
 const a=backup({notes:Array.from({length:99},(_,i)=>note(i))}),b=backup({notes:[note(99),note(100)]}),beforeA=structuredClone(a),beforeB=structuredClone(b);
 assert.throws(()=>C.mergeLearningBackup(a,b));assert.deepEqual(a,beforeA);assert.deepEqual(b,beforeB);
 const exact=C.mergeLearningBackup(a,backup({notes:[note(98),note(99)]}));assert.equal(exact.notes.length,100);assert.deepEqual(a,beforeA);
});
test('learning merge also removes duplicates already present in the current record before applying the limit',()=>{
 const current=backup({notes:[...Array.from({length:99},(_,i)=>note(i)),note(0)]}),incoming=backup({notes:[note(99),note(99)]}),beforeCurrent=structuredClone(current),beforeIncoming=structuredClone(incoming);
 const merged=C.mergeLearningBackup(current,incoming);assert.equal(merged.notes.length,100);assert.deepEqual(merged.notes,Array.from({length:100},(_,i)=>note(i)));assert.deepEqual(current,beforeCurrent);assert.deepEqual(incoming,beforeIncoming);
});
test('3D click directions change a real Three camera like keyboard controls, clamp pitch and clean up on disposal',t=>{
 const f=scene3d(t),{view,canvas}=f;assert(view.scene instanceof f.T.Scene);assert(view.camera instanceof f.T.PerspectiveCamera);assert.equal(f.doc.querySelectorAll('[data-camera-turn]').length,4);
 const menu=f.doc.querySelector('.camera-directions');assert.equal(menu.tagName,'DETAILS');click(f,'.camera-directions summary');assert.equal(menu.open,true);
 for(const [direction,key]of [['left','ArrowLeft'],['right','ArrowRight'],['up','ArrowUp'],['down','ArrowDown']]){
  view.reset();const original=view.camera.position.toArray(),before=view.state();click(f,'[data-camera-turn="'+direction+'"]');const clicked=view.state(),position=view.camera.position.toArray();assert.notDeepEqual(position,original,direction+' changes camera coordinates');
  assert(Math.abs(position[0]-clicked.radius*Math.cos(clicked.pitch)*Math.sin(clicked.yaw))<1e-12);assert(Math.abs(position[1]-clicked.radius*Math.sin(clicked.pitch))<1e-12);assert(Math.abs(position[2]-clicked.radius*Math.cos(clicked.pitch)*Math.cos(clicked.yaw))<1e-12);
  if(direction==='left')assert(clicked.yaw<before.yaw);if(direction==='right')assert(clicked.yaw>before.yaw);if(direction==='up')assert(clicked.pitch>before.pitch);if(direction==='down')assert(clicked.pitch<before.pitch);
  view.reset();canvas.focus();for(let i=0;i<2;i++){const e=new f.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});canvas.dispatchEvent(e);assert.equal(e.defaultPrevented,true);}
  assert(Math.abs(view.state().yaw-clicked.yaw)<1e-12);assert(Math.abs(view.state().pitch-clicked.pitch)<1e-12);assert(view.camera.position.distanceTo(new f.T.Vector3(...position))<1e-12,direction+' click and keyboard yield the same view');
 }
 for(let i=0;i<30;i++)click(f,'[data-camera-turn="up"]');assert.equal(view.state().pitch,1.35);for(let i=0;i<60;i++)click(f,'[data-camera-turn="down"]');assert.equal(view.state().pitch,-1.35);assert(view.camera.position.toArray().every(Number.isFinite));
 view.dispose();assert.equal(f.doc.querySelector('.camera-directions'),null);assert.equal(f.doc.querySelector('.three-canvas'),null);assert.equal(f.doc.querySelector('#canvas').style.display,'block');assert.equal(f.gestureDisposed(),true);assert(f.observers.every(o=>o.disconnected));assert.equal(view.renderer.disposed,true);assert.equal(view.renderer.contextLost,true);
 const state=view.state(),e=new f.w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true});canvas.dispatchEvent(e);assert.deepEqual(view.state(),state);assert.equal(e.defaultPrevented,false);
});
test('3D reading-mode wheel stays native while model-mode wheel changes the real camera distance',t=>{
 const f=scene3d(t),{view,canvas}=f,send=delta=>{const e=new f.w.WheelEvent('wheel',{deltaY:delta,bubbles:true,cancelable:true});canvas.dispatchEvent(e);return e;};
 const start=view.state().radius;assert.equal(send(120).defaultPrevented,true);assert(view.state().radius>start);assert(Math.abs(view.camera.position.length()-view.state().radius)<1e-12);
 f.container.dataset.touchMode='scroll';const state=view.state(),count=f.renders.length;assert.equal(send(-120).defaultPrevented,false);assert.deepEqual(view.state(),state);assert.equal(f.renders.length,count,'reading-mode wheel does not redraw or zoom the model');
 f.container.dataset.touchMode='model';assert.equal(send(-120).defaultPrevented,true);assert(Math.abs(view.state().radius-start)<1e-12);assert(Math.abs(view.camera.position.length()-start)<1e-12);
 view.dispose();const stopped=view.state();assert.equal(send(120).defaultPrevented,false);assert.deepEqual(view.state(),stopped);
});
