'use strict';
// Checks the actual release entry and its local dependencies, without a server.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const html = read('index.html');
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>!x.startsWith('#'));
assert(refs.length >= 10,'Entry must declare every local asset');
for (const ref of refs) {
  assert(!/^(https?:)?\/\//i.test(ref),'No network runtime dependency: '+ref);
  const absolute = path.resolve(root,ref);
  assert(absolute.startsWith(root+path.sep),'Entry must stay inside project');
  assert(fs.existsSync(absolute),'Missing runtime asset: '+ref);
  assert(fs.statSync(absolute).size>0,'Empty runtime asset: '+ref);
}
const scripts = refs.filter(x=>x.endsWith('.js'));
for (const script of scripts) new vm.Script(read(script),{filename:script});
assert(!/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|\bimport\s*\(/.test(read('app.js')),'Offline runtime must not request a server');
assert(!/@import\s|url\(\s*["']?https?:/i.test(read('styles.css')),'Styles must not fetch fonts or CDN assets');
assert.match(html,/lang="zh-CN"/);
assert.match(html,/name="viewport"/);
for(const file of ['README.md','LICENSE','Open-History.bat','core.js','docs/MAP-NOTES.md','docs/THIRD-PARTY-NOTICES.md','docs/sources-early-notes.md','docs/sources-late-notes.md','docs/sources-content-notes.md']) assert(fs.existsSync(path.join(root,file)),'Missing documentation: '+file);
const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json'));
assert.equal(pkg.dependencies,undefined,'No runtime npm dependencies');
assert.equal(pkg.devDependencies.jsdom,'26.1.0');
assert.equal(lock.packages[''].devDependencies.jsdom,'26.1.0');
for (const item of Object.values(lock.packages)) if(item.resolved) {const url=new URL(item.resolved);assert.equal(url.hostname,'registry.npmjs.org');assert(!url.username&&!url.password,'No credentials in lockfile');}
console.log(JSON.stringify({result:'PASS',entry:'index.html',localReferences:refs.length,javascriptSyntaxChecked:scripts.length,networkRuntimeDependencies:0,documentation:'present',testDependency:'jsdom 26.1.0 (dev only)'},null,2));
