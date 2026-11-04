/* Exact geometry for each route; finite pictures illustrate, equations carry the proof. */
(function(root){'use strict';
function install(P,V){
 const blue='#267c99',orange='#c67b43',green='#36806c',ink='#204b5a',pale='#d6eaf0',warm='#f0d1b2';
 const txt=V.text,poly=(points,fill=pale,stroke=blue)=>`<polygon points="${points}" fill="${/^#[0-9a-f]{8}$/i.test(fill)?fill.slice(0,7):fill}"${/^#[0-9a-f]{8}$/i.test(fill)?` fill-opacity="${parseInt(fill.slice(7),16)/255}"`:''} stroke="${stroke}" stroke-width="2.5"/>`,
 line=(x,y,X,Y,c=blue,dash='')=>`<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${c}" stroke-width="2.5"${dash?` stroke-dasharray="${dash}"`:''}/>`,
 rect=(x,y,w,h,fill=pale,stroke=blue)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
 dot=(x,y,c=orange)=>`<circle cx="${x}" cy="${y}" r="5" fill="${c}"/>`,
 circle=(x,y,r,fill='none')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${blue}" stroke-width="2.5"/>`,
 right=(x,y,dx=1,dy=-1)=>`<path d="M${x+dx*12} ${y}v${dy*12}h${-dx*12}" fill="none" stroke="${ink}" stroke-width="1.8"/>`;
 function entry(id,title,conditions,routes,draw){
  P[id]={title,conditions,routes:routes.map(r=>({name:r.name,steps:r.steps}))};
  V.register(id,(route,step)=>{const r=routes[route],n=Math.max(0,Math.min(step,r.steps.length-1));return {svg:V.svg(draw(route,n),r.name+'：'+r.steps[n]),formula:r.formulas[n],note:r.steps[n]};});
 }
 const r=(name,steps,formulas)=>({name,steps,formulas});
 entry('area','长方形与梯形面积：从计数到剪拼',
 '边长为正，面积可加且全等图形等面积；整数边长先计数，正实数边长用越来越细的单位网格逼近。拆分路线说明公式相容性，依赖长方形面积基础。',[
 r('单位正方形逐行计数（长方形）',[
 '先铺一排：长为5个单位，每块单位正方形面积为1。','宽为3个单位，可以整齐铺3排；各排没有空隙和重叠。','每排5块，共3排，单位正方形共有5×3=15块。','对整数长a、宽b，同样有b排，每排a块，所以面积为ab。','有理边长换更小的单位正方形；实数边长以内外细网格逼近，得到S=ab。'
 ],['5\\times1=5','5+5+5=15','S=5\\times3=15','S=ab','S=ab']),
 r('切割与面积可加（长方形）',[
 '取长为a+c、宽为b的长方形；本路线已知长方形面积公式。','沿长度为a的位置作一条与宽边平行的切线。','左块长a、宽b，面积ab；右块长c、宽b，面积cb。','两块互不重叠，完整盖住原长方形，面积可以相加。','所以(a+c)b=ab+cb；这解释分配律与面积拆分一致，不是另一套独立的计数基础。'
 ],['S=(a+c)b','(a+c)b','S_1=ab,\\quad S_2=cb','S=S_1+S_2','(a+c)b=ab+cb']),
 r('复制旋转（梯形）',[
 '取上底a、下底b、高h的梯形；a、b是两条平行边的长度。','复制一个全等梯形，标出要拼接的同一条腰。','把复制品旋转180°，沿这条腰拼上；两个内部不重叠。','外边界成为平行四边形，底长a+b，高仍为h。','总面积为(a+b)h，恰好是原梯形面积的2倍。','所以一个梯形的面积S=(a+b)h/2；高是两底之间的垂直距离。'
 ],['a>0,\\ b>0,\\ h>0','S_1=S_2','2S=S_1+S_2','S_{\\text{拼成}}=(a+b)h','2S=(a+b)h','S=\\frac{(a+b)h}{2}'])
 ],(route,n)=>{
  if(route===0){let s='';for(let row=0;row<(n?3:1);row++)for(let col=0;col<5;col++)s+=rect(115+col*62,65+row*62,62,62,row===Math.min(n,2)?warm:pale);return s+txt(270,290,n?'3排，每排5个单位正方形':'先数第一排')+txt(270,325,'面积单位：平方单位');}
  if(route===1)return rect(105,70,360,180)+ (n>=1?line(315,70,315,250,orange,'6 5'):'')+(n>=2?rect(315,70,150,180,warm):'')+txt(210,280,'a')+txt(390,280,'c')+txt(77,165,'b')+(n>=2?txt(210,165,'ab')+txt(390,165,'cb'):'');
  let s=poly('80,80 200,80 280,230 40,230')+txt(140,65,'a')+txt(155,260,'b')+line(50,80,50,230,green,'4 4')+txt(25,160,'h');
  if(n===1)s+=`<g transform="translate(315 45) scale(.55)">${poly('80,80 200,80 280,230 40,230',warm,orange)}</g>`+txt(420,235,'全等副本');
  if(n>=2){const body=poly('400,230 280,230 200,80 440,80',warm,orange);s+=(n===2?'<g>'+body+'<animateTransform attributeName="transform" type="translate" from="45 -20" to="0 0" dur=".8s" fill="freeze"/></g>':body);}
  if(n>=3)s+=line(80,40,440,40,green)+txt(260,30,'a+b')+txt(350,285,'两块沿腰拼接，无重叠');return s;
 });
 entry('triangle-area','平行四边形与三角形面积怎样转化？',
 '欧氏平面；b为所选底边，h为对应垂直高度。剪拼示图先取斜边水平偏移小于底长的情形；过度倾斜时可先分成窄条逐条平移，或多次剪拼。',[
 r('沿高剪下，平移补齐（平行四边形）',[
 '取底长b、高h的平行四边形；先看水平偏移小于底长的示图。','沿左上顶点向底边作垂线，把左端分出一个直角三角形。','剪下左侧三角形；其余部分保持原位，没有改变任何一块的面积。','把三角形水平平移一个底长b，恰好填满右侧缺口，拼成长方形。','长方形的长为b、宽为h，所以原面积S=bh；过度倾斜的图形分条重复同样转化。'
 ],['b>0,\\ h>0','h\\perp b','S=S_{\\text{余块}}+S_{\\triangle}','S=S_{\\text{长方形}}','S=bh']),
 r('复制全等三角形，拼成平行四边形',[
 '取底长b、高h的三角形，再复制一块全等三角形。','把副本绕一条斜边的中点旋转180°，两块沿这条边拼接。','两块内部没有重叠；外边界为平行四边形，底b、高h。','平行四边形面积为bh，而两块三角形全等，面积相等。','所以一个三角形面积S=bh/2；钝角三角形的高允许落在底边延长线上。'
 ],['S_1=S_2=S','2S=S_1+S_2','S_{\\text{拼成}}=bh','2S=bh','S=\\frac{bh}{2}'])
 ],(route,n)=>{
  if(route===0){let s='';if(n<3)s=poly('130,70 430,70 370,220 70,220');else s=poly('130,70 430,70 370,220 130,220');
   if(n>=1)s+=line(130,70,130,220,orange,'6 5')+right(130,220);
   if(n===2)s+=poly('130,70 70,220 130,220',warm,orange);
   if(n>=3){const p=poly('430,70 370,220 430,220',warm,orange);s+=n===3?'<g>'+p+'<animateTransform attributeName="transform" type="translate" from="-300 0" to="0 0" dur="1s" fill="freeze"/></g>':p;}
   s+=line(45,70,45,220,green,'4 4')+txt(25,155,'h')+txt(n>=3?280:220,255,'b')+txt(300,305,n>=3?'只平移剪下的三角形，面积不变':'沿垂直高度剪开');return s;}
  let s=poly('80,230 360,230 150,70');if(n>=1)s+=poly('430,70 150,70 360,230',warm,orange);if(n>=2)s+=line(150,70,150,230,green,'4 4')+right(150,230);return s+txt(220,263,'b')+txt(130,155,'h')+txt(300,315,n>=1?'两块全等三角形拼成平行四边形':'先看一个三角形');
 });
 entry('triangle-sum','三角形内角和为什么是180°？',
 '欧氏平面中的非退化三角形。平行线路线依赖内错角定理；转向路线依赖凸闭合边界的方向转一周为360°。球面三角形不适用。',[
 r('过顶点作平行线',[
 '画三角形ABC，并以BC为水平底边。','过顶点A作平行于BC的直线，A两旁形成一个平角。','由内错角相等，把角B对应到A左侧，把角C对应到A右侧。','A左侧的角、原角A、A右侧的角互不重叠，恰好组成平角。','所以A+B+C=180°；这用到了欧氏平行线的性质。'
 ],['\\triangle ABC','\\ell\\parallel BC','\\angle B=\\beta,\\quad\\angle C=\\gamma','\\beta+A+\\gamma=180^\\circ','A+B+C=180^\\circ']),
 r('沿凸三角形走一圈（转向解释）',[
 '沿三角形边界按同一方向走，记录每个顶点改变行进方向的外转角。','凸三角形每次向同一侧转，三次外转角合起来使方向转满一周。','因此外转角总和为360°，每个外转角是180°减去对应内角。','代入得(180°−A)+(180°−B)+(180°−C)=360°。','整理得A+B+C=180°；若使用转向定理，须先接受或证明凸闭合路径转向一周。'
 ],['\\varepsilon_A=180^\\circ-A','\\varepsilon_A+\\varepsilon_B+\\varepsilon_C=360^\\circ','\\sum\\varepsilon=540^\\circ-(A+B+C)','540^\\circ-(A+B+C)=360^\\circ','A+B+C=180^\\circ'])
 ],(route,n)=>{
  let s=poly('125,255 455,255 270,85','none');s+=txt(270,64,'A')+txt(103,278,'B')+txt(475,278,'C');
  if(route===0){if(n>=1)s+=line(65,85,535,85,orange);if(n>=2)s+=`<path d="M240 85A30 30 0 0 0 252 109 M293 109A32 32 0 0 0 302 85" fill="none" stroke="${green}" stroke-width="5"/>`+txt(214,116,'B')+txt(326,116,'C');if(n>=3)s+=`<path d="M253 108A30 30 0 0 0 290 111" fill="none" stroke="${orange}" stroke-width="5"/>`;return s+txt(300,325,'A处：三个相邻角拼成一个平角');}
  if(n>=1)s+=line(455,255,530,255,orange)+line(270,85,210,15,orange)+line(125,255,80,308,orange);if(n>=2)s+=`<path d="M495 255Q495 286 456 296 M233 42Q270 9 302 54 M105 278Q69 257 104 226" fill="none" stroke="${green}" stroke-width="3"/>`;return s+txt(300,325,'同向外转角总和为一周');
 });
 function squarePythagoras(x,y,z,n,fillCenter=true){const a=z*.4,b=z*.6;let s=rect(x,y,z,z,'#f8fbfc');const triangles=[`${x},${y} ${x+a},${y} ${x},${y+b}`,`${x+z},${y} ${x+z},${y+a} ${x+a},${y}`,`${x+z},${y+z} ${x+b},${y+z} ${x+z},${y+a}`,`${x},${y+z} ${x},${y+b} ${x+b},${y+z}`];
  for(let i=0;i<(n?4:1);i++)s+=poly(triangles[i],warm,orange);if(n>=2&&fillCenter)s+=poly(`${x+a},${y} ${x+z},${y+a} ${x+b},${y+z} ${x},${y+b}`,pale,blue);return s;}
 entry('pythagoras','勾股定理：拼补、相似与重新排列',
 'a、b为欧氏直角三角形的直角边，c为斜边，三边均为正。只依赖面积可加、全等或相似；不使用由勾股定理导出的距离公式来反证勾股定理。',[
 r('四个三角形拼补（面积证明）',[
 '取4个全等直角三角形，直角边为a、b，斜边为c。','把4个直角顶点分别放在边长a+b的大正方形四个角，四条斜边围住中央。','相邻两三角形的锐角互余，中央每个角为180°−90°=90°，所以中央是边长c的正方形。','大正方形面积等于四块三角形面积加中央面积：(a+b)²=4×ab/2+c²。','展开左边并合并右边，得到a²+2ab+b²=2ab+c²。','两边减去2ab，得到a²+b²=c²；全程没有使用两点距离公式。'
 ],['S_{\\triangle}=\\frac{ab}{2}','S_{\\text{外}}=(a+b)^2','\\alpha+\\beta=90^\\circ,\\quad S_{\\text{内}}=c^2','(a+b)^2=4\\cdot\\frac{ab}{2}+c^2','a^2+2ab+b^2=2ab+c^2','a^2+b^2=c^2']),
 r('相似三角形与斜边投影',[
 '在直角三角形ABC中，令AC=a、BC=b、AB=c，直角在C。','从C向斜边AB作高CD，记AD=p、DB=q，因此p+q=c。','由AA判定，三角形ACD与ABC相似，a/c=p/a，故a²=cp。','同理三角形BCD与ABC相似，b/c=q/b，故b²=cq。','两式相加，a²+b²=cp+cq=c(p+q)。','代入p+q=c，得到a²+b²=c²。'
 ],['\\angle C=90^\\circ','p+q=c,\\quad CD\\perp AB','\\frac{a}{c}=\\frac{p}{a}\\Rightarrow a^2=cp','\\frac{b}{c}=\\frac{q}{b}\\Rightarrow b^2=cq','a^2+b^2=c(p+q)','a^2+b^2=c^2']),
 r('同样四块，换一种摆法（剩余面积）',[
 '准备两块边长都为a+b的正方形，放入相同的四个直角三角形。','第一种摆法让斜边围成中央正方形；互余锐角保证它的四角是直角，剩余面积为c²。','第二种摆法把四块三角形两两配成两个a×b的长方形。','这两个长方形分别放进右上与左下角，剩余两块正方形的边长是a、b。','两块大正方形同面积，移除的四块三角形也同面积，所以两边剩余面积相同。','因此c²=a²+b²；这次比较的是两个完整布局，不借助距离公式。'
 ],['S_{\\text{外},1}=S_{\\text{外},2}=(a+b)^2','S_{\\text{余},1}=c^2','4S_{\\triangle}=2ab','S_{\\text{余},2}=a^2+b^2','S_{\\text{余},1}=S_{\\text{余},2}','c^2=a^2+b^2'])
 ],(route,n)=>{
  if(route===0)return squarePythagoras(165,35,250,n)+(n>=2?txt(290,168,'c²'):txt(290,320,'四个直角顶点在大正方形四角'))+txt(290,17,'a+b');
  if(route===1){let s=poly('90,255 450,255 219.6,82.2','none')+txt(73,280,'A')+txt(469,280,'B')+txt(219,58,'C')+txt(137,160,'a')+txt(353,160,'b');if(n>=1)s+=line(219.6,82.2,219.6,255,orange)+right(219.6,255)+txt(220,281,'D')+txt(150,245,'p')+txt(335,245,'q');if(n>=2)s+=poly('90,255 219.6,255 219.6,82.2','#e6bd8d88',orange);if(n>=3)s+=poly('450,255 219.6,255 219.6,82.2','#83bdad66',green);return s+txt(300,325,'斜边 c = p+q');}
  let s=squarePythagoras(25,70,220,n>=1?2:1)+txt(135,45,'摆法一：剩 c²');const x=350,y=70,a=88,b=132,z=220;s+=rect(x,y,z,z,'#f8fbfc');if(n>=2){s+=rect(x+a,y,b,a,warm,orange)+line(x+a,y,x+z,y+a,orange)+rect(x,y+a,a,b,warm,orange)+line(x,y+a,x+a,y+z,orange);}if(n>=3)s+=rect(x,y,a,a,pale)+rect(x+a,y+a,b,b,pale)+txt(x+a/2,y+a/2+6,'a²')+txt(x+a+b/2,y+a+b/2+6,'b²');return s+txt(460,45,'摆法二：剩 a² 和 b²')+txt(300,330,'外框相同，取走的四块三角形相同');
 });
 function sectors(cx,cy,radius,count){let s='';for(let k=0;k<count;k++){const a=k*2*Math.PI/count,b=(k+1)*2*Math.PI/count;s+=`<path d="M${cx} ${cy}L${cx+radius*Math.cos(a)} ${cy+radius*Math.sin(a)}A${radius} ${radius} 0 0 1 ${cx+radius*Math.cos(b)} ${cy+radius*Math.sin(b)}Z" fill="${k%2?warm:pale}" stroke="${blue}" stroke-width=".7"/>`;}return s;}
 function sectorStrip(count){const radius=90,half=radius*Math.sin(Math.PI/count),height=radius*Math.cos(Math.PI/count),start=135;let s='';for(let k=0;k<count;k++){const x=start+k*half,down=k%2;const y=down?220-height:220,yy=down?220:220-height;s+=`<path d="M${x} ${y}L${x-half} ${yy}A${radius} ${radius} 0 0 ${down?0:1} ${x+half} ${yy}Z" fill="${down?warm:pale}" stroke="${blue}" stroke-width=".6"/>`;}return s+line(start-half,260,start+count*half,260,green)+txt(300,285,'底边趋近 πr')+txt(82,180,'高趋近 r');}
 entry('circle','圆面积为什么等于πr²？',
 '半径r>0；面积保持于切割拼接。有限扇形拼图只有近似直边，严格相等要经过极限；正多边形夹逼路线使用内外接多边形周长趋近圆周长的事实。',[
 r('扇形交错排列（极限解释）',[
 '取半径r的圆，先标出圆周长2πr。','把圆平均切成偶数个扇形，各块面积之和仍等于原面积。','扇形一正一倒地排列；有限块时上下边仍是弧，不能称为精确长方形。','把份数加多，弧边越来越平，排列的高趋近r，长趋近半周长πr。','当份数无限增多时，用面积的极限得到S=(πr)r。','因此S=πr²；任意一张有限拼图都只是这条极限论证的示意。'
 ],['C=2\\pi r','S=\\sum_{k=1}^{N} S_k','N<\\infty:\\quad\\text{边界仍含圆弧}','\\text{长}\\to\\pi r,\\quad\\text{高}\\to r','S=\\lim_{N\\to\\infty}S_N=(\\pi r)r','S=\\pi r^2']),
 r('内外接正多边形夹逼',[
 '在半径r的圆内画正N边形，把它连接圆心，分成N个等腰三角形。','内接多边形的边心距为ρN，周长为PN，面积为PNρN/2。','再画外切正N边形：边心距为r，周长为QN，面积为QNr/2。','圆面积夹在二者之间：PNρN/2≤S≤QNr/2。','当N越来越大，ρN→r，PN和QN都趋于圆周长2πr。','上下界同趋于πr²，由夹逼得到S=πr²。'
 ],['N\\ge3','S_{\\text{内}}=\\frac{P_N\\rho_N}{2}','S_{\\text{外}}=\\frac{Q_Nr}{2}','\\frac{P_N\\rho_N}{2}\\le S\\le\\frac{Q_Nr}{2}','\\rho_N\\to r,\\quad P_N,Q_N\\to2\\pi r','S=\\pi r^2'])
 ],(route,n)=>{
  if(route===0){if(n===0)return circle(285,170,105,pale)+line(285,170,390,170,orange)+txt(335,154,'r')+txt(285,310,'先看完整的圆');if(n===1)return sectors(285,170,105,8)+txt(285,310,'8份扇形；面积没有增减');return sectorStrip([8,8,8,24,64,64][n])+txt(300,325,`此图 ${[8,8,8,24,64,64][n]} 份，弧边仍未完全变直`);}
  const count=[4,4,4,12,32,64][n],cx=240,cy=175,rad=105;let s=circle(cx,cy,rad);let inner=[],outer=[];for(let k=0;k<count;k++){const a=2*Math.PI*k/count-Math.PI/2;inner.push(`${cx+rad*Math.cos(a)},${cy+rad*Math.sin(a)}`);const R=rad/Math.cos(Math.PI/count);outer.push(`${cx+R*Math.cos(a+Math.PI/count)},${cy+R*Math.sin(a+Math.PI/count)}`);}
  if(n>=1)s+=poly(inner.join(' '),'#91c5d355');if(n>=2)s+=poly(outer.join(' '),'none',orange);if(n>=3)s+=line(cx,cy,cx+rad*Math.sin(Math.PI/count),cy-rad*Math.cos(Math.PI/count),green);return s+txt(460,120,'蓝：内接')+(n>=2?txt(460,165,'橙：外切'):'')+txt(460,220,`N=${count}`)+txt(300,330,'内接面积 ≤ 圆面积 ≤ 外切面积');
 });
 function unitCircle(n,rotated=true){const cx=230,cy=195,r=110,angle=rotated?Math.PI/4:0,x=cx+r*Math.cos(angle),y=cy-r*Math.sin(angle);let s=circle(cx,cy,r)+line(75,cy,385,cy,'#8daab2')+line(cx,55,cx,330,'#8daab2')+line(cx,cy,x,y,orange)+dot(x,y);if(n>=1)s+=line(x,y,x,cy,green,'5 4')+line(cx,cy,x,cy,blue)+txt(x+32,(y+cy)/2,'sinθ')+txt((cx+x)/2,cy+28,'cosθ');return s+txt(231,40,'单位圆：半径1')+txt(450,130,'P=(cosθ,sinθ)');}
 entry('trig-identities','三角恒等式：长度关系与角度相加',
 '欧氏平面；角以弧度计。平方和路线依赖勾股定理，旋转路线是同一长度基础的另一种解释；角度加法路线使用旋转对向量分量的线性作用。',[
 r('单位圆与勾股定理',[
 '在单位圆上取P=(cosθ,sinθ)，OP=1。','把P投影到x轴，得到两条直角边，长度是|cosθ|与|sinθ|。','由勾股定理，cos²θ+sin²θ=1²。','当点落到其他象限时坐标可为负，但平方不改变这个等式。','所以对所有实数角θ，sin²θ+cos²θ=1。'
 ],['P=(\\cos\\theta,\\sin\\theta),\\quad OP=1','\\text{直角边}=|\\cos\\theta|,|\\sin\\theta|','\\cos^2\\theta+\\sin^2\\theta=1^2','(-x)^2=x^2','\\sin^2\\theta+\\cos^2\\theta=1']),
 r('旋转保长（同一基础的另一种解释）',[
 '从单位向量(1,0)出发，它的长度为1。','把向量旋转θ，终点坐标按定义为(cosθ,sinθ)。','旋转是刚体运动，不伸长也不缩短，所以终点向量长度仍为1。','按直角坐标中的长度平方，长度平方等于cos²θ+sin²θ。','于是cos²θ+sin²θ=1；这与上一条共享欧氏长度基础，不冒充完全独立的公理体系。'
 ],['\\|(1,0)\\|=1','R_\\theta(1,0)=(\\cos\\theta,\\sin\\theta)','\\|R_\\theta(1,0)\\|=1','\\|R_\\theta(1,0)\\|^2=\\cos^2\\theta+\\sin^2\\theta','\\cos^2\\theta+\\sin^2\\theta=1']),
 r('两个旋转叠加（和角公式）',[
 '把角α的单位向量写成cosα·(1,0)+sinα·(0,1)。','再旋转β，第一条基向量变为(cosβ,sinβ)。','第二条基向量与第一条垂直，旋转后变为(−sinβ,cosβ)。','按分量相加，得到横坐标cosαcosβ−sinαsinβ，纵坐标sinαcosβ+cosαsinβ。','两次旋转的总角为α+β，因此这些分量就是cos(α+β)、sin(α+β)。','令β=−γ，即可得到差角公式；令β=α，即可得到二倍角公式。'
 ],['(\\cos\\alpha,\\sin\\alpha)=\\cos\\alpha(1,0)+\\sin\\alpha(0,1)','R_\\beta(1,0)=(\\cos\\beta,\\sin\\beta)','R_\\beta(0,1)=(-\\sin\\beta,\\cos\\beta)','x=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta','\\begin{aligned}\\cos(\\alpha+\\beta)&=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta\\\\\\sin(\\alpha+\\beta)&=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta\\end{aligned}','\\sin(2\\alpha)=2\\sin\\alpha\\cos\\alpha'])
 ],(route,n)=>{
  if(route===0)return unitCircle(n)+(n>=3?dot(230-77.78,195+77.78,green)+line(230,195,230-77.78,195+77.78,green):'');
  if(route===1)return unitCircle(n,n>=1)+(n>=2?`<path d="M300 195A70 70 0 0 0 279.5 145.5" fill="none" stroke="${orange}" stroke-width="4"/>`:'');
  const cx=240,cy=215,rad=130,alpha=Math.PI/6,beta=Math.PI/4,point=a=>[cx+rad*Math.cos(a),cy-rad*Math.sin(a)];let s=circle(cx,cy,rad)+line(70,cy,430,cy,'#8daab2')+line(cx,55,cx,345,'#8daab2');let p=point(alpha);s+=line(cx,cy,p[0],p[1],blue)+txt(p[0]+10,p[1]-10,'α');if(n>=1){p=point(beta);s+=line(cx,cy,p[0],p[1],green)+txt(p[0]+15,p[1]+17,'β');}if(n>=2){p=point(beta+Math.PI/2);s+=line(cx,cy,p[0],p[1],green)+txt(p[0]-10,p[1]-8,'β+π/2');}if(n>=3){p=point(alpha+beta);s+=line(cx,cy,p[0],p[1],orange)+line(p[0],p[1],p[0],cy,orange,'5 4')+dot(...p)+txt(465,100,'总角 α+β');}return s;
 });
 entry('trig-functions','正弦、余弦为何以2π为最小正周期？',
 '正弦余弦由单位圆坐标定义，角度以弧度计，定义域为实数。先证2π是周期，再排除小于2π的正周期；两个结论缺一不可。',[
 r('绕单位圆一周，再检查最小性',[
 '单位圆上角θ对应点P=(cosθ,sinθ)。','转过2π恰好一周，θ与θ+2π的终点相同。','所以sin(θ+2π)=sinθ，cos(θ+2π)=cosθ，2π确实是周期。','若T是余弦的正周期，取θ=0有cosT=1，只能T=2kπ。','若T是正弦的正周期，分别取θ=0与π/2，可得sinT=0且cosT=1。','因此正弦与余弦的最小正周期都为2π，不是π。'
 ],['P=(\\cos\\theta,\\sin\\theta)','\\theta\\mapsto\\theta+2\\pi','\\sin(\\theta+2\\pi)=\\sin\\theta,\\quad\\cos(\\theta+2\\pi)=\\cos\\theta','\\cos T=1\\Rightarrow T=2k\\pi','\\sin T=0,\\quad\\cos T=1','T_{\\min}=2\\pi']),
 r('用和角公式验证周期与最小性',[
 '由和角公式，sin(θ+T)=sinθcosT+cosθsinT。','若取T=2π，有cosT=1、sinT=0，立即得到sin(θ+2π)=sinθ。','余弦和角公式同样给出cos(θ+2π)=cosθ。','反过来，正弦对所有θ都不变，取θ=0和π/2得到sinT=0、cosT=1。','余弦对所有θ不变时，取θ=0同样得cosT=1，所以只能T=2kπ。','由T>0，最小可取k=1，故两者最小正周期均为2π。'
 ],['\\sin(\\theta+T)=\\sin\\theta\\cos T+\\cos\\theta\\sin T','\\sin(\\theta+2\\pi)=\\sin\\theta','\\cos(\\theta+2\\pi)=\\cos\\theta','\\sin T=0,\\quad\\cos T=1','T=2k\\pi','T_{\\min}=2\\pi'])
 ],(route,n)=>{
  if(route===0){let s=unitCircle(n);if(n>=1)s+=circle(230,195,128)+`<path d="M355 185l12 10-14 5" fill="${orange}"/>`+txt(452,240,'θ 与 θ+2π 重合');if(n>=3)s+=dot(340,195,green)+txt(440,285,'cosT=1：只能回到(1,0)');return s;}
  let s=line(60,205,550,205,'#8daab2')+line(60,55,60,325,'#8daab2');let path='';for(let i=0;i<=120;i++){const t=i/120*4*Math.PI;path+=(i?'L':'M')+(60+i/120*490)+' '+(205-75*Math.sin(t));}s+=`<path d="${path}" fill="none" stroke="${blue}" stroke-width="3"/>`;if(n>=1)s+=line(60,90,305,90,orange)+txt(182,75,'2π')+dot(60,205)+dot(305,205);if(n>=3)s+=line(121.25,125,366.25,125,green)+dot(121.25,130,green)+dot(366.25,130,green);return s+txt(300,340,'所有输入都重复，才是周期');
 });
 entry('right-trig','直角三角比为什么只由角决定？',
 '欧氏非退化直角三角形，固定锐角0<θ<π/2，三边为正；单位圆定义可推广到其他实数角，tan仅在cosθ≠0时定义。',[
 r('AA相似与对应边成比例',[
 '取两个都含锐角θ的直角三角形，一个大，一个小。','两者各有一个直角和一个角θ，第三个角也相同，由AA判定相似。','对应边同时放大同一倍数λ，所以对边与斜边的比不变。','邻边与斜边、对边与邻边的比也同样不变。','把这三个比依次叫sinθ、cosθ、tanθ；它们只由角θ决定。'
 ],['0<\\theta<\\frac{\\pi}{2}','\\triangle_1\\sim\\triangle_2','\\frac{\\lambda a}{\\lambda c}=\\frac ac','\\frac{\\lambda b}{\\lambda c}=\\frac bc,\\quad\\frac{\\lambda a}{\\lambda b}=\\frac ab','\\sin\\theta=\\frac ac,\\quad\\cos\\theta=\\frac bc,\\quad\\tan\\theta=\\frac ab']),
 r('把斜边缩放到1，放入单位圆',[
 '取锐角θ的直角三角形，斜边长c。','所有边同除以c，斜边变1，对边变a/c，邻边变b/c。','把锐角顶点放在原点，邻边沿正x轴，斜边终点就在单位圆上。','圆上点坐标为(b/c,a/c)，所以cosθ=b/c、sinθ=a/c。','当邻边不为0时，tanθ=(a/c)/(b/c)=a/b；推广后cosθ=0时不可作除法。'
 ],['c>0','\\frac cc=1','P\\in\\{(x,y):x^2+y^2=1\\}','P=\\left(\\frac bc,\\frac ac\\right)=(\\cos\\theta,\\sin\\theta)','\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}=\\frac ab'])
 ],(route,n)=>{
  if(route===0){let s=poly('55,255 215,255 215,135','none')+txt(112,280,'邻边 b')+txt(245,200,'对边 a')+txt(132,180,'c')+txt(82,246,'θ');if(n>=1)s+=poly('320,255 560,255 560,75',warm,orange)+txt(428,282,'λb')+txt(575,165,'λa')+txt(423,140,'λc')+txt(348,246,'θ');if(n>=2)s+=right(215,255,-1,-1)+right(560,255,-1,-1);return s+txt(300,330,'相似：对应边同时缩放，比例不变');}
  let s=unitCircle(n)+(n>=1?txt(452,285,'斜边缩为1'):'');if(n===0)s+=poly('415,310 565,310 565,197','none')+txt(480,245,'c');return s;
 });
 entry('sine-cosine-law','正弦定理与余弦定理怎样证明？',
 '三角形非退化，a=BC、b=CA、c=AB，分别对角A、B、C，外接圆半径R>0。有向投影可为负；直角与钝角情形不能略去。',[
 r('正弦定理：直径构造出直角三角形',[
 '在三角形ABC的外接圆上，过B作直径BD，故BD=2R。','连接CD；若D与C不同，直径所对圆周角BCD为90°。','圆周角BDC与BAC相等或互补，它们的正弦相同，故sin∠BDC=sinA。','在直角三角形BCD中，sin∠BDC=BC/BD=a/(2R)，所以a=2RsinA。','若BC本身是直径，则A=90°，a=2R，也满足同一等式；对b、c重复构造。','三式分别除以正弦，得到a/sinA=b/sinB=c/sinC=2R。'
 ],['BD=2R','\\angle BCD=90^\\circ','\\sin\\angle BDC=\\sin A','\\sin A=\\frac{a}{2R}\\Rightarrow a=2R\\sin A','b=2R\\sin B,\\quad c=2R\\sin C','\\frac a{\\sin A}=\\frac b{\\sin B}=\\frac c{\\sin C}=2R']),
 r('余弦定理：边a向边b作有向投影',[
 '令C为两边a=CB与b=CA的夹角，c=AB是它的对边。','从B向直线CA作垂线，垂足D；CD的有向长度是a cosC，BD长a sinC。','因此D到A的水平差为b−a cosC，BA的竖直差为a sinC。','对直角坐标分量用勾股定理，c²=(b−a cosC)²+(a sinC)²。','展开后用cos²C+sin²C=1，得到c²=b²−2abcosC+a²。','所以c²=a²+b²−2abcosC；C为钝角时有向投影为负，公式仍成立。'
 ],['a=BC,\\quad b=CA,\\quad c=AB','\\overline{CD}=a\\cos C,\\quad BD=a\\sin C','\\overline{DA}=b-a\\cos C','c^2=(b-a\\cos C)^2+(a\\sin C)^2','c^2=b^2-2ab\\cos C+a^2','c^2=a^2+b^2-2ab\\cos C'])
 ],(route,n)=>{
  if(route===0){const cx=250,cy=175,rad=110,B=[154.737,230],C=[345.263,230],A=[250,65],D=[345.263,120];let s=circle(cx,cy,rad)+poly(`${A} ${B} ${C}`,'none')+txt(250,47,'A')+txt(133,246,'B')+txt(367,246,'C')+txt(250,253,'a');if(n>=1)s+=line(...B,...D,orange)+dot(...D)+txt(365,113,'D')+txt(250,158,'2R');if(n>=2)s+=line(...D,...C,orange)+right(C[0],C[1],-1,-1);if(n>=3)s+=poly(`${B} ${C} ${D}`,'#e6bd8d44',orange);return s+txt(300,330,'直径 → 直角三角形 → 边与角的比');}
  const C=[100,250],A=[440,250],B=[244,58],D=[244,250];let s=poly(`${C} ${A} ${B}`,'none')+txt(80,275,'C')+txt(463,275,'A')+txt(246,38,'B')+txt(155,145,'a')+txt(363,145,'c')+txt(270,287,'b');if(n>=1)s+=line(...B,...D,orange)+right(...D,1,-1)+txt(243,275,'D')+txt(153,236,'a cosC');if(n>=2)s+=line(268,58,268,250,green,'5 4')+txt(325,172,'a sinC')+line(244,311,440,311,orange)+txt(345,338,'b − a cosC');return s;
 });
 entry('radians','弧度：把角度定义成弧长与半径之比',
 '半径r>0，弧长s与r使用相同单位；先看非负圆心角，再用旋转方向定义有向角。弧度是定义，相似缩放和单位圆是同一定义的两种解释。',[
 r('相似圆中保持不变的比值',[
 '同一个圆心角，在半径r的圆上截得弧长s。','把整幅图放大λ倍，半径为λr，弧长为λs，角度不变。','所以弧长除以半径的比值不受圆的大小影响。','把这个比值定义为角的弧度数θ=s/r，因此s=rθ。','一整圈s=2πr，故一周为2π弧度，半周为π弧度。'
 ],['r>0','r\\mapsto\\lambda r,\\quad s\\mapsto\\lambda s','\\frac{\\lambda s}{\\lambda r}=\\frac sr','\\theta:=\\frac sr,\\quad s=r\\theta','360^\\circ=2\\pi\\;\\text{rad}']),
 r('把圆缩放到单位圆',[
 '把半径r的圆按比例1/r缩放。','半径变成1，对应弧长变成s/r，圆心角保持不变。','在单位圆上，弧长的数值就是圆心角的弧度数θ。','因此原圆中θ=s/r，和相似比值定义完全相同。','若角为d度，一周占比为d/360，所以θ=dπ/180；例如90°=π/2。'
 ],['\\text{缩放倍数}=\\frac1r','r\\mapsto1,\\quad s\\mapsto\\frac sr','\\theta=s_{\\text{单位圆}}','\\theta=\\frac sr','\\theta=\\frac{d\\pi}{180},\\quad90^\\circ=\\frac\\pi2'])
 ],(route,n)=>{
  function arc(cx,cy,r){const x=cx+r*.5,y=cy-r*Math.sqrt(3)/2;return circle(cx,cy,r)+line(cx,cy,cx+r,cy)+line(cx,cy,x,y)+`<path d="M${cx+r} ${cy}A${r} ${r} 0 0 0 ${x} ${y}" fill="none" stroke="${orange}" stroke-width="6"/>`+txt(cx+r*.55,cy-r*.12,'θ');}
  if(route===0){let s=arc(155,205,65)+txt(155,300,'半径 r；弧长 s');if(n>=1)s+=arc(420,205,110)+txt(420,345,'半径 λr；弧长 λs');return s;}
  let s=arc(170,205,n>=1?75:110)+txt(170,340,n>=1?'半径1；弧长 s/r':'原圆半径r');if(n>=1)s+=line(300,185,360,185,orange)+`<path d="M350 175L365 185 350 195" fill="none" stroke="${orange}" stroke-width="3"/>`+arc(450,205,75)+txt(450,310,'单位圆');return s;
 });
}
if(typeof module!=='undefined')module.exports=install;else install(root.MathProofs,root.MathProofVisuals);
})(globalThis);
