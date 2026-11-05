'use strict';
// DOM behavior only; real file/HTTP, touch and published browser checks remain separate.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('../projects/history/node_modules/jsdom');
const ROOT=path.resolve(__dirname,'..'),KEY='family-lab.english.path.1',OLD='family-lab.workshop.english.1';
function fixture(t,options={}){
 const dom=new JSDOM('<!doctype html><body></body>',{url:'https://example.test/family-lab/projects/english/',runScripts:'outside-only',pretendToBeVisual:true});
 t.after(()=>dom.window.close());
 const w=dom.window,d=w.document,downloads=[];
 w.matchMedia=()=>({matches:false,addEventListener(){}});w.HTMLElement.prototype.scrollIntoView=function(){};w.structuredClone=structuredClone;
 w.Blob=Blob;w.URL.createObjectURL=blob=>{downloads.push(blob);return 'blob:test-download';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
 const old=JSON.stringify({app:'family-lab-workshop',version:1,subject:'english',favorites:['where'],notes:{where:'原有位置实验笔记'},works:{}});
 w.localStorage.setItem(OLD,old);if(options.raw!==undefined)w.localStorage.setItem(KEY,options.raw);
 if(options.readFailure)Object.defineProperty(w,'localStorage',{value:{getItem(){throw Error('storage blocked');},setItem(){throw Error('storage blocked');}}});
 if(options.writeFailure)w.Storage.prototype.setItem=function(){throw Error('quota');};
 for(const file of ['shared/workshop/models.js','projects/english/path-foundation.js','projects/english/path-time.js','projects/english/path-connections.js','projects/english/path-expression.js','projects/english/path-model.js','projects/english/path-ui.js','projects/english/app.js','shared/workshop/core.js'])w.eval(fs.readFileSync(path.join(ROOT,file),'utf8'));
 w.EnglishPathUI.decorate();
 return {w,d,downloads,old,model:w.EnglishPathModel,state:()=>w.WorkshopTest.state(),select:id=>w.WorkshopTest.select(id),click:s=>{assert(d.querySelector(s),'Control exists: '+s);d.querySelector(s).click();},choice:n=>{const input=d.querySelector('input[name="path-choice"][value="'+n+'"]');input.checked=true;input.dispatchEvent(new w.Event('change',{bubbles:true}));},input:(selector,text)=>{const input=d.querySelector(selector);input.value=text;input.dispatchEvent(new w.Event('input',{bubbles:true}));},import:async raw=>{await d.querySelector('#path-import').onchange({target:{files:[{size:Buffer.byteLength(raw),text:async()=>raw}],value:'selected.json'}});}};
}
test('all 32 route lessons change the actual meaning scene, English sentence and labeled role blocks together',t=>{
 const f=fixture(t),{d,model}=f;assert.equal(model.catalog().length,32);assert.equal(d.querySelector('#path-directory').open,false);
 for(const lesson of model.catalog()){
  f.select(lesson.id);assert.equal(d.querySelectorAll('[data-path-case]').length,3);assert.equal(d.querySelectorAll('[data-path-variant]').length,3);
  for(let i=0;i<3;i++){
   f.click('[data-path-case="'+i+'"]');assert.equal(f.state().caseIndex,i);
   assert.equal(d.querySelector('#path-example-scene .path-sentence-display p').textContent,lesson.cases[i].en);
   assert.equal([...d.querySelectorAll('#path-example-scene .path-role-block>span')].map(x=>x.textContent).join(' '),lesson.cases[i].en);
   assert(d.querySelector('#path-example-scene .path-scene').textContent.includes(lesson.cases[i].scene));
   f.click('[data-path-variant="'+i+'"]');assert.equal(f.state().transferIndex,i);
   assert.equal(d.querySelector('#path-transfer-scene .path-sentence-display p').textContent,lesson.transfer.variants[i].en);
   assert.equal([...d.querySelectorAll('#path-transfer-scene .path-role-block>span')].map(x=>x.textContent).join(' '),lesson.transfer.variants[i].en);
  }
  assert.equal(d.querySelectorAll('#experiment details[open]').length,0);
 }
 assert.equal(model.summary(f.w.EnglishPathUI.state().record).cleared,0,'Viewing and changing examples never clears a lesson');
 assert.equal(f.w.localStorage.getItem(OLD),f.old,'Route work does not overwrite the original experiments');
 f.select('where');assert.equal(d.body.classList.contains('path-active'),false);assert(d.querySelector('#positions'));
});
test('two-phase answers hide all explanations, record both correct questions, reset retries, and preserve prior passed evidence',t=>{
 const f=fixture(t),{d,model}=f,lesson=model.lesson('meaning');
 f.click('[data-path-screen="challenge"]');assert.equal(d.activeElement.id,'path-workspace');
 assert.equal(d.querySelector('#path-submit').disabled,true);assert.equal(d.querySelectorAll('#experiment details').length,0);
 assert.equal(d.querySelector('.path-quiz-context').textContent,lesson.challenge[0].context);
 const q=lesson.challenge[0];f.choice((q.answer+1)%4);assert.equal(f.state().submitted,false);assert.equal(d.querySelectorAll('#experiment details').length,0);
 f.click('#path-submit');assert.equal(f.state().correct,false);assert.equal(d.activeElement.id,'path-question-feedback');assert.equal(d.querySelectorAll('#experiment details[open]').length,0);
 assert(d.querySelector('#path-question-feedback details').textContent.includes(q.options[(q.answer+1)%4].why));
 assert.equal(model.summary(f.w.EnglishPathUI.state().record).cleared,0);
 f.click('#path-retry');assert.equal(d.querySelector('input:checked'),null);assert.equal(d.querySelectorAll('#experiment details').length,0);assert.equal(d.querySelector('#path-submit').disabled,true);
 f.choice(q.answer);f.click('#path-submit');assert.equal(f.state().cleared,false);f.click('#path-next-question');
 assert.equal(f.state().questionIndex,1);assert.equal(d.querySelector('input:checked'),null);assert.equal(d.querySelectorAll('#experiment details').length,0);
 f.choice(lesson.challenge[1].answer);f.click('#path-submit');assert.equal(f.state().cleared,true);assert.match(d.querySelector('.path-lesson-state').textContent,/均已通过/);
 assert.equal(d.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'),'1');
 f.click('#path-retry');f.choice((lesson.challenge[1].answer+1)%4);f.click('#path-submit');assert.equal(f.state().cleared,true,'A failed redo preserves earlier correct evidence');
 f.click('#path-next-question');assert.equal(f.state().pathScreen,'produce');assert.equal(d.querySelectorAll('#experiment details[open]').length,0);assert.match(d.querySelector('.path-production-note').textContent,/不会自动判定/);
});
test('practice drafts stay in memory until explicitly saved, survive lesson jumps, and do not count as quiz progress',t=>{
 const f=fixture(t),{w,d}=f;f.click('[data-path-screen="produce"]');const before=w.localStorage.getItem(KEY);
 f.input('#path-draft','I need a break.');assert.equal(w.localStorage.getItem(KEY),before);assert.match(d.querySelector('#path-draft-status').textContent,/尚未保存/);
 f.select('order');f.select('meaning');f.click('[data-path-screen="produce"]');assert.equal(d.querySelector('#path-draft').value,'I need a break.');assert.match(d.querySelector('#path-draft-status').textContent,/尚未保存/);
 assert.equal(JSON.parse(w.localStorage.getItem(KEY)).drafts.meaning,undefined);
 f.click('#path-save-draft');assert.equal(JSON.parse(w.localStorage.getItem(KEY)).drafts.meaning,'I need a break.');assert.match(d.querySelector('#path-draft-status').textContent,/已保存/);
 assert.equal(f.model.summary(w.EnglishPathUI.state().record).cleared,0);assert.equal(d.querySelector('#path-draft').maxLength,5000);assert.equal(w.localStorage.getItem(OLD),f.old);
});
test('JSON import merges full records atomically and retains current same-lesson practice; exports carry the route format',async t=>{
 const f=fixture(t),{w,d,model}=f;f.click('[data-path-screen="produce"]');f.input('#path-draft','My current words.');f.click('#path-save-draft');
 const incoming=model.blank();incoming.completed=model.lesson('order').challenge.map(q=>q.id);incoming.seen=['order'];incoming.drafts={meaning:'Incoming replacement.',order:'My imported words.'};incoming.last='order';
 await f.import(JSON.stringify(incoming));let record=w.EnglishPathUI.state().record;
 assert.equal(record.drafts.meaning,'My current words.');assert.equal(record.drafts.order,'My imported words.');assert.equal(model.summary(record).cleared,1);assert.equal(record.last,'meaning');assert.equal(d.querySelector('#path-draft').value,'My current words.');
 const before=JSON.stringify(record);await f.import(JSON.stringify({...incoming,completed:['unknown-question']}));assert.equal(JSON.stringify(w.EnglishPathUI.state().record),before);assert.match(d.querySelector('#path-status').textContent,/未导入/);
 f.click('#path-export');const backup=JSON.parse(await f.downloads.at(-1).text());assert.equal(backup.app,'family-lab-english-path');assert.equal(backup.drafts.order,'My imported words.');assert.equal(w.localStorage.getItem(OLD),f.old);
});
test('a corrupt stored record is locked, exported exactly, and never overwritten by a merge or new work',async t=>{
 const raw='{damaged record';const f=fixture(t,{raw}),{w,model}=f;
 assert.equal(w.EnglishPathUI.state().readLocked,true);assert.equal(w.localStorage.getItem(KEY),raw);assert.equal(f.d.querySelector('#path-export-raw').hidden,false);
 f.click('#path-export-raw');assert.equal(await f.downloads.at(-1).text(),raw);
 const incoming=model.blank();incoming.drafts.meaning='Recovered words.';await f.import(JSON.stringify(incoming));
 f.click('[data-path-screen="produce"]');assert.equal(f.d.querySelector('#path-draft').value,'Recovered words.');f.input('#path-draft','New memory words.');f.click('#path-save-draft');
 assert.equal(w.localStorage.getItem(KEY),raw);assert.equal(w.EnglishPathUI.state().record.drafts.meaning,'New memory words.');
 f.click('#path-export');assert.equal(JSON.parse(await f.downloads.at(-1).text()).drafts.meaning,'New memory words.');assert.equal(w.localStorage.getItem(OLD),f.old);
});
for(const options of [{readFailure:true},{writeFailure:true}])test('unavailable browser storage keeps usable in-memory work: '+Object.keys(options)[0],t=>{
 const f=fixture(t,options);assert.equal(f.w.EnglishPathUI.state().persistent,false);if(options.readFailure)assert.equal(f.w.EnglishPathUI.state().readLocked,true);
 f.click('[data-path-screen="produce"]');f.input('#path-draft','Still usable.');f.click('#path-save-draft');assert.equal(f.w.EnglishPathUI.state().record.drafts.meaning,'Still usable.');assert.match(f.d.querySelector('#path-draft-status').textContent,/仅暂存在内存/);
});
