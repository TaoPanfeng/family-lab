#!/usr/bin/env node
/** Reproducible zero-dependency single-HTML build. Node >=18. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const vendor=read('vendor/three.r140.min.js');
const metadata=JSON.parse(read('data/ephemeris.meta.json'));
const ephemeris=fs.readFileSync(path.join(root,'data/ephemeris.f32')).toString('base64');
const assets=Object.fromEntries(['earth','moon'].map(name=>[name,'data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'src/assets',name+'.jpg')).toString('base64')]));
const data='globalThis.EPHEMERIS_META='+JSON.stringify(metadata)+';\nglobalThis.EPHEMERIS_BASE64='+JSON.stringify(ephemeris)+';\nglobalThis.ASSETS='+JSON.stringify(assets)+';';
const code=['astro.js','events.js','learning.js','diagrams.js','scene.js','ui.js','v2.js'].map(p=>read('src/'+p)).join('\n\n');
for(const p of ['astro.js','events.js','learning.js','diagrams.js','scene.js','ui.js','v2.js']){
  // Syntax check without executing browser code.
  new (require('node:vm').Script)(read('src/'+p),{filename:p});
}
const escapeScript=s=>s.replace(/<\/script/gi,'<\\/script');
const html=read('src/index.template.html').replace('/*__CSS__*/',()=>read('src/styles.css')+'\n'+read('src/v2.css')).replace('/*__VENDOR__*/',()=>escapeScript(vendor)).replace('/*__DATA__*/',()=>escapeScript(data)).replace('/*__CODE__*/',()=>escapeScript(code));
const output=path.join(root,'日月地实验室.html');fs.writeFileSync(output,html);
console.log('Built '+path.basename(output)+' ('+(Buffer.byteLength(html)/1024/1024).toFixed(2)+' MB).');
console.log('SHA256 '+crypto.createHash('sha256').update(html).digest('hex'));
console.log('Double-click the HTML in Chrome / Edge. No npm install, server, or internet required.');
