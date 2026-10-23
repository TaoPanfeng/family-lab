/* Three.js r140 (already bundled in astronomy) is used without a service, token or CDN. */
(function(){'use strict';
const T=window.THREE,C=window.WorldCore;let landTexture;
function make(container,options={}){
 if(!T)return null;let renderer;
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:false});}catch(_){if(options.allowSoftware&&window.LabCanvas3D)renderer=LabCanvas3D();else return null;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));renderer.setClearColor(0x0b1424,1);renderer.domElement.className='three-canvas';renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','三维模型：拖动旋转，滚轮缩放，方向键旋转，加减键缩放');
 const base=container.querySelector('#canvas');if(base)base.style.display='none';container.prepend(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(43,1,.01,2000),target=new T.Vector3(...(options.target||[0,0,0]));
 scene.add(new T.AmbientLight(0xffffff,.75));const light=new T.DirectionalLight(0xffffff,.65);light.position.set(3,5,7);scene.add(light);
 let radius=options.distance||4,yaw=options.yaw===undefined?.6:options.yaw,pitch=options.pitch===undefined?.25:options.pitch,drag=null,disposed=false;
 function render(){if(disposed)return;camera.position.set(target.x+radius*Math.cos(pitch)*Math.sin(yaw),target.y+radius*Math.sin(pitch),target.z+radius*Math.cos(pitch)*Math.cos(yaw));camera.lookAt(target);renderer.render(scene,camera);}
 function resize(){const r=container.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();render();}
 const down=e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);};
 const move=e=>{if(!drag)return;yaw-=(e.clientX-drag[0])*.008;pitch=C.clamp(pitch+(e.clientY-drag[1])*.006,-1.35,1.35);drag=[e.clientX,e.clientY];render();};
 const up=()=>drag=null;const wheel=e=>{e.preventDefault();radius=C.clamp(radius*Math.exp(e.deltaY*.001),options.min||1.7,options.max||30);render();};
 const key=e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')yaw-=.1;if(e.key==='ArrowRight')yaw+=.1;if(e.key==='ArrowUp')pitch=C.clamp(pitch+.08,-1.35,1.35);if(e.key==='ArrowDown')pitch=C.clamp(pitch-.08,-1.35,1.35);if(e.key==='+'||e.key==='=')radius=Math.max(options.min||1.7,radius*.9);if(e.key==='-')radius=Math.min(options.max||30,radius*1.1);render();}};
 const dom=renderer.domElement;dom.style.touchAction='none';dom.addEventListener('pointerdown',down);dom.addEventListener('pointermove',move);dom.addEventListener('pointerup',up);dom.addEventListener('pointercancel',up);dom.addEventListener('wheel',wheel,{passive:false});dom.addEventListener('keydown',key);
 const observer=new ResizeObserver(resize);observer.observe(container);resize();
 return{scene,camera,renderer,mode:renderer.isSoftware?'canvas3d':'webgl',draw:render,
 zoom:factor=>{radius=C.clamp(radius*factor,options.min||1.7,options.max||30);render();},
 target:(point)=>{target.set(...point);render();},
 setView:(r,y,p,point)=>{radius=C.clamp(r,options.min||1.7,options.max||30);yaw=y;pitch=p;if(point)target.set(...point);render();},
 state:()=>({radius,yaw,pitch,target:target.toArray()}),
 reset:()=>{radius=options.distance||4;yaw=options.yaw===undefined?.6:options.yaw;pitch=options.pitch===undefined?.25:options.pitch;target.set(...(options.target||[0,0,0]));render();},distance:r=>{radius=C.clamp(r,options.min||1.7,options.max||30);render();},focus:(lon,lat)=>{yaw=(90+lon)*Math.PI/180;pitch=lat*Math.PI/180;render();},dispose:()=>{disposed=true;observer.disconnect();dom.removeEventListener('pointerdown',down);dom.removeEventListener('pointermove',move);dom.removeEventListener('pointerup',up);dom.removeEventListener('pointercancel',up);dom.removeEventListener('wheel',wheel);dom.removeEventListener('keydown',key);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});renderer.dispose();renderer.forceContextLoss();dom.remove();if(base)base.style.display='block';}};
}
function texture(){if(landTexture)return landTexture;const c=document.createElement('canvas');c.width=2048;c.height=1024;const g=c.getContext('2d');g.fillStyle='#153d5b';g.fillRect(0,0,c.width,c.height);g.fillStyle='#528874';g.strokeStyle='#79a38d';g.lineWidth=.7;
 for(const f of (window.LAND_GEOMETRY||{features:[]}).features){const ps=f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates;for(const rings of ps){g.beginPath();for(const ring of rings){ring.forEach(([lon,lat],i)=>{const p=[(lon+180)/360*c.width,(90-lat)/180*c.height];i?g.lineTo(...p):g.moveTo(...p);});g.closePath();}g.fill('evenodd');g.stroke();}}
 landTexture=new T.CanvasTexture(c);landTexture.anisotropy=2;return landTexture;}
function globe(scene,radius=1){const group=new T.Group(),earth=new T.Mesh(new T.SphereGeometry(radius,64,40),new T.MeshPhongMaterial({map:texture(),shininess:8}));group.add(earth);scene.add(group);return group;}
function line(points,color=0x79dfca){return new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),new T.LineBasicMaterial({color,transparent:true,opacity:.8}));}
function latLine(lat,radius=1.01,color=0x527b91){const pts=[];for(let lon=-180;lon<=180;lon+=3)pts.push(C.geoPoint(lon,lat,radius));return line(pts,color);}
function lonLine(lon,radius=1.01,color=0x527b91){const pts=[];for(let lat=-90;lat<=90;lat+=3)pts.push(C.geoPoint(lon,lat,radius));return line(pts,color);}
function marker(group,lon,lat,color=0xffd18b,radius=1.035){const m=new T.Mesh(new T.SphereGeometry(.009,12,10),new T.MeshBasicMaterial({color}));m.position.set(...C.geoPoint(lon,lat,radius));group.add(m);return m;}
window.Lab3D={make,globe,line,latLine,lonLine,marker};
})();
