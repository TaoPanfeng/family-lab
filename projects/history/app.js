(function () {
  'use strict';
  const C = window.HistoryCore, E = C.escapeHTML;
  const DATA = window.HISTORY_CONTENT, ATLAS = window.HISTORY_ATLAS, LEARN = window.HISTORY_LEARNING;
  if (!DATA || !window.EARLY_RULERS || !window.LATE_RULERS || !ATLAS || !LEARN || !window.LAND_GEOMETRY) {
    document.getElementById('main').innerHTML = '<div class="empty-state"><h2>历史资料没有完整加载</h2><p>请先完整解压 ZIP，保留 data 和 assets 文件夹，再打开 index.html。</p></div>';
    return;
  }
  const dynasties = DATA.dynasties, rulers = [...window.EARLY_RULERS, ...window.LATE_RULERS];
  const events = DATA.events, worlds = DATA.world, snapshots = ATLAS.snapshots;
  const dynastyById = new Map(dynasties.map(d => [d.id,d]));
  const rulerById = new Map(rulers.map(r => [r.id,r]));
  const eventById = new Map(events.map(r => [r.id,r]));
  const STORAGE_KEY = 'guanshi.history.v1';
  let storageOK = true, saved;
  try { saved = C.sanitizeSaved(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch (_) { saved = C.sanitizeSaved({}); storageOK = false; }
  const validKeys = new Set([...rulers.map(r=>'r:'+r.id), ...events.map(e=>'e:'+e.id)]);
  saved.bookmarks = saved.bookmarks.filter(x=>validKeys.has(x));
  saved.visited = saved.visited.filter(x=>rulerById.has(x));
  saved.answered = saved.answered.filter(x=>LEARN.questions.some(q=>q.id===x));
  const state = { ...saved, view:'overview', dynasty:'tang', zoom:1, rulerFilter:'tang', rulerQuery:'', rulerPage:1, eventKind:'all', eventDynasty:'all', eventQuery:'', compare:[], mapIndex:0, mapRegion:null, mapCamera:null, selectedEvent:null, showCities:true, showBattles:true, showRivers:true, worldAll:false, quizIndex:0, quizSelection:null, playing:false, dialog:null };
  state.dynasty = C.activeDynasties(dynasties,state.year)[0]?.id || 'tang';
  state.rulerFilter = state.dynasty;
  state.mapIndex = snapshots.indexOf(C.nearestSnapshot(snapshots,state.year));
  const main = document.getElementById('main'), dialog = document.getElementById('detail-dialog');
  let toastTimer, playTimer, resizeTimer, timelineScroll = null, lastFocus = null;
  const iconPaths = {
    overview:'M3 7h18M3 12h12M3 17h18M7 4v6m9-1v6m-6-1v6',
    rulers:'M7 20v-2a5 5 0 0 1 10 0v2M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 20h16',
    atlas:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5m6-2v16m6-14v16',
    events:'m4 4 7 7m2 2 7 7M17 3l4 4-7 7-4-4 7-7M3 17l4 4 7-7-4-4-7 7m-1-2 6 6M15 2l6 6',
    world:'M21 12a9 9 0 1 0-18 0 9 9 0 1 0 18 0M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18',
    learn:'M21 12a9 9 0 1 0-18 0 9 9 0 1 0 18 0m-12-3 7-2-2 7-7 2 2-7z',
    bookmarks:'M6 3h12v18l-6-4-6 4V3',
    sources:'M5 3h14v18H5V3m4 5h6m-6 4h6m-6 4h4',
    arrow:'M5 12h14m-5-5 5 5-5 5',close:'m6 6 12 12M6 18 18 6',check:'m5 12 4 4 10-10'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[name] || iconPaths.overview}"/></svg>`;
  const tabs = [['overview','历史长河'],['rulers','帝王档案'],['atlas','地图演变'],['events','战争与转折'],['world','同期世界'],['learn','小小史官'],['bookmarks','我的收藏']];
  const child = () => state.mode === 'child';
  const label = C.yearLabel, range = C.rangeLabel;
  const dynastyName = id => dynastyById.get(id)?.name || id;
  const royalYears = r => r.reigns.map(x=>range(x.start,x.end)).join('；');
  function persist() {
    const output = {mode:state.mode,year:state.year,bookmarks:state.bookmarks,visited:state.visited,notes:state.notes,answered:state.answered,journey:state.journey};
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(output)); storageOK=true; } catch (_) { storageOK=false; }
  }
  function toast(message) {
    const el=document.getElementById('toast'); clearTimeout(toastTimer); el.textContent=message; el.hidden=false;
    toastTimer=setTimeout(()=>{el.hidden=true;},3000);
  }
  function nav(view, scroll = true, preserveTimeline = true) {
    if (view !== 'atlas') stopPlayback();
    if (![...tabs.map(x=>x[0]),'sources'].includes(view)) view='overview';
    if (preserveTimeline && state.view === 'overview') timelineScroll=document.getElementById('timeline-scroll')?.scrollLeft ?? timelineScroll;
    state.view=view; state.dialog=null; if(dialog.open) dialog.close();
    if (location.hash.slice(1)!==view) history.replaceState(null,'','#'+view);
    render();
    if(scroll) { window.scrollTo({top:0,behavior:'instant'}); main.focus({preventScroll:true}); }
  }
  function selectDynasty(id, go=true) {
    const d=dynastyById.get(id); if(!d) return;
    state.dynasty=id; state.rulerFilter=id; state.rulerQuery=''; state.rulerPage=1;
    if(!C.activeDynasties(dynasties,state.year).some(x=>x.id===id)) state.year=C.fromOrdinal(Math.round((C.ordinal(d.start)+C.ordinal(d.end))/2));
    if(id==='tang' && state.year>690 && state.year<705) state.year=750;
    setYear(state.year,false);state.dynasty=id;
    timelineScroll=null; persist(); if(go) nav('overview',true,false); else render();
  }
  function setYear(y, update=true) {
    if(C.parseYear(y)===null) return;
    state.year=Number(y);
    const active=C.activeDynasties(dynasties,state.year);
    if(!active.some(d=>d.id===state.dynasty) && active.length) state.dynasty=active[0].id;
    state.mapIndex=snapshots.indexOf(C.nearestSnapshot(snapshots,state.year)); state.mapCamera=null; state.mapRegion=null; state.selectedEvent=null;
    persist(); if(update) render();
  }
  function pageIntro(kicker,title,description,extra='') { return `<div class="view-intro"><div><div class="page-kicker">${kicker}</div><h1>${title}</h1><p>${description}</p></div>${extra}</div>`; }
  function dynastyOptions(selected, all=true) { return (all?'<option value="all">全部朝代与政权</option>':'')+dynasties.map(d=>`<option value="${d.id}" ${selected===d.id?'selected':''}>${E(d.name)} · ${range(d.start,d.end)}</option>`).join(''); }
  function sourcesHTML(sources=[], context='') {
    const unique=[...new Map(sources.filter(s=>s&&s.url).map(s=>[s.url,s])).values()];
    return `<details class="sources-details"><summary>史料出处与进一步阅读 · ${unique.length} 项</summary><p>资料用于交叉核对与继续阅读。生平摘要为教学概括，事实、史书评价与现代解释应分开；链接需联网打开。${E(context)}</p><ul>${unique.map(s=>`<li><a href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)} ↗</a></li>`).join('')}</ul></details>`;
  }
  function renderNav() {
    document.getElementById('navigation').innerHTML=tabs.map(([id,title],i)=>`<button class="nav-button ${state.view===id?'active':''}" data-action="nav" data-view="${id}" title="${title}" aria-label="${title}" ${state.view===id?'aria-current="page"':''}>${icon(id)}<span>${title}</span><span class="nav-number">0${i+1}</span></button>`).join('');
    document.getElementById('view-title').textContent=tabs.find(x=>x[0]===state.view)?.[1] || '史料与阅读说明';
    document.querySelectorAll('[data-action="mode"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
    document.body.dataset.mode=state.mode;
  }
  function heroArt() {
    return `<div class="hero-art" aria-hidden="true"><svg viewBox="0 0 350 195"><defs><linearGradient id="mountain-fade" x2="0" y2="1"><stop stop-color="#b3c0a0" stop-opacity=".7"/><stop offset="1" stop-color="#edf1df"/></linearGradient></defs><circle cx="192" cy="77" r="60" fill="none" stroke="#d1d9be"/><circle cx="192" cy="77" r="47" fill="none" stroke="#e0e6d1"/><path d="M0 167 39 114 63 133 105 62 148 108 182 50 224 111 250 85 290 135 326 105 350 160v35H0Z" fill="url(#mountain-fade)"/><path d="m0 181 41-46 37 26 51-62 44 55 42-32 48 49 43-39 44 50" fill="#a4b491" opacity=".34"/><path d="M0 177q66-15 128 3t222-7" fill="none" stroke="#afbb9d"/><path d="M138 174h74m-68-22h62m-58-15h54m-50-3q24-9 46 0m-54 15q30-8 60 0m-68 19q38-10 72 0m-60-29v10m12-10v10m12-10v10m12-10v10m-42 6v13m14-13v13m14-13v13m14-13v13" fill="none" stroke="#738961" stroke-width="1.3"/><path d="m40 59 7-3 7 3m8-5 6-3 6 3" stroke="#839476" fill="none"/></svg><span class="hero-seal">以史为镜</span><span class="art-label">山河无声 · 岁月有迹</span><span class="art-year">A JOURNEY THROUGH TIME</span></div>`;
  }
  function overviewHTML() {
    const d=dynastyById.get(state.dynasty) || dynasties[0];
    const dynRulers=rulers.filter(r=>r.dynasty===d.id);
    const featuredIds=['tang-taizong','tang-xuanzong','tang-gaozu'];
    let featured=dynRulers.filter(r=>C.aliveIn(r,state.year));
    featured=[...featured,...dynRulers.filter(r=>featuredIds.includes(r.id)),...dynRulers];
    featured=[...new Map(featured.map(r=>[r.id,r])).values()].slice(0,3);
    const nearWorld=worlds.filter(w=>state.year>=w.start&&state.year<=w.end)[0];
    const nearEvents=[...events].sort((a,b)=>Math.abs(C.distance(a.year,state.year))-Math.abs(C.distance(b.year,state.year))).slice(0,3);
    const snapshot=C.nearestSnapshot(snapshots,state.year);
    return `<section class="hero"><div><div class="eyebrow">与孩子同行 · 从中国看世界</div><h1>沿着时间，<br>看见<em>千年的回响。</em></h1><p>${child()?'小小旅行家，拨动时间，打开一段历史。<br>看看以前的人怎样生活，又给今天的我们留下了什么。':'从王朝更替到百姓生活，从一次决定到长久回响。<br>看见成就，追问代价；带着证据，形成自己的判断。'}</p></div>${heroArt()}</section>
      <div class="stats-row"><span><strong>${dynasties.length}</strong>朝代与政权</span><span><strong>${rulers.length}</strong>人物档案</span><span><strong>${events.length}</strong>战争与转折</span><span><strong>${snapshots.length}</strong>地图切片</span></div>
      <section class="panel timeline-panel" aria-label="可缩放朝代时间轴"><div class="panel-head"><div class="heading-stack"><h2>历史是一条长河</h2><p>时间条按真实年份比例绘制 · 并排的条，是同时存在的政权</p></div><div class="controls"><span class="controls-label" id="zoom-label">${state.zoom.toFixed(1)}×</span><button class="icon-button" data-action="timeline-zoom" data-factor="0.6" aria-label="缩小时间轴" ${state.zoom<=1?'disabled':''}>−</button><button class="icon-button" data-action="timeline-zoom" data-factor="1.7" aria-label="放大时间轴" ${state.zoom>=40?'disabled':''}>＋</button><button class="btn small" data-action="timeline-fit">全览</button><button class="btn small" data-action="timeline-dynasty">放大${E(d.name)}</button></div></div>
      <div class="timeline-scroll" id="timeline-scroll" tabindex="0" aria-label="朝代时间轴，左右滚动浏览"><div id="timeline-canvas" class="timeline-canvas"></div></div>
      <div class="timeline-foot"><div class="year-control"><div><strong id="current-year-label">${label(state.year)}</strong><small>拖动右侧滑块 · 选择一个年份</small></div><div class="active-era-list">${C.activeDynasties(dynasties,state.year).map(x=>`<button data-action="dynasty" data-id="${x.id}">${E(x.name)}</button>`).join('') || `<small>${state.year>-256&&state.year<-221?'战国末期：诸侯仍存':'过渡年份：未单独建条'}</small>`}</div></div><div><input class="year-scrub" id="year-slider" type="range" min="${C.ordinal(C.MIN_YEAR)}" max="${C.ordinal(C.MAX_YEAR)}" value="${C.ordinal(state.year)}" aria-label="选择历史年份"><div class="range-extents"><span>约前2070年</span><span>公元1912年</span></div></div><form class="year-form" id="year-form"><input id="year-input" inputmode="numeric" type="text" value="${state.year}" aria-label="输入年份，负数表示公元前"><button class="btn small" type="submit">前往</button></form></div><div class="timeline-hint">点击色条查看朝代；小条可先放大或用搜索寻找。输入负数表示公元前；不设公元0年。夏代为约年，唐条含武周中断说明。</div></section>
      <div class="overview-grid"><section class="panel dynasty-card"><div class="dynasty-heading"><div class="dynasty-name"><div class="dynasty-glyph">${E(d.name.slice(-1))}</div><div><h2>${E(d.name)}</h2><small>${range(d.start,d.end)} <span>· ${C.distance(d.start,d.end)} 年跨度</span></small></div></div><span class="tag ochre">${C.activeDynasties(dynasties,state.year).some(x=>x.id===d.id)?(child()?'这一站，我们读':'正在探索'):'邻近朝代参照'}</span></div><p class="dynasty-summary">${E(child()?d.child:d.summary)}</p><div class="feature-pairs"><div><h4>留下了什么</h4><p>${E(d.legacy[0])}</p></div><div class="cost"><h4>也要看到代价</h4><p>${E(d.costs[0])}</p></div></div><div class="daily-card"><strong>普通人的一天</strong>${E(d.daily)}</div><div class="section-label">${child()?'认识这段历史中的人':'帝王与政局'} · 共 ${dynRulers.length} 位收录人物</div><div class="ruler-preview">${featured.map(r=>`<button class="ruler-mini" data-action="ruler" data-id="${r.id}"><b>${E(r.name)}</b><small>${E(r.personal)}</small><em>${C.reignLabel(r.reigns)} · ${r.reigns.length>1?'多次在位':'在位估计'}</em></button>`).join('')}</div><div class="card-bottom"><button class="text-button" data-action="dynasty-detail" data-id="${d.id}">读懂${E(d.name)} <span>↗</span></button><button class="text-button" data-action="dynasty-rulers" data-id="${d.id}">查看全部人物 ${icon('arrow')}</button></div></section>
      <div class="stack"><section class="panel map-teaser"><div class="tiny-caps">HISTORY ON THE MAP</div><h3>换个角度，看山河</h3><span class="small">${E(snapshot.title)} · ${label(snapshot.year,false)}</span><div class="teaser-map">${mapSVG(snapshot,true,'mini')}</div><button class="text-button" data-action="nav" data-view="atlas">打开历史地图 <span>↗</span></button></section><section class="panel world-teaser"><div class="tiny-caps">MEANWHILE, IN THE WORLD</div><h3>${nearWorld?E(nearWorld.name):'世界在同时发生'}</h3><p>${nearWorld?E(child()?nearWorld.child:nearWorld.summary):'在另一片土地上，也有人建造城市、交流知识、改变生活。一起把目光放得更远。'}</p><button class="text-button" data-action="nav" data-view="world">看看同期世界 ${icon('arrow')}</button></section></div></div>
      <div class="section-title"><h2>这段时间附近，发生了什么？</h2><button class="text-button" data-action="nav" data-view="events">所有事件 ↗</button></div><div class="mini-articles">${nearEvents.map(e=>`<button class="panel event-mini" data-action="event" data-id="${e.id}"><span class="event-year">${label(e.year,false)}</span><span><b>${E(e.title)}</b><small>${E(e.place)} · ${kindLabel(e.kind)}</small></span></button>`).join('')}</div>`;
  }
  function drawTimeline() {
    const scroll=document.getElementById('timeline-scroll'), canvas=document.getElementById('timeline-canvas'); if(!scroll||!canvas) return;
    const width=(scroll.clientWidth||300)*state.zoom; canvas.style.width=width+'px';
    const start=C.ordinal(C.MIN_YEAR), total=C.ordinal(C.MAX_YEAR)-start;
    const pos=y=>(C.ordinal(y)-start)/total*width;
    const tickStep=state.zoom>20?10:state.zoom>8?25:state.zoom>3?100:state.zoom>1.5?250:500;
    let html='';
    for(let y=Math.ceil(C.MIN_YEAR/tickStep)*tickStep;y<=C.MAX_YEAR;y+=tickStep) {const yr=y===0?1:y;html+=`<div class="tick" style="left:${pos(yr)}px"><span>${label(yr,false)}</span></div>`;}
    // Tang is interrupted by Wu Zhou; use two geometries with one dynasty record.
    dynasties.forEach(d=>{
      const segments=d.id==='tang'?[[618,690],[705,907]]:[[d.start,d.end]];
      segments.forEach(([a,b])=>{const w=Math.max(3,pos(b)-pos(a)-2);html+=`<button class="era-bar ${state.dynasty===d.id?'selected':''} ${w<26?'tiny':''}" data-action="dynasty" data-id="${d.id}" style="left:${pos(a)}px;width:${w}px;top:${35+d.lane*44}px;background:${d.color}" title="${E(d.name)} ${range(a,b)}" aria-label="${E(d.name)} ${range(a,b)}">${w>26?E(d.name):''}${w>150?`<em>${range(a,b)}</em>`:''}</button>`;});
    });
    html+=`<div class="year-cursor" id="year-cursor" style="left:${pos(state.year)}px"></div>`;canvas.innerHTML=html;
    if(timelineScroll!==null) scroll.scrollLeft=timelineScroll; else scroll.scrollLeft=Math.max(0,pos(state.year)-scroll.clientWidth/2);
  }
  function rulerCard(r) {
    const isSaved=state.bookmarks.includes('r:'+r.id), isCompared=state.compare.includes(r.id);
    return `<article class="panel ruler-card"><span class="tag" style="align-self:flex-start">${E(dynastyName(r.dynasty))}</span><button class="bookmark-corner ${isSaved?'saved':''}" data-action="bookmark" data-key="r:${r.id}" aria-label="${isSaved?'取消收藏':'收藏'}${E(r.name)}" aria-pressed="${isSaved}">${isSaved?'★':'☆'}</button><div class="portrait-chip"><div class="portrait-monogram" aria-hidden="true">${E(r.name.slice(-1))}</div><div><h3>${E(r.name)}</h3><span class="personal">${E(r.personal)}</span></div></div><div class="ruler-dates"><div>出生 — 去世<strong>${range(r.birth,r.death)}</strong></div><div>在位起讫<strong>${royalYears(r)}</strong></div></div><p>${E(child()?r.child:r.achievement)}</p><div class="card-actions"><button class="text-button" data-action="ruler" data-id="${r.id}">展开档案 ↗</button><button class="${isCompared?'selected':''}" data-action="compare-toggle" data-id="${r.id}">${isCompared?'✓ 已加入':'＋ 加入对比'}</button></div></article>`;
  }
  function rulerReignStrip(list) {
    if(state.rulerFilter==='all'||!list.length) return '';
    const d=dynastyById.get(state.rulerFilter);
    const timed=list.filter(r=>r.reigns.some(x=>C.validYear(x.start)&&C.validYear(x.end)));
    if(!timed.length) return '';
    const spans=timed.flatMap(r=>r.reigns.filter(x=>C.validYear(x.start)&&C.validYear(x.end)).map(x=>({r,...x}))).sort((a,b)=>a.start-b.start);
    return `<section class="panel reign-strip"><h3>${E(d.name)} · 在位顺序速览</h3><div class="reign-strip-chart">${spans.map(x=>`<button data-action="ruler" data-id="${x.r.id}" style="flex:${Math.max(1,C.distance(x.start,x.end))} 1 0" title="${E(x.r.name)}：${range(x.start,x.end)}" aria-label="${E(x.r.name)}：${range(x.start,x.end)}">${C.distance(x.start,x.end)>12?E(x.r.name):''}</button>`).join('')}</div><div class="small muted">同年交接、复位、并立者见具体档案；短期君主保留最小可点击宽度。${E(d.coverage)}</div></section>`;
  }
  function compareTray() {return state.compare.length?`<aside class="compare-tray"><p>待对比：${state.compare.map(id=>E(rulerById.get(id).name)).join(' · ')} <small>（最多3位）</small></p><div class="controls"><button class="btn small" data-action="compare-clear">清空</button><button class="btn primary small" data-action="compare-open" ${state.compare.length<2?'disabled':''}>对比人物 · ${state.compare.length}</button></div></aside>`:'';}
  function rulersHTML() {
    const filtered=rulers.filter(r=>(state.rulerFilter==='all'||r.dynasty===state.rulerFilter)&&C.matches(r,state.rulerQuery));
    const pages=Math.max(1,Math.ceil(filtered.length/12));state.rulerPage=Math.min(pages,Math.max(1,state.rulerPage));
    const visible=filtered.slice((state.rulerPage-1)*12,state.rulerPage*12);
    return pageIntro('PEOPLE IN HISTORY','一生的选择，时代的回响。',child()?'他们也曾是小孩子。看看他们长大以后做了什么，哪些值得学，哪些需要想一想。':'生卒、在位与掌权分别记录。用具体事件理解成就和局限，不给人物打一个简单的“好坏分”。',`<span class="count-badge">${rulers.length} 位已收录人物</span>`)+`<div class="filter-bar"><select id="ruler-dynasty" aria-label="按朝代筛选帝王">${dynastyOptions(state.rulerFilter)}</select><input id="ruler-search" type="search" placeholder="搜索名字、本名或关键词，例如：纳谏" value="${E(state.rulerQuery)}" aria-label="搜索帝王"><button class="btn small" data-action="ruler-reset">清除筛选</button><span class="filter-count">找到 ${filtered.length} 位</span></div>${rulerReignStrip(rulers.filter(r=>r.dynasty===state.rulerFilter))}<div class="ruler-grid">${visible.map(rulerCard).join('')}</div>${!visible.length?'<div class="empty-state"><h3>这一页还没有找到</h3><p>试试本名、庙号，或把朝代切换为“全部朝代与政权”。</p><button class="btn" data-action="ruler-reset">查看全部人物</button></div>':''}${pages>1?`<div class="pagination"><button class="btn small" data-action="ruler-page" data-delta="-1" ${state.rulerPage===1?'disabled':''}>上一页</button><span>${state.rulerPage} / ${pages}</span><button class="btn small" data-action="ruler-page" data-delta="1" ${state.rulerPage===pages?'disabled':''}>下一页</button></div>`:''}${compareTray()}`;
  }
  let landPathCache='';
  function linePath(points,close=false) {return points.map((p,i)=>`${i?'L':'M'}${Number(p[0]).toFixed(3)},${(-Number(p[1])).toFixed(3)}`).join(' ')+(close?'Z':'');}
  function landPath() {
    if(landPathCache) return landPathCache;
    landPathCache=window.LAND_GEOMETRY.features.map(f=>{
      const polygons=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;
      return polygons.map(poly=>poly.map(ring=>linePath(ring,true)).join(' ')).join(' ');
    }).join(' ');
    return landPathCache;
  }
  function cameraFor(snapshot) {
    const points=snapshot.regions.flatMap(r=>r.points), xs=points.map(p=>p[0]), ys=points.map(p=>-p[1]);
    const minX=Math.min(...xs)-6,maxX=Math.max(...xs)+5,minY=Math.min(...ys)-4,maxY=Math.max(...ys)+4;
    return {x:minX,y:minY,w:Math.max(36,maxX-minX),h:Math.max(27,maxY-minY)};
  }
  function cameraString(camera) {return [camera.x,camera.y,camera.w,camera.h].join(' ');}
  function mapSVG(snapshot,mini=false,namespace='atlas') {
    const cam=mini?cameraFor(snapshot):(state.mapCamera||cameraFor(snapshot));
    const regions=snapshot.regions, id=namespace+'-land';
    let graticule='';
    for(let lon=60;lon<=150;lon+=10) graticule+=`<path class="map-grid" d="M${lon},-60V-10"/>`;
    for(let lat=10;lat<=60;lat+=10) graticule+=`<path class="map-grid" d="M60,${-lat}H150"/>`;
    const nearby=events.filter(e=>C.validYear(e.year)&&Math.abs(C.distance(e.year,snapshot.year))<=55&&e.kind==='battle'&&Number.isFinite(e.lon)&&Number.isFinite(e.lat)&&e.id!==state.selectedEvent);
    const focusedEvent=state.selectedEvent?eventById.get(state.selectedEvent):null;
    const layerRegions=regions.map(r=>`<g ${mini?'':`role="button" tabindex="0" data-action="map-region" data-id="${r.id}" aria-label="${E(r.name)}：查看政权说明"`}><path class="region ${state.mapRegion===r.id?'chosen':''}" d="${linePath(r.points,true)}" fill="${r.color}" stroke="${r.color}"/><title>${E(r.name)} · ${E(r.kind==='influence'?'联系或差异治理区，非精确边界':'核心分布示意，非精确边界')}</title>${r.kind==='influence'?`<path d="${linePath(r.points,true)}" fill="url(#${namespace}-hatch)" pointer-events="none"/>`:''}</g>`).join('');
    return `<svg ${mini?'aria-hidden="true"':'id="atlas-svg" role="group" aria-label="可缩放的历史地理示意图"'} class="atlas-svg" viewBox="${cameraString(cam)}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${id}"><path d="${landPath()}"/></clipPath><pattern id="${namespace}-hatch" width="1" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V1" stroke="#546b41" stroke-width=".16" opacity=".4"/></pattern></defs>${mini?'':graticule}<path class="map-land" d="${landPath()}"/><g clip-path="url(#${id})">${layerRegions}</g>${!mini&&state.showRivers?ATLAS.rivers.map(r=>`<path class="map-river" d="${linePath(r.points)}"/><text class="river-label" x="${r.points[5][0]}" y="${-r.points[5][1]-.6}">${E(r.name)}</text>`).join(''):''}${regions.map(r=>`<text class="region-label" x="${r.label[0]}" y="${-r.label[1]}">${E(r.name)}</text>`).join('')}${!mini&&state.showCities?ATLAS.cities.map(c=>`<g><circle class="city-point" cx="${c.lon}" cy="${-c.lat}" r=".22"/><text class="city-label" x="${c.lon+.35}" y="${-c.lat+.35}">${E(c.name)}</text><title>今${E(c.name)}附近 · 地理参照，非全部时代的城址</title></g>`).join(''):''}${!mini&&state.showBattles?nearby.map(e=>`<g role="button" tabindex="0" data-action="event" data-id="${e.id}" aria-label="${E(e.title)}，${label(e.year)}"><circle class="event-point" cx="${e.lon}" cy="${-e.lat}" r=".48"/><title>${E(e.title)} · ${label(e.year)} · 约略地点</title></g>`).join(''):''}${!mini&&focusedEvent?`<g class="focused-event-marker" role="button" tabindex="0" data-action="event" data-id="${focusedEvent.id}" aria-label="正在定位：${E(focusedEvent.title)}，${label(focusedEvent.year)}"><circle cx="${focusedEvent.lon}" cy="${-focusedEvent.lat}" r=".85" fill="none" stroke="#a94f31" stroke-width=".16"/><circle class="event-point" cx="${focusedEvent.lon}" cy="${-focusedEvent.lat}" r=".43"/><text class="city-label" style="font-size:1.2px;fill:#a14f30" x="${focusedEvent.lon+1}" y="${-focusedEvent.lat-.8}">${E(focusedEvent.title)} · ${label(focusedEvent.year,false)}</text><title>${E(focusedEvent.title)} · 选中事件独立定位，背景地图并非事件当年</title></g>`:''}</svg>`;
  }
  function atlasHTML() {
    const snapshot=snapshots[state.mapIndex];
    const chosen=snapshot.regions.find(r=>r.id===state.mapRegion);
    const nearby=[...events].filter(e=>e.kind==='battle').sort((a,b)=>Math.abs(C.distance(a.year,snapshot.year))-Math.abs(C.distance(b.year,snapshot.year))).slice(0,3);
    return pageIntro('AN ATLAS THROUGH TIME','山河之间，读懂历史。',child()?'点一点不同颜色，认识同时生活在这片土地上的政权。慢慢拨动时间，看看位置和关系怎样变化。':'观察核心地区、地理屏障与不同层次的政治联系。年份采用离散快照，色块是教学概括。',`<span class="count-badge">${snapshots.length} 个时代切片</span>`)+`<div class="atlas-layout"><div><section class="panel map-panel"><div class="map-controls"><select id="snapshot-select" aria-label="选择历史地图年代">${snapshots.map((s,i)=>`<option value="${i}" ${i===state.mapIndex?'selected':''}>${label(s.year)} · ${E(s.title)}</option>`).join('')}</select><span class="tag ochre">形势示意 · 非精确疆界</span></div><div class="map-canvas-wrap" id="map-canvas-wrap">${mapSVG(snapshot)}<div class="map-compass"><span>N</span><b>↑</b></div><div class="map-zoom"><button class="icon-button" data-action="map-zoom" data-factor="0.7" aria-label="放大地图">＋</button><button class="icon-button" data-action="map-zoom" data-factor="1.4" aria-label="缩小地图">−</button><button class="icon-button" data-action="map-reset" aria-label="重置地图视野">⌖</button></div><div class="map-period-label"><strong>${label(snapshot.year)}</strong><small>手绘教学形势图</small></div><div class="map-attribution">陆地轮廓：Natural Earth · 城市为今址参照 · 拖动移动 / 滚轮缩放</div></div><div class="map-legend">${snapshot.regions.map(r=>`<button data-action="map-region" data-id="${r.id}" aria-pressed="${state.mapRegion===r.id}"><span class="legend-color" style="--region-color:${r.color}"></span>${E(r.name)}</button>`).join('')}</div><div class="snapshot-foot"><div class="controls"><button class="icon-button" data-action="snapshot-step" data-delta="-1" aria-label="上一个地图时代" ${state.mapIndex===0?'disabled':''}>‹</button><button class="icon-button" data-action="map-play" aria-label="${state.playing?'暂停地图播放':'播放地图演变'}">${state.playing?'Ⅱ':'▷'}</button><button class="icon-button" data-action="snapshot-step" data-delta="1" aria-label="下一个地图时代" ${state.mapIndex===snapshots.length-1?'disabled':''}>›</button></div><div><input id="snapshot-slider" type="range" min="0" max="${snapshots.length-1}" value="${state.mapIndex}" aria-label="拖动查看地图演变"><div class="snapshot-ends"><span>前1200年</span><span>1820年</span></div></div><span class="snapshot-name">${state.mapIndex+1} / ${snapshots.length} 帧</span></div></section><div class="controls" style="margin-top:12px"><button class="btn small" data-action="map-layer" data-layer="showCities" aria-pressed="${state.showCities}">${state.showCities?'✓ ':''}城市参照</button><button class="btn small" data-action="map-layer" data-layer="showRivers" aria-pressed="${state.showRivers}">${state.showRivers?'✓ ':''}河流参照</button><button class="btn small" data-action="map-layer" data-layer="showBattles" aria-pressed="${state.showBattles}">${state.showBattles?'✓ ':''}附近战役</button></div><p class="map-note">${E(ATLAS.note)} 当前时间轴为${label(state.year)}，本图采用最接近的${label(snapshot.year)}切片，未对两个切片之间插值。橙点为切片前后55年内的已收录战役。</p></div><aside class="atlas-aside stack"><section class="panel"><div class="tiny-caps">${chosen?'A CLOSER LOOK':'THE SHAPE OF AN ERA'}</div><h2>${E(chosen?chosen.name:snapshot.title)}</h2><p>${E(chosen?chosen.detail:snapshot.subtitle)}</p><p>${E(snapshot.note)}</p><h4>一起想一想</h4><p>${E(snapshot.question)}</p>${chosen?.dynasty?`<button class="text-button" data-action="dynasty-detail" data-id="${chosen.dynasty}">读懂${E(dynastyName(chosen.dynasty))} ↗</button>`:''}${sourcesHTML(snapshot.sources,'图形为手绘概括，来源支持历史背景，不是这些色块的测绘出处。')}</section><section class="panel"><div class="tiny-caps">WARS NEAR THIS TIME</div><h3 style="margin:8px 0">附近的战争</h3>${nearby.map(e=>`<button class="map-battle-button" data-action="event" data-id="${e.id}">${E(e.title)}<small>${label(e.year)} · ${E(e.place)}</small></button>`).join('')}<p class="small" style="font-size:10px;margin-top:10px">按距切片年份排序，可能跨越较长时间；请读清事件本身的年份。</p></section></aside></div><div class="snapshot-list">${snapshots.map((s,i)=>`<button class="${i===state.mapIndex?'active':''}" data-action="snapshot" data-index="${i}" aria-label="查看${E(s.title)}">${label(s.year,false)} · ${E(s.title)}</button>`).join('')}</div>`;
  }
  function kindLabel(kind) {return {battle:'重大战役',society:'生活与创造',turning:'时代转折'}[kind]||'历史事件';}
  function eventCard(e) {
    const isSaved=state.bookmarks.includes('e:'+e.id);
    return `<article class="panel event-card"><div class="event-card-header"><span class="date">${e.endYear&&e.endYear!==e.year?range(e.year,e.endYear):label(e.year)}</span><span class="tag ${e.kind==='battle'?'rust':e.kind==='society'?'':'ochre'}">${kindLabel(e.kind)}</span></div><h3>${E(e.title)}</h3><div class="event-place">${E(e.place)} · ${(e.dynasties||[]).map(dynastyName).map(E).join(' / ')}</div><p>${E(child()?e.child:e.cause)}</p><button class="text-button" data-action="event" data-id="${e.id}">读懂起因与影响 ${icon('arrow')}</button><button class="bookmark-corner ${isSaved?'saved':''}" data-action="bookmark" data-key="e:${e.id}" aria-label="${isSaved?'取消收藏':'收藏'}${E(e.title)}" aria-pressed="${isSaved}">${isSaved?'★':'☆'}</button></article>`;
  }
  function eventsHTML() {
    const filtered=events.filter(e=>(state.eventKind==='all'||e.kind===state.eventKind)&&(state.eventDynasty==='all'||e.dynasties.includes(state.eventDynasty))&&C.matches(e,state.eventQuery)).sort((a,b)=>a.year-b.year);
    return pageIntro('TURNING POINTS','一个转折，怎样改变许多人的生活？',child()?'不只问“谁赢了”。也问问：“为什么发生？后来怎样了？普通人经历了什么？”':'把原因、结果与长期影响分开。军事胜败只是一个维度，社会变化与普通人的处境同样重要。',`<span class="count-badge">${events.length} 个事件</span>`)+`<div class="filter-bar"><div class="segmented" aria-label="事件类别">${[['all','全部'],['battle','重大战役'],['turning','时代转折'],['society','生活与创造']].map(([k,n])=>`<button data-action="event-kind" data-kind="${k}" class="${state.eventKind===k?'active':''}" aria-pressed="${state.eventKind===k}">${n}</button>`).join('')}</div><select id="event-dynasty" aria-label="按朝代筛选事件">${dynastyOptions(state.eventDynasty)}</select><input id="event-search" type="search" placeholder="搜索事件名称…" value="${E(state.eventQuery)}" aria-label="搜索历史事件"><span class="filter-count">找到 ${filtered.length} 项</span></div><div class="events-grid">${filtered.map(eventCard).join('')}</div>${!filtered.length?'<div class="empty-state"><h3>这个筛选条件下暂无收录</h3><p>放宽朝代或事件类别，继续找找。</p><button class="btn" data-action="event-reset">查看全部事件</button></div>':''}`;
  }
  function worldMapHTML(items) {
    return `<section class="panel map-panel world-map"><div class="map-canvas-wrap"><svg class="atlas-svg" viewBox="-180 -82 360 157" role="group" aria-label="同期文明的地理位置"><path class="map-land" d="${landPath()}"/>${items.map(w=>`<g data-action="world-detail" data-id="${w.id}" tabindex="0" role="button" aria-label="${E(w.name)}"><circle class="city-point" cx="${w.lon}" cy="${-w.lat}" r="1.7" style="fill:#8aa670"/><text class="city-label" style="font-size:4px;stroke-width:.5" x="${w.lon+3}" y="${-w.lat-2}">${E(w.name)}</text><title>${E(w.name)} · ${range(w.start,w.end)}</title></g>`).join('')}<circle cx="112" cy="-34" r="1.8" fill="#bc8d54"/><text x="115" y="-31" class="city-label" style="font-size:4px;fill:#a67c48">中国历史参照</text></svg><div class="map-attribution">Natural Earth 自然地理底图 · 仅标文明或政权代表位置，不绘国界</div></div></section>`;
  }
  function worldHTML() {
    const active=worlds.filter(w=>state.year>=w.start&&state.year<=w.end);
    const visible=state.worldAll?worlds:active;
    return pageIntro('MEANWHILE, ELSEWHERE','同一轮月亮下，世界在发生什么？',child()?'你在看唐朝时，别的地方也有人写字、修房子、做买卖。把时间拨一拨，和他们打个招呼。':'中国时间线与世界文明并置，观察交流与各自的发展。收录为精选参照，不能把没有卡片的地区视为没有历史。')+`<div class="panel world-year-bar"><strong id="world-year-label">${label(state.year)}</strong><input id="world-year" type="range" min="${C.ordinal(C.MIN_YEAR)}" max="${C.ordinal(C.MAX_YEAR)}" value="${C.ordinal(state.year)}" aria-label="调整同期世界年份"><button class="btn small" data-action="world-all">${state.worldAll?'只看同时期':'查看全部时期'}</button></div>${worldMapHTML(visible)}${!visible.length?'<div class="empty-state" style="margin-top:20px"><h3>这一年暂无同期卡片</h3><p>这里只收录部分文明，空白不代表世界没有发生事情。</p><button class="btn" data-action="world-all">展开全部文明参照</button></div>':''}<div class="world-grid">${visible.map(w=>`<article class="panel world-card"><div class="world-region">${E(w.region)}</div><h3>${E(w.name)}</h3><div class="world-years">${range(w.start,w.end)}${active.includes(w)?' · 与所选年份同时':''}</div><p>${E(child()?w.child:w.summary)}</p><button class="text-button" data-action="world-detail" data-id="${w.id}">打开这扇窗 ↗</button></article>`).join('')}</div>`;
  }
  function learningHTML() {
    const j=LEARN.journeys[state.journey],q=LEARN.questions[state.quizIndex];
    const answered=state.quizSelection!==null,correct=state.quizSelection===q.correct;
    return pageIntro('CURIOSITY IS A COMPASS','小小史官，大大的问题。',child()?'不用一天记住几千年。今天发现一点，明天再多问一个为什么。':'把知识变成观察、对照和追问。和孩子共读，也让自己的判断接受证据的检验。',`<button class="btn" data-action="glossary">历史小辞典 ↗</button>`)+`<div class="learning-grid"><div><section class="panel journey-panel"><div class="tiny-caps">FAMILY JOURNEY · ${state.journey+1} / ${LEARN.journeys.length}</div><h2>${E(j.title)}</h2><div class="journey-steps">${LEARN.journeys.map((_,i)=>`<button class="${i===state.journey?'current':i<state.journey?'done':''}" data-action="journey" data-index="${i}" aria-label="亲子探索第${i+1}站"></button>`).join('')}</div><p>${E(child()?j.child:j.deep)}</p><div class="detail-note">一起聊聊：${E(j.prompt)}</div><div class="quiz-footer"><button class="btn primary" data-action="journey-go">出发去${E(dynastyName(j.dynasty))} ${icon('arrow')}</button><div class="controls"><button class="icon-button" data-action="journey" data-index="${state.journey-1}" aria-label="上一站" ${state.journey===0?'disabled':''}>‹</button><button class="icon-button" data-action="journey" data-index="${state.journey+1}" aria-label="下一站" ${state.journey===LEARN.journeys.length-1?'disabled':''}>›</button></div></div></section><section class="panel question-card"><div class="question-number">想一想 · 第 ${state.quizIndex+1} / ${LEARN.questions.length} 题</div><h3>${E(q.question)}</h3><div class="quiz-options">${q.options.map((o,i)=>`<button class="quiz-option ${answered&&i===q.correct?'correct':''} ${answered&&i===state.quizSelection&&!correct?'incorrect':''}" data-action="quiz-answer" data-index="${i}" ${answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${E(o)}${answered&&i===q.correct?' ✓':''}</button>`).join('')}</div>${answered?`<div class="quiz-feedback" role="status"><strong>${correct?(child()?'发现啦，答对了！':'判断正确。'):(child()?'再看一眼，我们一起弄明白。':'这次判断还需要调整。')}</strong><br>${E(q.explanation)}<br><button class="text-button" data-action="dynasty-detail" data-id="${q.dynasty}">查看相关朝代与资料 ↗</button></div>`:''}<div class="quiz-footer"><span class="small muted">${state.answered.includes(q.id)?'✓ 这道题已正确回答过':'先想，再选；有疑问就回头查证。'}</span><div class="controls"><button class="btn small" data-action="quiz-step" data-delta="-1" ${state.quizIndex===0?'disabled':''}>上一题</button><button class="btn small" data-action="quiz-step" data-delta="1">${state.quizIndex===LEARN.questions.length-1?'回到第1题':'下一题'}</button></div></div></section></div><aside><section class="panel progress-card"><div class="tiny-caps">MY EXPLORATION</div><strong>${state.visited.length}</strong><span class="muted small"> 位人物，已经遇见</span><p>${state.answered.length} / ${LEARN.questions.length} 道思考题已答对 · ${state.bookmarks.length} 个收藏</p><div class="progress-line"><span style="width:${state.answered.length/LEARN.questions.length*100}%"></span></div></section><section class="panel notebook"><h3>我的发现手记</h3><p>${child()?'我原来以为……现在发现……<br>也可以记下想问爸爸的问题。':'记下事实、解释，以及尚未解决的问题。'}</p><textarea id="learning-notes" maxlength="20000" aria-label="我的历史学习笔记" placeholder="今天我发现……\n我还想知道……">${E(state.notes)}</textarea><div class="note-footer"><span id="note-status">${storageOK?'保存在当前浏览器':'当前浏览器限制保存，请导出备份'}</span><button class="text-button" data-action="export-notes">导出手记 ↗</button></div></section><section class="panel reflect-card"><h3>🪞 以史为镜，也以证据为镜</h3><p>看到一个厉害的人，别急着全盘模仿。问一问：哪些是他的本领，哪些来自时代，哪些是别人替他付出的代价？</p></section></aside></div>`;
  }
  function bookmarksHTML() {
    return pageIntro('MY LITTLE COLLECTION','把想再读的，留在这里。','人物和事件都可以收藏。学习记录保存在当前浏览器；换电脑前，可以在“小小史官”中导出手记。',`<span class="count-badge">${state.bookmarks.length} 个收藏</span>`)+(state.bookmarks.length?`<div class="bookmark-list">${state.bookmarks.map(key=>{
      const type=key.slice(0,1),id=key.slice(2),item=type==='r'?rulerById.get(id):eventById.get(id);
      return `<div class="bookmark-item"><button data-action="${type==='r'?'ruler':'event'}" data-id="${id}">${E(item.name||item.title)}<small>${type==='r'?E(dynastyName(item.dynasty))+' · '+royalYears(item):label(item.year)+' · '+kindLabel(item.kind)}</small></button><button data-action="bookmark" data-key="${key}" aria-label="取消收藏${E(item.name||item.title)}">×</button></div>`;
    }).join('')}</div>`:'<div class="empty-state"><h3>第一枚书签，等你发现</h3><p>打开一份人物或事件档案，点一下“☆ 收藏”，下次就能从这里继续。</p><button class="btn primary" data-action="nav" data-view="rulers">去认识历史中的人</button></div>');
  }
  function sourcesPageHTML() {
    const all=[...DATA.sources,...ATLAS.sources,...dynasties.flatMap(x=>x.sources),...rulers.flatMap(x=>x.sources),...events.flatMap(x=>x.sources),...worlds.flatMap(x=>x.sources)];
    const unique=[...new Map(all.filter(x=>x&&x.url).map(x=>[x.url,x])).values()];
    return pageIntro('READ WITH EVIDENCE','带着好奇，也带着分寸。','这是一份亲子历史探索项目。它保留不确定性，区分教学简化与史实证据；帮助开始阅读，也鼓励继续查证。')+`<div class="sources-grid"><section class="panel source-panel"><h3>01 · 收录范围</h3><p>本版包含 ${dynasties.length} 个朝代与政权、${rulers.length} 份人物档案、${events.length} 个事件、${worlds.length} 组世界文明参照、${snapshots.length} 幅地图切片。</p><p>先秦采用代表人物；秦以后以所列主要政权实际在位君主为主。追尊者通常不列，若干短期、并立与争议君主会在人物说明中标出。</p><p>十六国、十国、南明、北元，以及众多地方政权尚未全量收录。本版不能称为所有中国君主的完整名单；世界历史也仅为精选参照。</p><p>女性、思想家、工匠、农民与商业活动主要融入事件和生活叙述，目前人物档案以君主为主，仍有扩展空间。</p></section><section class="panel source-panel"><h3>02 · 时间怎样计算</h3><ol><li>负数表示公元前；公元前1年之后为公元1年，没有公元0年。</li><li>优先区分实际公元登位年、改元年、建国年与传统年表口径。少数旧历年末事件会落在下一公元年，详见档案备注。</li><li>在位时长是各段起讫“年份差”的合计估算，不是精确周年数；同年即退位显示不足1年。未计入具体月日，不能用于精确年龄或天数计算。</li><li>复位按多段记录；未知生卒、先秦不可靠绝对年代保留“未详”；有不同说法者标出争议。</li><li>同一年有皇位交接，查询该年可能同时显示两位。朝代存续与君主实际称帝的起止也可能不同。</li></ol></section><section class="panel source-panel"><h3>03 · 地图怎样阅读</h3><p>${E(ATLAS.note)}</p><p>采用 ${snapshots.length} 个独立切片，切换年份时显示最接近的一帧并注明年份，不生成“任意一年都准确”的假地图。</p><p>斜线用于提示联系范围或不同治理方式，并不统一等于“外国”或“非领土”；必须结合每块区域的说明。地图未计算面积，未标出现代国界。</p><p>Natural Earth 仅提供公有领域自然陆地轮廓；历史色块是原创示意，CHGIS 链接供学习历史地理方法，本项目没有声称使用其精确疆界数据。</p></section><section class="panel source-panel"><h3>04 · 判断怎样形成</h3><p>人物的“成就”概括具体行动与结果，“代价与局限”提醒被忽略的人与制度约束，不设置武力值、好坏分或单一排名。</p><p>幼帝、被架空的君主，不把整个时代的失败都归罪于他；工匠、官员和普通人的成果，也不全部记为皇帝个人功劳。</p><p>史籍含有作者立场，传说与演义并不等于史实。大型机构的资料也可能存在年代简化或笔误，因此关键日期需交叉核对。</p><p>功能测试可以验证程序与数据结构，不能代替专业史学审校。具体来源与核验边界附于 ZIP 的 docs 文件夹中。</p></section><section class="panel source-panel source-full"><h3>朝代与人物覆盖表</h3><div class="comparison-scroll"><table class="coverage-table"><thead><tr><th>朝代 / 政权</th><th>时间条起讫</th><th>人物数</th><th>收录口径</th></tr></thead><tbody>${dynasties.map(d=>`<tr><td><button class="text-button" data-action="dynasty-rulers" data-id="${d.id}">${E(d.name)}</button></td><td>${range(d.start,d.end)}</td><td>${rulers.filter(r=>r.dynasty===d.id).length}</td><td>${E(d.coverage)}</td></tr>`).join('')}</tbody></table></div></section><section class="panel source-panel source-full"><h3>来源索引与继续阅读</h3><p>以下链接用于来源透明与继续阅读；页面已内置原创摘要，可离线浏览。原典索引不等于每项生平都经过独立专业审校，具体核验范围见各 sources-notes 文档。</p><div class="source-link-list">${unique.map(s=>`<a href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)} ↗</a>`).join('')}</div></section></div>`;
  }
  function showDetail(header,body) {
    document.getElementById('detail-content').innerHTML=`<div class="dialog-header"><div>${header}</div><button class="icon-button" data-action="close-dialog" aria-label="关闭详情">${icon('close')}</button></div><div class="dialog-body">${body}</div>`;
    if(!dialog.open) {lastFocus=document.activeElement;dialog.showModal();}
  }
  function openRuler(id) {
    const r=rulerById.get(id);if(!r)return;
    state.dialog={type:'ruler',id};
    if(!state.visited.includes(id)) {state.visited.push(id);persist();}
    const age=C.distance(r.birth,r.death),key='r:'+r.id,isSaved=state.bookmarks.includes(key);
    showDetail(`<span class="tag">${E(dynastyName(r.dynasty))} · 人物档案</span><h2>${E(r.name)}</h2><div class="dialog-subtitle">${E(r.personal)} · ${(r.tags||[]).map(E).join(' / ')}</div>`,
      `<div class="date-tiles"><div class="date-tile">出生<strong>${label(r.birth)}</strong></div><div class="date-tile">去世<strong>${label(r.death)}</strong><span>${age===null?'生卒资料不足，不计算寿命':`寿命约 ${age} 岁（年份差）`}</span></div><div class="date-tile">在位时间合计<strong>${C.reignLabel(r.reigns)}</strong><span>${r.reigns.length>1?r.reigns.length+' 段在位分别相加':'按起讫年份估算，未计具体月日'}</span></div></div><div class="section-label">什么时候在位</div><p style="font-size:15px;color:#607a4e">${royalYears(r)}</p>${child()?`<div class="detail-child">${E(r.child)}</div>`:''}<div class="fact-block"><h4>留下的成就与行动</h4><p>${E(r.achievement)}</p></div><div class="fact-block cost"><h4>局限、失误与普通人付出的代价</h4><p>${E(r.cost)}</p></div>${r.note?`<div class="detail-note">资料说明：${E(r.note)}</div>`:''}<div class="dialog-actions"><button class="btn primary" data-action="bookmark" data-key="${key}" aria-pressed="${isSaved}">${isSaved?'★ 已收藏':'☆ 收藏人物'}</button><button class="btn" data-action="compare-toggle" data-id="${r.id}">${state.compare.includes(r.id)?'✓ 已加入对比':'＋ 加入对比'}</button><button class="btn" data-action="ruler-era" data-id="${r.id}">回到他的时代</button></div>${sourcesHTML(r.sources)}`);
  }
  function openDynasty(id) {
    const d=dynastyById.get(id);if(!d)return;state.dialog={type:'dynasty',id};
    showDetail(`<span class="tag">朝代与政权</span><h2>${E(d.name)}</h2><div class="dialog-subtitle">${range(d.start,d.end)} · ${C.distance(d.start,d.end)} 年跨度</div>`,
      `${child()?`<div class="detail-child">${E(d.child)}</div>`:''}<p>${E(d.summary)}</p><div class="detail-note">都城与政治中心：${E(d.capital)}</div><div class="fact-block"><h4>社会留下了什么</h4>${d.legacy.map(p=>`<p>${E(p)}</p>`).join('')}</div><div class="fact-block cost"><h4>矛盾与代价</h4>${d.costs.map(p=>`<p>${E(p)}</p>`).join('')}</div><h3>普通人的生活</h3><p>${E(d.daily)}</p><div class="detail-note">收录口径：${E(d.coverage)}</div><div class="dialog-actions"><button class="btn primary" data-action="dynasty-rulers" data-id="${d.id}">查看 ${rulers.filter(r=>r.dynasty===id).length} 位人物</button><button class="btn" data-action="dynasty" data-id="${d.id}">前往时间轴</button></div>${sourcesHTML(d.sources)}`);
  }
  function openEvent(id) {
    const e=eventById.get(id);if(!e)return;state.dialog={type:'event',id};const key='e:'+id,isSaved=state.bookmarks.includes(key);
    showDetail(`<span class="tag ${e.kind==='battle'?'rust':'ochre'}">${kindLabel(e.kind)}</span><h2>${E(e.title)}</h2><div class="dialog-subtitle">${e.endYear&&e.endYear!==e.year?range(e.year,e.endYear):label(e.year)} · ${E(e.place)}</div>`,
      `${child()?`<div class="detail-child">${E(e.child)}</div>`:''}<div class="detail-note">${e.kind==='battle'?'相关交战方':'参与者与背景'}：${E(e.actors)}</div><div class="causal-flow">${[['为什么发生',e.cause],['发生之后的结果',e.result],['对后来与普通人的影响',e.impact]].map(([h,p],i)=>`<div class="causal-item"><span class="causal-number">${i+1}</span><div><h4>${h}</h4><p>${E(p)}</p></div></div>`).join('')}</div><h3>把一个问题带走</h3><p>${E(e.lesson)}</p>${e.note?`<div class="detail-note">${E(e.note)}</div>`:''}<div class="dialog-actions"><button class="btn primary" data-action="bookmark" data-key="${key}" aria-pressed="${isSaved}">${isSaved?'★ 已收藏':'☆ 收藏事件'}</button><button class="btn" data-action="event-map" data-id="${id}">在地图上找一找</button><button class="btn" data-action="event-era" data-id="${id}">查看同一年</button></div><p class="small muted" style="font-size:10px;margin-top:14px">地图定位是约略地区；事件若跨多个地点，以一个教学参照点表示。跳转后会显示最近地图切片的真实年份。</p>${sourcesHTML(e.sources)}`);
  }
  function openWorld(id) {
    const w=worlds.find(x=>x.id===id);if(!w)return;state.dialog={type:'world',id};
    showDetail(`<span class="tag">${E(w.region)} · 同期世界</span><h2>${E(w.name)}</h2><div class="dialog-subtitle">${range(w.start,w.end)}</div>`,`${child()?`<div class="detail-child">${E(w.child)}</div>`:''}<p>${E(w.summary)}</p><div class="detail-note">地图上的点是文明或政权的代表位置，并不是国土边界。卡片时间为教学分期，内部发展并不均匀。</div>${sourcesHTML(w.sources)}`);
  }
  function openCompare() {
    const list=state.compare.map(id=>rulerById.get(id)).filter(Boolean);if(list.length<2){toast('请先加入至少两位人物。');return;}state.dialog={type:'compare'};
    const rows=[['本名',r=>E(r.personal)],['所处政权',r=>E(dynastyName(r.dynasty))],['生卒',r=>range(r.birth,r.death)],['在位起讫',r=>royalYears(r)],['在位时长',r=>C.reignLabel(r.reigns)],['行动与成就',r=>E(r.achievement)],['局限与代价',r=>E(r.cost)],['资料说明',r=>E(r.note||'见人物档案资料出处')]];
    showDetail('<span class="tag">人物对照</span><h2>换一个角度，重新判断。</h2><div class="dialog-subtitle">把时代条件、行动与结果放在一起，不做简单打分。</div>',`<div class="comparison-scroll"><table class="comparison-table"><thead><tr><th>观察角度</th>${list.map(r=>`<th>${E(r.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([h,f])=>`<tr><td>${h}</td>${list.map(r=>`<td>${f(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="detail-note" style="margin-top:18px">🪞 同样是“成功”，条件和代价可能完全不同。一个人的在位时间长，不等于他的所有决定都正确。</div>${sourcesHTML(list.flatMap(r=>r.sources))}`);
  }
  function openGlossary() {
    state.dialog={type:'glossary'};showDetail('<span class="tag">边读边懂</span><h2>历史小辞典</h2><div class="dialog-subtitle">遇到生词，停下来弄明白再出发。</div>',LEARN.glossary.map(([word,meaning])=>`<div class="fact-block"><h4>${E(word)}</h4><p>${E(meaning)}</p></div>`).join(''));
  }
  function refreshDialog() {
    const d=state.dialog;if(!d)return;
    ({ruler:()=>openRuler(d.id),dynasty:()=>openDynasty(d.id),event:()=>openEvent(d.id),world:()=>openWorld(d.id),compare:openCompare,glossary:openGlossary}[d.type]||(()=>{}))();
  }
  function closeDialog() {dialog.close();state.dialog=null;}
  dialog.addEventListener('close',()=>{state.dialog=null;if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});else main.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  function toggleBookmark(key) {
    if(!validKeys.has(key))return;
    const at=state.bookmarks.indexOf(key);if(at>=0)state.bookmarks.splice(at,1);else state.bookmarks.push(key);
    persist();const modal=state.dialog;render();if(modal){state.dialog=modal;refreshDialog();}toast(at>=0?'已移出收藏':'已收藏，下次从“我的收藏”继续');
  }
  function toggleCompare(id) {
    if(!rulerById.has(id))return;const at=state.compare.indexOf(id);
    if(at>=0)state.compare.splice(at,1);else if(state.compare.length<3)state.compare.push(id);else{toast('最多同时比较3位，先移除一位再添加。');return;}
    const modal=state.dialog;render();if(modal){state.dialog=modal;refreshDialog();}toast(at>=0?'已从对比中移除':`已加入对比（${state.compare.length}/3），到帝王档案下方打开对比`);
  }
  function changeSnapshot(index,manual=true) {
    if(manual)stopPlayback();state.mapIndex=Math.min(snapshots.length-1,Math.max(0,Number(index)));state.mapCamera=null;state.mapRegion=null;state.selectedEvent=null;
    const snapshot=snapshots[state.mapIndex];state.year=snapshot.year;const ds=C.activeDynasties(dynasties,state.year);if(ds.length)state.dynasty=ds[0].id;persist();render();
  }
  function stopPlayback() {clearInterval(playTimer);playTimer=null;state.playing=false;}
  function playMaps() {
    if(state.playing){stopPlayback();render();return;}
    if(state.mapIndex===snapshots.length-1)changeSnapshot(0);
    state.playing=true;render();
    playTimer=setInterval(()=>{if(state.view!=='atlas'){stopPlayback();return;}if(state.mapIndex>=snapshots.length-1){stopPlayback();render();return;}changeSnapshot(state.mapIndex+1,false);},2600);
  }
  function syncMapCamera() {
    const svg=document.getElementById('atlas-svg');if(svg)svg.setAttribute('viewBox',cameraString(state.mapCamera||cameraFor(snapshots[state.mapIndex])));
  }
  function zoomMap(factor,anchor=null) {
    const old=state.mapCamera||cameraFor(snapshots[state.mapIndex]);
    const newW=Math.min(150,Math.max(10,old.w*factor)),ratio=newW/old.w;
    const ax=anchor?.x??(old.x+old.w/2),ay=anchor?.y??(old.y+old.h/2);
    state.mapCamera={x:ax-(ax-old.x)*ratio,y:ay-(ay-old.y)*ratio,w:newW,h:old.h*ratio};syncMapCamera();
  }
  let suppressMapClick=false;
  function wireMap() {
    const svg=document.getElementById('atlas-svg');if(!svg)return;let drag=null;
    // Capture only after a drag begins; immediate capture would steal region/marker clicks.
    svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={clientX:e.clientX,clientY:e.clientY,camera:{...(state.mapCamera||cameraFor(snapshots[state.mapIndex]))},moved:false};});
    svg.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.clientX,dy=e.clientY-drag.clientY;if(!drag.moved&&Math.hypot(dx,dy)>4){drag.moved=true;svg.setPointerCapture(e.pointerId);}if(!drag.moved)return;const bounds=svg.getBoundingClientRect();const scale=Math.min(bounds.width/drag.camera.w,bounds.height/drag.camera.h);if(scale<=0)return;state.mapCamera={...drag.camera,x:drag.camera.x-dx/scale,y:drag.camera.y-dy/scale};syncMapCamera();});
    const end=e=>{if(!drag)return;suppressMapClick=drag.moved;drag=null;if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);};
    svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
    svg.addEventListener('wheel',e=>{e.preventDefault();const matrix=svg.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());zoomMap(e.deltaY>0?1.14:.87,p);},{passive:false});
  }
  function exportNotes() {
    const bookmarks=state.bookmarks.map(key=>{const item=key.startsWith('r:')?rulerById.get(key.slice(2)):eventById.get(key.slice(2));return '- '+(item.name||item.title);});
    const text=`# 观史 · 我的发现手记\n\n导出时间：${new Date().toLocaleString('zh-CN')}\n\n${state.notes||'还没有写下笔记。'}\n\n## 收藏\n\n${bookmarks.join('\n')||'暂无收藏'}\n\n## 探索记录\n\n读过 ${state.visited.length} 位人物，答对 ${state.answered.length} / ${LEARN.questions.length} 道题。\n`;
    const blob=new Blob(['\ufeff'+text],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='guanshi-history-notes.md';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('手记已导出，请查看浏览器下载列表。');
  }
  function searchGlobal(query) {
    const result=document.getElementById('search-results');const q=query.trim();if(!q){result.hidden=true;return;}
    const ds=dynasties.filter(x=>C.matches(x,q)).slice(0,4),rs=rulers.filter(x=>C.matches(x,q)).slice(0,7),es=events.filter(x=>C.matches(x,q)).slice(0,5);
    result.innerHTML=`<div class="search-heading">搜索“${E(q)}”</div>${ds.map(d=>`<button data-action="dynasty" data-id="${d.id}"><span>${E(d.name)}</span><small>朝代 · ${range(d.start,d.end)}</small></button>`).join('')}${rs.map(r=>`<button data-action="ruler" data-id="${r.id}"><span>${E(r.name)} · ${E(r.personal)}</span><small>${E(dynastyName(r.dynasty))}</small></button>`).join('')}${es.map(e=>`<button data-action="event" data-id="${e.id}"><span>${E(e.title)}</span><small>${label(e.year,false)}</small></button>`).join('')}${!ds.length&&!rs.length&&!es.length?'<p class="small muted" style="padding:10px">暂无匹配。试试本名、朝代或其他关键词。</p>':''}`;result.hidden=false;
  }
  function renderRetainingInput(id,value,caret) {
    render();const input=document.getElementById(id);if(!input)return;input.focus({preventScroll:true});if(typeof caret==='number')try{input.setSelectionRange(caret,caret);}catch(_){}
  }
  function render() {
    renderNav();
    const renderers={overview:overviewHTML,rulers:rulersHTML,atlas:atlasHTML,events:eventsHTML,world:worldHTML,learn:learningHTML,bookmarks:bookmarksHTML,sources:sourcesPageHTML};
    main.innerHTML=renderers[state.view]();
    if(state.view==='overview')drawTimeline();if(state.view==='atlas')wireMap();
  }
  document.addEventListener('click',e=>{
    const target=e.target.closest('[data-action]');
    if(!e.target.closest('.global-search-wrap'))document.getElementById('search-results').hidden=true;
    if(suppressMapClick&&e.target.closest('#atlas-svg')){suppressMapClick=false;return;}suppressMapClick=false;
    if(!target||target.disabled)return;
    const a=target.dataset.action,id=target.dataset.id;
    const actions={
      nav:()=>nav(target.dataset.view),
      mode:()=>{state.mode=target.dataset.mode;persist();const modal=state.dialog;render();if(modal){state.dialog=modal;refreshDialog();}},
      dynasty:()=>selectDynasty(id),
      'dynasty-detail':()=>openDynasty(id),
      'dynasty-rulers':()=>{state.rulerFilter=id;state.rulerQuery='';state.rulerPage=1;nav('rulers');},
      ruler:()=>openRuler(id),event:()=>openEvent(id),'world-detail':()=>openWorld(id),
      'close-dialog':closeDialog,
      'timeline-zoom':()=>{timelineScroll=null;state.zoom=Math.min(40,Math.max(1,state.zoom*Number(target.dataset.factor)));drawTimeline();document.getElementById('zoom-label').textContent=state.zoom.toFixed(1)+'×';document.querySelector('[data-action="timeline-zoom"][data-factor="0.6"]').disabled=state.zoom<=1;document.querySelector('[data-action="timeline-zoom"][data-factor="1.7"]').disabled=state.zoom>=40;},
      'timeline-fit':()=>{state.zoom=1;timelineScroll=0;render();},
      'timeline-dynasty':()=>{const d=dynastyById.get(state.dynasty);state.zoom=Math.min(40,Math.max(1,C.distance(C.MIN_YEAR,C.MAX_YEAR)/(C.distance(d.start,d.end)+45)));timelineScroll=null;render();},
      'ruler-reset':()=>{state.rulerFilter='all';state.rulerQuery='';state.rulerPage=1;render();},
      'ruler-page':()=>{state.rulerPage+=Number(target.dataset.delta);render();window.scrollTo({top:0,behavior:'instant'});},
      bookmark:()=>toggleBookmark(target.dataset.key),
      'compare-toggle':()=>toggleCompare(id),'compare-clear':()=>{state.compare=[];render();},'compare-open':openCompare,
      'ruler-era':()=>{const r=rulerById.get(id),d=dynastyById.get(r.dynasty),year=r.reigns.find(x=>C.validYear(x.start))?.start||d.start;setYear(year,false);state.dynasty=r.dynasty;timelineScroll=null;nav('overview');},
      'event-map':()=>{const ev=eventById.get(id);setYear(ev.year,false);state.selectedEvent=ev.id;const cam=cameraFor(snapshots[state.mapIndex]);state.mapCamera={...cam,x:ev.lon-cam.w/2,y:-ev.lat-cam.h/2};nav('atlas');toast(`已标出${ev.title}（${label(ev.year)}）；背景采用${label(snapshots[state.mapIndex].year)}切片。`);},
      'event-era':()=>{setYear(eventById.get(id).year,false);timelineScroll=null;nav('overview');},
      'event-kind':()=>{state.eventKind=target.dataset.kind;render();},
      'event-reset':()=>{state.eventKind='all';state.eventDynasty='all';state.eventQuery='';render();},
      snapshot:()=>changeSnapshot(Number(target.dataset.index)),
      'snapshot-step':()=>changeSnapshot(state.mapIndex+Number(target.dataset.delta)),
      'map-play':playMaps,'map-region':()=>{state.mapRegion=id;render();},
      'map-zoom':()=>zoomMap(Number(target.dataset.factor)),
      'map-reset':()=>{state.mapCamera=null;syncMapCamera();},
      'map-layer':()=>{if(['showCities','showRivers','showBattles'].includes(target.dataset.layer))state[target.dataset.layer]=!state[target.dataset.layer];render();},
      'world-all':()=>{state.worldAll=!state.worldAll;render();},
      journey:()=>{state.journey=Math.min(LEARN.journeys.length-1,Math.max(0,Number(target.dataset.index)));persist();render();},
      'journey-go':()=>{const j=LEARN.journeys[state.journey];setYear(j.year,false);state.dynasty=j.dynasty;state.rulerFilter=j.dynasty;state.zoom=1;timelineScroll=null;nav('overview');},
      'quiz-answer':()=>{if(state.quizSelection!==null)return;const q=LEARN.questions[state.quizIndex];state.quizSelection=Number(target.dataset.index);if(state.quizSelection===q.correct&&!state.answered.includes(q.id)){state.answered.push(q.id);persist();}render();},
      'quiz-step':()=>{state.quizIndex=(state.quizIndex+Number(target.dataset.delta)+LEARN.questions.length)%LEARN.questions.length;state.quizSelection=null;render();},
      glossary:openGlossary,'export-notes':exportNotes
    };
    if(actions[a]){if(target.closest('#search-results'))document.getElementById('search-results').hidden=true;actions[a]();}
  });
  document.addEventListener('change',e=>{
    const value=e.target.value;
    const handlers={
      'ruler-dynasty':()=>{state.rulerFilter=value;state.rulerPage=1;render();},
      'event-dynasty':()=>{state.eventDynasty=value;render();},
      'year-slider':()=>{timelineScroll=null;setYear(C.fromOrdinal(Number(value)));},
      'world-year':()=>setYear(C.fromOrdinal(Number(value))),
      'snapshot-select':()=>changeSnapshot(Number(value)),
      'snapshot-slider':()=>changeSnapshot(Number(value))
    };handlers[e.target.id]?.();
  });
  // Never replace an input while a Chinese IME is composing a word.
  const composingInputs = new Set();
  document.addEventListener('compositionstart',e=>{composingInputs.add(e.target.id);});
  document.addEventListener('compositionend',e=>{
    const el=e.target;composingInputs.delete(el.id);
    if(el.id==='ruler-search'){state.rulerQuery=el.value;state.rulerPage=1;renderRetainingInput(el.id,el.value,el.selectionStart);}
    if(el.id==='event-search'){state.eventQuery=el.value;renderRetainingInput(el.id,el.value,el.selectionStart);}
    if(el.id==='global-search')searchGlobal(el.value);
  });
  document.addEventListener('input',e=>{
    const el=e.target,value=el.value;
    if(['ruler-search','event-search','global-search'].includes(el.id)&&(e.isComposing||composingInputs.has(el.id)))return;
    if(el.id==='global-search')searchGlobal(value);
    if(el.id==='ruler-search'){state.rulerQuery=value;state.rulerPage=1;renderRetainingInput(el.id,value,el.selectionStart);}
    if(el.id==='event-search'){state.eventQuery=value;renderRetainingInput(el.id,value,el.selectionStart);}
    if(el.id==='year-slider'){
      document.getElementById('current-year-label').textContent=label(C.fromOrdinal(Number(value)));
      const canvas=document.getElementById('timeline-canvas'),cursor=document.getElementById('year-cursor');if(cursor)cursor.style.left=(Number(value)-C.ordinal(C.MIN_YEAR))/C.distance(C.MIN_YEAR,C.MAX_YEAR)*canvas.clientWidth+'px';
    }
    if(el.id==='world-year')document.getElementById('world-year-label').textContent=label(C.fromOrdinal(Number(value)));
    if(el.id==='learning-notes'){state.notes=value.slice(0,20000);persist();document.getElementById('note-status').textContent=storageOK?'已保存到当前浏览器':'浏览器限制保存，请及时导出';}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='year-form')return;e.preventDefault();const input=document.getElementById('year-input'),year=C.parseYear(input.value);
    if(year===null){input.setAttribute('aria-invalid','true');toast('请输入前2070年至1912年之间的整数，公元前用负数；没有公元0年。');return;}
    timelineScroll=null;setYear(year);
  });
  document.addEventListener('keydown',e=>{
    const editing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
    if(e.key==='/'&&!editing&&!dialog.open){e.preventDefault();document.getElementById('global-search').focus();}
    if(e.key==='Escape')document.getElementById('search-results').hidden=true;
    if(e.target.id==='global-search'&&e.key==='Enter'){e.preventDefault();document.querySelector('#search-results button')?.click();}
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('svg [role="button"]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
  });
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(state.view==='overview')drawTimeline();},120);});
  window.addEventListener('hashchange',()=>{
    if(location.hash==='#main'){main.focus({preventScroll:true});return;}
    nav(location.hash.slice(1));
  });
  window.addEventListener('pagehide',()=>{persist();stopPlayback();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing){stopPlayback();if(state.view==='atlas')render();}});
  nav(location.hash.slice(1)||'overview',false);
})();
