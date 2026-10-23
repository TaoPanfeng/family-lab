/* Pure, bounded teaching models. No eval; display geometry never changes the math. */
(function(root){'use strict';
const C=(key,label,min,max,value,step=1)=>({key,label,min,max,value,step});
const specs={
 arithmetic:{title:'数轴上的合并',note:'从蓝色起点出发，橙色路程表示再加多少。',controls:[C('a','起点',0,20,7),C('b','再加',0,20,5)]},
 subtract:{title:'数轴上的前进与后退',note:'负数在零的左边；减去负数相当于向右走。',controls:[C('a','起点',-15,15,2),C('b','减去的数',-15,15,5)]},
 place:{title:'十根成捆，十捆成箱',note:'蓝色大方块表示百，橙色长条表示十，绿色小格表示一。',controls:[C('n','整数',0,999,237)]},
 multiply:{title:'一行几颗，一共几行',note:'改变行数或每行数量，点阵和乘法一起改变。',controls:[C('a','行数',1,10,3),C('b','每行数量',1,12,4)]},
 divide:{title:'平均分与剩下的',note:'轮流放到各个盘中；余数不能再给每盘都放一颗。',controls:[C('n','豆子总数',0,60,17),C('d','盘子个数',1,8,5)]},
 units:{title:'同一长度，不同单位',note:'尺子的实际显示大小经过缩放；读数按同一个物理长度换算。',controls:[C('x','米',0,3,1.2,.01)]},
 clock:{title:'分针走，时针也慢慢走',note:'拨动分钟，时针连续移动，不会等到整点才跳。',controls:[C('minutes','从午夜起的分钟',0,1439,525)]},
 vectors:{title:'拼箭头，找位置',note:'蓝色与橙色箭头首尾相接；绿色是它们的合向量。',controls:[C('x','蓝色 x',-5,5,3),C('y','蓝色 y',-5,5,2),C('u','橙色 x',-5,5,-1),C('v','橙色 y',-5,5,2)]},
 statistics:{title:'一个极端值会怎样？',note:'前四个数固定为2、3、4、5，只改变第五个数；对比均值和中位数。',controls:[C('outlier','第五个数',0,30,16)]},
 sequence:{title:'一步步增加，还是倍增？',note:'两列共享第一项：蓝色每次加同一个数，橙色每次乘同一个数。',controls:[C('a','首项',1,5,2),C('d','等差公差',0,4,2),C('r','等比公比',1,2,1.4,.1),C('n','项数',2,12,7)]},
 modulo:{title:'绕过一圈后的余数',note:'大圆表示模数个位置；总数除以模数得到完整圈数与最后位置。',controls:[C('n','总步数',0,60,17),C('m','一圈位置数',2,12,5)]},
 divisors:{title:'寻找能整除的数',note:'绿色格子是n的因数；再比较另一个数的最大公因数和最小公倍数。',controls:[C('n','第一个数',1,60,12),C('m','第二个数',1,60,18)]},
 fractions:{title:'同一块饼，平均分',note:'点击小份也能改变分子；第二条带子用更细的切法表示同一个分数。',controls:[C('d','平均分成',1,16,8),C('n','取几份',0,16,3),C('k','每份再切成',1,4,2)]},
 ratio:{title:'每一份不变，总量成比例',note:'橙色是每份数量，蓝色是份数。百分数情境中可把份数设成0.75。',controls:[C('k','每份数量 / 原价',1,100,8),C('x','份数 / 比例',0,5,3,.05)]},
 inverse:{title:'固定路程，速度与时间',note:'这里只比较恒速、无停顿的理想过程；速度不能为0。',controls:[C('distance','固定路程 km',1,60,12),C('speed','速度 km/h',1,15,3)]},
 area:{title:'铺满与围住，是两件事',note:'每个小方格面积为1；边缘长度相加得到周长。',controls:[C('w','长',1,12,5),C('h','宽',1,9,3)]},
 triangle:{title:'底和高决定三角形面积',note:'顶点可左右移动；只要底与垂直高度不变，面积就不变。',controls:[C('b','底',1,10,6),C('h','垂直高',1,8,4),C('offset','顶点横向位置',-3,10,2)]},
 circle:{title:'半径、周长、面积',note:'半径加倍，周长加倍，而面积变为原来的四倍。',controls:[C('r','半径',.5,8,2,.5)]},
 volume:{title:'装满盒子与包住盒子',note:'透视图只帮助理解，读数来自长、宽、高，不用屏幕像素估算体积。',controls:[C('w','长',1,8,4),C('d','宽',1,8,3),C('h','高',1,8,2)]},
 balance:{title:'让等式两边一样多',note:'目标是a×x+b=c。移动x，让两边高度相等；不是随意配平画面。',controls:[C('a','每盒系数 a',1,5,1),C('b','额外数量 b',0,10,3),C('c','右边数量 c',0,30,8),C('x','猜未知数 x',-10,30,5,.1)]},
 pythagoras:{title:'直角三角形的三个正方形',note:'蓝与橙两块面积之和等于绿色面积。非直角三角形不能直接用这个关系。',controls:[C('a','直角边 a',1,6,3),C('b','直角边 b',1,6,4)]},
 exponential:{title:'每一步都乘相同倍数',note:'自变量不是“动画速度”；图上每一个点都按y=b^x计算。',controls:[C('b','底数 b',.5,3,2,.1),C('x','指数 x',0,6,3,.1)]},
 linear:{title:'直线的斜率与起点',note:'改变斜率a和截距b，再移动观察点x；图与数一起变。',controls:[C('a','斜率 a',-3,3,1,.25),C('b','截距 b',-4,4,1,.25),C('x','观察位置 x',-5,5,2,.1)]},
 quadratic:{title:'抛物线与顶点',note:'a=0时退化为直线，不再显示不存在的抛物线顶点。',controls:[C('a','二次项系数 a',-2,2,1,.25),C('b','一次项系数 b',-4,4,-2,.5),C('c','常数 c',-4,4,0,.5)]},
 angles:{title:'转过多少，角就多大',note:'角的大小由两条射线的方向差决定，不由边的长度决定。',controls:[C('angle','角度 °',0,360,60)]},
 trig:{title:'单位圆里的正弦与余弦',note:'圆半径为1。横坐标是cosθ，纵坐标是sinθ；转一周为360°=2π。',controls:[C('angle','角度 °',-360,720,45)]},
 matrix:{title:'一张网格如何变形',note:'蓝色单位正方形经过矩阵变成绿色平行四边形；负行列式表示方向翻转。',controls:[C('a','矩阵 a₁₁',-3,3,2,.25),C('b','矩阵 a₁₂',-3,3,1,.25),C('c','矩阵 a₂₁',-3,3,0,.25),C('d','矩阵 a₂₂',-3,3,1,.25)]},
 sets:{title:'两组里，有多少重复？',note:'圆中数字显示区域数量，圆的面积不表示人数。交集受两个集合大小限制。',controls:[C('a','喜欢苹果的人数',0,30,20),C('b','喜欢香蕉的人数',0,30,18),C('overlap','两种都喜欢',0,30,5)]},
 conics:{title:'椭圆上的点',note:'横、纵半轴独立改变；图形上每个点满足x²/a²+y²/b²=1。',controls:[C('a','横半轴 a',1,5,4,.25),C('b','纵半轴 b',1,5,2,.25),C('angle','观察点参数角',0,360,35)]},
 complex:{title:'乘以i，就是转90°',note:'蓝点表示z，橙点表示iz。图上的纵轴是虚部，不是普通y值的别名。',controls:[C('x','实部 x',-5,5,3,.5),C('y','虚部 y',-5,5,2,.5)]},
 combinations:{title:'选哪些，与按什么顺序选',note:'n个不同物体中选k个：组合不计顺序，排列计顺序；k≤n。',controls:[C('n','物体个数 n',1,10,5),C('k','选择个数 k',0,10,2)]},
 probability:{title:'理论概率与一次样本',note:'同一随机种子生成可复现样本；实验频率不会强行凑成理论比例。',controls:[C('p','每次成功率',0,1,.5,.05),C('n','独立次数',10,2000,100,10)]},
 bayes:{title:'报警了，真的故障吗？',note:'1000台设备中的期望数量，可能是小数；这不是个人医疗检测或真实设备预测。',controls:[C('prior','故障比例 %',0,30,1,.1),C('sensitivity','故障时报警 %',0,100,90),C('falsePositive','正常时误报 %',0,30,1,.1)]},
 regression:{title:'有噪声的点，怎样找线',note:'只改变中间点，观察最小二乘拟合与残差平方和。拟合不证明因果。',controls:[C('middle','中间点的 y',-3,9,3,.1)]},
 derivative:{title:'让两点越来越近',note:'蓝线是割线，橙线是切线；f(x)=x²，割线斜率=2x+h，切线斜率=2x。',controls:[C('x','位置 x',-2,2,1,.1),C('h','两点横向间隔 h',.01,2,1,.01)]},
 optimization:{title:'围栏固定，面积怎样最大',note:'周长固定，长宽互相牵制。这个模型只讨论矩形，不代表所有形状的最大值。',controls:[C('p','围栏总长',8,40,20),C('w','一条边的长度',.5,19.5,4,.5)]},
 integral:{title:'小矩形拼出曲线下面积',note:'对y=x²在[0,1]上累积；左端矩形偏小、右端偏大，中点值也只是近似。',controls:[C('n','小矩形个数',2,80,8),C('method','取高位置：0左 / 1中 / 2右',0,2,1)]},
 taylor:{title:'用多项式靠近eˣ',note:'在0附近展开；相同次数下，远离0可能误差增大。',controls:[C('n','最高次数',0,10,3),C('x','比较位置 x',-2,2,1,.1)]},
 gradient:{title:'沿着碗的坡度往下走',note:'f=x²+2y²。步长过大可能来回跳得更远，程序不把发散假装成成功。',controls:[C('rate','步长 η',.02,.6,.1,.02),C('steps','走几步',0,20,6)]},
 differential:{title:'变化率决定增长或衰减',note:'y′=ky，起点y(0)=1；用精确解eᵏᵗ画曲线，不模拟真实人口。',controls:[C('k','变化率 k',-.8,.8,.3,.1),C('t','时间 t',0,5,2,.1)]},
 normal:{title:'钟形曲线的位置与宽度',note:'阴影是μ±σ区间，概率约68.27%；密度高度不是单点概率。',controls:[C('mu','中心 μ',-3,3,0,.25),C('sigma','标准差 σ',.5,2,1,.1)]},
 graph:{title:'路口与有权道路',note:'只改变A→D直达道路长度，对比最少边数与最短距离。边权非负。',controls:[C('direct','A→D直达距离',1,12,7)]},
 binary:{title:'八个开关，组成一个数',note:'点击下方的位开关；从左到右权值128、64、…、1。',controls:[C('n','整数',0,255,13)]},
 fourier:{title:'很多正弦，拼出一种声音形状',note:'方波的奇次谐波有限和；边缘的过冲不是绘图错误，也不会简单消失。',controls:[C('n','保留奇次谐波个数',1,12,3)]}
};
const finite=(x)=>{if(!Number.isFinite(Number(x)))throw new TypeError('参数必须是有限数');return Number(x);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function normalize(id, input={}){const s=specs[id];if(!s)throw new Error('未知实验');const v={};for(const c of s.controls){let x=input[c.key]===undefined?c.value:finite(input[c.key]);x=clamp(x,c.min,c.max);v[c.key]=Number((Math.round((x-c.min)/c.step)*c.step+c.min).toFixed(8));}if(id==='fractions')v.n=Math.min(v.n,v.d);if(id==='sets')v.overlap=Math.min(v.overlap,v.a,v.b);if(id==='combinations')v.k=Math.min(v.k,v.n);if(id==='optimization')v.w=Math.min(v.w,v.p/2-.5);return v;}
function gcd(a,b){a=Math.abs(Math.trunc(finite(a)));b=Math.abs(Math.trunc(finite(b)));while(b){[a,b]=[b,a%b];}return a;}
function choose(n,k){if(!Number.isInteger(n)||!Number.isInteger(k)||k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return Math.round(r);}
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;};}
const factorial=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r;};
function sample(p,n,seed=17){let random=rng(seed),hits=0,series=[];for(let i=1;i<=n;i++){if(random()<p)hits++;if(i%Math.max(1,Math.floor(n/100))===0||i===n)series.push([i,hits/i]);}return{hits,frequency:hits/n,series};}
function regression(points){let n=points.length,mx=points.reduce((s,p)=>s+p[0],0)/n,my=points.reduce((s,p)=>s+p[1],0)/n;let xx=0,xy=0;points.forEach(([x,y])=>{xx+=(x-mx)**2;xy+=(x-mx)*(y-my);});if(xx===0)return{valid:false};const a=xy/xx,b=my-a*mx;return{valid:true,a,b,sse:points.reduce((s,[x,y])=>s+(y-a*x-b)**2,0)};}
function taylor(x,n){let sum=1,term=1;for(let i=1;i<=n;i++){term*=x/i;sum+=term;}return sum;}
function riemann(n,method){let sum=0,rects=[];for(let i=0;i<n;i++){const x=(i+method/2)/n,y=x*x;sum+=y/n;rects.push([i/n,1/n,y]);}return{sum,rects,error:sum-1/3};}
function gradient(rate,steps){let x=2,y=1,points=[[x,y]];for(let i=0;i<steps;i++){x-=rate*2*x;y-=rate*4*y;points.push([x,y]);}return{x,y,points,value:x*x+2*y*y};}
const fmt=(x,d=3)=>Number.isFinite(x)?Number(x.toFixed(d)).toLocaleString('zh-CN',{maximumFractionDigits:d}):'不适用';
const M=(label,value)=>({label,value});
function compute(id,input={},seed=17){const v=normalize(id,input),r={id,v,metrics:[]};const m=(...xs)=>r.metrics=xs;
switch(id){
case'arithmetic':r.value=v.a+v.b;m(M('算式',`${v.a} + ${v.b} = ${r.value}`),M('方向','向右增加'));break;
case'subtract':r.value=v.a-v.b;m(M('算式',`${v.a} − (${v.b}) = ${r.value}`),M('距离零',Math.abs(r.value)));break;
case'place':r.hundreds=Math.floor(v.n/100);r.tens=Math.floor(v.n%100/10);r.ones=v.n%10;m(M('展开',`${r.hundreds}×100 + ${r.tens}×10 + ${r.ones}`),M('数值',v.n));break;
case'multiply':r.value=v.a*v.b;m(M('一共',r.value),M('算式',`${v.a} × ${v.b}`));break;
case'divide':case'modulo':r.quotient=Math.floor(v.n/(v.d||v.m));r.remainder=v.n%(v.d||v.m);m(M('完整份 / 圈',r.quotient),M('余数',r.remainder),M('检查',`${v.n} = ${v.d||v.m}×${r.quotient}+${r.remainder}`));break;
case'units':m(M('米',fmt(v.x,2)),M('厘米',fmt(v.x*100,1)),M('毫米',fmt(v.x*1000,0)));break;
case'clock':r.hours=Math.floor(v.minutes/60);r.minute=v.minutes%60;m(M('24小时制',`${String(r.hours).padStart(2,'0')}:${String(r.minute).padStart(2,'0')}`),M('分针角度',`${r.minute*6}°`));break;
case'vectors':r.sum=[v.x+v.u,v.y+v.v];m(M('合向量',`(${r.sum.join(', ')})`),M('蓝色长度',fmt(Math.hypot(v.x,v.y))),M('数量积',v.x*v.u+v.y*v.v));break;
case'statistics':r.values=[2,3,4,5,v.outlier];r.mean=r.values.reduce((s,x)=>s+x,0)/5;r.median=[...r.values].sort((a,b)=>a-b)[2];r.variance=r.values.reduce((s,x)=>s+(x-r.mean)**2,0)/5;m(M('均值',fmt(r.mean)),M('中位数',r.median),M('总体方差',fmt(r.variance)));break;
case'sequence':r.arith=Array.from({length:v.n},(_,i)=>[i+1,v.a+i*v.d]);r.geo=Array.from({length:v.n},(_,i)=>[i+1,v.a*v.r**i]);m(M('等差末项',fmt(r.arith.at(-1)[1])),M('等比末项',fmt(r.geo.at(-1)[1])),M('项数',v.n));break;
case'divisors':r.factors=Array.from({length:v.n},(_,i)=>i+1).filter(i=>v.n%i===0);r.gcd=gcd(v.n,v.m);m(M('因数',r.factors.join('、')),M('最大公因数',r.gcd),M('最小公倍数',v.n*v.m/r.gcd),M('性质',v.n===1?'1不是质数也不是合数':r.factors.length===2?'质数':'合数'));break;
case'fractions':r.value=v.n/v.d;r.gcd=gcd(v.n,v.d);m(M('分数',`${v.n}/${v.d}`),M('等值',`${v.n*v.k}/${v.d*v.k}`),M('小数',fmt(r.value,4)),M('最简',`${v.n/r.gcd}/${v.d/r.gcd}`));break;
case'ratio':r.value=v.k*v.x;m(M('总量',fmt(r.value,2)),M('每份不变',v.k),M('份数',v.x));break;
case'inverse':r.time=v.distance/v.speed;m(M('时间 h',fmt(r.time)),M('检查',`${v.speed} × ${fmt(r.time)} ≈ ${v.distance}`));break;
case'area':r.area=v.w*v.h;m(M('面积',`${r.area} 平方单位`),M('周长',`${2*(v.w+v.h)} 单位`));break;
case'triangle':r.area=v.b*v.h/2;m(M('面积',r.area),M('底 × 高 ÷ 2',`${v.b} × ${v.h} ÷ 2`));break;
case'circle':m(M('周长',fmt(2*Math.PI*v.r)),M('面积',fmt(Math.PI*v.r*v.r)));break;
case'volume':m(M('体积',v.w*v.d*v.h),M('表面积',2*(v.w*v.d+v.w*v.h+v.d*v.h)));break;
case'balance':r.left=v.a*v.x+v.b;r.solution=(v.c-v.b)/v.a;r.balanced=Math.abs(r.left-v.c)<1e-8;m(M('左边',fmt(r.left)),M('右边',v.c),M('状态',r.balanced?'相等 ✓':'还不相等'),M('精确解',`x=${fmt(r.solution)}`));break;
case'pythagoras':r.c=Math.hypot(v.a,v.b);m(M('a²',v.a*v.a),M('b²',v.b*v.b),M('c²',v.a*v.a+v.b*v.b),M('斜边 c',fmt(r.c)));break;
case'exponential':r.value=v.b**v.x;m(M('bˣ',fmt(r.value,4)),M('底数',v.b),M('指数',v.x));break;
case'linear':r.value=v.a*v.x+v.b;m(M('y',fmt(r.value)),M('斜率',v.a),M('截距',v.b));break;
case'quadratic':r.discriminant=v.b*v.b-4*v.a*v.c;r.vertex=v.a===0?null:[-v.b/(2*v.a),v.c-v.b*v.b/(4*v.a)];m(M('类型',v.a===0?'直线 / 常数':'抛物线'),M('顶点',r.vertex?`(${r.vertex.map(x=>fmt(x)).join(', ')})`:'不适用'),M('判别式',v.a===0?'不适用':fmt(r.discriminant)));break;
case'angles':case'trig':r.angle=v.angle*Math.PI/180;r.sin=Math.sin(r.angle);r.cos=Math.cos(r.angle);m(M('弧度',fmt(r.angle)),M('sinθ',fmt(r.sin,4)),M('cosθ',fmt(r.cos,4)));break;
case'matrix':r.det=v.a*v.d-v.b*v.c;r.inverse=r.det===0?null:[v.d/r.det,-v.b/r.det,-v.c/r.det,v.a/r.det];m(M('行列式',fmt(r.det)),M('面积倍率',fmt(Math.abs(r.det))),M('可逆？',r.inverse?'可以':'不可以，压扁或退化'));break;
case'sets':r.union=v.a+v.b-v.overlap;m(M('只喜欢苹果',v.a-v.overlap),M('都喜欢',v.overlap),M('只喜欢香蕉',v.b-v.overlap),M('至少一种',r.union));break;
case'conics':r.point=[v.a*Math.cos(v.angle*Math.PI/180),v.b*Math.sin(v.angle*Math.PI/180)];m(M('点坐标',r.point.map(x=>fmt(x)).join(', ')),M('面积',fmt(Math.PI*v.a*v.b)),M('中心到焦点',fmt(Math.sqrt(Math.abs(v.a*v.a-v.b*v.b)))));break;
case'complex':r.product=[-v.y,v.x];m(M('z',`${v.x} + (${v.y})i`),M('iz',`${-v.y} + (${v.x})i`),M('模',fmt(Math.hypot(v.x,v.y))));break;
case'combinations':r.combinations=choose(v.n,v.k);r.permutations=factorial(v.n)/factorial(v.n-v.k);m(M('组合 C(n,k)',r.combinations),M('排列 P(n,k)',r.permutations),M('关系',`排列 = 组合 × ${v.k}!`));break;
case'probability':Object.assign(r,sample(v.p,v.n,seed));m(M('理论概率',`${fmt(v.p*100)}%`),M('成功次数',r.hits),M('实验频率',`${fmt(r.frequency*100,2)}%`));break;
case'bayes':r.trueAlarm=1000*(v.prior/100)*(v.sensitivity/100);r.falseAlarm=1000*(1-v.prior/100)*(v.falsePositive/100);r.posterior=r.trueAlarm+r.falseAlarm>0?r.trueAlarm/(r.trueAlarm+r.falseAlarm):null;m(M('真警报期望数量',fmt(r.trueAlarm)),M('误报期望数量',fmt(r.falseAlarm)),M('报警后的故障概率',r.posterior===null?'无警报，条件概率未定义':`${fmt(r.posterior*100,2)}%`));break;
case'regression':r.points=[[0,1],[1,2],[2,v.middle],[3,4],[4,4]];Object.assign(r,regression(r.points));m(M('拟合斜率',fmt(r.a)),M('拟合截距',fmt(r.b)),M('残差平方和',fmt(r.sse)));break;
case'derivative':r.secant=2*v.x+v.h;r.tangent=2*v.x;m(M('割线斜率',fmt(r.secant)),M('切线斜率',fmt(r.tangent)),M('差值',fmt(v.h,2)));break;
case'optimization':r.h=v.p/2-v.w;r.area=v.w*r.h;r.max=v.p*v.p/16;m(M('另一边',fmt(r.h)),M('当前面积',fmt(r.area)),M('矩形最大面积',fmt(r.max)),M('最佳边长',fmt(v.p/4)));break;
case'integral':Object.assign(r,riemann(v.n,v.method));m(M('近似面积',fmt(r.sum,6)),M('精确面积','1/3'),M('误差（近似−精确）',fmt(r.error,6)));break;
case'taylor':r.value=taylor(v.x,v.n);r.exact=Math.exp(v.x);m(M('多项式',fmt(r.value,6)),M('eˣ',fmt(r.exact,6)),M('绝对误差',fmt(Math.abs(r.value-r.exact),6)));break;
case'gradient':Object.assign(r,gradient(v.rate,v.steps));m(M('当前位置',`(${fmt(r.x)}, ${fmt(r.y)})`),M('f(x,y)',fmt(r.value)),M('与起点6相比',r.value<6?'下降':v.steps===0?'尚未迈步':r.value===6?'未下降':'上升：步长需减小'));break;
case'differential':r.value=Math.exp(v.k*v.t);m(M('y(t)',fmt(r.value,4)),M('当前变化率 ky',fmt(v.k*r.value,4)));break;
case'normal':m(M('均值 μ',v.mu),M('标准差 σ',v.sigma),M('μ±σ内概率','约68.27%'));break;
case'graph':r.edges=[['A','B',2],['B','D',3],['A','C',4],['C','D',2],['A','D',v.direct]];r.shortest=Math.min(5,v.direct);r.route=v.direct<5?'A → D':v.direct===5?'A → D 或 A → B → D':'A → B → D';m(M('最短距离',r.shortest),M('路线',r.route));break;
case'binary':r.bits=v.n.toString(2).padStart(8,'0').split('').map(Number);m(M('二进制',r.bits.join('')),M('十进制',v.n));break;
case'fourier':m(M('保留项数',v.n),M('最高谐波',2*v.n-1),M('跳跃处有限和','取左右极限的中点0'));break;
default:throw new Error('模型未实现');}
return r;}
root.MathModels={specs,normalize,compute,gcd,choose,rng,sample,regression,taylor,riemann,gradient,fmt};if(typeof module!=='undefined')module.exports=root.MathModels;
})(typeof globalThis!=='undefined'?globalThis:this);
