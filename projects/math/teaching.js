/* Lesson-specific introduction: examples are not interchangeable with generic tools. */
(function(r){'use strict';
const F=Formula,D=MathAtlas,T=MathTeaching;
const direct=new Set('place-value addition subtraction multiplication division length clock fractions equivalent percent ratio inverse-ratio perimeter area triangle-area circle volume mean simple-equations integers linear-equation linear-function inverse-function quadratic pythagoras right-trig probability spread sets exponential arithmetic-sequence geometric-sequence radians trig-functions trig-identities vectors conics complex permutations conditional regression derivative-intro optimization integral fundamental taylor differential matrices determinant inverse-matrix rank eigen least-squares svd normal bayes graphs binary modular gradient fourier'.split(' '));
let topic=null,which=0,refresh=null,logic={w:5,h:3,reverse:false},original=new Map(),counted=new Set();
for(const t of D.topics){original.set(t.id,t.steps.slice());}
// Corrections discovered in the content audit; retain IDs and user records.
D.topics.find(t=>t.id==='logic').child='正方形一定是矩形。但一张长5、宽3的矩形卡片，能说明反过来不成立。拖一拖边长，亲手找反例。';
D.topics.find(t=>t.id==='combinatorics').steps=['20人参加画画活动，18人参加阅读活动','其中5人两项都参加，合并时这5人被数了两遍','不同人数是20+18−5=33'];
D.topics.find(t=>t.id==='inverse-matrix').steps=['A=diag(2,3)','逆矩阵diag(1/2,1/3)','先变换再逆变换，回到每个点原来的坐标，不是都回到原点'];
D.topics.find(t=>t.id==='svd').formal='实矩阵可分解为两个正交变换与非负沿轴伸缩；正交变换可能包含反射。低秩近似须指定误差范数。';
D.topics.find(t=>t.id==='topology').formal='同胚是连续双射且逆映射连续；拓扑考察这种对应保持的性质。一般的连续形变不必是同胚。';
D.topics.find(t=>t.id==='fourier').steps=['方波的首项是(4/π)sinx','依次加入(4/π)sin3x/3、(4/π)sin5x/5等奇次项','形状趋近方波；跳跃附近仍有过冲，不能把有限和当完全相同'];
D.topics.find(t=>t.id==='primes').child='7块方砖，除了排成1行或1列，不能摆成行和列都超过1的整齐长方形。';
D.topics.find(t=>t.id==='determinant').formal='二维矩阵的行列式是有向面积的缩放因子；绝对值表示通常面积放大多少倍，符号区分定向。';
D.topics.find(t=>t.id==='eigen').child='有些箭头经过变换，仍在原来的直线上：可能伸长、缩短，也可能反向或变成零。';
D.topics.find(t=>t.id==='symmetry').steps=['从同一个原点看，点(2,1)向右移3格到(5,1)','另从原来的(2,1)出发，关于y轴对称得到(−2,1)','仍从原来的(2,1)出发，绕原点逆时针旋转90°得到(−1,2)'];
for(const t of D.topics)original.set(t.id,t.steps.slice());
const $=id=>document.getElementById(id);
function math(s){return F.math(s,true);}
function exampleFormula(){if(which===0&&['addition','subtraction','multiplication','division'].includes(topic.id)){const v=window.MathTest?.getState().params||{};if(topic.id==='addition'&&v.a!==undefined)return `${v.a}+${v.b}=${v.a+v.b}`;if(topic.id==='subtraction'&&v.a!==undefined)return `${v.a}-(${v.b})=${v.a-v.b}`;if(topic.id==='multiplication'&&v.a!==undefined)return `${v.a}\\times${v.b}=${v.a*v.b}`;if(topic.id==='division'&&v.n!==undefined)return `${v.n}\\div${v.d}=${Math.floor(v.n/v.d)}${v.n%v.d?'\\;\\text{余}'+(v.n%v.d):''}`;}const worked=T[topic.id].alternate.steps.find(s=>s.includes('\\('));return which===1&&worked?worked.match(/\\\(([\s\S]*?)\\\)/)[1]:T[topic.id].formula;}
function basic(){
 const state=window.MathTest?.getState(),v=state?.topic===topic.id?state.params:{};
 let n=topic.id==='counting'?5:topic.id==='addition'?(v.a??7)+(v.b??5):topic.id==='subtraction'?Math.max(0,v.a??12):topic.id==='multiplication'?(v.a??3)*(v.b??4):topic.id==='division'?(v.n??12):0;
 if(which===1)n=({counting:5,addition:10,subtraction:12,multiplication:10,division:12})[topic.id]||n;
 if(!['counting','addition','subtraction','multiplication','division'].includes(topic.id))return '';
 if(which===1&&topic.id==='subtraction'){return '<div class="concrete"><svg viewBox="0 0 400 140" role="img" aria-label="12与7一一配对，未配对5张">'+Array.from({length:12},(_,i)=>`<rect x="${22+i*29}" y="25" width="20" height="29" rx="3" fill="#2679aa"/>${i<7?`<path d="M${32+i*29} 57v20" stroke="#64838a"/><rect x="${22+i*29}" y="80" width="20" height="29" rx="3" fill="#c4683f"/>`:''}`).join('')+'</svg><p>上下各拿1张配成对。前7对一样多；上面还有5张没有配对，所以小青比小明多5张。这里没有拿走小青的卡片。</p></div>';}
 if(which===1&&topic.id==='counting'){return '<div class="concrete"><svg viewBox="0 0 400 140" role="img" aria-label="五辆小车，四个车位，一辆没有车位">'+Array.from({length:5},(_,i)=>`${i<4?`<rect x="${15+i*75}" y="20" width="65" height="95" fill="none" stroke="#65858a" stroke-width="2"/>`:''}<rect x="${28+i*75}" y="45" width="39" height="42" rx="9" fill="${i===4?'#c4683f':'#2679aa'}"/>`).join('')+'</svg><p>4辆车各占1个位置，旁边还有1辆：总共仍然是5辆。找车位是在配对，不是把没停进去的车忘掉。</p></div>';}

 if(which===0&&['addition','subtraction'].includes(topic.id)&&((v.a??0)<0||(v.b??0)<0||topic.id==='subtraction'&&(v.b??0)>(v.a??0)))return '<p>负数不能用一堆实物的颗数代替；拿走的比已有的还多时，实物不够，不能画成剩0就结束。请看下方数轴：先定位第一个数，再按运算和符号移动。</p>';
 let circles='',cols=topic.id==='multiplication'?Math.min(12,(which===1?5:v.b||4)):Math.min(12,Math.max(1,n)),a=which===1?6:v.a??7;
 for(let i=0;i<Math.min(n,80);i++){
  const removed=topic.id==='subtraction'&&i>=Math.max(0,n-(which===1?7:v.b??5));
  const leftover=topic.id==='division'&&i>=Math.floor(n/(which===1?4:v.d||3))*(which===1?4:v.d||3);
  const x=30+(i%cols)*28,y=34+Math.floor(i/cols)*32,color=leftover?'#969e9f':topic.id==='addition'&&i>=a?'#c4683f':topic.id==='division'?['#2679aa','#c4683f','#428b64','#8c73a4','#b99833','#497d80','#af6287','#667b3a'][(which===1?Math.floor(i/4):i%(v.d||3))%8]:'#2679aa';
  circles+=`<circle ${topic.id==='counting'?`data-count="${i}" role="button" tabindex="0" aria-label="第${i+1}颗，${counted.has(i)?'已数':'未数'}" stroke="${counted.has(i)?'#b56135':'transparent'}" stroke-width="5"`: ""} cx="${x}" cy="${y}" r="9" fill="${color}" opacity="${removed?.2:1}"/>${removed?`<path d="M${x-10} ${y-10}l20 20m0-20l-20 20" stroke="#aa3939"/>`:''}`;
 }
 const label=({counting:'点小圆逐个计数：同一个小圆再点一次会取消；换个排列也不会增加总数。',addition:'两种颜色表示两批物体；合起来数，和数轴向右走相互对应。',subtraction:'淡色打叉表示拿走；比较多少时，可改想成先一一配对。',multiplication:'按行数，也能按列数；每一行必须一样多。',division:'同色表示平均分到同一组；灰色单独留下，表示余数。也可以反过来问：每组固定，能分几组？'})[topic.id];
 return `<div class="concrete"><svg viewBox="0 0 400 ${Math.max(92,60+Math.ceil(Math.min(n,80)/cols)*32)}" role="img" aria-label="具体数量与算式对应">${circles}</svg><p>${label}${topic.id==='counting'?`<br><b role="status">我数到 ${counted.size} / 5 颗。</b>`:""}${n>80?"<br>图中只显示前80颗；完整数量看读数。":""}</p></div>`;
}
function paint(){if(!topic)return;
 if(which===0&&['addition','subtraction','multiplication','division'].includes(topic.id)&&window.MathTest?.getState().topic===topic.id){const v=MathTest.getState().params;let steps;
  if(topic.id==='addition')steps=[`先看第一批${v.a}，第二批${v.b}；数轴上从${v.a}出发`,v.b>=0?`向右走${v.b}格；终点是${v.a}+${v.b}=${v.a+v.b}`:`加上负数，向左走${-v.b}格；终点是${v.a+v.b}`,`用逆运算检查：${v.a+v.b}−(${v.b})=${v.a}`];
  if(topic.id==='subtraction')steps=[`从${v.a}开始；要减去${v.b}`,`沿数轴${v.b>=0?'向左':'向右'}走${Math.abs(v.b)}格，得到${v.a-v.b}`,`加回去验证：${v.a-v.b}+(${v.b})=${v.a}`];
  if(topic.id==='multiplication')steps=[`一行${v.b}个，共${v.a}行；各行必须一样多`,`总数是${v.a}×${v.b}=${v.a*v.b}`,`换成按列数：${v.b}列，每列${v.a}个；仍是同一批物体`];
  if(topic.id==='division')steps=[`${v.n}个物体，平均分给${v.d}组；此处不切开物体`,`每组${Math.floor(v.n/v.d)}个，剩下${v.n%v.d}个`,`验算：${v.d}×${Math.floor(v.n/v.d)}+${v.n%v.d}=${v.n}；余数小于除数`];
  if(steps&&JSON.stringify(topic.steps)!==JSON.stringify(steps)){topic.steps=steps;refresh?.();}
 }
 const zone=$('teaching-board');if(topic.id==='logic'&&which===0){paintLogic();return;}if(which===0&&MathLessonVisuals.mount(topic.id,zone)){$('teaching-formula').innerHTML=math(exampleFormula());return;}zone.innerHTML=basic();if(topic.id==='counting'){zone.querySelectorAll('[data-count]').forEach(el=>{el.onclick=()=>{const n=Number(el.dataset.count);counted.has(n)?counted.delete(n):counted.add(n);paint();};el.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();el.onclick();}};});} $('teaching-formula').innerHTML=math(exampleFormula());}
function paintLogic(){
 const p=logic.w===logic.h,result=!logic.reverse||p;
 $('teaching-formula').innerHTML=math(logic.reverse?'q\\Rightarrow p':'p\\Rightarrow q');
 const board=$('teaching-board');
 if(!board.querySelector('#logic-width')){
  board.innerHTML='<div class="logic-lab"><div class="logic-controls"><label>长 <output id="logic-w-label"></output><input id="logic-width" type="range" min="1" max="8" value="5"></label><label>宽 <output id="logic-h-label"></output><input id="logic-height" type="range" min="1" max="8" value="3"></label><button id="logic-direction"></button></div><div class="logic-picture"></div><p id="logic-truth"></p><p id="logic-feedback" role="status"></p></div>';
  for(const [id,key]of [['logic-width','w'],['logic-height','h']])$(id).oninput=e=>{logic[key]=Number(e.target.value);paintLogic();};
  $('logic-direction').onclick=()=>{logic.reverse=!logic.reverse;paintLogic();};
 }
 $('logic-w-label').textContent=logic.w;$('logic-h-label').textContent=logic.h;
 $('logic-width').value=logic.w;$('logic-height').value=logic.h;
 $('logic-direction').textContent=(logic.reverse?'当前：矩形 ⇒ 正方形':'当前：正方形 ⇒ 矩形')+' · 换方向';$('logic-direction').setAttribute('aria-pressed',logic.reverse);
 board.querySelector('.logic-picture').innerHTML=`<svg viewBox="0 0 350 280" role="img" aria-label="等比例长宽矩形"><rect x="60" y="42" width="${logic.w*26}" height="${logic.h*26}" fill="#acd8d2" stroke="#24756b" stroke-width="3"/><text x="${60+logic.w*13}" y="28" text-anchor="middle" fill="#203e49" font-size="20">长 ${logic.w}</text><text x="24" y="${48+logic.h*13}" fill="#203e49" font-size="20">${logic.h}</text><path d="M60 56h14V42" fill="none" stroke="#24756b"/></svg>`;
 $('logic-truth').innerHTML=`<b>p：四边等长的正方形？${p?'是':'否'}</b><br>q：四角为直角的矩形？是<br><strong class="${result?'yes':'no'}">${result?'当前没有反例':'找到反例：矩形不一定是正方形'}</strong>`;
 $('logic-feedback').textContent=(!logic.reverse?'正方形是矩形中的一种。把长宽调成相等，看看两个条件同时成立。':'反向条件要重新判断。只要找到长宽不等的矩形，“所有矩形都是正方形”就被否定。')+' '+(p?'当前长宽相等；一个符合例子不能证明反向命题对全部矩形成立。':'当前长宽不等，这一个例子就足以反驳反向的全称命题。');
}
function example(i){which=i;topic.steps=i?T[topic.id].alternate.steps:original.get(topic.id).slice();$('example-context').textContent=i?T[topic.id].alternate.setup:topic.child;document.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.example)===i));refresh?.();setLab();paint();}
function setLab(){const primary=direct.has(topic.id)&&which===0;const block=document.querySelector('.experiment');block.hidden=!primary;const b=$('relatedLabToggle');b.hidden=primary||!topic.lab;b.textContent='展开相关基础工具（不是本节的完整模拟）';b.setAttribute('aria-expanded','false');if(topic.id==='logic')block.hidden=true;}
function mount(t,onChange){topic=t;which=0;counted.clear();logic={w:5,h:3,reverse:false};refresh=onChange;topic.steps=original.get(t.id).slice();let zone=$('teaching');if(!zone){zone=document.createElement('section');zone.id='teaching';zone.className='card teaching';document.querySelector('.heading').after(zone);}
 zone.innerHTML=`<p class="eyebrow">先有一个问题，再引入符号</p><h2>这节要弄明白：${F.esc(t.title)}</h2><div class="tabs examples"><button data-example="0" aria-pressed="true">例子一 · 从这里理解</button><button data-example="1" aria-pressed="false">例子二 · ${F.esc(T[t.id].alternate.title)}</button></div><p id="example-context" class="lead">${F.esc(t.child)}</p><div id="teaching-formula" class="formula-display" aria-label="本例的数学表达"></div><div id="teaching-board"></div><p class="pitfall"><b>别踩这个坑：</b>${F.esc(T[t.id].pitfall)}</p><button id="go-steps">看这道例子的逐步推导 ↓</button><button id="relatedLabToggle" aria-expanded="false">展开相关基础工具</button>`;
 zone.querySelectorAll('[data-example]').forEach(b=>b.onclick=()=>example(Number(b.dataset.example)));
 $('go-steps').onclick=()=>{document.querySelector('#steps').closest('.card').scrollIntoView({behavior:'smooth',block:'start'});};
 $('relatedLabToggle').onclick=()=>{const e=document.querySelector('.experiment');e.hidden=!e.hidden;$('relatedLabToggle').setAttribute('aria-expanded',!e.hidden);$('relatedLabToggle').textContent=e.hidden?'展开相关基础工具（不是本节的完整模拟）':'收起相关基础工具';};
 setLab();paint();
}
const presets={'subtraction':{a:12,b:5},'division':{n:12,d:3},'equivalent':{d:2,n:1,k:2},'percent':{k:80,x:.75},'linear-equation':{a:2,b:3,c:11,x:4},'linear-function':{a:2,b:3,x:4},'quadratic':{a:1,b:-5,c:6},'matrices':{a:2,b:0,c:0,d:1},'determinant':{a:2,b:1,c:0,d:3},'inverse-matrix':{a:2,b:0,c:0,d:3},'rank':{a:1,b:0,c:0,d:0},'eigen':{a:2,b:0,c:0,d:3},'optimization':{p:20,w:5},'taylor':{x:.1,n:2},'complex':{x:2,y:1},'conics':{a:3,b:2},'permutations':{n:4,k:2},'derivative-intro':{x:2,h:1},'trig-identities':{angle:30},'arithmetic-sequence':{a:1,d:1,n:10},'geometric-sequence':{a:1,r:2,n:4},'exponential':{b:2,x:3},'vectors':{x:3,y:0,u:0,v:4}};
for(const id of ['spread','conditional','least-squares','svd','ratio','sets','right-trig','arithmetic-sequence','geometric-sequence','inverse-function'])direct.delete(id);
const api={presets,mount,paint,example,direct,original,state:()=>({topic:topic?.id,example:which,logic:{...logic}})};r.MathGuide=api;
})(window);
