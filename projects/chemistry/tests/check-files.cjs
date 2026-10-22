'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const assets=Array.from(html.matchAll(/(?:src|href)="([^"#]+)"/g)).map(x=>x[1]).filter(x=>!/^https?:|^data:/.test(x));
for(const file of assets){assert.ok(fs.existsSync(path.join(dist,file)),`Missing local asset: ${file}`);assert.ok(fs.statSync(path.join(dist,file)).size>0,`Empty asset: ${file}`);}
for(const file of fs.readdirSync(dist).filter(x=>x.endsWith('.js'))){new vm.Script(fs.readFileSync(path.join(dist,file),'utf8'),{filename:file});}
assert.ok(html.includes('lang="zh-CN"'),'Chinese document language');
assert.ok(html.includes('name="viewport"'),'Responsive viewport');
assert.equal(/<script[^>]+src="https?:/.test(html),false,'Core scripts must work offline');
assert.equal(/<link[^>]+href="https?:/.test(html),false,'Core styles must work offline');
console.log(`PASS: ${assets.length} local assets, JavaScript syntax, viewport and offline dependency checks.`);
