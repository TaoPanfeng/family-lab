'use strict';
// Runs real local scripts with DOM events. jsdom does not verify layout, native
// tabbing, speech output, file:// policies, downloads or trusted touch gestures.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const ROOT=path.resolve(__dirname,'../../..');
function boot(t,project,page='index.html',options={}){
 const dir=path.join(ROOT,'projects',project),errors=[];
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
 const dom=new JSDOM(fs.readFileSync(path.join(dir,page),'utf8'),{url:`https://offline-humanities.test/projects/${project}/${page}`,runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 const w=dom.window,d=w.document;
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'));};
 for(const [key,value] of Object.entries(options.storage||{}))w.localStorage.setItem(key,value);
 for(const script of d.querySelectorAll('script[src]'))w.eval(fs.readFileSync(path.resolve(dir,script.getAttribute('src')),'utf8'));
 t.after(()=>{dom.window.close();assert.deepEqual(errors.map(e=>e.message),[],'no unhandled application errors');});
 const $=selector=>{const el=d.querySelector(selector);assert(el,selector);return el;};
 return {w,d,$,click(selector){const el=$(selector);assert(!el.disabled,'enabled '+selector);el.focus();el.click();},input(selector,value){const el=$(selector);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));},change(selector,value){const el=$(selector);if(typeof value==='boolean')el.checked=value;else el.value=value;el.dispatchEvent(new w.Event('change',{bubbles:true}));}};
}
test('phrase filters hide stale lessons, clear returns focus, and drafts survive',t=>{
 const ui=boot(t,'chinese','phrases.html');
 ui.input('#my-sentence','这是我的草稿');
 ui.input('#search','no-matching-phrase-761');
 assert.equal(ui.w.PhraseTest.shown().length,0);
 assert.equal(ui.$('#study').hidden,true,'no unrelated lesson beside zero results');
 assert.equal(ui.$('#empty').hidden,false);
 ui.click('#empty-clear');
 assert.equal(ui.$('#study').hidden,false);
 assert.equal(ui.d.activeElement.id,'search');
 assert.equal(ui.$('#my-sentence').value,'这是我的草稿');
});
test('phrase practice stays inside filters and favorite removal selects a remaining card',t=>{
 const ui=boot(t,'chinese','phrases.html');
 const all=ui.w.PhraseTest.all,first=all[0],second=all[1];
 ui.click('#favorite');ui.click(`[data-entry="${second.id}"]`);ui.click('#favorite');
 ui.change('#only-faves',true);
 ui.click('#practice');
 assert.equal(ui.w.PhraseTest.state().selected,first.id);
 ui.click('#favorite');
 assert.equal(ui.w.PhraseTest.state().selected,second.id);
 assert.equal(ui.$('#practice').disabled,true,'single eligible item explains unavailable switch');
 ui.click('#favorite');
 assert.equal(ui.$('#study').hidden,true);assert.equal(ui.d.activeElement.id,'empty-clear');
});
test('phrase changing a card resets the optional meaning answer and story question',t=>{
 const ui=boot(t,'chinese','phrases.html');
 ui.click('#reveal');ui.$('#story-comprehension').open=true;
 ui.click('#following');
 assert.equal(ui.$('#answer').hidden,true);assert.equal(ui.$('#reveal').getAttribute('aria-expanded'),'false');assert.equal(ui.$('#story-comprehension').open,false);
});
for(const project of ['psychology','social'])test(project+': leaving empty and reset confirmation keeps a visible focus target',t=>{
 const ui=boot(t,project);
 ui.input('#search','no-matching-entry-761');ui.click('#empty-clear');
 assert.equal(ui.d.activeElement.id,'search');assert.equal(ui.$('#reading').hidden,false);
 ui.click('#reset-records');assert.equal(ui.d.activeElement.id,'cancel-reset');
 ui.click('#cancel-reset');assert.equal(ui.d.activeElement.id,'reset-records');
 ui.click('#reset-records');ui.click('#confirm-reset');assert.equal(ui.d.activeElement.id,'reset-records');
});
test('history rebuilding filters preserves keyboard position and answers expose a useful next target',t=>{
 const ui=boot(t,'history');
 ui.click('[data-action="nav"][data-view="events"]');
 ui.click('[data-action="event-kind"][data-kind="battle"]');
 assert.equal(ui.d.activeElement.dataset.kind,'battle');
 const select=ui.$('#event-dynasty');select.focus();ui.change('#event-dynasty','tang');
 assert.equal(ui.d.activeElement.id,'event-dynasty');
 ui.click('[data-action="nav"][data-view="learn"]');ui.click('[data-action="quiz-answer"][data-index="0"]');
 assert(ui.d.activeElement.matches('.quiz-feedback'),'answer feedback becomes focus target after options disable');
 ui.click('[data-action="quiz-step"][data-delta="1"]');
 assert.equal(ui.d.activeElement.id,'quiz-question','next question has an accessible reading start');
 assert.equal(ui.d.querySelector('.quiz-feedback'),null);
});
test('social answer and private practice reset on scene changes and are never persisted',t=>{
 const ui=boot(t,'social');
 ui.click('[data-option="0"]');ui.click('#submit');ui.input('#own-words','仅在这道题练说');
 ui.click('#next');
 assert.equal(ui.$('#answers').hidden,true);assert.equal(ui.$('#own-words').value,'');assert.equal(ui.w.SocialTest.state().choice,null);
 ui.click('#favorite');const raw=ui.w.localStorage.getItem('family-lab-social.v1');assert(!raw.includes('仅在这道题练说'));assert(!raw.includes('choice'));
});

test('character animation pauses in background and leaving stops speech and clears the writer',t=>{
 const ui=boot(t,'chinese');let pauses=0,cancels=0;
 ui.w.HanziWriter={create:()=>({pauseAnimation(){pauses++;},resumeAnimation(){},cancelQuiz(){},hideCharacter(){},animateCharacter(){return new Promise(()=>{});}})};
 ui.w.speechSynthesis={cancel(){cancels++;},getVoices(){return [];}};
 ui.click('#animate');assert.equal(ui.w.ChineseTest.state().playing,true);
 Object.defineProperty(ui.d,'hidden',{configurable:true,value:true});ui.d.dispatchEvent(new ui.w.Event('visibilitychange'));
 assert.equal(ui.w.ChineseTest.state().paused,true);assert.equal(pauses,1);assert.equal(cancels,1);assert.equal(ui.$('#pause').textContent,'继续');
 ui.w.dispatchEvent(new ui.w.Event('pagehide'));
 assert.equal(ui.w.ChineseTest.state().playing,false);assert.equal(ui.$('#writer-view').hidden,true);assert.equal(cancels,2);
});
test('character empty filters stop hidden animation and clearing restores a complete glyph',t=>{
 const ui=boot(t,'chinese');
 ui.w.HanziWriter={create:()=>({pauseAnimation(){},cancelQuiz(){},hideCharacter(){},animateCharacter(){return new Promise(()=>{});}})};
 ui.click('#animate');ui.input('#search','no-glyph-761');
 assert.equal(ui.w.ChineseTest.state().playing,false);assert.equal(ui.$('#lesson').hidden,true);
 ui.click('#clear');assert.equal(ui.$('#lesson').hidden,false);assert.equal(ui.$('#writer-view').hidden,true);assert(ui.d.querySelector('#split-view svg'));
});
test('history strict JSON merge preserves both notes, rejects foreign records and oversized merges atomically',()=>{
 const C=require('../core.js'),ids={bookmarks:['r:one','r:two'],visited:['one','two'],answered:['q1','q2'],journeys:6};
 const current={bookmarks:['r:one'],visited:['one'],answered:['q1'],notes:'原有手记',journey:1};
 const incoming={app:'guanshi-history',version:1,bookmarks:['r:two'],visited:['two'],answered:['q2'],notes:'导入手记',journey:3};
 const result=C.mergeBackup(current,incoming,ids);
 assert.deepEqual(result.bookmarks,['r:one','r:two']);assert.deepEqual(result.visited,['one','two']);assert.deepEqual(result.answered,['q1','q2']);assert(result.notes.includes(current.notes)&&result.notes.includes(incoming.notes));assert.equal(result.journey,3);
 assert.equal(C.mergeBackup(result,incoming,ids).notes,result.notes,'same backup does not append notes twice');assert.equal(current.notes,'原有手记');
 for(const bad of [{...incoming,app:'elsewhere'},{...incoming,version:2},{...incoming,bookmarks:['__proto__']},{...incoming,visited:['unknown']},{...incoming,answered:'q1'},{...incoming,notes:'x'.repeat(20001)},{...incoming,journey:6}])assert.throws(()=>C.mergeBackup(current,bad,ids));
 assert.throws(()=>C.mergeBackup({...current,notes:'a'.repeat(20000)},incoming,ids),/超过20000/);assert.equal(current.bookmarks.length,1);
});
test('history JSON backup roundtrip merges through the visible input without changing selected year or mode',async t=>{
 const ui=boot(t,'history');const downloads=[],blobs=[];
 ui.w.URL.createObjectURL=blob=>{blobs.push(blob);return 'blob:history-test';};ui.w.URL.revokeObjectURL=()=>{};
 ui.w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download);};
 ui.click('[data-action="nav"][data-view="learn"]');ui.input('#learning-notes','原手记');ui.click('[data-action="export-backup"]');
 assert.deepEqual(downloads,['guanshi-history-records.json']);
 const read=blob=>new Promise(resolve=>{const reader=new ui.w.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(blob);});
 const raw=JSON.parse(await read(blobs[0]));assert.equal(raw.app,'guanshi-history');assert.equal(raw.notes,'原手记');assert.equal('year' in raw,false);
 const key='guanshi.history.v1',before=JSON.parse(ui.w.localStorage.getItem(key));
 const incoming={...raw,notes:'另一份手记',visited:[ui.w.EARLY_RULERS[0].id]};
 async function load(value){const input=ui.$('#history-import');Object.defineProperty(input,'files',{configurable:true,value:[{size:100,text:async()=>JSON.stringify(value)}]});input.dispatchEvent(new ui.w.Event('change',{bubbles:true}));await new Promise(resolve=>setImmediate(resolve));}
 await load(incoming);const merged=JSON.parse(ui.w.localStorage.getItem(key));assert(merged.notes.includes('原手记')&&merged.notes.includes('另一份手记'));assert(merged.visited.includes(incoming.visited[0]));assert.equal(merged.mode,before.mode);assert.equal(merged.year,before.year);assert.match(ui.$('#backup-status').textContent,/已合并/);
 await load({...incoming,visited:['unknown']});assert.deepEqual(JSON.parse(ui.w.localStorage.getItem(key)),merged);assert.match(ui.$('#backup-status').textContent,/未导入/);
});

for(const [project,page,key] of [['chinese','index.html','family-lab.chinese.v1'],['chinese','phrases.html','family-lab.chinese.phrases.v1'],['psychology','index.html','family-lab-psychology.v1'],['social','index.html','family-lab-social.v1'],['history','index.html','guanshi.history.v1']]){
 for(const [kind,raw] of [['broken JSON','{broken-json'],['unknown version',JSON.stringify({app:project==='history'?'guanshi-history':project==='chinese'?(page==='phrases.html'?'family-lab-chinese-phrases':'family-lab-chinese'):'family-lab-'+project,version:99,favorites:[],read:[],notes:{}})]])test(project+'/'+page+': '+kind+' survives subsequent learning actions',t=>{
  const ui=boot(t,project,page,{storage:{[key]:raw}});
  if(project==='history'){ui.click('[data-action="nav"][data-view="learn"]');ui.input('#learning-notes','本页新手记');ui.w.dispatchEvent(new ui.w.Event('pagehide'));}
  else ui.click('#favorite');
  assert.equal(ui.w.localStorage.getItem(key),raw,'unreadable existing key remains byte-for-byte unchanged');
 });
}
for(const project of ['psychology','social'])test(project+': explicit confirmed reset permits saving after an unreadable old record',t=>{
 const key='family-lab-'+project+'.v1',ui=boot(t,project,'index.html',{storage:{[key]:'{broken-json'}});
 ui.click('#reset-records');ui.click('#confirm-reset');ui.click('#favorite');assert.equal(JSON.parse(ui.w.localStorage.getItem(key)).favorites.length,1);
});
for(const [page,stylesheet] of [['index.html','style.css'],['phrases.html','phrases.css']])test('chinese/'+page+': native record import remains keyboard reachable',t=>{
 const ui=boot(t,'chinese',page),style=ui.d.createElement('style');style.textContent=fs.readFileSync(path.join(ROOT,'projects/chinese',stylesheet),'utf8');ui.d.head.append(style);
 const input=ui.$('#import');assert.notEqual(ui.w.getComputedStyle(input).display,'none');assert.equal(input.tabIndex,0);input.focus();assert.equal(ui.d.activeElement,input);assert(input.labels.length>0);
});
