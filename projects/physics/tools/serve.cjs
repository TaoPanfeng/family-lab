'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');const requested=Number(process.env.PORT||8789);
if(!Number.isInteger(requested)||requested<1||requested>65535){console.error('PORT must be an integer between 1 and 65535.');process.exit(1);}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
function createServer(){return http.createServer((req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400);return res.end('Invalid path');}
 if(name.includes('\0')||name.includes('\\')){res.writeHead(403);return res.end('Forbidden');}
 const target=path.resolve(ROOT,'.'+(name==='/'?'/index.html':name));if(target!==ROOT&&!target.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end('Forbidden');}
 fs.stat(target,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404);return res.end('Not found');}let real;try{real=fs.realpathSync(target);}catch{res.writeHead(404);return res.end();}if(real!==ROOT&&!real.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end('Forbidden');}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Content-Length':stat.size,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});if(req.method==='HEAD')return res.end();const stream=fs.createReadStream(real);stream.on('error',()=>res.destroy());stream.pipe(res);});
 });}
function start(port,tries=0){const server=createServer();server.once('error',e=>{if(e.code==='EADDRINUSE'&&tries<8&&port<65535)start(port+1,tries+1);else{console.error(e.message);process.exitCode=1;}});server.listen(port,'127.0.0.1',()=>console.log('观物 · http://127.0.0.1:'+port+'  (Ctrl+C to stop)'));}
if(require.main===module)start(requested);module.exports={createServer,ROOT};
