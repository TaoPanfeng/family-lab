'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('../projects/history/node_modules/jsdom'),S=require('../portal/home.js'),catalog=require('../catalog.json');
const text=item=>[item.id,item.name,item.subtitle,item.english,item.question,item.description,...item.tags,...item.keywords].join(' ');
test('topic search finds verified content even when the gallery card does not spell it out',()=>{
 for(const[query,ids]of [['咖啡',['biology']],['麦哲伦',['geography']],['勾股',['math']],['汉字',['chinese']],['氧气',['chemistry','biology']],['牛顿 加速度',['physics']],['ＭＡＴＨ',['math']],['',catalog.map(x=>x.id)],['000-not-present',[]]])assert.deepEqual(catalog.filter(item=>S.matches(text(item),query)).map(x=>x.id),ids,query);
});
test('clear button and Escape restore actual cards and keep focus in the search field',t=>{
 const html=fs.readFileSync('index.html','utf8').replace(/<script>[\s\S]*?<\/script>/g,'');const d=new JSDOM(html,{runScripts:'outside-only',url:'https://family-lab.test/'});t.after(()=>d.window.close());const w=d.window;w.eval(fs.readFileSync('portal/home.js','utf8'));
 const input=w.document.querySelector('#museum-search'),clear=w.document.querySelector('#search-clear'),shown=()=>[...w.document.querySelectorAll('.grid .card')].filter(e=>!e.hidden).length;
 input.value='不存在的主题';input.dispatchEvent(new w.Event('input'));assert.equal(shown(),0);assert(!clear.hidden);assert(!w.document.querySelector('#home-empty').hidden);
 clear.focus();clear.click();assert.equal(shown(),16);assert.equal(w.document.activeElement,input);assert(clear.hidden);
 input.value='咖啡';input.dispatchEvent(new w.Event('input'));assert.equal(shown(),1);input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(shown(),16);assert.equal(input.value,'');assert.equal(w.document.activeElement,input);
});
