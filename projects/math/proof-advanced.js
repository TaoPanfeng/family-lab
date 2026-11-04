/* Exact coordinates and reversible algebra for the advanced proof routes. */
(function(root){'use strict';
function install(P,V){
const T=V.text,blue='#287891',orange='#bd6539',green='#38836c',light='#d5e9ef';
const path=(d,color=blue,width=3,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const dot=(x,y,color=orange)=>`<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`;
const rect=(x,y,w,h,color=light)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="${blue}" stroke-width="2"/>`;
const axes=(x=150,y=260)=>path(`M55 ${y}H550 M${x} 315V30`,'#97afb7',1.5)+T(548,y+22,'x')+T(x-16,28,'y');
const curve=(fn,lo,hi,X,Y)=>{let s='';for(let i=0;i<=100;i++){const x=lo+(hi-lo)*i/100;s+=(i?'L':'M')+X(x)+' '+Y(fn(x))+' ';}return s;};
function set(id,title,conditions,routes){P[id]={title,conditions,routes:routes.map(([name,steps,formula])=>({name,steps,formula}))};}
function register(id,draw){V.register(id,(route,step)=>{const r=P[id].routes[route],n=Math.max(0,Math.min(step,r.steps.length-1));return {svg:V.svg(draw(route,n),r.name+'；第'+(n+1)+'步'),formula:r.formula[n],note:r.steps[n].replace(/\\\(|\\\)/g,'')};});}

set('quadratic','二次方程、顶点与对称轴的完整推导','a、b、c为实数，a≠0；实数平方非负。Δ=b²−4ac。图中采用f(x)=x²−4x+3作为例子，一般结论由代数证明。',[
 ['配方法：等价变形求全部实根',[
  '从一般方程开始，a≠0才能除以a。','两边同除以a，保持解集不变。','常数项移到右边。','两边同时加上一次项系数一半的平方。','左边配成完全平方，右边通分。','令Δ=b²−4ac；4a²始终为正。','Δ≥0时开平方，分母先写2|a|，不能直接把√(a²)当成a。','两个正负分支组成同一个解集；乘上a/|a|只交换正负号，所以得到标准公式。','Δ<0无实根；Δ=0一个二重根；Δ>0两个不同实根。'
 ],['ax^2+bx+c=0','x^2+\\frac ba x+\\frac ca=0','x^2+\\frac ba x=-\\frac ca','x^2+\\frac ba x+\\frac{b^2}{4a^2}=-\\frac ca+\\frac{b^2}{4a^2}','\\left(x+\\frac b{2a}\\right)^2=\\frac{b^2-4ac}{4a^2}','\\left(x+\\frac b{2a}\\right)^2=\\frac{\\Delta}{4a^2}','x+\\frac b{2a}=\\pm\\frac{\\sqrt\\Delta}{2|a|}','x=\\frac{-b\\pm\\sqrt\\Delta}{2a}','\\Delta<0:\\;\\varnothing;\\quad\\Delta=0:\\;x=-\\frac b{2a}']],
 ['平方差恒等式：从等价式反向求根',[
  '先展开(2ax+b)²。','从展开式中减去Δ=b²−4ac。','把剩余项提出4a。','因为4a≠0，原方程为零与这个平方差为零完全等价。','实数平方非负；Δ<0没有实根。','Δ≥0时分为正负两式，各是一次方程，穷尽所有可能根。'
 ],['(2ax+b)^2=4a^2x^2+4abx+b^2','(2ax+b)^2-\\Delta=4a^2x^2+4abx+4ac','(2ax+b)^2-\\Delta=4a(ax^2+bx+c)','ax^2+bx+c=0\\iff(2ax+b)^2=\\Delta','\\Delta<0\\Longrightarrow\\text{无实根}','2ax+b=\\pm\\sqrt\\Delta\\Longrightarrow x=\\frac{-b\\pm\\sqrt\\Delta}{2a}']],
 ['配方：顶点式与最值',[
  '先从二次函数而非方程出发，提出二次项系数a。','在括号中加减相同的量，函数值不变。','把前三项配成平方，展开外面的a。','定义h、k，得到顶点式。','平方项在x=h时等于零；当a>0时这里最小，当a<0时这里最大。','图像由y=ax²平移(h,k)得到，顶点(h,k)，对称轴x=h。'
 ],['y=a\\left(x^2+\\frac ba x\\right)+c','y=a\\left[\\left(x+\\frac b{2a}\\right)^2-\\frac{b^2}{4a^2}\\right]+c','y=a\\left(x+\\frac b{2a}\\right)^2+c-\\frac{b^2}{4a}','h=-\\frac b{2a},\\quad k=c-\\frac{b^2}{4a},\\quad y=a(x-h)^2+k','(x-h)^2\\ge0,\\quad f(h)=k','\\text{顶点}(h,k),\\quad\\text{对称轴 }x=h']],
 ['对称性：成对坐标直接验证',[
  '设h=−b/(2a)，比较对称横坐标h+t与h−t。','分别代入并展开。','计算两个函数值的差。','因为2ah+b=0，差对任意t均为零。','所以每一点都有关于x=h的对称点。','再将x=h代回，顶点的纵坐标为c−b²/(4a)。'
 ],['h=-\\frac b{2a},\\quad x_1=h+t,\\quad x_2=h-t','f(h\\pm t)=ah^2\\pm2aht+at^2+bh\\pm bt+c','f(h+t)-f(h-t)=2t(2ah+b)','2ah+b=0\\Longrightarrow f(h+t)=f(h-t)','\\text{对称轴 }x=h','f(h)=c-\\frac{b^2}{4a}']]
]);
register('quadratic',(r,n)=>{const X=x=>130+x*75,Y=y=>245-y*25;let s=axes(130,245)+path(curve(x=>x*x-4*x+3,-.1,4.1,X,Y));
 s+=T(420,35,'例：y=x²−4x+3',19)+T(420,62,'h=2，k=−1',18);
 if(n>=1)s+=path(`M${X(2)} 65V300`,orange,2,'5 4')+T(X(2),328,'x=2');
 if(r<2&&n>=3)s+=dot(X(1),Y(0))+dot(X(3),Y(0))+T(X(1),Y(0)-18,'根1')+T(X(3),Y(0)-18,'根3');
 if(r===2&&n>=2)s+=dot(X(2),Y(-1))+T(X(2)+68,Y(-1)+23,'顶点(2,−1)');
 if(r===3&&n>=1)s+=dot(X(1),Y(0))+dot(X(3),Y(0))+path(`M${X(1)} ${Y(0)}H${X(3)}`,green,2,'5 4')+T(300,110,'横坐标2−1和2+1，高度相同');
 return s;});

set('linear-function','一次函数为什么形成直线？','实数k、b固定，y=kx+b；严格的一次函数要求k≠0，k=0得到水平直线。直线斜率由相似直角三角形定义。',[
 ['坐标方程与直线斜率', ['直线通过B=(0,b)，斜率为k；在直线上另取一点P=(x,y)。','x≠0时，斜率定义给出(y−b)/x=k。','乘以x，得到y−b=kx。','整理得y=kx+b；x=0时原点对应的纵坐标就是b。','反过来，满足该方程的点都与B有相同斜率，因此都在这条直线上。'],['B=(0,b),\\quad P=(x,y)','\\frac{y-b}{x}=k\\quad(x\\ne0)','y-b=kx','y=kx+b','\\frac{(kx+b)-b}{x}=k']],
 ['任意两点与中间点', ['在图像上任取P、Q两点，横坐标不同。','将两个函数等式相减，常数b抵消。','两边除以非零的横坐标差，得到固定斜率k。','从P向Q取任意比例t，线性插值的坐标仍满足同一个函数式。','t取全部实数时遍历PQ所在直线，所以整个图像恰好是直线。'],['P=(x_1,kx_1+b),\\quad Q=(x_2,kx_2+b)','y_2-y_1=k(x_2-x_1)','\\frac{y_2-y_1}{x_2-x_1}=k','(1-t)y_1+ty_2=k[(1-t)x_1+tx_2]+b','t\\in\\mathbb R:\\quad y=kx+b']]
]);
register('linear-function',(r,n)=>{const X=x=>150+x*65,Y=y=>275-y*32;let s=axes(150,275)+path(curve(x=>x+2,-1.5,5,X,Y))+dot(X(0),Y(2))+T(105,Y(2),'b=2');if(n>=1)s+=dot(X(3),Y(5))+path(`M${X(0)} ${Y(2)}H${X(3)}V${Y(5)}`,orange,2,'6 4')+T(255,225,'Δx=3')+T(393,175,'Δy=3');if(r===1&&n>=3){const t=.5;s+=dot(X(3*t),Y(2+3*t),green)+T(400,80,'中间点也在同一直线上');}return s+T(400,40,'例：y=x+2');});

set('function-domain','定义域、陪域和值域：三个集合如何区分？','函数f:A→B要求每个输入有且只有一个输出；值域f(A)包含于陪域B。以下是定义与例证，不把定义冒充定理。',[
 ['有限集合逐个检查',['先指定输入集合A={−1,0,1}。','再指定陪域B={0,1,2}，规则f(x)=x²。','逐个计算：−1和1都输出1，0输出0。','实际输出集合只有{0,1}，陪域中的2没有被取到。','不同输入可以有同一输出；这不违反单值对应。'],['A=\\{-1,0,1\\}','f:A\\to B,\\quad B=\\{0,1,2\\}','f(-1)=1,\\quad f(0)=0,\\quad f(1)=1','f(A)=\\{0,1\\}\\subsetneq B','f(-1)=f(1)']],
 ['区间上的平方函数',['规定f(x)=x²，定义域为闭区间[−2,1]。','平方非负，所以所有输出至少为0；x=0时取到0。','该区间内|x|≤2，所以x²≤4；x=−2时取到4。','任取y∈[0,4]，x=−√y属于[−2,0]，且x²=y。','既没有区间外的输出，也没有区间内遗漏的输出，值域恰为[0,4]。'],['f(x)=x^2,\\quad x\\in[-2,1]','x^2\\ge0,\\quad f(0)=0','|x|\\le2\\Longrightarrow x^2\\le4','y\\in[0,4]\\Longrightarrow x=-\\sqrt y\\in[-2,0]','f([-2,1])=[0,4]']]
]);
register('function-domain',(r,n)=>{if(r===0){let s='<ellipse cx="155" cy="175" rx="100" ry="125" fill="#e0eff3" stroke="'+blue+'"/>'+T(155,30,'定义域A');if(n>=1)s+='<ellipse cx="445" cy="175" rx="100" ry="125" fill="#f6e8df" stroke="'+orange+'"/>'+T(445,30,'陪域B');for(let i=0;i<3;i++)s+=T(140,107+i*68,[-1,0,1][i])+(n>=1?T(460,107+i*68,i):'');if(n>=2){s+=path('M175 101L425 169 M175 169L425 101 M175 237L425 169',blue,2);if(n>=3)s+='<ellipse cx="460" cy="135" rx="32" ry="62" fill="none" stroke="'+green+'" stroke-width="3"/>'+T(305,330,'值域f(A)={0,1}；2在陪域中，但没有原像');}return s;}
 const X=x=>300+x*75,Y=y=>290-y*50;let s=axes(300,290)+path(curve(x=>x*x,-2,1,X,Y));if(n>=1)s+=dot(X(0),Y(0));if(n>=2)s+=dot(X(-2),Y(4))+dot(X(1),Y(1))+path('M75 290V90',orange,7)+T(82,65,'值域[0,4]');if(n>=3)s+=dot(X(-Math.sqrt(2)),Y(2),green)+path(`M${X(-Math.sqrt(2))} ${Y(2)}H75`,green,2,'5 4');return s;});

set('function-transform','函数平移为什么是“左加右减”？','原函数f定义在A上；g(x)=f(x−h)+k定义在A+h上。h、k可为负，方向按有向位移解释。',[
 ['从原点到新点',['原图像任取P=(u,f(u))。','将点沿向量(h,k)移动，得到P′=(u+h,f(u)+k)。','新横坐标记为x=u+h，因此u=x−h。','把u代回新纵坐标，得到g(x)=f(x−h)+k。','每一点都能逆移回原图像，故两图像恰好相差平移向量(h,k)。'],['P=(u,f(u))','P^{\\prime}=(u+h,f(u)+k)','x=u+h\\iff u=x-h','g(x)=f(x-h)+k','(x,y)\\longleftrightarrow(x-h,y-k)']],
 ['从新函数反查输入',['在新函数中取任意允许的横坐标x。','新规则先计算u=x−h，所以真正交给原函数的是u。','原函数在u的输出是f(u)，再加k。','对应的原点是(u,f(u))，新点是(u+h,f(u)+k)。','因此h>0时向右移，h<0时向左移；k同理控制上下。'],['g(x)=f(x-h)+k','u=x-h','g(x)=f(u)+k','(u,f(u))\\mapsto(u+h,f(u)+k)','h>0:\\text{右移};\\quad h<0:\\text{左移}']]
]);
register('function-transform',(r,n)=>{if(r===2){const X=x=>300+x*85,Y=y=>260-y*45;let s=axes(300,260)+path(curve(x=>2**x,-2,2.2,X,Y))+T(140,35,'蓝：f(x)=2ˣ',18);if(n>=1)s+=path(curve(x=>2**(-2*x),-.8,2.2,X,Y),green,2,'5 4')+T(425,65,'绿：f(−2x)',18);if(n>=3)s+=path(curve(x=>-.5*2**(-2*x)+2,-1.3,2.2,X,Y),orange)+dot(X(1),Y(2))+dot(X(-.5),Y(1))+path(`M${X(1)} ${Y(2)}L${X(-.5)} ${Y(1)}`,orange,2)+T(300,337,'橙：g(x)=−½f(−2x)+2',18);return s;}const X=x=>220+x*60,Y=y=>280-y*35;let s=axes(220,280)+path(curve(x=>x*x,-2.4,2.4,X,Y));if(n>=1)s+=path(curve(x=>(x-2)*(x-2)+1,-.4,4.4,X,Y),orange)+dot(X(0),Y(0))+dot(X(2),Y(1))+path(`M${X(0)} ${Y(0)}L${X(2)} ${Y(1)}`,green,3)+T(395,60,'右2、上1');return s+T(105,50,'蓝：y=x²')+T(420,325,'橙：y=(x−2)²+1');});

set('inverse-function','反比例函数：为什么总量固定，图像却不是直线？','本节点讨论反比例函数y=k/x，不是“反函数”的通用定义。k≠0，x≠0；生活分配例还要求x>0。',[
 ['固定乘积与伸缩',['设总量为固定非零数k，x份各有y，则xy=k。','x≠0时，两边同除以x，得到y=k/x。','若份数变为λx，λ≠0，新函数值变为原来的1/λ。','例如k=12，x从2变4，y从6变3；点不沿固定斜率移动。','x=0时不存在使0×y=k的数，图像不能经过纵轴。'],['xy=k','y=\\frac kx,\\quad x\\ne0','f(\\lambda x)=\\frac1\\lambda f(x)','2\\times6=4\\times3=12','k\\ne0\\Longrightarrow x\\ne0']],
 ['象限、渐近线与非直线',['k>0时x、y同号，图像在第一、三象限；k<0时异号。','任意两横坐标x₁、x₂对应的割线斜率为−k/(x₁x₂)。','斜率随取点变化，所以图像不是直线。','当|x|无限增大时，|k/x|趋于0，所以横轴是水平渐近线。','当x趋近0时，函数值绝对值无界，纵轴是竖直渐近线；图像始终不穿过两坐标轴。'],['\\operatorname{sgn}(y)=\\operatorname{sgn}(k)\\operatorname{sgn}(x)','\\frac{k/x_2-k/x_1}{x_2-x_1}=-\\frac{k}{x_1x_2}','-\\frac{k}{x_1x_2}\\text{随取点变化}','\\lim_{|x|\\to\\infty}\\frac kx=0','\\lim_{x\\to0}\\left|\\frac kx\\right|=\\infty']]
]);
register('inverse-function',(r,n)=>{const X=x=>300+x*38,Y=y=>180-y*22;let s=axes(300,180)+path(curve(x=>12/x,1.6,6,X,Y))+path(curve(x=>12/x,-6,-1.6,X,Y));if(n>=1)s+=dot(X(2),Y(6))+dot(X(4),Y(3))+T(X(2)-40,Y(6),'(2,6)')+T(X(4)+34,Y(3),'(4,3)');if(r===0&&n>=2)s+=rect(X(0),Y(6),76,132,'#d5e9ef44')+rect(X(0),Y(3),152,66,'#f0b38444');if(r===1&&n>=2)s+=path(`M${X(2)} ${Y(6)}L${X(4)} ${Y(3)}`,orange,2,'5 4');return s+T(485,34,'例：y=12/x');});

set('exponential','指数增长与实数指数：哪些是证明，哪些是定义？','底数a>0且a≠1。整数指数由乘法定义，有理指数用唯一正根定义；实数指数使用连续扩展，此处不把有限例子当成实数完备性证明。',[
 ['从整数到有理数指数',['正整数指数aⁿ是n个a相乘，约定a⁰=1。','把两个有限乘积连接，得到整数指数的加法法则。','为了保持同一法则，负整数指数定义为正指数的倒数。','对正整数q，a^(p/q)定义为(aᵖ)的唯一正q次根；必须取正根。','有理指数的运算法则由正根的唯一性推出，再以连续性扩展到实数。','因此任意相同水平增量h对应固定纵向倍率aʰ。'],['a^n=\\underbrace{a\\cdots a}_{n\\text{个}},\\quad a^0=1','a^{m+n}=a^ma^n\\quad(m,n\\in\\mathbb Z_{\\ge0})','a^{-n}=\\frac1{a^n}','a^{p/q}=\\sqrt[q]{a^p}>0','a^{x+y}=a^xa^y\\quad(x,y\\in\\mathbb R)','\\frac{f(x+h)}{f(x)}=a^h']],
 ['固定倍率与单调性',['图像先以a=2为例，经过(0,1)。','横坐标每加1，函数值都乘2。','一般底数a>1时，对于x₂>x₁，有a^(x₂−x₁)>1。','所以aˣ²>aˣ¹，函数严格递增。','0<a<1时，写成a=1/b且b>1；取倒数后严格递减。','所有函数值均为正，图像不与横轴相交。'],['f(0)=a^0=1','f(x+1)=af(x)','x_2>x_1,\\quad a>1\\Longrightarrow a^{x_2-x_1}>1','\\frac{a^{x_2}}{a^{x_1}}>1','0<a<1\\Longrightarrow a^x=(1/a)^{-x}','a^x>0']]
]);
register('exponential',(r,n)=>{const X=x=>160+x*67,Y=y=>295-y*26;let s=axes(160,295)+path(curve(x=>2**x,-1.3,3.2,X,Y));for(let i=0;i<=Math.min(3,n);i++){s+=dot(X(i),Y(2**i))+T(X(i)+22,Y(2**i)-12,String(2**i));if(i>0)s+=T(X(i)-34,325,'×2',16);}if(r===1&&n>=4)s+=path(curve(x=>.5**x,-1.3,3.2,X,Y),orange)+T(435,85,'橙：y=(1/2)ˣ');return s+T(420,38,'蓝：y=2ˣ');});

set('logarithms','对数互逆与运算法则：逐步从指数定义推出','a>0且a≠1，所有对数真数为正。指数函数在实数上连续、严格单调，值域(0,+∞)，所以每个正数有唯一的实数对数。',[
 ['指数与对数互逆',['指数函数对每个实数x给出唯一正数aˣ。','连续、严格单调并取遍正数，因此给定b>0，aˣ=b有唯一实数解。','把这个解命名为logₐb，这是对数的定义。','将定义代回指数函数，得到a^(logₐb)=b。','给定任意x，对aˣ取对数又回到x。','交换横纵坐标后两幅函数图像关于y=x对称；图中例子是底数2。'],['x\\mapsto a^x>0','b>0\\Longrightarrow\\exists!x:\\;a^x=b','\\log_a b=x\\iff a^x=b','a^{\\log_a b}=b','\\log_a(a^x)=x','(x,a^x)\\longleftrightarrow(a^x,x)']],
 ['乘积、商与幂公式',['设u=logₐM、v=logₐN，其中M,N>0。','按定义M=aᵘ、N=aᵛ。','相乘得到MN=a^(u+v)，取对数得到乘积公式。','相除得到M/N=a^(u−v)，所以商的对数等于对数之差。','对任意实数r，Mʳ=a^(ru)，所以幂的对数等于r倍原对数。','这些都是正真数上的公式；logₐ(M+N)没有相同的拆分规则。'],['u=\\log_a M,\\quad v=\\log_a N','M=a^u,\\quad N=a^v','\\log_a(MN)=u+v','\\log_a(M/N)=u-v','\\log_a(M^r)=ru','\\log_2(1+1)=1\\ne0=\\log_2 1+\\log_2 1']]
]);
register('logarithms',(r,n)=>{if(r===1){let s=rect(65,70,150,90)+rect(385,70,150,90,'#f3ddcd')+T(140,105,n===0?'u=log₂4':'M=2²=4')+T(460,105,n===0?'v=log₂8':'N=2³=8')+T(300,208,n<2?'先把真数改写成同底数幂':'MN=2²×2³=2⁵=32',21);if(n>=2)s+=path('M140 166L285 225 M460 166L315 225',orange,3)+T(300,275,'log₂32=5=2+3');if(n>=3)s+=T(300,325,n===3?'4/8=2⁻¹；商的指数相减':'4³=2⁶；幂的指数相乘');return s;}
 const X=x=>110+x*53,Y=y=>295-y*53;let s=axes(110,295)+path('M110 295L375 30','#a4b7bd',2,'5 4')+path(curve(x=>2**x,-1.1,2.25,X,Y));if(n>=1)s+=path(`M${X(-.8)} ${Y(4)}H${X(2)}V${Y(0)}`,green,2,'4 4')+dot(X(2),Y(4),green)+T(440,92,'b=4只交于x=2',17);if(n>=2)s+=path(curve(x=>Math.log2(x),.85,4.8,X,Y),orange);if(n>=3)s+=dot(X(2),Y(4))+dot(X(4),Y(2))+path(`M${X(2)} ${Y(4)}L${X(4)} ${Y(2)}`,green,2,'4 4')+T(440,50,'(2,4)↔(4,2)');return s;});

set('conics','圆锥曲线：从距离定义到标准方程','欧氏直角坐标系。椭圆a>c>0，b²=a²−c²；抛物线p>0；双曲线c>a>0，b²=c²−a²。每次平方后都检查非负条件。',[
 ['椭圆：两次平方并反向排除增根',['令F₁=(−c,0)、F₂=(c,0)，两焦距记为r₁、r₂，定义r₁+r₂=2a。','因为r₁²−r₂²=4cx，把和2a代入，得r₁−r₂=2cx/a。','将和与差联立，得到r₁=a+cx/a，r₂=a−cx/a。','把r₂²=(x−c)²+y²两边展开。','约去两侧−2cx，再移项合并x²项，得到(1−c²/a²)x²+y²=a²−c²。','令b²=a²−c²>0，同除b²，得到椭圆标准方程。','反向检查：标准方程给出|x|≤a，所以a±cx/a≥a−c>0。','两个非负距离的平方分别等于(a±cx/a)²，只能取正号；因此r₁+r₂=2a，没有引入增根。'],['r_1+r_2=2a,\\quad r_{1,2}=\\sqrt{(x\\pm c)^2+y^2}','(r_1-r_2)(2a)=4cx','r_1=a+\\frac{cx}a,\\quad r_2=a-\\frac{cx}a','(x-c)^2+y^2=\\left(a-\\frac{cx}a\\right)^2','\\left(1-\\frac{c^2}{a^2}\\right)x^2+y^2=a^2-c^2','\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\quad b^2=a^2-c^2','|x|\\le a\\Longrightarrow a\\pm\\frac{cx}a>0','r_1+r_2=\\left(a+\\frac{cx}a\\right)+\\left(a-\\frac{cx}a\\right)=2a']],
 ['抛物线：焦点与准线等距',['取焦点F=(p,0)、准线x=−p，p>0。','点P=(x,y)到焦点的距离是√((x−p)²+y²)，到准线的距离是|x+p|。','按等距定义令两者相等；两边均非负，平方是等价操作。','展开两边，约去x²和p²。','得到y²=4px，所以x≥0，顶点在原点、开口向右。','反向代入得到焦距平方=(x+p)²，且x+p>0；开方后恰是到准线距离，确认没有增根。'],['F=(p,0),\\quad d:\\;x=-p','PF=\\sqrt{(x-p)^2+y^2},\\quad d(P,d)=|x+p|','(x-p)^2+y^2=(x+p)^2','x^2-2px+p^2+y^2=x^2+2px+p^2','y^2=4px\\Longrightarrow x\\ge0','PF=\\sqrt{(x+p)^2}=x+p=d(P,d)']],
 ['双曲线：两焦距之差',['取焦点(−c,0)、(c,0)，c>a>0；先讨论右支。','右支定义r₁−r₂=2a；用平方差4cx求和，得r₁+r₂=2cx/a。','联立得r₂=cx/a−a，必为非负。','平方并展开r₂²=(x−c)²+y²。','整理并令b²=c²−a²，得到x²/a²−y²/b²=1。','反向在右支x≥a上，cx/a−a≥c−a>0，因此可恢复原距离差；左支由关于纵轴的对称得到。'],['r_1-r_2=2a,\\quad c>a>0','r_1+r_2=\\frac{4cx}{2a}=\\frac{2cx}a','r_2=\\frac{cx}a-a\\ge0','(x-c)^2+y^2=\\left(\\frac{cx}a-a\\right)^2','\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1,\\quad b^2=c^2-a^2','|r_1-r_2|=2a']]
]);
register('conics',(r,n)=>{const X=x=>300+x*60,Y=y=>185-y*60;let s=axes(300,185);if(r===0){const a=3,b=2,{c,x,y}=install.model.ellipse(a,b,.9);s+=`<ellipse cx="300" cy="185" rx="180" ry="120" fill="none" stroke="${blue}" stroke-width="3"/>`+dot(X(-c),Y(0))+dot(X(c),Y(0))+T(X(-c),216,'F₁')+T(X(c),216,'F₂');if(n>=1)s+=path(`M${X(-c)} 185L${X(x)} ${Y(y)}L${X(c)} 185`,orange)+dot(X(x),Y(y))+T(X(x)+14,Y(y)-16,'P');if(n>=3)s+=T(300,320,'r₁+r₂=6；a=3，b=2，c=√5');if(n>=6)s+=path('M120 185V196 M480 185V196',green,3)+T(300,348,'反查：−3≤x≤3，两个距离都为正',16);return s;}
 if(r===1){const p=.6,O=200,scale=48,XX=x=>O+x*scale,YY=y=>185-y*scale;let d='';for(let i=0;i<=80;i++){const y=-2.5+5*i/80,{x}=install.model.parabola(p,y);d+=(i?'L':'M')+XX(x)+' '+YY(y)+' ';}s=axes(O,185)+path(d)+path(`M${XX(-p)} 35V325`,orange,2,'5 4')+dot(XX(p),185)+T(XX(-p)-30,45,'准线')+T(XX(p)+15,210,'F');if(n>=1){const y=1.5,{x}=install.model.parabola(p,y);s+=dot(XX(x),YY(y))+path(`M${XX(p)} 185L${XX(x)} ${YY(y)}L${XX(-p)} ${YY(y)}`,green)+T(XX(x)+25,YY(y)-12,'P')+path(`M${XX(-p)+10} ${YY(y)}v10h-10`,orange,1.5);}return s+T(405,320,'y²=4px；p=0.6');}
 if(r===3){const XX=x=>300+(x-1)*55,YY=y=>185-(y+1)*55;let c=axes(245,130)+`<circle cx="300" cy="185" r="110" fill="none" stroke="${blue}" stroke-width="3"/>`+dot(300,185)+T(270,245,'C(1,−1)',18);if(n>=1)c+=dot(XX(2.6),YY(.2))+path(`M300 185L${XX(2.6)} ${YY(.2)}`,orange)+T(XX(2.6)+19,YY(.2)-15,'P');if(n>=2)c+=path(`M300 185H${XX(2.6)}V${YY(.2)}`,green,2,'4 4')+T(344,206,'x−1',16)+T(430,153,'y+1',16);if(n>=3)c+=T(300,330,'(x−1)²+(y+1)²=4',22);return c;}
 const a=1.4,b=1,c=Math.hypot(a,b);for(const sign of [-1,1]){let d='';for(let i=0;i<=80;i++){const y=-2.2+4.4*i/80,x=sign*install.model.hyperbola(a,b,Math.asinh(y/b)).x;d+=(i?'L':'M')+X(x)+' '+Y(y)+' ';}s+=path(d);}s+=dot(X(-c),185)+dot(X(c),185)+T(X(-c),216,'F₁')+T(X(c),216,'F₂');if(n>=1){const y=1,x=a*Math.sqrt(2);s+=path(`M${X(-c)} 185L${X(x)} ${Y(y)}L${X(c)} 185`,orange)+dot(X(x),Y(y));}return s+T(300,340,'右支r₁−r₂=2a；左支r₂−r₁=2a');});

const volumeRoutes=[
 ['逐层计数：从整数到实际长度',['先看整数边长l、w、h：底层有lw个单位立方体。','一共有h层，每层数量相同。','因此总体积为lwh，单位是长度单位的三次方。','若边长是有理数，取共同小单位1/q；每小块体积为1/q³，计数后仍得到lwh。','对任意正实数边长，用越来越细的有理数长方体从内外夹住；依体积单调性与连续性，极限仍为lwh。'],['N_{\\text{底层}}=lw','N_{\\text{总}}=(lw)h','V=lwh','V=\\frac{(ql)(qw)(qh)}{q^3}=lwh','V=\\lim l_nw_nh_n=lwh']],
 ['展开六个面：表面积',['长方体有三组相对面，每组两块全等矩形。','上下面面积各为lw。','前后面面积各为lh，左右面面积各为wh。','把六块外表面面积相加；公共边没有面积，不需重复扣除。','得到S=2(lw+lh+wh)，单位是平方长度，不能与体积相加。'],['S=2A_1+2A_2+2A_3','A_1=lw','A_2=lh,\\quad A_3=wh','S=lw+lw+lh+lh+wh+wh','S=2(lw+lh+wh)']]
];
set('volume','长方体的体积与表面积为什么不同？','l、w、h均为正。单位立方体计数先适用于整数边长，推广到实数长度还使用体积的单调性与连续性。',volumeRoutes);
const cuboid=(x=120,y=100,w=200,h=130,d=70)=>`<polygon points="${x},${y} ${x+d},${y-40} ${x+w+d},${y-40} ${x+w},${y}" fill="${light}" stroke="${blue}" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${light}" stroke="${blue}" stroke-width="2"/><polygon points="${x+w},${y} ${x+w+d},${y-40} ${x+w+d},${y+h-40} ${x+w},${y+h}" fill="#bdd9e2" stroke="${blue}" stroke-width="2"/>`;
function net(n){const u=38,x=120,y=90;let s='';const faces=[[0,0,4,2],[0,2,4,3],[0,5,4,2],[0,7,4,3],[-2,2,2,3],[4,2,2,3]];faces.forEach(([dx,dy,w,h],i)=>{const sc=.65,xx=x+dx*u*sc,yy=y+dy*u*sc;s+=rect(xx,yy,w*u*sc,h*u*sc,i<=n?'#efbd994d':light)+T(xx+w*u*sc/2,yy+h*u*sc/2+5,['lh','lw','lh','lw','wh','wh'][i],17);});return s+T(420,110,'长4，宽3，高2')+T(420,155,'六个矩形刚好展开')+T(420,200,'同一组相对面全等')+T(420,250,'S=2(12+8+6)=52');}
function volumeDraw(r,n){if(r===1)return net(n);let s=cuboid()+T(300,315,'长4 × 宽3 × 高2 = 24');if(n>=1)s+=path('M120 165H320L390 125',orange,3);if(n>=2){for(let k=1;k<4;k++)s+=path(`M${120+k*50} 100V230`,blue,1);for(let k=1;k<3;k++)s+=path(`M${120+k*70/3} ${100-k*40/3}H${320+k*70/3}`,blue,1);}return s+T(300,40,'逐层计数（斜投影示意，读标注不量斜边）');}
register('volume',volumeDraw);

set('space-geometry','空间几何：三视图、截面积与体积推导','三视图采用正交投影且说明观察方向。体积推导使用已建立的面积公式；截面积积分路线先修积分，卡瓦列里路线先修等截面等体积原理，不把示意图当作体积测量。',[
 ['三视图：投影保留哪些尺寸？',['设长方体长4沿x轴、宽3沿y轴、高2沿z轴。','沿−y方向正视，保留x、z坐标，看到4×2矩形。','沿−z方向俯视，保留x、y坐标，看到4×3矩形。','沿−x方向侧视，保留y、z坐标，看到3×2矩形。','一个投影会丢失沿观察方向的深度；三个视图共同约束这个长方体，不能据此宣称任意复杂物体都能唯一还原。'],['(x,y,z)\\in[0,4]\\times[0,3]\\times[0,2]','(x,y,z)\\mapsto(x,z)','(x,y,z)\\mapsto(x,y)','(x,y,z)\\mapsto(y,z)','\\text{投影通常丢失一个坐标}']],
 ...volumeRoutes,
 ['棱柱与圆柱：恒定截面',['取高度为h的直棱柱或直圆柱，底面积记为A。','在任意高度z，平行底面的截面都与底面全等，所以截面积仍为A。','把高度均分成n份，每层厚度h/n。','所有层的体积加起来为n·A·h/n=Ah；也可直接用恒截面积的积分。','圆柱底面是半径r的圆，代入A=πr²，得到V=πr²h。'],['A(z)=A,\\quad0\\le z\\le h','A_1=A_2=\\cdots=A','\\Delta z=\\frac hn','V=\\int_0^h A\\,dz=Ah','V_{\\text{圆柱}}=\\pi r^2h']],
 ['棱锥与圆锥：相似截面的平方比',['从锥顶开始量高度z，总高度为h，底面积A。','平行底面的截面与底面相似，长度比为z/h。','面积按长度比的平方变化，所以截面积为A(z/h)²。','先修积分后，沿高度把截面积累加。','计算积分得到Ah/3；圆锥代入A=πr²，得到πr²h/3。','这是几何形体的体积结论，不是把同一外观画成几层后直接数出来。'],['0\\le z\\le h','\\frac{\\text{截面边长}}{\\text{底面边长}}=\\frac zh','A(z)=A\\left(\\frac zh\\right)^2','V=\\int_0^h\\frac{A}{h^2}z^2\\,dz','V=\\frac{Ah}{3},\\quad V_{\\text{圆锥}}=\\frac{\\pi r^2h}{3}','\\text{面积比是长度比的平方}']],
 ['球体积：圆截面与积分',['半径R的球以球心为原点，竖直坐标为z。','在高度z切一圆盘，截面半径记为ρ。','由截面中的直角三角形，ρ²+z²=R²。','所以圆盘面积为π(R²−z²)。','沿z从−R到R积分，得到球体积。','代入端点并相减，结果为4πR³/3。'],['x^2+y^2+z^2=R^2','-R\\le z\\le R','\\rho^2=R^2-z^2','A(z)=\\pi(R^2-z^2)','V=\\int_{-R}^{R}\\pi(R^2-z^2)\\,dz','V=\\pi\\left[R^2z-\\frac{z^3}{3}\\right]_{-R}^R=\\frac{4\\pi R^3}{3}']],
 ['球体积：卡瓦列里与双圆锥',['比较同高2R的球，以及半径R、高2R的圆柱挖去一对共顶圆锥。','在距中间平面z处，圆柱截面积为πR²。','双锥该处截面半径为|z|，被挖面积为πz²。','剩余面积π(R²−z²)与球在同一高度的圆截面积相同。','依卡瓦列里原理，两者体积相同。','圆柱体积减去两个高R、半径R圆锥体积，得到4πR³/3；此路线需先建立锥体体积公式。'],['H=2R','A_{\\text{柱}}=\\pi R^2','A_{\\text{双锥}}(z)=\\pi z^2','A_{\\text{剩余}}(z)=\\pi(R^2-z^2)=A_{\\text{球}}(z)','V_{\\text{球}}=V_{\\text{柱}}-V_{\\text{双锥}}','V=2\\pi R^3-2\\cdot\\frac{\\pi R^3}{3}=\\frac{4\\pi R^3}{3}']]
]);
register('space-geometry',(r,n)=>{if(r===0){let s=cuboid(90,95,160,100,55)+T(235,38,'同一个长4、宽3、高2的长方体');const views=[[370,60,120,60,'正视：4×2'],[370,170,120,90,'俯视：4×3'],[80,270,90,60,'侧视：3×2']];for(let i=0;i<Math.min(3,n);i++){const[x,y,w,h,label]=views[i];s+=rect(x,y,w,h)+T(x+w/2,y-10,label,16);}return s;}
 if(r===1||r===2)return volumeDraw(r-1,n);
 if(r===3){let s=`<ellipse cx="260" cy="80" rx="95" ry="30" fill="${light}" stroke="${blue}" stroke-width="2"/>`+path('M165 80V270 M355 80V270')+`<ellipse cx="260" cy="270" rx="95" ry="30" fill="${light}" stroke="${blue}" stroke-width="2"/>`+T(430,180,'高度h');if(n>=1){const y=120+Math.min(n,3)*30;s+=`<ellipse cx="260" cy="${y}" rx="95" ry="30" fill="#f2c4a688" stroke="${orange}" stroke-width="2"/>`+T(440,y,'截面积A',18);}return s+T(300,340,'所有平行截面面积相等');}
 if(r===4){let s=path('M150 270L300 45L450 270')+`<ellipse cx="300" cy="270" rx="150" ry="35" fill="${light}" stroke="${blue}" stroke-width="2"/>`+path('M300 45V270','#9ab0b8',1,'4 4')+T(485,190,'总高h');if(n>=1){const z=.55,y=45+225*z;s+=`<ellipse cx="300" cy="${y}" rx="${150*z}" ry="${35*z}" fill="#efbb9988" stroke="${orange}" stroke-width="2"/>`+T(450,y-15,'z/h='+z,17);}return s+T(300,340,'锥顶到截面的高度比 → 面积比的平方');}
 const cx=r===6?150:270,R=r===6?90:115,z=.5,radius=R*Math.sqrt(1-z*z),yy=180-z*R;let s=`<circle cx="${cx}" cy="180" r="${R}" fill="${light}" stroke="${blue}" stroke-width="2"/>`;if(n>=1)s+=`<ellipse cx="${cx}" cy="${yy}" rx="${radius}" ry="15" fill="#efbb9988" stroke="${orange}" stroke-width="2"/>`+path(`M${cx} 180V${yy}H${cx+radius}L${cx} 180`,green,2)+T(cx-22,(180+yy)/2,'z',16)+T(cx+radius/2,yy-15,'ρ',16);if(r===6){s+=rect(360,90,180,180,'#d5e9ef66')+path('M360 90L450 180L540 90 M360 270L450 180L540 270',orange,2)+path(`M360 ${yy}H540`,green,3)+path(`M${450-z*R} ${yy}H${450+z*R}`,orange,6)+T(450,310,'橙段：挖去半径|z|的圆盘',16)+T(450,337,'等高、等半径的截面示意',15);}return s+T(cx,340,'ρ²=R²−z²',19);});
P['function-transform'].title='函数图像的平移、伸缩与反射';
P['function-transform'].conditions='平移g(x)=f(x−h)+k；伸缩反射g(x)=A f(Bx)+D中A、B非零。原定义域为E，新定义域为{x:Bx∈E}；坐标图只作特定函数的例证。';
P['function-transform'].routes.push({name:'伸缩与反射：输入倍率要取倒数',steps:[
 '原图上任取P=(u,f(u))；为了让新函数仍读取输入u，必须令Bx=u。',
 '因此新横坐标x=u/B。B的绝对值控制水平比例1/|B|，不是|B|。',
 'B<0还会改变横坐标符号，相当于关于纵轴反射；B>0不反射。',
 '输出先乘A，再加D，所以新纵坐标y=A f(u)+D。',
 'A<0使纵坐标先变号，相当于关于横轴反射，再按|A|伸缩，最后平移D。',
 '每个新点都满足g(x)=A f(Bx)+D，且能由新坐标逆算回原点，故对应不遗漏。',
 '定义域也须跟着输入变化：只有Bx属于原定义域E时新函数才有定义。图示为A=−1/2、B=−2、D=2，横向压缩一半并反射，再纵向变换。'
 ],formula:['P=(u,f(u)),\\quad Bx=u','x=\\frac uB,\\quad\\text{水平比例}=\\frac1{|B|}','B<0:\\quad u\\mapsto-\\frac{u}{|B|}','y=A f(u)+D','A<0:\\quad f(u)\\mapsto-|A|f(u)+D','(u,f(u))\\mapsto\\left(\\frac uB,A f(u)+D\\right)','\\operatorname{Dom}(g)=\\{x:Bx\\in E\\}']});
P.conics.conditions+=' 圆的半径R>0；圆心(h,k)任意，平方距离等于R²与距离等于R等价。';
P.conics.routes.push({name:'圆：圆心与半径的距离方程',steps:[
 '指定圆心C=(h,k)与半径R>0；圆是到C的距离恰好为R的点集。',
 '任取P=(x,y)，两点横、纵坐标差分别是x−h、y−k。',
 '用勾股定理计算距离：CP²=(x−h)²+(y−k)²。',
 'CP=R时平方，得到圆的标准方程；距离与R都非负，所以反向开方也等价。',
 '因此方程的全部实数解恰好组成这个圆，没有增根。图中圆心(1,−1)，R=2。',
 '椭圆的a=b=R时，两焦点合并于圆心，距离和2R就变成2CP=2R；所以圆也是椭圆的特殊情形。'
 ],formula:['C=(h,k),\\quad CP=R>0','\\Delta x=x-h,\\quad\\Delta y=y-k','CP^2=(x-h)^2+(y-k)^2','(x-h)^2+(y-k)^2=R^2','(x-1)^2+(y+1)^2=4','a=b=R,\\quad c=0,\\quad 2CP=2R']});
P.conics.sources=[['OpenStax Precalculus 2e：椭圆定义与方程','https://openstax.org/books/precalculus-2e/pages/10-1-the-ellipse']];
P['space-geometry'].sources=[['OpenStax Calculus Volume 1：截面求体积','https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing'],['Harvard Mathematics：Cavalieri 原理','https://legacy-www.math.harvard.edu/archive/21a_fall_05/exhibits/cavalieri/index.html']];
}
install.model={ellipse:(a,b,t)=>{if(!(a>b&&b>0))throw new RangeError('a>b>0');return {x:a*Math.cos(t),y:b*Math.sin(t),c:Math.sqrt(a*a-b*b)};},parabola:(p,y)=>{if(!(p>0))throw new RangeError('p>0');return {x:y*y/(4*p),y,p};},hyperbola:(a,b,t)=>{if(!(a>0&&b>0))throw new RangeError('a,b>0');return {x:a*Math.cosh(t),y:b*Math.sinh(t),c:Math.hypot(a,b)};},vertex:(a,b,c)=>{if(a===0)throw new RangeError('a≠0');return {h:-b/(2*a),k:c-b*b/(4*a)};}};
if(typeof module!=='undefined')module.exports=install;else install(root.MathProofs,root.MathProofVisuals);
})(globalThis);
