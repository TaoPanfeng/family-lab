'use strict';
// 只构建公共入口，不注入、不改写任何子项目的界面。
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalog = JSON.parse(read('catalog.json'));
const illustrations = JSON.parse(read('portal/illustrations.json'));
const cards = catalog.map((item, i) => `<article class="card ${escape(item.id)}"><a href="${escape(item.entry)}" target="_blank" rel="noopener" data-project="${escape(item.id)}" aria-label="进入${escape(item.name)}，在新标签页打开"><div class="card-top"><span class="category">${escape(item.english)}</span><span class="number">${String(i + 1).padStart(2,'0')} / ${String(catalog.length).padStart(2,'0')}</span></div><h3>${escape(item.name)}<small>${escape(item.subtitle)}</small></h3><p class="question">${escape(item.question)}</p><p class="description">${escape(item.description)}</p><div class="illustration" aria-hidden="true">${illustrations[item.id]}</div><div class="card-foot"><div class="tags">${item.tags.map(tag => `<span>${escape(tag)}</span>`).join('')}</div><span class="enter">进入探索<b aria-hidden="true">↗</b></span></div></a></article>`).join('\n');
const css = read('portal/style.css');
const html = read('portal/index.template.html').replace('/*__CSS__*/', () => css).replace('/*__CARDS__*/', () => cards).replaceAll('/*__COUNT__*/', String(catalog.length).padStart(2,'0')).replace('/*__SCRIPT__*/', () => read('portal/home.js'));
fs.writeFileSync(path.join(root, 'index.html'), html);
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    if (entry.name.startsWith('.') || ['node_modules','previews','artifacts','test-output','tmp','__pycache__'].includes(entry.name)) return [];
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  }).sort();
}
const groups = catalog.map(item => {
  const folder = path.join(root, 'projects', item.id);
  const list = walk(folder).map(file => {
    const relative = path.relative(root, file).split(path.sep).join('/');
    return `<li><a href="${escape(relative.split('/').map(encodeURIComponent).join('/'))}" target="_blank" rel="noopener">${escape(path.relative(folder,file).split(path.sep).join('/'))}</a></li>`;
  }).join('');
  return `<details><summary>${escape(item.name)} · ${escape(item.license)}</summary><p>此处提供随包源码、构建脚本、数据、测试及原有说明。运行时入口：<a href="${escape(item.entry)}" target="_blank" rel="noopener">打开${escape(item.name)}</a>。</p><ul>${list}</ul></details>`;
}).join('\n');
const source = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>源码与许可 · 家庭探索馆</title><style>${css}</style></head><body><main class="wrap source-body"><a class="back" href="index.html">← 返回探索馆</a><h1>入口统一，来源清楚。</h1><p>本合集保留各子项目的完整源码、离线成品及原有许可。下面的源码链接使用当前副本内的文件，在线、离线均可核对。</p><p>公共首页与整合工具见 <a href="LICENSE">首页许可</a>、<a href="THIRD_PARTY_NOTICES.md">子项目许可清单</a>、<a href="catalog.json">项目目录</a>。日月地保留其 AGPL-3.0-or-later 许可及相关第三方声明，其余子项目保留各自原许可。</p>${groups}<details><summary>公共首页与维护工具</summary><ul>${['portal/index.template.html','portal/style.css','portal/home.js','portal/illustrations.json','tools/build-home.cjs','tools/build.cjs','tools/test.cjs','tools/prepare-site.py','tests/portal.test.cjs','tests/browser-smoke.py','catalog.json','package.json','README.md','AGENTS.md','docs/EXPANSION.md','shared/core.js','shared/draw.js','shared/shell.js','shared/scene3d.js','shared/lab.css','tests/expansion-models.test.cjs','tests/expansion-browser.py','shared/canvas3d.js','tests/quality-browser.py','tests/refactor-models.test.cjs','docs/QUALITY_REFACTOR.md','docs/MATH_AND_EXPERIENCE.md','tests/math-models.test.cjs','tests/math-browser.py','tests/experience-browser.py'].map(f=>`<li><a href="${escape(f)}">${escape(f)}</a></li>`).join('')}</ul></details><p>旧测试报告仅代表原交付时的记录；本次整合验证请看 <a href="docs/INTEGRATION_REPORT.md">整合测试记录</a>。</p></main></body></html>`;
fs.writeFileSync(path.join(root, 'source.html'), source);
console.log(`Built homepage and source index for ${catalog.length} projects.`);
