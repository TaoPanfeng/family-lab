'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {productModel}=require('../projects/math/proof-elementary.js');
test('lattice digit diagonals preserve place value including carries for every two-digit pair',()=>{
 for(let a=0;a<=99;a++)for(let b=0;b<=99;b++){
  const m=productModel(a,b);
  assert.equal(m.value,a*b);
  assert.equal(m.partial[0]+m.partial[1],a*b);
  assert.equal(m.cells.reduce((s,c)=>s+c.value*10**c.weight,0),a*b);
  for(const col of m.columns){assert.equal(col.total,col.digit+10*col.carryOut);assert.ok(col.digit>=0&&col.digit<=9);}
 }
});
test('27 by 16 gathers exactly the shown lattice tens and incoming hundred carry',()=>{
 const m=productModel(27,16);
 assert.deepEqual(m.columns.map(c=>c.sum),[2,13,3,0]);
 assert.deepEqual(m.columns.map(c=>c.carryIn),[0,0,1,0]);
 assert.deepEqual(m.partial,[162,270]);
 assert.equal(m.value,432);
});
test('lattice demo rejects values it cannot represent',()=>{
 for(const bad of [-1,100,1.5,Infinity,'27'])assert.throws(()=>productModel(bad,16),RangeError);
});
