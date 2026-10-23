/* Offline geographic projection and interaction. Every marker stays screen-sized.
 * The orthographic view is a mathematically projected globe, not a satellite image.
 */
(function () {
  'use strict';
  const RAD=Math.PI/180, TAU=2*Math.PI;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),wrap=x=>((x+180)%360+360)%360-180;
  function globePoint(lon,lat,centerLon,centerLat){
    const d=wrap(lon-centerLon)*RAD,p=lat*RAD,q=centerLat*RAD;
    return [Math.cos(p)*Math.sin(d), Math.cos(q)*Math.sin(p)-Math.sin(q)*Math.cos(p)*Math.cos(d),Math.sin(q)*Math.sin(p)+Math.cos(q)*Math.cos(p)*Math.cos(d)];
  }
  function create(canvas,redraw,initial={}) {
    const state={projection:'flat',lon:0,lat:10,zoom:1,...initial};let dragging=null,moved=false,hover=null;
    const rect={x:24,y:64,w:912,h:456},center=[480,300],hits=[];
    function point(lon,lat){
      if(state.projection==='globe'){const v=globePoint(lon,lat,state.lon,state.lat),r=218*state.zoom;return [480+r*v[0],300-r*v[1],v[2]>=0];}
      return [480+wrap(lon-state.lon)*912/360*state.zoom,300-(lat-state.lat)*456/180*state.zoom,true];
    }
    function rawFlat(lon,lat){return [480+(lon-state.lon)*912/360*state.zoom,300-(lat-state.lat)*456/180*state.zoom,true];}
    function inside(p){return p[2]!==false&&p[0]>=rect.x&&p[0]<=rect.x+rect.w&&p[1]>=rect.y&&p[1]<=rect.y+rect.h;}
    function text(ctx,label,x,y,color='#d1e1e8',size=16,align='center') {ctx.font=`500 ${size}px system-ui,"Microsoft YaHei"`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='#102334';ctx.strokeText(label,x,y);ctx.fillStyle=color;ctx.fillText(label,x,y);}
    function clip(ctx){ctx.beginPath();if(state.projection==='globe')ctx.arc(480,300,218*state.zoom,0,TAU);else ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();ctx.beginPath();ctx.rect(rect.x,rect.y,rect.w,rect.h);ctx.clip();}
    function densify(ring){const out=[];for(let i=0;i<ring.length-1;i++){const a=ring[i],b=ring[i+1],dl=wrap(b[0]-a[0]),n=Math.max(1,Math.ceil(Math.max(Math.abs(dl),Math.abs(b[1]-a[1]))/3));for(let j=0;j<n;j++)out.push([a[0]+dl*j/n,a[1]+(b[1]-a[1])*j/n]);}out.push(ring.at(-1));return out;}
    function polygon(ctx,ring){
      if(state.projection==='flat'){
        let previous=state.lon+wrap(ring[0][0]-state.lon),coords=[[previous,ring[0][1]]];
        for(let i=1;i<ring.length;i++){previous+=wrap(ring[i][0]-previous);coords.push([previous,ring[i][1]]);}
        for(const offset of [-360,0,360]){const ps=coords.map(([x,y])=>rawFlat(x+offset,y));ctx.moveTo(ps[0][0],ps[0][1]);for(const p of ps.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();}return;
      }
      const vs=densify(ring).map(p=>globePoint(...p,state.lon,state.lat)),front=[];
      for(let i=0;i<vs.length;i++){
        const a=vs[i],b=vs[(i+1)%vs.length];if(a[2]>=0)front.push(a);
        if((a[2]>=0)!==(b[2]>=0)){const f=a[2]/(a[2]-b[2]),x=a[0]+f*(b[0]-a[0]),y=a[1]+f*(b[1]-a[1]),norm=Math.hypot(x,y)||1;front.push([x/norm,y/norm,0]);}
      }
      if(front.length<3)return;const r=218*state.zoom;
      ctx.moveTo(480+r*front[0][0],300-r*front[0][1]);for(const p of front.slice(1))ctx.lineTo(480+r*p[0],300-r*p[1]);ctx.closePath();
    }
    function path(ctx,points,color,width=2,dash=[]){
      ctx.save();clip(ctx);ctx.beginPath();let prev=null;
      for(const [lon,lat] of points){const p=point(lon,lat);if(!p[2]||prev&&Math.abs(p[0]-prev[0])>Math.max(150,400*state.zoom)){prev=null;if(!p[2])continue;}if(prev)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);prev=p;}
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.restore();
    }
    function parallel(ctx,lat,color='#ffdb8a',width=2){path(ctx,Array.from({length:361},(_,i)=>[-180+i,lat]),color,width);const p=point(state.lon,lat);if(inside(p))text(ctx,`${lat===0?'赤道 ':''}${Math.abs(lat)}°${lat<0?'S':'N'}`,p[0]+10,p[1]-13,color,16,'left');}
    function meridian(ctx,lon,color='#ffdb8a'){path(ctx,Array.from({length:181},(_,i)=>[lon,-90+i]),color,2);}
    function base(ctx,options={}){
      hits.length=0;ctx.clearRect(0,0,960,600);ctx.fillStyle='#0b1525';ctx.fillRect(0,0,960,600);
      ctx.save();clip(ctx);const gradient=ctx.createLinearGradient(0,64,0,520);gradient.addColorStop(0,'#16394f');gradient.addColorStop(1,'#0e263b');ctx.fillStyle=gradient;ctx.fillRect(0,0,960,600);
      const colors=['#375950','#3c5d52','#3a605b','#34554f','#3d6257','#355c58'];
      for(const [i,country]of (window.GeoCountries||[]).entries()){
        const polygons=country.geometry.type==='Polygon'?[country.geometry.coordinates]:country.geometry.coordinates;
        ctx.beginPath();for(const rings of polygons)for(const ring of rings)polygon(ctx,ring);
        ctx.fillStyle=country.id===options.country?'#61715a':colors[i%colors.length];ctx.fill('evenodd');
        if(options.borders){ctx.strokeStyle=country.id===options.country?'#ffda8d':'#91b4a990';ctx.lineWidth=country.id===options.country?2:0.9;ctx.stroke();}
      }
      ctx.restore();
      if(options.grid){for(let lon=-180;lon<180;lon+=15)path(ctx,Array.from({length:91},(_,i)=>[lon,-90+i*2]),'#83a1ad30',1);for(let lat=-75;lat<90;lat+=15)path(ctx,Array.from({length:181},(_,i)=>[-180+i*2,lat]),lat===0?'#ddc48580':'#83a1ad30',1);}
      const occupied=[];function label(label,lon,lat,color,size){const p=point(lon,lat);if(!inside(p))return;const w=label.length*size*.9,r=[p[0]-w/2,p[1]-size/2,p[0]+w/2,p[1]+size/2];if(occupied.some(a=>a[0]<r[2]&&a[2]>r[0]&&a[1]<r[3]&&a[3]>r[1]))return;occupied.push(r);text(ctx,label,p[0],p[1],color,size);}
      if(options.oceans)for(const [name,lon,lat]of [['太平洋',-142,-8],['太平洋',165,5],['大西洋',-32,6],['印度洋',76,-27],['北冰洋',-15,78],['南大洋',20,-59]])label(name,lon,lat,'#b6dce9',19);
      let labelCount=0;if(options.names)for(const country of [...(window.GeoCountries||[])].sort((a,b)=>(b.id===options.country?1e8:b.area)-(a.id===options.country?1e8:a.area))){const selected=country.id===options.country;if(!inside(point(...country.center)))continue;if(labelCount++>Math.min(36,15+state.zoom*4)&&!selected)continue;label(country.name,...country.center,selected?'#ffe0a0':'#dce8dc',selected?18:14);}
      ctx.strokeStyle='#47687b';ctx.lineWidth=1;ctx.strokeRect(rect.x,rect.y,rect.w,rect.h);
      text(ctx,state.projection==='globe'?'正射投影球体 · 拖动旋转':'等经纬地图 · 拖动平移',28,32,'#9fbac8',16,'left');text(ctx,'N ↑',915,32,'#91dfce',18);
      text(ctx,`${state.zoom.toFixed(1)}×　中心 ${state.lon.toFixed(1)}° / ${state.lat.toFixed(1)}°`,28,550,'#9fbac8',14,'left');
      text(ctx,'Natural Earth 简化边界 · 非实时或权威边界图',28,578,'#91a4b6',14,'left');
    }
    function marker(ctx,lon,lat,options={}){
      const p=point(lon,lat);if(!inside(p))return null;const r=options.radius||4;
      ctx.save();ctx.strokeStyle=options.color||'#ffda8f';ctx.fillStyle='#132737';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p[0],p[1],r,0,TAU);ctx.fill();ctx.stroke();
      if(options.cross){ctx.beginPath();ctx.moveTo(p[0]-11,p[1]);ctx.lineTo(p[0]-5,p[1]);ctx.moveTo(p[0]+5,p[1]);ctx.lineTo(p[0]+11,p[1]);ctx.moveTo(p[0],p[1]-11);ctx.lineTo(p[0],p[1]-5);ctx.moveTo(p[0],p[1]+5);ctx.lineTo(p[0],p[1]+11);ctx.stroke();}
      if(options.label)text(ctx,options.label,p[0]+(options.dx||8),p[1]+(options.dy||-13),options.color||'#e8eadb',options.font||14,options.align||'left');ctx.restore();
      if(options.record)hits.push({p,record:options.record});return p;
    }
    const eventPoint=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*960/r.width,(e.clientY-r.top)*600/r.height];};
    const onDown=e=>{dragging=[e.clientX,e.clientY];moved=false;canvas.setPointerCapture(e.pointerId);};
    const onMove=e=>{
      if(dragging){const dx=e.clientX-dragging[0],dy=e.clientY-dragging[1];if(Math.abs(dx)+Math.abs(dy)>1)moved=true;state.lon=wrap(state.lon-dx*.35/state.zoom);state.lat=clamp(state.lat+dy*.3/state.zoom,-85,85);dragging=[e.clientX,e.clientY];redraw();return;}
      const p=eventPoint(e),hit=hits.filter(h=>Math.hypot(h.p[0]-p[0],h.p[1]-p[1])<15).sort((a,b)=>Math.hypot(a.p[0]-p[0],a.p[1]-p[1])-Math.hypot(b.p[0]-p[0],b.p[1]-p[1]))[0];
      if(hover?.id!==hit?.record.id){hover=hit?.record||null;api.onHover?.(hover);redraw();}canvas.style.cursor=hit?'pointer':'grab';
    };
    const onUp=e=>{dragging=null;if(!moved){const p=eventPoint(e),h=hits.find(h=>Math.hypot(h.p[0]-p[0],h.p[1]-p[1])<15);if(h)api.onSelect?.(h.record);}};
    const wheel=e=>{e.preventDefault();state.zoom=clamp(state.zoom*Math.exp(-e.deltaY*.001),.65,12);redraw();};
    const keys=e=>{if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','+','-','='].includes(e.key))return;e.preventDefault();if(e.key.startsWith('Arrow')){state.lon=wrap(state.lon+(e.key==='ArrowLeft'?-6:e.key==='ArrowRight'?6:0)/state.zoom);state.lat=clamp(state.lat+(e.key==='ArrowUp'?6:e.key==='ArrowDown'?-6:0)/state.zoom,-85,85);}else state.zoom=clamp(state.zoom*(e.key==='-'?.85:1.18),.65,12);redraw();};
    canvas.tabIndex=0;canvas.style.touchAction='none';canvas.setAttribute('aria-label','可拖动地图：方向键平移或旋转，加减键缩放');
    canvas.addEventListener('pointerdown',onDown);canvas.addEventListener('pointermove',onMove);canvas.addEventListener('pointerup',onUp);canvas.addEventListener('pointercancel',onUp);canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('keydown',keys);
    const api={state,point,inside,base,path,parallel,meridian,marker,text,hover:()=>hover,
      zoom:factor=>{state.zoom=clamp(state.zoom/factor,.65,12);redraw();},
      focus:(lon,lat,zoom)=>{state.lon=lon;state.lat=lat;if(zoom)state.zoom=zoom;},
      dispose:()=>{canvas.removeEventListener('pointerdown',onDown);canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerup',onUp);canvas.removeEventListener('pointercancel',onUp);canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('keydown',keys);}};return api;
  }
  const exported={create,globePoint,wrap};if(typeof window!=='undefined')window.LabMap=exported;if(typeof module!=='undefined')module.exports=exported;
})();
