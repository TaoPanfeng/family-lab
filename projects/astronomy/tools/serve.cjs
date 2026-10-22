#!/usr/bin/env node
/** Optional local server; binds ONLY to loopback, never to the public network. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const requested=Number(process.env.PORT||4173);
if(!Number.isInteger(requested)||requested<1024||requested>65535)throw new Error('PORT must be an integer from 1024 through 65535.');
let port=requested;
const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);res.end('Bad URL');return;}
  const file=pathname==='/'?path.join(root,'日月地实验室.html'):path.resolve(root,'.'+pathname);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);
});
server.on('error',err=>{if(err.code==='EADDRINUSE'&&port<requested+10){port++;server.listen(port,'127.0.0.1');}else{console.error(err.message);process.exit(1);}});
server.listen(port,'127.0.0.1',()=>{console.log('Sun Earth Moon Lab: http://127.0.0.1:'+port);console.log('Keep this terminal open. Ctrl+C stops the server.');});
