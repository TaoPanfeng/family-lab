/* Focused lesson diagrams. A graph belongs to a question, not merely to a subject. */
(function(r){'use strict';
const E=Formula.esc, svg=s=>`<svg viewBox="0 0 600 310" role="img">${s}</svg>`,text=(x,y,t)=>`<text x="${x}" y="${y}" font-size="20" fill="#203e49" text-anchor="middle">${E(t)}</text>`,line=(x,y,X,Y,c='#7898a1')=>`<path d="M${x} ${y}L${X} ${Y}" stroke="${c}" stroke-width="2"/>`,dot=(x,y,c='#2679aa',n='')=>`<circle cx="${x}" cy="${y}" r="17" fill="${c}"/>${text(x,y+7,n).replace('#203e49','#fff')}`;
let active=null;
function mount(id,host){if(!['sets','shapes','commutative','direction','coordinates','data-count','sorting','patterns','order-operations','symmetry','continuity','limits','fraction-ops','identities','function-domain','function-transform','sine-cosine-law','dot-product','orthogonal','conditional','spread','logarithms'].includes(id))return false;
 let st={op:'union',A:[1,2,3],B:[3,4],step:0,a:3,b:5,kind:0,n:3,x:2,y:3,hole:7,shift:2,raise:1};active={id,st};
 host.innerHTML='<div class="focused-lab"><div class="focused-controls"></div><div class="focused-picture"></div><div class="focused-result" role="status"></div><p class="focused-note"></p></div>';
 const controls=host.querySelector('.focused-controls'),picture=host.querySelector('.focused-picture'),result=host.querySelector('.focused-result'),note=host.querySelector('.focused-note');
 function control(key,label,min,max,step=1){const l=document.createElement('label');l.textContent=label+' ';const o=document.createElement('output');o.textContent=st[key];l.append(o);const e=document.createElement('input');e.type='range';e.min=min;e.max=max;e.step=step;e.value=st[key];e.dataset.lessonControl=key;e.oninput=()=>{st[key]=Number(e.value);o.textContent=e.value;draw();};l.append(e);controls.append(l);}
 function button(label,fn,key){const b=document.createElement('button');b.textContent=label;b.dataset.lessonAction=key||label;b.onclick=()=>{fn();draw();};controls.append(b);return b;}
 function formula(tex){result.innerHTML=Formula.math(tex,true);}
 if(id==='sets'){
  for(const k of ['A','B']){const row=document.createElement('div');row.className='member-row';row.textContent=k+' 的元素：';for(let n=1;n<=6;n++){const b=document.createElement('button');b.textContent=n;b.dataset.member=k+n;b.setAttribute('aria-pressed',st[k].includes(n));b.onclick=()=>{st[k]=st[k].includes(n)?st[k].filter(x=>x!==n):st[k].concat(n).sort((a,b)=>a-b);b.setAttribute('aria-pressed',st[k].includes(n));draw();};row.append(b);}controls.append(row);}
  for(const [key,name]of [['union','并集：至少在一组'],['intersection','交集：两组都有'],['difference','差集：在A，不在B']])button(name,()=>st.op=key,key);
 }else if(['direction','coordinates'].includes(id)){control('x','向右 / 向左',-4,4);control('y','向上 / 向下',-4,4);}
 else if(id==='continuity'){control('hole','只改变 x=2 处的函数值',1,8);}
 else if(id==='limits'){control('n','走到第几步',1,12);}
 else if(id==='function-transform'){control('shift','顶点横坐标 h',-3,3);control('raise','顶点纵坐标 k',-2,3);}
 else if(id==='fraction-ops'){control('a','第一杯：取几份 / 6',0,6);st.b=2;control('b','第二杯：取几份 / 6',0,6);}
 else if(id==='identities'){st.a=3;st.b=2;control('a','长 a',1,5);control('b','长 b',1,4);}
 else if(['dot-product','orthogonal'].includes(id)){st.x=3;st.y=4;control('x','向量横分量',-4,4);control('y','向量纵分量',-4,4);}
 else if(id==='logarithms'){st.a=2;st.n=3;control('a','底数',2,4);control('n','乘几次',0,6);}
 else if(id==='spread'){st.a=2;control('a','离均值的距离',0,4);}
 else if(id==='shapes')button('换一种图形',()=>st.kind=(st.kind+1)%4,'shape');
 else if(id==='commutative')button('把两组交换位置',()=>st.step=1-st.step,'swap');
 else if(id==='data-count')button('给蓝色再添1块',()=>st.n=st.n>=8?0:st.n+1,'add-blue');
 else if(id==='sorting')button('交换一对，再看顺序',()=>st.step=(st.step+1)%3,'sort-step');
 else if(id==='patterns')button('换一种生成规则',()=>st.step=1-st.step,'pattern-rule');
 else if(id==='order-operations')button('切换括号的位置',()=>st.step=1-st.step,'brackets');
 else if(id==='symmetry')button('切换：平移 / 对称 / 旋转',()=>st.step=(st.step+1)%3,'transform');
 else if(id==='function-domain'){st.x=2;control('x','输入 x（包含不允许的0）',-5,5);}
 else if(id==='conditional')button('切换：全部牌 / 已知是红牌',()=>st.step=1-st.step,'condition');
 else if(id==='sine-cosine-law'){st.n=60;control('n','两边之间的角度',10,170);}
 function draw(){
  if(id==='sets'){
   const both=st.A.filter(n=>st.B.includes(n)),onlyA=st.A.filter(n=>!st.B.includes(n)),onlyB=st.B.filter(n=>!st.A.includes(n)),selected=st.op==='union'?[...new Set(st.A.concat(st.B))].sort((a,b)=>a-b):st.op==='intersection'?both:onlyA;
   let s='<rect x="15" y="20" width="570" height="270" rx="10" fill="none" stroke="#b2c2c6"/><ellipse cx="232" cy="151" rx="145" ry="110" fill="#4f8ac933" stroke="#2679aa"/><ellipse cx="368" cy="151" rx="145" ry="110" fill="#d7904733" stroke="#bb783a"/>'+text(175,58,'A')+text(425,58,'B');
   for(const [ns,x]of [[onlyA,180],[both,300],[onlyB,420]])for(let i=0;i<ns.length;i++)s+=dot(x+(i%2)*34-17,97+Math.floor(i/2)*49,selected.includes(ns[i])?'#226f60':'#6c818a',ns[i]);
   s+=text(300,278,'全集：{1,2,3,4,5,6}；圈外元素未绘出');picture.innerHTML=svg(s);formula('A'+({union:'\\cup',intersection:'\\cap',difference:'\\setminus'}[st.op])+' B=\\{'+selected.join(',')+'\\}');note.textContent='这里每一个数字是一个元素，不是人数。重复的元素只算一次。点A或B的数字，亲自改变成员。';
  }else if(id==='shapes'){
   const shape=['<polygon points="300,45 160,245 440,245"/>','<rect x="200" y="55" width="200" height="200"/>','<rect x="140" y="95" width="320" height="160"/>','<circle cx="300" cy="150" r="105"/>'][st.kind];picture.innerHTML=svg('<g fill="#b5d9d2" stroke="#277568" stroke-width="3">'+shape+'</g>');result.textContent=['三角形：3条边、3个角','正方形：四边相等，四角都是直角','矩形：四角是直角，邻边不一定相等','圆：边界弯曲，没有多边形那样的角'][st.kind];note.textContent='分类看条件，不看摆放方向。正方形也符合矩形的条件。';
  }else if(['direction','coordinates','symmetry','orthogonal','dot-product'].includes(id)){
   let s='';const X=x=>300+x*27,Y=y=>150-y*27;for(let i=-5;i<=5;i++){s+=line(X(i),15,X(i),285,'#d2dddd')+line(165,Y(i),435,Y(i),'#d2dddd');}s+=line(145,150,455,150)+line(300,292,300,5)+text(452,177,'x')+text(322,23,'y');
   const x=id==='symmetry'?2:st.x,y=id==='symmetry'?1:st.y;s+=line(300,150,X(x),Y(y),'#2679aa')+dot(X(x),Y(y));
   let out=[x,y];if(id==='symmetry')out=[[5,1],[-2,1],[-1,2]][st.step];else if(id==='orthogonal')out=[x,0];else if(id==='dot-product')out=[2,0];
   if(!['direction','coordinates'].includes(id))s+=line(300,150,X(out[0]),Y(out[1]),'#b86638')+dot(X(out[0]),Y(out[1]),'#b86638');picture.innerHTML=svg(s);
   if(id==='dot-product'){formula(`(${x},${y})\\cdot(2,0)=${2*x}`);note.textContent='橙色向量固定向右。蓝色的竖直分量不影响这个点积；蓝色竖直且非零时，两向量垂直，点积为0。';}
   else{formula(`(${x},${y})${id==='symmetry'?'\\longmapsto ('+out.join(',')+')':id==='orthogonal'?'\\longmapsto ('+x+',0)':''}`);note.textContent=id==='symmetry'?['平移：每个点向右3格','关于y轴反射：横坐标变号','绕原点逆时针旋转90°'][st.step]:id==='orthogonal'?'投到水平轴，保留横向分量；丢下的竖直分量与水平轴垂直。':'横坐标在前，纵坐标在后；负号表示相反方向。横纵一格相同长度。';}
  }else if(id==='continuity'){
   let pts=Array.from({length:101},(_,i)=>{let x=i/25;return `${60+x*120},${280-x*x*15}`;});picture.innerHTML=svg('<polyline points="'+pts.join(' ')+'" fill="none" stroke="#2679aa" stroke-width="3"/><circle cx="300" cy="220" r="7" fill="#fbf9f3" stroke="#2679aa" stroke-width="3"/>'+dot(300,280-st.hole*15,'#bd653e')+text(430,37,'只改变一个点的值'));formula(`\\lim_{x\\to2}f(x)=4,\\qquad f(2)=${st.hole}`);note.textContent=st.hole===4?'点放回曲线上：极限值和函数值相同，恢复连续。':'左右沿曲线都靠近4，但橙色点的实际值不是4：在2处不连续。曲线在其他位置仍是x的平方。';
  }else if(id==='limits'){
   const x=1-2**(-st.n);picture.innerHTML=svg(line(45,160,555,160)+Array.from({length:st.n},(_,i)=>dot(45+510*(1-2**(-(i+1))),160,i===st.n-1?'#bb6839':'#85b7bf')).join('')+text(45,202,'0')+text(555,202,'1'));formula(`a_{${st.n}}=1-\\frac{1}{2^{${st.n}}},\\quad 1-a_{${st.n}}=\\frac{1}{${2**st.n}}`);note.textContent='每一步把剩下的距离再分成两半。有限的第n步还没到1；“极限为1”说的是可以任意接近，不是最后一项等于1。';
  }else if(id==='fraction-ops'){
   let s='';for(const [j,k]of [[0,st.a],[1,st.b]])for(let i=0;i<6;i++)s+=`<rect x="${80+i*70}" y="${70+j*100}" width="68" height="60" fill="${i<k?(j?'#c87b49':'#478fac'):'#e2e7e3'}" stroke="#a2b8be"/>`;picture.innerHTML=svg(s);formula(`\\frac{${st.a}}6+\\frac{${st.b}}6=\\frac{${st.a+st.b}}6`);note.textContent='两个整体原来一样大，每份也一样大，才直接相加分子。开始的3/6和2/6就是1/2与1/3通分后的小份。超过6份会超过一个整体。';
  }else if(id==='identities'){
   const a=st.a*27,b=st.b*27;let s='';for(const [x,y,w,h,t,c]of [[70,30,a,a,'a²','#b7d7e6'],[70+a,30,b,a,'ab','#f0d2a8'],[70,30+a,a,b,'ab','#f0d2a8'],[70+a,30+a,b,b,'b²','#b7d9c5']])s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#fff"/>`+text(x+w/2,y+h/2+6,t);picture.innerHTML=svg(s);formula(`(${st.a}+${st.b})^2=${st.a**2}+2\\times${st.a}\\times${st.b}+${st.b**2}=${(st.a+st.b)**2}`);note.textContent='正方形拆成四块，中间有两个ab，不是一个。面积拼接解释正数边长；一般实数的恒等式由分配律证明。';
  }else if(id==='function-domain'){
   picture.innerHTML=svg(text(100,140,'输入 '+st.x)+line(170,133,235,133)+`<rect x="235" y="80" width="130" height="110" rx="15" fill="#bfdbd8"/>`+text(300,140,'求倒数')+line(365,133,430,133)+text(510,140,st.x===0?'不允许':String(+(1/st.x).toFixed(3))));formula(st.x===0?'x=0\\notin D':'f('+st.x+')=\\frac1{'+st.x+'}');note.textContent='函数的定义域是允许输入的集合。输入0时不是输出0，也不是输出一个叫“无穷”的普通实数。';
  }else if(id==='function-transform'){
   const points=(h,k)=>Array.from({length:121},(_,i)=>{const x=-4+i/15;return [300+x*44,235-((x-h)**2+k)*23];}).filter(p=>p[1]>5&&p[1]<300).map(p=>p.join(',')).join(' ');picture.innerHTML=svg(line(35,235,565,235)+line(300,300,300,10)+`<polyline points="${points(0,0)}" stroke="#789bac" fill="none" stroke-width="2"/><polyline points="${points(st.shift,st.raise)}" stroke="#bd693b" fill="none" stroke-width="3"/>`+dot(300+st.shift*44,235-st.raise*23,'#bd693b'));formula(`y=(x-${st.shift})^2+(${st.raise})`);note.textContent=`灰色为原图y=x²；橙色顶点在(${st.shift},${st.raise})。“x−h”使顶点向右移动h，而不是向左。`; 
  }else if(id==='conditional'){
   picture.innerHTML=svg(['♥ 红桃13','♦ 方块13','♠ 黑桃13','♣ 梅花13'].map((t,i)=>`<rect x="${40+i*140}" y="72" width="125" height="160" rx="12" fill="${i<2?'#f5d5cb':'#d2dfe4'}" opacity="${st.step&&i>=2?.2:1}"/>`+text(102+i*140,156,t)).join(''));formula(st.step?'P(\\text{红桃}\\mid\\text{红牌})=\\frac{13}{26}=\\frac12':'P(\\text{红桃})=\\frac{13}{52}=\\frac14');note.textContent='忽略大小王，共52张。得到“是红牌”的信息后，可能范围从52张缩为26张；红桃仍13张，改变的是分母。';
  }else if(id==='sine-cosine-law'){
   const a=st.n*Math.PI/180,c=Math.sqrt(8-8*Math.cos(a));picture.innerHTML=svg(`<polygon points="240,250 400,250 ${240+160*Math.cos(a)},${250-160*Math.sin(a)}" fill="#bfdbd8" stroke="#287986" stroke-width="3"/>`+text(240,282,'2')+text(130,144,'2')+text(390,120,st.n+'°'));formula(`c^2=2^2+2^2-2\\cdot2\\cdot2\\cos(${st.n}^\\circ),\\quad c\\approx${c.toFixed(3)}`);note.textContent='两边都固定为2，改变夹角，第三边会变。90°时余弦项为0，余弦定理回到勾股定理。';
  }else if(id==='logarithms'){
   const value=st.a**st.n;picture.innerHTML=svg(text(300,90,'从1出发，每次乘 '+st.a)+Array.from({length:st.n+1},(_,i)=>text(50+i*80,170,st.a**i)).join('')+text(300,250,'反过来问：乘了多少次？'));formula(`${st.a}^{${st.n}}=${value}\\quad\\Longleftrightarrow\\quad\\log_{${st.a}}${value}=${st.n}`);note.textContent='这里先观察整数次重复相乘。一般对数也允许非整数答案；底数须大于0且不为1，真数大于0。';
  }else if(id==='spread'){
   picture.innerHTML=svg(line(70,160,530,160)+[4-st.a,4,4+st.a].map((x,i)=>dot(70+x*57.5,160,i===1?'#c57b43':'#277dad')).join('')+text(300,220,'中点始终是4，两侧等距移开'));formula(`\\bar x=4,\\quad\\sigma^2=\\frac{${st.a}^2+0+${st.a}^2}{3}\\approx ${+(2*st.a**2/3).toFixed(3)}`);note.textContent='三个数的均值不动，但分散程度会变。这里除以3计算这三个数的总体方差，不是无偏样本方差。';
  }else{
   let top='',bottom='',tex='',explain='';
   if(id==='commutative'){const a=st.step?5:3,b=st.step?3:5;top=st.step?'5颗蓝豆 ＋ 3颗红豆':'3颗红豆 ＋ 5颗蓝豆';bottom='交换颜色的位置，总数保持8';tex=`${a}+${b}=8,\\quad5-3=2\\ne3-5`;explain='加法交换两个加数，总量不变。减法要区分拿走谁，不能照搬交换律。';}
   if(id==='data-count'){top=`红4块　蓝${st.n}块　黄2块`;bottom='分类不重叠，再汇总';tex=`4+${st.n}+2=${6+st.n}`;explain='按颜色每块只归一类；蓝色数量增加时，总数跟着增加。类别数量不等于优劣。';}
   if(id==='sorting'){const states=[[2,5,3],[2,3,5],[2,5,3]];top=states[st.step].join('　　');bottom=st.step===1?'这次按数值从小到大排':'比较相邻的5与3';tex=st.step===1?'2<3<5':'5>3';explain='换了顺序，元素和总数没变。按颜色分类与按数值排序不是同一个操作。';}
   if(id==='patterns'){top=st.step?'2，4，6，10':'2，4，6，8';bottom=st.step?'规则：从第四项开始，每次增加4':'规则：每次增加2';tex=st.step?'a_4=10':'a_n=2n';explain='前三项一样，后面的规则仍可不同。先写明规则，才能谈“下一项”。';}
   if(id==='order-operations'){top=st.step?'先把3和2装进同一组':'先计算两组4，再添3';bottom=st.step?'5组，每组4':'3颗 ＋ 8颗';tex=st.step?'(3+2)\\times4=5\\times4=20':'3+2\\times4=3+8=11';explain='括号不是装饰；它改变先做什么，也改变数量的分组。';}
   let s=text(300,65,top);if(id==='data-count')for(const [j,n,c]of [[0,4,'#b95e46'],[1,st.n,'#297fa8'],[2,2,'#b69037']])for(let k=0;k<n;k++)s+=`<circle cx="${125+j*175}" cy="${100+k*23}" r="8" fill="${c}"/>`;else if(id==='commutative'){for(let i=0;i<8;i++)s+=dot(95+i*59,150,(st.step?i>=5:i<3)?'#b7664a':'#297fa8');}else s+=text(300,163,bottom);picture.innerHTML=svg(s);formula(tex);note.textContent=explain;
  }
 }
 draw();return true;
}
r.MathLessonVisuals={mount,state:()=>active};
})(window);
