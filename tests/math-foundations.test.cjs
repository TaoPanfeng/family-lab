'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const install=require('../projects/math/proof-foundations.js'),math=install.math;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
test('complement and Pascal counts agree with enumerated subsets, including endpoints',()=>{
 for(let n=0;n<=9;n++)for(let k=0;k<=n;k++){
  let count=0;for(let mask=0;mask<(1<<n);mask++)if(mask.toString(2).replaceAll('0','').length===k)count++;
  assert.equal(math.choose(n,k),count);assert.equal(math.choose(n,k),math.choose(n,n-k));
  assert.equal(math.choose(n,k)+math.choose(n,k-1),math.choose(n+1,k));
 }
});
test('mean loss decomposition holds for signed and repeated data',()=>{
 for(const xs of [[1,2,6],[-3,-3,0,8],[7],[2,2,2]]){
  const mean=xs.reduce((a,b)=>a+b,0)/xs.length;
  for(const a of [-5,0,mean,4.5])near(math.loss(xs,a),math.loss(xs,mean)+xs.length*(mean-a)**2);
 }
});
test('right Riemann closed form matches independent finite sums and left gap',()=>{
 for(const n of [1,2,3,10,80]){
  let right=0,left=0;for(let k=0;k<n;k++){left+=(k/n)**2/n;right+=((k+1)/n)**2/n;}
  near(math.rightSum(n),right);near(right-left,1/n);assert.ok(left<1/3&&right>1/3);
 }
});
test('shearing a column preserves determinant, including vertical first columns',()=>{
 for(const [a,b,c,d] of [[3,1,1,2],[0,4,2,3],[-2,3,5,-7],[0,0,0,4]])for(const t of [-2,0,.7,4])near(math.det(a,b-t*a,c,d-t*c),math.det(a,b,c,d));
});
test('Bayes diagram uses joint area, not sensitivity, and empty B stays undefined',()=>{
 const r=math.bayes(.25,.6,.2);near(r.joint,.15);near(r.total,.3);near(r.posterior,.5);
 assert.equal(math.bayes(.25,0,0),null);near(math.bayes(.01,.9,.1).posterior,.009/.108);
});
test('every foundational step produces parseable offline MathML and an explicit diagram',()=>{
 const P=require('../projects/math/proofs.js'),V=require('../projects/math/proof-engine.js');install(P,V);
 const katex=require('../shared/vendor/katex/katex.min.js');
 const ids='real-numbers permutations binomial-theorem derivative-intro derivatives optimization integral fundamental mean least-squares determinant inverse-matrix dot-product orthogonal bayes conditional sets combinatorics'.split(' ');
 for(const id of ids)for(let r=0;r<P[id].routes.length;r++){
  let prev='';
  for(let n=0;n<P[id].routes[r].steps.length;n++){
   const out=V.draw(id,r,n);assert.match(out.svg,/viewBox="0 0 600 360"/);assert.match(out.svg,/aria-label=/);assert.ok(out.note.length>12);
   assert.match(katex.renderToString(out.formula,{output:'mathml',throwOnError:true}),/<math/);
   assert.notEqual(out.formula+'|'+out.note,prev);prev=out.formula+'|'+out.note;
  }
 }
});
