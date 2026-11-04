/* Place value, equal units and finite sums: each route owns its explanation. */
(function(root){'use strict';
function productModel(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||a>99||b<0||b>99)throw new RangeError('本演示使用0到99的整数');
 const top=[Math.floor(a/10),a%10],side=[Math.floor(b/10),b%10],cells=[],diagonals=[0,0,0,0];
 for(let row=0;row<2;row++)for(let col=0;col<2;col++){
  const value=top[col]*side[row],weight=2-row-col,cell={row,col,value,tens:Math.floor(value/10),units:value%10,weight};
  cells.push(cell);diagonals[weight]+=cell.units;diagonals[weight+1]+=cell.tens;
 }
 let carry=0;const columns=diagonals.map((sum,place)=>{const total=sum+carry,result={place,sum,carryIn:carry,total,digit:total%10,carryOut:Math.floor(total/10)};carry=result.carryOut;return result;});
 return {a,b,top,side,cells,columns,partial:[a*side[1],a*side[0]*10],value:columns.reduce((sum,c)=>sum+c.digit*10**c.place,0)};
}
function install(P,V){
 const T=V.text,E=V.esc,blue='#2679aa',orange='#c5753e',light='#d8eaf0',ink='#204b5a';
 const rect=(x,y,w,h,fill=light,stroke=blue)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
 const path=(d,color=blue,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="2"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const dot=(x,y,c=blue)=>`<circle cx="${x}" cy="${y}" r="10" fill="${c}"/>`;
 const card=(x,y,w,h,label,active=false)=>rect(x,y,w,h,active?'#f5dcc6':'#edf5f7',active?orange:blue)+T(x+w/2,y+h/2+6,label);
 function result(id,r,n,body,formula){const p=P[id],route=p.routes[r],step=Math.min(n,route.steps.length-1);return {svg:V.svg(body,route.name+'：'+route.steps[step]),formula,note:route.steps[step]};}
 function bars(x,y,w,count,selected,colour=blue){let body='';for(let i=0;i<count;i++)body+=rect(x+i*w/count,y,w/count,40,i<selected?colour:'#fff');return body;}
 function equationRows(rows,n){return rows.map((row,i)=>card(65,35+i*48,470,39,row,i===Math.min(n,rows.length-1))).join('');}
 P.multiplication={title:'乘法为什么可以用不同方法计算？',conditions:'讨论非负整数乘法；竖式和格子算法按十进制位值计算。点阵与面积用于直观解释，分配律和位值给出算法依据。',routes:[
  {name:'等量分组、连加与点阵',steps:['3×4表示3组，每组4个。先规定每一行表示一组。','画3行、每行4个点；各行一样多，才能用乘法计数。','逐行数：4+4+4=12，所以3×4=12。','把同一批点按4列数，每列有3个，没有添点或漏点。','因此3×4=4×3=12；行列交换改变分组方式，不改变总数。']},
  {name:'面积拆分与分配律',steps:['用宽27、高16的长方形表示27×16；图中长度按同一比例绘制。','把27拆成20+7，高16拆成10+6，画两条切割线。','上面两块面积为20×10=200和7×10=70。','下面两块面积为20×6=120和7×6=42。','四块无重叠、无空缺，面积相加：200+70+120+42=432。','这就是(20+7)(10+6)逐项相乘；拆分的依据是分配律。']},
  {name:'竖式乘法：每一位为什么这样写',steps:['计算27×16，个位对个位、十位对十位；16=6+10。','先算6×7=42，在个位写2，把4个十进到十位。','再算6×2个十+4个十=16个十，第一行部分积是162。','十位的1代表10：27×10=270，第二行个位补0，相当于向左移一位。','把162和270按位相加：个位2；十位6+7=13，写3并向百位进1。','百位1+2+进位1=4，得到432。','所以27×16=27×6+27×10=162+270=432；每一行都来自分配律和十进制位值。']},
  {name:'格子乘法：沿斜线按位相加',steps:['把27的2、7写在上边，把16的1、6写在右边；每个格内画一条斜线，分开十位与个位。','四格相乘：2×1=02，7×1=07，2×6=12，7×6=42；不足两位时补0。','从右下方的个位斜带开始，只有42的个位2，所以结果个位是2。','十位斜带相加：4+2+7=13，十位写3，向百位斜带进1。','百位斜带：1+2+0+进位1=4；最左的千位为0，不写在结果前面。','沿左下边读出432。斜带汇集同一十进制位权，算法和竖式有相同依据。']}
 ]};
 V.register('multiplication',(r,n)=>{
  let s='',tex='';
  if(r===0){
   for(let row=0;row<3;row++)for(let col=0;col<4;col++)s+=dot(205+col*55,75+row*60,n>=3?(col===Math.min(3,n-3)?orange:blue):(n>=1&&row===Math.min(2,n-1)?orange:blue));
   if(n>=1&&n<3)s+=rect(180,50+Math.min(2,n-1)*60,215,50,'none',orange);
   if(n>=3)s+=rect(180+Math.min(3,n-3)*55,45,50,185,'none',orange);
   s+=T(300,280,n<3?'3行，每行4个':'4列，每列3个');tex=['3\\times4','4+4+4','4+4+4=12','3+3+3+3=12','3\\times4=4\\times3=12'][n];
  }else if(r===1){
   const x=160,y=65,w=270,h=160;s=rect(x,y,w,h);s+=T(295,45,'20 + 7 = 27')+T(115,155,'10 + 6');
   if(n>=1)s+=path('M360 65V225 M160 165H430',orange);
   if(n>=2)s+=rect(x,y,200,100,'#b7d8e7')+rect(x+200,y,70,100,'#eac5a6')+T(260,125,'200')+T(395,125,'70');
   if(n>=3)s+=rect(x,y+100,200,60,'#c3e0cf')+rect(x+200,y+100,70,60,'#f1d9a4')+T(260,205,'120')+T(395,205,'42');
   if(n>=4)s+=T(300,285,'200 + 70 + 120 + 42 = 432');
   tex=['27\\times16','(20+7)(10+6)','20\\times10+7\\times10=270','20\\times6+7\\times6=162','270+162=432','(20+7)(10+6)=200+70+120+42=432'][n];
  }else if(r===2){
   const model=productModel(27,16),xs=[235,295,355];
   s+=T(235,26,'百位')+T(295,26,'十位')+T(355,26,'个位');
   if(n===1)s+=rect(332,43,45,200,'#f8ecd9',orange);
   if(n===2||n===4)s+=rect(272,43,45,200,'#f8ecd9',orange);
   s+=T(xs[1],75,'2',30)+T(xs[2],75,'7',30)+T(175,118,'×',30)+T(xs[1],118,'1',30)+T(xs[2],118,'6',30)+path('M170 132H395');
   if(n===1)s+=T(xs[1],49,'进4',15,orange)+T(xs[2],173,'2',30,orange);
   if(n>=2)s+=T(xs[0],173,'1',30)+T(xs[1],173,'6',30)+T(xs[2],173,'2',30);
   if(n>=3)s+=T(xs[0],217,'2',30)+T(xs[1],217,'7',30)+T(xs[2],217,'0',30,orange);
   if(n>=4)s+=path('M170 232H395')+T(xs[0],249,'进1',15,orange)+T(xs[1],280,'3',30)+T(xs[2],280,'2',30);
   if(n>=5)s+=T(xs[0],280,'4',30,orange);
   s+=T(300,330,n<3?'先乘个位6':'第二行的1表示10，不是1',17);
   tex=['27\\times16=27\\times(6+10)','6\\times7=42=4\\times10+2','6\\times27=162','10\\times27=270','6+7=13=10+3','1+2+1=4','27\\times16='+model.partial.join('+')+'=432'][n];
  }else{
   const model=productModel(27,16),x=155,y=55,w=120,h=100;
   s+=T(215,34,'2',28)+T(335,34,'7',28)+T(435,112,'1',28)+T(435,212,'6',28)+rect(x,y,w*2,h*2,'#f3f8fa');
   if(n>=2){const band=n===2?'275,255 395,155 395,255':n===3?'155,255 395,55 395,155 275,255':'155,155 275,55 395,55 155,255';s+=`<polygon points="${band}" fill="#f2cfae"/>`;}
   for(const c of model.cells){const X=x+c.col*w,Y=y+c.row*h;const active=n===2?0:n===3?1:n>=4?2:-1;
    s+=rect(X,Y,w,h,'none')+path(`M${X} ${Y+h}L${X+w} ${Y}`);
    if(n>=1){s+=T(X+30,Y+33,c.tens,27,c.weight+1===active?orange:ink)+T(X+90,Y+82,c.units,27,c.weight===active?orange:ink);}
   }
   if(n>=2)s+=T(365,285,'2',28,orange);
   if(n>=3)s+=T(245,285,'3',28,orange)+T(294,310,'进1到百位',16,orange);
   if(n>=4)s+=T(130,218,'4',28,orange)+T(300,337,'百位4 · 十位3 · 个位2',18);
   tex=['27\\times16','(2\\times1,7\\times1,2\\times6,7\\times6)=(2,7,12,42)','\\text{个位}:2','\\text{十位}:4+2+7=13','\\text{百位}:1+2+0+1=4','27\\times16=432'][n];
  }
  return result('multiplication',r,n,s,tex);
 });
 P.commutative={title:'为什么交换因数，结果不变？',conditions:'讨论有限个对象的非负整数乘法；零行或零列都表示0个点。',routes:[
  {name:'按行数与按列数',steps:['摆3行、每行4个点，按行计数是3×4。','圈出一行，依次累加4+4+4=12。','改为按4列计数，每列3个。','4列合计3+3+3+3=12。','同一批点没有增减，所以3×4=4×3；一般a行b列也同理。']},
  {name:'行列坐标一一对应',steps:['给原点阵每个点编号(i,j)，i是行、j是列。','把编号(i,j)换成(j,i)，得到转置点阵。','例如第2行第3列，对应新点阵第3行第2列。','反过来再交换一次，唯一回到原点，因此没有重复也没有遗漏。','有限集合一一对应，数量相等，所以a×b=b×a。']}
 ]};
 V.register('commutative',(r,n)=>{let s='';if(r===0){for(let i=0;i<3;i++)for(let j=0;j<4;j++)s+=dot(200+j*55,70+i*65,n<2?i===Math.min(n,2)?orange:blue:j===Math.min(n-2,3)?orange:blue);s+=T(300,300,n<2?'按3行数，每行4个':'按4列数，每列3个');}else{for(let i=0;i<3;i++)for(let j=0;j<4;j++){s+=dot(65+j*40,85+i*48,i===1&&j===2?orange:blue);if(n>=1)s+=dot(360+i*48,60+j*48,i===1&&j===2?orange:blue);}if(n>=2)s+=path('M155 133C240 115 250 230 403 156',orange);s+=T(140,300,'(i,j)')+T(415,300,'(j,i)')+T(300,330,n>=3?'交换两次，唯一回到原点':'交换行列编号');}return result('commutative',r,n,s,r===0?['3\\times4','4+4+4=12','4\\times3','3+3+3+3=12','a b=b a'][n]:['(i,j)','(i,j)\\mapsto(j,i)','(2,3)\\mapsto(3,2)','(j,i)\\mapsto(i,j)','a b=b a'][n]);});
 const equivalent={title:'为什么分子分母同乘一个数，值不变？',conditions:'分母b≠0，代数倍数k≠0；等分图采用同一个整体，b、k为正整数且0≤a≤b。',routes:[
  {name:'把每份继续切小',steps:['同一个整体平均分成2份，取1份，表示1/2。','每一份再平均分成3份，整体变成6份。','原来取到的那一半现在正好占3份，没有增减。','所以1/2=3/6，改变的是每一份的大小和份数。','一般每份再分k份：整体bk份，所取ak份，所以a/b=ak/(bk)。']},
  {name:'用除法的定义',steps:['设x=a/b，即bx=a，分母b必须非零。','等式两边同乘非零k，得到kbx=ka。','写成(bk)x=ak；只是重新组合乘积。','由于bk≠0，两边除以bk，得到x=ak/(bk)。','同一个x等于两个分数，所以a/b=ak/(bk)，非零倍数不会改变商。']}
 ]};
 P.equivalent=equivalent;P.fractions=equivalent;
 for(const id of ['equivalent','fractions'])V.register(id,(r,n)=>{
  let s='',tex='';if(r===0){s+=bars(145,70,310,2,1)+T(300,52,'同一个整体：1/2');s+=bars(145,180,310,n>=1?6:2,n>=1?3:1,n>=2?orange:blue)+T(300,265,n>=1?'6份中的3份，仍是原来的一半':'还没有继续切小');if(n>=1)s+=path('M248.333 180V220 M351.667 180V220',orange);tex=['\\frac12','\\frac{1\\times3}{2\\times3}','\\frac36','\\frac12=\\frac36','\\frac ab=\\frac{ak}{bk}'][n];}
  else{const rows=['bx = a','k · bx = k · a','(bk)x = ak','x = ak ÷ (bk)','a/b = ak/(bk)'];s=equationRows(rows,n);tex=['x=\\frac ab\\iff bx=a','kbx=ka','(bk)x=ak','x=\\frac{ak}{bk}','\\frac ab=\\frac{ak}{bk}'][n];}return result(id,r,n,s,tex);
 });
 P['fraction-ops']={title:'分数四则运算为什么这样计算？',conditions:'分母不为0，除数不为0；等分图采用同一个整体。非负分数的网格是直观模型，有理数的一般规则由等式运算扩展。',routes:[
  {name:'同分母加减：同样大小的份额',steps:['把同样大的整体平均分成4份，每一份都是1/4。','第一份量取1格，第二份量取2格；每格单位相同。','合计1+2=3格，所以1/4+2/4=3/4。','减法就是取走相同大小的份额：5/6−2/6剩3/6。','一般有a/d±b/d=(a±b)/d；分母是单位份额的名称，不跟着加减。']},
  {name:'通分：把份额改成相同大小',steps:['比较同一个整体的1/2与1/3；每份大小不同，不能直接数份额相加。','把二分之一细分成3份：1/2=3/6。','把三分之一细分成2份：1/3=2/6。','现在以六分之一为同一单位，把3格和2格合在一起，共5格。','所以1/2+1/3=5/6；减法也先统一单位，然后数剩余份额。','一般a/b+c/d=(ad+bc)/(bd)，b、d均非零；不是(a+c)/(b+d)。']},
  {name:'分数乘法：一部分的一部分',steps:['先取同一个整体的上半部分，表示1/2。','再取这半份的三分之一。把整体画成2行3列，共6格。','上半部分与左边三分之一交叉处只有1格，所以1/2×1/3=1/6。','对0≤a≤b、0≤c≤d，把整体分成b行d列，共bd格。','取a行后，再取其中c列，共ac格，因此a/b×c/d=ac/(bd)。','超出单位整体或负分数时，图只作入门解释；乘法的一般规则继续由分配律和符号规则扩展。']},
  {name:'分数除法：求乘回去的数',steps:['1/2÷1/3是在问：多少个三分之一合起来是一半？先把单位都改成六分之一。','一半是3个六分之一，三分之一是2个六分之一，所以商为3÷2=3/2。','一般令z=(a/b)÷(c/d)，它按定义满足z·c/d=a/b。','因为c、d非零，等式两边同乘倒数d/c。','左边z·(c/d)·(d/c)=z，右边(a/b)·(d/c)=ad/(bc)。','所以a/b÷c/d=ad/(bc)；除数是0时没有倒数，不能这样做。']}
 ]};
 V.register('fraction-ops',(r,n)=>{let s='',tex='';
  if(r===0){
   if(n<3){s+=bars(125,65,350,4,1)+T(300,48,'第一份量：1/4')+bars(125,155,350,4,n===0?0:2,orange)+T(300,140,'第二份量：2/4');if(n>=2)s+=bars(125,255,350,4,3)+T(300,323,'合计3格，每格仍是1/4');}
   else{s+=bars(125,85,350,6,5)+T(300,65,'原来5/6');for(let i=3;i<5;i++)s+=path(`M${125+i*350/6+5} 90l48 30m0-30l-48 30`,orange);s+=bars(125,215,350,6,3)+T(300,285,'拿走2格，剩3格');}
   tex=['\\frac14','\\frac14+\\frac24','\\frac14+\\frac24=\\frac34','\\frac56-\\frac26=\\frac36','\\frac ad\\pm\\frac bd=\\frac{a\\pm b}{d}'][n];
  }else if(r===1){s+=bars(125,60,350,n>=1?6:2,n>=1?3:1)+T(300,43,n>=1?'1/2 = 3/6':'1/2');s+=bars(125,150,350,n>=2?6:3,n>=2?2:1,orange)+T(300,133,n>=2?'1/3 = 2/6':'1/3');if(n>=3){for(let i=0;i<6;i++)s+=rect(125+i*350/6,255,350/6,40,i<3?blue:i<5?orange:'#fff');s+=T(300,332,'3格 + 2格 = 5格，每格1/6');}tex=['\\frac12+\\frac13','\\frac12=\\frac36','\\frac13=\\frac26','\\frac36+\\frac26','\\frac12+\\frac13=\\frac56','\\frac ab+\\frac cd=\\frac{ad+bc}{bd}'][n];}
  else if(r===2){const X=180,Y=70,W=240,H=180;
   if(n<3){s=rect(X,Y,W,H,'#fff');s+=rect(X,Y,W,H/2,'#a9d0e3');if(n>=1){s+=rect(X,Y,W/3,H,'#edc19f');for(let row=0;row<2;row++)for(let col=0;col<3;col++)s+=rect(X+col*W/3,Y+row*H/2,W/3,H/2,'none');}if(n>=2)s+=rect(X,Y,W/3,H/2,orange);s+=T(300,305,n===0?'先取上半部分':'再取上半部分的三分之一');}
   else {for(let row=0;row<3;row++)for(let col=0;col<4;col++)s+=rect(180+col*60,65+row*60,60,60,row<2&&col<3?orange:row<2?'#bcd9e7':'#fff');s+=T(300,290,'示例：2/3 × 3/4 = 6/12')+T(300,323,'一般：b行d列，交叉a行c列');}
   tex=['\\frac12','\\frac12\\times\\frac13','\\frac12\\times\\frac13=\\frac16','b\\times d=bd','\\frac ab\\times\\frac cd=\\frac{ac}{bd}','\\frac ab\\cdot\\frac cd=\\frac{ac}{bd}'][n];
  }else{if(n<2){s+=bars(125,75,350,6,3)+T(300,52,'被除数：3个六分之一');s+=bars(125,180,350,6,2,orange)+T(300,157,'除数：2个六分之一');if(n>=1)s+=path('M125 255H241.667 M241.667 250V260 M241.667 255H300',orange)+T(300,310,'3份 ÷ 每组2份 = 1组半');}else{s=equationRows(['z · (c/d) = a/b','两边同乘 d/c','z · (c/d) · (d/c) = (a/b) · (d/c)','z = ad/(bc)'],n-2);}
   tex=['\\frac12\\div\\frac13=\\frac36\\div\\frac26','3\\div2=\\frac32','z\\frac cd=\\frac ab','z\\frac cd\\frac dc=\\frac ab\\frac dc','z=\\frac{ad}{bc}','\\frac ab\\div\\frac cd=\\frac{ad}{bc}\\quad(c\\ne0)'][n];}
  return result('fraction-ops',r,n,s,tex);
 });
 P.identities={title:'完全平方公式与平方差为什么成立？',conditions:'代数恒等式适用于实数a、b；面积图采用正长度，平方差剪拼图要求a>b>0。',routes:[
  {name:'面积分割：四块面积',steps:['画边长a+b的正方形；示例a=3、b=2，两轴长度使用同一比例。','把横边分成a、b两段，再沿分界线竖切。','把竖边也分成a、b两段，得到四块没有重叠的长方形。','四块面积分别是a²、ab、ab、b²。','原正方形面积等于四块之和，所以(a+b)²=a²+2ab+b²。']},
  {name:'分配律：逐项相乘',steps:['平方表示两个相同式子相乘：(a+b)²=(a+b)(a+b)。','用外层分配律展开为a(a+b)+b(a+b)。','分别展开两个括号，得到a²+ab+ba+b²。','由实数乘法交换律ab=ba，中间两项可以合并。','所以(a+b)²=a²+2ab+b²；把b替换成−b也得到完全平方差公式。']},
  {name:'平方差：剪拼与因式分解',steps:['对a>b>0，从边长a的正方形右上角去掉边长b的小正方形，剩余面积a²−b²。','把剩余L形沿小正方形左边向下延长的线切开，得到a×(a−b)和b×(a−b)两块。','先把宽a−b、高a的一块旋转90°，变成宽a、高a−b；再把另一块平移到旁边，两块首尾相接。','拼成宽a+b、高a−b的长方形，所以a²−b²=(a+b)(a−b)。','对任意实数，代数展开(a+b)(a−b)=a²−ab+ab−b²也得到同一恒等式。','把展开方向反过来读，就是平方差因式分解；它把加减形式写成乘积。']}
 ]};
 V.register('identities',(r,n)=>{let s='',tex='';if(r===0){const x=200,y=60,A=120,B=80;s=rect(x,y,A+B,A+B);s+=T(300,42,'a + b')+T(165,160,'a + b');if(n>=1)s+=path('M320 60V260',orange);if(n>=2)s+=path('M200 180H400',orange);if(n>=3)s=rect(x,y,A,A,'#bad7e8')+rect(x+A,y,B,A,'#e7bd9e')+rect(x,y+A,A,B,'#e7bd9e')+rect(x+A,y+A,B,B,'#c0deca')+T(260,125,'a²')+T(360,125,'ab')+T(260,230,'ab')+T(360,230,'b²');tex=['(a+b)^2','(a+b)(a+b)','a^2+ab+ab+b^2','a^2+2ab+b^2','(a+b)^2=a^2+2ab+b^2'][n];}
  else if(r===1){const labels=[['(a+b)','(a+b)'],['a(a+b)','b(a+b)'],['a²','ab','ba','b²'],['a²','2ab','b²'],['(a−b)²','a²−2ab+b²']][Math.min(n,4)];labels.forEach((label,i)=>s+=card(300-labels.length*61+i*122,125,112,65,label,true));if(n>=1)s+=path('M185 65L225 115 M415 65L375 115',orange);s+=T(300,260,n===3?'ab与ba是同类项':'每一个项都要乘到');tex=['(a+b)^2=(a+b)(a+b)','a(a+b)+b(a+b)','a^2+ab+ba+b^2','ab+ba=2ab','(a\\pm b)^2=a^2\\pm2ab+b^2'][n];}
  else{if(n<2){s=rect(190,65,200,200);s+=rect(310,65,80,80,'#fff',orange)+T(350,108,'去掉 b²',16);if(n>=1)s+=path('M310 145V265',orange)+T(250,175,'a(a−b)',17)+T(350,220,'b(a−b)',16);}else{s+='<g>'+rect(155,120,200,120,'#bad7e8')+(n===2?'<animateTransform attributeName="transform" type="rotate" from="-90 255 180" to="0 255 180" dur=".6s" fill="freeze"/>':'')+'</g>'+rect(355,120,80,120,'#edc19f')+T(255,185,'a(a−b)',18)+T(395,185,'b(a−b)',16)+T(300,98,'a + b')+T(100,185,'a − b',17);}
   tex=['a^2-b^2','a(a-b)+b(a-b)','a(a-b)+b(a-b)=(a+b)(a-b)','a^2-b^2=(a+b)(a-b)','(a+b)(a-b)=a^2-ab+ab-b^2','a^2-b^2=(a-b)(a+b)'][n];}
  return result('identities',r,n,s,tex);
 });
 P['arithmetic-sequence']={title:'等差数列前n项和',conditions:'n为正整数，首项a₁、公差d均为实数；通项aₖ=a₁+(k−1)d。配对证明不要求n为偶数。',routes:[
  {name:'正反两排配对',steps:['先把Sₙ=a₁+a₂+…+aₙ按顺序写成一排，示例是1+2+3+4+5。','再把同一和式倒着写一排：aₙ+…+a₂+a₁，两排相加得到2Sₙ。','每列相加都是a₁+aₙ，因为等差数列首尾到中间的增减相互抵消。','共有n列，所以2Sₙ=n(a₁+aₙ)；n为奇数时也成立，中间项在两排中各出现一次。','两边除以2，Sₙ=n(a₁+aₙ)/2；示例为5×6/2=15。']},
  {name:'通项拆分并求和',steps:['通项为aₖ=a₁+(k−1)d；示例首项2、公差3、共5项。','把n项分别拆成n份a₁，以及0d、1d、…、(n−1)d。','于是Sₙ=na₁+d[0+1+…+(n−1)]。','正反两排配对可得0+1+…+(n−1)=n(n−1)/2。','代入得到Sₙ=na₁+n(n−1)d/2。','由于aₙ=a₁+(n−1)d，也就等于n(a₁+aₙ)/2，两种写法表示同一个和。']}
 ]};
 V.register('arithmetic-sequence',(r,n)=>{let s='',tex='';if(r===0){for(let i=0;i<5;i++){const x=125+i*72;s+=rect(x,160-(i+1)*20,48,(i+1)*20,'#aacddd');s+=T(x+24,185,i+1);if(n>=1)s+=rect(x,160-(i+1)*20-(5-i)*20,48,(5-i)*20,'#eac5a6')+T(x+24,33,5-i);if(n>=2)s+=path(`M${x} 40H${x+48}`,orange);}s+=T(300,230,n<1?'S₅ = 1+2+3+4+5':'两排叠在同一列，每列总高6');if(n>=3)s+=T(300,280,'2S₅ = 5 × 6 = 30');tex=['S_n=a_1+\\cdots+a_n','2S_n=(a_1+a_n)+\\cdots+(a_n+a_1)','a_k+a_{n+1-k}=a_1+a_n','2S_n=n(a_1+a_n)','S_n=\\frac{n(a_1+a_n)}2'][n];}
  else{for(let i=0;i<5;i++){const x=110+i*80;s+=rect(x,230,55,20,blue);if(n>=1&&i)s+=rect(x,230-i*30,55,i*30,orange);s+=T(x+28,282,2+i*3);if(n>=2)s+=T(x+28,318,i+'d',16);}s+=T(300,40,n===0?'2, 5, 8, 11, 14':'蓝色：每项a₁；橙色：逐项增加的d');tex=['a_k=a_1+(k-1)d','\\sum_{k=1}^n[a_1+(k-1)d]','S_n=na_1+d\\sum_{j=0}^{n-1}j','\\sum_{j=0}^{n-1}j=\\frac{n(n-1)}2','S_n=na_1+\\frac{n(n-1)d}2','S_n=\\frac{n(a_1+a_n)}2'][n];}return result('arithmetic-sequence',r,n,s,tex);});
 const geometric={title:'等比数列前n项和',conditions:'n为正整数，首项a、公比r为实数；r=1时Sₙ=na，除以1−r的公式仅用于r≠1。无限和另要求|r|<1。',routes:[
  {name:'错位相减',steps:['先写Sₙ=a+ar+…+arⁿ⁻¹，示例为1+2+4+8。','两边乘r：rSₙ=ar+ar²+…+arⁿ；把同次幂上下对齐。','相减时，中间的ar到arⁿ⁻¹逐项抵消，只留下首尾。','于是(1−r)Sₙ=a−arⁿ=a(1−rⁿ)。','r≠1时除以1−r，得到Sₙ=a(1−rⁿ)/(1−r)。','r=1时不能除以0，直接把n个a相加得Sₙ=na；无限和不能仅靠有限项公式宣布收敛。']},
  {name:'数学归纳法',steps:['先处理r≠1。n=1时，a(1−r)/(1−r)=a，公式成立。','假设n=k时，Sₖ=a(1−rᵏ)/(1−r)。','第k+1项为arᵏ，故Sₖ₊₁=Sₖ+arᵏ。','把新项通分，分子为a(1−rᵏ)+arᵏ(1−r)。','展开后−arᵏ与+arᵏ抵消，留下a(1−rᵏ⁺¹)，归纳步骤成立。','因此公式对所有正整数n成立；r=1另算Sₙ=na。']}
 ]};
 P['geometric-sequence']=geometric;
 for(const id of ['geometric-sequence'])V.register(id,(r,n)=>{let s='',tex='';
  if(r===0){const vals=[1,2,4,8,16];for(let i=0;i<5;i++){const x=80+i*95;if(i<4){s+=card(x,70,75,44,String(vals[i]),n===0);if(n>=2&&i>0)s+=path(`M${x+8} 80l59 24`,orange);}if(n>=1&&i>0){s+=card(x,170,75,44,String(vals[i]),n===1);if(n>=2&&i<4)s+=path(`M${x+8} 180l59 24`,orange);}}s+=T(45,100,'S',20)+T(45,200,'2S',20);if(n>=3)s+=T(300,280,'2S − S = 16 − 1 = 15');if(n===5)s+=T(300,325,'r=1：a+a+…+a = na');tex=['S_n=a+ar+\\cdots+ar^{n-1}','rS_n=ar+ar^2+\\cdots+ar^n','S_n-rS_n=a-ar^n','(1-r)S_n=a(1-r^n)','S_n=\\frac{a(1-r^n)}{1-r}','r=1\\Longrightarrow S_n=na'][n];}
  else {s+=card(60,60,120,70,'n=1',n===0)+path('M185 95H230')+card(235,60,120,70,'n=k',n===1)+path('M360 95H405')+card(410,60,130,70,'n=k+1',n>=2);s+=rect(100,195,210,55,blue)+T(205,230,'原来的和 Sₖ',19,'#fff');if(n>=2)s+=rect(310,195,130,55,orange)+T(375,230,'新项 arᵏ',18,'#fff');if(n>=4)s+=T(300,300,'同分母合并，完成 k → k+1');if(n===5)s+=T(300,334,'r=1 时直接数n个a');tex=['S_1=a=\\frac{a(1-r)}{1-r}','S_k=\\frac{a(1-r^k)}{1-r}','S_{k+1}=\\frac{a(1-r^k)}{1-r}+ar^k','S_{k+1}=\\frac{a(1-r^k)+ar^k(1-r)}{1-r}','S_{k+1}=\\frac{a(1-r^{k+1})}{1-r}','r=1\\Longrightarrow S_n=na'][n];}
  return result(id,r,n,s,tex);
 });

 P.addition={title:'加法：合并与凑十为什么一致？',conditions:'这里先定义非负整数加法，用有限且不相交的两批对象计数；不把负数解释成负颗豆。数轴是同一个运算的等价模型。',routes:[
  {name:'合并不相交的两批（定义与计数）',steps:['第一批有7颗豆，第二批有5颗；两批对象互不重复。','把两批合在一起，每颗豆只数一次，不漏数也不重复数。','先数第一批的7颗，再接着数第二批的5颗，最后数到12。','我们把这个合并后的数量定义为7+5，所以7+5=12。','一般a颗和b颗不重复的对象合并，得到a+b颗；分批还是合并数，不改变同一批对象的总量。']},
  {name:'数轴与凑十（等价模型）',steps:['在数轴上从7出发，加5表示连续向右走5个单位。','把5步拆成先走3步、再走2步；总步数仍然是5。','从7先走3步到10，再走2步到12。','因此7+5=(7+3)+2=12；凑十改变分组，不改变总路程。','一般把b拆成u+v，连续走u、v步等于走b步，所以a+(u+v)=(a+u)+v。']}
 ]};
 V.register('addition',(r,n)=>{let s='',tex='';if(r===0){for(let i=0;i<12;i++){const separated=n===0&&i>=7;const x=90+(i%6)*76,y=100+Math.floor(i/6)*80+(separated?30:0);s+=dot(x,y,i<7?blue:orange);if(n>=2)s+=T(x,y+32,i+1,17);}s+=T(300,290,n<2?'蓝色7颗，橙色5颗；没有重复的豆':'数到12，就是合并后的数量');tex=['7+5','|A\\cup B|\\quad(A\\cap B=\\varnothing)','7+5=12','a+b:=|A\\cup B|','|A\\cup B|=|A|+|B|\\quad(A\\cap B=\\varnothing)'][n];}
  else{const X=v=>60+v*36;s+=path('M50 190H550');for(let i=0;i<=13;i++)s+=path(`M${X(i)} 184V196`)+T(X(i),220,i,16);s+=dot(X(7),190);if(n===0)s+=path(`M${X(7)} 140H${X(12)}`,orange)+T((X(7)+X(12))/2,120,'+5');else{s+=path(`M${X(7)} 145H${X(10)} M${X(10)} 115H${X(12)}`,orange)+T((X(7)+X(10))/2,130,'+3')+T((X(10)+X(12))/2,100,'+2');if(n>=2)s+=dot(X(10),190,orange)+dot(X(12),190,orange);}s+=T(300,290,'先凑10，再走剩下的2步');tex=['7+5','5=3+2','7+3=10,\\quad10+2=12','7+(3+2)=(7+3)+2=12','a+(u+v)=(a+u)+v'][n];}return result('addition',r,n,s,tex);});
 P.subtraction={title:'减法：拿走与比较为什么得到同一个差？',conditions:'有限对象模型要求a、b为非负整数且a≥b；减法定义为加法的逆运算。a<b的整数减法另用数轴扩展，不画成负颗对象。',routes:[
  {name:'拿走一部分（加法逆运算）',steps:['原来有12颗豆，从中拿走5颗；拿走的豆必须确实在原来的12颗里面。','把原来的豆分为拿走的5颗和留下的7颗，两部分没有重叠。','重新合并时，5+7=12，因此留下的数量是12−5=7。','一般把a分为b与c两部分，就有b+c=a；把唯一的c记为a−b。','所以a−b=c当且仅当b+c=a；加回拿走的量，可以核验减法。']},
  {name:'一一配对比较（同一个差）',steps:['小青有12张卡，小明有7张卡；现在比较多少，不从小青手里拿走卡。','把小明的7张与小青的前7张一一配对，每对表示一样多的部分。','小青还有5张没有配对，说明小青比小明多5张。','把配对的7张和多出的5张合并，仍是小青的12张：7+5=12。','一般a与b配对后多出c个，就有a=b+c，所以比较的差也等于a−b。']}
 ]};
 V.register('subtraction',(r,n)=>{let s='',tex='';if(r===0){for(let i=0;i<12;i++){const x=85+(i%6)*80,y=100+Math.floor(i/6)*80,removed=i>=7;s+=dot(x,y,removed&&n>=1?'#b7c2c6':blue);if(removed&&n>=1)s+=path(`M${x-12} ${y-12}l24 24m0-24l-24 24`,orange);}s+=T(300,280,n<1?'12颗豆，准备拿走5颗':'拿走5颗（打叉），留下7颗');tex=['12-5','12=5+7','12-5=7','a=b+c\\Longrightarrow a-b=c','a-b=c\\iff b+c=a'][n];}
  else{for(let i=0;i<12;i++){const x=55+i*44;s+=dot(x,100,i>=7?orange:blue);if(i<7){s+=dot(x,205,blue);if(n>=1)s+=path(`M${x} 116V189`);}}if(n>=2)s+=rect(350,68,242,65,'none',orange);s+=T(300,285,n<2?'上面12张，下面7张；先一一配对':'前7对一样多，上面另有5张');tex=['12-7','7\\text{ 对一一配对}','12-7=5','7+5=12','a=b+c\\Longrightarrow a-b=c'][n];}return result('subtraction',r,n,s,tex);});
 P.division={title:'整数除法：分组、平均分与余数',conditions:'被除数n是非负整数，除数d是正整数；对象暂不切开。商q与余数r满足n=dq+r、0≤r<d；除数不能为0。',routes:[
  {name:'每组固定几个（包含除）',steps:['有14颗豆，每组固定放4颗；问题是能放满几组，还剩几颗。','先拿出4颗放成第一组，再取4颗成第二组，再取4颗成第三组。','剩下2颗，不够再放满一组4颗，所以完整组数是3，余数是2。','把所有豆数回去：14=4×3+2，并且0≤2<4。','一般不断取出d颗，最后不足d颗时停下，得到n=dq+r且0≤r<d。','余数若还能达到d，就可以再成一组，说明此前的商还不是最终整数商。']},
  {name:'固定分成几组（等分除）',steps:['有14颗豆，固定分给4组；一轮给每组1颗，保证各组一样多。','分完3轮，每组3颗，共分出4×3=12颗。','还剩2颗，不足以再给每组各1颗，所以暂不切开时，每组3颗，余2颗。','用乘法验算：4组×每组3颗+余2颗=14颗。','一般n=dq+r表示d组各q颗，外加r颗；0≤r<d。','若两个整数商都满足余数范围，相减会要求非零的d倍数绝对值小于d，这是不可能的，因此商和余数唯一。']}
 ]};
 V.register('division',(r,n)=>{let s='',tex='';if(r===0){for(let i=0;i<14;i++){const group=Math.floor(i/4),local=i%4,x=65+group*140+(local%2)*35,y=95+Math.floor(local/2)*55;s+=dot(x,y,group===3?'#8c9ba2':[blue,orange,'#39845a'][group]);}if(n>=1)for(let g=0;g<3;g++)s+=rect(43+g*140,72,80,102,'none',g===1?orange:blue);if(n>=2)s+=rect(465,72,80,102,'none','#8c9ba2');s+=T(300,250,n<2?'每组放4颗':'3组放满，另剩2颗')+T(300,290,n>=3?'14 = 4 × 3 + 2；余数2 < 4':'先数完整的组，再看余下几颗');tex=['14\\div4','14=4+4+4+2','q=3,\\quad r=2','14=4\\times3+2,\\quad0\\le2<4','n=dq+r,\\quad0\\le r<d','r\\ge d\\Longrightarrow q\\text{ 还可增加}'][n];}
  else{for(let group=0;group<4;group++){s+=rect(95+group*105,60,70,190,'none',blue)+T(130+group*105,42,'第'+(group+1)+'组',16);for(let row=0;row<(n===0?1:3);row++)s+=dot(130+group*105,100+row*55,[blue,orange,'#39845a'][row]);}if(n>=2)s+=dot(270,295,'#8c9ba2')+dot(320,295,'#8c9ba2')+T(300,335,'每组3颗，另剩2颗');tex=['14\\div4','4\\times3=12','14-12=2<4','4\\times3+2=14','n=dq+r,\\quad0\\le r<d','d(q_1-q_2)=r_2-r_1,\\quad|r_2-r_1|<d'][n];}return result('division',r,n,s,tex);});
 P.series={title:'等比级数什么时候收敛？',conditions:'本节证明实数等比级数Σₖ₌₀∞ arᵏ。|r|<1时收敛；a≠0且|r|≥1时发散，a=0时恒为0。另用调和级数说明“项趋于0”并不充分。',routes:[
  {name:'有限部分和取极限',steps:['无穷和不是把省略号当作数；先定义前n项部分和Sₙ=a+ar+…+arⁿ⁻¹。','先用有限项错位相减公式：r≠1时，Sₙ=a(1−rⁿ)/(1−r)。','若0<|r|<1，写1/|r|=1+t，其中t>0。','由二项式展开的其余项非负，(1+t)ⁿ≥1+nt，得到|r|ⁿ≤1/(1+nt)；右边趋于0，所以rⁿ趋于0。','代入部分和公式取极限，Sₙ趋于a/(1−r)，这才定义了无穷等比级数的和。','示例a=1/2、r=1/2：前n项和为1−2⁻ⁿ，趋于1；每个有限部分和仍小于1。','r=0时仅首项a非零，也得到和a；a=0时所有项为0，无论r取什么值都收敛。']},
  {name:'精确余项与收敛边界',steps:['在|r|<1时，候选极限取L=a/(1−r)；仅提出候选还不能证明收敛。','由有限部分和公式直接相减：L−Sₙ=arⁿ/(1−r)，这是精确余项。','因此误差|L−Sₙ|=|a||r|ⁿ/|1−r|；因|r|ⁿ趋于0，误差能任意小。','对任意ε>0，取N足够大，使|a||r|ᴺ/|1−r|<ε；以后所有n≥N都满足误差小于ε，符合极限定义。','若级数收敛，单项arⁿ=Sₙ₊₁−Sₙ必须趋于0；所以a≠0且|r|≥1时发散。','例如a≠0、r=1时部分和na无界；r=−1时部分和在a和0之间来回跳，不趋于一个值。','a=0是例外；“项趋于0”只是一项必要条件，不能据此断言任意级数收敛。']},
  {name:'调和级数：项趋零仍发散',steps:['考虑1+1/2+1/3+…；每一项1/n确实趋于0。','从第二项起按1项、2项、4项、8项分组：1/2；1/3+1/4；1/5+…+1/8；以此类推。','第j组从1/(2ʲ⁻¹+1)到1/2ʲ，共2ʲ⁻¹项，每项都不小于1/2ʲ。','所以每一组的和至少是2ʲ⁻¹/2ʲ=1/2。','取到第2ᵐ项，部分和至少为1+m/2；m增大时没有有限上界。','因此调和级数发散；项趋于0并不保证部分和趋于有限数。']}
 ]};
 V.register('series',(r,n)=>{let s='',tex='';if(r<2){const count=Math.min(6,n+1),x=100,y=100,w=400;let used=0;for(let j=1;j<=count;j++){const part=1/2**j;s+=rect(x+used*w,y,part*w,70,j%2?blue:orange);if(j<=3)s+=T(x+(used+part/2)*w,y+42,'1/'+2**j,18,'#fff');used+=part;}s+=rect(x+used*w,y,(1-used)*w,70,'#edf5f7',orange)+T(300,215,'示例：1/2 + 1/4 + 1/8 + …')+T(300,255,'蓝橙：有限部分和；空白：还差多少');if(r===1){s+=path(`M${x+used*w} 280H500`,orange)+T(300,315,'误差 = 2⁻ⁿ，逐渐趋于0');}else s+=T(300,315,'只有取极限后，无穷和才等于1');
   if(r===0&&n===6)s=card(70,85,160,70,'r=0：首项a',true)+card(255,85,95,70,'0')+card(375,85,95,70,'0')+T(300,240,'r=0：只有首项；a=0：每一项都为0');
   if(r===1&&n===4)s=card(75,75,170,75,'Sₙ',true)+card(355,75,170,75,'Sₙ₊₁',true)+path('M250 112H350',orange)+T(300,215,'两者若都趋于同一个L，差必趋于0')+T(300,280,'|r|≥1 且 a≠0：|arⁿ|≥|a|，不趋于0');
   if(r===1&&n===5){s=T(160,40,'r=1：Sₙ=n（a=1）')+T(445,40,'r=−1：1,0,1,0,…');for(let k=0;k<5;k++){s+=rect(65+k*40,270-(k+1)*34,25,(k+1)*34,blue)+dot(350+k*40,k%2?270:100,orange);}s+=path('M330 100H540 M330 270H540')+T(300,325,'一边无界，一边来回跳；都没有有限极限');}
   if(r===1&&n===6)s=path('M80 160H520')+T(300,125,'a=0：部分和始终是0')+T(300,230,'项趋于0只是必要条件')+T(300,280,'下一条路线：调和级数给出反例');
   if(r===0)tex=['S_n=\\sum_{k=0}^{n-1}ar^k','S_n=\\frac{a(1-r^n)}{1-r}','\\frac1{|r|}=1+t,\\quad t>0','|r|^n\\le\\frac1{1+nt}\\longrightarrow0','\\sum_{k=0}^{\\infty}ar^k=\\frac a{1-r}\\quad(|r|<1)','S_n=1-2^{-n}\\longrightarrow1','r=0\\Longrightarrow S=a,\\quad a=0\\Longrightarrow S=0'][n];
   else tex=['L=\\frac a{1-r}','L-S_n=\\frac{ar^n}{1-r}','|L-S_n|=\\frac{|a||r|^n}{|1-r|}\\longrightarrow0','n\\ge N\\Longrightarrow|L-S_n|<\\varepsilon','ar^n=S_{n+1}-S_n\\longrightarrow0','r=1:S_n=na;\\quad r=-1:S_n\\in\\{a,0\\}','a=0\\Longrightarrow S_n=0'][n];
  }else{const groups=Math.min(4,n+1);s+=card(50,200,65,60,'1',true);for(let j=1;j<=groups;j++){const x=130+(j-1)*105;s+=rect(x,200,88,60,'#e7bd9e',orange)+T(x+44,235,'≥1/2',18)+T(x+44,175,2**(j-1)+'项',16);if(n>=2)for(let k=0;k<2**(j-1);k++)s+=rect(x+k*88/2**(j-1),80,88/2**(j-1),50,light);}s+=T(300,302,n>=4?'取到2ᵐ项：至少1 + m/2，没有有限上界':'每组项数加倍，每组总量至少1/2');tex=['\\frac1n\\longrightarrow0','1+\\frac12+\\left(\\frac13+\\frac14\\right)+\\cdots','\\sum_{k=2^{j-1}+1}^{2^j}\\frac1k\\ge\\frac{2^{j-1}}{2^j}','\\text{每组和}\\ge\\frac12','S_{2^m}\\ge1+\\frac m2\\longrightarrow\\infty','\\sum_{n=1}^{\\infty}\\frac1n\\text{ 发散}'][n];}return result('series',r,n,s,tex);});

}
install.productModel=productModel;
if(typeof module!=='undefined')module.exports=install;else install(root.MathProofs,root.MathProofVisuals);
})(globalThis);
