'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const B=require('../projects/biology/process-models.js');
test('division has continuous positions across every pedagogic boundary, stable IDs and finite values',()=>{
 for(const mode of ['mitosis','meiosis']){
  let previous=B.state(mode,0);
  for(let k=1;k<=3000;k++){
   const next=B.state(mode,k/3000);
   assert.deepEqual(next.chromosomes.map(x=>x.id),previous.chromosomes.map(x=>x.id));
   for(let i=0;i<8;i++){
    const a=next.chromosomes[i],b=previous.chromosomes[i];
    assert(Number.isFinite(a.x+a.y+a.visible));
    assert(Math.hypot(a.x-b.x,a.y-b.y)<3,`${mode} jumps at ${k/3000}`);
   }
   previous=next;
  }
 }
});
test('DNA is duplicated once, daughter cells receive the expected chromosome complement',()=>{
 for(const mode of ['mitosis','meiosis']){
  assert.equal(B.state(mode,0).totalDNA,4);assert.equal(B.state(mode,.2).totalDNA,8);
  assert.equal(B.state(mode,1).totalDNA,8);
  const result=B.state(mode,1),groups={};
  result.chromosomes.forEach(x=>{(groups[x.daughter]??=[]).push(x);});
  assert.equal(Object.keys(groups).length,mode==='mitosis'?2:4);
  for(const group of Object.values(groups)){assert.equal(group.length,mode==='mitosis'?4:2);assert.equal(new Set(group.map(x=>x.pair)).size,2);if(mode==='meiosis'){assert.equal(new Set(group.map(x=>x.poleSide)).size,1);assert.equal(new Set(group.map(x=>x.parent)).size,2);}}
 }
});
test('respiration is continuous, time-based, bounded, and independently frequency-scaled',()=>{
 assert.equal(B.breathing(12,60,0).seconds,0);
 assert.equal(B.breathing(12,60,1).seconds,18);
 const a=B.breathing(12,100,2.5/18);assert(Math.abs(a.expansion-1)<1e-9);
 assert(Math.abs(B.breathing(24,100,1.25/18).expansion-1)<1e-9);
 for(let t=0;t<=1;t+=.001){const b=B.breathing(30,60,t);assert(b.expansion>=0&&b.expansion<=.6+1e-9);}
});

const geoProjection=require('../projects/geography/map-engine.js');
const vm=require('node:vm'),fs=require('node:fs');
const geo={};geo.window=geo;vm.createContext(geo);for(const f of ['data.js','countries.js','terrain.js'])vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../projects/geography',f),'utf8'),geo);
test('全部177个离线国家地区及投影中心都有限；正背半球区别正确',()=>{
 assert.equal(geo.GeoCountries.length,177);
 for(const country of geo.GeoCountries){assert(country.name.length>0);assert(country.geometry.coordinates.length>0);for(const center of [[0,0],[120,38],[-120,-45]]){const p=geoProjection.globePoint(...country.center,...center);assert(p.every(Number.isFinite));assert(Math.abs(p.reduce((s,v)=>s+v*v,0)-1)<1e-10);}}
 assert(geoProjection.globePoint(0,0,0,0)[2]>.99);assert(geoProjection.globePoint(180,0,0,0)[2]<-.99);
});
test('山脉轴线为线形；测高样本20峰降序，未知高程不伪造',()=>{
 assert.equal(geo.GeoData.heights.length,20);for(let i=1;i<20;i++)assert(geo.GeoData.heights[i-1].height>=geo.GeoData.heights[i].height);
 assert.equal(geo.GeoData.heights[0].height,8848.86);assert.equal(geo.GeoData.mountains.find(x=>x.name==='昆仑山脉').height,undefined);
 assert(Object.values(geo.GeoData.rangeAxes).every(points=>points.length>=3&&points.every(p=>p[0]>=70&&p[0]<=135&&p[1]>=20&&p[1]<=55)));
});
const hand=require('../projects/martial/hands.js');
test('摊伏掌向不同，握拳与拇指外置可区分',()=>{
 const tan=hand.handState('tan',.5,'l',false),fook=hand.handState('fook',.5,'l',false);
 assert(tan.normal[1]>0);assert(fook.normal[1]<0);assert(tan.curl<fook.curl);
});

const cosmos=require('../projects/cosmos/process-models.js');
test('光行时来自真实距离，已走与剩余相加恒定；时间拖动必须改变读数',()=>{
 for(const destination of ['sun','moon','proxima']){
  const start=cosmos.light(destination,0),a=cosmos.light(destination,.2),b=cosmos.light(destination,.7),end=cosmos.light(destination,1);
  assert.equal(start.elapsed,0);assert.equal(end.remaining,0);assert(end.arrived);assert(!b.arrived);
  assert(b.elapsed>a.elapsed);assert.equal(b.total,a.total);
  assert(Math.abs(a.elapsed+a.remaining-a.total)<1e-6);
  assert(Math.abs(b.travelled/b.elapsed-299792.458)<1e-8);
 }
 assert(Math.abs(cosmos.light('sun',1).total-499.004783836)<1e-6);
 assert.throws(()=>cosmos.light('unlisted',.2));assert.throws(()=>cosmos.light('sun',NaN));
});
test('拉尼亚凯亚与可观测宇宙使用不同几何、配色、空间定义，且可重复',()=>{
 const a=cosmos.morphology(7),b=cosmos.morphology(8);
 assert.notEqual(a.kind,b.kind);assert.notDeepEqual(a.points,b.points);assert.notEqual(a.lines.length,b.lines.length);
 assert.equal(a.kind,'velocity-basin');assert.equal(b.kind,'observable-volume');
 assert.deepEqual(cosmos.morphology(8),b);assert(b.width/a.width>170);
 for(const model of [a,b,cosmos.morphology(6)])for(const dot of model.points){assert(dot.p.every(Number.isFinite));assert(dot.color.every(n=>n>=0&&n<=1));}
 assert(cosmos.morphology(6).markers.some(m=>m.name.includes('在星系团外')));
});
const optics=require('../projects/physics/optics/model.js');
const slit={wavelength:550,separation:.25,width:.04,distance:3,mode:'double'};
test('双缝中心亮纹为1，左右对称；理论暗纹与衍射零点由公式给出',()=>{
 assert.equal(optics.doubleSlit(slit,0).intensity,1);
 for(let mm=-40;mm<=40;mm+=.13){const a=optics.doubleSlit(slit,mm),b=optics.doubleSlit(slit,-mm);assert(Math.abs(a.intensity-b.intensity)<1e-12);assert(a.intensity>=0&&a.intensity<=1);}
 const {lambda,d,a,L}=optics.parameters(slit);
 const yDark=1000*L*Math.tan(Math.asin(lambda/(2*d)));
 const yEnvelopeZero=1000*L*Math.tan(Math.asin(lambda/a));
 assert(optics.doubleSlit(slit,yDark).intensity<1e-20);
 assert(optics.doubleSlit(slit,yEnvelopeZero).intensity<1e-20);
 assert(Math.abs(optics.doubleSlit(slit,0).fringeMillimeters-6.6)<1e-10);
});
test('改变缝距、距离与波长影响条纹；闭一缝或无相干模式只保留包络',()=>{
 const before=optics.doubleSlit(slit,0).fringeMillimeters;
 assert.equal(optics.doubleSlit({...slit,separation:.5},0).fringeMillimeters,before/2);
 assert.equal(optics.doubleSlit({...slit,distance:6},0).fringeMillimeters,before*2);
 for(const mode of ['single','incoherent']){const s=optics.doubleSlit({...slit,mode},3.3);assert.equal(s.intensity,s.envelope);}
 assert(optics.doubleSlit({...slit,mode:'single'},3.3).intensity>optics.doubleSlit(slit,3.3).intensity+.9);
});
test('Fizeau 首消光由光程和齿数推导；次亮点恢复，观察的反算值不是任意转速',()=>{
 const p={length:8.633,teeth:720,frequency:0},zero=optics.fizeau(p);
 assert.equal(zero.transmission,1);assert(!zero.firstMinimum);
 assert(Math.abs(zero.roundTrip-2*8633/299792458)<1e-15);
 const dark=optics.fizeau({...p,frequency:zero.firstDark});
 assert(dark.transmission<1e-12);assert(dark.pulseBlocked);assert(dark.firstMinimum);assert(Math.abs(dark.inferredC-299792458)<1e-6);
 assert(Math.abs(dark.angleDegrees-360/(2*720))<1e-12);
 assert(Math.abs(optics.fizeau({...p,frequency:2*zero.firstDark}).transmission-1)<1e-12);
 assert(!optics.fizeau({...p,frequency:2*zero.firstDark}).firstMinimum);
 assert.equal(optics.fizeau({...p,teeth:1440}).firstDark,zero.firstDark/2);
 assert.equal(optics.fizeau({...p,length:p.length*2}).firstDark,zero.firstDark/2);
});
test('Fizeau 光点、时间和齿轮角度同源，旋转周期使回光周期变化',()=>{
 const p={length:8.633,teeth:720,frequency:12};const a=optics.fizeau(p,.2),b=optics.fizeau(p,.8);
 assert(Math.abs(b.elapsed/a.elapsed-4)<1e-12);assert(Math.abs(b.angle/a.angle-4)<1e-12);
 assert(!b.pulseReturned);assert(optics.fizeau(p,1).pulseReturned);
 for(let f=0;f<=100;f+=.031){const s=optics.fizeau({...p,frequency:f});assert(s.transmission>=0&&s.transmission<=1);assert(Number.isFinite(s.angle));}
});
test('数值模型拒绝非法输入，不把 NaN 或错误几何画成正常结果',()=>{
 for(const change of [{wavelength:NaN},{separation:.01},{width:-1},{distance:0},{mode:'bogus'}])assert.throws(()=>optics.doubleSlit({...slit,...change},0));
 for(const p of [{length:0,teeth:720,frequency:10},{length:8,teeth:1.5,frequency:10},{length:8,teeth:720,frequency:-1}])assert.throws(()=>optics.fizeau(p));
 assert.throws(()=>B.state('mitosis',NaN));assert.throws(()=>B.breathing(12,60,NaN));
});
