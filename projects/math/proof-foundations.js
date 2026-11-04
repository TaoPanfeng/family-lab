/* Foundational arguments: every route has a diagram tied to its own assumptions. */
(function(root){'use strict';
const math={
 choose:(n,k)=>{if(k<0||k>n)return 0;let v=1;for(let i=1;i<=k;i++)v=v*(n-i+1)/i;return v;},
 loss:(xs,a)=>xs.reduce((sum,x)=>sum+(x-a)**2,0),
 det:(a,b,c,d)=>a*d-b*c,
 bayes:(p,s,f)=>{const total=p*s+(1-p)*f;return total?{joint:p*s,total,posterior:p*s/total}:null;},
 rightSum:n=>(n+1)*(2*n+1)/(6*n*n)
};
function install(P,V){
 const T=V.text,blue='#2c7895',orange='#c77b42',green='#39826e',pale='#e6f1f3';
 const rect=(x,y,w,h,color=pale)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="${blue}" stroke-width="2"/>`;
 const line=(x,y,X,Y,color=blue,dash='')=>`<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${color}" stroke-width="2"${dash?' stroke-dasharray="'+dash+'"':''}/>`;
 const dot=(x,y,color=orange,r=6)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
 const poly=(points,color=pale)=>`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="${color}" stroke="${blue}" stroke-width="2"/>`;
 const heading=value=>T(300,30,value,21);
 const route=(name,steps)=>({name,steps});
 function add(ids,title,conditions,routes,forms,draw){
  const data={title,conditions,routes};
  for(const id of ids){P[id]=data;V.register(id,(r,n)=>({svg:V.svg(draw(r,n),title+' · '+routes[r].name),formula:forms[r][n],note:routes[r].steps[n]}));}
 }
 function table(rows,n,x=75,y=70,w=450){let s='';rows.forEach((row,i)=>{s+=rect(x,y+i*48,w,40,i===n?'#f5d7b8':pale)+T(x+w/2,y+26+i*48,row,19);});return s;}
 add(['real-numbers'],'√2为什么不是分数？','假设分数p/q已约成互质，p、q为正整数；使用整数的奇偶性或唯一质因数分解。',[
  route('奇偶矛盾',['反设√2=p/q，p、q为互质正整数。','两边平方得p²=2q²，因此p²为偶数；奇数的平方是奇数，所以p为偶数。','写p=2k，代回得4k²=2q²，再除以2得到q²=2k²。','同理q也是偶数，于是p和q都能被2整除。','这与已经互质矛盾，故√2不可能等于整数之比。']),
  route('质因数指数',['反设√2=p/q，其中p、q为正整数，平方得p²=2q²。','设p含有m个质因数2，则p²中含有2m个，指数为偶数。','设q含有n个质因数2，则2q²中含有2n+1个，指数为奇数。','相同正整数的质因数分解唯一，故应有2m=2n+1。','偶数不可能等于奇数，反设不成立。'])
 ],[
  ['\\sqrt2=\\frac pq,\\quad\\gcd(p,q)=1','p^2=2q^2\\Longrightarrow 2\\mid p','p=2k\\Longrightarrow q^2=2k^2','2\\mid p,\\quad 2\\mid q','\\gcd(p,q)\\ge2\\quad\\text{矛盾}'],
  ['p^2=2q^2','v_2(p^2)=2m','v_2(2q^2)=2n+1','2m=2n+1','2m\\ne2n+1']
 ],(r,n)=>r===0?heading('反证：同一对整数不能既互质又都含因数2')+table(['约到最简的 p / q','p² 为偶数 → p 为偶数','代入 p=2k，得到 q² 为偶数','p=2k，q=2j','共同因数2 ↔ 互质：矛盾'],n,65,70,470):heading('只数质因数2出现了几次')+rect(75,80,195,185)+rect(330,80,195,185,'#f7e6d5')+T(172,120,'p²',27)+T(428,120,'2q²',27)+T(172,175,'2m：偶数',22)+T(428,175,'2n+1：奇数',22)+Array.from({length:n+1},(_,i)=>dot(110+i*30,230,blue,8)+dot(363+i*30,230,orange,8)).join('')+T(300,315,n>=3?'唯一分解要求相等，但奇偶不同':'平方会把每种质因数的次数翻倍',20));
 add(['permutations'],'为什么C(n,k)=C(n,n−k)？','n、k为整数且0≤k≤n；n个对象彼此不同，组合不计顺序，约定0!=1。',[
  route('选中与未选中一一对应',['从n个不同对象中选出k个，组成集合S。','没被选中的恰好有n−k个，组成补集Sᶜ。','取两次补集会回到S，所以这个对应既不重复也不遗漏。','因此选择k个与选择n−k个的方案数相等。']),
  route('从计数公式约分',['有序选取k个对象共有n!/(n−k)!种；每个无序组合被k!个顺序重复计算。','所以C(n,k)=n!/[k!(n−k)!]。','把k换成n−k，得到n!/[(n−k)!k!]。','分母仅交换因数次序，结果相同；k=0或n也成立。'])
 ],[
 ['|S|=k','|S^c|=n-k','(S^c)^c=S','\\binom nk=\\binom n{n-k}'],
 ['\\frac{n!}{(n-k)!}\\div k!','\\binom nk=\\frac{n!}{k!(n-k)!}','\\binom n{n-k}=\\frac{n!}{(n-k)!k!}','\\binom nk=\\binom n{n-k}']
 ],(r,n)=>{if(r)return heading('同一分子，分母因数交换')+table(['有序选择：每组被重复 k! 次','除去排列重复，得到组合数','k! × (n−k)!','(n−k)! × k!'],n)+T(300,310,'0! = 1，端点也有且只有一种选择');let s=heading('示例 n=5，k=2；对应规律对任意 n,k 成立');for(let i=0;i<5;i++){s+=dot(100+i*100,110,i<2?orange:blue,22)+T(100+i*100,117,i+1,18,'#fff');if(n>=1)s+=dot(100+i*100,240,i<2?blue:orange,22)+T(100+i*100,247,i+1,18,'#fff');}if(n>=1)s+=T(300,180,'取补集：选中的与未选中的互换');return s+T(300,315,n>=2?'再取补集回到原来这组，没有丢失方案':'橙色选中2个；蓝色未选中3个');});
 add(['binomial-theorem'],'二项式定理中的系数从哪里来？','n为非负整数；a、b为可交换的数，约定区间外的组合数为0。',[
 route('展开时选择b的位置',['(a+b)ⁿ是n个相同括号相乘；n=0时是空乘积1。','按分配律，每一项都从每个括号各取一个a或b。','要得到aⁿ⁻ᵏbᵏ，恰好需要选k个括号取b。','这k个位置有C(n,k)种选择，所以该项系数为C(n,k)。','把k=0到n的所有互不重复选择相加，就得到完整展开式。']),
 route('归纳法与帕斯卡关系',['n=0时展开式只有1，公式成立。','假设第n次展开的第k项系数为C(n,k)。','再乘(a+b)，同一项来自“原项乘a”或“前一项乘b”。','这两类选择互不相交，系数相加为C(n,k)+C(n,k−1)=C(n+1,k)。','端点也按区间外系数为0处理，所以由归纳法公式对所有非负整数n成立。'])
 ],[
 ['(a+b)^n=\\prod_{i=1}^n(a+b)','a^{n-k}b^k','|\\{\\text{取}b\\text{的位置}\\}|=k','[a^{n-k}b^k](a+b)^n=\\binom nk','(a+b)^n=\\sum_{k=0}^n\\binom nk a^{n-k}b^k'],
 ['(a+b)^0=1','(a+b)^n=\\sum_{k=0}^n\\binom nk a^{n-k}b^k','\\binom nk+\\binom n{k-1}','\\binom nk+\\binom n{k-1}=\\binom{n+1}k','(a+b)^{n+1}=\\sum_{k=0}^{n+1}\\binom{n+1}k a^{n+1-k}b^k']
 ],(r,n)=>{let s=heading(r?'帕斯卡三角：同幂次的两路贡献相加':'示例四个括号：两个位置取 b');if(!r){for(let i=0;i<4;i++)s+=rect(70+i*125,90,90,65,i<n%5?'#f6d7b9':pale)+T(115+i*125,131,i<2&&n>=2?'b':'a+b',23);return s+table(['选两个位置：12，13，14','另外三种：23，24，34','共6项 a²b²，合并系数为6'],Math.max(0,n-2),75,200,450);}for(let row=0;row<5;row++)for(let k=0;k<=row;k++){const x=300+(k-row/2)*85,y=85+row*48;s+=dot(x,y,row===Math.min(4,n)?orange:blue,18)+T(x,y+6,math.choose(row,k),17,'#fff');}return s;});
 add(['derivative-intro','derivatives'],'为什么(x²)′=2x？','x为任意实数；差商中h≠0并令h→0。面积图仅解释x,h>0的情形，一般证明使用代数。',[
 route('直接计算差商',['在x处增加非零增量h，函数值增加(x+h)²−x²。','展开平方得到2xh+h²。','除以h；因为h≠0，可以约去公因数h，差商为2x+h。','令h从两侧趋近0，额外项h趋近0。','所以差商极限为2x，即f′(x)=2x。']),
 route('线性主项与余项',['精确增量为Δf=2xh+h²；图中正长度情形分为两条窄边与角块。','两条窄边共2xh，是关于h的一次项。','角块是h²；其绝对值除以|h|为|h|，趋近0。','因此误差比h更快趋近0，满足Δf=2xh+o(h)。','按可微定义，线性主项系数就是导数2x。'])
 ],[
 ['\\Delta f=(x+h)^2-x^2','\\Delta f=2xh+h^2','\\frac{\\Delta f}{h}=2x+h\\quad(h\\ne0)','\\lim_{h\\to0}(2x+h)=2x','\\frac{d}{dx}x^2=2x'],
 ['\\Delta f=2xh+h^2','\\Delta f_{\\text{线性}}=2xh','\\frac{|h^2|}{|h|}=|h|\\longrightarrow0','\\Delta f=2xh+o(h)','f\'(x)=2x']
 ],(r,n)=>{if(r){let h=[70,60,44,28,16][n],x=170,y=75,b=150;return heading('正长度面积示意；任意实数用右侧代数')+rect(x,y+h,b,b)+rect(x+b,y+h,h,b,'#f2cda9')+rect(x,y,b,h,'#f2cda9')+rect(x+b,y,h,h,'#96c6b8')+T(x+b/2,y+h+b/2,'x²',25)+T(x+b+h/2,y+h+b/2,'xh',18)+T(x+b/2,y+h/2+6,'xh',18)+T(300,320,'两条边：2xh；角块：h²');}let s=heading('精确曲线 y=x²：割线斜率趋近切线斜率');const X=x=>80+x*130,Y=y=>290-y*45;let path='';for(let i=0;i<=100;i++){let x=i*.022;path+=(i?'L':'M')+X(x)+' '+Y(x*x);}s+=line(60,290,460,290)+line(80,310,80,45)+`<path d="${path}" fill="none" stroke="${blue}" stroke-width="3"/>`;const h=[.8,.6,.4,.2,.06][n],x1=1,x2=1+h;let slope=x1+x2;s+=line(X(.2),Y(1+slope*(.2-1)),X(2.05),Y(1+slope*(2.05-1)),orange)+dot(X(x1),Y(1))+dot(X(x2),Y(x2*x2))+T(510,130,'x=1',19)+T(510,175,'h='+h,19)+T(510,220,'斜率 '+(2+h),18);return s;});
 add(['optimization'],'固定周长矩形，正方形面积最大','周长P>0；矩形两边x、P/2−x都为正，即0<x<P/2。',[
 route('配成平方',['由周长2(x+y)=P可得y=P/2−x。','面积A=x(P/2−x)=−x²+(P/2)x。','配方得到A=P²/16−(x−P/4)²。','平方项非负，所以A≤P²/16。','只有x=P/4时等号成立，此时y=P/4，矩形是正方形。']),
 route('导数与单调性',['面积函数为A(x)=x(P/2−x)，定义域0<x<P/2。','求导A′(x)=P/2−2x，零点为x=P/4。','x<P/4时导数为正，面积递增。','x>P/4时导数为负，面积递减。','所以驻点为整个定义域的唯一最大点，两边相等。'])
 ],[
 ['y=\\frac P2-x','A=-x^2+\\frac P2x','A=\\frac{P^2}{16}-\\left(x-\\frac P4\\right)^2','A\\le\\frac{P^2}{16}','x=y=\\frac P4'],
 ['A(x)=x\\left(\\frac P2-x\\right)','A\'(x)=\\frac P2-2x','x<\\frac P4\\Longrightarrow A\'(x)>0','x>\\frac P4\\Longrightarrow A\'(x)<0','A_{\\max}=\\frac{P^2}{16}']
 ],(r,n)=>{if(!r){const x=[2,3,4,5,5][n],y=10-x;return heading('示例：周长20，长宽之和10')+rect(90,80,x*36,y*25)+T(90+x*18,65,'x='+x,21)+T(90+x*36+50,80+y*12.5,'y='+y,21)+T(420,150,'面积 '+x*y,27)+T(420,210,'最大 25',23)+T(300,330,'通式减去的是非负平方，示例不是一般证明');}let s=heading('面积抛物线：先增后减');const X=x=>80+x*43,Y=a=>290-a*8;let path='';for(let i=0;i<=100;i++){let x=i/10;path+=(i?'L':'M')+X(x)+' '+Y(x*(10-x));}s+=line(60,290,540,290)+line(80,315,80,45)+`<path d="${path}" fill="none" stroke="${blue}" stroke-width="3"/>`+dot(X(5),Y(25),orange,8)+T(X(5),Y(25)-18,'(5,25)');if(n>=2)s+=line(120,245,230,155,green)+T(170,215,'递增');if(n>=3)s+=line(380,155,490,245,orange)+T(440,210,'递减');return s;});
 add(['integral'],'∫₀¹x²dx为什么等于1/3？','使用连续函数的黎曼积分定义；右端矩形为上和，平方和公式可由数学归纳法证明。另一条路线使用微积分基本定理。',[
 route('右端黎曼和',['把[0,1]等分n段，每段宽1/n，第k段右端点为k/n。','右端矩形总面积是(1/n³)Σk²。','平方和来自恒等式k³−(k−1)³=3k²−3k+1：从1加到n，左侧抵消成n³，右侧用Σk=n(n+1)/2，解得Σk²=n(n+1)(2n+1)/6。故右端和为(n+1)(2n+1)/(6n²)。','左端和与右端和之差为1/n，趋近0，故两者夹住积分并趋向同一极限。','把右端和除开为1/3+1/(2n)+1/(6n²)，极限为1/3。']),
 route('基本定理：先找原函数',['用差商展开可验证(x³/3)′=x²。','取原函数F(x)=x³/3。','微积分基本定理给出∫₀¹x²dx=F(1)−F(0)。','代入F(1)=1/3、F(0)=0。','因此积分为1/3；此路线使用基本定理，不靠图形猜测。'])
 ],[
 ['\\Delta x=\\frac1n,\\quad x_k=\\frac kn','R_n=\\frac1{n^3}\\sum_{k=1}^n k^2','R_n=\\frac{(n+1)(2n+1)}{6n^2}','0\\le R_n-L_n=\\frac1n\\longrightarrow0','\\int_0^1x^2dx=\\lim R_n=\\frac13'],
 ['\\lim_{h\\to0}\\frac{(x+h)^3-x^3}{3h}=x^2','F(x)=\\frac{x^3}{3}','\\int_0^1x^2dx=F(1)-F(0)','F(1)=\\frac13,\\quad F(0)=0','\\int_0^1x^2dx=\\frac13']
 ],(r,n)=>{if(r)return heading('累积函数的端点差')+table(['差商展开：3x²h + 3xh² + h³','F(x)=x³/3，变化率为x²','累积量 = 终点F(1) − 起点F(0)','1/3 − 0','有向面积 = 1/3'],n);let N=[3,4,6,9,15][n],s=heading('右端矩形在曲线上方；越来越细'),X=x=>80+x*400,Y=y=>285-y*210;for(let k=1;k<=N;k++)s+=rect(X((k-1)/N),Y((k/N)**2),400/N,210*(k/N)**2,k===N?'#efc49e':'#d7e9ed');let d='';for(let i=0;i<=80;i++){let x=i/80;d+=(i?'L':'M')+X(x)+' '+Y(x*x);}s+=`<path d="${d}" fill="none" stroke="${orange}" stroke-width="3"/>`+line(65,285,510,285)+T(300,325,'n='+N+'，右端和≈'+math.rightSum(N).toFixed(4)+'，极限1/3');return s;});
 add(['fundamental'],'微积分为何把“累积”和“变化”连接起来？','f在区间上连续，F(x)=∫ₐˣf(t)dt；x为区间内部点，h≠0可从正负两侧趋近0。',[
 route('短区间平均值被夹住',['积分可加，故F(x+h)−F(x)=∫ₓˣ⁺ʰf(t)dt。','除以h后是端点x与x+h之间的函数平均值；h<0时积分方向与分母符号同时反转。','平均值介于该短区间的最小值mₕ与最大值Mₕ之间。','连续性保证h→0时mₕ、Mₕ都趋近f(x)。','由夹逼定理，差商趋近f(x)，所以F′(x)=f(x)。']),
 route('连续性给出误差界',['差商减f(x)等于(1/h)∫ₓˣ⁺ʰ[f(t)−f(x)]dt。','取绝对值，用区间长度|h|估计积分，误差不超过短区间内|f(t)−f(x)|的最大值。','给定任意ε>0，连续性给出δ>0，使|t−x|<δ时|f(t)−f(x)|<ε。','当0<|h|<δ时，积分覆盖的全部t都满足这个误差界。','因此差商与f(x)之差小于ε，按极限定义得到F′(x)=f(x)。'])
 ],[
 ['F(x+h)-F(x)=\\int_x^{x+h}f(t)dt','\\frac{F(x+h)-F(x)}h=\\frac1h\\int_x^{x+h}f(t)dt','m_h\\le\\frac{F(x+h)-F(x)}h\\le M_h','m_h,M_h\\longrightarrow f(x)','F\'(x)=f(x)'],
 ['\\frac{F(x+h)-F(x)}h-f(x)=\\frac1h\\int_x^{x+h}(f(t)-f(x))dt','\\left|\\frac{\\Delta F}h-f(x)\\right|\\le\\max_{t\\text{在短区间}}|f(t)-f(x)|','|t-x|<\\delta\\Longrightarrow |f(t)-f(x)|<\\varepsilon','0<|h|<\\delta','\\lim_{h\\to0}\\frac{F(x+h)-F(x)}h=f(x)']
 ],(r,n)=>{let h=[150,110,75,45,20][n],x=230,Y=t=>220-.27*(t-70),s=heading(r?'误差带在连续点附近可以任意窄':'橙色窄条面积 ÷ 宽 = 平均高度');s+=poly([[x,285],[x,Y(x)],[x+h,Y(x+h)],[x+h,285]],'#f3d4b5')+line(65,285,535,285)+line(70,320,70,50)+line(70,Y(70),520,Y(520),blue)+line(x,55,x,295,orange,'6 4')+line(x+h,55,x+h,295,orange,'6 4')+T(x,315,'x')+T(x+h,340,'x+h');if(n>=1)s+=line(90,Y(x),530,Y(x),green,'5 4')+line(90,Y(x+h),530,Y(x+h),green,'5 4');s+=T(430,65,r?'ε控制上下误差':'mₕ ≤ 平均值 ≤ Mₕ',18);return s;});
 add(['mean','least-squares'],'为什么均值让平方误差最小？','n≥1个实数xᵢ，均值μ=(Σxᵢ)/n；优化对象是常数a的平方误差和，并非一般线性回归的全部结论。',[
 route('把偏差展开',['写xᵢ−a=(xᵢ−μ)+(μ−a)。','平方后求和，得到原偏差平方和、交叉项与n(μ−a)²。','由μ=(Σxᵢ)/n，Σ(xᵢ−μ)=0，故交叉项为0。','所以L(a)=L(μ)+n(μ−a)²≥L(μ)。','因n>0，只有a=μ时取等号，故均值是唯一最小点。']),
 route('对目标函数求导',['定义L(a)=Σ(xᵢ−a)²。','对a求导：L′(a)=2na−2Σxᵢ。','令导数为0得到唯一驻点a=Σxᵢ/n=μ。','再求导L″(a)=2n>0，因此目标函数严格凸。','驻点是唯一全局最小点；均值对极端值敏感，结论只针对平方误差。'])
 ],[
 ['x_i-a=(x_i-\\mu)+(\\mu-a)','L(a)=L(\\mu)+2(\\mu-a)\\sum_i(x_i-\\mu)+n(\\mu-a)^2','\\sum_i(x_i-\\mu)=0','L(a)=L(\\mu)+n(\\mu-a)^2\\ge L(\\mu)','L(a)=L(\\mu)\\iff a=\\mu'],
 ['L(a)=\\sum_{i=1}^n(x_i-a)^2','L\'(a)=2na-2\\sum_i x_i','L\'(a)=0\\iff a=\\mu','L\'\'(a)=2n>0','\\operatorname*{argmin}_{a\\in\\mathbb R}L(a)=\\mu']
 ],(r,n)=>{if(r){let d='',X=a=>80+a*65,Y=l=>285-l*4;for(let i=0;i<=100;i++){let a=i*.065;d+=(i?'L':'M')+X(a)+' '+Y(math.loss([1,2,6],a));}return heading('示例数据1，2，6；均值μ=3')+line(60,285,540,285)+`<path d="${d}" stroke="${blue}" stroke-width="3" fill="none"/>`+dot(X(3),Y(14),orange,8)+T(X(3),Y(14)-20,'最小点 (3,14)')+T(300,330,'示例：L(a)=14+3(a−3)²');}let s=heading('示例数据1，2，6；偏差和恰好为0');s+=line(65,165,535,165);for(let i=0;i<=7;i++)s+=line(80+i*60,160,80+i*60,170)+T(80+i*60,195,i,17);[1,2,6].forEach((x,i)=>{let yy=80+i*23;s+=dot(80+x*60,165,blue,7)+line(260,yy,80+x*60,yy,i===2?orange:green);});s+=line(260,65,260,210,orange,'5 4')+T(260,242,'μ=3');if(n>=1)s+=T(300,285,'−2 + (−1) + 3 = 0',23);if(n>=3)s+=T(300,325,'移动中心a，额外增加3(a−3)²');return s;});
 add(['determinant'],'二维行列式为什么是ad−bc？','列向量u=(a,c)、v=(b,d)；有向面积取决于定向，可为正、负或0。双线性路线以有向面积的基本性质为前提。',[
 route('双线性展开',['把列向量写为u=ae₁+ce₂、v=be₁+de₂。','对两列分别使用线性，把有向面积展开成四项。','同向向量张成的面积为0，所以D(e₁,e₁)=D(e₂,e₂)=0。','单位正方形正向面积为1，交换两列反向面积为−1。','留下ad−bc；普通面积是它的绝对值。']),
 route('剪切不改变有向面积',['若a≠0，把v减去(b/a)u；这是沿底边u的剪切，不改变有向面积。','新列向量为(0,d−bc/a)。','竖直新边与u围成的有向面积为a(d−bc/a)。','把括号展开，a与分母a约去，得到ad−bc；此处仍在a≠0情形。','若a=0，首列竖直，有向底高给D=−cb：b、c同号时为顺时针负面积；首列为零时面积为0。'])
 ],[
 ['u=ae_1+ce_2,\\quad v=be_1+de_2','D(u,v)=abD(e_1,e_1)+adD(e_1,e_2)+cbD(e_2,e_1)+cdD(e_2,e_2)','D(e_1,e_1)=D(e_2,e_2)=0','D(e_1,e_2)=1,\\quad D(e_2,e_1)=-1','D(u,v)=ad-bc'],
 ['D(u,v)=D\\left(u,v-\\frac ba u\\right)','v-\\frac ba u=\\left(0,d-\\frac{bc}a\\right)','D=a\\left(d-\\frac{bc}a\\right)','D=ad-bc','a=0\\Longrightarrow D=-bc']
 ],(r,n)=>{if(!r)return heading('四项展开中，同向的两项为0')+table(['u：a个 e₁ + c个 e₂','v：b个 e₁ + d个 e₂','e₁ 与 e₁：0；e₂ 与 e₂：0','e₁ 到 e₂：+1；反向：−1','保留 ad 与 −bc'],n);let O=[155,285],u=[195,-65],v=n===0?[65,-130]:[0,-108.333333],p=(x,y)=>[O[0]+x,O[1]+y];return heading('示例u=(3,1)，v=(1,2)，有向面积5')+poly([O,p(...u),p(u[0]+v[0],u[1]+v[1]),p(...v)])+line(...O,...p(...u),blue)+line(...O,...p(...v),orange)+T(390,160,n===0?'原平行四边形':'剪切后面积不变',20)+T(390,210,n===0?'3×2−1×1=5':'3×(5/3)=5',21)+T(300,330,'图示剪切量：(b/a)u，底与高不变');});
 add(['inverse-matrix'],'二维逆矩阵为什么需要除以行列式？','A=[[a,b],[c,d]]；Δ=ad−bc≠0。若Δ=0，两列线性相关，变换会压缩维度，不能唯一恢复所有输入。',[
 route('解两组单位输出',['逆矩阵第一列(x,y)需要满足ax+by=1、cx+dy=0。','将第一式乘d减第二式乘b得Δx=d；将第二式乘a减第一式乘c得Δy=−c。因Δ≠0，第一列为(d,−c)/Δ。','第二列(u,v)需要满足au+bv=0、cu+dv=1。','同样用d×第一式−b×第二式得Δu=−b；a×第二式−c×第一式得Δv=a，第二列为(−b,a)/Δ。','把两列拼起来，得到A⁻¹=(1/Δ)[[d,−b],[−c,a]]。']),
 route('左右乘法检验',['取伴随矩阵B=[[d,−b],[−c,a]]。','计算AB：对角元为ad−bc，非对角元为0，故AB=ΔI。','计算反向乘积BA，也得到ΔI。','因为Δ≠0，两边同时除以Δ，得到A(B/Δ)=(B/Δ)A=I。','所以B/Δ确为逆矩阵；Δ=0时不能执行这一步。'])
 ],[
 ['A\\binom xy=\\binom10','\\Delta x=d,\\quad\\Delta y=-c','A\\binom uv=\\binom01','\\Delta u=-b,\\quad\\Delta v=a','A^{-1}=\\frac1\\Delta\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}'],
 ['B=\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}','AB=\\Delta I','BA=\\Delta I','A\\frac B\\Delta=\\frac B\\Delta A=I','A^{-1}=\\frac B\\Delta\\quad(\\Delta\\ne0)']
 ],(r,n)=>heading(r?'两边相乘都恢复单位矩阵':'两列分别恢复两个单位向量')+table(r?['构造 B：交换对角，另两项变号','AB：对角 Δ，非对角0','BA：对角 Δ，非对角0','除以非零 Δ，恢复单位矩阵','原输入 → A → A⁻¹ → 原输入']:['第一目标：(1,0)','第一输入：(d,−c)/Δ','第二目标：(0,1)','第二输入：(−b,a)/Δ','两列组成同一个恢复变换'],n));
 add(['dot-product','orthogonal'],'柯西不等式：投影不会比原向量更长','实内积空间中的u、v；先单独处理v=0，此时两边都为0。v≠0时可除以‖v‖²。',[
 route('配方后的非负二次式',['若v=0，不等式直接成立；以下设v≠0。','对任意实数t，有‖u−tv‖²=‖v‖²t²−2(u·v)t+‖u‖²≥0。','取t=(u·v)/‖v‖²，使这项达到最小。','代入得到‖u‖²−(u·v)²/‖v‖²≥0。','移项并开平方，得|u·v|≤‖u‖‖v‖；等号恰在u与v线性相关时成立。']),
 route('正交投影与勾股',['设v≠0，令p=[(u·v)/‖v‖²]v，w=u−p。','直接计算w·v=0，故p与w正交。','勾股关系给出‖u‖²=‖p‖²+‖w‖²≥‖p‖²。','由p的表达式可得‖p‖=|u·v|/‖v‖。','两边乘以正数‖v‖得到不等式；残差w=0时恰好取等号。'])
 ],[
 ['v=0\\Longrightarrow |u\\cdot v|=0','\\|u-tv\\|^2=\\|v\\|^2t^2-2(u\\cdot v)t+\\|u\\|^2\\ge0','t_0=\\frac{u\\cdot v}{\\|v\\|^2}','\\|u\\|^2-\\frac{(u\\cdot v)^2}{\\|v\\|^2}\\ge0','|u\\cdot v|\\le\\|u\\|\\|v\\|'],
 ['p=\\frac{u\\cdot v}{\\|v\\|^2}v,\\quad w=u-p','w\\cdot v=0','\\|u\\|^2=\\|p\\|^2+\\|w\\|^2\\ge\\|p\\|^2','\\|p\\|=\\frac{|u\\cdot v|}{\\|v\\|}','|u\\cdot v|\\le\\|u\\|\\|v\\|']
 ],(r,n)=>{if(!r){let d='',X=t=>80+t*220,Y=q=>295-q*7;for(let i=0;i<=100;i++){let t=i*.02;let q=16*t*t-24*t+13;d+=(i?'L':'M')+X(t)+' '+Y(q);}return heading('示例u=(3,2)，v=(4,0)')+line(55,295,550,295)+`<path d="${d}" stroke="${blue}" stroke-width="3" fill="none"/>`+dot(X(.75),Y(4),orange,7)+T(300,80,'非负二次式：16t²−24t+13',23)+T(300,330,n>=2?'最小值4 ≥ 0；平方范数不可能为负':'任意t对应一个向量u−tv');}let s=heading('示例投影：u=(3,2)，v沿水平轴')+line(80,275,500,275)+line(80,275,350,95,blue)+T(340,70,'u=(3,2)',21)+line(80,275,440,275,green);if(n>=1)s+=line(350,275,350,95,orange,'6 4')+`<path d="M335 275V260H350" fill="none" stroke="${blue}" stroke-width="2"/>`;if(n>=2)s+=line(80,285,350,285,orange)+T(210,320,'投影p：长度3',20);return s+T(480,170,n>=3?'|p| ≤ |u|':'残差w',19);});
 add(['bayes','conditional'],'贝叶斯公式：同一联合事件的两种数法','需P(B)>0。使用P(B|A)时要求P(A)>0；全概率的两类写法还要求P(Aᶜ)>0，零概率类可改用联合概率表述。',[
 route('从同一个联合事件出发',['按条件概率定义，P(A|B)=P(A∩B)/P(B)。','因此P(A∩B)=P(A|B)P(B)。','若P(A)>0，同一联合概率也等于P(B|A)P(A)。','令两种表达式相等，再除以非零P(B)。','得到P(A|B)=P(B|A)P(A)/P(B)；交换条件前后不能直接当作相等。']),
 route('把总体分成两类',['A与Aᶜ把总体分为两类；B由A∩B和Aᶜ∩B互斥地组成。','概率相加得P(B)=P(B|A)P(A)+P(B|Aᶜ)P(Aᶜ)。','在所有B里，属于A的部分概率是P(A∩B)=P(B|A)P(A)。','用这部分除以全部B，得到后验P(A|B)。','矩形图是比例示例：P(A)=1/4，P(B|A)=3/5，P(B|Aᶜ)=1/5，故后验为1/2；一般公式来自定义与加法。'])
 ],[
 ['P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}','P(A\\cap B)=P(A\\mid B)P(B)','P(A\\cap B)=P(B\\mid A)P(A)','P(A\\mid B)P(B)=P(B\\mid A)P(A)','P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}'],
 ['B=(A\\cap B)\\cup(A^c\\cap B)','P(B)=P(B\\mid A)P(A)+P(B\\mid A^c)P(A^c)','P(A\\cap B)=P(B\\mid A)P(A)','P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B\\mid A)P(A)+P(B\\mid A^c)P(A^c)}','P(A\\mid B)=\\frac{(1/4)(3/5)}{(1/4)(3/5)+(3/4)(1/5)}=\\frac12']
 ],(r,n)=>{let s=heading('面积比例示例：整个外框代表概率1');s+=rect(75,65,450,220)+rect(75,65,112.5,220,'#d2e7ed')+T(132,58,'A：1/4')+T(355,58,'Aᶜ：3/4');if(n>=1||r===0)s+=rect(75,65,112.5,132,'#efba89')+rect(187.5,65,337.5,44,'#b8d7c9')+T(132,135,'A∩B',17)+T(355,94,'Aᶜ∩B',17);s+=T(300,320,n>=3?'橙色占全部B的一半：0.15 / 0.30':'B由橙色与绿色两块组成，互不重叠',20);return s;});
 add(['sets','combinatorics'],'两组名单合并，为何要减去交集？','A、B为有限集合；同一对象须可被识别为同一对象。指示数证明在有限全集U⊇A∪B中求和。',[
 route('按三个互斥区域计数',['把并集分成“仅在A”“同时在A与B”“仅在B”三个互不重叠部分。','|A|包括左侧与中间，|B|包括中间与右侧。','直接相加把中间交集数了两遍。','减去一次交集后，每个对象恰好只算一次。','所以|A∪B|=|A|+|B|−|A∩B|。']),
 route('逐对象检查指示数',['给全集中每个对象x定义1A(x)、1B(x)：属于记1，不属于记0。','不属于两组时，0+0−0=0，与并集指示数相同。','只属于一组时，1+0−0=1或0+1−0=1。','同时属于两组时，1+1−1=1，所以指示数恒等式在四种情形都成立。','对全集中的全部对象求和，就得到集合计数公式。'])
 ],[
 ['A\\cup B=(A\\setminus B)\\cup(A\\cap B)\\cup(B\\setminus A)','|A|=|A\\setminus B|+|A\\cap B|','|A|+|B|=|A\\setminus B|+2|A\\cap B|+|B\\setminus A|','|A|+|B|-|A\\cap B|=|A\\cup B|','|A\\cup B|=|A|+|B|-|A\\cap B|'],
 ['1_A(x),1_B(x)\\in\\{0,1\\}','0+0-0=0','1+0-0=0+1-0=1','1+1-1=1','\\sum_{x\\in U}1_{A\\cup B}(x)=\\sum_{x\\in U}(1_A(x)+1_B(x)-1_{A\\cap B}(x))']
 ],(r,n)=>{if(r)return heading('逐对象检查四种互不遗漏的情况')+table(['A=0，B=0 → 并集0','A=1，B=0 → 并集1','A=0，B=1 → 并集1','A=1，B=1 → 并集1'],Math.max(0,n-1))+T(300,315,'交集项只在最后一行减去1');let s=heading('示例：A有4个，B有3个，重合1个');s+=`<ellipse cx="230" cy="175" rx="145" ry="105" fill="#64a7c133" stroke="${blue}" stroke-width="2"/><ellipse cx="370" cy="175" rx="145" ry="105" fill="#dc9b6533" stroke="${orange}" stroke-width="2"/>`+T(160,90,'A')+T(440,90,'B');[[150,155],[190,195],[190,130],[300,175],[405,150],[430,205]].forEach(([x,y],i)=>{s+=dot(x,y,i===3&&n>=2?orange:blue,10);if(i===3&&n>=2)s+=`<circle cx="${x}" cy="${y}" r="19" stroke="${n>=3?green:orange}" stroke-width="3" fill="none"/>`;});return s+T(300,320,n>=3?'4+3−1=6：每个对象只保留一次':'中间同一个对象，同时属于两组',21);});
}
install.math=math;if(typeof module!=='undefined')module.exports=install;else install(root.MathProofs,root.MathProofVisuals);
})(globalThis);
