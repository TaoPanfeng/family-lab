'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const explore=require('../dist/explore.js');
const {createApp}=require('./dom-harness.cjs');
const scripts=['data.js','core.js','explore.js','app.js'];
const start=options=>createApp({scripts,...options});
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
const saved=a=>JSON.parse(a.storage.get('wanwu-chemistry-v1'));
const facts=(a,selector)=>Object.fromEntries(Array.from(a.el(selector).querySelectorAll('.cx-facts > div')).map(n=>[n.querySelector('span').textContent,n.querySelector('strong').textContent]));
const clean=a=>{assert.equal(a.document.querySelector('.app-error'),null);assert.deepEqual(a.errors,[]);a.close();};

test('随机衰变：同一批原子的时间往返可复现，剩余数单调且不为负',()=>{
  const lifetimes=explore.sampleLifetimes(256,987);
  assert.deepEqual(lifetimes,explore.sampleLifetimes(256,987));
  assert.notDeepEqual(lifetimes,explore.sampleLifetimes(256,988));
  assert.ok(lifetimes.every(t=>Number.isFinite(t)&&t>0));
  let previous=256;for(let time=0;time<=20;time+=.1){const remaining=explore.sampleRemaining(lifetimes,time);assert.ok(Number.isInteger(remaining)&&remaining>=0&&remaining<=previous);previous=remaining;}
  assert.equal(explore.sampleRemaining(lifetimes,1),explore.sampleRemaining(lifetimes,1));
});
test('随机衰变：大样本半衰期统计接近一半，不把单原子切成半个',()=>{
  const lifetimes=explore.sampleLifetimes(100000,12345);
  near(explore.sampleRemaining(lifetimes,1)/100000,.5,.006);
  near(explore.sampleRemaining(lifetimes,2)/100000,.25,.006);
  assert.equal(explore.sampleRemaining(lifetimes,0),100000);
  assert.equal(explore.sampleLifetimes(0).length,0);
});
test('随机衰变：拒绝非法原子数和时间边界',()=>{
  for(const n of [-1,.5,100001,NaN,Infinity])assert.throws(()=>explore.sampleLifetimes(n));
  for(const t of [-1,NaN,Infinity])assert.throws(()=>explore.sampleRemaining([1,2],t));
});
test('水的沸点：常压约100°C，降压后沸点降低，模型区间外拒绝计算',()=>{
  near(explore.boilingPoint(101.325),100,.1);
  near(explore.boilingPoint(50),81.3,.2);
  for(let p=51;p<=101;p++)assert.ok(explore.boilingPoint(p)>explore.boilingPoint(p-1));
  for(const p of [0,49.99,101.326,NaN,Infinity])assert.throws(()=>explore.boilingPoint(p));
});
test('蒸馏：0至200g全部收集边界均守恒，非挥发盐留在残液',()=>{
  for(let collected=0;collected<=200;collected++){const b=explore.distillationBalance(collected);assert.equal(b.saltRemaining,5);assert.equal(b.collected+b.residue,205);assert.equal(b.waterRemaining+collected,200);}
  for(const args of [[-1],[201],[0,-1],[0,200,-1],[NaN],[0,Infinity]])assert.throws(()=>explore.distillationBalance(...args));
});
test('结晶：饱和边界、完全蒸干与补水均保留全部食盐',()=>{
  assert.deepEqual(explore.crystallization(36,100),{dissolved:36,crystals:0,water:100,total:136});
  assert.deepEqual(explore.crystallization(60,100),{dissolved:36,crystals:24,water:100,total:160});
  for(let water=0;water<=100;water++)for(const salt of [0,5,20,36,60]){const b=explore.crystallization(salt,water);near(b.dissolved+b.crystals,salt);assert.ok(b.dissolved<=water*.36+1e-10);assert.ok(b.crystals>=0);}
  assert.equal(explore.crystallization(20,0).crystals,20);
  for(const args of [[-1,100],[20,-1],[20,NaN],[Infinity,0]])assert.throws(()=>explore.crystallization(...args));
});
test('中和：依据物质的量1:1，计入混合体积与过量一方',()=>{
  const acid=explore.neutralization(50,25);near(acid.waterMoles,.0025);near(acid.concentration,1/30);assert.equal(acid.kind,'strong-acid');
  const base=explore.neutralization(25,50);near(base.waterMoles,.0025);near(base.concentration,1/30);assert.equal(base.kind,'strong-base');
  const equal=explore.neutralization(50,50);assert.equal(equal.excess,0);near(equal.volume,.1);near(equal.waterMoles,.005);
  assert.equal(explore.neutralization(0,0).volume,0);
  for(const args of [[-1,10],[10,-1],[10,10,-1],[NaN,10],[10,10,Infinity]])assert.throws(()=>explore.neutralization(...args));
});
test('色谱：3种墨水×2种溶剂的组分与Rf有效，换溶剂可以改变顺序',()=>{
  for(const ink of ['black','purple','green'])for(const solvent of ['a','b']){const components=explore.chromatographyComponents(ink,solvent);assert.equal(components.length,ink==='black'?3:2);assert.ok(components.every(c=>c.rf>0&&c.rf<1));assert.equal(new Set(components.map(c=>c.name)).size,components.length);}
  const order=s=>explore.chromatographyComponents('purple',s).sort((a,b)=>b.rf-a.rf).map(c=>c.name).join();
  assert.notEqual(order('a'),order('b'));
  assert.throws(()=>explore.chromatographyComponents('unknown','a'));assert.throws(()=>explore.chromatographyComponents('black','c'));
});

const lifeCases={
  bread:[{leavening:'yeast',progress:100},{leavening:'none',progress:100}],
  apple:[{progress:100},{covered:true,acidic:true,progress:100}],
  rust:[{water:true,oxygen:true,progress:100},{water:false,oxygen:true,progress:100},{water:true,oxygen:false,progress:100},{coating:true,progress:100}],
  soap:[{soap:true,hardness:0,progress:100},{soap:true,hardness:100,progress:100},{soap:false,progress:100}],
  egg:[{heating:true,progress:100},{heating:false,progress:100}],
  scale:[{heating:true,hardness:100,progress:100},{heating:true,hardness:0,progress:100},{heating:false,hardness:100,progress:100}],
  battery:[{circuit:true,bridge:true,progress:75},{circuit:false,bridge:true,progress:75},{circuit:true,bridge:false,progress:75}],
  soda:[{opened:true,warm:true,progress:100},{opened:true,warm:false,progress:100},{opened:false,progress:100}]
};
for(const [id,conditions] of Object.entries(lifeCases))test(`生活模型：${id} 改变关键条件产生合理的定性对照`,()=>{
  const active=explore.lifeOutcome(id,conditions[0]);assert.ok(active.magnitude>0);
  for(const state of conditions.slice(1)){const result=explore.lifeOutcome(id,state);assert.ok(result.magnitude<active.magnitude);assert.ok(result.magnitude>=0&&result.magnitude<=1);assert.ok(result.status.length>0);}
  assert.equal(explore.lifeOutcome(id,{...conditions[0],progress:0}).magnitude,0);
  assert.equal(explore.lifeOutcome(id,{...conditions[0],progress:-1}).magnitude,0);
  assert.ok(explore.lifeOutcome(id,{...conditions[0],progress:200}).magnitude<=1);
});
test('生活场景表恰有8个有效场景，未知场景不会伪造结果',()=>{assert.equal(explore.lifeScenarios.length,8);assert.throws(()=>explore.lifeOutcome('unknown',{}));});

test('周期表：序数/名称检索、类别联合筛选与空结果可恢复',async()=>{
  const a=await start({route:'periodic'});a.input('#cx-element-search','8');assert.equal(a.all('[data-element]:not([disabled])').length,1);assert.match(a.el('#cx-element-detail').textContent,/氧 · O/);
  a.input('#cx-element-search','钠');assert.match(a.el('#cx-element-detail').textContent,/钠 · Na/);
  a.input('#cx-element-search','不存在元素');assert.match(a.el('.cx-result-count').textContent,/没有匹配/);assert.equal(a.all('[data-element]:not([disabled])').length,0);
  a.input('#cx-element-search','');a.input('#cx-element-category','noble-gas');assert.deepEqual(a.all('[data-element]:not([disabled])').map(n=>Number(n.dataset.element)),[2,10,18,36,54,86]);
  a.input('#cx-element-category','all');assert.equal(a.all('[data-element]:not([disabled])').length,118);clean(a);
});
test('周期表：d区分类不笼统写为过渡金属，稳定Co-59不会跳到C-14',async()=>{
  const a=await start({route:'periodic',mode:'advanced'});assert.equal(a.el('#cx-element-category option[value="transition-metal"]').textContent,'d 区金属');
  a.click('[data-element="27"]');a.click('[data-open-isotope="Co-59"]');assert.equal(a.window.location.hash,'#periodic');assert.match(a.el('#cx-stable-isotope-detail').textContent,/27 个质子，32 个中子，质量数 59/);assert.match(a.el('#cx-stable-isotope-detail').textContent,/稳定核素/);clean(a);
});
test('周期表：记录元素和同位素入口连接至正确模块',async()=>{
  const a=await start({route:'periodic?element=6'});a.click('[data-save-element]');assert.match(saved(a).notes[0].title,/碳 C/);
  a.click('[data-open-isotope="C-14"]');assert.match(a.el('#cx-atom-identity').textContent,/碳-14/);
  a.go('periodic?element=92');a.click('[data-open-isotope="U-238"]');assert.equal(a.el('#cx-decay-isotope').value,'U-238');clean(a);
});
for(const bad of ['NaN','-1','21','6.5','999'])test(`原子URL参数 ${bad} 安全回退到支持的前20号元素`,async()=>{
  const a=await start({route:'atom?element='+bad});assert.equal(a.el('#cx-protons').value,'6');assert.match(a.el('#cx-atom-identity').textContent,/碳-/);clean(a);
});
test('周期表：非法URL不崩溃，21号元素仍为有效周期表条目',async()=>{
  const a=await start({route:'periodic?element=NaN'});assert.match(a.el('#cx-element-detail').textContent,/碳 · C/);
  a.go('periodic?element=-1');assert.match(a.el('#cx-element-detail').textContent,/碳 · C/);
  a.go('periodic?element=21');assert.match(a.el('#cx-element-detail').textContent,/钪 · Sc/);clean(a);
});
test('原子搭建：质子/中子/电子分别改变身份、质量数、电荷，电子云可切换',async()=>{
  const a=await start({route:'atom'});a.click('[data-atom-preset="C-14"]');assert.match(a.el('#cx-atom-identity').textContent,/放射性/);
  a.input('#cx-neutrons',6);assert.match(a.el('#cx-atom-identity').textContent,/碳-12/);assert.match(a.el('#cx-atom-identity').textContent,/稳定核素/);
  a.input('#cx-protons',7);assert.match(a.el('#cx-atom-identity').textContent,/氮-13/);assert.match(a.el('#cx-atom-identity').textContent,/带 1 个正电荷/);
  a.click('[data-neutral]');assert.equal(a.el('#cx-electrons').value,'7');assert.match(a.el('#cx-atom-identity').textContent,/电中性/);
  a.click('[data-view="cloud"]');assert.equal(a.el('[data-view="cloud"]').getAttribute('aria-pressed'),'true');assert.match(a.el('#cx-atom-scene').textContent,/电子云概念图/);
  a.click('[data-view="shell"]');a.input('#cx-electrons',0);assert.match(a.el('#cx-atom-scene').textContent,/只显示原子核/);
  a.input('#cx-protons',20);a.input('#cx-neutrons',40);a.input('#cx-electrons',20);assert.match(a.el('#cx-atom-identity').textContent,/钙-60/);assert.match(a.el('#cx-atom-identity').textContent,/未收录稳定性/);clean(a);
});
test('原子搭建：3个挑战有错误提示、改正与独立学习进度',async()=>{
  const a=await start({route:'atom'});a.click('[data-check-atom]');assert.match(a.el('#cx-atom-feedback').textContent,/质量数/);
  for(const [id,preset] of [['carbon14','C-14'],['sodium','Na+'],['deuterium','H-2']]){a.input('#cx-atom-challenge',id);a.click(`[data-atom-preset="${preset}"]`);a.click('[data-check-atom]');assert.match(a.el('#cx-atom-feedback').textContent,/搭对啦/);}
  assert.equal(saved(a).completed.filter(x=>x.id.startsWith('atom-')).length,3);clean(a);
});
test('衰变计时器：时间往返复现同一随机样本，播放暂停、终点和重置正常',async()=>{
  const a=await start({route:'decay'});a.input('#cx-decay-time',1);const sample=a.el('#cx-decay-dots').getAttribute('aria-label');assert.equal(facts(a,'#cx-decay-stats')['理论剩余期望'],'64 个');
  a.input('#cx-decay-time',2);a.input('#cx-decay-time',1);assert.equal(a.el('#cx-decay-dots').getAttribute('aria-label'),sample);
  a.click('[data-decay-play]');a.tick(600);assert.ok(Number(a.el('#cx-decay-time').value)>1);a.click('[data-decay-play]');const paused=a.el('#cx-decay-time').value;a.tick(1000);assert.equal(a.el('#cx-decay-time').value,paused);
  a.input('#cx-decay-time',5.95);a.click('[data-decay-play]');a.tick(200);assert.equal(Number(a.el('#cx-decay-time').value),6);assert.match(a.el('[data-decay-play]').textContent,/播放时间/);
  a.click('[data-decay-reset]');assert.equal(Number(a.el('#cx-decay-time').value),0);assert.equal(a.all('#cx-decay-dots .has-decayed').length,0);clean(a);
});
test('衰变计时器：切换原子数与核素，换批次改变单次结果',async()=>{
  const a=await start({route:'decay'});a.input('#cx-decay-count',32);assert.equal(a.all('#cx-decay-dots i').length,32);
  a.input('#cx-decay-time',1);assert.equal(facts(a,'#cx-decay-stats')['理论剩余期望'],'16 个');const before=a.el('#cx-decay-dots').innerHTML;a.click('[data-decay-new]');assert.notEqual(a.el('#cx-decay-dots').innerHTML,before);
  a.input('#cx-decay-isotope','U-238');assert.match(a.el('#cx-decay-note').textContent,/铀-238/);assert.match(a.el('#cx-decay-clock').textContent,/年/);clean(a);
});
test('射线变换：α和β−正确改变核素，γ与X保持A、Z且清楚说明来源',async()=>{
  const a=await start({route:'decay',mode:'advanced'});
  for(const [ray,zBefore,aBefore,zAfter,aAfter] of [['alpha',92,238,90,234],['beta',6,14,7,14],['gamma',43,99,43,99],['x',6,12,6,12]]){
    a.click(`[data-ray="${ray}"]`);let counts=facts(a,'.cx-nuclear-count');assert.equal(counts['质子数 Z'],String(zBefore));assert.equal(counts['质量数 A'],String(aBefore));
    a.click('[data-ray-transform]');counts=facts(a,'.cx-nuclear-count');assert.equal(counts['质子数 Z'],String(zAfter));assert.equal(counts['质量数 A'],String(aAfter));
    a.click('[data-ray-transform]');assert.equal(facts(a,'.cx-nuclear-count')['质子数 Z'],String(zBefore));
  }
  assert.match(a.el('#cx-radiation-detail').textContent,/核外电子/);assert.match(a.el('#cx-radiation-detail').textContent,/没有把 X 射线作为原子核衰变/);clean(a);
});
test('射线屏障：光子为逐渐减弱模型，儿童与进阶检查题均可纠错',async()=>{
  const a=await start({route:'decay'});assert.match(a.el('#cx-shield-note').textContent,/纸/);a.click('[data-ray="gamma"]');a.input('#cx-shield','dense');assert.match(a.el('#cx-shield-note').textContent,/强度减弱/);
  a.input('#cx-shield','none');assert.match(a.el('#cx-shield-note').textContent,/没有屏障/);
  a.click('[data-checkpoint="decay-probability"] [data-answer="0"]');assert.match(a.el('.cx-answer-feedback').textContent,/再想一想/);
  a.click('[data-checkpoint="decay-probability"] [data-answer="1"]');assert.match(a.el('.cx-answer-feedback').textContent,/答对啦/);assert.ok(saved(a).completed.some(x=>x.id==='decay-probability'));clean(a);
});
test('蒸馏交互：温度与冷却门槛、降压、上限、质量账本及重置',async()=>{
  const a=await start({route:'separation'});a.click('[data-collect]');assert.match(a.el('#cx-distill-feedback').textContent,/还没到/);
  a.input('#cx-distill-pressure',50);a.input('#cx-distill-temp',90);a.check('#cx-distill-cooling',false);a.click('[data-collect]');assert.match(a.el('#cx-distill-feedback').textContent,/打开冷却水/);
  a.check('#cx-distill-cooling',true);for(let i=0;i<9;i++)a.click('[data-collect]');assert.equal(a.el('[data-collect]').disabled,true);
  const f=facts(a,'#cx-separation-stats');assert.equal(f['已收集水'],'180 g');assert.equal(f['烧瓶剩余水'],'20 g');assert.equal(f['烧瓶中的盐'],'5 g');assert.match(a.el('#cx-separation-insight').textContent,/180 g \+ 25 g = 205 g/);
  a.click('[data-distill-reset]');assert.equal(facts(a,'#cx-separation-stats')['已收集水'],'0 g');assert.equal(a.el('[data-collect]').disabled,false);clean(a);
});
test('过滤交互：半批与全批的沙、水和盐分别守恒，再过滤不脱盐',async()=>{
  const a=await start({route:'separation'});a.click('[data-separation-tab="filter"]');a.click('[data-filter-again]');assert.match(a.el('#cx-filter-feedback').textContent,/先完成/);
  a.input('#cx-filter-salt',20);a.input('#cx-filter-sand',12);a.input('#cx-filter-progress',50);let f=facts(a,'#cx-separation-stats');assert.equal(f['滤纸上的沙'],'6 g');assert.equal(f['滤液中的盐'],'10 g');assert.equal(f['滤液中的水'],'50 g');
  a.click('[data-filter-all]');a.click('[data-filter-again]');assert.match(a.el('#cx-filter-feedback').textContent,/不能除去这 20 g/);f=facts(a,'#cx-separation-stats');assert.equal(f['滤液中的盐'],'20 g');assert.equal(f['滤纸上的沙'],'12 g');
  a.click('[data-separation-tab="distill"]');a.click('[data-separation-tab="filter"]');assert.equal(a.el('#cx-filter-progress').value,'100');clean(a);
});
test('结晶交互：出现晶体、蒸干、补水重溶以及起始盐超出溶解度时结果正确',async()=>{
  const a=await start({route:'separation'});a.click('[data-separation-tab="crystal"]');a.input('#cx-crystal-evap',50);let f=facts(a,'#cx-separation-stats');assert.equal(f['仍溶解的盐'],'18 g');assert.equal(f['固体食盐'],'2 g');
  a.input('#cx-crystal-evap',100);assert.equal(facts(a,'#cx-separation-stats')['固体食盐'],'20 g');assert.equal(a.el('[data-crystal-more]').disabled,true);
  a.click('[data-crystal-reset]');assert.equal(facts(a,'#cx-separation-stats')['固体食盐'],'0 g');a.input('#cx-crystal-salt',60);assert.equal(facts(a,'#cx-separation-stats')['固体食盐'],'24 g');clean(a);
});
test('色谱交互：起点浸没不计正常展开，溶剂与墨水切换有效',async()=>{
  const a=await start({route:'separation'});a.click('[data-separation-tab="chroma"]');a.check('#cx-chroma-submerged',true);for(let i=0;i<3;i++)a.click('[data-chroma-run]');assert.match(a.el('#cx-chroma-feedback').textContent,/不能按正常色谱计算/);assert.ok(!saved(a).completed.some(x=>x.id==='separation-chromatography'));
  a.click('[data-chroma-reset]');a.check('#cx-chroma-submerged',false);for(let i=0;i<3;i++)a.click('[data-chroma-run]');assert.ok(saved(a).completed.some(x=>x.id==='separation-chromatography'));
  assert.equal(Object.keys(facts(a,'#cx-separation-stats')).length,3);const first=a.el('#cx-separation-stats').textContent;a.input('#cx-chroma-solvent','b');assert.notEqual(a.el('#cx-separation-stats').textContent,first);
  a.input('#cx-chroma-ink','green');assert.equal(Object.keys(facts(a,'#cx-separation-stats')).length,2);a.click('[data-chroma-run]');assert.equal(a.el('[data-chroma-run]').disabled,true);clean(a);
});
test('电离交互：6种溶液的pH、分子/离子解释与纯水控件状态对应',async()=>{
  const a=await start({route:'ions',mode:'advanced'});
  for(const kind of ['salt','sugar','strong-acid','strong-base','weak-acid','water']){
    a.input('#cx-ion-kind',kind);const pH=Number(facts(a,'#cx-ion-stats').pH);assert.ok(Number.isFinite(pH));
    if(['salt','sugar','water'].includes(kind))assert.equal(pH,7);if(kind==='strong-acid')near(pH,2,.001);if(kind==='strong-base')near(pH,12,.001);if(kind==='weak-acid')assert.ok(pH>2&&pH<7);
    assert.equal(a.el('#cx-ion-concentration').disabled,kind==='water');
  }
  a.input('#cx-ion-kind','sugar');assert.match(a.el('#cx-ion-description').textContent,/非电解质/);a.input('#cx-ion-kind','salt');assert.match(a.el('#cx-ion-description').textContent,/强电解质/);clean(a);
});
test('稀释交互：极稀酸趋近中性，浓度输出不会被中和控件覆盖',async()=>{
  const a=await start({route:'ions',mode:'advanced'});a.input('#cx-ion-kind','strong-acid');a.input('#cx-ion-concentration',-8);let previous=Number(facts(a,'#cx-ion-stats').pH);
  for(let i=0;i<6;i++){a.click('[data-ion-dilute]');const current=Number(facts(a,'#cx-ion-stats').pH);assert.ok(current>=previous&&current<=7);previous=current;}
  assert.equal(a.el('[data-ion-dilute]').disabled,true);const concentration=a.el('#cx-ion-concentration-out').textContent,dilution=a.el('#cx-ion-dilution-out').textContent;a.input('#cx-neutral-base',40);assert.equal(a.el('#cx-ion-concentration-out').textContent,concentration);assert.equal(a.el('#cx-ion-dilution-out').textContent,dilution);
  a.click('[data-ion-reset]');assert.equal(a.el('#cx-ion-dilution').value,'0');assert.equal(a.el('[data-ion-dilute]').disabled,false);clean(a);
});
test('中和交互：空容器不算中和，酸/碱过量与等当点反馈正确',async()=>{
  const a=await start({route:'ions'});a.input('#cx-neutral-acid',0);a.click('[data-neutral-check]');assert.match(a.el('#cx-neutral-feedback').textContent,/空容器不算中和/);assert.ok(!saved(a).completed.some(x=>x.id==='ions-neutralization'));
  a.click('[data-neutral-preset="50,25"]');assert.match(a.el('#cx-neutral-scene').textContent,/酸过量/);assert.equal(facts(a,'#cx-neutral-stats')['剩余酸 / 碱'],'2.5 mmol');
  a.click('[data-neutral-preset="25,50"]');assert.match(a.el('#cx-neutral-scene').textContent,/碱过量/);a.click('[data-neutral-check]');assert.match(a.el('#cx-neutral-feedback').textContent,/还有一方过量/);
  a.click('[data-neutral-preset="50,50"]');assert.match(a.el('#cx-neutral-scene').textContent,/pH 7/);a.click('[data-neutral-check]');assert.match(a.el('#cx-neutral-feedback').textContent,/配对成功/);assert.ok(saved(a).completed.some(x=>x.id==='ions-neutralization'));clean(a);
});
for(const mode of ['kids','advanced'])test(`生活展区：${mode} 8场景条件、推进、重置、观察记录与纠错闭环`,async()=>{
  const a=await start({route:'life',mode});
  for(const id of explore.lifeScenarios){
    a.click(`[data-life-scenario="${id}"]`);assert.equal(a.el(`[data-life-scenario="${id}"]`).getAttribute('aria-pressed'),'true');
    if(id==='bread'){a.input('#cx-life-leavening','none');a.click('[data-life-advance]');assert.match(a.el('#cx-life-status').textContent,/没有本例的产气/);a.input('#cx-life-leavening','powder');assert.match(a.el('#cx-life-equation').textContent,/HCO₃/);}
    if(id==='apple')a.check('#cx-life-covered',true);
    if(id==='rust'){a.check('#cx-life-water',false);assert.match(a.el('#cx-life-status').textContent,/缺少水/);a.check('#cx-life-water',true);}
    if(id==='soap'){a.input('#cx-life-hardness',100);assert.match(a.el('#cx-life-status').textContent,/皂垢/);}
    if(id==='egg'){a.check('#cx-life-heating',false);assert.match(a.el('#cx-life-status').textContent,/未加热/);a.check('#cx-life-heating',true);}
    if(id==='scale')a.input('#cx-life-hardness',100);
    if(id==='battery'){a.check('#cx-life-bridge',false);assert.match(a.el('#cx-life-status').textContent,/缺少离子通路/);a.check('#cx-life-bridge',true);}
    if(id==='soda'){a.check('#cx-life-opened',true);a.check('#cx-life-warm',true);}
    while(!a.el('[data-life-advance]').disabled)a.click('[data-life-advance]');assert.equal(a.el('#cx-life-progress').value,'100');a.click('[data-life-save]');assert.match(saved(a).notes[0].title,/生活观察/);
    a.click(`[data-checkpoint="life-${id}"] [data-answer="1"]`);assert.match(a.el('.cx-answer-feedback').textContent,/再想一想/);a.click(`[data-checkpoint="life-${id}"] [data-answer="0"]`);assert.match(a.el('.cx-answer-feedback').textContent,/答对啦/);
    a.click('[data-life-reset]');assert.equal(a.el('#cx-life-progress').value,'0');assert.equal(a.el('[data-life-advance]').disabled,false);
  }
  assert.equal(saved(a).completed.filter(x=>x.id.startsWith('life-')).length,8);assert.equal(saved(a).notes.filter(x=>x.title.startsWith('生活观察')).length,8);clean(a);
});
