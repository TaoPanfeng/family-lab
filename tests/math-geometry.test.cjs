'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../projects/math/proofs.js'),V=require('../projects/math/proof-engine.js');
require('../projects/math/proof-geometry.js')(P,V);
const polygons=(id,route,step)=>[...V.draw(id,route,step).svg.matchAll(/<polygon points="([^"]+)"/g)].map(m=>m[1].trim().split(/\s+/).map(p=>p.split(',').map(Number)));
const signedArea=points=>points.reduce((sum,[x,y],i)=>{const [X,Y]=points[(i+1)%points.length];return sum+x*Y-y*X;},0)/2;
const area=points=>Math.abs(signedArea(points));
const near=(a,b,eps=1e-7)=>assert.ok(Math.abs(a-b)<=eps,`${a} != ${b}`);
test('parallelogram cut keeps area and the moved triangle exactly fills the rectangular gap',()=>{
 const original=polygons('triangle-area',0,0)[0],finished=polygons('triangle-area',0,4);
 near(area(original),300*150);assert.equal(finished.length,2);near(finished.reduce((sum,p)=>sum+area(p),0),area(original));
 for(const p of finished)for(const[x,y]of p)assert.ok(x>=130&&x<=430&&y>=70&&y<=220);
 const originalCut=[[130,70],[70,220],[130,220]];assert.deepEqual(finished[1],originalCut.map(([x,y])=>[x+300,y]));
});
test('two trapezoids share only their joining waist and cover the expected parallelogram area',()=>{
 const [first,second]=polygons('area',2,5);near(area(first),27000);near(area(second),27000);near(area(first)+area(second),360*150);
 const shared=first.filter(([x,y])=>second.some(([X,Y])=>x===X&&y===Y));assert.equal(shared.length,2);
 // On the two sides of joining line B=(200,80), C=(280,230), the interiors have opposite signs.
 const side=([x,y])=>80*(y-80)-150*(x-200);
 assert.ok(first.filter(p=>side(p)!==0).every(p=>side(p)>0));assert.ok(second.filter(p=>side(p)!==0).every(p=>side(p)<0));
});
test('Pythagorean square layout contains four congruent triangles and a genuine central square',()=>{
 const ps=polygons('pythagoras',0,2),tris=ps.slice(0,4),center=ps[4];assert.equal(ps.length,5);
 for(const p of tris)near(area(p),100*150/2);near(area(center),100**2+150**2);
 for(let i=0;i<4;i++){
  const a=center[i],b=center[(i+1)%4],c=center[(i+2)%4];
  near((b[0]-a[0])**2+(b[1]-a[1])**2,32500);
  near((a[0]-b[0])*(c[0]-b[0])+(a[1]-b[1])*(c[1]-b[1]),0);
 }
 near(tris.reduce((sum,p)=>sum+area(p),0)+area(center),250**2);
});
test('actual inner and outer polygon areas squeeze the circle and narrow with refinement',()=>{
 let previousGap=Infinity;
 for(const step of [2,3,4,5]){
  const [inner,outer]=polygons('circle',1,step);const lo=area(inner),hi=area(outer),exact=Math.PI*105**2;
  assert.ok(lo<exact&&hi>exact);assert.ok(hi-lo<previousGap);previousGap=hi-lo;
  for(const[x,y]of inner)near(Math.hypot(x-240,y-175),105);
 }
});
test('every geometry route has one valid offline MathML formula per actual step',()=>{
 const katex=require('../shared/vendor/katex/katex.min.js');let count=0;
 for(const id of ['area','triangle-area','triangle-sum','pythagoras','circle','trig-identities','trig-functions','right-trig','sine-cosine-law','radians'])
  for(let route=0;route<P[id].routes.length;route++)for(let step=0;step<P[id].routes[route].steps.length;step++){
   const d=V.draw(id,route,step);assert.equal(d.note,P[id].routes[route].steps[step]);assert.match(katex.renderToString(d.formula,{throwOnError:true,output:'mathml'}),/<math/);count++;
  }
 assert.ok(count>=120);
});
