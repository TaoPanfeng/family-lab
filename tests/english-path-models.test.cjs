'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),files=['path-foundation.js','path-time.js','path-connections.js','path-expression.js','path-model.js'];
function load(){const w={};for(const f of files)vm.runInNewContext(fs.readFileSync(path.join(root,'projects/english',f),'utf8'),{window:w});return w;}
const w=load(),M=w.EnglishPathModel,all=M.catalog(),plain=x=>JSON.parse(JSON.stringify(x));
test('eight ordered stages form one 32-lesson path alongside the preserved three original labs',()=>{
 assert.equal(M.stages.length,8);assert.equal(all.length,32);assert.equal(new Set(all.map(l=>l.id)).size,32);
 assert.deepEqual(Array.from(all,l=>l.order),Array.from({length:32},(_,i)=>i));
 all.forEach((l,i)=>{assert.equal(l.stage,Math.floor(i/4));for(const key of ['title','mission','intro','child','adult','home','work','trap','limits','nextUse'])assert(typeof l[key]==='string'&&l[key].length>=5,l.id+' '+key);assert.equal(l.steps.length,3);assert(l.sources.length);for(const [,url]of l.sources)assert.equal(new URL(url).protocol,'https:');});
 const c={window:{WorkshopModels:require('../shared/workshop/models.js'),EnglishPathModel:M}};vm.runInNewContext(fs.readFileSync(path.join(root,'projects/english/app.js'),'utf8'),c);
 assert.equal(c.window.Workshop.lessons.length,35);for(const id of ['where','sentence','number'])assert(c.window.Workshop.lessons.some(l=>l.id===id));
 for(const [id,term]of [['perfect','现在完成时'],['focus','倒装'],['ing','look forward to']])assert(c.window.Workshop.searchText(M.lesson(id)).toLowerCase().includes(term.toLowerCase()),'meaning-based titles remain searchable by '+term);
});
test('every lesson has meaningful variants, role-aligned sentences, two nuanced contrasts and explicit boundaries',()=>{
 for(const l of all){assert(l.principle.question.length>5);assert(l.principle.reason.length>20);assert(l.principle.boundary.length>10);assert(l.principle.steps.length>=3);assert.equal(l.cases.length,3);assert.equal(l.transfer.variants.length,3);assert.equal(l.contrasts.length,2);
  for(const list of [l.cases,l.transfer.variants]){assert.equal(new Set(list.map(c=>c.en)).size,3,l.id+' examples must differ');for(const c of list){assert.equal(c.parts.map(p=>p.text).join(' '),c.en,l.id+' role blocks reproduce sentence');assert(c.zh&&c.why&&c.scene&&c.label);assert(c.parts.every(p=>p.role&&p.text));assert(!/[<>]/.test(c.en),'plain content');}}
  for(const pair of l.contrasts){assert(pair.a!==pair.b);assert(['both','different','repair'].includes(pair.judgement));assert(pair.aZh&&pair.bZh&&pair.reason.length>20);}
 }
});
test('each lesson checks concept and transfer separately with English-only prompts and per-choice rationale',()=>{
 const ids=[];for(const l of all){assert.equal(l.challenge.length,2);assert.deepEqual(Array.from(l.challenge,q=>q.kind),['probe','transfer']);
  for(const q of l.challenge){ids.push(q.id);assert(q.id.startsWith(l.id+'-'));assert(q.prompt&&q.context);assert(!/[\u3400-\u9fff]/.test(q.prompt+q.context),q.id+' no translated hint');assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.text)).size,4);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert(q.options.every(o=>o.text&&o.why.length>8&&!/[\u3400-\u9fff]/.test(o.text)));assert(q.explanation.length>10&&q.translation.length>5);assert(M.lesson(q.skill),q.id+' skill routes to a known lesson');}}
 assert.equal(new Set(ids).size,64);
 for(let g=0;g<4;g++)assert(new Set(all.slice(g*8,g*8+8).flatMap(l=>l.challenge.map(q=>q.answer))).size>=3,'answer locations vary');
});
test('viewing and one correct answer never clear a lesson; two independent answers do',()=>{
 const l=all[0],initial=M.blank();initial.seen.push(l.id);assert.equal(M.isCleared(initial,l.id),false);
 const wrong=M.answer(initial,l.id,l.challenge[0].id,(l.challenge[0].answer+1)%4);assert.equal(wrong.correct,false);assert.equal(wrong.state.completed.length,0);
 const one=M.answer(initial,l.id,l.challenge[0].id,l.challenge[0].answer);assert.equal(one.correct,true);assert(!M.isCleared(one.state,l.id));
 const repeat=M.answer(one.state,l.id,l.challenge[0].id,l.challenge[0].answer);assert.equal(repeat.state.completed.length,1);
 const two=M.answer(repeat.state,l.id,l.challenge[1].id,l.challenge[1].answer);assert(M.isCleared(two.state,l.id));assert.equal(M.summary(two.state).next,all[1].id);assert.equal(initial.completed.length,0);
 assert.throws(()=>M.answer(initial,l.id,l.challenge[0].id,-1));assert.throws(()=>M.answer(initial,l.id,all[1].challenge[0].id,0));
});
test('backup validates known evidence and draft bounds; merge retains current work without sharing references',()=>{
 const a=M.blank(),b=M.blank();a.drafts.meaning='我的原稿';b.drafts.meaning='传入稿';b.drafts.order='新草稿';b.completed.push(all[0].challenge[0].id);b.last=all[8].id;
 const c=M.merge(a,b);assert.equal(c.drafts.meaning,'我的原稿');assert.equal(c.drafts.order,'新草稿');assert.equal(c.last,'meaning');assert.equal(c.completed.length,1);c.drafts.meaning='changed';assert.equal(a.drafts.meaning,'我的原稿');
 for(const bad of [null,[],{}, {...a,version:99},{...a,last:'unknown'},{...a,completed:['unknown']},{...a,drafts:{meaning:'x'.repeat(5001)}},{...a,drafts:{constructor:'bad'}}])assert.throws(()=>M.validate(bad));
 assert.deepEqual(plain(M.validate(a)),plain(a));
});
test('all content assets are local and shipped once; runtime carries no eval, network grading or recording',()=>{
 const html=fs.readFileSync(path.join(root,'projects/english/index.html'),'utf8');for(const f of [...files,'path-ui.js','app.js'])assert.equal(html.split('src="'+f+'"').length-1,1,f);
 for(const f of [...files,'path-ui.js']){const s=fs.readFileSync(path.join(root,'projects/english',f),'utf8');assert(!/\beval\s*\(|new Function|\bfetch\s*\(|getUserMedia|MediaRecorder/.test(s),f);}
});
