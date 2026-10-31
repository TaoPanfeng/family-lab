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
const byId=new Map([...data.idioms,...data.sayings].map(e=>[e.id,e]));
function sourceUrl(value){
  const url=new URL(value);
  assert.equal(url.protocol,'https:');
  assert(['ctext.org','zh.wikisource.org','www.zdic.net','dict.idioms.moe.edu.tw','dict.revised.moe.edu.tw'].includes(url.hostname));
  assert.equal(url.username,'');assert.equal(url.password,'');
}
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
  sourceUrl(e.source.url);
  // Check the boundary's meaning rather than requiring identical boilerplate on every card.
  assert.match(e.source.note,/年代|时期|时间|日期/);
  assert.match(e.source.note,/不等于|不能|不同|不断言|不是/);
});
for(const e of data.sayings)test('saying exposes no unverified exact first-use date: '+e.front,()=>{
  assert.equal(e.kind,'saying');
  assert(e.front.length>=3&&e.back.length>=2);
  assert(e.meaning.length>=8&&e.example.length>=8);
  assert.match(e.source.era,/未详|不详|待考/);
  assert.match(e.source.note,/不编造|不等于|不能证明|不断言|不直接/);
  // A dictionary can document a saying without establishing its first use.
  if(e.source.url){
    sourceUrl(e.source.url);
    assert.match(e.source.work,/辞典|词典|典籍|小说|传|记/);
    assert(e.source.type.length>3);
  }else{
    assert.match(e.source.work+' '+e.source.note,/民间|传说|故事|叙事|文献|未核查/);
  }
});
test('reviewed homophones identify the actual characters and pronunciation',()=>{
  const nephew=byId.get('x05');
  assert.match(nephew.meaning,/舅（jiù）与旧（jiù）同音/);
  assert.doesNotMatch(nephew.meaning,/照与照旧/);
  assert.equal(new URL(nephew.source.url).searchParams.get('ID'),'160572');
  assert.match(byId.get('x14').meaning,/普通话声调不同/);
  assert.match(byId.get('x30').meaning,/赶（gǎn）与敢（gǎn）同音/);
  assert.match(byId.get('x16').meaning,/并不会真的把人变扁/);
  assert.match(byId.get('x17').meaning,/旁人/);
});
test('documented usage and variants do not become fabricated first-use dates',()=>{
  for(const [id,dictId] of [['x01','118180'],['x16','30112'],['x31','39731'],['x32','127537']]){
    const e=byId.get(id);
    assert.equal(new URL(e.source.url).hostname,'dict.revised.moe.edu.tw');
    assert.equal(new URL(e.source.url).searchParams.get('ID'),dictId);
    assert.match(e.source.era,/未详|不详|待考/);
  }
  assert.match(byId.get('x32').source.work,/七上八落/);
  assert.match(byId.get('x32').source.note,/不直接.*七上八下.*最早/);
  assert.match(byId.get('i30').source.work,/朱子语类.*可能/);
  assert.match(byId.get('i30').source.era,/未核实/);
  assert.match(byId.get('i20').source.note,/历代名画记.*拾遗记/);
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
