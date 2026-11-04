'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../projects/history/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function dom(t,html='<div id="bench"></div>'){
 const d=new JSDOM(html,{url:'https://family-lab.test/projects/math/index.html',runScripts:'outside-only',pretendToBeVisual:true});
 d.window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});d.window.structuredClone=structuredClone;
 t.after(()=>d.window.close());return d;
}
function workshop(t,subject,id){
 const d=dom(t),w=d.window;w.eval(read('shared/workshop/models.js'));w.eval(read('projects/'+subject+'/app.js'));
 const host=w.document.querySelector('#bench'),messages=[];
 const view=w.Workshop.mount(id,{root:host,esc:v=>String(v),loadWork:()=>undefined,saveWork(){},message:x=>messages.push(x)});
 t.after(()=>view.dispose?.());return {w,host,view,messages};
}
function click(host,selector){const el=host.querySelector(selector);assert(el,selector);el.focus();el.click();}
function math(t,raw,setup){const html=read('projects/math/index.html'),d=dom(t,html),w=d.window;
 if(raw!==undefined)w.localStorage.setItem('family-lab.math.learning.v1',raw);setup?.(w);
 for(const [,src]of html.matchAll(/<script src="([^"]+)"><\/script>/g))w.eval(fs.readFileSync(path.resolve(root,'projects/math',src),'utf8'));
 return {w,host:w.document};
}
test('English choosing words keeps keyboard flow and wrong-order feedback identifies the actual structure',t=>{
 const {w,host,view}=workshop(t,'english','sentence');
 for(let c=0;c<4;c++){
  const lesson=w.WorkshopModels.sentences[c];
  click(host,'[data-word="0"]');assert(w.document.activeElement.matches('#bank button:not(:disabled)'),'after choosing a word, a remaining word receives focus');
  click(host,'[data-word="2"]');click(host,'[data-word="1"]');assert.equal(w.document.activeElement.id,'check');
  click(host,'#check');const feedback=host.querySelector('#feedback').textContent;
  assert(feedback.includes('第2块'),feedback);assert(feedback.includes(lesson.roles[1]),feedback);
  assert(feedback.includes(lesson.words[1]),feedback);assert.equal(view.state().index,c);
  click(host,'#clear');for(let i=0;i<3;i++)click(host,'[data-word="'+i+'"]');click(host,'#check');
  assert.match(host.querySelector('#feedback').textContent,/对了/);click(host,'#next-case');
 }
});
test('English wrong position explains the selected relation and the observed picture',t=>{
 const {host}=workshop(t,'english','where');click(host,'#quiz');click(host,'[data-answer="0"]');
 const feedback=host.querySelector('#feedback').textContent;assert.match(feedback,/in/);assert.match(feedback,/里面/);assert.match(feedback,/顶部|接触/);
});
test('pixel painting and music composition keep the same cell focused after redraw',t=>{
 for(const [subject,id,selector,key]of [['computing','pixels','[data-pixel="9"]','pixel'],['music','rhythm','[data-cell="1,3"]','cell'],['music','melody','[data-cell="4,2"]','cell']]){
  const {w,host}=workshop(t,subject,id),value=host.querySelector(selector).dataset[key];click(host,selector);
  assert.equal(w.document.activeElement.dataset[key],value,subject+' '+id);assert.equal(w.document.activeElement.getAttribute('aria-pressed'),'true');
  w.document.activeElement.click();assert.equal(w.document.activeElement.dataset[key],value);assert.equal(w.document.activeElement.getAttribute('aria-pressed'),'false');
 }
});
test('math counting and binary SVG controls keep focus after keyboard-style activation',t=>{
 const {w,host}=math(t);for(const [id,selector,key]of [['counting','[data-count="2"]','count'],['binary','[data-bit="2"]','bit'],['fractions','[data-part="2"]','part']]){
  w.MathTest.select(id);const el=host.querySelector(selector);assert(el,id);el.focus();const value=el.dataset[key];
  el.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
  assert.equal(w.document.activeElement.dataset[key],value,id+' control stays focused');
 }
});
test('math page exit cancels automatic proof advancement',t=>{
 const {w,host}=math(t);w.MathTest.select('pythagoras');const running=new Map();let next=0;
 w.setInterval=fn=>{running.set(++next,fn);return next;};w.clearInterval=id=>running.delete(id);
 click(host,'#proofPlay');assert.equal(running.size,1);w.dispatchEvent(new w.Event('pagehide'));
 assert.equal(running.size,0);assert.equal(host.querySelector('#proofPlay').getAttribute('aria-pressed'),'false');
});
test('cosine-law side labels follow the actual triangle at narrow and obtuse angles',t=>{
 const {w,host}=math(t);w.MathTest.select('sine-cosine-law');const slider=host.querySelector('[data-lesson-control="n"]');
 for(const angle of [10,60,90,170]){
  slider.value=angle;slider.dispatchEvent(new w.Event('input',{bubbles:true}));
  const picture=host.querySelector('.focused-picture'),points=picture.querySelector('polygon').getAttribute('points').trim().split(/\s+/).map(p=>p.split(',').map(Number));
  const [A,B,C]=points,angleAtA=Math.acos(((B[0]-A[0])*(C[0]-A[0])+(B[1]-A[1])*(C[1]-A[1]))/(Math.hypot(B[0]-A[0],B[1]-A[1])*Math.hypot(C[0]-A[0],C[1]-A[1])))*180/Math.PI;
  assert(Math.abs(angleAtA-angle)<1e-7);assert(picture.querySelector('[data-angle]'),'the included angle has a visible arc');
  for(const [name,[P,Q]]of Object.entries({a:[A,B],b:[A,C],c:[B,C]})){
   const label=picture.querySelector('[data-edge="'+name+'"]');assert(label,'side '+name+' has an attached label');
   const distance=Math.hypot(+label.getAttribute('x')-(P[0]+Q[0])/2,+label.getAttribute('y')-(P[1]+Q[1])/2);assert(distance<=35,angle+'° side '+name+' label distance '+distance);
  }
 }
});
test('math unsaved notes survive topic changes and experiment reset while exports contain saved notes only',t=>{
 const {w,host}=math(t),note=host.querySelector('#note');
 w.MathTest.select('counting');note.value='数数的未保存发现';note.dispatchEvent(new w.Event('input',{bubbles:true}));
 w.MathTest.select('addition');note.value='加法的未保存发现';note.dispatchEvent(new w.Event('input',{bubbles:true}));
 w.MathTest.select('counting');assert.equal(note.value,'数数的未保存发现');
 click(host,'#reset');assert.equal(note.value,'数数的未保存发现');assert.deepEqual(JSON.parse(w.MathTest.backup()).notes,{});
 click(host,'#saveNote');assert.equal(JSON.parse(w.MathTest.backup()).notes.counting,'数数的未保存发现');
 w.MathTest.select('addition');assert.equal(note.value,'加法的未保存发现');w.MathTest.select('counting');assert.equal(note.value,'数数的未保存发现');
 const saved=w.MathTest.backup();assert.throws(()=>w.MathTest.importText('{broken'));assert.equal(w.MathTest.backup(),saved);assert.equal(note.value,'数数的未保存发现');
 w.MathTest.importText(JSON.stringify({version:1,notes:{counting:'外部同名笔记',addition:'外部已保存笔记'}}));
 assert.equal(JSON.parse(w.MathTest.backup()).notes.counting,'数数的未保存发现');w.MathTest.select('addition');assert.equal(note.value,'加法的未保存发现');
});
test('silent music playback redraws without moving focus from the transport into the matrix',t=>{
 const {w,host,view}=workshop(t,'music','rhythm');let frame=null,now=1000;
 w.performance.now=()=>now;w.requestAnimationFrame=fn=>{frame=fn;return 1;};w.cancelAnimationFrame=()=>{};
 click(host,'#play');assert.equal(w.document.activeElement.id,'play');assert.equal(view.state().audio.enabled,false);
 now=1100;frame();assert.equal(view.state().shown,0);assert.equal(w.document.activeElement.id,'play');
 host.querySelector('[data-cell="0,1"]').focus();now=1600;frame();assert.equal(w.document.activeElement.dataset.cell,'0,1');
 view.stop();assert.equal(view.state().playing,false);assert.equal(view.state().audio.nodes,0);
});
test('music shell stops scheduled sound on backgrounding, exit and rapid play-pause',async t=>{
 const d=dom(t),w=d.window;let context;
 const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}});
 w.AudioContext=class {
  constructor(){context=this;this.state='suspended';this.currentTime=0;this.destination={};}
  createGain(){return {gain:param(),connect(){},disconnect(){}};}
  createAnalyser(){return {fftSize:2048,connect(){},getFloatTimeDomainData(data){data.fill(0);}};}
  createOscillator(){return {frequency:param(),connect(){},disconnect(){},start(){},stop(at){if(at===undefined)this.onended?.();}};}
  async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
 };
 w.eval(read('shared/workshop/models.js'));w.eval(read('projects/music/app.js'));w.eval(read('shared/workshop/core.js'));
 click(w.document,'[data-lesson="rhythm"]');assert.equal(w.WorkshopTest.state().audio.enabled,false);
 await w.document.querySelector('#audio').onclick();assert.equal(w.WorkshopTest.state().audio.enabled,true);
 for(let i=0;i<3;i++){click(w.document,'#play');assert(w.WorkshopTest.state().audio.nodes>0);click(w.document,'#play');assert.equal(w.WorkshopTest.state().audio.nodes,0);}
 click(w.document,'#play');Object.defineProperty(w.document,'hidden',{configurable:true,value:true});w.document.dispatchEvent(new w.Event('visibilitychange'));
 assert.equal(w.WorkshopTest.state().playing,false);assert.equal(w.WorkshopTest.state().audio.nodes,0);
 Object.defineProperty(w.document,'hidden',{configurable:true,value:false});w.document.dispatchEvent(new w.Event('visibilitychange'));
 assert.equal(w.WorkshopTest.state().playing,false,'returning to the tab requires an explicit new play');
 click(w.document,'#play');assert(w.WorkshopTest.state().audio.nodes>0);w.dispatchEvent(new w.Event('pagehide'));
 assert.equal(w.WorkshopTest.state().playing,false);assert.equal(w.WorkshopTest.state().audio.nodes,0);
 click(w.document,'[data-lesson="pitch"]');assert.equal(context.state,'closed');assert.equal(w.WorkshopTest.state().audio.enabled,false);
});
test('math unreadable or future records survive startup and later in-memory edits, with raw recovery export',async t=>{
 for(const raw of ['{broken',JSON.stringify({version:2,notes:{counting:'未来版本的原记录'}}),'']){
  const {w,host}=math(t,raw),key='family-lab.math.learning.v1';assert.equal(w.MathTest.getState().protectedRecord,true);assert.equal(w.MathTest.getState().persistent,false);
  assert.equal(w.localStorage.getItem(key),raw);w.MathTest.select('addition');click(host,'#favorite');host.querySelector('#note').value='本次会话的发现';click(host,'#saveNote');
  w.MathTest.importText(JSON.stringify({version:1,notes:{counting:'另一个正常备份'}}));assert.equal(w.localStorage.getItem(key),raw);
  assert.equal(JSON.parse(w.MathTest.backup()).notes.addition,'本次会话的发现');
  let exported,filename;w.URL.createObjectURL=blob=>{exported=blob;return 'blob:recovery';};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){filename=this.download;};click(host,'[data-record="raw"]');assert.equal(filename,'math-original-record.txt');
  const recovered=await new Promise((resolve,reject)=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsText(exported);});assert.equal(recovered,raw);
 }
});
test('math inaccessible storage remains protected without claiming a raw file can be recovered',t=>{
 let writes=0;const {w,host}=math(t,undefined,w=>{w.Storage.prototype.getItem=()=>{throw Error('read denied');};w.Storage.prototype.setItem=()=>writes++;});
 assert.equal(w.MathTest.getState().protectedRecord,true);w.MathTest.select('addition');click(host,'#saveNote');click(host,'#notebook');
 assert.equal(writes,0);assert.equal(host.querySelector('[data-record="raw"]'),null);assert.match(host.querySelector('#recordStatus').textContent,/暂不能访问/);
});
