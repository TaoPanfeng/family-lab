/* V2 product layer. One physical clock; secondary views consume the exact same
 * UTC instant. Learning pathways, experiment comparison and notes stay separate.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  if(!root.LabApp)return;
  const app=root.LabApp,A=root.Astro,E=root.Events,L=root.Learning,D=root.LabDiagrams,$=id=>document.getElementById(id),DAY=A.DAY;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const set=(id,t)=>{const e=$(id);if(e&&e.textContent!==String(t))e.textContent=t;};
  const names={research:'自由研究',kid:'小小探索员',family:'亲子共玩'};
  const topics={
    moon:{name:'月相',title:'月亮为什么会变弯？',adult:'一轮月相，两种视角',subtitle:'同一束阳光，同一时刻。连接太空中的原因与地面上的现象。',caption:'太空 · 地月关系',right:'地面 · 追踪月亮',type:'ground',rate:21600,
      choices:['是地球的影子挡住了月亮。','是我们看到的亮面变了。','还不知道，我想动手找找看。'],observe:'把时间向前拨几天，同时看看太空里的月亮和我们看到的亮面。',explain:'月亮并没有少一块！月相是我们看到的受光部分在变化。地球的影子遮到月亮上，那是月食，不是平时的月相。',task:'向前 1 天',family:'孩子当驾驶员，爸爸先问：“你觉得哪一面被太阳照亮了？”先不揭晓答案。'},
    eclipse:{name:'日月食',title:'太阳怎么被挡住啦？',adult:'同一场食，两个现场',subtitle:'左边看空间关系，右边看所选地点。全球发生，不等于当地可见。',caption:'太空 · 影子落在哪里',right:'地面 · 真实视角大小',type:'ground',rate:120,
      choices:['太阳自己变小了。','月亮走到了太阳前面。','换一个地方看，也一样吗？'],observe:'进入上海日全食前的现场。慢慢向前拨时间，看看太阳和月亮怎样靠近。',explain:'月亮走到我们和太阳之间，便可能遮住太阳。它的影子只扫过地球的一部分，所以换个地方看到的过程可能不同。',task:'向前 5 分钟',family:'孩子控制时间，爸爸负责问：“月亮的影子落到哪里了？换个地方还能看见吗？”'},
    seasons:{name:'四季',title:'把地球扶正会怎样？',adult:'只改地轴，观察一个变量',subtitle:'左侧真实星历；右侧假设实验。相同时刻、相同地点，比较日照。',caption:'A · 真实地球',right:'B · 假设地球',type:'compare',rate:604800,
      choices:['日照还会像原来一样变化。','日照的季节变化会变小。','我想先看看，再说猜想。'],observe:'右边的地球已经扶正。让两边一起走过几个月，比较同一地点的白昼长度。',explain:'地轴倾斜会改变太阳高度和昼夜长短。扶正后，这种季节性日照变化基本消失。我们比较的是阳光，不是在预测真实天气或温度。',task:'向前 7 天',family:'先各说一个猜想。孩子移动时间，爸爸读两边的白昼长度，然后一起找不同。'},
    shadow:{name:'影子',title:'影子怎么变长变短？',adult:'用一根立杆，量一束阳光',subtitle:'改变日期与杆高，查看这个地点的正午太阳高度和几何影长。',caption:'太空 · 地球与太阳',right:'地面 · 正午立杆实验',type:'shadow',rate:604800,
      choices:['太阳高一些，影子可能短一些。','杆子高一些，影子可能长一些。','我想分别改一改，验证猜想。'],observe:'先只改杆高，再只改日期。看看哪个条件改变了影长，别一下子全改掉。',explain:'太阳越高，同一根杆的影子越短；太阳高度相同时，杆子越高，影子越长。这里比较的是每天的正午，不是钟表上的每个时刻。',task:'向前 7 天',family:'孩子提一个猜想，爸爸只帮忙保持其他条件不变。一次改一个条件，再交换角色。'}
  };
  let storage;try{storage=root.localStorage;}catch{storage=null;}
  const store=new L.Store(storage),storedPreferences=store.get('preferences',{})||{};
  const v={audience:L.AUDIENCES.includes(storedPreferences.audience)?storedPreferences.audience:'research',topic:'moon',eclipseKind:'solar',split:true,tilt:0,height:1,mobileRight:false,quality:['auto','high','eco'].includes(storedPreferences.quality)?storedPreferences.quality:'auto',autoEco:false};
  let secondary=null,secondaryKey='',dirty=true,lastUpdate=0,lastRender=0,lastFrame=0,perfCount=0,perfSum=0,history=[],windowRange=null,lastSelectedKey='',lastTab=app.getLive().state.tab,lastTimeKey='',sessionTimer=null,autosaveAt=0,book=[],deletedNote=null,dialogKind='',mission={step:0,guess:'',observed:false,initialTime:app.getLive().state.time,initialTilt:0,initialHeight:1},restoreBusy=false;
  let savedSession=store.get('session',null),lastSessionValid=false;
  try{if(savedSession){app.validateSnapshot(savedSession.scene);L.validateContext(savedSession.context);lastSessionValid=true;}}catch{savedSession=null;}
  try{const b=store.get('book',null);if(b)book=L.validateBook(b,app.validateSnapshot);}catch(e){app.toast('本地手记未通过校验，请导入备份；没有覆盖原数据。');}
  let sessionArmed=false;
  const originalSession=savedSession?JSON.parse(JSON.stringify(savedSession)):null;
  const hadSession=lastSessionValid;
  const live=()=>app.getLive(), context=()=>({audience:v.audience,topic:v.topic,split:v.split,tilt:v.tilt,height:v.height,eclipseKind:live().selected?.event?.kind||v.eclipseKind,eventTime:live().selected?.event?.time??null});
  function currentTopic(){return v.topic==='eclipse'&&v.eclipseKind==='lunar'?{...topics.eclipse,title:'月亮怎么走进影子里？',adult:'同一场月食，两个现场',right:'地面 · 追踪月亮',choices:['地球的影子落到了月亮上。','月亮自己关掉了灯。','我还不知道，想看一看。'],observe:'慢慢向前拨时间，看看月亮怎样走进地球背向太阳的影子。',explain:'地球在太阳和月亮之间，地球的影子落到月亮上，这就是月食。它不是平时的月相变化。',family:'孩子控制时间，爸爸提问：“是谁的影子？太阳又在哪个方向？”'}:topics[v.topic];}

  function notice(t){app.toast(t,5500);}
  function run(fn){try{const result=fn();if(result&&typeof result.then==='function')result.catch(e=>notice(e.message||'操作未完成'));return result;}catch(e){notice(e.message||'操作未完成，请重试。');return null;}}
  function remember(){if(restoreBusy)return;history.push({scene:app.getState(),context:context(),mission:{...mission}});if(history.length>15)history.shift();$('v2-back').disabled=false;}
  function restoreEntry(entry){
    app.validateSnapshot(entry.scene);const c=L.validateContext(entry.context);restoreBusy=true;
    try{Object.assign(v,c);app.restoreSnapshot(entry.scene);
      if(c.topic==='eclipse'&&c.eventTime!==null){const e=c.eclipseKind==='lunar'?E.lunarEvent(Math.max(A.MIN,c.eventTime-DAY)):E.solarEvent(Math.max(A.MIN,c.eventTime-DAY));if(e&&Math.abs(e.time-c.eventTime)<DAY)app.setEventContext(e,e.type);}
      mission=entry.mission&&Number.isInteger(entry.mission.step)&&entry.mission.step>=0&&entry.mission.step<=4?{...entry.mission}:{step:0,guess:'',observed:false,initialTime:entry.scene.time,initialTilt:v.tilt,initialHeight:v.height};setAudience(c.audience,false);setTopic(c.topic,{prepare:false,remember:false,resetMission:false});setSplit(c.split,false);resetWindow();dirty=true;}finally{restoreBusy=false;}
    saveSession();
  }
  function back(){const entry=history.pop();if(!entry)return;restoreEntry(entry);$('v2-back').disabled=!history.length;notice('回到刚才的时间、地点、实验条件和镜头。');}
  function makeLayout(){
    document.body.classList.add('v2-enhanced');
    document.querySelector('.brand p').innerHTML='SUN · EARTH · MOON <span class="v2-version"> / V2</span>';
    document.querySelector('.header-center').outerHTML=`<nav class="v2-modes" aria-label="探索方式">${Object.entries(names).map(([k,n])=>`<button data-audience="${k}" aria-pressed="false">${n}</button>`).join('')}</nav>`;
    document.querySelector('.header-actions').insertAdjacentHTML('afterbegin','<button id="v2-home" class="text-button" title="选择探索方式">探索入口</button><button id="v2-notebook" class="text-button" title="查看、备份探索手记">探索手记 <span id="v2-note-count">0</span></button>');
    $('menu-btn').title='展开视角、图层和高级设置';$('menu-btn').setAttribute('aria-label','展开视角、图层和高级设置');
    $('stage').insertAdjacentHTML('afterbegin',`<nav class="v2-taskbar" aria-label="探索主题">${Object.entries(topics).map(([k,t])=>`<button data-topic="${k}" aria-pressed="false">${t.name}</button>`).join('')}<button id="v2-back" class="v2-back" disabled>↶ 返回刚才</button></nav>`);
    $('stage').insertAdjacentHTML('beforeend',`<div id="v2-main-caption" class="v2-view-caption"><span></span><b id="v2-main-label"></b></div>
      <div class="v2-mobile-views" id="v2-mobile-views"><button id="v2-left-tab" class="active">太空视角</button><button id="v2-right-tab">地面视角</button></div>
      <section id="v2-companion" class="v2-companion" aria-label="同一时刻的第二视图"><div class="v2-companion-head"><b id="v2-secondary-label"></b><button id="v2-reset-second" title="重置第二视图镜头">重置视角</button></div><div id="v2-companion-host" class="v2-companion-host"></div><canvas id="v2-shadow-canvas" class="v2-shadow-canvas" aria-label="所选日期的正午立杆影长示意" hidden></canvas><div class="v2-measure"><div><span id="v2-right-metric-title"></span><strong id="v2-right-metric">—</strong></div><div id="v2-right-extra" class="v2-mini"></div></div></section>
      <div class="v2-measure v2-primary-measure" id="v2-primary-measure"><div><span id="v2-left-metric-title"></span><strong id="v2-left-metric">—</strong></div><div id="v2-left-extra" class="v2-mini"></div></div><div class="v2-evidence-line" id="v2-evidence"></div>`);
    document.querySelector('.scene-bottom').insertAdjacentHTML('afterbegin','<button id="v2-split-toggle" class="v2-split-toggle" aria-pressed="true">同步双视图 · 开</button>');
    document.querySelector('.inspector').insertAdjacentHTML('afterbegin','<section id="v2-guide" class="v2-guide" aria-label="引导探索"></section>');
    document.querySelector('.panel-scroll').insertAdjacentHTML('afterbegin',`<section class="v2-research" id="v2-research"><div class="section-caption">问题 → 证据 → 原理 <span>RESEARCH</span></div><h3 id="v2-research-question"></h3><p id="v2-research-summary"></p><div id="v2-research-controls"></div><details id="v2-principle"><summary>展开原理与公式</summary><div id="v2-principle-content"></div></details><div class="v2-small-actions"><button id="v2-write">记录这个发现</button><button id="v2-open-mission">换一种方式探索</button></div></section>`);
    document.querySelector('.year-timeline').insertAdjacentHTML('beforebegin',`<div class="v2-context-time"><div class="v2-time-label" id="v2-time-label"></div><div class="v2-time-track"><label for="v2-time-slider" class="sr-only">根据当前主题移动时间</label><input id="v2-time-slider" type="range" min="0" max="10000" value="5000" step="1"><div class="v2-time-endpoints"><span id="v2-time-start"></span><span class="v2-time-center" id="v2-time-current"></span><span id="v2-time-end"></span></div></div><button id="v2-recenter" class="v2-recenter" title="以当前时间重新展开时间轴">定位</button><label class="v2-performance">画质 <select id="v2-quality"><option value="auto">自动</option><option value="high">精细</option><option value="eco">轻量</option></select></label></div>`);
    document.querySelector('.v2-context-time').insertBefore(document.querySelector('.autoslow'),document.querySelector('.v2-performance'));
    document.querySelector('.status-line').insertAdjacentHTML('beforeend','<span id="v2-storage" class="v2-storage-status"></span>');
    document.body.insertAdjacentHTML('beforeend','<dialog id="v2-dialog"><div class="v2-dialog-head"><h2 id="v2-dialog-title"></h2><button id="v2-close" aria-label="关闭对话框">×</button></div><div id="v2-dialog-body"></div></dialog><input type="file" id="v2-import" accept=".json,application/json" hidden>');
  }
  function showDialog(title,html,kind){app.pause();dialogKind=kind;$('v2-dialog-title').textContent=title;$('v2-dialog-body').innerHTML=html;if(!$('v2-dialog').open)$('v2-dialog').showModal();else $('v2-dialog').scrollTop=0;}
  function welcome(){
    const resume=sessionArmed?savedSession:originalSession;
    showDialog('日月地 · 时空实验室 V2',`<div class="v2-welcome"><div class="v2-eyebrow">LET CURIOSITY LEAD THE WAY</div><h3>把好奇，<br>变成发现。</h3><p>一个宇宙，三种探索方式。<br>拨动时间，换个视角，亲手验证你的猜想。</p><img src="${root.ASSETS.earth}" alt="示意地球纹理"></div><div class="v2-entrances">
      <button data-enter="research"><span class="number">01 /</span><strong>自由研究 ↗</strong><p>对照实验、实时数据与公式。<br>不只看见，还要问清为什么。</p></button>
      <button data-enter="kid"><span class="number">02 /</span><strong>小小探索员 ↗</strong><p>先猜一猜，再动动手。<br>找到属于你自己的宇宙秘密！</p></button>
      <button data-enter="family"><span class="number">03 /</span><strong>亲子共玩 ↗</strong><p>一个提问，一个掌舵。<br>轮流当老师，一起留下新发现。</p></button></div><div class="v2-welcome-footer"><span>本机离线运行 · 不登录 · 不上传位置或手记</span>${resume?'<button id="v2-resume">继续上次探索 ↗</button>':''}</div>`, 'welcome');
    $('v2-dialog-body').querySelectorAll('[data-enter]').forEach(b=>b.onclick=()=>{sessionArmed=true;setAudience(b.dataset.enter);$('v2-dialog').close();if(v.audience!=='research')setTopic(v.topic,{prepare:true,remember:true});saveSession();});
    if($('v2-resume'))$('v2-resume').onclick=()=>run(()=>{sessionArmed=true;restoreEntry(resume);$('v2-dialog').close();notice('已恢复上次探索，并保持暂停。');});
  }
  function preference(){store.put('preferences',{audience:v.audience,quality:v.quality,welcomed:true});storageStatus();}
  function setAudience(a,persist=true){
    if(!L.AUDIENCES.includes(a))throw new Error('未知探索方式。');
    v.audience=a;document.body.dataset.audience=a;document.querySelectorAll('.v2-modes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.audience===a)));
    app.setKids(a!=='research');if(root.speechSynthesis)root.speechSynthesis.cancel();renderGuide();renderResearch();dirty=true;if(persist)preference();
  }
  function resetWindow(){
    const s=live();let e=s.selected?.local?.contacts?.length?s.selected.local:s.selected?.event;
    if(e&&(s.state.time<(e.start||e.time)-DAY||s.state.time>(e.end||e.time)+DAY))e=null;
    windowRange=L.timeWindow(v.topic,s.state.time,s.state.zone,v.topic==='eclipse'?e:null);updateTimeline();
  }
  function setTopic(topic,options={}){
    if(!topics[topic])return;const {prepare=true,remember:save=true,resetMission=true}=options;
    if(save)remember();app.pause();v.topic=topic;v.mobileRight=false;if(prepare)v.split=true;
    if(prepare){
      app.restoreReality(false);
      if(topic==='eclipse'){
        v.eclipseKind='solar';const c=E.catalog[1],e=E.solarEvent(Date.parse(c.date+'T00:00:00Z'));
        if(e)app.enterEvent(e,c.title,c.observer);
        if(v.audience!=='research'){const s=live();app.setTime((s.selected?.local?.start||s.selected?.event?.start||s.state.time)-5*60000);}
      }else if(topic==='moon'){
        app.clearEvent();app.setTime(Date.UTC(2026,9,16,10));app.setObserver({name:'上海',lat:31.2304,lon:121.4737,height:4});
      }else{
        app.clearEvent();const y=A.clamp(new Date(live().state.time).getUTCFullYear(),1900,2100),summer=E.seasons(y).find(s=>s.name==='夏至');
        if(summer)app.setTime(summer.time);v.tilt=0;
      }
      app.setMode('earthmoon');
      if(topic==='seasons'||topic==='shadow'){const c=app.getScene();c.distance=23;c.azimuth=.65;c.elevation=.25;}
      if(topic==='eclipse'&&!app.getScene().isFallback){const c=app.getScene(),sun=A.toWorld(live().physics.sun,live().physics.eps);c.azimuth=Math.atan2(sun[0],sun[2])+.18;c.elevation=.3;}
      app.setTab(topic==='eclipse'?'events':topic==='moon'?'observe':'seasons');app.setRate(topics[topic].rate);
    }
    lastTab=live().state.tab;
    if(resetMission)mission={step:0,guess:'',observed:false,initialTime:live().state.time,initialTilt:v.tilt,initialHeight:v.height};
    document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));
    $('v2-left-tab').classList.add('active');$('v2-right-tab').classList.remove('active');$('stage').classList.remove('v2-mobile-right');
    setSplit(v.split,false);renderResearch();renderGuide();document.querySelector('.panel-scroll').scrollTop=0;$('v2-guide').scrollTop=0;resetWindow();secondaryKey='';dirty=true;saveSession();
  }
  function setSplit(enabled,reset=true){
    v.split=!!enabled;$('stage').classList.toggle('v2-split',v.split);$('v2-companion').hidden=!v.split;$('v2-mobile-views').hidden=!v.split;
    $('v2-split-toggle').setAttribute('aria-pressed',String(v.split));$('v2-split-toggle').textContent='同步双视图 · '+(v.split?'开':'关');
    if(v.split&&live().state.view==='ground')app.setMode(v.topic==='seasons'||v.topic==='shadow'?'overview':'earthmoon');
    if(!v.split){v.mobileRight=false;$('stage').classList.remove('v2-mobile-right');}
    if(reset)secondaryKey='';requestAnimationFrame(()=>{app.getScene().resize();secondary?.resize();});dirty=true;
  }
  function makeSecondary(type){
    if(type==='shadow'){$('v2-companion-host').hidden=true;$('v2-shadow-canvas').hidden=false;$('v2-reset-second').textContent='杆高归 1 米';return;}
    $('v2-companion-host').hidden=false;$('v2-shadow-canvas').hidden=true;$('v2-reset-second').textContent='重置视角';
    if(!secondary){
      try{secondary=new root.LabScene($('v2-companion-host'),{onError:()=>notice('第二视图显卡资源不足。可切换轻量画质或关闭双视图。')});}
      catch{ $('v2-companion-host').innerHTML='';secondary=new root.LabScene2D($('v2-companion-host'));notice('第二视图已切换为二维兼容画面。'); }
      applyQuality();
    }
  }
  function currentPair(){
    const s=live(),real=s.physics,alt=A.position(s.state.time,{enabled:true,tilt:v.tilt,inclination:s.state.experiment.enabled?s.state.experiment.inclination:5.145});
    return {time:s.state.time,left:{position:real,daylight:A.daylight(s.state.observer.lat,real.sunDeclination),shadow:L.noonShadow(s.state.observer.lat,real.sunDeclination,v.height)},right:{position:alt,daylight:A.daylight(s.state.observer.lat,alt.sunDeclination),shadow:L.noonShadow(s.state.observer.lat,alt.sunDeclination,v.height)}};
  }
  function htext(h){const minutes=Math.round(h*60);return `${Math.floor(minutes/60)} 时 ${String(minutes%60).padStart(2,'0')} 分`;}
  const mtext=s=>s.length===null?'无日光投影':s.length>999?'大于 999 米':s.length.toFixed(2)+' 米';
  function renderResearch(){
    const t=currentTopic();set('v2-research-question',t.title);
    const text={moon:'先沿着太空中的光照方向观察，再与右侧地面月亮对照。月相受光比例与月食亮度不是同一个数。',eclipse:'先检查“所选地点可见吗”，再看遮挡率。下方天象面板保留阶段跳转、真实事件与地点切换。',seasons:'左侧保持当前世界，右侧仅改变地轴倾角。默认左真右假；相同时刻、相同地点，减少变量混淆。',shadow:'看的是所选日期、地点的正午。改变杆高不会改变太阳高度；改变日期会改变日照条件。'};
    set('v2-research-summary',text[v.topic]);
    $('v2-research-controls').innerHTML=controlsMarkup();bindExperimentControls($('v2-research-controls'));
    const descriptions={moon:'<p>太阳照亮月球的一面。我们看到多少亮面，取决于太阳、月球、观察者的空间关系。</p><div class="v2-formula">k = (1 + cos i) / 2<br>i：在月球处，太阳方向与地球方向的夹角</div><p>k 是地心几何受光比例；不是月食期间的亮度。地面视图另计地点视差与地平线；月球朝向与地貌为示意。</p>',
      eclipse:'<p>先用地点视差求日月方向，再比较两者的视半径与中心角距。单看“日月在太空图上重叠”，不能可靠判断日食。</p><div class="v2-formula">视半径 r = asin(天体半径 / 距离)<br>中心角距 d &lt; r太阳 + r月亮 → 可能遮挡</div><p>圆面重叠面积给出太阳遮挡率。还必须检查太阳是否在地平线上方。食带、接触时刻是教学近似，不是专业预报。</p>',
      seasons:'<p>相同纬度，太阳赤纬不同，正午高度与白昼长度便会变化。这里不模拟海洋、天气或完整气候。</p><div class="v2-formula">正午高度 α = 90° − |纬度 φ − 赤纬 δ|<br>白昼 D = 24 arccos(C) / π<br>C = [sin(−0.833°) − sinφ sinδ] / [cosφ cosδ]</div><p>白昼使用简化折射与太阳视半径修正；极昼、极夜单独处理。扶正后的白昼未必恰好是 12 小时，不能忽略这一修正。</p>',
      shadow:'<p>水平地面、竖直立杆，与太阳光线组成直角三角形。杆高保持不变，太阳越高，影子越短。</p><div class="v2-formula">影长 L = 杆高 H / tan α<br>正午 α = 90° − |纬度 φ − 赤纬 δ|</div><p>α ≤ 0° 时没有地面日光投影；α = 90° 时影子缩至杆底。长影子在图中压缩显示，数值不压缩。不计地形与大气折射。</p>'};
    $('v2-principle-content').innerHTML=descriptions[v.topic]+'<table class="v2-facts"><tbody id="v2-fact-rows"></tbody></table>';
  }
  function controlsMarkup(){
    if(v.topic==='seasons')return `<div class="v2-controls"><label>右侧 · 假设地轴倾角 <output class="v2-tilt-value">${v.tilt.toFixed(1)}°</output></label><input class="v2-tilt" type="range" min="0" max="45" step=".1" value="${v.tilt}" aria-label="右侧假设地轴倾角"><div class="v2-caption">0° 是扶正地轴。只改变右边，不篡改真实星历。</div><div class="v2-small-actions"><button class="v2-upright">扶正为 0°</button><button class="v2-match">与真实倾角相同</button></div></div>`;
    if(v.topic==='shadow')return `<div class="v2-controls"><label>立杆高度 <output class="v2-height-value">${v.height.toFixed(1)} 米</output></label><input class="v2-height" type="range" min=".1" max="5" step=".1" value="${v.height}" aria-label="立杆高度"><div class="v2-caption">只改杆高，再只改日期。观察影长的比例变化。</div><div class="v2-small-actions"><button class="v2-compare-city">切换上海 / 悉尼</button></div></div>`;
    return '';
  }
  function bindExperimentControls(host){
    host.querySelectorAll('.v2-tilt').forEach(el=>el.oninput=()=>{v.tilt=Number(el.value);document.querySelectorAll('.v2-tilt-value').forEach(e=>e.textContent=v.tilt.toFixed(1)+'°');document.querySelectorAll('.v2-tilt').forEach(e=>{if(e!==el)e.value=v.tilt;});markObserved();dirty=true;});
    host.querySelectorAll('.v2-height').forEach(el=>el.oninput=()=>{v.height=Number(el.value);document.querySelectorAll('.v2-height-value').forEach(e=>e.textContent=v.height.toFixed(1)+' 米');document.querySelectorAll('.v2-height').forEach(e=>{if(e!==el)e.value=v.height;});markObserved();dirty=true;});
    host.querySelectorAll('.v2-upright').forEach(b=>b.onclick=()=>{v.tilt=0;renderResearch();renderGuide();markObserved();dirty=true;});
    host.querySelectorAll('.v2-match').forEach(b=>b.onclick=()=>{v.tilt=A.position(live().state.time).eps;renderResearch();renderGuide();markObserved();dirty=true;notice('右侧倾角已取当前真实值。两边日照条件应当相近。');});
    host.querySelectorAll('.v2-compare-city').forEach(b=>b.onclick=()=>{remember();const o=live().state.observer;app.setObserver(o.lat<0?{name:'上海',lat:31.2304,lon:121.4737,height:4}:{name:'悉尼',lat:-33.8688,lon:151.2093,height:58});markObserved(true);dirty=true;});
  }
  function renderGuide(){
    const t=currentTopic(),step=mission.step,role=v.audience==='family',host=$('v2-guide');
    const headings=['先猜一猜','动手找证据','说说你的发现','留下一张发现卡','发现已收进手记'];
    let content='';
    if(step===0)content=`<p>猜错也没关系。科学发现，可以从“我还不知道”开始。</p>${t.choices.map((c,i)=>`<button class="v2-choice ${mission.guess===c?'selected':''}" data-guess="${i}">${esc(c)}</button>`).join('')}<button id="v2-next" class="v2-next" ${mission.guess?'':'disabled'}>带着猜想，去验证 →</button>`;
    else if(step===1)content=`<p>${esc(t.observe)}</p><div class="v2-soft"><p>我的猜想：${esc(mission.guess)}</p></div>${controlsMarkup()}${role?`<div class="v2-soft"><p>当前驾驶员：${mission.driver==='parent'?'爸爸':'孩子'}</p><button id="v2-swap-driver" class="v2-voice">交换驾驶员</button></div>`:''}<div class="v2-small-actions"><button id="v2-step-time">${t.task}</button><button id="v2-try-again">回到起点</button></div><p id="v2-observed-text" class="v2-foot">${mission.observed?'已经改变了条件。你看见什么变化？':'动一动时间或实验参数，再比较前后。'}</p><button id="v2-next" class="v2-next" ${mission.observed?'':'disabled'}>我观察到了，继续 →</button>`;
    else if(step===2)content=`<p>${esc(t.explain)}</p><div class="v2-soft"><p>${role?'轮到孩子当小老师：先用自己的话讲给爸爸听。爸爸只补充，不抢答。':'试着用自己的话说一说：“我改了……，发现……”'}</p></div><div class="v2-small-actions"><button id="v2-reobserve">再看一次</button><button id="v2-next" class="v2-next">把发现留下来 →</button></div>`;
    else if(step===3)content=`<p>不用写标准答案。留下你看到的变化，也可以画面配上一句话。</p><div class="v2-soft"><p>“我刚才猜……，后来发现……”<br>“我还想知道……”</p></div><button id="v2-guide-save" class="v2-next">写我的发现卡 →</button><p class="v2-foot">只保存在这个浏览器；导出备份才能带到另一台设备。</p>`;
    else content='<p>这次发现已经收好了。不是因为你答得快，而是因为你认真看、动手试、愿意表达。</p><button id="v2-show-book" class="v2-next">看看我们的发现 →</button><div class="v2-small-actions"><button id="v2-restart">再探索一次</button></div>';
    host.innerHTML=`<div class="v2-kicker"><span>${role?'TOGETHER / 一起发现':'EXPLORER / 小小探索员'}</span><button id="v2-voice" class="v2-voice" title="只使用设备本地中文语音">听一听</button></div><div class="v2-progress" aria-label="第 ${Math.min(step+1,4)} 步，共 4 步">${[0,1,2,3].map(i=>`<span class="${i<=step?'on':''}"></span>`).join('')}</div><div class="section-caption">${headings[step]}</div><h3>${esc(t.title)}</h3>${role?`<div class="v2-role">${esc(step<2?t.family:'轮流当小老师 · 先让孩子说，再一起验证。')}</div>`:''}${content}${v.topic==='eclipse'?'<p class="v2-safety">我们只在屏幕里看太阳。现实中不要直接盯太阳，也不要用普通望远镜看太阳。</p>':''}<div class="v2-links"><button id="v2-guide-home">换一种探索方式 ↗</button></div>`;
    host.querySelectorAll('[data-guess]').forEach(b=>b.onclick=()=>{mission.guess=t.choices[Number(b.dataset.guess)];renderGuide();});
    if($('v2-next'))$('v2-next').onclick=()=>{if(mission.step===0&&!mission.guess||mission.step===1&&!mission.observed)return;mission.step++;renderGuide();saveSession();};
    if($('v2-step-time'))$('v2-step-time').onclick=()=>stepTime(1);
    if($('v2-swap-driver'))$('v2-swap-driver').onclick=()=>{mission.driver=mission.driver==='parent'?'child':'parent';renderGuide();};
    if($('v2-try-again'))$('v2-try-again').onclick=()=>{app.setTime(mission.initialTime);v.tilt=mission.initialTilt;v.height=mission.initialHeight;mission.observed=false;renderGuide();renderResearch();dirty=true;};
    if($('v2-reobserve'))$('v2-reobserve').onclick=()=>{mission.step=1;renderGuide();};
    if($('v2-guide-save'))$('v2-guide-save').onclick=()=>writeNote(null,true);
    if($('v2-show-book'))$('v2-show-book').onclick=notebook;
    if($('v2-restart'))$('v2-restart').onclick=()=>setTopic(v.topic);
    $('v2-guide-home').onclick=welcome;$('v2-voice').onclick=speakGuide;bindExperimentControls(host);
  }
  function markObserved(force=false){
    if(mission.step!==1)return;
    const changed=force||Math.abs(live().state.time-mission.initialTime)>1000||Math.abs(v.tilt-mission.initialTilt)>.01||Math.abs(v.height-mission.initialHeight)>.01;
    if(changed&&!mission.observed){mission.observed=true;set('v2-observed-text','已经改变了条件。你看见什么变化？');if($('v2-next'))$('v2-next').disabled=false;}
  }
  function speakGuide(){
    if(!root.speechSynthesis||!root.SpeechSynthesisUtterance){notice('此浏览器不支持朗读，文字讲解仍可使用。');return;}
    const voice=root.speechSynthesis.getVoices().find(x=>x.localService&&/^zh(-|_)/i.test(x.lang));
    if(!voice){notice('没有找到设备本地中文语音。为保持离线，不会调用云端配音。');return;}
    root.speechSynthesis.cancel();const t=currentTopic(),text=t.title+'。'+(mission.step===0?'先选一个猜想。猜错也没关系，我们可以动手验证。':mission.step===1?t.observe:mission.step===2?t.explain:'用自己的话写下今天的发现。');
    const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=.9;u.onerror=()=>notice('本地语音未能播放，可以继续阅读文字。');root.speechSynthesis.speak(u);
  }
  function stepTime(direction){
    app.setTime(live().state.time+direction*windowRange.step);markObserved();if(live().state.time<windowRange.start||live().state.time>windowRange.end)resetWindow();dirty=true;
  }
  function updateTimeline(){
    if(!windowRange)return;const s=live().state,t=s.time,ratio=(t-windowRange.start)/Math.max(1,windowRange.end-windowRange.start);
    if(document.activeElement!==$('v2-time-slider'))$('v2-time-slider').value=Math.round(A.clamp(ratio,0,1)*10000);
    set('v2-time-label',windowRange.label);const fmt=time=>A.formatTime(time,s.zone,false).slice(v.topic==='eclipse'?5:0,v.topic==='eclipse'?16:10);
    set('v2-time-start',fmt(windowRange.start));set('v2-time-end',fmt(windowRange.end));set('v2-time-current',A.formatTime(t,s.zone,false));
    const step=v.topic==='eclipse'?'5 分钟':v.topic==='moon'?'1 天':'7 天';$('previous-day').title='前进方向的反向一步：'+step;$('previous-day').setAttribute('aria-label','向前回退 '+step);$('next-day').title='往后 '+step;$('next-day').setAttribute('aria-label','向后推进 '+step);
  }
  function qualityValue(){return v.quality==='eco'||v.quality==='auto'&&v.autoEco?'eco':'high';}
  function applyQuality(){
    const eco=qualityValue()==='eco';for(const scene of [app.getScene(),secondary]){if(!scene||scene.isFallback)continue;scene.renderer.setPixelRatio(eco?.85:Math.min(root.devicePixelRatio||1,1.5));scene.stars.geometry.setDrawRange(0,eco?450:1600);scene.resize();}dirty=true;
  }
  let lastCameraKey='';
  function shouldRender(now){
    if(document.hidden)return false;
    // Paused means no continuous GPU work. Pointer/zoom changes still wake both
    // views immediately; a slow heartbeat also catches asynchronous texture loads.
    const key=[app.getScene(),secondary].map(s=>s?[s.azimuth,s.elevation,s.distance,s.camera?.fov,s.width,s.height,s.focus,s.tracking,s.cameraManual].join(':'):'').join('|');
    const moved=key!==lastCameraKey;
    if(now-lastRender<(qualityValue()==='eco'?32:0))return false;
    if(!live().state.playing&&!dirty&&!moved&&now-lastRender<750)return false;
    lastCameraKey=key;return true;
  }
  function updateLabelsAndMetrics(){
    const s=live(),p=s.physics,l=s.local,t=currentTopic(),o=s.state.observer;
    set('view-title',v.audience==='research'?t.adult:t.title);set('view-subtitle',v.audience==='research'?(v.topic==='seasons'&&p.experiment?'A、B 都是假设状态；B 沿用 A 的其他条件，只改变地轴倾角。':t.subtitle):'先猜一猜，再拨动时间，看看会发生什么。');set('view-overline',v.audience==='research'?'SUN · EARTH · MOON / '+v.topic.toUpperCase():v.audience==='family'?'A DISCOVERY TO SHARE / 共同发现':'FOLLOW YOUR CURIOSITY / 跟着好奇出发');
    set('v2-main-label',t.caption);set('v2-secondary-label',t.right+(v.topic==='seasons'?' · '+v.tilt.toFixed(1)+'°':''));set('v2-left-tab',v.topic==='seasons'?'真实地球':'太空视角');set('v2-right-tab',v.topic==='seasons'?'假设地球':v.topic==='shadow'?'正午影子':'地面视角');
    let rows='';
    if(v.topic==='moon'){
      set('v2-left-metric-title','月相 · 地心受光比例');set('v2-left-metric', (p.fraction*100).toFixed(1)+'%');set('v2-left-extra',A.phaseName(p.phase)+' · '+(p.phase<180?'渐盈':'渐亏'));
      set('v2-right-metric-title',o.name+' · 月亮高度');set('v2-right-metric',l.moon.alt.toFixed(1)+'°');set('v2-right-extra',l.moonVisible?'地平线上方':'此地暂时看不到月亮');
      set('v2-evidence','月相来自受光面与观察角度；地面是否可见另看地平线。');rows=`<tr><td>月相受光 k</td><td>${(p.fraction*100).toFixed(2)}%</td></tr><tr><td>月地距离</td><td>${Math.round(p.moonDistance).toLocaleString()} km</td></tr><tr><td>月亮方位角</td><td>${l.moon.az.toFixed(1)}°</td></tr>`;
    }else if(v.topic==='eclipse'){
      const lunar=v.eclipseKind==='lunar',g=lunar?A.lunar(p):A.globalSolar(p),visible=lunar?l.moonVisible:l.solarVisible;
      set('v2-left-metric-title','全球 · 当前几何状态');set('v2-left-metric',g.type);set('v2-left-extra',s.state.experiment.enabled?'假设实验，非真实预测':'星历时刻 '+A.formatTime(p.time,s.state.zone,false).slice(11));
      set('v2-right-metric-title',o.name+(lunar?' · 本影覆盖':' · 太阳遮挡率'));set('v2-right-metric',((lunar?g.coverage:l.solarCoverage)*100).toFixed(1)+'%');set('v2-right-extra',visible?(lunar?'月亮在地平线上方':l.solarType):'目标在地平线下，不可见');
      set('v2-evidence','大小 / 距离放大不参与食计算；几何可见 ≠ 天气适合。切勿直接看太阳。');rows=`<tr><td>日月中心角距</td><td>${(l.separation/A.RAD).toFixed(3)}°</td></tr><tr><td>太阳视直径</td><td>${(l.sunRadius*2/A.RAD).toFixed(3)}°</td></tr><tr><td>月球视直径</td><td>${(l.moonRadius*2/A.RAD).toFixed(3)}°</td></tr>`;
      set('v2-secondary-label',lunar?'地面 · 追踪月亮':'地面 · 追踪太阳');
    }else if(v.topic==='seasons'){
      const pair=currentPair();set('v2-main-label',(p.experiment?'A · 假设':'A · 真实')+'地轴 '+p.eps.toFixed(2)+'°');
      set('v2-left-metric-title',o.name+' · A 的白昼');set('v2-left-metric',htext(pair.left.daylight));set('v2-left-extra','正午高度 '+pair.left.shadow.altitude.toFixed(1)+'°');
      set('v2-right-metric-title',o.name+' · B 的白昼');set('v2-right-metric',htext(pair.right.daylight));set('v2-right-extra','正午高度 '+pair.right.shadow.altitude.toFixed(1)+'°');
      set('v2-evidence',`同一时间、地点；白昼相差 ${Math.abs((pair.right.daylight-pair.left.daylight)*60).toFixed(0)} 分钟。右侧为假设日照，不是气候预测。`);rows=`<tr><td>A 太阳赤纬</td><td>${p.sunDeclination.toFixed(2)}°</td></tr><tr><td>B 太阳赤纬</td><td>${pair.right.position.sunDeclination.toFixed(2)}°</td></tr><tr><td>相同纬度</td><td>${o.lat.toFixed(4)}°</td></tr>`;
    }else{
      const noon=L.noonPosition(s.state.time,o,s.state.zone,s.state.experiment),shadow=L.noonShadow(o.lat,noon.sunDeclination,v.height);set('v2-left-metric-title','所选日期 · 正午太阳高度');set('v2-left-metric',shadow.altitude.toFixed(1)+'°');set('v2-left-extra','正午赤纬 '+noon.sunDeclination.toFixed(1)+'°');
      set('v2-right-metric-title',v.height.toFixed(1)+' 米立杆 · 正午影长');set('v2-right-metric',mtext(shadow));set('v2-right-extra',o.name+' · '+(shadow.visible?'影子朝'+shadow.direction:'太阳在地平线下'));
      set('v2-evidence','右侧按界面日期求当地正午：同日改钟点，正午影长不变。图示可缩放，不是全天影子动画。');rows=`<tr><td>杆高 H</td><td>${v.height.toFixed(1)} m</td></tr><tr><td>正午高度 α</td><td>${shadow.altitude.toFixed(2)}°</td></tr><tr><td>影长 L</td><td>${mtext(shadow)}</td></tr>`;
    }
    if(v.audience!=='research'&&mission.step<2)set('v2-evidence',v.topic==='eclipse'?'先猜，再观察。只能在屏幕里这样看太阳，现实中不可直接观看。':'留下猜想，改变一个条件，再看看两幅画面有什么不同。');
    if($('v2-fact-rows')&&$('v2-fact-rows').innerHTML!==rows)$('v2-fact-rows').innerHTML=rows;
  }
  function frame(now){
    const delta=lastFrame?now-lastFrame:0;lastFrame=now;lastRender=now;
    if(delta>0&&delta<250&&v.quality==='auto'&&!v.autoEco){perfCount++;perfSum+=delta;if(perfCount>=45){if(perfSum/perfCount>45){v.autoEco=true;applyQuality();notice('当前渲染较慢，已自动使用轻量画质；天文计算不受影响。');}perfCount=0;perfSum=0;}}
    const s=live();if(!s.physics)return;
    const eventKey=s.selected?`${s.selected.event.kind}:${s.selected.event.time}`:'';
    if(eventKey&&eventKey!==lastSelectedKey){lastSelectedKey=eventKey;v.eclipseKind=s.selected.event.kind;v.topic='eclipse';document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic==='eclipse')));secondaryKey='';renderResearch();renderGuide();resetWindow();if(v.split&&s.state.view==='ground')app.setMode('earthmoon');}
    if(!eventKey)lastSelectedKey='';
    if(s.state.tab!==lastTab){lastTab=s.state.tab;const topic={observe:'moon',events:'eclipse',seasons:'seasons'}[lastTab];if(topic&&topic!==v.topic&&!(v.topic==='shadow'&&topic==='seasons'))setTopic(topic,{prepare:false,remember:false});}
    // Explicitly choosing the full ground view should not leave two identical ground windows.
    if(s.state.view==='ground'&&v.split)setSplit(false,false);
    const physicalKey=[s.state.time,s.state.observer.lat,s.state.observer.lon,s.state.experiment.enabled,s.state.experiment.tilt,s.state.experiment.inclination,v.tilt,v.height,v.topic,v.split,s.state.zone].join(':');
    const changed=dirty||physicalKey!==lastTimeKey;
    if(windowRange&&document.activeElement!==$('v2-time-slider')&&(s.state.time<windowRange.start||s.state.time>windowRange.end))resetWindow();
    if(v.split){
      const type=topics[v.topic].type;makeSecondary(type);
      if(type==='shadow'){if(changed)D.shadow($('v2-shadow-canvas'),s.state.time,s.state.observer,v.height,s.state.experiment,s.state.zone);}
      else{
        const target=v.topic==='eclipse'&&v.eclipseKind!=='lunar'?'sun':'moon';
        const mode=type==='compare'?(s.state.view==='overview'?'overview':'earthmoon'):'ground';
        const key=mode+':'+target;
        if(key!==secondaryKey){secondary.setMode(mode);if(mode==='ground'){secondary.setTracking(target);secondary.camera.fov=1.25;secondary.camera.updateProjectionMatrix();}secondaryKey=key;dirty=true;}
        if(changed||dirty){const experiment=type==='compare'?{enabled:true,tilt:v.tilt,inclination:s.state.experiment.enabled?s.state.experiment.inclination:5.145}:s.state.experiment;
          const p=type==='compare'?A.position(s.state.time,experiment):s.physics,l=type==='compare'?A.local(p,s.state.observer):s.local;
          secondary.update(p,l,s.state.observer,{...s.state.layers,scale:s.state.scale,realScale:mode==='ground'?false:s.state.realScale,experiment,inclination:experiment.inclination});
        }
        if(type==='compare'&&!secondary.isFallback&&!app.getScene().isFallback){const c=app.getScene();secondary.azimuth=c.azimuth;secondary.elevation=c.elevation;secondary.distance=c.distance;secondary.camera.fov=c.camera.fov;secondary.camera.updateProjectionMatrix();}
        if(!root.matchMedia('(max-width:800px)').matches||v.mobileRight)secondary.render();
      }
    }
    if(now-lastUpdate>180||dirty){updateLabelsAndMetrics();updateTimeline();markObserved();lastUpdate=now;storageStatus();}
    if(changed){lastTimeKey=physicalKey;if(!s.state.playing&&now-autosaveAt>1500){saveSession();autosaveAt=now;}}
    dirty=false;
  }
  function storageStatus(){
    const warning=!!store.error;set('v2-note-count',book.length);set('v2-storage',warning?'⚠ 记得导出备份':store.persistent?'仅本机保存 · 可导出备份':'临时模式 · 请导出备份');$('v2-storage').classList.toggle('warning',warning||!store.persistent);$('v2-storage').title=store.error||(location.protocol==='file:'?'直接打开文件时，浏览器存储行为因环境而异。换文件路径或浏览器可能无法读取原记录，重要发现请导出 JSON。':'记录存放在此浏览器，不会自动上传。');
  }
  function saveSession(){
    if(!root.LabV2||!sessionArmed)return;const session={scene:app.getState(),context:context(),mission:{...mission},savedAt:Date.now()};store.put('session',session);savedSession=session;lastSessionValid=true;storageStatus();
  }
  function persistBook(){const ok=store.put('book',{format:'sem-lab-notebook',version:2,notes:book});storageStatus();return ok;}
  function drawContain(x,img,left,top,width,height){const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;if(!iw||!ih)return;const k=Math.min(width/iw,height/ih);x.drawImage(img,left+(width-iw*k)/2,top+(height-ih*k)/2,iw*k,ih*k);}
  function thumbnail(){
    try{const raw=app.getScene().renderer.domElement,c=document.createElement('canvas');c.width=480;c.height=270;const x=c.getContext('2d');x.fillStyle='#0b1a24';x.fillRect(0,0,480,270);drawContain(x,raw,0,0,480,270);return c.toDataURL('image/jpeg',.65);}catch{return '';}
  }
  function noteData(form,old=null){
    const val=id=>$(id).value.trim();if(!val('v2-note-finding'))throw new Error('先写下一句你真正观察到的变化，再保存。');
    const note={id:old?.id||(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)),created:old?.created||Date.now(),title:val('v2-note-title')||currentTopic().title,guess:val('v2-note-guess'),finding:val('v2-note-finding'),question:val('v2-note-question'),outdoor:val('v2-note-outdoor'),scene:old?.scene||app.getState(),context:old?.context||context(),thumbnail:old?.thumbnail||thumbnail()};
    return L.validateNote(note,app.validateSnapshot);
  }
  function writeNote(old=null,fromGuide=false){
    const title=old?.title||currentTopic().title,guess=old?.guess||mission.guess||'';
    showDialog(old?'编辑发现':'把这一刻，变成自己的发现',`<p class="v2-dialog-lead">不替你写标准答案。记录猜想、改变的条件和真正观察到的变化。${old?'修改文字不会改变原先保存的场景。':'保存时同时留下日期、地点、视角和实验条件。'}</p><form id="v2-note-form"><div class="v2-note-form"><label class="wide">发现的名字<input id="v2-note-title" maxlength="100" value="${esc(title)}" required></label><label>我原来的猜想<textarea id="v2-note-guess" maxlength="1200" placeholder="我猜，如果……，就会……">${esc(guess)}</textarea></label><label>我动手后发现了什么 *<textarea id="v2-note-finding" maxlength="1200" placeholder="我只改了……，发现……" required>${esc(old?.finding||'')}</textarea></label><label>我还想知道<textarea id="v2-note-question" maxlength="1200" placeholder="下一次，我想再试试……">${esc(old?.question||'')}</textarea></label><label>现实中的观察（可留空）<textarea id="v2-note-outdoor" maxlength="1200" placeholder="今晚在窗边看月亮，实际看到……">${esc(old?.outdoor||'')}</textarea></label></div><div class="v2-note-actions"><button class="primary" type="submit">保存发现卡</button><button type="button" id="v2-save-card-only">导出当前发现图</button></div><p class="v2-note-error" id="v2-note-error" role="status"></p></form><p class="v2-dialog-lead">只在本机保存。备份包含你选定的地点 / 经纬度与填写的文字，请自己决定分享给谁。</p>`, 'write');
    $('v2-note-form').onsubmit=e=>{e.preventDefault();try{const note=noteData(null,old),index=book.findIndex(n=>n.id===note.id);if(index<0&&book.length>=40)throw new Error('手记已满 40 条，请先导出备份，再整理旧记录。');if(index>=0)book[index]=note;else book.unshift(note);const ok=persistBook();if(fromGuide){mission.step=4;renderGuide();}saveSession();$('v2-dialog').close();notice(ok?'发现已保存在这个浏览器。记得导出备份，才能换设备继续。':'本次仅暂存；请立刻打开“探索手记”导出备份。');}catch(error){set('v2-note-error',error.message);}};
    $('v2-save-card-only').onclick=()=>run(async()=>{const n=noteData(null,old);await exportCard(n);set('v2-note-error','已导出发现图。文字尚未保存到手记，请继续点击“保存发现卡”。');});
  }
  function notebook(){
    showDialog('探索手记 · '+book.length+' / 40',`<p class="v2-dialog-lead">留下的不是分数，而是一次真正的发现。可以继续原现场、编辑文字，也可以导出备份带到另一台设备。</p><div class="v2-note-actions"><button class="primary" id="v2-new-note">记录当前发现</button><button id="v2-export-book">导出全部备份</button><button id="v2-import-book">导入备份 / V1 场景</button>${deletedNote?'<button id="v2-undo-delete">撤销刚才删除</button>':''}</div><p class="v2-note-error" id="v2-book-error">${esc(store.error)}</p><div class="v2-notes-list">${book.length?book.map((n,i)=>`<article class="v2-note-card">${n.thumbnail?`<img src="${n.thumbnail}" alt="这次探索保存的太空画面">`:''}<div><h3>${esc(n.title)}</h3><time>${esc(A.formatTime(n.scene.time,n.scene.zone,false))} · ${esc(n.scene.observer.name)}</time><div class="v2-pillrow"><span>${names[n.context.audience]}</span><span>${topics[n.context.topic].name}</span><span>${n.scene.experiment.enabled?'假设实验':'真实场景'}</span></div><p>${esc(n.finding)}</p>${n.question?`<p>还想知道：${esc(n.question)}</p>`:''}<div class="v2-links"><button data-note-open="${i}">继续现场 ↗</button><button data-note-edit="${i}">编辑</button><button data-note-card="${i}">发现图</button><button data-note-delete="${i}" class="delete">删除</button></div></div></article>`).join(''):'<div class="v2-empty">这里还没有记录。<br>从一个问题开始，亲手做一次实验，<br>再用自己的话写下发现。</div>'}</div>`, 'book');
    $('v2-new-note').onclick=()=>writeNote();$('v2-export-book').onclick=exportBook;$('v2-import-book').onclick=()=>$('v2-import').click();
    if($('v2-undo-delete'))$('v2-undo-delete').onclick=()=>run(()=>{if(book.length>=40)throw new Error('手记已满，暂时无法撤销。');book=L.mergeNotes(book,[deletedNote]);deletedNote=null;persistBook();notebook();});
    $('v2-dialog-body').querySelectorAll('[data-note-open]').forEach(b=>b.onclick=()=>run(()=>{const n=book[Number(b.dataset.noteOpen)];remember();restoreEntry({scene:n.scene,context:n.context});$('v2-dialog').close();notice('回到这张发现卡的现场；时间保持暂停。');}));
    $('v2-dialog-body').querySelectorAll('[data-note-edit]').forEach(b=>b.onclick=()=>writeNote(book[Number(b.dataset.noteEdit)]));
    $('v2-dialog-body').querySelectorAll('[data-note-card]').forEach(b=>b.onclick=()=>run(()=>exportCard(book[Number(b.dataset.noteCard)])));
    $('v2-dialog-body').querySelectorAll('[data-note-delete]').forEach(b=>b.onclick=()=>{const index=Number(b.dataset.noteDelete);if(!root.confirm('删除这张发现卡？可以在本次打开的手记中撤销；更稳妥的做法是先导出备份。'))return;deletedNote=book.splice(index,1)[0];persistBook();notebook();});
  }
  function download(blob,name){const url=typeof blob==='string'?blob:URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();if(url.startsWith('blob:'))setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function exportBook(){download(new Blob([JSON.stringify({format:'sem-lab-notebook',version:2,exportedAt:new Date().toISOString(),notes:book},null,2)],{type:'application/json'}),'日月地-V2-探索手记.json');notice('已导出手记备份，含场景、文字及所选经纬度。文件不会自动上传。');}
  async function importBook(file){
    if(file.size>8*1024*1024)throw new Error('备份不能超过 8 MB。');const payload=JSON.parse(await file.text());
    if(payload.version===1&&!payload.format){app.validateSnapshot(payload);remember();app.restoreSnapshot(payload);v.topic=payload.tab==='events'?'eclipse':payload.tab==='seasons'?'seasons':'moon';v.eclipseKind=A.lunar(live().physics).type!=='无月食'?'lunar':'solar';setTopic(v.topic,{prepare:false,remember:false});$('v2-dialog').close();notice('V1 场景已导入，仍使用原时间、地点和镜头；V2 增强功能可继续使用。');return;}
    const notes=L.validateBook(payload,app.validateSnapshot),merged=L.mergeNotes(book,notes),added=merged.length-book.length;book=merged;persistBook();notebook();set('v2-book-error',`已合并 ${added} 条新记录。相同标识不重复导入，也不覆盖已有文字。`);
  }
  function wrapText(x,text,maxWidth){
    const lines=[];for(const paragraph of String(text).split('\n')){let line='';for(const ch of paragraph){if(x.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;}else line+=ch;}lines.push(line);}return lines;
  }
  async function exportCard(note){
    const c=document.createElement('canvas');c.width=1200;const x=c.getContext('2d');x.font='25px "Microsoft YaHei",sans-serif';
    const blocks=[['原来的猜想',note.guess],['我观察到的变化',note.finding],['还想知道',note.question],['现实中的观察',note.outdoor]].filter(([,s])=>s),prepared=blocks.map(([title,s])=>[title,wrapText(x,s,1080)]);c.height=1050+prepared.reduce((a,[,lines])=>a+lines.length*40+78,0);
    x.fillStyle='#0b1c29';x.fillRect(0,0,c.width,c.height);x.fillStyle='#a1d4c4';x.font='18px "Microsoft YaHei",sans-serif';x.fillText('日月地 · 时空实验室 V2 / 我们的发现',60,55);
    x.fillStyle='#edf0df';x.font='bold 36px "Microsoft YaHei",sans-serif';const titles=wrapText(x,note.title,1080);titles.forEach((line,i)=>x.fillText(line,60,112+i*46));
    x.fillStyle='#a5bfca';x.font='20px "Microsoft YaHei",sans-serif';const titleOffset=Math.max(0,titles.length-1)*46;x.fillText(A.formatTime(note.scene.time,note.scene.zone,false)+' · '+note.scene.observer.name+' · '+names[note.context.audience],60,166+titleOffset);
    if(note.thumbnail){const im=new Image();await new Promise(resolve=>{im.onload=resolve;im.onerror=resolve;im.src=note.thumbnail;});if(im.complete&&im.naturalWidth)drawContain(x,im,60,200+titleOffset,1080,405);}
    let y=660+titleOffset;for(const [title,lines] of prepared){x.fillStyle='#e3c78e';x.font='20px "Microsoft YaHei",sans-serif';x.fillText(title,60,y);y+=40;x.fillStyle='#d2e1e2';x.font='25px "Microsoft YaHei",sans-serif';for(const line of lines){x.fillText(line,60,y);y+=40;}y+=38;}
    x.fillStyle='#8da9b5';x.font='17px "Microsoft YaHei",sans-serif';x.fillText('教学可视化，非专业观测预报。图中大小与距离可能放大；地貌为示意。',60,c.height-76);x.fillText('场景日期与地点随卡保留；私人发现，请自行决定分享对象。',60,c.height-42);
    download(c.toDataURL('image/png'),'日月地-V2-发现卡.png');notice('发现图已导出。完整文字与可恢复场景请同时保留 JSON 备份。');
  }
  function captureBoth(){
    const s=live();app.pause();frame(performance.now());const left=app.getScene().renderer.domElement,comp=v.topic==='shadow'?$('v2-shadow-canvas'):secondary?.renderer.domElement;
    const c=document.createElement('canvas');c.width=1600;c.height=1000;const x=c.getContext('2d');x.fillStyle='#0a1a27';x.fillRect(0,0,1600,1000);x.fillStyle='#e2ece3';x.font='32px "Microsoft YaHei",sans-serif';x.fillText('日月地 V2 · '+currentTopic().adult,48,58);x.fillStyle='#a0bfca';x.font='20px "Microsoft YaHei",sans-serif';x.fillText(A.formatTime(s.state.time,s.state.zone,true)+' · UTC'+(s.state.zone>=0?'+':'')+s.state.zone+' · '+s.state.observer.name,48,98);
    drawContain(x,left,35,160,v.split?755:1530,640);if(v.split&&comp)drawContain(x,comp,810,160,755,640);
    x.fillStyle='#b4dfce';x.font='22px "Microsoft YaHei",sans-serif';x.fillText($('v2-main-label').textContent,48,143);if(v.split)x.fillText($('v2-secondary-label').textContent,823,143);
    x.font='22px "Microsoft YaHei",sans-serif';x.fillText($('v2-left-metric-title').textContent+'：'+$('v2-left-metric').textContent,48,842);if(v.split)x.fillText($('v2-right-metric-title').textContent+'：'+$('v2-right-metric').textContent,823,842);
    x.fillStyle='#cab585';x.font='19px "Microsoft YaHei",sans-serif';wrapText(x,$('v2-evidence').textContent,1500).forEach((t,i)=>x.fillText(t,48,894+i*28));x.fillStyle='#9bb1bc';x.fillText(v.topic==='seasons'?'教学放大不影响天文计算；右侧为假设日照，不是气候预测。':v.topic==='shadow'?'右侧为所选日期的正午几何；图示可以缩放，不是全天影子动画。':'教学放大不影响天文计算；地貌 / 天气 / 日冕为示意，非专业观测预报。',48,962);
    download(c.toDataURL('image/png'),'日月地-V2-同步双视图.png');notice('已导出同一时刻的观测对照图。');
  }
  function bind(){
    document.querySelectorAll('.v2-modes button').forEach(b=>b.onclick=()=>{sessionArmed=true;remember();setAudience(b.dataset.audience);saveSession();});
    document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>run(()=>setTopic(b.dataset.topic)));
    $('v2-home').onclick=welcome;$('v2-notebook').onclick=notebook;$('v2-write').onclick=()=>writeNote();$('v2-open-mission').onclick=welcome;$('tour-btn').onclick=welcome;
    $('v2-close').onclick=()=>$('v2-dialog').close();$('v2-dialog').addEventListener('close',()=>{
      // Dismissing the startup chooser must not overwrite a previous session
      // with the default demonstration. Explicit entrance choices still apply.
      if(!sessionArmed&&originalSession&&dialogKind==='welcome')run(()=>restoreEntry(originalSession));
      sessionArmed=true;preference();saveSession();if(root.speechSynthesis)root.speechSynthesis.cancel();
    });
    $('v2-dialog').addEventListener('click',e=>{if(e.target!==$('v2-dialog'))return;const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();});
    $('v2-back').onclick=()=>run(back);$('v2-split-toggle').onclick=()=>{setSplit(!v.split);saveSession();};
    $('v2-left-tab').onclick=()=>{v.mobileRight=false;$('stage').classList.remove('v2-mobile-right');$('v2-left-tab').classList.add('active');$('v2-right-tab').classList.remove('active');dirty=true;};
    $('v2-right-tab').onclick=()=>{v.mobileRight=true;$('stage').classList.add('v2-mobile-right');$('v2-right-tab').classList.add('active');$('v2-left-tab').classList.remove('active');secondary?.resize();dirty=true;};
    $('v2-reset-second').onclick=()=>{if(v.topic==='shadow'){v.height=1;renderResearch();renderGuide();dirty=true;}else secondary?.reset();};
    $('v2-time-slider').oninput=()=>{app.setTime(L.timeAt(windowRange,Number($('v2-time-slider').value)));markObserved();dirty=true;};
    $('v2-time-slider').onchange=()=>saveSession();$('v2-recenter').onclick=()=>resetWindow();$('previous-day').onclick=()=>stepTime(-1);$('next-day').onclick=()=>stepTime(1);
    $('v2-quality').value=v.quality;$('v2-quality').onchange=()=>{v.quality=$('v2-quality').value;v.autoEco=false;perfCount=0;perfSum=0;applyQuality();preference();notice('画质只影响渲染，不改变天体位置和天文事件。');};
    $('v2-import').onchange=async()=>{const file=$('v2-import').files[0];if(!file)return;try{await importBook(file);}catch(e){if($('v2-book-error'))set('v2-book-error','导入未完成：'+e.message);notice('导入未完成：'+e.message);}finally{$('v2-import').value='';}};
    $('capture-btn').onclick=()=>run(captureBoth);$('save-btn').onclick=()=>writeNote();$('save-btn').title='记录当前发现与 V2 双视图实验';$('save-btn').setAttribute('aria-label','记录当前发现与 V2 双视图实验');
    for(const [id,action] of [['zoom-in','in'],['zoom-out','out'],['reset-camera','reset']])$(id).onclick=()=>{const target=v.mobileRight&&v.split&&topics[v.topic].type==='ground'?secondary:app.getScene();if(!target)return;if(action==='reset')target.reset();else target.zoom(action==='in'?.82:1.22);dirty=true;};
    // Remember intentional navigation, not every animation frame or slider tick.
    for(const id of ['date-input','now-btn','event-catalog','season-buttons','import-file'])$(id).addEventListener(id==='date-input'?'change':'click',()=>remember(),true);
    $('timezone').addEventListener('change',()=>{resetWindow();dirty=true;});
    root.addEventListener('resize',()=>{dirty=true;});root.addEventListener('pagehide',saveSession);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveSession();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('sidebar').classList.contains('open')){$('sidebar').classList.remove('open');$('mobile-shade').hidden=true;}if(document.querySelector('dialog[open]')||['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName))return;if(e.key==='n'||e.key==='N'){e.preventDefault();writeNote();}});
  }
  makeLayout();bind();setAudience(v.audience,false);setTopic('moon',{prepare:!hadSession,remember:false});applyQuality();
  root.LabV2={frame,shouldRender,markDirty:()=>dirty=true,getState:()=>({...context(),quality:v.quality,autoEco:v.autoEco,mobileRight:v.mobileRight,mission:{...mission},window:{...windowRange},notes:book.length,history:history.length,storage:store.persistent}),setAudience,setTopic,setSplit,saveSession,getSecondary:()=>secondary,getComparison:currentPair,getNotes:()=>JSON.parse(JSON.stringify(book)),getSession:()=>store.get('session'),restoreEntry,back,welcome,notebook,writeNote,importBook,captureBoth,exportBook};
  frame(performance.now());
  if(!storedPreferences.welcomed||hadSession)setTimeout(()=>{if(!document.querySelector('dialog[open]'))welcome();},500);
  else {sessionArmed=true;saveSession();}
})(globalThis);
