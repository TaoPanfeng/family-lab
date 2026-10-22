'use strict';
// 把本地样式和脚本内联；双击一个 HTML 就能完整探索，不需要服务器或 CDN。
const fs=require('node:fs');
const path=require('node:path');
const root=__dirname,dist=path.join(root,'dist');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,name)=>`<style>\n${fs.readFileSync(path.join(dist,name),'utf8')}\n</style>`);
html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,name)=>`<script>\n${fs.readFileSync(path.join(dist,name),'utf8').replace(/<\/script/gi,'<\\/script')}\n</script>`);
const svg=fs.readFileSync(path.join(dist,'icon.svg'),'utf8');
const data='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
html=html.replace(/href="icon.svg"/g,`href="${data}"`).replace(/src=\\?"icon.svg\\?"/g,`src="${data}"`);
const target=path.join(root,'chemistry-explorer.html');
fs.writeFileSync(target,html);
console.log(`Offline application: ${path.basename(target)} (${Buffer.byteLength(html)} bytes)`);
