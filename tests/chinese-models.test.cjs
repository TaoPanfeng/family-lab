'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const D=require('../projects/chinese/data.js'),M=require('../projects/chinese/model.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync('projects/chinese/stroke-data.js','utf8'),context);const S=context.window.ChineseStrokes;
const entry=id=>D.entries.find(e=>e.id===id);
test('112 reading entries, 102 unique characters, matching offline vector data',()=>{
 assert.equal(D.entries.length,112);assert.equal(new Set(D.entries.map(e=>e.char)).size,102);assert.equal(new Set(D.entries.map(e=>e.id)).size,112);
 assert.deepEqual(Object.keys(S).sort(),[...new Set(D.entries.map(e=>e.char))].sort());
});
for(const e of D.entries)test(e.id+': useful card, words, literal example and documented scope',()=>{
 assert.match(e.numberPinyin,/^[a-zv]+[1-5]$/);assert.equal([...e.char].length,1);assert.equal(e.id,e.char+'-'+e.numberPinyin);
 for(const k of ['meaning','memory','sentence','trap'])assert(e[k].length>=5, k);
 assert.equal(e.words.length,3);assert.equal(new Set(e.words).size,3);assert(e.words.every(w=>w.includes(e.char)));assert(e.sentence.includes(e.char));assert(e.parts.length>0);assert.match(e.source,/^https:\/\/humanum.arts.cuhk.edu.hk\//);
 const st=S[e.char];assert.equal(st.strokes.length,st.medians.length);assert(st.strokes.length>0);assert(st.strokes.every(s=>/^M /.test(s)));assert(st.medians.every(m=>m.length>=2&&m.every(p=>p.length===2&&p.every(Number.isFinite))));assert((st.radStrokes||[]).every(i=>Number.isInteger(i)&&i>=0&&i<st.strokes.length));
 for(const id of e.quotes){const q=D.quotes.find(x=>x.id===id);assert(q);assert(q.text.includes(e.char));if(D.entries.filter(x=>x.char===e.char).length>1)assert.equal(q.readings[e.char],e.numberPinyin);}
});
test('all 19 quotations attributed with original interpretation and source; no invented modern author',()=>{
 assert.equal(D.quotes.length,19);for(const q of D.quotes){for(const k of ['title','author','dynasty','text','explain','url'])assert(q[k]);assert(['唐','宋'].includes(q.dynasty));assert.match(q.url,/^https:\/\/(zh.wikisource.org|humanum.arts.cuhk.edu.hk)\//);}
});
test('pinyin accents and ASCII sorting independent of OS collation',()=>{
 for(const [s,t] of Object.entries({shui4:'shuì',qing1:'qīng',qing2:'qíng',jue2:'jué',jiao4:'jiào',liu2:'liú',gui1:'guī',lv4:'lǜ',nv3:'nǚ',ou3:'ǒu',hao3:'hǎo',le5:'le'}))assert.equal(M.pinyin(s),t);
 assert.equal(M.normalize('Lǜ'),'lv');assert.equal(M.normalize('lu:4'),'lv');assert.equal(M.normalize('shuì'),'shui');
 const sorted=M.filter(D.entries);assert.equal(sorted[0].id,'安-an1');assert.equal(sorted.at(-1).id,'左-zuo3');for(let i=1;i<sorted.length;i++)assert(M.compare(sorted[i-1],sorted[i])<=0);
});
test('search tone variants, traditional glyph and component, selected filters',()=>{
 for(const q of ['shui','shuì','shui4'])assert(M.filter(D.entries,{query:q}).some(e=>e.id==='睡-shui4'));
 assert(M.filter(D.entries,{query:'目'}).some(e=>e.char==='睡'));assert(M.filter(D.entries,{query:'葉'}).some(e=>e.char==='叶'));
 assert(M.filter(D.entries,{query:'不存在123'}).length===0);assert(M.filter(D.entries,{letter:'q'}).every(e=>e.numberPinyin.startsWith('q')));
 assert.deepEqual(M.filter(D.entries,{favoritesOnly:true,favorites:['睡-shui4']}).map(e=>e.id),['睡-shui4']);
});
test('etymology and mnemonic are not conflated; qing tones and stroke corrections retained',()=>{
 assert.equal(D.entries.filter(e=>e.etymology).length,4);assert.match(entry('睡-shui4').etymology.text,/声|音/);assert.match(entry('清-qing1').trap,/声调不同/);assert(!entry('虫-chong2').memory.includes('弯钩'));assert.deepEqual(entry('冬-dong1').parts,['夂','两点']);
 assert(entry('觉-jue2').quotes.length>0);assert.equal(entry('觉-jiao4').quotes.length,0);
});
test('backup merge keeps old work, rejects malformed, excessive or unknown content',()=>{
 const good={app:'family-lab-chinese',version:1,favorites:['睡-shui4'],notes:{'睡-shui4':'<img src=x onerror=alert(1)>'}};
 const current={favorites:['清-qing1'],notes:{'睡-shui4':'我的原句'}};
 assert.equal(M.mergeBackup(current,good,D.entries).notes['睡-shui4'],'我的原句');assert.equal(M.mergeBackup(current,good,D.entries).favorites.length,2);
 for(const bad of [null,{}, {...good,notes:[]},{...good,notes:{bad:'x'}},{...good,notes:{'睡-shui4':'x'.repeat(501)}},{...good,favorites:['missing']}])assert.throws(()=>M.validateBackup(bad,D.entries));
 assert.throws(()=>M.validateBackup(JSON.parse('{"app":"family-lab-chinese","version":1,"favorites":[],"notes":{"__proto__":"evil"}}'),D.entries));
});
test('licensed libraries and vector paths match recorded SHA256, with offline loader',()=>{
 const base='projects/chinese/',mf=JSON.parse(fs.readFileSync(base+'vendor/manifest.json'));assert.equal(mf.characters,102);
 for(const [name,hash] of Object.entries(mf.sha256)){const raw=fs.readFileSync(base+(name==='stroke-data.js'?'':'vendor/')+name);assert.equal(crypto.createHash('sha256').update(raw).digest('hex'),hash);}
 assert.match(fs.readFileSync(base+'app.js','utf8'),/charDataLoader:/);assert.match(fs.readFileSync(base+'vendor/HANZI_WRITER_LICENSE.txt','utf8'),/MIT/);assert.match(fs.readFileSync(base+'vendor/ARPHICPL.TXT','utf8'),/ARPHIC|Arphic/);
});
