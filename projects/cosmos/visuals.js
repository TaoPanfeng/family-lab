/* Original visualizations. Different spatial definitions use distinct geometries and legends. */
(function(){'use strict';const D=LabDraw,P=D.colors,Q=CosmosProcess;let cache=new Map();
 function sun(c,x,y,r){const glow=c.createRadialGradient(x,y,r*.2,x,y,r*1.6);glow.addColorStop(0,'#ffe8a6');glow.addColorStop(.65,'#ffbc58');glow.addColorStop(1,'#ffbc5800');c.fillStyle=glow;c.beginPath();c.arc(x,y,r*1.6,0,Math.PI*2);c.fill();D.circle(c,x,y,r,'#ffd084');for(let i=0;i<13;i++){const a=i*Math.PI*2/13;D.line(c,[[x+Math.cos(a)*r*.9,y+Math.sin(a)*r*.9],[x+Math.cos(a)*r*1.12,y+Math.sin(a)*r*1.12]],'#ffe5a5',2);}}
 function earth(c,x,y,r){const shade=c.createRadialGradient(x-r*.3,y-r*.4,2,x,y,r);shade.addColorStop(0,'#66b6dc');shade.addColorStop(1,'#14567c');D.circle(c,x,y,r,shade,'#8ed6e7');c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip();c.translate(x,y);c.scale(r/55,r/55);c.fillStyle='#65a98b';c.beginPath();c.moveTo(-42,-28);c.bezierCurveTo(-20,-58,-8,-22,0,-20);c.lineTo(-5,0);c.lineTo(-21,8);c.lineTo(-17,35);c.lineTo(-30,19);c.closePath();c.fill();c.beginPath();c.moveTo(10,-45);c.lineTo(40,-25);c.lineTo(20,-3);c.lineTo(43,24);c.lineTo(25,35);c.lineTo(0,10);c.closePath();c.fill();c.restore();}
 function light(c,v,t){const s=Q.light(v.destination,t);D.clear(c);D.text(c,'发出光 ≠ 已经看见光',480,48,28,P.ink);D.text(c,v.timeMode==='real'?'真实秒表（1×）：计时与播放倍速联动':'演示加速：20秒走完所选光程，数字仍按真实距离计算',480,91,17,P.muted);
  const start=195,end=772,x=start+(end-start)*t,y=265;if(v.destination==='moon'){earth(c,110,y,50);D.circle(c,850,y,30,'#b9bcc2','#e2e4e5');for(const [a,b,r]of [[-12,4,5],[5,-9,4],[11,12,7]])D.circle(c,850+a,y+b,r,'#9197a0');}else{sun(c,110,y,44);if(v.destination==='sun')earth(c,850,y,40);else sun(c,850,y,28);}
  D.line(c,[[start,y],[end,y]],'#3f6078',2);D.line(c,[[start,y],[x,y]],P.gold,4);
  for(let i=0;i<=4;i++){const px=start+(end-start)*i/4;D.line(c,[[px,319],[px,329]],P.muted,1);D.text(c,(i*25)+'%',px,350,14,P.muted);}
  c.save();c.strokeStyle='#ffdf9c';c.lineWidth=1.5;for(const dx of [-10,0,10]){c.beginPath();c.ellipse(x+dx,y,8,29,0,-Math.PI/2,Math.PI/2);c.stroke();}c.restore();D.circle(c,x,y,5,'#fff5cf');
  D.text(c,s.from,110,350,22,P.ink);D.text(c,s.to,850,350,22,P.ink);
  if(s.arrived){D.circle(c,850,y,62,null,P.teal);D.text(c,'接收端现在收到这束光',480,174,22,P.teal);}else D.text(c,t===0?'准备出发':'光已走过 '+(t*100).toFixed(1)+'% 的距离',480,174,21,P.gold);
  D.box(c,60,400,405,106,'#14283a','#385570',10);D.box(c,495,400,405,106,'#14283a','#385570',10);
  D.text(c,'已走时间',90,428,16,P.muted,'left');D.text(c,Q.format(s.elapsed),90,473,31,P.teal,'left');D.text(c,'还需时间',525,428,16,P.muted,'left');D.text(c,Q.format(s.remaining),525,473,31,P.gold,'left');
  D.text(c,'总光行时 '+Q.format(s.total)+'　　真空光速 299,792.458 km/s',480,553,17,P.muted);
  return{metrics:[['已经传播',Q.format(s.elapsed)],['尚需等待',Q.format(s.remaining)],['总光程',s.km.toLocaleString(undefined,{maximumFractionDigits:0})+' km']],clock:Q.format(s.elapsed)+' / '+Q.format(s.total),hint:'发射端与接收端大小为示意；时间与距离按同一进度计算。总需时间是常数，已走时间必须变化。'};
 }
 function scale2D(c,i,t){D.clear(c);const level=CosmosData.scales[i],angle=t*Math.PI*2;
  if(i===0)earth(c,480,300,160);
  else if(i===1){earth(c,160,300,65);D.circle(c,800,300,18,'#c7c7c7');D.line(c,[[240,300],[750,300]],'#6d8b9a',1);D.text(c,'地月平均距离',480,336,20,P.muted);}
  else if(i===2){sun(c,480,300,18);CosmosData.planets.forEach((p,j)=>{const r=47+j*29,a=j*.65+angle;D.ellipse(c,480,300,r,r*.7,null,'#314d65');D.circle(c,480+r*Math.cos(a),300+r*.7*Math.sin(a),4+(j===4?4:0),p.color);});}
  else if(i===5){for(const [x,y,r]of [[310,270,65],[665,320,88],[590,430,32]]){c.save();c.translate(x,y);c.rotate(.3+angle*.1);for(let j=0;j<8&&r-j*5>0;j++)D.ellipse(c,0,0,r-j*5,(r-j*5)*.32,null,j%2?P.muted:P.blue);c.restore();}D.text(c,'银河系',300,370,18,P.gold);D.text(c,'仙女座星系',690,435,18,P.blue);}
  else{
   if(!cache.has(i))cache.set(i,Q.morphology(i));const data=cache.get(i),project=p=>{const x=p[0]*Math.cos(angle)+p[2]*Math.sin(angle),z=-p[0]*Math.sin(angle)+p[2]*Math.cos(angle);return[480+x*80,300-(p[1]*.9+z*.27)*80,z];};
   if(i===8){D.circle(c,480,300,235,null,'#7284b0');D.ellipse(c,480,300,235,85,null,'#405476');D.ellipse(c,480,300,108,235,null,'#405476');}
   for(const line of data.lines){D.line(c,line.map(p=>project(p).slice(0,2)),i===7?'#bfa36a55':'#6f9fd83b',1);}
   for(const dot of data.points){const p=project(dot.p);D.circle(c,p[0],p[1],i===8?.8:1.1,i===7?'#e4c18d99':'#9bc3e1b0');}
   for(const marker of data.markers){const p=project(marker.p);D.circle(c,p[0],p[1],5,P.gold,'#fff');D.text(c,marker.name,p[0],p[1]+22,15,P.gold);}
  }
  D.text(c,level.name,480,42,28,P.ink);D.text(c,level.size,480,550,23,P.teal);
  D.text(c,i===7?'一个速度流域：暖色流线汇向共同区域':i===8?'许多超星系结构与空洞：球面表示观测范围':'当前为二维投影视图，结构并非观测星表',480,584,16,P.muted);
 }
 function threeMorphology(group,i){const data=Q.morphology(i),positions=[],colors=[];for(const dot of data.points){positions.push(...dot.p);colors.push(...dot.color);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));group.add(new THREE.Points(geo,new THREE.PointsMaterial({size:i===8?.018:.024,vertexColors:true,transparent:true,opacity:.9})));
  for(const path of data.lines){const line=Lab3D.line(path,i===7?0xe4ba75:0x5c85bb);line.material.opacity=i===7?.35:.16;group.add(line);}
  for(const m of data.markers){const marker=new THREE.Mesh(new THREE.SphereGeometry(.055,14,10),new THREE.MeshBasicMaterial({color:m.color}));marker.position.set(...m.p);group.add(marker);}
  if(i===8){const sphere=new THREE.Mesh(new THREE.SphereGeometry(2.85,28,16),new THREE.MeshBasicMaterial({color:0x788db9,wireframe:true,transparent:true,opacity:.13}));group.add(sphere);}
 }
 window.CosmosVisuals={light,scale2D,threeMorphology};
})();
