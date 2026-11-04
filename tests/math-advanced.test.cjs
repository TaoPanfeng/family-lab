'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const install=require('../projects/math/proof-advanced.js'),M=install.model;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
test('ellipse diagram coordinates satisfy both the focal definition and standard equation',()=>{
 for(const[a,b]of [[3,2],[5,1],[2,1.9]])for(let i=0;i<=24;i++){
  const {x,y,c}=M.ellipse(a,b,i*Math.PI/12);
  near(Math.hypot(x+c,y)+Math.hypot(x-c,y),2*a);near(x*x/(a*a)+y*y/(b*b),1);
 }
 assert.throws(()=>M.ellipse(2,3,0),RangeError);
});
test('parabola diagram stays equidistant from its focus and directrix',()=>{
 for(const p of [.3,.6,2])for(let y=-5;y<=5;y+=.5){const q=M.parabola(p,y);near(Math.hypot(q.x-p,y),Math.abs(q.x+p));assert.ok(q.x>=0);}
});
test('hyperbola branch obeys both squared equation and unsquared distance difference',()=>{
 for(const[a,b]of [[1.4,1],[2,3]])for(let t=-2;t<=2;t+=.1){const {x,y,c}=M.hyperbola(a,b,t);near(Math.hypot(x+c,y)-Math.hypot(x-c,y),2*a);near(x*x/(a*a)-y*y/(b*b),1);assert.ok(x>=a-1e-12);}
});
test('vertex derivation and symmetry remain valid when the quadratic opens downward',()=>{
 for(const[a,b,c]of [[1,-4,3],[-2,5,7],[.5,-3,-2],[-.2,-4,1]]){
  const {h,k}=M.vertex(a,b,c),f=x=>a*x*x+b*x+c;near(f(h),k);
  for(let t=-4;t<=4;t+=.5){near(f(h+t),f(h-t));near(f(h+t),a*t*t+k);}
 }
 assert.throws(()=>M.vertex(0,1,2),RangeError);
});
