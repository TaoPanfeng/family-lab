'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const catalog = JSON.parse(read('catalog.json'));
const home = read('index.html');
function resolveLocal(from, url) {
  const pathname=decodeURIComponent(url.split(/[?#]/)[0]);
  const result=path.resolve(path.dirname(path.join(root,from)),pathname);
  assert(result.startsWith(root+path.sep),'Path outside project: '+url);
  return result;
}
function refs(html, attribute) { const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,''); return [...markup.matchAll(new RegExp('\\b'+attribute+'="([^"]+)"','g'))].map(x=>x[1]); }
function local(url) { return !/^(?:[a-z]+:|\/\/|#)/i.test(url); }
test('ten independent current projects, unique identifiers and entries',()=>{
  assert.equal(catalog.length,10); assert.equal(new Set(catalog.map(x=>x.id )).size,10);
  assert.deepEqual(catalog.map(x=>x.id).sort(),['astronomy','biology','chemistry','cosmos','geography','history','martial','math','physics','posture']);
  assert.equal(new Set(catalog.map(x=>x.entry )).size,10);
});
test('each homepage card opens the original entry in a separate tab',()=>{
  const links=[...home.matchAll(/<a\b[^>]*data-project="([^"]+)"[^>]*>/g)];assert.equal(links.length,10);
  for(const item of catalog){const link=links.find(x=>x[1]===item.id)[0];assert(link.includes(`href="${item.entry}"`));assert.match(link,/target="_blank"/);assert.match(link,/rel="noopener"/);}
});
test('home has no iframe or runtime external dependency',()=>{
  assert(!/<iframe\b/i.test(home));assert(!/<script\b[^>]*src=["']https?:/i.test(home));
  for(const url of refs(home,'src'))assert(!/^https?:|^\/\//i.test(url));
  assert(!/@import\s|url\(\s*["']?https?:/i.test(home));
});
test('home entry and footer links resolve inside the repository',()=>{
  for(const url of refs(home,'href').filter(local))assert(fs.existsSync(resolveLocal('index.html',url)),url);
});
test('all source index file links exist',()=>{
  for(const url of refs(read('source.html'),'href').filter(local))assert(fs.existsSync(resolveLocal('source.html',url)),url);
});
test('nested GitHub Pages paths do not require a root-path rewrite',()=>{
  for(const item of catalog){assert(!item.entry.startsWith('/'));assert(!item.entry.includes('..'));const result=new URL(item.entry,'https://example.invalid/any-repository/');assert(result.pathname.startsWith('/any-repository/projects/'));}
});
test('compiled application entry files and direct local assets exist',()=>{
  for(const item of catalog){const text=read(item.entry);assert.match(text,/<html/i);assert.match(text,/<script/i);for(const url of [...refs(text,'src'),...refs(text,'href')].filter(local)){assert(fs.existsSync(resolveLocal(item.entry,url)),item.id+': '+url);}}
});
test('only one application folder per project; no nested original archives',()=>{
  const dirs=fs.readdirSync(path.join(root,'projects'),{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>x.name).sort();assert.deepEqual(dirs,catalog.map(x=>x.id).sort());
  function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else assert(!/\.zip$/i.test(e.name),'Duplicate archive: '+p);}}walk(path.join(root,'projects'));
});
test('all original project licenses remain present',()=>{
  for(const item of catalog)assert(fs.statSync(path.join(root,'projects',item.id,'LICENSE')).size>500);
  assert.match(read('projects/astronomy/LICENSE'),/GNU AFFERO GENERAL PUBLIC LICENSE/);
  assert.match(read('THIRD_PARTY_NOTICES.md'),/AGPL-3\.0-or-later/);
});
test('source code, build tools and imported data are retained',()=>{
  for(const file of ['projects/astronomy/src/astro.js','projects/astronomy/data/ephemeris.f32','projects/physics/src/physics.js','projects/posture/src/core.js','projects/chemistry/dist/core.js','projects/history/data/rulers-early.js'])assert(fs.statSync(path.join(root,file)).size>100);
});
test('homepage accessibility basics and responsive breakpoints exist',()=>{
  assert.match(home,/lang="zh-CN"/);assert.match(home,/name="viewport"/);assert.match(home,/href="#explore"/);assert.equal((home.match(/<h1\b/g)||[]).length,1);assert.match(home,/:focus-visible/);assert.match(home,/prefers-reduced-motion/);assert.match(home,/max-width:620px/);
});
test('homepage contains no unresolved build placeholders',()=>assert(!/\/\*__[A-Z]+__\*\//.test(home)));
test('source links do not pretend an uncreated remote repository exists',()=>{
  assert(!/github\.com\/TaoPanfeng\/family-lab/.test(home+read('source.html')));
});
test('update launcher never discards changes or force-pushes',()=>{
  const script=read('更新.cmd');assert.match(script,/git pull --ff-only/);assert.match(script,/status --porcelain/);assert.match(script,/show-toplevel/);assert(!/git\s+(reset|clean|push|stash)\b/.test(script));
});
