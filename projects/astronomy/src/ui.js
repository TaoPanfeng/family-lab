/* Application controller. No CDN, account, telemetry, network request or API key.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  const A=root.Astro,E=root.Events,$=id=>document.getElementById(id),DAY=A.DAY;
  const icons={
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 7h14M5 17h14"/>',
    orbit:'<ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)"/><circle cx="12" cy="12" r="2.7"/><circle cx="20" cy="6" r="1.7" fill="currentColor"/>',
    telescope:'<path d="m5 9 12-5 3 7-12 5zM7 12l-3 1m7 3-4 6m7-7 4 7m-6-6v6M16 4l3-1 3 8-2 1"/>',
    axis:'<path d="m8 2 8 20M6 6l2-4 4 2M8 20l8-2"/><ellipse cx="12" cy="12" rx="8" ry="5" transform="rotate(-20 12 12)"/>',
    eclipse:'<circle cx="12" cy="12" r="8"/><path d="M14 4a8 8 0 0 0 0 16"/>',
    tag:'<path d="M3 4h8l10 10-7 7L3 10z"/><circle cx="7" cy="8" r="1"/>',
    stars:'<path d="m9 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2zm10 12 1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
    cone:'<path d="m12 3-9 16c3 3 15 3 18 0L12 3zM3 19c3-3 15-3 18 0"/>',
    sparkle:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
    bookmark:'<path d="M6 3h12v19l-6-4-6 4z"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3v.1"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    play:'<path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="4"/>',
    back:'<path d="M5 5v14m14-14-9 7 9 7z"/>',
    forward:'<path d="M19 5v14M5 5l9 7-9 7z"/>',
    reverse:'<path d="m16 5-10 7 10 7z"/>',
    minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',
    top:'<path d="m3 12 9-7 9 7-9 7zM3 16l9 7 9-7M12 1v7"/>',
    reset:'<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    camera:'<path d="M3 7h5l2-3h4l2 3h5v14H3z"/><circle cx="12" cy="13" r="4"/>',
    close:'<path d="m5 5 14 14M5 19 19 5"/>',
    pin:'<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2.5"/>',
    flask:'<path d="M9 2h6M10 2v7L4 20c-.5 1 .2 2 1.5 2h13c1.3 0 2-1 1.5-2L14 9V2M7 15h10"/>'
  };
  const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.sparkle}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cities=[
    {name:'上海',lat:31.2304,lon:121.4737,height:4},
    {name:'北京',lat:39.9042,lon:116.4074,height:44},
    {name:'广州',lat:23.1291,lon:113.2644,height:21},
    {name:'成都',lat:30.5728,lon:104.0668,height:500},
    {name:'悉尼 · 澳大利亚',lat:-33.8688,lon:151.2093,height:58},
    {name:'达拉斯 · 美国',lat:32.7767,lon:-96.7970,height:130},
    {name:'阿尔伯克基 · 美国',lat:35.0844,lon:-106.6504,height:1619},
    {name:'洛杉矶 · 美国',lat:34.0522,lon:-118.2437,height:90},
    {name:'伦敦 · 英国',lat:51.5074,lon:-.1278,height:11},
    {name:'雷克雅未克 · 冰岛',lat:64.1466,lon:-21.9426,height:0},
    {name:'新加坡',lat:1.3521,lon:103.8198,height:15},
    {name:'南极点',lat:-90,lon:0,height:0},
    {name:'北极点',lat:90,lon:0,height:0}
  ];
  const state={time:A.clamp(Date.now(),A.MIN,A.MAX),zone:8,playing:false,rate:21600,direction:1,view:'earthmoon',tab:'observe',kids:false,
    observer:{...cities[0]},layers:{orbits:true,axis:true,shadows:true,labels:true,stars:true,cones:false},scale:1,realScale:false,autoSlow:true,
    experiment:{enabled:false,tilt:23.44,inclination:5.145}};
  let scene,physics,local,selected=null,upcoming=[],slowCandidates=[],replayUntil=null,toastTimer,seasonCacheKey='',dayChartKey='',quizIndex=0,lastStats=0,phaseKey='',lastTime=performance.now(),lastSaveNotice=false;
  function toast(message,duration=4200){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,duration);}
  function safeRun(fn){try{return fn();}catch(error){console.error(error);toast(error?.message||'操作失败，请重试。',6000);return null;}}
  function setText(id,text){const el=$(id);if(el.textContent!==String(text))el.textContent=text;}
  function zoneLabel(zone){const abs=Math.abs(zone),h=Math.floor(abs),m=Math.round((abs-h)*60);return `UTC${zone<0?'−':'+'}${h}${m?':'+String(m).padStart(2,'0'):''}`;}
  function localYear(){return new Date(state.time+state.zone*3600000).getUTCFullYear();}
  function yearBounds(){const y=localYear();return [Date.UTC(y,0,1)-state.zone*3600000,Date.UTC(y+1,0,1)-state.zone*3600000];}
  function eventDate(t,seconds=false){return A.formatTime(t,state.zone,seconds);}
  function setTime(t,pause=true){
    if(!Number.isFinite(t))throw new Error('不是有效时间。');
    state.time=A.clamp(t,A.MIN,A.MAX);if(pause)state.playing=false;replayUntil=null;forceUpdate();
  }
  function setMode(mode){if(mode==='overview'&&state.realScale)state.realScale=false;state.view=mode;if(scene)scene.settings=settings();scene?.setMode(mode);syncControls();forceUpdate();closeSidebar();}
  function setTab(tab){state.tab=tab;document.querySelectorAll('[data-tab]').forEach(b=>{const yes=b.dataset.tab===tab;b.classList.toggle('active',yes);b.setAttribute('aria-selected',String(yes));});
    document.querySelectorAll('.panel').forEach(p=>{const yes=p.id==='panel-'+tab;p.hidden=!yes;p.classList.toggle('active',yes);});
    if(tab==='seasons'){seasonCacheKey='';dayChartKey='';}forceUpdate();}
  function setObserver(observer){state.observer={...observer};dayChartKey='';if(selected)recalculateSelected();syncControls();forceUpdate();}
  function settings(){return {...state.layers,scale:state.scale,realScale:state.realScale,experiment:state.experiment,inclination:state.experiment.inclination};}
  function syncControls(){
    document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===state.view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    for(const k of Object.keys(state.layers))$('layer-'+k).checked=state.layers[k];
    $('scale-demo').classList.toggle('active',!state.realScale);$('scale-real').classList.toggle('active',state.realScale);$('body-scale').value=state.scale;
    $('body-scale').disabled=state.realScale;setText('scale-value',Math.round(state.scale*100)+'%');
    setText('scale-note',state.realScale?'地球与月球的半径、距离使用同一比例。它们会显得很小；太阳仍为方向示意。':'放大只影响画面，不改变天体位置数据与食现象的计算。');
    $('date-input').min=A.inputTime(A.MIN,state.zone);$('date-input').max=A.inputTime(A.MAX,state.zone);
    if(!$('timezone').querySelector(`option[value="${state.zone}"]`)){$('timezone').add(new Option(zoneLabel(state.zone),String(state.zone)));}
    $('timezone').value=state.zone;$('speed').value=state.rate;$('auto-slow').checked=state.autoSlow;
    const ci=cities.findIndex(c=>Math.abs(c.lat-state.observer.lat)<1e-5&&Math.abs(c.lon-state.observer.lon)<1e-5);
    $('city-select').value=ci>=0?String(ci):'custom';
    if(document.activeElement!==$('latitude'))$('latitude').value=state.observer.lat.toFixed(4);
    if(document.activeElement!==$('longitude'))$('longitude').value=state.observer.lon.toFixed(4);
    $('kids-btn').classList.toggle('active',state.kids);$('kids-btn').setAttribute('aria-pressed',String(state.kids));
    $('experiment-toggle').checked=state.experiment.enabled;
    $('tilt-slider').disabled=$('inclination-slider').disabled=!state.experiment.enabled;
    $('tilt-slider').value=state.experiment.tilt;$('inclination-slider').value=state.experiment.inclination;
    setText('tilt-value',state.experiment.enabled?state.experiment.tilt.toFixed(1)+'°':'随真实星历');setText('inclination-value',state.experiment.inclination.toFixed(2)+'°');
    $('experiment-banner').hidden=!state.experiment.enabled;$('mode-badge').classList.toggle('experimental',state.experiment.enabled);
    $('mode-badge').innerHTML='<i></i>'+(state.experiment.enabled?'假设实验':'真实天象');
    setText('scale-badge',state.view==='ground'?'日月角大小真实':state.realScale?'地月等比例 · 太阳示意':'大小 / 距离为示意');
    $('ground-tools').hidden=state.view!=='ground';
    document.querySelectorAll('[data-track]').forEach(b=>b.classList.toggle('active',b.dataset.track===(scene?.tracking||'sun')));
    const viewText={overview:['HELIOCENTRIC VIEW','宇宙总览','让一年流过，看地球如何拥抱四季。'],earthmoon:['THE EARTH–MOON SYSTEM','地月之间','一轮月相，是一场阳光与视角的相遇。'],ground:['YOUR PLACE ON EARTH','站在地球上',state.observer.name+' · 同一时刻，换一个观察角度。']};
    const t=viewText[state.view];setText('view-overline',t[0]);setText('view-title',t[1]);setText('view-subtitle',state.kids?{overview:'太阳公公、地球和月亮，谁绕着谁转呀？',earthmoon:'月亮变胖、变瘦的秘密，藏在哪里呢？',ground:'站在'+state.observer.name+'，抬头找找太阳和月亮！'}[state.view]:t[2]);
    setText('scene-note',state.view==='ground'?'滚轮调整视角 · 选按钮恢复追踪':state.layers.cones?'影锥仅示意，不用于判断食':'拖动旋转 · 滚轮缩放 · 双击地月靠近');
    $('search-events').disabled=state.experiment.enabled;
    $('auto-slow').disabled=state.experiment.enabled;
    if(!state.experiment.enabled)setText('experiment-result','真实模式中，地轴和轨道由天文状态决定。开启实验后才能修改。');
    else if(state.experiment.tilt<.1)setText('experiment-result','地轴扶正了：由地轴倾斜造成的日照季节变化基本消失。这里没有模拟海洋、天气或完整气候。');
    else if(state.experiment.inclination<.1)setText('experiment-result','月球轨道共面了：新月、满月更容易对齐食影。把时间调快，观察每次相遇；不代表真实日期预报。');
    else setText('experiment-result',`当前地轴 ${state.experiment.tilt.toFixed(1)}°，月轨倾角参数 ${state.experiment.inclination.toFixed(1)}°。比较太阳直射纬度、日照长短与影子的变化。`);
  }
  function forceUpdate(){if(!scene)return;physics=A.position(state.time,state.experiment);local=A.local(physics,state.observer);scene.update(physics,local,state.observer,settings());updateStats();scene.render();root.LabV2?.markDirty();}
  function updateStats(){
    if(!physics)return;
    if(document.activeElement!==$('date-input'))$('date-input').value=A.inputTime(state.time,state.zone);
    setText('timeline-year',localYear());const [start,end]=yearBounds();const fraction=A.clamp((state.time-start)/(end-start),0,1);
    if(document.activeElement!==$('year-slider'))$('year-slider').value=Math.round(fraction*10000);
    $('year-slider').style.setProperty('--progress',fraction*100+'%');
    const playIcon=state.playing?'pause':'play';if($('play-btn').dataset.current!==playIcon){$('play-btn').innerHTML=icon(playIcon);$('play-btn').dataset.current=playIcon;$('play-btn').setAttribute('aria-label',state.playing?'暂停':'播放');}
    $('reverse-btn').classList.toggle('active',state.direction<0);$('reverse-btn').setAttribute('aria-pressed',String(state.direction<0));
    $('clock-status').innerHTML='<i class="status-dot"></i>'+(state.playing?(state.direction<0?'正在倒放':'时间正在流动')+' · '+$('speed').selectedOptions[0]?.text:'已暂停 · 时间由你掌控');
    setText('utc-status',A.formatTime(state.time,0,true)+' UTC');
    setText('phase-name',A.phaseName(physics.phase));setText('phase-value',(physics.fraction*100).toFixed(1));
    setText('waxing-tag',physics.phase<180?'正在变圆':'正在变瘦');
    setText('moon-distance',Math.round(physics.moonDistance).toLocaleString('en-US'));setText('sun-distance',(physics.sunDistance/A.AU).toFixed(4));
    setText('sun-altitude',local.sun.alt.toFixed(1)+'°');setText('moon-altitude',local.moon.alt.toFixed(1)+'°');
    setText('sun-visible',local.solarVisible?'地平线上方':'地平线下');setText('moon-visible',local.moonVisible?'地平线上方':'地平线下');
    $('sun-visible').classList.toggle('visible',local.solarVisible);$('moon-visible').classList.toggle('visible',local.moonVisible);
    const daylight=A.daylight(state.observer.lat,physics.sunDeclination),h=Math.floor(daylight),m=Math.round((daylight-h)*60);
    setText('day-length',daylight>=24?'24 小时 · 极昼':daylight<=0?'0 小时 · 极夜':`${h+Math.floor(m/60)} 小时 ${m%60} 分`);$('day-bar-fill').style.width=daylight/24*100+'%';
    const lunar=A.lunar(physics),solar=A.globalSolar(physics);
    let insight='当前没有日食或月食。点击月相小图标，可以跳到下一次新月、上弦月、满月或下弦月。';
    if(lunar.type!=='无月食')insight=`${lunar.type}正在发生。${local.moonVisible?'所选地点的月亮在地平线上方。':'但所选地点的月亮在地平线下。'}受光比例描述月相，不等于月食中的实际亮度。`;
    else if(solar.type!=='无日食')insight=`全球正在发生${solar.type}。${local.solarType==='无日食'?'这里没有几何遮挡。':local.solarVisible?`此地是${local.solarType}，太阳被遮住 ${(local.solarCoverage*100).toFixed(1)}%。`:'这里有几何遮挡，但太阳在地平线下，无法观测。'}`;
    else if(state.kids)insight='月亮不是自己发光哦！它被太阳照亮的部分，刚好被我们看见了。点点上面的小月亮，看看它接下来会变成什么样。';
    if(state.experiment.enabled)insight='【假设实验】'+insight.replace('全球正在发生','假设条件下出现');
    setText('instant-text',insight);drawPhase();
    if(state.tab==='seasons')updateSeasons();
  }
  let moonPixels=null;
  const moonImage=new Image();moonImage.onload=()=>{const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.drawImage(moonImage,0,0,512,256);moonPixels=x.getImageData(0,0,512,256).data;phaseKey='';};moonImage.src=root.ASSETS.moon;
  function drawPhase(){
    const key=[Math.round(physics.phase*8),Math.round(physics.eps*10),!!moonPixels].join(':');if(key===phaseKey)return;phaseKey=key;
    const canvas=$('phase-canvas'),ctx=canvas.getContext('2d'),w=220,cx=110,cy=110,r=98;
    const toEarth=A.unit(A.mul(physics.moon,-1)),m=A.unit(physics.moon);
    const north=A.unit(A.sub([0,0,1],A.mul(m,m[2]))),right=A.unit(A.cross(north,toEarth)),light=A.unit(A.sub(physics.sun,physics.moon));
    const lx=A.dot(light,right),ly=A.dot(light,north),lz=A.dot(light,toEarth),image=ctx.createImageData(w,w);
    for(let y=0;y<w;y++)for(let x=0;x<w;x++){
      const nx=(x-cx)/r,ny=(cy-y)/r,q=nx*nx+ny*ny;if(q>1)continue;
      const nz=Math.sqrt(1-q),illum=Math.max(0,nx*lx+ny*ly+nz*lz),idx=(y*w+x)*4;
      const u=Math.floor((Math.atan2(nx,nz)/(2*Math.PI)+.5)*511),v=Math.floor(Math.acos(ny)/Math.PI*255),ti=(v*512+u)*4;
      const albedo=moonPixels?moonPixels[ti]/255:.6,brightness=.09+illum*1.3;
      image.data[idx]=Math.min(255,albedo*brightness*235);image.data[idx+1]=Math.min(255,albedo*brightness*238);image.data[idx+2]=Math.min(255,albedo*brightness*244);image.data[idx+3]=Math.round(Math.min(1,(1-q)*60)*255);
    }
    ctx.clearRect(0,0,w,w);ctx.putImageData(image,0,0);ctx.strokeStyle='#6a849333';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r+.5,0,Math.PI*2);ctx.stroke();
  }
  function updateSeasons(){
    const year=A.clamp(localYear(),1900,2100);setText('season-year',year);
    // Root searches stop within 200 ms: snap the display boundary within 1e-5 deg.
    const idx=Math.floor(A.mod(physics.sunLon+1e-5,360)/90),north=['春季','夏季','秋季','冬季'][idx],south=['秋季','冬季','春季','夏季'][idx];
    setText('north-season',state.experiment.enabled?'假设日照条件':'北半球 · '+north);
    setText('season-summary',state.experiment.enabled?`自定义地轴 ${state.experiment.tilt.toFixed(1)}° · ${state.observer.name}`:`南半球此刻是${south} · ${state.observer.name}`);
    setText('subsolar-lat',(physics.sunDeclination>=0?'北纬 ':'南纬 ')+Math.abs(physics.sunDeclination).toFixed(1)+'°');
    setText('noon-alt',(90-Math.abs(state.observer.lat-physics.sunDeclination)).toFixed(1)+'°');
    const key=year+':'+state.zone;
    if(key!==seasonCacheKey){seasonCacheKey=key;const seasons=E.seasons(year);
      $('season-buttons').innerHTML=seasons.map(e=>`<button data-season-time="${e.time}"><strong>${e.name} ↗</strong><time>${eventDate(e.time).slice(5,16)}</time></button>`).join('');
      $('season-buttons').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{setTime(Number(b.dataset.seasonTime));setMode('overview');toast('已到达二分二至时刻（按所选时区显示）。');}));
    }
    drawSeasonOrbit();drawDaylight(year);
  }
  function drawSeasonOrbit(){
    const c=$('season-orbit'),x=c.getContext('2d');x.clearRect(0,0,500,330);
    const cx=250,cy=170,rx=166,ry=89;
    x.strokeStyle='#314956';x.lineWidth=1.2;x.setLineDash([3,5]);x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
    const glow=x.createRadialGradient(cx,cy,2,cx,cy,44);glow.addColorStop(0,'#ffc97877');glow.addColorStop(1,'#ffc97800');x.fillStyle=glow;x.beginPath();x.arc(cx,cy,44,0,Math.PI*2);x.fill();
    x.fillStyle='#efc079';x.beginPath();x.arc(cx,cy,14,0,Math.PI*2);x.fill();x.font='16px "Microsoft YaHei",sans-serif';x.textAlign='center';x.fillStyle='#8e9eaa';x.fillText('太阳',cx,cy+39);
    ['春分','夏至','秋分','冬至'].forEach((name,i)=>{const a=i*Math.PI/2+Math.PI,px=cx+Math.cos(a)*rx,py=cy-Math.sin(a)*ry;
      x.fillStyle='#738c97';x.beginPath();x.arc(px,py,3,0,Math.PI*2);x.fill();x.fillStyle='#6d8999';x.font='19px "Microsoft YaHei",sans-serif';x.fillText(name,px,py+(i===1?43:i===3?-18:30));});
    const a=(physics.sunLon+180)*A.RAD,px=cx+Math.cos(a)*rx,py=cy-Math.sin(a)*ry;
    x.strokeStyle='#d9b36a5b';x.beginPath();x.moveTo(cx,cy);x.lineTo(px,py);x.stroke();
    const earth=x.createRadialGradient(px-6,py-7,1,px,py,19);earth.addColorStop(0,'#8cb4c5');earth.addColorStop(.5,'#447c9a');earth.addColorStop(1,'#17364c');x.fillStyle=earth;x.beginPath();x.arc(px,py,18,0,Math.PI*2);x.fill();
    const tilt=physics.eps*A.RAD;x.strokeStyle='#f0d399';x.lineWidth=1.5;x.beginPath();x.moveTo(px-29*Math.sin(tilt),py-29*Math.cos(tilt));x.lineTo(px+29*Math.sin(tilt),py+29*Math.cos(tilt));x.stroke();
    x.fillStyle='#79919e';x.font='12px "Microsoft YaHei",sans-serif';x.fillText('黄道俯视示意 · 地轴方向保持不变',250,323);
  }
  function drawDaylight(year){
    const key=[year,state.observer.lat.toFixed(4),state.experiment.enabled,state.experiment.tilt].join(':');
    const c=$('daylight-chart'),x=c.getContext('2d');
    // Sampling is light enough for direct redraw; cache only the annual curve.
    if(key!==dayChartKey){dayChartKey=key;const start=Date.UTC(year,0,1),end=Date.UTC(year+1,0,1);drawDaylight.points=Array.from({length:73},(_,i)=>{
      const t=A.clamp(start+(end-start)*i/72,A.MIN,A.MAX),p=A.position(t,state.experiment);return A.daylight(state.observer.lat,p.sunDeclination);});}
    x.clearRect(0,0,600,260);const left=46,right=583,top=20,bottom=220;
    x.font='16px "Segoe UI",sans-serif';x.textAlign='right';
    for(const h of [0,6,12,18,24]){const y=bottom-h/24*(bottom-top);x.strokeStyle='#263b49';x.setLineDash([3,7]);x.beginPath();x.moveTo(left,y);x.lineTo(right,y);x.stroke();x.fillStyle='#5a788b';x.fillText(h+'h',left-9,y+5);}x.setLineDash([]);
    const points=drawDaylight.points.map((h,i)=>[left+(right-left)*i/72,bottom-h/24*(bottom-top)]);
    const fill=x.createLinearGradient(0,top,0,bottom);fill.addColorStop(0,'#d4ac5b35');fill.addColorStop(1,'#d4ac5b03');x.fillStyle=fill;x.beginPath();x.moveTo(left,bottom);points.forEach(p=>x.lineTo(...p));x.lineTo(right,bottom);x.closePath();x.fill();
    x.strokeStyle='#dbb772';x.lineWidth=2.5;x.beginPath();points.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();
    const start=Date.UTC(year,0,1),end=Date.UTC(year+1,0,1),t=A.clamp((state.time-start)/(end-start),0,1),px=left+t*(right-left),h=A.daylight(state.observer.lat,physics.sunDeclination),py=bottom-h/24*(bottom-top);
    x.strokeStyle='#7bdac27f';x.lineWidth=1;x.beginPath();x.moveTo(px,top);x.lineTo(px,bottom);x.stroke();x.fillStyle='#a0e5cd';x.beginPath();x.arc(px,py,5,0,Math.PI*2);x.fill();
    x.fillStyle='#557589';x.font='15px "Microsoft YaHei",sans-serif';x.textAlign='left';x.fillText('1 月',left,248);x.textAlign='center';x.fillText('6 月',(left+right)/2,248);x.textAlign='right';x.fillText('12 月',right,248);
  }
  function closeSidebar(){$('sidebar').classList.remove('open');$('mobile-shade').hidden=true;}
  function restoreReality(notify=true){state.experiment.enabled=false;dayChartKey='';seasonCacheKey='';syncControls();forceUpdate();if(notify)toast('已恢复真实星历；日期和观测地点保持不变。');}
  function enableExperiment(){state.experiment.enabled=true;state.playing=false;selected=null;renderSelected();state.experiment.tilt=physics.eps;state.experiment.inclination=5.145;syncControls();forceUpdate();}
  function recalculateSelected(){
    if(!selected)return;
    if(selected.event.kind==='solar')selected.local=E.localSolar(selected.event,state.observer);
    else {
      const e=selected.event,contacts=e.contacts.map(c=>{const l=A.local(A.position(c.time),state.observer);return {...c,alt:l.moon.apparentAlt,visible:l.moonVisible};});
      let visible=false;for(let i=0;i<=32;i++){const t=(e.start||e.time)+((e.end||e.time)-(e.start||e.time))*i/32;if(A.local(A.position(t),state.observer).moonVisible){visible=true;break;}}
      selected.local={...e,contacts,visible,reason:visible?'至少部分月食过程，月亮在所选地点的地平线上方。':'整个食过程，月亮都在所选地点的地平线下。'};
    }
    renderSelected();
  }
  function enterEvent(event,title,observer=null){
    restoreReality(false);state.playing=false;if(observer)state.observer={...observer};selected={event,title,local:null};recalculateSelected();
    const t=selected.local?.contacts?.length?selected.local.time:event.time;setTime(t);setTab('events');
    if(selected.local.visible){setMode('ground');scene.setTracking(event.kind==='solar'?'sun':'moon');}else setMode('earthmoon');
    syncControls();forceUpdate();$('event-detail').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function enterCatalog(index){
    toast('正在重建这场天象…',1600);setTimeout(()=>safeRun(()=>{const c=E.catalog[index],start=Date.parse(c.date+'T00:00:00Z'),e=c.kind==='solar'?E.solarEvent(start):E.lunarEvent(start);
      if(!e)throw new Error('未找到对应事件。');enterEvent(e,c.title,c.observer);toast('已进入'+c.type+'现场。点“回放过程”观看完整变化。');}),25);
  }
  function renderSelected(){
    const host=$('event-detail');host.hidden=!selected;if(!selected){host.innerHTML='';return;}
    const e=selected.event,l=selected.local,contacts=l?.contacts||[];
    host.className='event-detail';host.innerHTML=`<h3>${esc(selected.title||e.type)}</h3><span class="event-date">${esc(eventDate(l?.time||e.time,true))} ${zoneLabel(state.zone)}</span>
      <p>全球：${esc(e.type)}${e.kind==='solar'?' · 当地：'+esc(l.type):''}<br>${esc(state.observer.name)} · ${l.visible?'✓ 至少部分过程可见':'当前地点不可见'}<br>${esc(l.reason||'')}</p>
      <div class="contact-list">${contacts.map((c,i)=>`<button data-contact="${i}" title="跳到这个阶段"><span>${esc(c.label)}${c.visible===false?' · 地平线下':''}</span><time>${esc(eventDate(c.time,true).slice(5))}</time></button>`).join('')}</div>
      <div class="detail-buttons"><button id="replay-event">▶ 回放过程</button><button id="event-peak">跳到食甚</button><button id="event-space">太空看食影</button><button id="event-ground">地面看过程</button>${e.observer?'<button id="follow-shadow">移到食带中心</button>':''}</div><p class="micro-note">${esc(e.note||'')}接触时刻只作教学估算；上方时间是所选地点或月食食甚。</p>`;
    host.querySelectorAll('[data-contact]').forEach(b=>b.onclick=()=>setTime(contacts[Number(b.dataset.contact)].time));
    $('replay-event').onclick=()=>{
      const start=l.start||e.start||e.time-2*3600000,end=l.end||e.end||e.time+2*3600000;
      setTime(start-5*60000);state.direction=1;state.rate=600;state.playing=true;replayUntil=end+5*60000;syncControls();forceUpdate();toast('开始回放。可以暂停、拖动镜头或随时调整流速。');
    };
    $('event-peak').onclick=()=>setTime(l.time||e.time);
    $('event-space').onclick=()=>{setMode('earthmoon');state.layers.shadows=true;syncControls();forceUpdate();if(physics){const sun=A.toWorld(physics.sun,physics.eps);scene.azimuth=Math.atan2(sun[0],sun[2])+.18;scene.elevation=.35;scene.cameraManual=true;}};
    $('event-ground').onclick=()=>{setMode('ground');scene.setTracking(e.kind==='solar'?'sun':'moon');syncControls();forceUpdate();};
    if($('follow-shadow'))$('follow-shadow').onclick=()=>{setObserver(e.observer);setTime(selected.local.time);setMode('ground');scene.setTracking('sun');syncControls();forceUpdate();toast('地点已切换为该事件全球食甚附近的中心追踪点。');};
  }
  function searchEvents(){
    if(state.experiment.enabled){toast('请先恢复真实天象，再搜索真实事件。');return;}
    $('search-events').disabled=true;setText('search-events','正在搜索…');const at=state.time+1000;
    setTimeout(()=>{safeRun(()=>{upcoming=E.nearby(at);renderUpcoming();toast(upcoming.length?'已找到接下来的天象。':'已接近星历末端，没有范围内的后续事件。');});$('search-events').disabled=false;setText('search-events','重新搜索 ↗');},30);
  }
  function renderUpcoming(){
    $('upcoming-events').innerHTML=upcoming.length?upcoming.map((e,i)=>`<button class="upcoming-row" data-upcoming="${i}"><span>${esc(e.type)}<small>${e.kind==='phase'?'月相时刻':'全球事件 · 当地可见性需另算'}</small></span><time>${esc(eventDate(e.time).slice(0,16))} ↗</time></button>`).join(''):'<p class="micro-note">当前范围内没有后续事件。</p>';
    $('upcoming-events').querySelectorAll('button').forEach(b=>b.onclick=()=>safeRun(()=>{const e=upcoming[Number(b.dataset.upcoming)];if(e.kind==='phase'){setTime(e.time);setTab('observe');setMode('earthmoon');}else enterEvent(e,e.type);}));
  }
  function refreshSlowCandidates(){
    if(!state.autoSlow||state.experiment.enabled){slowCandidates=[];return;}
    slowCandidates=[];
    for(const fn of [E.solarEvent,E.lunarEvent]){
      if(state.direction>0){let e=fn(Math.max(A.MIN,state.time-DAY*.5));if(e&&e.time<state.time-40*60000)e=fn(e.time+20*DAY);if(e)slowCandidates.push(e);}
      else {let t=Math.max(A.MIN,state.time-370*DAY);for(let i=0;i<6;i++){const e=fn(t);if(!e||e.time>state.time+DAY*.5)break;slowCandidates.push(e);t=e.time+20*DAY;}}
    }
  }
  function togglePlay(){state.playing=!state.playing;replayUntil=null;if(state.playing)safeRun(refreshSlowCandidates);syncControls();forceUpdate();}
  const quizzes=[
    {q:'为什么同一个地方会经历四季？',options:['地球离太阳近的时候就是夏天。','地轴倾斜改变了太阳高度和昼夜长短。','太阳每年会自己变热、变冷。'],answer:1,explain:'地轴倾斜是四季日照变化的主要原因。到“实验”里扶正地轴，再看看“四季”曲线，是很好的验证方法。'},
    {q:'为什么不是每个新月都有日食？',options:['月亮有时候不见了。','太阳每个月的位置是随机的。','月球轨道相对黄道面倾斜，常从太阳上方或下方经过。'],answer:2,explain:'真实月轨与黄道有约 5° 的夹角。只有新月又靠近轨道交点时，月影才可能落到地球上。把实验里的月轨压平，就更容易看见对齐。'},
    {q:'弯弯的月亮，通常是怎么来的？',options:['我们看见的受光面比例变小了。','地球的影子每天都在遮住月亮。','月亮自己熄灭了一半。'],answer:0,explain:'月相来自太阳照射和观察角度的变化；地球影子遮住月亮，是月食，不是日常的阴晴圆缺。'},
    {q:'月亮总把大致同一面朝向地球，说明什么？',options:['月球从来不自转。','月球自转和绕地公转周期接近。','地球一直在帮月亮转身。'],answer:1,explain:'这叫同步自转。月球每绕地球一圈，也大约自转一圈。三维中展示这种锁定关系；本项目没有精确复现月球天平动。'}
  ];
  function renderQuiz(){const q=quizzes[quizIndex%quizzes.length];$('quiz').innerHTML=`<p class="quiz-question">${state.kids?'小小科学家，猜猜看：':''}${esc(q.q)}</p>${q.options.map((o,i)=>`<button class="quiz-option" data-answer="${i}">${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join('')}<div id="quiz-explanation" class="quiz-explanation" hidden></div>`;
    $('quiz').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.answer);$('quiz').querySelectorAll('button').forEach((bb,k)=>{bb.classList.toggle('correct',k===q.answer);bb.classList.toggle('wrong',k===i&&i!==q.answer);});$('quiz-explanation').hidden=false;$('quiz-explanation').textContent=(i===q.answer?(state.kids?'答对啦！你的观察很棒！ ':'判断正确。 '):(state.kids?'差一点点，我们再找找线索！ ':'这个地方值得重新观察。 '))+q.explain;});
  }
  function showModal(title,html){$('modal-title').textContent=title;$('modal-body').innerHTML=html;state.playing=false;updateStats();if(!$('modal').open)$('modal').showModal();}
  function help(){showModal('把时间握在手里',`<p>这是一个可以离线运行的日地月实验室。年月日和时间驱动同一套天体状态；切换视角不会切换成另一段动画。</p>
    <h3>先试这三件事</h3><p>① 在底部设日期，点播放，再改变“时间流速”。<br>② 打开“天象”，进入一次日全食，点“回放过程”。<br>③ 打开“实验”，扶正地轴，再到“四季”比较日照曲线。</p>
    <h3>镜头与快捷键</h3><p>拖动画面旋转，滚轮或双指缩放；双击地球或月球可靠近，重置按钮返回默认镜头。<kbd>空格</kbd> 播放 / 暂停；<kbd>[</kbd> 前一天；<kbd>]</kbd> 后一天；<kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> 切换视角；<kbd>R</kbd> 重置镜头。输入框编辑时快捷键不会抢走输入。</p>
    <h3>日期与地点</h3><p>支持 UTC 1900-01-01 至 2100-12-31。界面时区是<strong>固定 UTC 偏移</strong>，不自动套用城市夏令时。换时区只换时间显示，不移动天体。选择地点不会擅自更改时区。</p>
    <h3>两种比例，两种模式</h3><p>教学放大时，大小和距离都经过示意处理，但食影仍用真实公里坐标计算。真实地月比只对地球、月球及地月距离使用相同比例；太阳仍为方向示意。地面模式保持太阳和月球的真实视角大小。</p>
    <p>开启假设实验后，会修改日照几何和月球黄纬。实验不是引力积分、气候模型或真实天象预报，事件搜索在此模式中停用。</p>
    <div class="modal-actions"><button id="help-about" class="primary-button">查看精度、来源与开源许可</button></div>`);$('help-about').onclick=about;}
  function about(){showModal('精度、来源与项目边界',`<div class="about-grid"><div><strong>离线星历</strong>Swiss Ephemeris 2.10.03 的 Moshier 内置模型，由 pyswisseph 2.10.3.2 生成。不是下载的 JPL DE 文件。</div><div><strong>三维引擎</strong>Three.js r140（MIT），随包提供。界面和核心控制为原生 JavaScript；无需 npm 安装即可运行。</div></div>
    <h3>已经做到什么</h3><p>真实日期驱动日月地位置；地球自转、月相、二分二至、地点视差、有限太阳角直径的遮挡计算。星历用每 4 天一段的 8 阶切比雪夫近似，取样范围覆盖 1900—2100。</p>
    <h3>不要把这些当成专业预报</h3><p>日食使用球形地球近似；观测点采用 WGS84 椭球位置。月食使用 2% 大气影子放大近似；不模拟实际大气透射光谱。不提供精确全食带边界、混合日食沿程分类、贝利珠、地形遮挡或月缘山谷。</p>
    <p>界面显示到秒不意味着接触时间精确到秒。随包有插值留出测试和真实天象样本检查，但不是整个 201 年范围的专业级认证。实际观测请查权威星历与当地情况。</p>
    <h3>视觉约定</h3><p>月面纹理是程序生成的示意地貌；月球朝向仅表现大体同步自转，不复现精确天平动。地球轮廓来自 Natural Earth 公共领域数据，云纹、日冕与背景星点为装饰，不是某一天的天气或实测星图。影锥仅作几何讲解，不能按画面长度测量。</p>
    <h3>许可与源码</h3><p>本交付按 AGPL-3.0-or-later 开源分发，ZIP 含完整项目源码和数据重建脚本。Three.js 的 MIT 许可独立保留。再发布或改成在线服务前，应阅读随包 LICENSE 和第三方说明；闭源商用不能默认沿用本包许可。</p>
    <p>来源与文档：<a href="https://www.astro.com/swisseph/swephinfo_e.htm" target="_blank" rel="noopener">Swiss Ephemeris</a> · <a href="https://threejs.org/" target="_blank" rel="noopener">Three.js</a> · <a href="https://eclipse.gsfc.nasa.gov/" target="_blank" rel="noopener">NASA 食资料</a> · <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noopener">Natural Earth</a>。项目运行本身不会访问这些链接。</p>`);}
  function tour(){showModal(state.kids?'小小探索员，准备出发！':'给自己三次发现的机会',`
    <div class="tour-step"><span>01</span><div><strong>看看月亮为什么变圆、变弯</strong><p>${state.kids?'我们坐上小飞船，一起追着月亮看一圈！':'地月之间加速一天一天地播放，同时观察右侧地心月相。'}</p><button data-tour="phase">出发，去看月相 ↗</button></div></div>
    <div class="tour-step"><span>02</span><div><strong>让一年从眼前流过</strong><p>${state.kids?'夏天的白天为什么长？把一整年快进看看吧！':'站在同一个地点比较二分二至，注意直射纬度和白昼长度。'}</p><button data-tour="seasons">走进四季 ↗</button></div></div>
    <div class="tour-step"><span>03</span><div><strong>走进 2009 年上海日全食</strong><p>${state.kids?'月亮要来挡住太阳啦！我们在安全的屏幕里，看看它的影子。':'同一场天象，先从地面看遮挡，再飞到太空看月影。'}</p><button data-tour="eclipse">进入天象现场 ↗</button></div></div>`);
    $('modal-body').querySelectorAll('[data-tour]').forEach(b=>b.onclick=()=>{$('modal').close();restoreReality(false);if(b.dataset.tour==='phase'){setMode('earthmoon');setTab('observe');state.rate=86400;state.playing=true;refreshSlowCandidates();syncControls();}
      else if(b.dataset.tour==='seasons'){setTime(Date.UTC(A.clamp(localYear(),1900,2100),0,1,12));setTab('seasons');setMode('overview');state.rate=604800;state.playing=true;refreshSlowCandidates();syncControls();}else enterCatalog(1);});}
  function snapshot(){return {version:1,name:A.formatTime(state.time,state.zone,false)+' · '+state.observer.name,time:state.time,zone:state.zone,view:state.view,tab:state.tab,rate:state.rate,direction:state.direction,kids:state.kids,observer:{...state.observer},layers:{...state.layers},scale:state.scale,realScale:state.realScale,autoSlow:state.autoSlow,experiment:{...state.experiment},camera:scene.cameraState()};}
  function validateSnapshot(s){
    if(!s||s.version!==1)throw new Error('不支持的场景文件版本。');
    const num=(x,lo,hi,label)=>{if(typeof x!=='number'||!Number.isFinite(x)||x<lo||x>hi)throw new Error(label+' 不合法。');return x;};
    num(s.time,A.MIN,A.MAX,'日期');num(s.zone,-12,14,'时区');num(s.rate,1,2592000,'速度');
    if(![1,-1].includes(s.direction)||!['overview','earthmoon','ground'].includes(s.view)||!['observe','events','seasons','lab'].includes(s.tab))throw new Error('视角或播放方向不合法。');
    if(!s.observer||!s.layers||!s.experiment)throw new Error('场景缺少必要字段。');
    num(s.observer.lat,-90,90,'纬度');num(s.observer.lon,-180,180,'经度');num(s.observer.height,-500,9000,'海拔');
    num(s.scale,.65,1.65,'显示大小');num(s.experiment.tilt,0,45,'地轴倾角');num(s.experiment.inclination,0,15,'月轨倾角');
    for(const k of ['orbits','axis','shadows','labels','stars','cones'])if(typeof s.layers[k]!=='boolean')throw new Error('图层配置不合法。');
    for(const [o,k] of [[s,'kids'],[s,'realScale'],[s,'autoSlow'],[s.experiment,'enabled']])if(typeof o[k]!=='boolean')throw new Error('场景开关不合法。');
    if(s.camera){num(s.camera.azimuth,-1e6,1e6,'镜头方位');num(s.camera.elevation,-1.5,1.5,'镜头俯仰');num(s.camera.distance,6,800,'镜头距离');num(s.camera.fov,.7,100,'视角');if(!['sun','moon','horizon'].includes(s.camera.tracking)||!['earth','moon'].includes(s.camera.focus))throw new Error('镜头追踪目标不合法。');}
    s.name=String(s.name||'我的场景').slice(0,80);s.observer.name=String(s.observer.name||'自定义地点').slice(0,50);return s;
  }
  function restoreSnapshot(s){validateSnapshot(s);state.playing=false;replayUntil=null;selected=null;renderSelected();
    for(const k of ['time','zone','view','tab','rate','direction','kids','scale','realScale','autoSlow'])state[k]=s[k];
    state.observer={...s.observer};state.layers={...s.layers};state.experiment={...s.experiment};
    if(!$('speed').querySelector(`option[value="${state.rate}"]`))$('speed').add(new Option('自定义 ×'+state.rate,String(state.rate)));
    scene.setMode(state.view);setTab(state.tab);syncControls();forceUpdate();scene.restoreCamera(s.camera);scene.render();renderQuiz();
    toast('已恢复时间、地点、模式、图层和镜头。为避免意外快进，恢复后保持暂停。');}
  function savedScenes(){try{const arr=JSON.parse(localStorage.getItem('sem-lab-scenes-v1')||'[]');return Array.isArray(arr)?arr.slice(0,12).filter(s=>{try{validateSnapshot(s);return true;}catch{return false;}}):[];}catch{return [];}}
  function download(url,name){const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();}
  function exportScene(){const text=JSON.stringify(snapshot(),null,2),url=URL.createObjectURL(new Blob([text],{type:'application/json'}));download(url,'日月地-场景-'+A.formatTime(state.time,0,false).slice(0,10)+'.json');setTimeout(()=>URL.revokeObjectURL(url),2000);toast('场景已导出；JSON 包含你选择的经纬度。');}
  function saveModal(){const saved=savedScenes();showModal('收藏这一刻',`<p>留下时间、地点、显示图层和镜头，下次回到同一个宇宙瞬间。</p><p class="micro-note">收藏只保存在这个浏览器。导出 JSON 才是可带走的备份；文件会包含所选经纬度，不会自动上传。</p>
      <div class="modal-actions"><button id="save-current" class="primary-button">收藏当前场景</button><button id="export-scene">导出当前场景 JSON</button><button id="import-scene">导入场景</button></div>
      <div id="saved-list">${saved.length?saved.map((s,i)=>`<div class="saved-item"><div><strong>${esc(s.name)}</strong><small>${esc(s.experiment.enabled?'假设实验':'真实天象')} · ${esc(s.view==='ground'?'地面视角':s.view==='overview'?'宇宙总览':'地月之间')}</small></div><div><button data-load="${i}">进入 ↗</button><button data-delete="${i}" class="delete-saved" aria-label="删除收藏">×</button></div></div>`).join(''):'<p class="micro-note">这里还没有收藏。下一次发现，值得留下。</p>'}</div>`);
    $('save-current').onclick=()=>safeRun(()=>{const arr=savedScenes();arr.unshift(snapshot());localStorage.setItem('sem-lab-scenes-v1',JSON.stringify(arr.slice(0,12)));saveModal();toast('已收藏在本机浏览器中。');});
    $('export-scene').onclick=exportScene;$('import-scene').onclick=()=>$('import-file').click();
    $('saved-list').querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>safeRun(()=>{restoreSnapshot(saved[Number(b.dataset.load)]);$('modal').close();}));
    $('saved-list').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>safeRun(()=>{saved.splice(Number(b.dataset.delete),1);localStorage.setItem('sem-lab-scenes-v1',JSON.stringify(saved));saveModal();}));
  }
  function bind(){
    $('city-select').innerHTML=cities.map((c,i)=>`<option value="${i}">${esc(c.name)}</option>`).join('')+'<option value="custom">自定义经纬度</option>';
    // Event slowing can select 120x; keep it explicit in the speed menu.
    $('speed').add(new Option('1 秒 = 2 分钟','120'),$('speed').options[2]);
    document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setMode(b.dataset.view));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
    for(const k of Object.keys(state.layers))$('layer-'+k).onchange=()=>{state.layers[k]=$('layer-'+k).checked;syncControls();forceUpdate();};
    $('scale-demo').onclick=()=>{state.realScale=false;scene.settings=settings();scene.reset();syncControls();forceUpdate();};
    $('scale-real').onclick=()=>{state.realScale=true;setMode('earthmoon');scene.settings=settings();scene.reset();syncControls();forceUpdate();toast('已使用真实地月比。地球和月亮会显得很小，试着缩放感受它们之间的距离。',5500);};
    $('body-scale').oninput=()=>{state.scale=Number($('body-scale').value);setText('scale-value',Math.round(state.scale*100)+'%');forceUpdate();};
    $('date-input').onchange=()=>safeRun(()=>{const t=A.parseTime($('date-input').value,state.zone);setTime(t);toast('已抵达 '+eventDate(t,true)+' '+zoneLabel(state.zone));});
    $('timezone').onchange=()=>{state.zone=Number($('timezone').value);seasonCacheKey='';syncControls();forceUpdate();renderSelected();renderUpcoming();toast('只改变时间显示；天体仍处于同一瞬间。');};
    $('now-btn').onclick=()=>{setTime(Date.now());toast('已回到当前真实时刻。');};
    $('previous-day').onclick=()=>setTime(A.shiftCalendar(state.time,state.zone,{days:-1}));$('next-day').onclick=()=>setTime(A.shiftCalendar(state.time,state.zone,{days:1}));
    $('previous-year').onclick=()=>setTime(A.shiftCalendar(state.time,state.zone,{years:-1}));$('next-year').onclick=()=>setTime(A.shiftCalendar(state.time,state.zone,{years:1}));
    $('year-slider').oninput=()=>{const [start,end]=yearBounds();setTime(start+(end-start-1000)*Number($('year-slider').value)/10000);};
    $('play-btn').onclick=togglePlay;$('reverse-btn').onclick=()=>{state.direction*=-1;if(state.playing)safeRun(refreshSlowCandidates);forceUpdate();};
    $('speed').onchange=()=>{state.rate=Number($('speed').value);if(state.playing)safeRun(refreshSlowCandidates);forceUpdate();};$('auto-slow').onchange=()=>{state.autoSlow=$('auto-slow').checked;if(state.playing)safeRun(refreshSlowCandidates);};
    $('city-select').onchange=()=>{const v=$('city-select').value;if(v!=='custom')setObserver(cities[Number(v)]);else{state.observer.name='自定义地点';state.observer.height=0;$('latitude').focus();syncControls();}};
    for(const id of ['latitude','longitude'])$(id).onchange=()=>safeRun(()=>{const la=$('latitude').value,lo=$('longitude').value;if(la.trim()===''||lo.trim()==='')throw new Error('纬度和经度不能为空。');const lat=Number(la),lon=Number(lo);
      if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lon)||lon<-180||lon>180)throw new Error('纬度应为 −90～90，经度应为 −180～180。');setObserver({name:'自定义地点',lat,lon,height:0});});
    $('zoom-out').onclick=()=>scene.zoom(1.22);$('zoom-in').onclick=()=>scene.zoom(.82);$('top-view').onclick=()=>{if(state.view==='ground'){toast('俯视黄道面适用于太空视角。');return;}scene.reset('top');};$('reset-camera').onclick=()=>scene.reset();
    document.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{scene.setTracking(b.dataset.track);syncControls();forceUpdate();});
    $('capture-btn').onclick=()=>safeRun(()=>{const data=scene.screenshot((state.experiment.enabled?'[假设实验] ':'')+A.formatTime(state.time,state.zone,true)+' '+zoneLabel(state.zone),state.observer.name+' · '+$('view-title').textContent+' · '+$('scale-badge').textContent);download(data,'日月地-观测图.png');toast('已保存三维观测图，图片下方保留时间、地点和模式说明。');});
    $('kids-btn').onclick=()=>{state.kids=!state.kids;syncControls();forceUpdate();renderQuiz();toast(state.kids?'小小探索员，宇宙冒险开始啦！':'已切换回标准讲解。');};
    $('experiment-toggle').onchange=()=>{$('experiment-toggle').checked?enableExperiment():restoreReality();};
    for(const [id,key] of [['tilt-slider','tilt'],['inclination-slider','inclination']])$(id).oninput=()=>{if(!state.experiment.enabled)return;state.experiment[key]=Number($(id).value);dayChartKey='';syncControls();forceUpdate();};
    $('upright-earth').onclick=()=>{if(!state.experiment.enabled)enableExperiment();state.experiment.tilt=0;syncControls();forceUpdate();toast('地轴已扶正。切到“四季”看看日照曲线。');};
    $('flat-moon').onclick=()=>{if(!state.experiment.enabled)enableExperiment();state.experiment.inclination=0;syncControls();forceUpdate();toast('月球轨道已设为共面。试着以“1 秒 = 1 天”播放一个月。');};
    $('restore-reality').onclick=()=>restoreReality();
    $('event-catalog').innerHTML=E.catalog.map((c,i)=>`<article class="event-card ${c.kind}"><span class="event-type">${c.type}</span><time class="event-date">${c.date} UTC</time><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><button data-catalog="${i}">进入现场</button></article>`).join('');
    $('event-catalog').querySelectorAll('button').forEach(b=>b.onclick=()=>enterCatalog(Number(b.dataset.catalog)));$('search-events').onclick=searchEvents;
    document.querySelectorAll('[data-phase]').forEach(b=>{b.setAttribute('role','button');b.tabIndex=0;const go=()=>safeRun(()=>{if(state.experiment.enabled){toast('真实月相跳转需要先恢复真实天象。');return;}const t=E.nextPhase(state.time+1000,Number(b.dataset.phase));if(t===null)throw new Error('已接近星历范围末端。');setTime(t);toast('已到达下一次'+A.phaseName(Number(b.dataset.phase))+'。');});b.onclick=go;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};});
    $('help-btn').onclick=help;$('about-btn').onclick=about;$('tour-btn').onclick=tour;$('save-btn').onclick=saveModal;$('next-quiz').onclick=()=>{quizIndex++;renderQuiz();};
    $('close-modal').onclick=()=>$('modal').close();$('modal').addEventListener('click',e=>{if(e.target===$('modal')){const r=$('modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('modal').close();}});
    $('menu-btn').onclick=()=>{const open=$('sidebar').classList.toggle('open');$('mobile-shade').hidden=!open;};$('mobile-shade').onclick=closeSidebar;
    $('import-file').onchange=async()=>{const file=$('import-file').files[0];if(!file)return;try{if(file.size>100000)throw new Error('场景文件过大；应为小于 100 KB 的 JSON。');const s=JSON.parse(await file.text());restoreSnapshot(s);$('modal').close();}catch(e){toast('导入失败：'+e.message,6500);}finally{$('import-file').value='';}};
    document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement?.tagName))return;
      if(e.code==='Space'){e.preventDefault();togglePlay();}else if(e.key==='[')setTime(state.time-DAY);else if(e.key===']')setTime(state.time+DAY);else if(e.key==='1')setMode('overview');else if(e.key==='2')setMode('earthmoon');else if(e.key==='3')setMode('ground');else if(e.key.toLowerCase()==='r')scene.reset();else if(e.key==='?')help();});
    document.addEventListener('visibilitychange',()=>{lastTime=performance.now();if(document.hidden&&state.playing){state.playing=false;updateStats();toast('页面切到后台，已自动暂停，避免错过天象。');}});
  }
  function frame(now){
    if(root.LabV2&&!root.LabV2.shouldRender(now)){requestAnimationFrame(frame);return;}
    const dt=Math.min(.25,Math.max(0,(now-lastTime)/1000));lastTime=now;
    if(state.playing){const old=state.time;let next=old+dt*1000*state.rate*state.direction;
      if(state.autoSlow&&!state.experiment.enabled&&!replayUntil&&state.rate>600){
        for(const e of slowCandidates){const threshold=e.time-state.direction*30*60000;
          if((state.direction>0&&old<threshold&&next>=threshold)||(state.direction<0&&old>threshold&&next<=threshold)){
            next=threshold;state.rate=120;$('speed').value='120';toast('接近'+e.type+'，已减速为“1 秒 = 2 分钟”。');break;
          }
        }
      }
      state.time=A.clamp(next,A.MIN,A.MAX);
      if(state.time===A.MIN||state.time===A.MAX){state.playing=false;toast('已到达星历支持范围的边界。');}
      if(replayUntil&&state.time>=replayUntil){state.time=replayUntil;state.playing=false;replayUntil=null;toast('本次天象回放结束。');}
      physics=A.position(state.time,state.experiment);local=A.local(physics,state.observer);scene.update(physics,local,state.observer,settings());
    }
    if(now-lastStats>200){updateStats();lastStats=now;}
    scene?.render();root.LabV2?.frame(now);requestAnimationFrame(frame);
  }
  function boot(){
    const b=atob(root.EPHEMERIS_BASE64),bytes=new Uint8Array(b.length);for(let i=0;i<b.length;i++)bytes[i]=b.charCodeAt(i);
    A.init(new Float32Array(bytes.buffer),root.EPHEMERIS_META);root.EPHEMERIS_BASE64=null;
    bind();renderQuiz();
    try{scene=new root.LabScene($('scene-host'),{onError:e=>{if(!scene)return;root.LabV2?.saveSession();$('scene-error').hidden=false;$('scene-error').textContent='三维显卡资源暂时不可用。当前场景已尝试保存；关闭其他高负载页面后，可刷新并继续上次探索。';const button=document.createElement('button');button.textContent='刷新并恢复';button.className='primary-button';button.onclick=()=>location.reload();$('scene-error').append(button);}});}
    catch(error){$('scene-host').innerHTML='';scene=new root.LabScene2D($('scene-host'));$('scene-error').hidden=true;toast('WebGL 不可用，已启用二维兼容画面。时间和天文计算仍可使用。',8000);} 
    forceUpdate();scene.reset();syncControls();forceUpdate();$('app').setAttribute('aria-busy','false');
    $('boot').style.opacity='0';setTimeout(()=>$('boot').remove(),400);requestAnimationFrame(frame);
    // Small, documented diagnostic API used by the automated browser tests.
    root.LabApp={getState:()=>snapshot(),getPhysics:()=>({state:physics,local,lunar:A.lunar(physics),solar:A.globalSolar(physics)}),setTime,setMode,setTab,setObserver,
      pause:()=>{state.playing=false;forceUpdate();},play:togglePlay,validateSnapshot,restoreSnapshot,enterCatalog,getScene:()=>scene,
      getLive:()=>({state,physics,local,selected}),restoreReality,enterEvent,toast,
      setEventContext:(event,title)=>{selected={event,title,local:null};recalculateSelected();},
      setKids:value=>{state.kids=!!value;syncControls();forceUpdate();renderQuiz();},
      clearEvent:()=>{selected=null;renderSelected();},
      setRate:rate=>{if(!Number.isFinite(rate)||rate<1||rate>2592000)throw new Error('速度超出范围');state.rate=rate;if(!$('speed').querySelector(`option[value="${rate}"]`))$('speed').add(new Option('自定义 ×'+rate,String(rate)));syncControls();forceUpdate();}};
  }
  try{boot();}catch(error){console.error(error);$('boot').innerHTML='<strong>实验室未能启动</strong><p style="max-width:500px;padding:20px;line-height:1.9">'+esc(error.message)+'<br>请将 ZIP 完整解压，使用 Chrome / Edge 打开“日月地实验室.html”；并确认浏览器允许 WebGL。</p>';}
})(globalThis);
