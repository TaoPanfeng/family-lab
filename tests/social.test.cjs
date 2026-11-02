'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../projects/social/data.js'),M=require('../projects/social/model.js'),C=require('../shared/knowledge/core.js'),P=require('../projects/psychology/data.js');
const ids=D.entries.map(e=>e.id),byId=Object.fromEntries(D.entries.map(e=>[e.id,e]));
test('48 original communication scenes, eight categories, four balanced answer positions',()=>{
 assert.equal(ids.length,48);assert.equal(new Set(ids).size,48);assert.equal(new Set(D.entries.map(e=>e.title)).size,48);assert.equal(D.categories.length,8);
 for(const c of D.categories)assert.equal(D.entries.filter(e=>e.category===c.id).length,6);
 for(let i=0;i<4;i++)assert.equal(D.entries.filter(e=>M.preferred(e)===i).length,12);
 assert.equal(D.entries.filter(e=>e.audience==='亲子共读').length,14);assert.equal(D.entries[0].id,'s01');
});
// Presence/length guards catch missing fields, not educational quality; semantic cases below check critical boundaries.
for(const e of D.entries)test('specific context, explanations, follow-up, action and limits: '+e.title,()=>{
 for(const k of ['title','scene','trigger','goal','principle','reply','pushback','followup','boundary'])assert.equal(typeof e[k],'string',k);
 assert(e.scene.length>=20);assert(e.reply.length>=30);assert(e.followup.length>=15);assert(e.boundary.length>=20);
 assert.equal(e.options.length,4);assert.equal(new Set(e.options.map(o=>o.text)).size,4);assert(e.options.every(o=>o.text.length>=6&&o.reason.length>=12));
 assert.equal(e.actions.length,3);assert(e.actions.every(a=>a.length>=6));assert.equal(new Set(e.actions).size,3);
 assert.equal(e.options.filter(o=>o.preferred).length,1);assert.equal(M.response(e,'brief'),e.options[M.preferred(e)].text);assert.equal(M.response(e,'full'),e.reply);assert.equal(M.response(e,'followup'),e.followup);
 assert(e.sources.length>=1&&e.sources.every(id=>D.sources[id]));
 for(const id of e.related){assert(P.entries.some(p=>p.id===id));assert.equal(D.psychology[id],P.entries.find(p=>p.id===id).title);}
});
test('research scope is distinct from original hypothetical dialogue',()=>{
 assert.match(D.sourceNote,/本站原创/);assert.match(D.sourceNote,/不代表机构认可/);assert.match(D.boundary,/不是读心术/);assert.match(D.boundary,/不由一句话保证/);
 for(const s of Object.values(D.sources)){assert(C.safeURL(s.url));assert(s.name&&s.kind&&s.scope.length>20);}
 assert.match(D.sources.apology.scope,/假设招聘场景/);assert.match(D.sources.assert.scope,/不能保证/);
});
test('key semantic boundaries: do not manipulate, promise miracles or force forgiveness',()=>{
 assert.match(byId.s01.boundary,/不要求对方立刻消气/);assert.match(byId.s06.boundary,/不必.*返回危险现场/);
 assert.match(byId.s07.principle,/大人已经懂.*孩子可能是新的|大人已经懂.*对孩子可能是新的/);
 assert.match(byId.s12.principle,/礼貌不要求接受身体接触/);assert.match(byId.s13.principle,/交付范围、时间和影响/);
 assert.match(byId.s15.principle,/不编造原因和恢复时间/);assert.match(byId.s19.boundary,/不提供.*投资建议/);
 assert.match(byId.s27.boundary,/拒绝饮酒本身就足够/);assert.match(byId.s41.principle,/拍照同意和公开传播同意不是一回事/);
 assert.match(byId.s43.boundary,/不是.*立刻原谅/);assert.match(byId.s47.reply,/不必照读台词/);assert.match(byId.s47.safety,/安全和求助/);assert.match(byId.s48.safety,/不是孩子.*责任/);
});
test('filters, empty states and random selection use actual eligible scenes',()=>{
 assert.deepEqual(M.filter(D.entries,{query:'代码评审'}).map(e=>e.id),['s14']);
 assert.equal(M.filter(D.entries,{category:'parenting'}).length,6);assert.equal(M.filter(D.entries,{audience:'亲子共读'}).length,14);
 assert.equal(M.filter(D.entries,{query:'nothing-here-zzz'}).length,0);
 assert.deepEqual(M.filter(D.entries,{favorites:['s01','s02'],unread:['s01']}).map(e=>e.id),['s02']);
 assert.equal(M.filter(D.entries,{favorites:[]}).length,0);
 assert.equal(M.choose([], 's01'),null);assert.equal(M.choose([byId.s01],'s01').id,'s01');assert.notEqual(M.choose(D.entries,'s01',()=>0).id,'s01');assert.equal(M.choose(D.entries,'s01',()=>1).id,'s48');
});
test('backup validates before merge and cannot import private texts or foreign keys',()=>{
 const app='family-lab-social',input={app,version:1,favorites:['s01','s01'],read:['s02'],ownWords:'private',choices:['A']};
 assert.deepEqual(C.validate(input,app,ids),{favorites:['s01'],read:['s02']});
 for(const bad of [{...input,app:'family-lab-psychology'},{...input,version:2},{...input,favorites:['__proto__']},{...input,read:'s01'},{...input,favorites:new Array(49).fill('s01')}])assert.throws(()=>C.validate(bad,app,ids));
 const a={favorites:['s01'],read:[]},b={favorites:['s02'],read:['s01']};assert.deepEqual(C.merge(a,b),{favorites:['s01','s02'],read:['s01']});assert.deepEqual(a,{favorites:['s01'],read:[]});
});
test('default answers hidden; ordinary browser zoom and offline runtime preserved',()=>{
 const html=fs.readFileSync('projects/social/index.html','utf8'),js=fs.readFileSync('projects/social/app.js','utf8');
 assert.match(html,/<div id="answers" hidden/);assert.match(html,/aria-expanded="false" aria-controls="answers"/);
 assert.match(html,/只保存本机收藏/);assert.match(html,/不会|不自动打/);
 assert.doesNotMatch(html,/user-scalable=no|maximum-scale=1|<iframe|https?:\/\/[^" ]+\.js/);
 assert.doesNotMatch(js,/\beval\s*\(|\.innerHTML\s*=|fetch\s*\(|XMLHttpRequest/);
 assert.match(js,/family-lab-social/);assert.match(js,/clearExercise/);
});
