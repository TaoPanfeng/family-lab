'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');const inputs={'STYLE':'assets/style.css','CATALOG':'src/catalog.js','PHYSICS':'src/physics.js','SCENE':'src/scene.js','APP':'src/app.js'};
let html=fs.readFileSync(path.join(root,'src/index.template.html'),'utf8');
for(const [key,file] of Object.entries(inputs)){let text=fs.readFileSync(path.join(root,file),'utf8');if(key!=='STYLE')text=text.replace(/<\/script/gi,'<\\/script');html=html.replace('/*__'+key+'__*/',()=>text);}
if(/\/\*__[A-Z]+__\*\//.test(html))throw Error('Unresolved build marker');
fs.writeFileSync(path.join(root,'index.html'),html);console.log('Built offline index.html: '+Buffer.byteLength(html)+' bytes');
const manifest={version:'1.0.0',sha256:crypto.createHash('sha256').update(html).digest('hex'),bytes:Buffer.byteLength(html),inputs:['src/index.template.html',...Object.values(inputs)]};fs.writeFileSync(path.join(root,'BUILD_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
