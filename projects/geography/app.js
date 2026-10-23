/* Data layers, linked selection, keyboard-accessible comparison and route inspection. */
(function(){'use strict';
const M=Museum,G=GeoData,C=WorldCore,D=LabDraw,P=D.colors;let currentMap=null,active=null,hovered=null,records=[],repaint=()=>{},values=null,lesson=null,search='',compared=new Set(),recordKey='',countryKey='',regionKey='',projectionKey='',lastTime=0;
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const coordinate=p=>`${Math.abs(p.lon).toFixed(2)}°${p.lon<0?'W':'E'} · ${Math.abs(p.lat).toFixed(2)}°${p.lat<0?'S':'N'}`;
for(const l of M.lessons){
 l.controls.push({id:'projection',label:'地图视图',type:'select',value:['globe','coordinates'].includes(l.id)?'globe':'flat',options:[['flat','平面地图 · 平移'],['globe','球体 · 旋转']]},
 {id:'borders',label:'国家／地区简化边界',type:'checkbox',value:true},{id:'names',label:'国家／地区名称',type:'checkbox',value:!['landforms','rivers'].includes(l.id)},{id:'oceans',label:'大洋名称',type:'checkbox',value:true},
 {id:'country',label:'定位国家／地区',type:'select',value:'',options:[['','不单独定位'],...GeoCountries.filter(c=>c.name!=='南极洲').sort((a,b)=>a.name.localeCompare(b.name,'zh')).map(c=>[c.id,c.name])]});
 l.limits+=' 国家／地区边界来自本地 Natural Earth 低分辨率快照，原始发布日期未确认，不代表当前权威边界。航路叠加的是现代简化边界，不是1519年的国界。';
 l.sources.push(['Natural Earth 国家边界与数据约定','https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/']);
 l.try='地图中拖动旋转／平移，滚轮或画面上方 + / − 缩放。信息说明放在画面外，不压住地理对象。';
}
const coordinateLesson=M.lessons.find(l=>l.id==='coordinates');
coordinateLesson.sources.push(['美国国务院历史档案：朝鲜停战线与北纬38°','https://history.state.gov//historicaldocuments/frus1952-54v15p2/d932'],['越南之声实地报道：北纬17°展馆与边海河','https://vovworld.vn/media/17th-parallel-exhibition-hall-a-tribute-to-the-past-a-commitment-to-present-peace-2237330.vov5']);
coordinateLesson.controls.push({id:'reference',label:'参考纬线',type:'select',value:'38',options:[['none','不显示'],['0','赤道 0°'],['17','北纬17°'],['38','北纬38°']]});
coordinateLesson.adult+=' 北纬38°常见于朝鲜半岛历史；越南历史中的临时军事分界在北纬17°附近，实际分界沿边海河，并不等于整条纬线。这里是纬线参照，不画作现代国界。';
const land=M.lessons.find(l=>l.id==='landforms');land.controls.push({id:'labels',label:'显示山名／地点名',type:'checkbox',value:true},{id:'ranges',label:'山脉概略走向带',type:'checkbox',value:true},{id:'ranking',label:'地点与海拔比较',type:'select',value:'places',options:[['places','原精选山岳／湖峡'],['height','20个已引用山峰 · 海拔降序']]});
land.sources.push(G.heightSource,G.everestSource);land.intro='山脉有走向，山峰有海拔。悬停读名字，勾选后并排比较；山脉和单峰不要混为一谈。';land.adult='山脉用人工概化轴线和半透明带表达大致走向，带宽为图形强调，不是实测边界。海拔排行榜只比较所列20个有出处的山峰，不冒充全国最高峰榜。';
land.limits+=' 山脉走向为人工教学概化；未载入高程栅格，不输出虚假的三维地形。20个峰高样本按海拔比较，2007年的景区高程与2020年的珠峰雪面高程注明年份。';
M.lessons.find(l=>l.id==='voyages').controls.push({id:'stops',label:'显示关键节点与编号',type:'checkbox',value:true});
function pickRecords(v){return lesson.id==='landforms'?(v.kind==='mountain'&&v.ranking==='height'?G.heights:({mountain:G.mountains,lake:G.lakes,canyon:G.canyons}[v.kind])):lesson.id==='ports'?G.ports:lesson.id==='scenic'?G.scenic:[];}
function detail(p){if(!p)return;$('#place-detail').textContent=p.name+' · '+coordinate(p)+(p.height?' · 海拔 '+p.height.toLocaleString()+' m':'')+' — '+p.note;}
function list(){const box=$('#place-list');if(!box)return;box.innerHTML='';const found=records.filter(p=>(p.name+p.note).includes(search));
 for(const [i,p]of found.entries()){
  const row=document.createElement('div');row.className='place-row';
  const b=document.createElement('button');b.dataset.place=p.id;b.textContent=(i+1)+'. '+p.name+(p.height?'　'+p.height.toLocaleString()+' m':'');b.setAttribute('aria-pressed',active?.id===p.id);
  b.onmouseenter=()=>{hovered=p;detail(p);repaint();};b.onmouseleave=()=>{hovered=null;detail(active);repaint();};b.onfocus=()=>{hovered=p;detail(p);repaint();};b.onblur=()=>{hovered=null;repaint();};b.onclick=()=>{active=p;detail(p);list();repaint();};row.append(b);
  if(lesson.id==='landforms'){const label=document.createElement('label');label.className='compare-choice';const input=document.createElement('input');input.type='checkbox';input.checked=compared.has(p.id);input.setAttribute('aria-label','比较'+p.name);input.onchange=()=>{if(input.checked)compared.add(p.id);else compared.delete(p.id);comparison();repaint();};label.append(input,document.createTextNode('比较'));row.append(label);}box.append(row);
 }
 if(!found.length)box.textContent='没有匹配的地点。清空搜索可恢复全部。';detail(active);comparison();
}
function comparison(){const box=$('#height-compare');if(!box)return;const chosen=records.filter(p=>compared.has(p.id));box.innerHTML='';if(!chosen.length){box.textContent='勾选列表右侧“比较”，保留多个地点。切换海拔榜可一次查看20个峰高。';return;}
 const max=Math.max(1,...chosen.map(p=>p.height||0));for(const p of chosen){const row=document.createElement('div');row.className='compare-bar';row.innerHTML='<span>'+esc(p.name)+'</span><div><i style="width:'+((p.height||0)/max*100)+'%"></i></div><strong>'+(p.height?p.height.toLocaleString()+' m':'未纳入测高样本')+'</strong>';box.append(row);} }
function routePoints(points,t){const count=Math.ceil(260*t),ps=[];for(let i=0;i<=count;i++)ps.push(C.interpolateRoute(points,Math.min(t,i/260)));return ps;}
function stateRoute(){return lesson.id==='voyages'?G.routes[values.route]:null;}
function renderStops(){const box=$('#voyage-nodes');if(!box)return;const route=stateRoute();box.innerHTML='';route.stops.forEach((name,i)=>{const b=document.createElement('button');b.textContent=(i+1)+' '+name;b.dataset.stop=i;b.onclick=()=>{LabTest.seek(i/(route.stops.length-1));currentMap.focus(...route.points[i],values.projection==='globe'?1.6:2.2);repaint();};box.append(b);});}
M.mount=({lesson:l,values:v,custom,redraw})=>{
 lesson=l;values=v;repaint=redraw;active=hovered=null;search='';compared=new Set();recordKey=countryKey=regionKey=projectionKey='';lastTime=0;
 custom.innerHTML=['landforms','ports','scenic'].includes(l.id)?'<section class="card"><div class="map-list-grid"><div><h2>所有地点，一眼对照</h2><label for="place-search">筛选本图地点</label><input id="place-search" type="search" placeholder="输入山名、湖泊或港口"><p id="place-detail" class="details-text" role="status"></p><div id="place-list" class="place-list"></div></div><div><h2>所选地点比较</h2><p class="tiny">高度栏只列有出处的单峰；山脉的走向长度不是海拔。</p><div id="height-compare" class="compare-bars"></div></div></div></section>':l.id==='voyages'?'<section class="card"><h2>沿节点读航程</h2><p id="voyage-location" role="status"></p><p class="tiny">点击节点可跳转并定位；拖动地图不改变航程。节点之间是历史概略重建，并非原始航海定位。</p><div id="voyage-nodes" class="phase-strip"></div></section>':l.id==='coordinates'?'<section class="card"><h2>纬线不等于国界</h2><p>北纬38°常用于理解朝鲜半岛历史；越南历史中的临时分界在北纬17°附近，沿边海河，并不是沿整条纬线。小空心十字只标位置，不盖住纬线。</p></section>':'';
 let initial=l.id==='landforms'||l.id==='rivers'||l.id==='scenic'?{lon:105,lat:35,zoom:4}:l.id==='ports'?{lon:60,lat:20,zoom:1.7}:l.id==='migration'?{lon:110,lat:12,zoom:6}:{lon:0,lat:8,zoom:1};
 currentMap=LabMap.create($('#canvas'),redraw,{...initial,projection:v.projection});
 currentMap.onHover=p=>{hovered=p;if(p)detail(p);else detail(active);};currentMap.onSelect=p=>{active=p;detail(p);list();redraw();};
 if($('#place-search'))$('#place-search').oninput=e=>{search=e.target.value.trim();list();redraw();};
 if(l.id==='voyages')renderStops();
 const view={three:false,renderer:'geographic-projection',zoom:currentMap.zoom,resetCamera:()=>{Object.assign(currentMap.state,initial);regionKey='';redraw();},dispose:currentMap.dispose};
 return view;
};
M.render=({ctx:c,values:v,time:t,lesson:l})=>{
 values=v;const map=currentMap;if(!map)return;map.state.projection=v.projection;
 if(projectionKey!==v.projection){projectionKey=v.projection;map.state.zoom=v.projection==='globe'?1:l.id==='landforms'?4:1;}
 if(v.country!==countryKey){countryKey=v.country;const chosen=GeoCountries.find(p=>p.id===v.country);if(chosen)map.focus(...chosen.center,v.projection==='globe'?1.7:2.8);}
 if(['globe','coordinates'].includes(l.id)){
  const reg=G.regions.find(p=>p[0]===v.region)||G.regions[0],lon=l.id==='coordinates'?v.lon:reg[2],lat=l.id==='coordinates'?v.lat:reg[3],key=lon+','+lat;
  if(key!==regionKey){regionKey=key;map.focus(lon,lat,v.projection==='globe'?1:1.4);}
  if(l.id==='globe'&&v.spin)map.state.lon=LabMap.wrap(map.state.lon+(t-lastTime)*360);lastTime=t;
  map.base(c,v);if(l.id==='coordinates'){map.parallel(c,lat);map.meridian(c,lon);if(v.reference!=='none')map.parallel(c,Number(v.reference),'#e7a6c7',1.5);}
  map.marker(c,lon,lat,{cross:true,radius:4,color:P.gold});
  return{metrics:l.id==='globe'?[['海洋表面积','约71%'],['陆地表面积','约29%'],['观察区域',reg[1]]]:[['经度',lon+'°'],['纬度',lat+'°'],['到上海的球面距离',Math.round(C.distance([121.47,31.23],[lon,lat])).toLocaleString()+' km']],hint:'小空心标记不随放大变粗；边界、名称、大洋可独立控制。'};
 }
 map.base(c,v);
 if(['landforms','ports','scenic'].includes(l.id)){
  const key=l.id+v.kind+v.ranking;if(recordKey!==key){recordKey=key;records=pickRecords(v);active=records[0];compared.clear();list();}
  const focus=hovered||active;
  if(l.id==='landforms'&&v.ranges&&v.kind==='mountain')for(const [name,points]of Object.entries(G.rangeAxes)){const selected=focus?.name===name||focus?.name==='珠穆朗玛峰'&&name==='喜马拉雅山脉';map.path(c,points,selected?'#efd39544':'#ddca8d22',selected?16:12);map.path(c,points,selected?'#ffd18b':'#c9b47a99',selected?3:1.5);}
  const labels=[];for(const [i,p]of records.entries()){
   if(search&&!(p.name+p.note).includes(search))continue;
   const selected=focus?.id===p.id||compared.has(p.id),xy=map.marker(c,p.lon,p.lat,{record:p,radius:selected?5:3,color:selected?P.gold:P.teal,cross:selected});if(!xy)continue;
   if(v.labels!==false||selected){const name=p.name+(selected&&p.height?' '+p.height+'m':'');let dy=-14,dx=8;const width=name.length*14;
    for(let k=0;k<6;k++){dy=[-16,18,-34,36,-52,54][k];if(!labels.some(r=>xy[0]+dx<r[2]&&xy[0]+dx+width>r[0]&&xy[1]+dy-8<r[3]&&xy[1]+dy+8>r[1]))break;}
    const x=Math.min(930-width,Math.max(28,xy[0]+dx)),y=Math.min(510,Math.max(80,xy[1]+dy));labels.push([x,y-8,x+width,y+8]);map.text(c,name,x,y,selected?P.gold:'#d8e7d8',selected?16:13,'left');
   }
  }
  return{metrics:[['本图集合',records.length+'处'],['悬停／选中',focus?.name||''],['高程或范围',focus?.height?focus.height.toLocaleString()+' m':focus?.axis?'概略山脉走向':'代表位置']],hint:l.id==='landforms'?'半透明带＝概略走向，不是测绘边界。悬停无需点击；下方列表可同时勾选比较。':'悬停读名称，点击固定选择；边界为离线简化快照。'};
 }
 let route,points,color=P.gold;
 if(l.id==='voyages'){route=G.routes[v.route];points=route.points;if(recordKey!==v.route){recordKey=v.route;renderStops();}}
 if(l.id==='rivers'){route=G.rivers.find(r=>r.id===v.river);points=route.points;color=P.blue;for(const river of G.rivers)map.path(c,routePoints(river.points,1),'#72b1cd50',2);}
 if(l.id==='migration'){points=G.birds[v.season];route={name:v.season==='autumn'?'家燕 · 秋季南迁':'家燕 · 春季北返'};color=P.teal;}
 map.path(c,routePoints(points,1),'#bfd3dd66',2,[6,4]);map.path(c,routePoints(points,t),color,3);
 const position=C.interpolateRoute(points,t),index=Math.min(points.length-1,Math.floor(t*(points.length-1)+1e-7));map.marker(c,...position,{cross:true,radius:5,color});
 if(l.id==='voyages'){
  if(v.stops)route.points.forEach((p,i)=>map.marker(c,...p,{label:String(i+1),radius:3,dx:6,dy:-10,color:i<=index?P.gold:'#b9c9d0',font:13}));
  $('#voyage-location').textContent=route.name+' · 第'+(index+1)+'站：'+route.stops[index]+(v.route==='magellan'&&index>=10?'｜麦哲伦在菲律宾遇难，后续由幸存船员完成，返航由埃尔卡诺率领。':'');
  document.querySelectorAll('[data-stop]').forEach((b,i)=>b.setAttribute('aria-pressed',i===index));
  return{metrics:[['航线',route.name],['节点',`${index+1} / ${points.length}`],['当前区域',route.stops[index]]],clock:'航程示意 '+Math.round(t*100)+'%',hint:'国界是现代简化参照；编号对应下面节点。球体可自由旋转，不会被播放抢回视角。'};
 }
 return{metrics:[['观察对象',route.name],['当前位置',position.map(n=>n.toFixed(1)+'°').join(' / ')],['证据边界',l.id==='migration'?'种群方向示意，非GPS':'概略河道，不代表实际流速']],hint:route.note||'家燕迁徙因种群与个体不同而变化。',clock:'进度 '+Math.round(t*100)+'%'};
};
})();
