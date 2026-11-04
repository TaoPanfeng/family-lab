'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {P,V}=require('./math-proof-setup.cjs'),F=require('../shared/formula.js');
const D=require('../projects/math/data.js');
test('every proof route provides a rendered formula, a diagram and a synchronized reason at every step',()=>{
 let routes=0,steps=0;
 for(const[id,p]of Object.entries(P)){
  assert.ok(D.topics.some(t=>t.id===id),id+' resolves to a learning node');
  assert.ok(V.has(id),id+' has a diagram renderer');
  for(const [route,r]of p.routes.entries()){
   routes++;let previous;
   for(const [step,wording]of r.steps.entries()){
    steps++;const frame=V.draw(id,route,step),key=id+'/'+route+'/'+step;
    assert.ok(frame.svg.includes('<svg')&&frame.svg.includes('role="img"'),key+' accessible SVG');
    assert.ok(frame.svg.includes('viewBox="0 0 600 360"'),key+' consistent viewport');
    assert.ok(!/NaN|Infinity|undefined|<script|onload=/.test(frame.svg),key+' finite inert geometry');
    assert.ok(frame.note&&frame.note.length>=8,key+' explains the current reasoning');
    assert.ok(frame.formula&&frame.formula.length>=2,key+' formula');
    assert.ok(F.math(frame.formula,true).includes('<math'),key+' offline textbook formula');
    assert.ok(!/^证明步骤\s*\d+$/.test(frame.note),key+' no placeholder');
    const meaning=JSON.stringify([frame.formula,frame.note]);
    assert.notEqual(meaning,previous,key+' substantive step change');previous=meaning;
    assert.ok(wording.length>=5,key+' substantive written step');
   }
  }
 }
 assert.ok(routes>=100,'retain multiple methods rather than a single route per result');
 assert.ok(steps>=450,'retain complete reasoning rather than collapse proof steps');
});
test('required calculation and geometry routes are present without a circular Pythagorean proof',()=>{
 const names=id=>P[id].routes.map(r=>r.name).join(' ');
 assert.match(names('multiplication'),/竖式/);assert.match(names('multiplication'),/格子/);
 assert.ok(P.multiplication.routes.length>=4);
 assert.doesNotMatch(names('pythagoras'),/距离公式/);
 assert.match(names('quadratic'),/顶点/);assert.match(names('conics'),/椭圆/);assert.match(names('conics'),/抛物线/);
 assert.ok(P['inverse-function']);assert.ok(P.volume);
});
