/* V2 explicit 2D explanatory diagrams and a WebGL-unavailable fallback.
 * These are labelled teaching projections, never substituted for physical data.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  const A=root.Astro,L=root.Learning;
  function fit(canvas){const r=canvas.getBoundingClientRect(),d=Math.min(root.devicePixelRatio||1,1.5);if(r.width&&r.height){const w=Math.round(r.width*d),h=Math.round(r.height*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}}return {w:canvas.width,h:canvas.height};}
  function txt(x,t,px,py,size=14,color='#bacbd4',align='left'){x.fillStyle=color;x.font=`${size}px "Segoe UI","Microsoft YaHei",sans-serif`;x.textAlign=align;x.fillText(t,px,py);}
  function moonDisc(x,cx,cy,r,fraction,waxing=true){
    // Orthographic disk normals illuminated by a unit directional source.
    const n=Math.max(20,Math.ceil(r*2)),im=x.createImageData(n,n),lz=2*fraction-1,lx=Math.sqrt(Math.max(0,1-lz*lz))*(waxing?1:-1);
    for(let j=0;j<n;j++)for(let i=0;i<n;i++){const nx=(i+.5)/n*2-1,ny=(j+.5)/n*2-1,q=nx*nx+ny*ny;if(q>1)continue;const nz=Math.sqrt(1-q),lit=Math.max(0,nx*lx+nz*lz),v=18+190*lit,k=(j*n+i)*4;im.data[k]=v;im.data[k+1]=v+3;im.data[k+2]=v+8;im.data[k+3]=Math.min(255,(1-q)*n*120);}
    const c=document.createElement('canvas');c.width=c.height=n;c.getContext('2d').putImageData(im,0,0);x.drawImage(c,cx-r,cy-r,2*r,2*r);
  }
  function shadow(canvas,time,observer,height=1,experiment=null,zone=8){
    const {w,h}=fit(canvas),x=canvas.getContext('2d'),p=L.noonPosition(time,observer,zone,experiment),s=L.noonShadow(observer.lat,p.sunDeclination,height);
    x.clearRect(0,0,w,h);const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#122738');g.addColorStop(1,'#0c1724');x.fillStyle=g;x.fillRect(0,0,w,h);
    const base=h*.67,ox=w*.29,meter=Math.min(h*.22,w*.16),stick=Math.min(h*.44,height*meter),scale=stick/height,maxLength=w*.52;
    x.strokeStyle='#304f58';x.lineWidth=1;for(let i=0;i<9;i++){x.beginPath();x.moveTo(0,base+i*h*.038);x.lineTo(w,base+i*h*.038);x.stroke();}
    x.fillStyle='#223c3f';x.fillRect(0,base,w,h-base);
    if(s.visible){const len=Math.min(maxLength,s.length*scale),ratio=len===0?0:Math.min(1,s.length*scale/maxLength);x.save();x.strokeStyle='#06131de8';x.lineCap='round';x.lineWidth=12;x.beginPath();x.moveTo(ox,base+2);x.lineTo(ox+len,base+2);x.stroke();x.restore();
      // Source, rod tip and shadow tip stay collinear. A pedagogical ray must
      // not acquire a bend just because the icon is repositioned to fit the box.
      const extension=Math.max(.08,Math.min(.33,(base-stick-h*.2)/Math.max(stick,1))),sx=ox-len*extension,sy=base-stick*(1+extension);
      x.fillStyle='#ffcc80';x.beginPath();x.arc(sx,sy,16,0,Math.PI*2);x.fill();
      x.setLineDash([4,5]);x.strokeStyle='#e8bb7177';x.lineWidth=2;x.beginPath();x.moveTo(sx,sy);x.lineTo(ox+len,base);x.stroke();x.setLineDash([]);
      txt(x,s.length===0?'影子缩到脚下':(s.length>1000?'影子非常长':s.length.toFixed(2)+' 米'),ox+len/2,base+42,16,'#f1ce96','center');
      if(ratio===1||height*meter>h*.44)txt(x,'图示为适应画面缩放',w/2,base+67,12,'#879fac','center');
    }else txt(x,'正午太阳仍在地平线下，没有日光投影',w/2,h*.3,Math.min(14,w/27),'#f0cb91','center');
    x.strokeStyle='#9ae1cf';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(ox,base);x.lineTo(ox,base-stick);x.stroke();x.lineCap='butt';
    txt(x,height.toFixed(1)+' 米',ox-15,base-stick/2,14,'#99ddcc','right');
    txt(x,'正午太阳高度 '+s.altitude.toFixed(1)+'°',w/2,h*.13,Math.min(19,w/20),'#e3edf0','center');
    txt(x,'纬度 '+observer.lat.toFixed(2)+'° · '+observer.name,w/2,h-57,13,'#a7bec7','center');
    txt(x,'所选日期的正午 · 光线 / 长度示意',w/2,h-30,12,'#95adb9','center');
    return s;
  }
  function phaseGeometry(canvas,p){
    const {w,h}=fit(canvas),x=canvas.getContext('2d');x.clearRect(0,0,w,h);x.fillStyle='#081723';x.fillRect(0,0,w,h);
    const cx=w*.49,cy=h*.53,r=Math.min(w*.29,h*.29),a=(p.phase-180)*A.RAD;
    x.strokeStyle='#2b495a';x.lineWidth=1.5;x.beginPath();x.ellipse(cx,cy,r,r,0,0,2*Math.PI);x.stroke();
    x.strokeStyle='#c6a36355';x.setLineDash([6,9]);for(let i=0;i<4;i++){x.beginPath();x.moveTo(w*.05,h*.27+i*h*.14);x.lineTo(w*.86,h*.27+i*h*.14);x.stroke();}x.setLineDash([]);
    x.fillStyle='#deb477';x.beginPath();x.arc(w*.035,cy,Math.min(25,w*.07),0,Math.PI*2);x.fill();txt(x,'太阳光 →',20,40,13,'#e3c080');
    x.fillStyle='#5892ab';x.beginPath();x.arc(cx,cy,Math.min(21,w*.05),0,Math.PI*2);x.fill();
    const mx=cx+Math.cos(a)*r,my=cy+Math.sin(a)*r;x.strokeStyle='#9fe0cc';x.beginPath();x.moveTo(cx,cy);x.lineTo(mx,my);x.stroke();
    x.fillStyle='#bec6cc';x.beginPath();x.arc(mx,my,13,0,Math.PI*2);x.fill();x.fillStyle='#182633';x.beginPath();x.arc(mx,my,13,-Math.PI/2,Math.PI/2);x.fill();
    txt(x,'地球',cx,cy+40,13,'#c0d7de','center');txt(x,'月球',mx,my-24,13,'#c0d7de','center');
    txt(x,'黄道俯视投影 · 月球轨道倾斜未在此图展开',w/2,h-24,Math.min(12,w/35),'#8eaab8','center');
  }
  class LabScene2D{
    constructor(host){this.host=host;this.isFallback=true;this.mode='earthmoon';this.settings={};this.tracking='moon';this.focus='earth';this.distance=40;this.azimuth=0;this.elevation=.32;this.camera={fov:43,updateProjectionMatrix(){}};this.canvas=document.createElement('canvas');this.canvas.setAttribute('aria-label','WebGL 不可用，当前为二维教学替代画面');host.append(this.canvas);this.renderer={domElement:this.canvas,setPixelRatio(){},capabilities:{}};this.labels={};this.hud=document.createElement('div');this.hud.className='fallback-label';this.hud.textContent='二维兼容模式 · 天文计算仍可使用';host.append(this.hud);this.resizeObserver=new ResizeObserver(()=>this.render());this.resizeObserver.observe(host);}
    update(p,l,o,s){this.state=p;this.local=l;this.observer=o;this.settings=s;}
    render(){if(!this.state)return;if(this.mode!=='ground'){phaseGeometry(this.canvas,this.state);return;}const {w,h}=fit(this.canvas),x=this.canvas.getContext('2d');x.fillStyle='#0b1a2a';x.fillRect(0,0,w,h);const body=this.tracking==='sun'?this.local.sun:this.local.moon,visible=this.tracking==='sun'?this.local.solarVisible:this.local.moonVisible;
      if(visible){if(this.tracking==='moon')moonDisc(x,w/2,h/2,Math.min(w,h)*.22,this.state.fraction,this.state.phase<180);else{const r=Math.min(w,h)*.18;x.fillStyle='#f1cb83';x.beginPath();x.arc(w/2,h/2,r,0,2*Math.PI);x.fill();if(this.local.solarCoverage>0){const ratio=this.local.moonRadius/this.local.sunRadius,sep=this.local.separation/this.local.sunRadius;x.fillStyle='#101c27';x.beginPath();x.arc(w/2+r*sep,h/2,r*ratio,0,Math.PI*2);x.fill();}}}else txt(x,'目标在地平线下',w/2,h/2,20,'#dfc394','center');txt(x,'二维示意；不复现地平旋转与完整食影',w/2,h-38,12,'#9fb8c8','center');}
    resize(){this.render();}reset(){this.azimuth=0;this.elevation=.32;}setMode(m){this.mode=m;}setTracking(t){this.tracking=t;}setFocus(f){this.focus=f;}zoom(f){this.distance=A.clamp(this.distance*f,6,800);}cameraState(){return {azimuth:this.azimuth,elevation:this.elevation,distance:this.distance,fov:this.camera.fov,tracking:this.tracking,focus:this.focus};}restoreCamera(c){if(c){for(const k of ['azimuth','elevation','distance','tracking','focus'])this[k]=c[k];this.camera.fov=c.fov;}}screenshot(){this.render();return this.canvas.toDataURL('image/png');}dispose(){this.resizeObserver.disconnect();this.canvas.remove();this.hud.remove();}
  }
  root.LabDiagrams={fit,shadow,phaseGeometry,moonDisc,txt};root.LabScene2D=LabScene2D;
})(globalThis);
