/* 原创 Canvas 实验图。画面是有标注的教学剖面，不声称为流体或工程仿真。 */
(function(root){
'use strict';
const P=root.Physics,C=root.LabCatalog;
const colors={bg:'#101f2b',ink:'#e6f0f2',muted:'#8da6b5',grid:'#233643',teal:'#5edac9',blue:'#81aee8',amber:'#f5be68',red:'#ee8f80',line:'#557483'};
function draw(canvas,id,p,t,options={}){
 const box=canvas.getBoundingClientRect(),cw=Math.max(1,box.width),ch=Math.max(1,box.height),dpr=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(cw*dpr)||canvas.height!==Math.round(ch*dpr)){canvas.width=Math.round(cw*dpr);canvas.height=Math.round(ch*dpr);}
 const ctx=canvas.getContext('2d');const W=900,H=500,s=Math.min(cw/W,ch/H),ox=(cw-W*s)/2,oy=(ch-H*s)/2;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,cw,ch);ctx.translate(ox,oy);ctx.scale(s,s);
 const compact=cw<580,r=P.solve(id,p,t),base=options.baseline||p,handles=[];
 const line=(x1,y1,x2,y2,color=colors.line,width=2,dash=[])=>{ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);};
 const path=(points,color=colors.teal,width=2,fill=false)=>{ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(q=>ctx.lineTo(...q));if(fill)ctx.closePath();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;if(fill)ctx.fill();else ctx.stroke();};
 const circle=(x,y,radius,fill,stroke=null,width=2)=>{ctx.beginPath();ctx.arc(x,y,Math.max(0,radius),0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
 const rect=(x,y,w,h,fill,stroke=null,radius=8)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,radius);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}};
 const text=(str,x,y,size=17,color=colors.ink,align='left',weight=400)=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px "Microsoft YaHei","PingFang SC",system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(String(str),x,y);};
 const arrow=(x1,y1,x2,y2,color=colors.teal,width=3)=>{line(x1,y1,x2,y2,color,width);if(Math.hypot(x2-x1,y2-y1)<2)return;const a=Math.atan2(y2-y1,x2-x1),k=10;path([[x2-k*Math.cos(a-.45),y2-k*Math.sin(a-.45)],[x2,y2],[x2-k*Math.cos(a+.45),y2-k*Math.sin(a+.45)]],color,width);};
 const label=(str,x,y,color=colors.teal)=>{ctx.font='16px "Microsoft YaHei",sans-serif';const w=ctx.measureText(str).width+26;rect(x-w/2,y-17,w,34,colors.bg,color,8);text(str,x,y,16,color,'center',500);};
 const ruler=(x,y1,y2,caption)=>{line(x,y1,x,y2,colors.muted,1,[4,5]);line(x-7,y1,x+7,y1,colors.muted);line(x-7,y2,x+7,y2,colors.muted);text(caption,x-12,(y1+y2)/2,17,colors.muted,'right');};
 const ball=(x,y,rad=17,color=colors.amber)=>{const g=ctx.createRadialGradient(x-5,y-6,2,x,y,rad);g.addColorStop(0,'#ffebbf');g.addColorStop(.3,color);g.addColorStop(1,'#ac7340');circle(x,y,rad,g);circle(x-5,y-6,3,'#fff4d2');};
 const cart=(x,y,mass=1)=>{rect(x-32,y-34,64,31,colors.teal,null,7);rect(x-18,y-50,34,19,'#b6eee0',null,4);circle(x-19,y,9,colors.bg,colors.muted,4);circle(x+20,y,9,colors.bg,colors.muted,4);text(`${mass} kg`,x,y-19,13,'#133c3b','center',600);};
 const bar=(name,value,max,x,y,color=colors.teal,unit='J')=>{text(name,x,y,15,colors.muted);rect(x+95,y-7,170,14,'#253642',null,5);rect(x+95,y-7,170*P.clamp(value/(max||1),0,1),14,color,null,5);text(`${P.fmt(value,2)} ${unit}`,x+281,y,16,color);};
 const water=(x,y,w,h,color=colors.teal)=>{if(h<=0)return;const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,color+'72');g.addColorStop(1,color+'18');rect(x,y,w,h,g,null,1);line(x,y,x+w,y,color,2);};
 function handle(x,y,key,min,max,axis,map){circle(x,y,8,colors.bg,colors.teal,3);circle(x,y,3,colors.teal);if(options.interactive!==false)handles.push({x,y,key,min,max,axis,map});}
 function caption(a,b){text(a,40,30,16,colors.muted);if(b&&!compact)text(b,860,30,14,colors.muted,'right');}
 // Restrained graph-paper background, shared by every experiment.
 for(let x=25;x<W;x+=25)for(let y=60;y<460;y+=25)circle(x,y,.65,'#34505d');
 const halo=ctx.createRadialGradient(380,230,10,380,230,340);halo.addColorStop(0,'#12443a30');halo.addColorStop(1,'#101f2b00');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
 switch(id){
 case 'speed':case 'acceleration':case 'force':case 'work':{
  caption(id==='speed'?'单向匀速 · 向右为正':id==='acceleration'?'恒定加速度 · 向右为正':id==='force'?'从静止开始 · 水平运动':'规定水平位移 · 指定恒力','示踪点相隔相同模拟时间');
  let end=id==='speed'?p.distance:id==='work'?p.distance:r.dx,lo=Math.min(0,end),hi=Math.max(1,end),T=p.duration;
  if(id==='acceleration'){const turn=-p.v0/p.a;if(turn>0&&turn<T){const x=p.v0*turn+.5*p.a*turn**2;lo=Math.min(lo,x);hi=Math.max(hi,x);}}
  const rb=P.solve(id,base,0),be=id==='speed'||id==='work'?base.distance:rb.dx;lo=Math.min(lo,be);hi=Math.max(hi,be,1);
  if(id==='acceleration'){const bt=-base.v0/base.a;if(bt>0&&bt<base.duration){const xx=base.v0*bt+.5*base.a*bt**2;lo=Math.min(lo,xx);hi=Math.max(hi,xx);}}
  const X=x=>105+650*(x-lo)/(hi-lo||1);line(60,320,845,320,colors.line,3);arrow(75,370,835,370,colors.muted,1);
  for(let i=0;i<=5;i++){const v=lo+(hi-lo)*i/5;line(X(v),362,X(v),378,colors.muted,1);text(P.fmt(v,1),X(v),397,15,colors.muted,'center');}text('位置 / m',835,422,15,colors.muted,'right');
  for(let i=0;i<=12;i++){const q=P.solve(id,p,i*T/12);if(i*T/12<=t)circle(X(q.x),333,4,colors.teal+'70');}
  const x=X(r.x);cart(x,305,id==='force'?p.mass:1);line(X(0),331,X(0),358,colors.blue,2);text('起点',X(0),350,15,colors.blue,'center');
  if(id==='work'){const ang=p.angle*Math.PI/180;arrow(x,244,x+Math.cos(ang)*85,244-Math.sin(ang)*85,colors.amber,4);label(`θ = ${p.angle}°`,x,128,colors.amber);text(`该力累计做功 ${P.fmt(r.liveWork)} J`,450,78,24,colors.teal,'center');}
  else{const v=r.v||0;if(Math.abs(v)>.01)arrow(x,237,x+Math.sign(v)*Math.min(100,30+Math.abs(v)*2),237,colors.teal,4);text(`v(t) = ${P.fmt(v)} m/s`,450,84,28,colors.teal,'center');}
  if(id==='force'){arrow(x,200,x+Math.min(100,p.force),200,colors.amber,4);if(r.friction>0)arrow(x,177,x-Math.min(100,r.friction),177,colors.red,3);text(`推力 ${p.force} N    摩擦 ${P.fmt(r.friction)} N`,450,119,17,colors.muted,'center');}
  if(id==='acceleration')text(`a = ${P.fmt(p.a)} m/s²   ·   v₀ = ${P.fmt(p.v0)} m/s`,450,123,18,colors.muted,'center');
  text(`当前位移 ${P.fmt(r.x)} m`,450,465,17,colors.ink,'center');break;}
 case 'fall':{
  caption(p.drag==='none'?'理想落体 · 两球都从静止释放':'平方阻力 · 两球的 c 相同','到达地面后定格于接触前，不模拟碰撞');
  const scale=260/Math.max(p.height,base.height),top=370-p.height*scale;line(145,370,765,370,colors.line,3);line(145,top,765,top,colors.muted,1,[5,6]);ruler(180,top,370,`${p.height} m`);
  for(const [q,x,mass,title] of [[r.A,330,p.massA,'A'],[r.B,625,p.massB,'B']]){line(x,top,x,370,colors.line,1,[4,6]);const y=top+q.y*scale;ball(x,y-17,17,title==='A'?colors.amber:colors.teal);text(`${title} · ${mass} kg`,x,72,21,title==='A'?colors.amber:colors.teal,'center',600);text(`${P.fmt(q.v)} m/s`,x,411,25,colors.ink,'center');text(q.done?'已到达 · 着地前速度':'当前下落速度',x,442,15,colors.muted,'center');}
  if(p.drag==='none')label('质量不同，理想加速度相同',475,475);else label('阻力相同条件下，质量开始影响结果',475,475,colors.amber);break;}
 case 'jet':{
  caption('同一高度差 · 两条运动路径',p.tank==='fixed'?'水位由外部补液保持':'关闭补液 · 水位随出流下降');
  const maxH=Math.max(p.height,base.height),meter=210/maxH,outY=335,top=outY-p.height*meter,waterY=outY-r.head*meter,col=P.fluids[p.fluid].color;
  // Open tank: no lid and no implied sealed pressure vessel.
  path([[140,90],[140,360],[330,360],[330,90]],colors.line,4);water(143,waterY,184,360-waterY,col);line(140,top,330,top,colors.muted,1,[4,6]);
  for(let i=0;i<5;i++)line(143,waterY+8+i*6,327,waterY+8+i*6,col+'18',1);
  ruler(117,waterY,outY,`${P.fmt(r.head,1)} m`);handle(330,top,'height',.5,20,'y',v=>(outY-v)/meter);
  circle(330,outY,Math.max(4,p.diameter/4),colors.bg,col,2);
  line(352,outY,820,outY,colors.muted,1,[5,6]);text('孔口高度 = 落体终点',530,outY-15,15,colors.muted,'center');
  if(r.speed>.001){const jet=[];for(let dx=0;dx<=360;dx+=3){const yy=outY+p.g*(dx/meter)**2/(2*r.speed*r.speed)*meter;if(yy>445)break;jet.push([333+dx,yy]);}if(jet.length>1){path(jet,col,Math.max(2,p.diameter/3*Math.sqrt(r.Cc)));const length=jet[jet.length-1][0]-333;for(let i=0;i<13;i++){const dx=((i/13+t*r.speed*meter/Math.max(1,length))%1)*length;const yy=outY+p.g*(dx/meter)**2/(2*r.speed*r.speed)*meter;circle(333+dx,yy,2,'#d8f8ef');}}arrow(340,outY-42,420,outY-42,col,3);}
  text(P.fluids[p.fluid].name,235,390,18,col,'center');text(`孔径 ${p.diameter} mm`,235,416,16,colors.muted,'center');text(`Q = ${P.fmt(r.flow,3)} L/s`,235,452,20,col,'center',600);
  const bx=742,ballY=top+r.ball.y*meter;line(bx,top,bx,outY,colors.line,1,[4,5]);line(bx-40,outY+18,bx+40,outY+18,colors.line,3);ball(bx,ballY,17);text('无阻力落体',bx,77,20,colors.amber,'center');text(`${p.mass} kg`,bx,105,16,colors.muted,'center');text(`${P.fmt(r.ball.v)} m/s`,bx,391,22,colors.amber,'center');text(r.ball.done?'着地前速度':'此刻速度，非末速度',bx,420,15,colors.muted,'center');
  label(`射流 ${P.fmt(r.speed)} m/s`,465,237,col);text(`理想末速 √(2gh₀) = ${P.fmt(r.impact)} m/s`,567,470,18,colors.ink,'center');
  if(p.fluid==='mercury')label('水银仅屏幕模拟',232,70,colors.red);if(p.tank==='fixed'&&!compact)text('↑ 水位可拖动',383,top-14,14,colors.teal);break;}
 case 'pressure':{
  caption('静液体 · 同深度压强相同','压力是 N；压强是 Pa。颜色深浅只是示意');
  const x=170,y=112,w=310,h=255,col=P.fluids[p.fluid].color;water(x,y,w,h,col);path([[x,y-28],[x,y+h],[x+w,y+h],[x+w,y-28]],colors.line,4);
  const yy=y+p.depth/20*h;line(x-35,yy,x+w+35,yy,colors.muted,1,[5,5]);handle(x+w,yy,'depth',0,20,'y',v=>(v-y)*20/h);ruler(x-26,y,yy,`${P.fmt(p.depth,1)} m`);
  for(let i=1;i<=5;i++){const ly=y+i*h/6;arrow(x-20-i*9,ly,x-3,ly,col,2);arrow(x+w+20+i*9,ly,x+w+3,ly,col,2);}
  const probeW=30+Math.sqrt(p.area)*3;rect(325-probeW/2,yy-5,probeW,10,colors.amber,null,2);line(325,yy,586,yy,colors.amber,1);
  text('液柱额外压强',638,143,17,colors.muted,'center');text(`${P.fmt(r.gauge)} kPa`,638,186,35,col,'center',600);text('同一深度的小平板',638,259,17,colors.muted,'center');text(`${P.fmt(r.force)} N`,638,300,30,colors.amber,'center');text(`面积 ${p.area} cm²`,638,340,17,colors.muted,'center');
  text(`液面上方 ${P.fmt(p.ambient)} kPa   +   液柱贡献 ${P.fmt(r.gauge)} kPa`,450,414,18,colors.ink,'center');text('绝对压强 = 两者之和；平板净力还要看另一侧压强',450,452,16,colors.muted,'center');break;}
 case 'atmosphere':{
  caption('标准对流层 · 0–9 km','空气粒子密度仅定性示意，不是真实分子尺度');
  const ground=412,scale=325/9000;path([[40,ground],[175,300],[260,365],[490,95],[748,ground]],'#244047',3,true);path([[425,166],[490,95],[554,168],[523,146],[500,167],[477,140],[448,174]],'#c6d4d780',2,true);line(45,ground,850,ground,colors.line,2);
  for(let i=0;i<120;i++){const x=55+(i*67.3)%740,y=95+(i*43.8)%310;if(((i*17)%100)<15+85*(y-95)/310)circle(x+(Math.sin(t+i)*2),y,2,colors.teal+'75');}
  const yy=ground-p.altitude*scale;line(50,yy,825,yy,colors.teal,1,[6,6]);circle(755,yy,8,colors.teal);text(`${p.altitude} m`,750,yy-19,18,colors.teal,'right');
  ruler(842,ground-9000*scale,ground,'9000 m');text(`${P.fmt(r.pressure)} kPa`,250,102,37,colors.teal,'center',600);text(`海平面气压的 ${P.fmt(r.relative,1)}%`,250,144,18,colors.muted,'center');text('头顶空气减少，标准气压降低',450,452,20,colors.ink,'center');break;}
 case 'boiling':{
  caption('给定水温的相平衡判断 · 不是加热仿真','气泡的位置和运动是定性示意');
  const x=150,y=170,w=350,h=205;path([[x,y-55],[x,375],[x+w,375],[x+w,y-55]],colors.line,5);water(x+3,y,w-6,h,colors.teal);line(x-50,245,x,245,colors.line,5);line(x+w,245,x+w+50,245,colors.line,5);
  for(let i=0;i<16;i++){const xx=x+35+((i*57)%280),phase=(t*.26+i*.193)%1;let yy=355-phase*173,rad=(4+(i%4)*2)*(r.bubbleGrows?1+phase:.8*(1-phase));if(r.surfaceBoils&&r.bubbleGrows)circle(xx,yy,rad,null,colors.teal+'c0',2);else if(i<5){yy=340+Math.sin(t+i)*6;circle(xx,yy,3,null,colors.muted+'80',1);}}
  text(`${p.temperature}°C`,325,248,54,colors.ink,'center',600);text(r.surfaceBoils?(r.bubbleGrows?'满足指定气泡增长条件':'表面达沸点；深处小泡仍可能塌缩'):'未到当地表面沸点',325,301,16,r.surfaceBoils?colors.amber:colors.muted,'center');
  const needleY=355-P.clamp((p.temperature-20)/85,0,1)*225;rect(675,113,22,245,'#253b48',colors.line,12);rect(681,needleY,10,355-needleY,colors.amber,null,5);circle(686,372,23,colors.amber);const bpY=355-(r.boil-20)/85*225;line(706,bpY,760,bpY,colors.teal,2);text(`沸点 ${P.fmt(r.boil,1)}°C`,710,bpY-22,19,colors.teal);text(`海拔 ${p.altitude} m`,688,72,21,colors.ink,'center');
  text(`外界 ${P.fmt(r.pressure)} kPa    ↔    饱和蒸气压 ${P.fmt(r.vapor)} kPa`,450,437,19,colors.ink,'center');text('温度高于当地沸点的设定只表示趋势，不是可长期保持的敞口稳态',450,476,14,colors.muted,'center');break;}
 case 'barometer':{
  caption('假设已建立液柱的气压计 · 静力平衡','高度差用同一竖直刻度；管顶密闭，下方连通');
  const poolY=392,meter=23,col=P.fluids[p.fluid].color,tubeX=333,tubeW=84,topY=poolY-r.column*meter;
  water(173,poolY,390,54,col);path([[173,poolY-25],[173,448],[563,448],[563,poolY-25]],colors.line,4);rect(tubeX,57,tubeW,355,null,colors.line,18);water(tubeX+3,topY,tubeW-6,poolY-topY+23,col);line(tubeX+3,topY,tubeX+tubeW-3,topY,col,3);
  text('管顶密闭',tubeX+tubeW/2,31,16,colors.muted,'center');label(`p顶 ${P.fmt(r.topPressure)} kPa`,620,108,colors.amber);line(tubeX+tubeW,100,528,108,colors.amber,1);
  ruler(tubeX-22,topY,poolY,`${P.fmt(r.column,3)} m`);arrow(233,362,233,390,colors.teal,4);arrow(498,362,498,390,colors.teal,4);text('大气压在液池表面向下推',675,370,17,colors.teal,'center');
  text(`${P.fmt(r.column,3)} m`,655,217,45,col,'center',600);text('液柱可维持的竖直高度差',655,260,17,colors.muted,'center');text(P.fluids[p.fluid].name,370,475,19,col,'center');if(p.fluid==='mercury')text('仅模拟 · 不接触水银',670,450,18,colors.red,'center');break;}
 case 'buoyancy':{
  caption('静液体 · 密度比较与平衡趋势','不计算真实下沉时间，漂浮深度来自静力平衡');
  const col=P.fluids[p.fluid].color,x=200,y=177,w=430,h=236;water(x,y,w,h,col);path([[x,y-55],[x,y+h],[x+w,y+h],[x+w,y-55]],colors.line,4);
  const size=50+Math.cbrt(p.volume)*24,cy=r.floating?y-size/2+size*r.fraction:r.neutral?y+110:374-size/2;rect(412-size/2,cy-size/2,size,size,colors.amber+'c9',colors.amber,6);text(`${p.mass} kg`,412,cy,19,colors.bg,'center',600);
  const bForce=r.floating?r.weight:r.maxBuoyancy;arrow(412-size/2-35,cy+37,412-size/2-35,cy-38,colors.teal,4);arrow(412+size/2+35,cy-30,412+size/2+35,cy+30+(r.weight>bForce?28:0),colors.amber,4);text('浮力 ↑',245,88,18,colors.teal);text('重力 ↓',558,88,18,colors.amber);
  label(r.floating?'可漂浮':r.neutral?'中性浮力 · 可悬浮':'无法自由漂浮 · 下沉趋势',415,453,r.floating?colors.teal:colors.amber);text(`ρ物 ${P.fmt(r.density,0)}`,742,214,20,colors.ink,'center');text(`ρ液 ${P.fluids[p.fluid].rho}`,742,254,20,col,'center');text('kg/m³',742,292,15,colors.muted,'center');break;}
 case 'lever':{
  caption('水平杠杆的静力分析','箭头表示转动趋势，不是运动积分后的倾角');
  const meter=95,fulcrum=450,Y=257,xL=fulcrum-p.armLeft*meter,xR=fulcrum+p.armRight*meter;path([[422,323],[450,270],[478,323]],'#466068',3,true);line(140,Y,760,Y,colors.teal,11);circle(fulcrum,Y,8,colors.bg,colors.teal,2);
  for(const [x,mass,col] of [[xL,p.massLeft,colors.amber],[xR,p.massRight,colors.blue]]){line(x,180,x,Y,col,2);rect(x-34,145,68,42,col,null,5);text(`${mass} kg`,x,166,17,colors.bg,'center',600);arrow(x,283,x,335,col,3);}
  handle(xL,Y,'armLeft',.2,3,'x',x=>(fulcrum-x)/meter);handle(xR,Y,'armRight',.2,3,'x',x=>(x-fulcrum)/meter);line(xL,370,fulcrum,370,colors.amber,2);line(fulcrum,370,xR,370,colors.blue,2);text(`${p.armLeft} m`,(xL+fulcrum)/2,394,18,colors.amber,'center');text(`${p.armRight} m`,(xR+fulcrum)/2,394,18,colors.blue,'center');
  text(r.balance?'两侧平衡':r.netTorque<0?'左侧更想向下转':'右侧更想向下转',450,84,29,r.balance?colors.teal:colors.amber,'center',600);text(`左 ${P.fmt(r.torqueLeft)} N·m     |     右 ${P.fmt(r.torqueRight)} N·m`,450,117,18,colors.muted,'center');text('左右力臂圆点可拖动 · 杆自重忽略',450,463,16,colors.muted,'center');break;}
 case 'pulley':{
  caption('慢速匀速提升 · 轻绳与几何约束','不是数滑轮个数，而是数支承移动组件的绳段');
  const n=r.n,unit=Math.min(45,120/(n*Math.max(p.height,base.height))),dy=r.rise*unit,lower=275-dy;
  line(105,73,785,73,colors.line,8);for(let x=108;x<780;x+=22)line(x,73,x+13,56,colors.line,2);
  const wheel=(x,y,rad=28)=>{circle(x,y,rad,'#253d4b',colors.muted,3);circle(x,y,5,colors.teal);for(let i=0;i<4;i++){const a=t*.3+i*Math.PI/2;line(x+8*Math.cos(a),y+8*Math.sin(a),x+22*Math.cos(a),y+22*Math.sin(a),colors.line,2);}};
  const rope=points=>path(points,colors.amber,4);
  if(n===1){const x=350,cy=137;line(x,73,x,cy-28,colors.muted,3);wheel(x,cy);rope([[x-28,lower],[x-28,cy],[x-20,cy-21],[x,cy-28],[x+20,cy-21],[x+28,cy],[x+28,220+dy]]);rect(x-55,lower,55,50,colors.teal,null,5);text(`${p.mass} kg`,x-27,lower+25,17,colors.bg,'center');arrow(x+28,220+dy,x+28,260+dy,colors.amber);text('向下拉',x+55,250+dy,17,colors.amber);text('①',x-56,(lower+cy)/2,20,colors.teal);}
  if(n===2){const x=370;line(x-28,73,x-28,82,colors.amber,4);wheel(x,lower);const free=145-2*dy;rope([[x-28,73],[x-28,lower],[x-20,lower+21],[x,lower+28],[x+20,lower+21],[x+28,lower],[x+28,free]]);line(x,lower+28,x,lower+47,colors.muted,3);rect(x-35,lower+47,70,44,colors.teal,null,5);text(`${p.mass} kg`,x,lower+69,17,colors.bg,'center');arrow(x+28,free+20,x+28,free-12,colors.amber);text('向上拉',x+55,free+10,17,colors.amber);text('①',x-53,190,20,colors.teal);text('②',x+52,220,20,colors.teal);}
  if(n===4){const a=295,b=407,top=132;wheel(a,lower);wheel(b,lower);wheel(351,top);wheel(463,top);line(351,73,351,top-28,colors.muted,3);line(463,73,463,top-28,colors.muted,3);
   rope([[a-28,73],[a-28,lower],[a-20,lower+21],[a,lower+28],[a+20,lower+21],[a+28,lower],[323,top],[331,top-21],[351,top-28],[371,top-21],[379,top],[b-28,lower],[b-20,lower+21],[b,lower+28],[b+20,lower+21],[b+28,lower],[435,top],[443,top-21],[463,top-28],[483,top-21],[491,top],[491,230+4*dy]]);
   line(a,lower,a,lower+56,colors.muted,2);line(b,lower,b,lower+56,colors.muted,2);line(a,lower+56,b,lower+56,colors.muted,5);rect(312,lower+56,80,45,colors.teal,null,5);text(`${p.mass} kg`,352,lower+79,17,colors.bg,'center');arrow(491,230+4*dy,491,267+4*dy,colors.amber);text('向下拉',558,247+4*dy,17,colors.amber);[267,323,379,435].forEach((x,i)=>text(String(i+1),x-15,210,19,colors.teal));
  }
  label(`${n} 段绳承重`,730,141);text(`F拉 = ${P.fmt(r.pull)} N`,730,199,23,colors.amber,'center');text(`上升 ${P.fmt(r.rise)} m`,730,252,18,colors.teal,'center');text(`拉绳 ${P.fmt(r.ropeTravel)} m`,730,286,18,colors.amber,'center');
  text(`输入 ${P.fmt(r.inputWork)} J = 有用 ${P.fmt(r.usefulWork)} J + 损耗 ${P.fmt(r.loss)} J`,450,454,19,colors.ink,'center');break;}
 case 'spring':{
  caption('理想水平弹簧 · 无摩擦','弹性势能 ↔ 动能；画面尺寸为教学比例');
  const origin=505,meter=350,x=origin+r.x*meter;line(128,122,128,324,colors.line,10);line(125,317,801,317,colors.line,3);line(origin,124,origin,350,colors.muted,1,[4,6]);text('平衡位置 x = 0',origin,106,16,colors.muted,'center');
  const pts=[[130,250],[155,250]],len=x-35-155;for(let i=0;i<=18;i++)pts.push([155+len*i/18,250+(i===0||i===18?0:i%2?20:-20)]);pts.push([x-35,250]);path(pts,colors.teal,3);rect(x-35,219,70,78,colors.amber,null,8);text(`${p.mass} kg`,x,256,17,colors.bg,'center');if(Math.abs(r.force)>.01)arrow(x,177,x+P.clamp(r.force*8,-100,100),177,colors.teal,4);
  text(`x = ${P.fmt(r.x,3)} m`,730,127,22,colors.ink,'center');text(`F = ${P.fmt(r.force)} N`,730,164,22,colors.teal,'center');bar('弹性势能',r.elastic,r.energy,240,390,colors.teal);bar('动能',r.kinetic,r.energy,240,430,colors.amber);text(`总机械能 ${P.fmt(r.energy,3)} J · 保持不变`,450,474,17,colors.muted,'center');break;}
 case 'pendulum':{
  caption('小角度单摆 · 1–10° · 无阻尼','角度、周期与能量均采用线性小角度模型');
  const px=380,py=93,len=80+p.length*65,bx=px+len*Math.sin(r.theta),by=py+len*Math.cos(r.theta);line(px-100,py,px+100,py,colors.line,8);line(px,py,px,py+len+40,colors.muted,1,[4,6]);line(px,py,bx,by,colors.teal,3);ball(bx,by,17);circle(px,py,6,colors.muted);ruler(196,py,py+len,`${p.length} m`);
  ctx.beginPath();ctx.arc(px,py,len,-Math.PI/2+Math.PI-.2,-Math.PI/2+Math.PI+.2);ctx.strokeStyle=colors.line;ctx.lineWidth=1;ctx.stroke();
  text(`T ≈ ${P.fmt(r.period)} s`,666,163,32,colors.teal,'center');text(`摆锤 ${p.mass} kg`,666,215,19,colors.muted,'center');text(`当前角度 ${P.fmt(r.theta*180/Math.PI,1)}°`,666,254,18,colors.ink,'center');bar('近似势能',r.potential,r.energy,240,390,colors.teal);bar('动能',r.kinetic,r.energy,240,431,colors.amber);text('质量不影响此模型的周期，摆长与 g 会影响',450,474,17,colors.muted,'center');break;}
 case 'circuit':{
  caption('理想直流 · 约定电流方向','亮点只表示电流方向，不表示电子真实速度');
  const col=p.closed==='yes'?colors.teal:colors.line;line(150,143,150,218,colors.line,3);line(130,218,170,218,colors.amber,4);line(139,232,161,232,colors.amber,4);line(150,232,150,358,colors.line,3);text('+',182,214,20,colors.amber);text('−',182,236,20,colors.amber);text(`${p.voltage} V`,99,228,24,colors.amber,'center');
  line(150,143,266,143,col,3);circle(270,143,4,col);circle(321,143,4,col);line(270,143,321,p.closed==='yes'?143:112,col,3);line(325,143,748,143,col,3);line(150,358,748,358,col,3);text(p.closed==='yes'?'闭合':'断开',295,90,17,colors.muted,'center');
  function resistor(x,y,R,labelText){rect(x-25,y-45,50,90,colors.bg,colors.amber,3);text(`${labelText}`,x+48,y-13,17,colors.ink);text(`${R} Ω`,x+48,y+17,18,colors.amber);}
  if(p.connection==='series'){line(748,143,748,358,col,3); // Two components lie on the single series path.
   line(748,143,748,164,col,3);line(748,254,748,268,col,3);line(748,342,748,358,col,3);
   rect(710,157,76,55,colors.bg,colors.amber,3);text(`R₁ ${p.r1}Ω`,748,184,15,colors.amber,'center');rect(710,283,76,55,colors.bg,colors.amber,3);text(`R₂ ${p.r2}Ω`,748,310,15,colors.amber,'center');
  }else{for(const [x,R,name] of [[465,p.r1,'R₁'],[690,p.r2,'R₂']]){line(x,143,x,205,col,3);line(x,295,x,358,col,3);resistor(x,250,R,name);}line(748,143,748,143,col);}
  if(r.current>0){const paths=p.connection==='series'?[[[150,143],[748,143],[748,358],[150,358],[150,143]]]:[[[150,143],[465,143],[465,358],[150,358],[150,143]],[[150,143],[690,143],[690,358],[150,358],[150,143]]];
   for(const points of paths){const segments=points.slice(1).map((q,i)=>({a:points[i],b:q,len:Math.hypot(q[0]-points[i][0],q[1]-points[i][1])})),total=segments.reduce((a,b)=>a+b.len,0);for(let i=0;i<11;i++){let dist=((t*.1+i/11)%1)*total;for(const e of segments){if(dist<=e.len){circle(e.a[0]+(e.b[0]-e.a[0])*dist/e.len,e.a[1]+(e.b[1]-e.a[1])*dist/e.len,3,colors.teal);break;}dist-=e.len;}}}
  }
  text(`I总 = ${P.fmt(r.current,3)} A`,440,413,26,colors.teal,'center');text(`已累计 E = ${P.fmt(r.liveEnergy)} J`,440,452,20,colors.ink,'center');break;}
 }
 ctx.setTransform(1,0,0,1,0,0);
 return {handles,scale:s,offsetX:ox,offsetY:oy,width:cw,height:ch};
}
function graph(canvas,data,xlabel,ylabel,point){const dpr=Math.min(devicePixelRatio||1,2),b=canvas.getBoundingClientRect(),w=Math.max(300,b.width),h=Math.max(240,b.height);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);const c=canvas.getContext('2d');c.scale(dpr,dpr);c.fillStyle='#fbfcf9';c.fillRect(0,0,w,h);const left=77,top=25,right=w-25,bottom=h-53;let xmin=data[0].x,xmax=data.at(-1).x,ymin=Math.min(0,...data.map(p=>p.y)),ymax=Math.max(...data.map(p=>p.y));if(ymax-ymin<1e-9){ymax=ymin+1;ymin=Math.min(0,ymin);}const X=x=>left+(x-xmin)/(xmax-xmin)*(right-left),Y=y=>bottom-(y-ymin)/(ymax-ymin)*(bottom-top);c.font='12px "Microsoft YaHei",sans-serif';c.textBaseline='middle';for(let i=0;i<=4;i++){const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;c.strokeStyle='#e0e7e2';c.beginPath();c.moveTo(left,Y(y));c.lineTo(right,Y(y));c.stroke();c.fillStyle='#62756c';c.textAlign='right';c.fillText(P.fmt(y,Math.abs(ymax)>100?0:2),left-9,Y(y));c.textAlign='center';c.fillText(P.fmt(x,Math.abs(xmax)>100?0:1),X(x),bottom+18);}c.beginPath();data.forEach((p,i)=>{if(i)c.lineTo(X(p.x),Y(p.y));else c.moveTo(X(p.x),Y(p.y));});c.strokeStyle='#297e6c';c.lineWidth=3;c.stroke();if(point){c.beginPath();c.arc(X(point.x),Y(point.y),5,0,Math.PI*2);c.fillStyle='#cc7d3b';c.fill();}c.font='13px "Microsoft YaHei",sans-serif';c.fillStyle='#334f43';c.textAlign='center';c.fillText(xlabel,(left+right)/2,h-13);c.save();c.translate(16,(top+bottom)/2);c.rotate(-Math.PI/2);c.fillText(ylabel,0,0);c.restore();}
root.LabScene={draw,graph,colors};
})(globalThis);
