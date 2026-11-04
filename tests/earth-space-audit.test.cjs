'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),C=require('../shared/core.js'),Q=require('../projects/cosmos/process-models.js');
const source=file=>fs.readFileSync(path.join(root,file),'utf8');

function element(){
 const listeners=new Map(),el={children:[],dataset:{},style:{},attributes:{},textContent:'',append(...nodes){this.children.push(...nodes);},appendChild(node){this.append(node);return node;},setAttribute(k,v){this.attributes[k]=String(v);},addEventListener(k,f){listeners.set(k,f);},removeEventListener(k){listeners.delete(k);},listeners,focus(){this.focused=true;},remove(){this.removed=true;}};
 Object.defineProperty(el,'innerHTML',{set(value){this.children=[];this.html=value;},get(){return this.html||'';}});
 return el;
}
function geography(id){
 const els=Object.fromEntries(['canvas','place-list','place-detail','height-compare','place-search','voyage-nodes','voyage-location'].map(id=>['#'+id,element()]));
 const all=el=>el.children.flatMap(c=>[c,...(c.children?all(c):[])]),maps=[];
 const document={querySelector:s=>els[s]||null,querySelectorAll:s=>all(els[s==='[data-stop]'?'#voyage-nodes':'#place-list']).filter(e=>s==='[data-stop]'?e.dataset?.stop!==undefined:e.dataset?.place!==undefined),createElement:element,createTextNode:text=>({textContent:text})};
 const box={document,WorldCore:C,LabDraw:{colors:{gold:'#f',teal:'#a',blue:'#b'}},LabMap:{wrap:x=>((x+180)%360+360)%360-180,create:(canvas,redraw,initial)=>{const map={state:{...initial},base(){},path(){},marker(){return null;},parallel(){},meridian(){},text(){},zoom(){},dispose(){},focus(lon,lat,zoom){Object.assign(this.state,{lon,lat});if(zoom)this.state.zoom=zoom;}};maps.push(map);return map;}}};box.window=box;vm.createContext(box);
 for(const file of ['data.js','countries.js','terrain.js','app.js'])vm.runInContext(source('projects/geography/'+file),box);
 const lesson=box.Museum.lessons.find(l=>l.id===id),values=Object.fromEntries(lesson.controls.map(c=>[c.id,c.value]));
 const args={lesson,values,time:0,ctx:{}},draw=()=>box.Museum.render(args),view=box.Museum.mount({lesson,values,custom:element(),redraw:draw});draw();
 return{box,els,lesson,values,view,map:maps[0],draw,document};
}

test('地理首屏、投影切换和复位保留针对本课的局部范围',()=>{
 for(const [id,zoom]of [['landforms',4],['rivers',4],['scenic',4],['ports',1.7],['migration',6]]){
  const f=geography(id);assert.equal(f.map.state.zoom,zoom,id+' initial');
  f.values.projection='globe';f.draw();assert.equal(f.map.state.zoom,1);
  f.view.resetCamera();assert.equal(f.map.state.zoom,1,id+' globe reset');
  f.values.projection='flat';f.draw();assert.equal(f.map.state.zoom,zoom,id+' flat');
  f.map.state.zoom=11;f.view.resetCamera();assert.equal(f.map.state.zoom,zoom,id+' flat reset');
 }
});
test('列表选另一座山主动定位，保留按钮节点和键盘焦点；播放不会抢回视角',()=>{
 const f=geography('landforms'),buttons=f.document.querySelectorAll('[data-place]'),b=buttons[1],p=f.box.GeoData.mountains[1];
 f.map.state.lon=-120;f.map.state.lat=-40;b.focus();b.onclick();
 assert.equal(f.map.state.lon,p.lon);assert.equal(f.map.state.lat,p.lat);assert.equal(f.map.state.zoom,4);
 assert.equal(f.document.querySelectorAll('[data-place]')[1],b);assert(b.focused);assert.equal(b.attributes['aria-pressed'],'true');
 assert.match(f.els['#place-detail'].textContent,new RegExp(p.name));
 f.map.state.lon=-60;f.draw();assert.equal(f.map.state.lon,-60);
});
test('地理边界说明与实际国家图层一致，保留精选样本和历史航路限制',()=>{
 const f=geography('voyages');for(const l of f.box.Museum.lessons){assert(!l.limits.includes('不绘制政治边界'));assert(l.limits.includes('不代表当前权威边界'));assert(l.limits.includes('等经纬图在高纬夸大面积'));}
 assert(f.box.Museum.lessons.find(l=>l.id==='scenic').adult.includes('不是全国5A名录'));
 assert(f.lesson.adult.includes('不是一趟完整航次的复原'));
 for(const r of Object.values(f.box.GeoData.routes)){assert.equal(r.points.length,r.stops.length);for(let i=0;i<r.points.length;i++){const p=C.interpolateRoute(r.points,i/(r.points.length-1));assert(Math.abs(((p[0]-r.points[i][0]+540)%360)-180)<1e-9);assert(Math.abs(p[1]-r.points[i][1])<1e-9);}}
});
test('宇宙相邻尺度比较与所展示的30AU、4.24光年标签相符',()=>{
 const AU=149597870.7,LY=9460730472580.8;assert.equal(Q.widths[2],30*AU/LY);assert.equal(Q.widths[3],4.24);
 assert(Math.abs(Q.widths[2]/Q.widths[1]-11675.1728)<.001);assert(Q.widths.every(v=>Number.isFinite(v)&&v>0));
 const box={};box.window=box;vm.runInNewContext(source('projects/cosmos/data.js'),box);assert(box.CosmosData.scales[1].detail.includes('不共用比例'));
 assert(box.CosmosData.scales[6].size.includes('1.1亿'));assert(box.CosmosData.scales[7].size.includes('5.2亿'));
});
test('宇宙轨道、赤纬、光行时在参数极值及端点仍有限且有物理方向',()=>{
 const periodLow=C.orbitPeriod(200),periodHigh=C.orbitPeriod(36000);assert(periodHigh>periodLow);assert(Math.abs(C.orbitPeriod(400)-92.414251)<.00001);
 for(const a of [.2,1,30])for(const mass of [.2,2])assert(Number.isFinite(C.period(a)/Math.sqrt(mass)));
 for(const tilt of [0,23.4,45])for(const angle of [0,90,180,270,360]){const d=C.solarDeclination(angle,tilt);assert(Number.isFinite(d));assert(Math.abs(d)<=tilt+1e-10);}
 for(const dest of ['moon','sun','proxima'])for(const t of [0,.1,.9,1]){const s=Q.light(dest,t);assert(Number.isFinite(s.elapsed+s.remaining));assert(Math.abs(s.elapsed+s.remaining-s.total)<1e-6);assert.equal(s.arrived,t===1);}
});

function sceneFixture(){
 const canvas=element(),details=element(),summary=element(),buttons=['left','right','up','down'].map(turn=>Object.assign(element(),{dataset:{turn}}));details.querySelectorAll=()=>buttons;details.querySelector=()=>summary;
 const box={THREE:{},Astro:{clamp:C.clamp},document:{createElement:()=>details}};vm.runInNewContext(source('projects/astronomy/src/scene.js'),box);
 const s=Object.create(box.LabScene.prototype);Object.assign(s,{renderer:{domElement:canvas},host:element(),azimuth:0,elevation:0,distance:40,mode:'earthmoon',settings:{},camera:{fov:43,updateProjectionMatrix(){}},render(){this.renderCount=(this.renderCount||0)+1;},reset(){this.azimuth=0;this.elevation=.32;this.distance=40;}});s.bindPointer();
 const key=k=>{let prevented=false;canvas.listeners.get('keydown')({key:k,preventDefault(){prevented=true;}});return prevented;};return{s,canvas,details,buttons,key};
}
test('日月地三维画布可Tab到达，单击与方向键产生同一旋转且俯仰有界',()=>{
 const f=sceneFixture();assert.equal(f.canvas.tabIndex,0);assert.match(f.canvas.attributes['aria-label'],/方向键/);
 f.buttons[0].onclick();const clicked=f.s.azimuth;f.s.azimuth=0;assert(f.key('ArrowLeft'));assert.equal(f.s.azimuth,clicked);assert(f.s.cameraManual);assert(f.s.renderCount>0);
 for(let i=0;i<100;i++)f.key('ArrowUp');assert.equal(f.s.elevation,1.47);
 for(let i=0;i<100;i++)f.buttons[3].onclick();assert.equal(f.s.elevation,-1.47);
 assert(!f.key('Tab'));assert(f.key('Home'));assert.equal(f.s.distance,40);
});
test('日月地加减键缩放遵守空间距离与地面视角边界',()=>{
 const f=sceneFixture();for(let i=0;i<100;i++)f.key('+');assert.equal(f.s.distance,6);for(let i=0;i<100;i++)f.key('-');assert.equal(f.s.distance,180);
 f.s.mode='ground';for(let i=0;i<100;i++)f.key('+');assert.equal(f.s.camera.fov,.7);for(let i=0;i<100;i++)f.key('-');assert.equal(f.s.camera.fov,100);
});
test('日月地展开方向菜单时空格保留原生展开，不触发全局播放',()=>{
 const js=source('projects/astronomy/src/ui.js'),start=js.indexOf("document.addEventListener('keydown'"),end=js.indexOf("document.addEventListener('visibilitychange'",start);let handler,plays=0,prevented=false;
 const document={querySelector:()=>null,activeElement:{tagName:'SUMMARY'},addEventListener:(name,fn)=>{if(name==='keydown')handler=fn;}};
 vm.runInNewContext(js.slice(start,end),{document,togglePlay:()=>plays++});
 const e={code:'Space',key:' ',preventDefault(){prevented=true;}};handler(e);assert.equal(plays,0);assert(!prevented);
 document.activeElement={tagName:'CANVAS'};handler(e);assert.equal(plays,1);assert(prevented);
 handler({...e,defaultPrevented:true});assert.equal(plays,1);
});
test('地图单击方向与键盘共用经纬增量，平移保持投影和缩放且极区有界',()=>{
 const canvas=element(),details=element(),summary=element(),buttons=['left','right','up','down'].map(mapTurn=>Object.assign(element(),{dataset:{mapTurn}}));let reading=false;canvas.closest=()=>reading?{}:null;canvas.parentElement=element();details.querySelectorAll=()=>buttons;details.querySelector=()=>summary;
 const box={document:{createElement:()=>details},LabTouch:{bind:()=>({active:()=>0,dispose(){}})}};box.window=box;vm.runInNewContext(source('projects/geography/map-engine.js'),box);
 const map=box.LabMap.create(canvas,()=>{},{lon:105,lat:35,zoom:4});buttons[0].onclick();assert.equal(map.state.lon,103.5);assert.equal(map.state.zoom,4);map.state.lon=105;
 canvas.listeners.get('keydown')({key:'ArrowLeft',preventDefault(){}});assert.equal(map.state.lon,103.5);
 for(let i=0;i<100;i++)buttons[2].onclick();assert.equal(map.state.lat,85);map.state.projection='globe';buttons[1].onclick();assert.equal(map.state.projection,'globe');
 for(const point of [[-180,-90],[-180,90],[180,-90],[180,90],[0,0]])assert(map.point(...point).slice(0,2).every(Number.isFinite));
 const zoom=map.state.zoom;reading=true;let prevented=false;canvas.listeners.get('wheel')({deltaY:-100,preventDefault(){prevented=true;}});assert.equal(map.state.zoom,zoom);assert(!prevented);reading=false;canvas.listeners.get('wheel')({deltaY:-100,preventDefault(){prevented=true;}});assert(map.state.zoom>zoom);assert(prevented);
 map.dispose();assert(details.removed);assert(!canvas.listeners.has('keydown'));
});

function astronomyStorage(entries={}){
 const map=new Map(Object.entries(entries)),writes=[],notices=[],storage={getItem:k=>map.get(k)??null,setItem:(k,value)=>{writes.push(k);map.set(k,value);},removeItem:k=>map.delete(k)},A={DAY:86400000},app={getLive:()=>({state:{tab:'observe',time:0}}),validateSnapshot:s=>{if(!s||s.version!==1)throw Error('场景版本不兼容');return s;},toast:t=>notices.push(t)};
 const box={Astro:A,app};box.root=box;box.localStorage=storage;vm.createContext(box);vm.runInContext(source('projects/astronomy/src/learning.js'),box);box.L=box.Learning;
 const js=source('projects/astronomy/src/v2.js'),start=js.indexOf('let storage;'),end=js.indexOf('const originalSession=',start);
 vm.runInContext(js.slice(start,end)+';globalThis.result={store,book,savedSession,storedPreferences};',box);return{...box.result,map,writes,notices};
}
test('日月地启动遇坏JSON或未来版本后，后续自动保存与新手记不能覆盖任何原key',()=>{
 const prefix='sem-lab-v2:',preferences={audience:'research',quality:'auto',welcomed:true},session={scene:{version:1},context:{audience:'research',topic:'moon',split:true,tilt:0,height:1}},book={format:'sem-lab-notebook',version:2,notes:[]};
 const normal={[prefix+'preferences']:JSON.stringify(preferences),[prefix+'session']:JSON.stringify(session),[prefix+'book']:JSON.stringify(book)};
 for(const [name,raw]of [['book','{broken'],['book',''],['book','null'],['book',JSON.stringify({...book,version:99})],['session',JSON.stringify({...session,scene:{version:99}})],['session',JSON.stringify({...session,version:99})],['preferences','false'],['preferences',JSON.stringify({...preferences,version:99})]]){
  const original={...normal,[prefix+name]:raw},x=astronomyStorage(original);assert(x.store.readFailure,name+' '+raw);assert.match(x.store.error,/保留原数据/);assert(x.notices.length>0);
  assert.equal(x.store.put('preferences',preferences),false);assert.equal(x.store.put('session',session),false);assert.equal(x.store.put('book',{...book,notes:[{finding:'本次仍可学习并导出'}]}),false);
  assert.deepEqual(Object.fromEntries(x.map),original);assert.equal(x.writes.filter(k=>!k.endsWith(':probe')).length,0);
  assert.equal(x.store.get('book').notes[0].finding,'本次仍可学习并导出');assert(x.store.readFailure);
 }
});
test('日月地正常旧数据读取不迁移，缺省新会话与合法记录仍能持久保存',()=>{
 const key='sem-lab-v2:book',raw=' { "format": "sem-lab-notebook", "version": 2, "notes": [] } ',x=astronomyStorage({[key]:raw});assert.equal(x.store.readFailure,false);assert.equal(x.map.get(key),raw);assert.equal(x.writes.filter(k=>!k.endsWith(':probe')).length,0);
 assert.equal(x.store.put('book',{format:'sem-lab-notebook',version:2,notes:[]}),true);assert.equal(JSON.parse(x.map.get(key)).version,2);
 const fresh=astronomyStorage();assert(!fresh.store.readFailure);assert.equal(fresh.store.put('preferences',{audience:'kid',quality:'eco',welcomed:true}),true);
});
test('地理实际DOM事件：列表预览不改变布局内容，选天山后点方向和切投影仍保持选择',t=>{
 const {JSDOM}=require('../projects/history/node_modules/jsdom'),dom=new JSDOM('<!doctype html><body></body>',{url:'https://family-lab.test/projects/geography/index.html#landforms',runScripts:'outside-only'}),w=dom.window;t.after(()=>w.close());
 const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(target,key)=>target[key]||(()=>{})});
 w.HTMLCanvasElement.prototype.getContext=()=>ctx;w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({left:0,top:0,width:960,height:600});
 w.requestAnimationFrame=()=>0;w.matchMedia=()=>({matches:false});w.WorldCore=C;w.LabDraw={colors:{gold:'#f',teal:'#a',blue:'#b'}};
 for(const file of ['shared/touch.js','projects/geography/data.js','projects/geography/countries.js','projects/geography/terrain.js','projects/geography/map-engine.js','projects/geography/app.js','shared/shell.js'])w.eval(source(file));
 const doc=w.document,button=doc.querySelectorAll('[data-place]')[3],p=w.GeoData.mountains[3],detail=doc.querySelector('#place-detail'),initial=detail.textContent;assert.match(p.name,/天山/);
 button.dispatchEvent(new w.MouseEvent('mouseenter',{bubbles:false}));button.focus();assert.equal(detail.textContent,initial,'pointer and focus cannot change the paragraph above the list before click');
 button.click();assert.match(detail.textContent,/天山/);assert.equal(button.getAttribute('aria-pressed'),'true');assert.equal(doc.activeElement,button);let state=w.LabTest.getState();assert.equal(state.viewState.lon,p.lon);assert.equal(state.viewState.lat,p.lat);
 doc.querySelector('.map-direction-controls summary').click();doc.querySelector('[data-map-turn="left"]').click();const projection=doc.querySelector('#p-projection');projection.value='globe';projection.dispatchEvent(new w.Event('input',{bubbles:true}));
 state=w.LabTest.getState();assert.equal(state.viewState.projection,'globe');assert.equal(state.viewState.lon,p.lon-6/4);assert.equal(state.viewState.lat,p.lat);assert.match(detail.textContent,/天山/);assert.equal(button.getAttribute('aria-pressed'),'true');
 const marker=w.GeoData.mountains[0],g=w.LabMap.globePoint(marker.lon,marker.lat,state.viewState.lon,state.viewState.lat),canvas=doc.querySelector('#canvas'),move=new w.MouseEvent('pointermove',{clientX:480+218*g[0],clientY:300-218*g[1]});Object.defineProperty(move,'pointerType',{value:'mouse'});canvas.dispatchEvent(move);assert.match(detail.textContent,/珠穆朗玛峰/,'map hover still previews another marker');
 canvas.dispatchEvent(new w.Event('pointerleave'));assert.match(detail.textContent,/天山/,'leaving the map restores the fixed selection');assert.equal(button.getAttribute('aria-pressed'),'true');
});
