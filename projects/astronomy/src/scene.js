/* WebGL presentation. Actual positions/shadows come from Astro; decorative
 * sizes never feed back into event searches. THREE r140 is vendored offline.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  const T=root.THREE,A=root.Astro;
  const V=a=>new T.Vector3(...a);
  const vertex=`varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
    void main(){vUv=uv;vN=normalize(mat3(modelMatrix)*normal);
    vec4 w=modelMatrix*vec4(position,1.0);vWorld=w.xyz;
    gl_Position=projectionMatrix*viewMatrix*w;}`;
  const overlapGLSL=`
    float area(float r,float q,float d){
      if(d>=r+q)return 0.0;
      if(d<=abs(r-q))return min(1.0,q*q/(r*r));
      float a=acos(clamp((d*d+r*r-q*q)/(2.0*d*r),-1.0,1.0));
      float b=acos(clamp((d*d+q*q-r*r)/(2.0*d*q),-1.0,1.0));
      float c=0.5*sqrt(max(0.0,(-d+r+q)*(d+r-q)*(d-r+q)*(d+r+q)));
      return clamp((r*r*a+q*q*b-c)/(3.141592654*r*r),0.0,1.0);
    }
    float obscuration(vec3 s,vec3 o,float radius){
      float ds=length(s),doo=length(o);
      if(doo>=ds || doo<radius)return 0.0;
      vec3 sn=s/ds,on=o/doo;
      float d=atan(length(cross(sn,on)),dot(sn,on));
      return area(asin(695700.0/ds),asin(radius/doo),d);
    }`;
  const surfaceFragment=`precision highp float;
    uniform sampler2D uMap;
    uniform vec3 uSun,uMoon,uOrigin;
    uniform float uRadius,uShadow,uMoonBody,uAmbient;
    varying vec2 vUv; varying vec3 vN; varying vec3 vWorld;
    ${overlapGLSL}
    void main(){
      vec3 n=normalize(vN),light=normalize(uSun-uOrigin);
      vec3 albedo=texture2D(uMap,vUv).rgb;
      albedo=pow(albedo,vec3(2.2));
      float diffuse=max(0.0,dot(n,light));
      vec3 physicalPoint=uOrigin+n*uRadius;
      vec3 occultor=mix(uMoon-physicalPoint,-physicalPoint,uMoonBody);
      float blocked=uShadow*obscuration(uSun-physicalPoint,occultor,mix(1737.4,6505.7,uMoonBody));
      vec3 col=albedo*(uAmbient+diffuse*1.65)*(1.0-blocked*0.975);
      if(uMoonBody>0.5)col=mix(col,albedo*vec3(0.24,0.035,0.012),blocked*0.93);
      else {
        float ocean=step(albedo.r*1.5,albedo.b);
        vec3 viewDir=normalize(cameraPosition-vWorld);
        float spec=pow(max(0.0,dot(reflect(-light,n),viewDir)),40.0);
        col+=vec3(0.13,0.22,0.27)*spec*ocean*(1.0-blocked);
      }
      gl_FragColor=vec4(col,1.0);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`;
  function line(points,color,opacity=.5,dashed=false) {
    const g=new T.BufferGeometry().setFromPoints(points);
    const m=dashed?new T.LineDashedMaterial({color,transparent:true,opacity,dashSize:.5,gapSize:.35}):new T.LineBasicMaterial({color,transparent:true,opacity});
    const l=new T.Line(g,m);if(dashed)l.computeLineDistances();return l;
  }
  function circle(radius,segments=180) {return Array.from({length:segments+1},(_,i)=>new T.Vector3(Math.cos(i/segments*Math.PI*2)*radius,0,Math.sin(i/segments*Math.PI*2)*radius));}
  function glowTexture() {
    const c=document.createElement('canvas');c.width=c.height=128;
    const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,'rgba(255,208,121,0.7)');g.addColorStop(.25,'rgba(255,164,64,0.27)');g.addColorStop(.55,'rgba(255,116,36,0.06)');g.addColorStop(1,'rgba(255,100,20,0)');
    x.fillStyle=g;x.fillRect(0,0,128,128);return new T.CanvasTexture(c);
  }
  function coronaTexture() {
    const c=document.createElement('canvas');c.width=c.height=512;
    const x=c.getContext('2d'),im=x.createImageData(512,512);
    for(let y=0;y<512;y++)for(let xx=0;xx<512;xx++){
      const dx=(xx-255.5)/256,dy=(y-255.5)/256,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx),i=(y*512+xx)*4;
      const rays=.67+.2*Math.cos(2*a+.4)+.07*Math.sin(7*a)+.06*Math.sin(17*a+1.4);
      const z=Math.max(0,r-.248),edge=Math.min(1,Math.max(0,(r-.225)/.025));
      const v=(.65*Math.exp(-z*23)+.22*Math.exp(-z/(.12*rays))+.12*Math.exp(-z/(.23*rays)))*edge*Math.max(0,1-r*r);
      im.data[i]=218;im.data[i+1]=231;im.data[i+2]=244;im.data[i+3]=Math.min(255,v*255);
    }
    x.putImageData(im,0,0);return new T.CanvasTexture(c);
  }
  class LabScene {
    constructor(host,{onReady,onError}={}) {
      this.host=host;this.mode='earthmoon';this.settings={};this.state=null;this.local=null;this.observer=null;
      this.azimuth=.65;this.elevation=.36;this.distance=40;this.focus='earth';this.tracking='sun';this.cameraManual=false;
      this.target=new T.Vector3();this.lastOrbitKey='';this.disposed=false;
      try {this.renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}
      catch(error){onError?.(error);throw error;}
      this.renderer.setPixelRatio(Math.min(root.devicePixelRatio||1,1.5));
      this.renderer.outputEncoding=T.sRGBEncoding;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.1;
      this.renderer.setClearColor(0x060e18,0);this.renderer.domElement.setAttribute('aria-label','可拖动旋转的三维日地月场景');
      host.appendChild(this.renderer.domElement);
      this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(43,1,.03,4000);
      this.camera.position.set(0,15,35);
      this.space=new T.Group();this.scene.add(this.space);
      this.sky=new T.Group();this.scene.add(this.sky);this.sky.visible=false;
      this.sphere=new T.SphereGeometry(1,96,64);
      this.earthTexture=new T.TextureLoader().load(root.ASSETS.earth,()=>{onReady?.();root.LabV2?.markDirty();});
      this.moonTexture=new T.TextureLoader().load(root.ASSETS.moon,()=>{onReady?.();root.LabV2?.markDirty();});
      this.earthTexture.anisotropy=this.moonTexture.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());
      const makeMaterial=(texture,isMoon)=>new T.ShaderMaterial({vertexShader:vertex,fragmentShader:surfaceFragment,uniforms:{
        uMap:{value:texture},uSun:{value:new T.Vector3(1e8,0,0)},uMoon:{value:new T.Vector3(3.8e5,0,0)},uOrigin:{value:new T.Vector3()},
        uRadius:{value:isMoon?A.RM:A.RE},uShadow:{value:1},uMoonBody:{value:isMoon?1:0},uAmbient:{value:.11}}});
      this.earthMaterial=makeMaterial(this.earthTexture,false);this.moonMaterial=makeMaterial(this.moonTexture,true);
      this.earth=new T.Mesh(this.sphere,this.earthMaterial);this.moon=new T.Mesh(this.sphere,this.moonMaterial);
      this.space.add(this.earth,this.moon);
      this.sunMaterial=new T.ShaderMaterial({vertexShader:vertex,uniforms:{uTime:{value:0}},fragmentShader:`
        precision highp float;uniform float uTime;varying vec2 vUv;varying vec3 vN;varying vec3 vWorld;
        float noise(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
        void main(){vec3 view=normalize(cameraPosition-vWorld);float center=max(dot(normalize(vN),view),0.0);
        float g=noise(floor(vN*150.0+uTime*.001));
        vec3 col=mix(vec3(1.5,.35,.03),vec3(2.1,1.25,.34),pow(center,.3))*(.93+.13*g);
        gl_FragColor=vec4(col,1.0);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
        }`});
      this.sun=new T.Mesh(this.sphere,this.sunMaterial);this.space.add(this.sun);
      this.sunGlow=new T.Sprite(new T.SpriteMaterial({map:glowTexture(),transparent:true,blending:T.AdditiveBlending,depthWrite:false}));
      this.space.add(this.sunGlow);
      this.atmosphere=new T.Mesh(this.sphere,new T.ShaderMaterial({vertexShader:vertex,side:T.BackSide,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        uniforms:{uLight:{value:new T.Vector3(1,0,0)}},fragmentShader:`precision highp float;varying vec3 vN;varying vec3 vWorld;uniform vec3 uLight;
          void main(){vec3 n=normalize(vN);vec3 v=normalize(cameraPosition-vWorld);float rim=pow(1.0-abs(dot(n,v)),3.0);
          float light=.3+.7*max(dot(n,uLight),0.0);gl_FragColor=vec4(.16,.52,1.0,rim*.62*light);}`}));
      this.space.add(this.atmosphere);
      this.orbits=new T.Group();this.space.add(this.orbits);
      this.moonOrbit=line(circle(12),0x739fae,.4);this.earthOrbit=line(circle(36),0x52687e,.42);
      this.orbits.add(this.earthOrbit,this.moonOrbit);
      this.eclipticRing=line(circle(15),0x60788e,.16);this.space.add(this.eclipticRing);
      this.axis=line([new T.Vector3(0,-5,0),new T.Vector3(0,5,0)],0xf6cd83,.9,true);this.space.add(this.axis);
      this.lightRay=line([new T.Vector3(),new T.Vector3(1,0,0)],0xeeb966,.42,true);this.space.add(this.lightRay);
      this.observerDot=new T.Mesh(new T.SphereGeometry(.055,12,12),new T.MeshBasicMaterial({color:0x73f3d2}));this.space.add(this.observerDot);
      this.shadowDot=new T.Mesh(new T.RingGeometry(.085,.12,36),new T.MeshBasicMaterial({color:0xffe5a6,side:T.DoubleSide,transparent:true,opacity:.9,depthTest:true}));this.space.add(this.shadowDot);
      this.cone=new T.Mesh(new T.CylinderGeometry(.04,3,24,64,1,true),new T.MeshBasicMaterial({color:0x7a8ba2,transparent:true,opacity:.085,side:T.DoubleSide,depthWrite:false}));this.space.add(this.cone);
      let seed=8192;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
      const stars=[];for(let i=0;i<1600;i++){const z=rnd()*2-1,a=rnd()*Math.PI*2,r=Math.sqrt(1-z*z);stars.push(r*Math.cos(a)*700,z*700,r*Math.sin(a)*700);}
      const sg=new T.BufferGeometry();sg.setAttribute('position',new T.Float32BufferAttribute(stars,3));
      this.stars=new T.Points(sg,new T.PointsMaterial({color:0xc6d8e8,size:.7,sizeAttenuation:false,transparent:true,opacity:.6,depthWrite:false}));this.scene.add(this.stars);
      // Ground view preserves apparent angular sizes, including topocentric parallax.
      this.skySun=new T.Mesh(this.sphere,new T.MeshBasicMaterial({color:0xffe9ad}));
      this.skyMoonMaterial=makeMaterial(this.moonTexture,true);this.skyMoon=new T.Mesh(this.sphere,this.skyMoonMaterial);
      this.sky.add(this.skySun,this.skyMoon);
      this.corona=new T.Sprite(new T.SpriteMaterial({map:coronaTexture(),transparent:true,depthWrite:false,depthTest:true}));
      this.sky.add(this.corona);this.corona.visible=false;
      this.skyMoonMaterial.uniforms.uAmbient.value=.002;
      this.ground=new T.Mesh(new T.CircleGeometry(400,96),new T.MeshBasicMaterial({color:0x0d181f,side:T.DoubleSide}));
      this.ground.rotation.x=-Math.PI/2;this.ground.position.y=-.01;this.sky.add(this.ground);
      this.horizonRing=line(circle(110),0x659894,.48);this.sky.add(this.horizonRing);
      this.labels={};for(const [key,text] of [['sun','太阳'],['earth','地球'],['moon','月球'],['shadow','月影中心 · 标记放大']]){
        const el=document.createElement('div');el.className=`body-label label-${key}`;el.textContent=text;host.appendChild(el);this.labels[key]=el;
      }
      this.hud=document.createElement('div');this.hud.className='ground-hud';host.appendChild(this.hud);
      this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);
      this.bindPointer();this.resize();
      this.contextLost=e=>{e.preventDefault();onError?.(new Error('显卡上下文暂时丢失，请关闭其他高负载页面后刷新。'));};
      this.renderer.domElement.addEventListener('webglcontextlost',this.contextLost);
    }
    bindPointer(){
      const canvas=this.renderer.domElement;canvas.style.touchAction='none';this.pointers=new Map();this.lastPinch=0;
      canvas.addEventListener('touchmove',e=>{if(this.pointers.size&&e.cancelable)e.preventDefault();},{passive:false});
      this.pointerDown=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;canvas.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.pointers.size===2){const [a,b]=[...this.pointers.values()];this.lastPinch=Math.hypot(a.x-b.x,a.y-b.y);}};
      this.pointerMove=e=>{
        const old=this.pointers.get(e.pointerId);if(!old)return;
        const dx=e.clientX-old.x,dy=e.clientY-old.y;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(this.pointers.size===2){const [a,b]=[...this.pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(this.lastPinch>2&&d>2)this.zoom(this.lastPinch/d);this.lastPinch=d;}
        else if(this.pointers.size===1){this.azimuth-=dx*.006;this.elevation=A.clamp(this.elevation+dy*.006,-1.47,1.47);this.cameraManual=true;}
      };
      this.pointerUp=e=>{this.pointers.delete(e.pointerId);this.lastPinch=0;};
      this.wheel=e=>{e.preventDefault();this.zoom(Math.exp(e.deltaY*.001));};
      canvas.addEventListener('pointerdown',this.pointerDown);canvas.addEventListener('pointermove',this.pointerMove);
      canvas.addEventListener('pointerup',this.pointerUp);canvas.addEventListener('pointercancel',this.pointerUp);canvas.addEventListener('lostpointercapture',this.pointerUp);
      canvas.addEventListener('wheel',this.wheel,{passive:false});canvas.addEventListener('contextmenu',e=>e.preventDefault());
      canvas.addEventListener('dblclick',e=>{if(this.mode==='ground'||!this.state)return;
        const b=canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2),this.camera);
        const hits=ray.intersectObjects([this.earth,this.moon]);if(hits.length){this.setFocus(hits[0].object===this.moon?'moon':'earth');this.update(this.state,this.local,this.observer,this.settings);}});
    }
    resize(){const {width,height}=this.host.getBoundingClientRect();if(!width||!height)return;this.width=width;this.height=height;
      this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();root.LabV2?.markDirty();}
    zoom(factor){if(this.mode==='ground'){this.camera.fov=A.clamp(this.camera.fov*factor,.7,100);this.camera.updateProjectionMatrix();}
      else this.distance=A.clamp(this.distance*factor,6,this.settings.realScale?800:180);}
    reset(kind='default'){
      this.cameraManual=false;this.focus='earth';this.elevation=kind==='top'?1.46:.32;
      if(this.mode==='ground'){this.camera.fov=this.tracking==='horizon'?78:1.8;this.camera.updateProjectionMatrix();return;}
      this.camera.fov=43;this.camera.updateProjectionMatrix();
      this.distance=this.mode==='overview'?100:this.settings.realScale?460:40;
      if(this.state){const m=A.toWorld(this.state.moon,this.state.eps);this.azimuth=Math.atan2(-m[2],m[0])-.12;}
      if(this.mode==='overview')this.azimuth=.8;
    }
    setMode(mode){if(this.mode!==mode){this.mode=mode;this.space.visible=mode!=='ground';this.sky.visible=mode==='ground';this.lastOrbitKey='';this.reset();}}
    setTracking(target){this.tracking=target;this.cameraManual=false;this.reset();}
    setFocus(target){this.focus=target;this.cameraManual=false;if(target==='moon')this.distance=10;else this.reset();}
    updateOrbits(s){
      const key=[this.mode,Math.floor(s.time/(A.DAY*2)),this.settings.realScale,this.settings.scale,s.experiment,s.experiment?s.eps:'real',this.settings.inclination].join(':');
      if(key===this.lastOrbitKey)return;this.lastOrbitKey=key;
      const moonPoints=[],earthPoints=[];
      for(let i=0;i<=100;i++){
        const t=A.clamp(s.time+(i/100-.5)*29*A.DAY,A.MIN,A.MAX),p=A.position(t,this.settings.experiment);
        const w=A.toWorld(p.moon,p.eps);const dist=this.settings.realScale?A.len(w)/A.RE*3:A.len(w)/384400*(this.mode==='overview'?6:12);
        moonPoints.push(V(A.mul(A.unit(w),dist)));
      }
      for(let i=0;i<=180;i++){
        const t=A.clamp(s.time+(i/180-.5)*365.2422*A.DAY,A.MIN,A.MAX),p=A.position(t);
        earthPoints.push(V(A.mul(A.toWorld(p.sun,p.eps),-36/A.AU)));
      }
      this.moonOrbit.geometry.dispose();this.moonOrbit.geometry=new T.BufferGeometry().setFromPoints(moonPoints);
      this.earthOrbit.geometry.dispose();this.earthOrbit.geometry=new T.BufferGeometry().setFromPoints(earthPoints);
    }
    update(state,local,observer,settings){
      this.state=state;this.local=local;this.observer=observer;this.settings=settings;
      this.stars.visible=settings.stars && this.mode!=='ground';
      if(this.mode==='ground'){this.updateGround(state,local,observer);return;}
      this.renderer.setClearColor(0x060e18,0);this.hud.hidden=true;
      const sunW=V(A.toWorld(state.sun,state.eps)),moonW=V(A.toWorld(state.moon,state.eps));
      let earthRadius=(this.mode==='overview'?2.1:3)*(settings.realScale?1:settings.scale),moonRadius=earthRadius*(settings.realScale?A.RM/A.RE:.29);
      const moonDistance=settings.realScale?state.moonDistance/A.RE*3:state.moonDistance/384400*(this.mode==='overview'?6:12);
      if(this.mode==='overview'){
        this.sun.position.set(0,0,0);this.earth.position.copy(sunW).multiplyScalar(-36/A.AU);this.sun.scale.setScalar(5.4);
        this.target.copy(this.earth.position).multiplyScalar(.1);
      }else{
        this.earth.position.set(0,0,0);this.sun.position.copy(sunW).normalize().multiplyScalar(settings.realScale?420:29);this.sun.scale.setScalar(settings.realScale?7:4.2);
        this.target.copy(moonW).normalize().multiplyScalar(settings.realScale?20:1.2);
      }
      this.moon.position.copy(moonW).normalize().multiplyScalar(moonDistance).add(this.earth.position);
      this.earth.scale.setScalar(earthRadius);this.moon.scale.setScalar(moonRadius);
      this.earth.quaternion.setFromAxisAngle(new T.Vector3(1,0,0),-state.eps*A.RAD).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),state.gast*A.RAD));
      this.moon.up.set(0,Math.cos(state.eps*A.RAD),-Math.sin(state.eps*A.RAD));this.moon.lookAt(this.earth.position);
      for(const material of [this.earthMaterial,this.moonMaterial]){
        material.uniforms.uSun.value.copy(sunW);material.uniforms.uMoon.value.copy(moonW);material.uniforms.uShadow.value=settings.shadows?1:0;
      }
      this.moonMaterial.uniforms.uOrigin.value.copy(moonW);
      this.atmosphere.position.copy(this.earth.position);this.atmosphere.scale.setScalar(earthRadius*1.04);
      this.atmosphere.material.uniforms.uLight.value.copy(sunW).normalize();
      this.sunGlow.position.copy(this.sun.position);this.sunGlow.scale.setScalar(this.sun.scale.x*5.5);
      this.sunMaterial.uniforms.uTime.value=state.time/A.DAY;
      this.updateOrbits(state);this.orbits.visible=settings.orbits;this.earthOrbit.visible=this.mode==='overview';
      this.moonOrbit.position.copy(this.earth.position);this.eclipticRing.position.copy(this.earth.position);this.eclipticRing.visible=settings.orbits&&this.mode==='earthmoon'&&!settings.realScale;
      const axis=new T.Vector3(0,Math.cos(state.eps*A.RAD),-Math.sin(state.eps*A.RAD)).multiplyScalar(earthRadius*1.65);
      this.axis.geometry.setFromPoints([this.earth.position.clone().sub(axis),this.earth.position.clone().add(axis)]);this.axis.computeLineDistances();this.axis.visible=settings.axis;
      this.lightRay.geometry.setFromPoints([this.sun.position.clone(),this.earth.position.clone()]);this.lightRay.computeLineDistances();this.lightRay.visible=settings.axis;
      const surface=V(A.toWorld(A.observerVector(state.gast,observer),state.eps)).normalize();
      this.observerDot.position.copy(surface).multiplyScalar(earthRadius*1.013).add(this.earth.position);this.observerDot.scale.setScalar(earthRadius/3);this.observerDot.visible=settings.labels;
      const global=A.globalSolar(state);this.shadowDot.visible=settings.shadows && !!global.point;
      if(global.point){const n=V(A.toWorld(global.point,state.eps)).normalize();this.shadowDot.position.copy(n).multiplyScalar(earthRadius*1.016).add(this.earth.position);
        this.shadowDot.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),n);this.shadowDot.scale.setScalar(earthRadius/3);}
      this.cone.visible=settings.cones&&!settings.realScale;
      if(this.cone.visible){const d=sunW.clone().normalize().negate();this.cone.scale.set(earthRadius/3,1,earthRadius/3);
        this.cone.position.copy(this.earth.position).add(d.clone().multiplyScalar(12));this.cone.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d);}
      if(this.focus==='moon')this.target.copy(this.moon.position);
    }
    updateGround(s,l,observer){
      const alt=l.sun.alt,brightness=A.clamp((alt+10)/35,0,1),occ=l.solarVisible?l.solarCoverage:0;
      const color=new T.Color().setRGB(.016+brightness*.075,.033+brightness*.19,.055+brightness*.28).multiplyScalar(1-occ*.82);
      this.renderer.setClearColor(color,1);this.hud.hidden=false;
      const sv=V(A.unit(l.sun.vector)).multiplyScalar(110),mv=V(A.unit(l.moon.vector)).multiplyScalar(100);
      this.skySun.position.copy(sv);this.skySun.scale.setScalar(Math.tan(l.sunRadius)*110);
      this.corona.position.copy(sv).multiplyScalar(1.004);this.corona.scale.setScalar(this.skySun.scale.x*8);
      this.corona.visible=l.solarType==='日全食' && l.solarVisible;
      this.skyMoon.position.copy(mv);this.skyMoon.scale.setScalar(Math.tan(l.moonRadius)*100);this.skyMoon.lookAt(new T.Vector3());
      const u=this.skyMoonMaterial.uniforms;
      u.uSun.value.copy(V(A.horizontalVector(s.sun,s.gast,observer)));u.uMoon.value.copy(V(A.horizontalVector(s.moon,s.gast,observer)));
      u.uOrigin.value.copy(u.uMoon.value);u.uShadow.value=this.settings.shadows?1:0;
      this.camera.position.set(0,0,0);this.camera.up.set(0,1,0);
      if(!this.cameraManual){
        const target=this.tracking==='moon'?l.moon:l.sun;
        this.azimuth=(180-target.az)*A.RAD;this.elevation=this.tracking==='horizon'?.10:target.alt*A.RAD;
      }
      this.camera.lookAt(Math.sin(this.azimuth)*Math.cos(this.elevation),Math.sin(this.elevation),Math.cos(this.azimuth)*Math.cos(this.elevation));
      const body=this.tracking==='moon'?'月亮':'太阳',item=this.tracking==='moon'?l.moon:l.sun;
      const visible=this.tracking==='moon'?l.moonVisible:l.solarVisible;
      this.hud.innerHTML=`<span>${this.tracking==='horizon'?'地平线全景':`追踪${body} · 视角 ${this.camera.fov.toFixed(1)}°`}</span><b>${visible?'地平线上方':'目标在地平线下'}</b><small>高度 ${item.alt.toFixed(2)}° · 方位 ${item.az.toFixed(1)}°<br>日月角大小保持真实；大气 / 日冕 / 地景为示意</small>`;
    }
    render(){
      if(this.disposed||!this.state)return;
      if(this.mode!=='ground'){
        const c=Math.cos(this.elevation),d=this.distance;
        this.camera.position.copy(this.target).add(new T.Vector3(Math.sin(this.azimuth)*c*d,Math.sin(this.elevation)*d,Math.cos(this.azimuth)*c*d));
        this.camera.up.set(0,1,0);this.camera.lookAt(this.target);
      }
      if(this.mode==='ground') {
        // Pointer movement must work while paused as well as while time is running.
        if(!this.cameraManual){const item=this.tracking==='moon'?this.local.moon:this.local.sun;
          this.azimuth=(180-item.az)*A.RAD;this.elevation=this.tracking==='horizon'?.10:item.alt*A.RAD;}
        this.camera.lookAt(Math.sin(this.azimuth)*Math.cos(this.elevation),Math.sin(this.elevation),Math.cos(this.azimuth)*Math.cos(this.elevation));
        const span=this.hud.querySelector('span');if(span){const text=this.tracking==='horizon'?'地平线全景':`${this.cameraManual?'自由观察':'追踪'+(this.tracking==='moon'?'月亮':'太阳')} · 视角 ${this.camera.fov.toFixed(1)}°`;if(span.textContent!==text)span.textContent=text;}
      }
      this.renderer.render(this.scene,this.camera);this.updateLabels();
    }
    updateLabels(){
      const place=(name,obj,offset)=>{
        const el=this.labels[name];const pos=obj.position.clone().add(new T.Vector3(0,offset,0));pos.project(this.camera);
        const front=pos.z>-1&&pos.z<1&&Math.abs(pos.x)<1.2&&Math.abs(pos.y)<1.15;
        el.hidden=!this.settings.labels||!front||(name==='shadow'&&!this.shadowDot.visible);
        if(!el.hidden){el.style.left=`${(pos.x+1)*.5*this.width}px`;el.style.top=`${(-pos.y+1)*.5*this.height}px`;}
      };
      if(this.mode==='ground'){
        Object.values(this.labels).forEach(x=>x.hidden=true);return;
      }
      place('earth',this.earth,this.earth.scale.x+1);place('moon',this.moon,this.moon.scale.x+.65);place('sun',this.sun,this.sun.scale.x+1);place('shadow',this.shadowDot,.4);
      // Avoid two labels being printed over one another in the system overview.
      if(!this.labels.earth.hidden&&!this.labels.moon.hidden){const a=this.labels.earth.getBoundingClientRect(),b=this.labels.moon.getBoundingClientRect();
        if(a.left<b.right+4&&b.left<a.right+4&&a.top<b.bottom+4&&b.top<a.bottom+4)this.labels.moon.style.top=(parseFloat(this.labels.moon.style.top)-27)+'px';}
    }
    screenshot(title,subtitle){
      this.render();const raw=this.renderer.domElement,c=document.createElement('canvas');c.width=raw.width;c.height=raw.height+150;
      const x=c.getContext('2d');x.fillStyle='#07121e';x.fillRect(0,0,c.width,c.height);x.drawImage(raw,0,0);
      x.fillStyle='#f1efe7';x.font='bold 25px "Microsoft YaHei", sans-serif';x.fillText(title,30,raw.height+47);
      x.fillStyle='#9bacba';x.font='16px "Microsoft YaHei", sans-serif';x.fillText(subtitle,30,raw.height+83);
      x.fillText('日月地 · 时空实验室｜教学可视化，非专业观测预报｜地貌 / 星点为示意',30,raw.height+118);
      return c.toDataURL('image/png');
    }
    cameraState(){return {azimuth:this.azimuth,elevation:this.elevation,distance:this.distance,fov:this.camera.fov,tracking:this.tracking,focus:this.focus};}
    restoreCamera(c){if(!c)return;this.azimuth=c.azimuth;this.elevation=c.elevation;this.distance=c.distance;this.camera.fov=c.fov;this.tracking=c.tracking;this.focus=c.focus;this.cameraManual=true;this.camera.updateProjectionMatrix();}
    dispose(){this.disposed=true;this.resizeObserver.disconnect();this.renderer.dispose();}
  }
  root.LabScene=LabScene;
})(globalThis);
