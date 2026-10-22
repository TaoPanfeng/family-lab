'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),net=require('node:net'),path=require('node:path'),{spawn,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
function request(port,url='/',method='GET'){return new Promise((resolve,reject)=>{const req=http.request({hostname:'127.0.0.1',port,path:url,method},res=>{const chunks=[];res.on('data',b=>chunks.push(b));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString('utf8')}));});req.on('error',reject);req.end();});}
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
test('可选本机静态服务',async t=>{
  const port=await freePort(),child=spawn(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
  t.after(()=>child.kill());
  await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('服务启动超时')),5000);child.once('error',e=>{clearTimeout(timeout);reject(e);});child.once('exit',code=>{clearTimeout(timeout);reject(new Error('服务提前退出：'+code));});child.stdout.on('data',b=>{if(b.toString().includes('http://127.0.0.1')){clearTimeout(timeout);resolve();}});});
  await t.test('主页返回独立应用',async()=>{const r=await request(port);assert.equal(r.status,200);assert.ok(r.body.includes('window.PostureLab='));assert.match(r.headers['content-type'],/text\/html/);});
  await t.test('HEAD 只返回响应头',async()=>{const r=await request(port,'/','HEAD');assert.equal(r.status,200);assert.equal(r.body,'');assert.ok(Number(r.headers['content-length'])>100000);});
  await t.test('可读源码返回正确类型',async()=>{const r=await request(port,'/src/core.js');assert.equal(r.status,200);assert.match(r.headers['content-type'],/javascript/);});
  await t.test('未知路径返回404',async()=>assert.equal((await request(port,'/missing-file')).status,404));
  await t.test('不暴露目录列表',async()=>assert.equal((await request(port,'/src/')).status,404));
  await t.test('不允许上传或任意写入',async()=>{const r=await request(port,'/','POST');assert.equal(r.status,405);assert.equal(r.headers.allow,'GET, HEAD');});
  await t.test('畸形URL安全拒绝',async()=>assert.equal((await request(port,'/%ZZ')).status,400));
  await t.test('目录穿越安全拒绝',async()=>assert.equal((await request(port,'/..%2f..%2fetc%2fpasswd')).status,403));
  await t.test('不接受非法端口',()=>{const result=spawnSync(process.execPath,['server.cjs'],{cwd:root,env:{...process.env,PORT:'99999'},encoding:'utf8'});assert.equal(result.status,1);assert.match(result.stderr,/PORT/);});
});
