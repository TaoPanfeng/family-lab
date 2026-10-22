#!/usr/bin/env node
'use strict';
// 可选本机服务：适用于浏览器禁止 file:// 或开发调试。不向局域网开放。
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=fs.realpathSync(__dirname),requested=Number(process.env.PORT||8787);
if(!Number.isInteger(requested)||requested<1||requested>65535){console.error('PORT 必须在 1–65535 之间。');process.exit(1);}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(e){res.writeHead(400);res.end('Bad request');return;}
  const target=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.realpath(target,(err,real)=>{if(err){res.writeHead(404);res.end('Not found');return;}if(real!==root&&!real.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
    fs.stat(real,(error,stat)=>{if(error||!stat.isFile()){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(real)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});if(req.method==='HEAD')res.end();else fs.createReadStream(real).on('error',()=>res.destroy()).pipe(res);});});
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?`端口 ${requested} 已被占用。可设置 PORT 为其他本机端口后重试。`:e.message);process.exitCode=1;});
server.listen(requested,'127.0.0.1',()=>console.log(`身有度：打开 http://127.0.0.1:${requested}\n按 Ctrl+C 结束。仅本机可访问，无需联网。`));
