#!/usr/bin/env node
'use strict';
// 仅开发时使用。把可读源码打进独立 HTML；用户运行成品不需要 Node。
const fs=require('node:fs'),path=require('node:path');
const root=__dirname,read=p=>fs.readFileSync(path.join(root,p),'utf8');
try{
  let html=read('dev.html');
  html=html.replace(/\s*<script defer src="src\/[^\"]+"><\/script>/g,'');
  html=html.replace('<link rel="stylesheet" href="assets/style.css">',()=>'<style>\n'+read('assets/style.css')+'\n</style>');
  const icon='data:image/svg+xml;base64,'+Buffer.from(read('assets/mark.svg')).toString('base64');
  html=html.replaceAll('assets/mark.svg',icon);
  const scripts=['data','core','scene','app'].map(name=>'<script>\n'+read('src/'+name+'.js').replace(/<\/script/gi,'<\\/script')+'\n</script>').join('\n');
  html=html.replace('</body>',()=>scripts+'\n</body>');
  html='<!-- 自包含离线成品。修改 src/ 或 assets/ 后运行 node build.cjs 重新生成。 -->\n'+html;
  fs.writeFileSync(path.join(root,'index.html'),html,'utf8');
  console.log('Built standalone index.html: '+Buffer.byteLength(html)+' bytes; no external runtime assets.');
}catch(error){console.error('构建失败：'+error.message);process.exitCode=1;}
