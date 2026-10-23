/* One numerical state drives diagram, quantitative screen, timers and experiment readings. */
(function(){'use strict';const M=Museum,O=OpticsModel,D=LabDraw,P=D.colors,TAU=Math.PI*2;let redraw=()=>{},values,lesson,records=[];
 const $=s=>document.querySelector(s);
 const color=lambda=>lambda<490?'#79b4ff':lambda<560?'#89e29a':lambda<610?'#ffe19a':'#ffa08c';
 function coordinate(y,v){return 300-y/v.screenRange*170;}
 function screenProbe(v,y){const p=M.lessons[0].controls.find(p=>p.id==='probe');p.min=-v.screenRange;p.max=v.screenRange;return Math.max(p.min,Math.min(p.max,y));}
 function interference(c,v,t){D.clear(c);const ink=color(v.wavelength),state=O.doubleSlit(v,v.probe),range=v.screenRange;
  D.text(c,'波面慢放示意',255,42,22,P.ink);D.text(c,'屏幕明暗',570,42,22,P.ink);D.text(c,'归一化强度 I/I₀',790,42,20,P.ink);
  const sy1=260-35,sy2=260+35,sx=205,waveGap=28*v.wavelength/550;
  D.box(c,36,118,418,340,'#102333','#263f53',10);
  c.save();c.beginPath();c.rect(38,120,414,336);c.clip();
  for(let i=0;i<Math.ceil(160/waveGap);i++){const x=40+((i*waveGap+t*waveGap*8)%160);D.line(c,[[x,145],[x,427]],ink+'88',1.5);}
  for(const [i,sy]of [sy1,sy2].entries()){
   if(v.mode==='single'&&i===1)continue;
   for(let n=0;n<Math.ceil(340/waveGap);n++){const r=((n*waveGap+t*waveGap*8+(v.mode==='incoherent'&&i?40*Math.sin(t*21):0))%340+340)%340;c.beginPath();c.ellipse(sx,sy,r,r,0,-Math.PI/2,Math.PI/2);c.strokeStyle=ink+'72';c.lineWidth=1.5;c.stroke();}
  }
  c.fillStyle='#7290a2';c.fillRect(sx-4,130,8,310);c.fillStyle='#0c1726';c.fillRect(sx-5,sy1-10,10,20);if(v.mode!=='single')c.fillRect(sx-5,sy2-10,10,20);
  const selectedY=coordinate(v.probe,v);D.line(c,[[sx+3,sy1],[451,selectedY]],'#ffd18b88',1.2);if(v.mode!=='single')D.line(c,[[sx+3,sy2],[451,selectedY]],'#80d9d188',1.2);
  c.restore();D.text(c,'入射平面波',100,477,15,P.muted);D.text(c,'缝屏',205,477,15,P.muted);D.text(c,'两列波相遇',344,477,15,P.muted);
  D.box(c,513,125,112,350,'#070e16','#3d5668',0);
  const rgb=ink.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16));
  for(let py=130;py<=470;py++){const y=(300-py)/170*range,r=O.doubleSlit(v,y),light=Math.sqrt(r.intensity);c.fillStyle=`rgb(${rgb.map(n=>Math.round(8+light*(n-8))).join(',')})`;c.fillRect(520,py,98,1.3);}
  for(let i=-2;i<=2;i++){const y=i*range/2,py=coordinate(y,v);D.line(c,[[628,py],[640,py]],P.muted,1);D.text(c,(y>0?'+':'')+y.toFixed(1),645,py,13,P.muted,'left');D.line(c,[[705,py],[905,py]],'#2b4154',1);}
  D.text(c,'y / mm',652,100,14,P.muted);D.line(c,[[705,130],[705,470],[905,470]],P.muted,1);
  const curve=[],envelope=[];for(let py=130;py<=470;py++){const y=(300-py)/170*range,s=O.doubleSlit(v,y);curve.push([705+s.intensity*192,py]);envelope.push([705+s.envelope*192,py]);}D.line(c,envelope,'#c1cad877',1);D.line(c,curve,ink,2);
  D.text(c,'0',705,492,14,P.muted);D.text(c,'0.5',801,492,14,P.muted);D.text(c,'1',897,492,14,P.muted);
  const py=coordinate(v.probe,v);c.save();c.setLineDash([5,4]);D.line(c,[[505,py],[910,py]],P.gold,1.5);c.restore();D.circle(c,705+state.intensity*192,py,4,P.gold);
  D.text(c,'Δy ≈ λL/d = '+state.fringeMillimeters.toFixed(3)+' mm',480,535,22,P.teal);
  D.text(c,'左侧不共用物理长度比例；右侧按毫米定位，平均条纹不随播放乱跳。',480,577,16,P.muted);
  $('#probe-explanation').textContent=`探针 y=${v.probe.toFixed(2)} mm；光程差 ${Math.abs(state.delta*1e9).toFixed(1)} nm；相位差 ${(state.phase/Math.PI).toFixed(3)}π；归一化强度 ${state.intensity.toFixed(4)}。`;
  $('#far-field').textContent=state.farFieldNumber>.1?'⚠ 该组合的远场近似较弱；当前依然绘制远场公式，不假装给出近场精确结果。':'远场近似指标较小；仍不包含现实装置误差。';
  return{metrics:[['近轴条纹间距',state.fringeMillimeters.toFixed(3)+' mm'],['探针光强 I/I₀',state.intensity.toFixed(4)],['光程差',Math.abs(state.delta*1e9).toFixed(1)+' nm']],clock:'波面示意 '+Math.round(t*100)+'%',hint:'右图强度曲线与屏幕条纹共用一个模型；细灰线是单缝衍射包络。切换单缝时，各模式单独归一化。'};
 }
 function fizeau(c,v,t){const s=O.fizeau(v,t),pitch=110,shift=s.pitchShift*t*pitch,zoom=(pitch/(TAU*92/s.teeth));D.clear(c);
  D.text(c,'光程 2L：出去，再回来',480,38,24,P.ink);
  D.line(c,[[105,125],[860,125],[860,188],[315,188]],'#56788d',2);D.arrow(c,350,115,520,115,P.gold);D.arrow(c,720,201,550,201,P.teal);
  D.box(c,73,108,36,34,'#ffd18b',null,5);D.line(c,[[315,93],[315,218]],'#8197a6',6);D.line(c,[[860,96],[860,217]],'#c4dae5',9);
  D.text(c,'光源',92,163,15,P.gold);D.text(c,'轮缘位置',315,237,16,P.muted);D.text(c,'远镜',861,242,16,P.muted);D.text(c,'单程 '+v.length.toFixed(3)+' km',580,88,18,P.ink);
  const px=t<=.5?315+(860-315)*t*2:860-(860-315)*(t-.5)*2,py=t<=.5?125:188;
  D.circle(c,px,py,6,t<=.5?P.gold:P.teal);
  if(t===1)D.text(c,s.pulseBlocked?'回程中心光线被齿挡住':'回程中心光线穿过齿缝',580,237,20,s.pulseBlocked?P.red:P.teal);
  const cx=160,cy=385,r=92;
  c.save();c.translate(cx,cy);c.rotate(s.angle);c.beginPath();for(let i=0;i<s.teeth;i++){const a=i*TAU/s.teeth;for(const [f,rr]of [[0,r],[.5,r],[.5,r-8],[1,r-8]]){const phi=a+f*TAU/s.teeth,x=Math.cos(phi)*rr,y=Math.sin(phi)*rr;if(i===0&&f===0)c.moveTo(x,y);else c.lineTo(x,y);}}c.closePath();c.fillStyle='#b5c6d1';c.fill();c.restore();D.circle(c,cx,cy,58,'#132838','#3b5b70');D.circle(c,cx,cy,9,P.gold);
  D.text(c,s.teeth+' 齿 + '+s.teeth+' 缝',160,510,15,P.muted);D.text(c,'实际转过 '+s.angleDegrees.toFixed(4)+'°',160,544,16,P.teal);
  D.text(c,'轮缘放大：一格＝一个齿距',618,292,20,P.ink);D.box(c,370,318,535,115,'#0b1424','#527083',4);
  c.save();c.beginPath();c.rect(371,319,533,113);c.clip();
  // Initial gap centre lies on x=638; every tooth spans half a pitch.
  for(let j=-8;j<=8;j++){const x=638+j*pitch+pitch*.25+shift;c.fillStyle='#b9cad3';c.fillRect(x,320,pitch*.5,110);}
  const phaseNow=((s.pitchShift*t%1)+1)%1,blockedNow=phaseNow>.25&&phaseNow<.75;
  D.line(c,[[638,300],[638,blockedNow?337:450]],t<.5?P.gold:P.teal,4);c.restore();D.arrow(c,410,452,505,452,P.muted);D.text(c,'轮缘移动方向',570,454,14,P.muted);
  const width=130;D.box(c,730,476,width,42,'#122334','#638499',4);c.fillStyle=`rgba(255,224,156,${s.transmission})`;c.fillRect(735,481,width-10,32);D.text(c,'连续光束平均亮度',795,544,15,P.muted);D.text(c,(s.transmission*100).toFixed(1)+'%',795,568,21,P.gold);
  D.text(c,'已走 '+(s.elapsed*1e6).toFixed(2)+' μs',390,495,21,P.teal,'left');D.text(c,'总往返 '+(s.roundTrip*1e6).toFixed(2)+' μs',390,531,16,P.muted,'left');D.text(c,'齿距局部放大约 '+zoom.toFixed(0)+'×',390,566,14,P.muted,'left');
  $('#wheel-equation').textContent=`τ = 2L/c = ${(s.roundTrip*1e6).toFixed(3)} μs；理论第一暗点 f₁=${s.firstDark.toFixed(5)} 转/秒。此刻一次往返转过 ${s.pitchShift.toFixed(3)} 个齿距。`;
  $('#wheel-measurement').textContent=s.firstMinimum?`接近理论首消光。把当前转速代入 c=4LNf，得到 ${(s.inferredC/1000).toFixed(1)} km/s。这是模型内反算，不是独立实测。`:'尚未到第一消光点。不能把任意转速代入 c=4LNf 就冒充测得光速。';
  return{metrics:[['往返光行时',(s.roundTrip*1e6).toFixed(3)+' μs'],['回光平均亮度',(s.transmission*100).toFixed(2)+'%'],['归一化转速 f/f₁',(s.f/s.firstDark).toFixed(3)]],clock:(s.elapsed*1e6).toFixed(2)+' / '+(s.roundTrip*1e6).toFixed(2)+' μs',hint:'整轮与局部齿缝共用相同角度；局部放大只为看清微小转角，不改变计算。第一个暗点才满足 c=4LNf。'};
 }
 function record(){if(!values)return;const s=O.fizeau(values,1),r={L:values.length,N:Number(values.teeth),f:values.frequency,brightness:s.transmission,c:s.firstMinimum?s.inferredC:null};records.push(r);const row=document.createElement('tr');for(const value of [r.L.toFixed(3)+' km',r.N,r.f.toFixed(5)+' r/s',(r.brightness*100).toFixed(2)+'%',r.c?(r.c/1000).toFixed(1)+' km/s':'非第一暗点，不反算']){const td=document.createElement('td');td.textContent=value;row.append(td);}$('#wheel-records').append(row);}
 M.mount=({lesson:l,values:v,custom,redraw:draw})=>{lesson=l;values=v;redraw=draw;
  if(l.id==='interference'){
   custom.innerHTML='<section class="card"><h2>从画面走到数值</h2><p id="probe-explanation" role="status"></p><p id="far-field" class="notice"></p><div class="phase-strip"><button id="double-distance">把缝距变为 0.50 mm</button><button id="single-slit">堵住一条缝</button><button id="restore-double">恢复双缝</button></div></section>';
   $('#double-distance').onclick=()=>LabTest.set('separation',.5);$('#single-slit').onclick=()=>LabTest.set('mode','single');$('#restore-double').onclick=()=>LabTest.set('mode','double');
   const canvas=$('#canvas'),click=e=>{const box=canvas.getBoundingClientRect(),x=(e.clientX-box.left)*960/box.width,y=(e.clientY-box.top)*600/box.height;if(x<510||y<130||y>470)return;LabTest.set('probe',screenProbe(values,(300-y)/170*values.screenRange));};canvas.addEventListener('click',click);const update=v=>{v.probe=screenProbe(v,v.probe);const el=$('#p-probe');if(el){el.min=-v.screenRange;el.max=v.screenRange;el.value=v.probe;}const out=$('[data-output="probe"]');if(out)out.textContent=Number(v.probe.toFixed(2))+' mm';};update(v);return{update,dispose:()=>canvas.removeEventListener('click',click)};
  }
  custom.innerHTML='<section class="card"><h2>找第一次变暗，不是随便套公式</h2><p id="wheel-equation"></p><p id="wheel-measurement" role="status"></p><div class="phase-strip"><button id="wheel-zero">停轮：0 转/秒</button><button id="wheel-dark">定位理论第一暗点</button><button id="wheel-bright">定位下一次亮点</button><button id="wheel-record">记录当前读数</button></div><div class="table-scroll"><table class="experiment-table"><thead><tr><th>单程距离 L</th><th>齿数 N</th><th>转速 f</th><th>回光亮度</th><th>首消光反算</th></tr></thead><tbody id="wheel-records"></tbody></table></div><p class="tiny">本表是本次页面内实验记录；重要发现请保存到观察手记并导出。</p></section>';
  $('#wheel-zero').onclick=()=>LabTest.set('frequency',0);$('#wheel-dark').onclick=()=>LabTest.set('frequency',O.fizeau(values).firstDark);$('#wheel-bright').onclick=()=>LabTest.set('frequency',2*O.fizeau(values).firstDark);$('#wheel-record').onclick=record;records=[];return null;
 };
 M.render=({ctx,lesson:l,values:v,time})=>{values=v;return l.id==='interference'?interference(ctx,v,time):fizeau(ctx,v,time);};
})();
