'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const D=require('../projects/psychology/data.js'),C=require('../shared/knowledge/core.js'),ids=D.entries.map(e=>e.id),byId=Object.fromEntries(D.entries.map(e=>[e.id,e]));
test('60 distinct concepts in six balanced categories, including requested curse of knowledge',()=>{
 assert.equal(ids.length,60);assert.equal(new Set(ids).size,60);assert.equal(D.categories.length,6);assert.equal(D.entries[0].id,'curse');
 for(const c of D.categories)assert.equal(D.entries.filter(e=>e.category===c).length,10);
});
for(const e of D.entries)test('meaning, two specific examples, boundary and professional reference: '+e.title,()=>{
 for(const key of ['title','english','plain','definition','boundary','action','kind'])assert.equal(typeof e[key],'string');
 assert(e.definition.length>=20);assert(e.boundary.length>=20);assert(e.action.length>=15);
 assert.equal(e.examples.length,2);assert(e.examples.every(x=>x.text.length>=18&&x.explanation.length>=30));assert.notEqual(e.examples[0].text,e.examples[1].text);
 assert(e.sources.length>0);for(const id of e.sources){const s=D.sources[id];assert(s&&s.title&&s.scope&&s.type);assert(C.safeURL(s.url));assert.match(s.checked,/^2026-11-02$/);}
 assert.equal(new Set(e.related).size,e.related.length);assert(e.related.every(id=>ids.includes(id)&&id!==e.id));
});
test('selected key misunderstandings are explicitly qualified rather than pop-psych labels',()=>{
 assert.match(JSON.stringify(byId.negative),/减少|去掉|移除/);assert.match(byId.negative.boundary,/惩罚/);
 assert.match(JSON.stringify(byId.positive),/增加/);assert.match(byId.punishment.boundary,/伤害|体罚/);
 assert.match(byId.dunning.boundary,/必然|曲线|不是/);assert(byId.dunning.sources.length>=2);
 assert.match(byId.delay.boundary,/不能预测孩子一生/);assert.match(byId.mindset.boundary,/努力|万能/);
 assert.match(byId.correlation.boundary,/因果|原因/);assert.match(byId.curse.boundary,/瞧不起|看不起|故意/);
 assert(byId.helpless.sources.length>=2);
});
test('search and filters return actual concepts without unrelated fallback entries',()=>{
 assert.deepEqual(C.filter(D.entries,{query:'CURSE of KNOWLEDGE'}).map(e=>e.id),['curse']);
 assert.deepEqual(C.filter(D.entries,{query:'知识诅咒'}).map(e=>e.id),['curse']);
 assert.equal(C.filter(D.entries,{query:'zzzznotfound'}).length,0);
 const c=D.categories[0];assert.equal(C.filter(D.entries,{category:c}).length,10);
 assert.deepEqual(C.filter(D.entries,{favorites:['curse','negative'],unread:['curse']}).map(e=>e.id),['negative']);
 assert.equal(C.filter(D.entries,{favorites:[]}).length,0);assert.equal(C.filter(D.entries,{unread:ids}).length,0);
});
test('records validate before atomic merge; never import symptoms or execute strings',()=>{
 const raw={app:'family-lab-psychology',version:1,favorites:['curse','curse'],read:['negative'],private:'discard me'};
 const clean=C.validate(raw,raw.app,ids);assert.deepEqual(clean,{favorites:['curse'],read:['negative']});
 assert.throws(()=>C.validate({...raw,app:'another-app'},raw.app,ids));assert.throws(()=>C.validate({...raw,version:2},raw.app,ids));
 for(const bad of [null,{},['__proto__'],['<script>x</script>'],new Array(61).fill('curse')])assert.throws(()=>C.validate({...raw,favorites:bad},raw.app,ids));
 const first={favorites:['curse'],read:[]};assert.deepEqual(C.merge(first,clean),{favorites:['curse'],read:['negative']});assert.deepEqual(first,{favorites:['curse'],read:[]});
 assert.deepEqual(C.toggle(['curse'],'curse'),[]);assert.deepEqual(C.toggle([],'curse'),['curse']);
 assert(!C.safeURL('javascript:alert(1)'));assert(!C.safeURL('https://name:secret@example.com'));assert(!C.safeURL('http://example.com'));
});
test('static app preserves offline use, zoom and no clinical scoring',()=>{
 const h=fs.readFileSync('projects/psychology/index.html','utf8'),js=fs.readFileSync('projects/psychology/app.js','utf8');
 assert.doesNotMatch(h,/user-scalable=no|maximum-scale=1|<iframe|https?:\/\/[^" ]+\.js/);assert.match(h,/不是实验结果或对某个人的诊断/);
 assert.doesNotMatch(js,/\beval\s*\(|\.innerHTML\s*=/);assert.match(js,/family-lab-psychology/);
});
