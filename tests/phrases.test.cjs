'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path='projects/chinese/';
const data=require('../projects/chinese/phrases-data.js');
const chars=require('../projects/chinese/data.js');
const extra=require('../projects/chinese/extra-characters.js');
const supplemental=require('../projects/chinese/supplement.js');
test('idioms and sayings are independent categories, nonempty, unique',()=>{
  assert.equal(data.idioms.length,30);assert.equal(data.sayings.length,32);
  assert.equal(new Set([...data.idioms,...data.sayings].map(x=>x.id)).size,62);
  assert.equal(new Set(data.idioms.map(x=>x.title)).size,30);
  assert.equal(new Set(data.sayings.map(x=>x.front)).size,32);
});
for(const e of data.idioms)test('idiom source, age boundary and understandable example: '+e.title,()=>{
  assert.equal(e.kind,'idiom');
  assert(e.title.length>=4&&e.title.length<=8);
  assert(e.meaning.length>=5);
  assert.equal(e.steps.length,3);
  assert(e.steps.every(s=>s.length>=5));
  assert(e.example.length>8&&e.pitfall.length>6);
  assert(e.source.work&&e.source.era&&e.source.note);
  assert.match(e.source.url,/^https:\/\//);
  assert(/书籍年代不等于/.test(e.source.note));
});
for(const e of data.sayings)test('saying exposes no unverified exact first-use date: '+e.front,()=>{
  assert.equal(e.kind,'saying');
  assert(e.front.length>=3&&e.back.length>=2);
  assert(e.meaning.length>=8&&e.example.length>=8);
  assert.match(e.source.era,/年代未详|年代未详|年代未详|年代未详/);
  assert.match(e.source.note,/不编造|不等于/);
  assert(!e.source.url);
});
test('20 more characters are integrated with the original 102 and 112 reading cards',()=>{
  assert.equal(extra.entries.length,20);
  assert.equal(chars.entries.length,132);
  assert.equal(new Set(chars.entries.map(e=>e.char)).size,122);
  const stroke={window:{}};vm.runInNewContext(fs.readFileSync(path+'stroke-data.js','utf8'),stroke);
  vm.runInNewContext(fs.readFileSync(path+'stroke-extra.js','utf8'),stroke);
  assert.equal(Object.keys(stroke.window.ChineseStrokes).length,122);
  for(const e of extra.entries){
    assert(stroke.window.ChineseStrokes[e.char]);
    assert.equal(e.words.length,3);
    assert(e.words.every(w=>w.includes(e.char)));
    assert(e.sentence.includes(e.char));
    const phrases=supplemental.collocations[e.id];
    assert.equal(phrases.length,3);
    phrases.forEach((s,i)=>assert(s.includes(e.words[i]),e.id+' '+s+' needs '+e.words[i]));
  }
});
test('navigation connects existing character cards and new phrase section, offline only',()=>{
  const html=fs.readFileSync(path+'index.html','utf8');
  const phrase=fs.readFileSync(path+'phrases.html','utf8');
  assert.match(html,/href="phrases.html"/);
  assert.match(html,/src="extra-characters.js"/);
  assert.match(html,/src="stroke-extra.js"/);
  assert.match(phrase,/src="phrases-data.js"/);
  assert.match(phrase,/src="phrases.js"/);
  assert.doesNotMatch(phrase,/https?:\/\/[^\s"'<>]+\.js/);
});
