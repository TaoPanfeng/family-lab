/*
 * 零第三方运行时的轻量 3D 场景。WebGL 绘制；不支持 WebGL 时使用同一几何数据的 Canvas 备用绘制。
 * 人体是参数化教学模型，不是人体测量、关节受力、床垫压力或医疗仿真。
 */
(function (root) {
  'use strict';
  const C = root.PostureCore;
  const V={add:(a,b)=>a.map((v,i)=>v+b[i]),sub:(a,b)=>a.map((v,i)=>v-b[i]),mul:(a,s)=>a.map(v=>v*s),dot:(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len:a=>Math.hypot(...a),norm:a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);},mix:(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t)};
  const AXES=[[1,0,0],[0,1,0],[0,0,1]], rgb=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
  const P={shirt:'#497d6b',pants:'#566b70',skin:'#debda2',joint:'#bac9bf',highlight:'#dba75a',wood:'#c6a780',woodLight:'#dfc8a9',metal:'#526663',chair:'#859b8c',cream:'#f6f3e9',bed:'#c3d0bf',floor:'#e7ede6',line:'#91b3a0',dark:'#243e3c',screen:'#36534e',key:'#a4b9ab'};
  function matMul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;}
  function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
  function lookAt(eye,target){const z=V.norm(V.sub(eye,target)),x=V.norm(V.cross([0,1,0],z)),y=V.cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,eye),-V.dot(y,eye),-V.dot(z,eye),1]);}
  function applyMatrix(m,p){return [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14],m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15]];}
  function basisPoint(center,basis,local){let q=center.slice();for(let i=0;i<3;i++)q=V.add(q,V.mul(basis[i],local[i]));return q;}
  class Geometry {
    constructor(focus='none'){this.data=[];this.focus=focus;}
    color(color,part){const selected=this.focus===part||(this.focus==='arms'&&['leftArm','rightArm'].includes(part));return rgb(selected&&this.focus!=='none'&&this.focus!=='all'?P.highlight:color);}
    tri(a,b,c,color,part,ns){const col=this.color(color,part),norm=V.norm(V.cross(V.sub(b,a),V.sub(c,a)));[a,b,c].forEach((p,i)=>this.data.push(...p,...(ns?ns[i]:norm),...col));}
    quad(a,b,c,d,color,part,normal){const n=normal?[normal,normal,normal]:null;this.tri(a,b,c,color,part,n);this.tri(a,c,d,color,part,n);}
    box(center,size,color,part='environment',basis=AXES,openTop=false){
      const pt=(x,y,z)=>basisPoint(center,basis,[x*size[0]/2,y*size[1]/2,z*size[2]/2]);
      [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]].filter(([axis,sign])=>!(openTop&&axis===1&&sign===1)).forEach(([axis,sign])=>{const others=[0,1,2].filter(v=>v!==axis),corners=[[-1,-1],[1,-1],[1,1],[-1,1]].map(pair=>{const v=[0,0,0];v[axis]=sign;v[others[0]]=pair[0];v[others[1]]=pair[1];return pt(...v);});this.quad(...corners,color,part,V.mul(basis[axis],sign));});
    }
    ellipsoid(center,radii,color,part='environment',basis=AXES,lon=16,lat=10){
      const point=(a,b)=>{const u=[Math.cos(a)*Math.cos(b),Math.sin(a),Math.cos(a)*Math.sin(b)],pos=basisPoint(center,basis,u.map((v,i)=>v*radii[i]));let norm=[0,0,0];for(let i=0;i<3;i++)norm=V.add(norm,V.mul(basis[i],u[i]/Math.max(.001,radii[i])));return {pos,n:V.norm(norm)};};
      for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const a=-Math.PI/2+j*Math.PI/lat,b=i*2*Math.PI/lon,da=Math.PI/lat,db=2*Math.PI/lon,p=point(a,b),q=point(a+da,b),r=point(a+da,b+db),s=point(a,b+db);this.tri(p.pos,q.pos,r.pos,color,part,[p.n,q.n,r.n]);this.tri(p.pos,r.pos,s.pos,color,part,[p.n,r.n,s.n]);}
    }
    cylinder(a,b,r,color,part='environment',r2=r,n=12){
      const axis=V.norm(V.sub(b,a));if(V.len(V.sub(b,a))<.00001)return;
      const u=V.norm(V.cross(axis,Math.abs(axis[1])>.9?[1,0,0]:[0,1,0])),v=V.cross(axis,u);
      for(let i=0;i<n;i++){const t=i*2*Math.PI/n,tt=(i+1)*2*Math.PI/n,dir=V.add(V.mul(u,Math.cos(t)),V.mul(v,Math.sin(t))),dir2=V.add(V.mul(u,Math.cos(tt)),V.mul(v,Math.sin(tt))),p=V.add(a,V.mul(dir,r)),q=V.add(b,V.mul(dir,r2)),rr=V.add(b,V.mul(dir2,r2)),s=V.add(a,V.mul(dir2,r));this.tri(p,q,rr,color,part,[dir,dir,dir2]);this.tri(p,rr,s,color,part,[dir,dir2,dir2]);this.tri(a,s,p,color,part,[V.mul(axis,-1),V.mul(axis,-1),V.mul(axis,-1)]);this.tri(b,q,rr,color,part,[axis,axis,axis]);}
    }
    disc(center,rx,rz,color){const n=64;for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;this.tri(center,[center[0]+rx*Math.cos(a),center[1],center[2]+rz*Math.sin(a)],[center[0]+rx*Math.cos(b),center[1],center[2]+rz*Math.sin(b)],color,'decor',[[0,1,0],[0,1,0],[0,1,0]]);}}
  }
  function twoBone(start,target,l1,l2){const d=V.sub(target,start),dist=C.clamp(V.len(d),Math.abs(l1-l2)+.002,l1+l2-.002),dir=V.norm(d),end=V.add(start,V.mul(dir,dist));let pole=[0,-1,-.2];pole=V.norm(V.sub(pole,V.mul(dir,V.dot(pole,dir))));const a=(l1*l1-l2*l2+dist*dist)/(2*dist),h=Math.sqrt(Math.max(0,l1*l1-a*a));return {elbow:V.add(V.add(start,V.mul(dir,a)),V.mul(pole,h)),end};}
  class SceneView {
    constructor(canvas,labelHost,onPart,onNotice){
      this.canvas=canvas;this.labelHost=labelHost;this.onPart=onPart;this.onNotice=onNotice;this.focus='none';this.measures=true;this.playing=false;this.azimuth=-1.08;this.elevation=.29;this.radius=3.35;this.target=[0,.83,.18];this.matrix=null;this.anchors=[];this.bodyPoints={};this.frame=0;this.lastPoseBuild=0;this.renderCount=0;this.gl=null;this.vertices=null;this.data=null;
      try{this.gl=canvas.getContext('webgl',{antialias:true,alpha:false,preserveDrawingBuffer:true});if(this.gl)this.initGL();}catch(e){this.gl=null;const replacement=canvas.cloneNode();canvas.replaceWith(replacement);this.canvas=replacement;}
      if(!this.gl){this.ctx=this.canvas.getContext('2d');if(onNotice)onNotice('已启用兼容绘图模式：仍可拖动旋转，动态演示可能较慢。');}
      this.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.lost=true;if(onNotice)onNotice('图形显示暂时中断；内容与方案仍可使用。可尝试刷新页面。');});
      this.canvas.addEventListener('webglcontextrestored',()=>{this.lost=false;this.initGL();this.upload();this.invalidate();});
      this.bindControls();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.canvas.parentElement);this.resize();
    }
    initGL(){
      const gl=this.gl,vs=`attribute vec3 aPosition;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uMatrix;varying vec3 vColor;varying vec3 vNormal;void main(){gl_Position=uMatrix*vec4(aPosition,1.0);vNormal=aNormal;vColor=aColor;}`;
      const fs=`precision mediump float;varying vec3 vColor;varying vec3 vNormal;void main(){vec3 n=normalize(vNormal);float key=max(0.0,dot(n,normalize(vec3(-0.65,1.0,0.7))));float fill=max(0.0,dot(n,normalize(vec3(0.9,0.4,-0.5))));float light=0.61+0.30*key+0.09*fill;gl_FragColor=vec4(vColor*light,1.0);}`;
      const shader=(type,text)=>{const s=gl.createShader(type);gl.shaderSource(s,text);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(error);}return s;};
      const vert=shader(gl.VERTEX_SHADER,vs),frag=shader(gl.FRAGMENT_SHADER,fs);this.program=gl.createProgram();gl.attachShader(this.program,vert);gl.attachShader(this.program,frag);gl.linkProgram(this.program);gl.deleteShader(vert);gl.deleteShader(frag);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error('无法建立 3D 绘制程序');
      gl.useProgram(this.program);this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);['aPosition','aNormal','aColor'].forEach((name,i)=>{const loc=gl.getAttribLocation(this.program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,i*12);});this.uMatrix=gl.getUniformLocation(this.program,'uMatrix');gl.enable(gl.DEPTH_TEST);gl.clearColor(.933,.949,.924,1);
    }
    bindControls(){
      const pointers=new Map();let previous=null,down=null,pinch=null;
      this.canvas.addEventListener('pointerdown',e=>{this.canvas.focus({preventScroll:true});this.canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);down=[e.clientX,e.clientY];previous=[e.clientX,e.clientY];if(pointers.size===2){const a=[...pointers.values()];pinch=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);}});
      this.canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);if(pinch)this.radius=C.clamp(this.radius*(pinch/d),1.4,7);pinch=d;}else if(previous){this.azimuth-=(e.clientX-previous[0])*.008;this.elevation=C.clamp(this.elevation+(e.clientY-previous[1])*.006,.06,1.43);}previous=[e.clientX,e.clientY];this.invalidate();});
      const finish=e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<6&&pointers.size===1)this.pick(e.clientX,e.clientY);pointers.delete(e.pointerId);previous=null;down=null;pinch=null;};
      this.canvas.addEventListener('pointerup',finish);this.canvas.addEventListener('pointercancel',()=>{pointers.clear();previous=down=pinch=null;});
      this.canvas.addEventListener('wheel',e=>{e.preventDefault();this.radius=C.clamp(this.radius*Math.exp(e.deltaY*.001),1.4,7);this.invalidate();},{passive:false});
      this.canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','Home'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')this.azimuth-=.15;if(e.key==='ArrowRight')this.azimuth+=.15;if(e.key==='ArrowUp')this.elevation=C.clamp(this.elevation+.1,.06,1.43);if(e.key==='ArrowDown')this.elevation=C.clamp(this.elevation-.1,.06,1.43);if(e.key==='+')this.radius=C.clamp(this.radius-.2,1.4,7);if(e.key==='-')this.radius=C.clamp(this.radius+.2,1.4,7);if(e.key==='Home')this.camera('home');this.invalidate();});
    }
    resize(){const rect=this.canvas.parentElement.getBoundingClientRect();this.width=Math.max(100,rect.width);this.height=Math.max(100,rect.height);const dpr=Math.min(root.devicePixelRatio||1,1.7);this.canvas.width=Math.round(this.width*dpr);this.canvas.height=Math.round(this.height*dpr);this.canvas.style.width=this.width+'px';this.canvas.style.height=this.height+'px';if(this.gl)this.gl.viewport(0,0,this.canvas.width,this.canvas.height);this.invalidate();}
    camera(view){if(view==='home'){this.azimuth=this.posture?.category==='lie'?-1.0:-1.66;this.elevation=this.posture?.category==='lie'?.57:.29;this.radius=(this.posture?.category==='lie'?3.45:this.posture?.category==='sit'?2.9:3.35)*(this.profile?.height||170)/170;}if(view==='front'){this.azimuth=0;this.elevation=.15;}if(view==='side'){this.azimuth=-Math.PI/2;this.elevation=.12;}if(view==='top'){this.azimuth=0;this.elevation=1.43;}this.invalidate();}
    update(posture,profile,params,focus='none',measures=true){const changed=this.posture?.id!==posture.id;this.posture=posture;this.profile=profile;this.params=params;this.focus=focus;this.measures=measures;this.target=posture.category==='lie'?[0,.55,0]:posture.scene==='seiza'||posture.scene==='cross'?[0,.63,.05]:posture.category==='sit'?[0,(params.seat+C.dimensions(profile).eyeSeat)*.006,.12]:[0,profile.height/210,0];if(changed){this.playing=false;this.camera('home');}this.build(0);this.invalidate();}
    setPlaying(value){this.playing=value&&this.posture?.id==='walk';this.invalidate();}
    upload(){if(this.gl&&!this.lost&&this.vertices){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,this.vertices,this.gl.DYNAMIC_DRAW);}}
    build(time){
      if(!this.posture)return;const p=this.posture,s=this.params,h=this.profile.height/100,g=new Geometry(this.focus);this.anchors=[];this.bodyPoints={};
      g.disc([0,-.018,.1],1.65,1.45,P.floor);g.disc([0,-.015,.1],1.45,1.24,'#e2e9df');
      // 台面上的细刻线是空间参照，并不代表真实测量刻度。
      for(let i=-4;i<=4;i++){g.box([i*.3,-.012,.1],[.003,.003,2.3],'#d2ddd1','decor');g.box([0,-.012,i*.3+.1],[2.65,.003,.003],'#d2ddd1','decor');}
      if(p.category==='lie')this.sleepScene(g,h,p,s);else this.uprightScene(g,h,p,s,time);
      this.vertices=new Float32Array(g.data);this.vertexCount=this.vertices.length/9;this.upload();this.makeLabels();this.data=g;this.lastPoseBuild=time;
    }
    human(g,h,points,basis,options={}){
      const left=basis[0],up=basis[1],front=basis[2],headBasis=options.headBasis||basis;
      const hip=points.hip,shoulderCenter=V.mix(points.leftShoulder,points.rightShoulder,.5),trunk=V.sub(shoulderCenter,hip),trunkUp=V.norm(trunk),trunkFront=V.norm(V.cross(left,trunkUp));
      g.ellipsoid(V.mix(hip,shoulderCenter,.56),[h*.114,V.len(trunk)*.69,h*.069],P.shirt,'torso',[left,trunkUp,trunkFront]);
      g.ellipsoid(hip,[h*.104,h*.067,h*.077],P.pants,'torso',basis);
      const neck=V.add(shoulderCenter,V.mul(up,h*.046));g.cylinder(shoulderCenter,neck,h*.033,P.skin,'head');g.cylinder(neck,points.head,h*.028,P.skin,'head');
      g.ellipsoid(points.head,[h*.055,h*.069,h*.061],P.skin,'head',headBasis,20,12);
      const face=V.add(points.head,V.mul(headBasis[2],h*.059));g.ellipsoid(V.add(face,V.mul(headBasis[1],h*.001)),[h*.009,h*.012,h*.014],P.skin,'head',headBasis,10,6);
      for(const sign of [-1,1]){const eye=V.add(V.add(face,V.mul(headBasis[0],sign*h*.018)),V.mul(headBasis[1],h*.019));g.ellipsoid(eye,[h*.0036,h*.0025,h*.0027],P.dark,'head',headBasis,8,6);}
      ['left','right'].forEach(side=>{const part=side==='left'?'leftArm':'rightArm',a=points[side+'Shoulder'],b=points[side+'Elbow'],c=points[side+'Hand'];g.ellipsoid(a,[h*.047,h*.047,h*.047],P.shirt,part,AXES,12,8);g.cylinder(a,b,h*.043,P.shirt,part,h*.036);g.ellipsoid(b,[h*.033,h*.034,h*.034],P.skin,part,AXES,12,8);g.cylinder(b,c,h*.030,P.skin,part,h*.023);const handUp=V.norm(V.sub(c,b)),handFront=V.norm(V.cross(left,handUp));g.ellipsoid(V.add(c,V.mul(handUp,h*.021)),[h*.027,h*.048,h*.016],P.skin,part,[left,handUp,handFront],12,8);});
      ['left','right'].forEach(side=>{const start=V.add(hip,V.mul(left,(side==='left'?1:-1)*h*.072)),k=points[side+'Knee'],a=points[side+'Ankle'];g.cylinder(start,k,h*.058,P.pants,'legs',h*.040);g.ellipsoid(k,[h*.042,h*.042,h*.042],P.pants,'legs',AXES,12,8);g.cylinder(k,a,h*.039,P.pants,'legs',h*.024);const foot=points[side+'Foot']||V.add(a,V.mul(front,h*.045));g.ellipsoid(foot,[h*.037,h*.025,h*.076],options.bare?P.skin:P.cream,'legs',points.footBasis||basis,12,8);});
      this.bodyPoints={head:points.head,torso:V.mix(hip,shoulderCenter,.5),leftArm:points.leftElbow,rightArm:points.rightElbow,legs:points.leftKnee};
    }
    uprightScene(g,h,p,s,time){
      const d=C.dimensions(this.profile),seat=s.seat/100,isChair=['office','bench','chair'].includes(p.scene),floorSit=['seiza','cross'].includes(p.scene),isDesk=['office','standdesk'].includes(p.scene);let hip,head,shoulderY,shoulderZ,up=[0,1,0],front=[0,0,1],points={};
      if(isChair){
        const lean=p.scene==='office'?(s.backAngle-90)*Math.PI/180:5*Math.PI/180;hip=[0,seat+.06*h,-.015];shoulderY=seat+d.eyeSeat/100-.136*h;shoulderZ=-.015-Math.sin(lean)*(shoulderY-hip[1]);up=[0,Math.cos(lean),-Math.sin(lean)];front=[0,Math.sin(lean),Math.cos(lean)];head=[0,seat+d.eyeSeat/100-.018*h,shoulderZ-.015*h];
        const footBase=Math.max(s.footrest/100,seat-d.popliteal/100),kneeY=Math.max(seat+.032*h,footBase+d.popliteal/100+.025*h),kneeZ=Math.sqrt(Math.max(.018,(h*.245)**2-(kneeY-hip[1])**2));
        [-1,1].forEach(sign=>{const side=sign===1?'left':'right';points[side+'Knee']=[sign*.09*h,kneeY,kneeZ];points[side+'Ankle']=[sign*.09*h,footBase+.033*h,kneeZ+.018];points[side+'Foot']=[sign*.09*h,footBase+.025*h,kneeZ+.064*h];});
        this.chair(g,p.scene,s,h,lean);if(s.footrest>0)g.box([0,s.footrest/200,points.leftFoot[2]],[.57,s.footrest/100,.35],P.woodLight,'environment');
        this.measure(g,[-.39,0,.08],[-.39,seat,.08],`椅面 ${C.round(s.seat)} cm`,'seat');
      }else if(floorSit){
        const pad=s.pad/100;hip=[0,p.scene==='seiza'?.155+pad:.075+pad,0];shoulderY=hip[1]+h*.28;shoulderZ=0;head=[0,hip[1]+h*.403,.014];g.box([0,.013,.10],[1.02,.026,.96],'#b2c4aa','environment');g.ellipsoid([0,pad/2+.025,-.025],[.28,pad/2,.26],P.cream,'environment');
        if(p.scene==='seiza')[-1,1].forEach(sign=>{const side=sign===1?'left':'right';points[side+'Knee']=[sign*.075*h,.07,.36];points[side+'Ankle']=[sign*.068*h,.056,-.22];points[side+'Foot']=[sign*.068*h,.052,-.28];});
        else [-1,1].forEach(sign=>{const side=sign===1?'left':'right';points[side+'Knee']=[sign*.23*h,.12,.24];points[side+'Ankle']=[-sign*.11*h,.075+(sign===1?.035:0),.38];points[side+'Foot']=[-sign*.12*h,.064+(sign===1?.035:0),.42];});
        this.measure(g,[-.47,.025,0],[-.47,pad+.025,0],`坐垫 ${s.pad} cm`,'pad');
      }else{
        hip=[0,h*.545,0];shoulderY=h*.818;shoulderZ=0;head=[0,h*.918,0];
        const phase=time*s.cadence/60*Math.PI,stride=p.scene==='walk'?Math.sin(phase)*h*.15:0;
        [-1,1].forEach(sign=>{const side=sign===1?'left':'right',z=sign*stride,lift=p.scene==='walk'?Math.max(0,Math.cos(phase+(sign===1?0:Math.PI)))*h*.045:0;points[side+'Knee']=[sign*.071*h,h*.287+lift*.45,z*.43];points[side+'Ankle']=[sign*.072*h,h*.039+lift,z];points[side+'Foot']=[sign*.072*h,h*.025+lift,z+.048*h];});
        if(p.scene==='walk'){for(let i=-4;i<=4;i++)g.box([0,-.007,i*.26],[.018,.005,.10],P.line,'decor');}
        this.measure(g,[-.52,0,0],[-.52,h,0],`身高 ${this.profile.height} cm`,'height');
      }
      points.hip=hip;points.head=head;points.leftShoulder=[h*.112,shoulderY,shoulderZ];points.rightShoulder=[-h*.112,shoulderY,shoulderZ];
      ['left','right'].forEach(side=>{const sign=side==='left'?1:-1,shoulder=points[side+'Shoulder'];let target;
        if(isDesk)target=[sign*h*.093,s.desk/100+.02,.29];
        else if(isChair)target=[sign*h*.09,seat+.07*h,.29];
        else if(p.scene==='cross')target=V.add(points[side+'Knee'],[0,.055,-.02]);
        else if(p.scene==='seiza')target=[sign*h*.08,hip[1]-.015,.23];
        else if(p.scene==='walk'){const swing=-sign*Math.sin(time*s.cadence/60*Math.PI)*h*.145;target=[sign*h*.135,h*.48,swing];}
        else target=[sign*h*.15,h*.492,.035];
        const solved=twoBone(shoulder,target,h*.18,h*.158);points[side+'Elbow']=solved.elbow;points[side+'Hand']=solved.end;
      });
      if(isDesk){
        const eye=isChair?seat+d.eyeSeat/100:d.standingEye/100;head[1]=eye-.018*h;const eyeZ=head[2]+h*.055,screenZ=eyeZ+s.distance/100;this.desk(g,s,screenZ,points,h);this.measure(g,[.78,0,.61],[.78,s.desk/100,.61],`输入面 ${C.round(s.desk)} cm`,'desk');
        const eyePoint=[0,eye,eyeZ],end=[0,eye,screenZ];g.cylinder(eyePoint,end,.0025,'#88ad92','decor');g.cylinder(eyePoint,[0,s.screen/100-.16,screenZ],.002,'#b5bdad','decor');
        this.anchors.push({pos:[.14,eye,eyeZ],text:`眼高 ${C.round(eye*100)} cm`,type:'eye'});this.anchors.push({pos:[0,s.screen/100+.035,screenZ],text:`屏顶 ${C.round(s.screen)} cm`,type:'screen'});
      }
      this.human(g,h,points,[[1,0,0],up,front],{bare:floorSit});
    }
    chair(g,scene,s,h,lean){const seat=s.seat/100;
      if(scene==='bench'){
        for(let i=0;i<5;i++){g.box([0,seat-.025,-.13+i*.09],[1.55,.05,.073],i%2?P.wood:P.woodLight);g.box([0,seat+.18+i*.062,-.205],[1.55,.049,.045],P.wood);}
        for(const x of [-.58,.58]){g.box([x,seat/2-.025,.08],[.055,seat-.05,.055],P.metal);g.box([x,seat+.22,-.23],[.048,.52,.048],P.metal);g.box([x,.035,.08],[.11,.05,.52],P.metal);}
        this.plant(g,[1.02,0,-.5],.75);
      }else{
        g.box([0,seat-.035,.06],[.55,.07,.54],P.chair);g.ellipsoid([0,seat-.005,.065],[.28,.026,.27],P.chair);
        const up=[0,Math.cos(lean),-Math.sin(lean)],front=[0,Math.sin(lean),Math.cos(lean)];g.box([0,seat+.25,-.24-Math.sin(lean)*.15],[.51,.48,.075],P.chair,'environment',[[1,0,0],up,front]);g.box([0,seat*.53,-.08],[.07,Math.max(.05,seat-.15),.07],P.metal);
        if(scene==='office'){
          for(let i=0;i<5;i++){const a=i*2*Math.PI/5;g.cylinder([0,.065,-.08],[Math.cos(a)*.3,.065,-.08+Math.sin(a)*.3],.022,P.metal);g.ellipsoid([Math.cos(a)*.3,.042,-.08+Math.sin(a)*.3],[.039,.04,.032],P.metal);}
          for(const x of [-.30,.30]){g.box([x,seat+.15,0],[.03,.26,.03],P.metal);g.box([x,seat+.28,.02],[.07,.035,.3],P.chair);}
        }else for(const x of [-.22,.22])for(const z of [-.15,.25])g.box([x,seat/2-.045,z],[.043,seat-.09,.043],P.wood);
      }
    }
    desk(g,s,screenZ,points,h){const top=s.desk/100-.01,back=Math.max(.76,screenZ+.11),front=.21;g.box([0,top-.025,(back+front)/2],[1.35,.05,back-front],P.woodLight);
      for(const x of [-.60,.60]){g.box([x,top/2-.025,(back+front)/2],[.043,top-.05,.12],P.metal);g.box([x,.023,(back+front)/2],[.075,.045,back-front],P.metal);}
      const screenTop=s.screen/100;g.box([0,screenTop-.16,screenZ],[.58,.335,.023],P.dark);g.box([0,screenTop-.16,screenZ-.014],[.541,.294,.006],P.screen);
      // 屏幕是装饰性工作场景，不依赖外部图片或网络内容。
      for(let row=0;row<6;row++){const z=screenZ-.019;g.box([-.18,screenTop-.065-row*.034,z],[.048,.006,.004],'#96b6a1');g.box([-.075,screenTop-.065-row*.034,z],[.105+((row%3)*.02),.006,.004],row%2?'#c4bb96':'#789b91');}
      g.box([.153,screenTop-.17,screenZ-.019],[.11,.18,.004],'#42685b');g.box([0,top+.012,screenZ],[.29,.023,.19],P.metal);g.cylinder([0,top+.023,screenZ],[0,screenTop-.32,screenZ],.018,P.metal);
      g.box([-.04,top+.038,.391],[.40,.018,.16],P.dark);for(let j=0;j<4;j++)for(let i=0;i<10;i++)g.box([-.217+i*.039,top+.05,.336+j*.033],[.03,.007,.026],P.key);
      g.ellipsoid([-.32,top+.043,.38],[.035,.020,.058],P.metal);
      this.plant(g,[.51,top,.68],.33);
    }
    plant(g,base,scale){const pos=(x,y,z)=>V.add(base,[x*scale,y*scale,z*scale]);g.cylinder(pos(0,0,0),pos(0,.24,0),.105*scale,P.cream,'decor',.14*scale);for(let i=0;i<5;i++){const a=i*2.1,end=pos(Math.cos(a)*.21,.52+i*.045,Math.sin(a)*.19);g.cylinder(pos(0,.20,0),end,.008*scale,P.shirt,'decor');const direction=V.norm(V.sub(end,pos(0,.20,0))),side=V.norm(V.cross(direction,[1,0,0]));g.ellipsoid(end,[.065*scale,.17*scale,.025*scale],i%2?'#7c9d77':'#6d947a','decor',[side,direction,V.norm(V.cross(side,direction))],10,6);}}
    sleepScene(g,h,p,s){
      const top=.54,length=Math.max(2.12,h+.22),width=1.18,sink=(5-s.firmness)*.009,side=p.id!=='supine'&&p.id!=='prone',right=p.side==='右';
      g.box([0,.29,0],[width+.08,.13,length+.06],P.woodLight);for(const x of [-.48,.48])for(const z of [-length*.39,length*.39])g.box([x,.12,z],[.08,.24,.08],P.wood);
      g.box([0,.445,0],[width,.19,length],P.bed,'environment',AXES,true);g.box([0,.68,-length/2-.04],[width+.08,.65,.07],P.woodLight);
      const surface=(x,z)=>top-sink*(Math.exp(-((x/.34)**2+((z+.43)/.27)**2))+.78*Math.exp(-((x/.34)**2+(z/.27)**2)));
      const nx=18,nz=28;for(let ix=0;ix<nx;ix++)for(let iz=0;iz<nz;iz++){const x=-width/2+ix*width/nx,z=-length/2+iz*length/nz,dx=width/nx,dz=length/nz;g.quad([x,surface(x,z),z],[x+dx,surface(x+dx,z),z],[x+dx,surface(x+dx,z+dz),z+dz],[x,surface(x,z+dz),z+dz],P.cream,'environment',[0,1,0]);}
      // 软硬的凹陷仅为教学放大示意，不是材料或人体的有限元计算。
      const left=side?(right?[0,1,0]:[0,-1,0]):p.id==='prone'?[-1,0,0]:[1,0,0],up=[0,0,-1],front=side?(right?[-1,0,0]:[1,0,0]):p.id==='prone'?[0,-1,0]:[0,1,0];
      const bodyBase=top+(side?.14*h:.073*h)-sink*.62,origin=[0,bodyBase,.045],T=(x,y,z)=>basisPoint(origin,[left,up,front],[x,y,z]),points={hip:T(0,0,0)};
      if(side)points.hip[1]-=.03*h;
      points.leftShoulder=T(.105*h,.275*h,0);points.rightShoulder=T(-.105*h,.275*h,0);
      const pillowHeight=s.pillow/100,headZ=.045-h*.402;g.ellipsoid([0,top+pillowHeight/2,headZ],[.32,pillowHeight/2,.21],P.cream,'environment',AXES,20,10);
      points.head=T(0,.402*h,0);points.head[1]=top+pillowHeight+(side?.055*h:.061*h);
      const curled=p.id==='fetal',flex=curled?.23*h:side?.14*h:.015*h,legDrop=curled?.15*h:.245*h;
      [-1,1].forEach(sign=>{const name=sign===1?'left':'right';points[name+'Knee']=T(sign*.07*h,-legDrop,flex);points[name+'Ankle']=T(sign*.07*h,-(curled?.37:side?.47:.50)*h,curled?.28*h:side?.17*h:0);points[name+'Foot']=V.add(points[name+'Ankle'],V.mul(front,.04*h));});
      if(side){const lower=right?'right':'left',upper=right?'left':'right';points[lower+'Knee'][1]=top+.041*h;points[lower+'Ankle'][1]=top+.029*h;points[lower+'Foot'][1]=top+.037*h;points[upper+'Knee'][1]=points[lower+'Knee'][1]+.10*h;points[upper+'Ankle'][1]=points[lower+'Ankle'][1]+.081*h;points[upper+'Foot'][1]=points[lower+'Foot'][1]+.081*h;}
      if(side&&s.kneePillow){const upper=right?'left':'right';points[upper+'Knee'][1]+=.02;points[upper+'Ankle'][1]+=.012;g.ellipsoid(V.mix(points.leftKnee,points.rightKnee,.5),[.15,.073,.19],P.cream,'environment');}
      if(p.id==='supine'&&s.kneePillow){points.leftKnee[1]+=.058;points.rightKnee[1]+=.058;g.ellipsoid([0,top+.042,points.leftKnee[2]],[.30,.068,.19],P.cream,'environment');}
      if(p.id==='prone'&&s.kneePillow)g.ellipsoid([0,top+.019,.02],[.27,.032,.22],P.cream,'environment');
      ['left','right'].forEach(name=>{const sign=name==='left'?1:-1;if(side){const lower=(right&&name==='right')||(!right&&name==='left');points[name+'Elbow']=T(sign*.105*h,.15*h,.16*h);points[name+'Hand']=T(sign*.105*h,.30*h,.23*h);
          if(!lower){points[name+'Elbow']=T(sign*.13*h,.12*h,.10*h);points[name+'Hand']=T(sign*.10*h,-.07*h,.13*h);}
          if(p.id==='auspicious'&&name==='left'){points.leftElbow=T(.14*h,.07*h,.03*h);points.leftHand=T(.11*h,-.16*h,.07*h);}
        }else{points[name+'Elbow']=T(sign*.145*h,.10*h,0);points[name+'Hand']=T(sign*.145*h,-.07*h,0);}});
      this.human(g,h,points,[left,up,front],{bare:true,headBasis:p.id==='prone'?[[0,1,0],[0,0,-1],[-1,0,0]]:null});
      this.anchors.push({pos:[-.43,top+.02,-.28],text:`床垫 ${s.firmness} / 5 · 相对硬度`,type:'mattress'});this.anchors.push({pos:[.28,top+pillowHeight+.06,headZ],text:`受压后枕高 ${s.pillow} cm`,type:'pillow'});
      if(this.focus==='leftArm'||this.focus==='rightArm'||this.focus==='arms'){this.anchors.push({pos:points.leftHand,text:'左手 L',type:'leftHand'});this.anchors.push({pos:points.rightHand,text:'右手 R',type:'rightHand'});}
      this.measure(g,[.73,.34,.63],[.73,top,.63],'床垫变形为示意','bed');
    }
    measure(g,a,b,text,type){if(this.measures){g.cylinder(a,b,.0025,P.line,'decor');g.cylinder(V.add(a,[-.036,0,0]),V.add(a,[.036,0,0]),.0025,P.line,'decor');g.cylinder(V.add(b,[-.036,0,0]),V.add(b,[.036,0,0]),.0025,P.line,'decor');}this.anchors.push({pos:V.mix(a,b,.65),text,type});}
    makeLabels(){this.labelHost.replaceChildren();if(!this.measures)return;this.anchors.forEach(a=>{const el=document.createElement('span');el.className='scene-label '+a.type;el.textContent=a.text;this.labelHost.appendChild(el);a.element=el;});}
    project(p){if(!this.matrix)return null;const q=applyMatrix(this.matrix,p);return {x:(q[0]/q[3]+1)*this.width/2,y:(1-q[1]/q[3])*this.height/2,depth:q[2]/q[3],visible:q[3]>0&&q[2]/q[3]<1};}
    pick(clientX,clientY){const rect=this.canvas.getBoundingClientRect(),x=clientX-rect.left,y=clientY-rect.top;let best=null,dist=30;Object.entries(this.bodyPoints).forEach(([part,point])=>{const q=this.project(point);if(q&&q.visible){const d=Math.hypot(q.x-x,q.y-y);if(d<dist){best=part;dist=d;}}});if(best&&this.onPart)this.onPart(best);}
    invalidate(){if(!this.frame)this.frame=requestAnimationFrame(t=>{this.frame=0;this.draw(t/1000);if(this.playing&&!document.hidden)this.invalidate();});}
    draw(time=0){if(!this.vertices||this.lost)return;if(this.playing&&time-this.lastPoseBuild>.045)this.build(time);
      const eye=[this.target[0]+Math.sin(this.azimuth)*Math.cos(this.elevation)*this.radius,this.target[1]+Math.sin(this.elevation)*this.radius,this.target[2]+Math.cos(this.azimuth)*Math.cos(this.elevation)*this.radius];this.matrix=matMul(perspective(40*Math.PI/180,this.width/this.height,.05,30),lookAt(eye,this.target));
      if(this.gl){const gl=this.gl;gl.useProgram(this.program);gl.uniformMatrix4fv(this.uMatrix,false,this.matrix);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,this.vertexCount);}else this.drawFallback();
      this.anchors.forEach(a=>{if(!a.element)return;const q=this.project(a.pos);a.element.style.display=q&&q.visible?'block':'none';if(q){const x=C.clamp(q.x,8,this.width-160),y=C.clamp(q.y,12,this.height-45);a.element.style.transform=`translate(${x}px,${y}px)`;}});this.renderCount++;
    }
    drawFallback(){
      // 软件深度缓冲：不能只按三角形平均深度排序，否则床面/桌面会错误遮挡人体。
      const ctx=this.ctx;if(!ctx)return;
      const scale=Math.min(1.25,this.canvas.width/this.width),w=Math.round(this.width*scale),h=Math.round(this.height*scale),n=w*h;
      if(!this.soft||this.soft.w!==w||this.soft.h!==h){const surface=document.createElement('canvas');surface.width=w;surface.height=h;const sctx=surface.getContext('2d');this.soft={w,h,surface,sctx,image:sctx.createImageData(w,h),depth:new Float32Array(n)};}
      const {image,depth,surface,sctx}=this.soft,pixels=image.data;depth.fill(Infinity);
      for(let i=0;i<pixels.length;i+=4){pixels[i]=238;pixels[i+1]=242;pixels[i+2]=235;pixels[i+3]=255;}
      const v=this.vertices,m=this.matrix,key=V.norm([-.65,1,.7]),fill=V.norm([.9,.4,-.5]);
      const projectVertex=i=>{const q=applyMatrix(m,[v[i],v[i+1],v[i+2]]),light=.61+.30*Math.max(0,v[i+3]*key[0]+v[i+4]*key[1]+v[i+5]*key[2])+.09*Math.max(0,v[i+3]*fill[0]+v[i+4]*fill[1]+v[i+5]*fill[2]);return {x:(q[0]/q[3]+1)*w/2,y:(1-q[1]/q[3])*h/2,z:q[2]/q[3],q:q[3],light};};
      for(let i=0;i<v.length;i+=27){const a=projectVertex(i),b=projectVertex(i+9),c=projectVertex(i+18);if(a.q<=0||b.q<=0||c.q<=0)continue;
        const den=(b.y-c.y)*(a.x-c.x)+(c.x-b.x)*(a.y-c.y);if(Math.abs(den)<.00001)continue;
        const minX=Math.max(0,Math.floor(Math.min(a.x,b.x,c.x))),maxX=Math.min(w-1,Math.ceil(Math.max(a.x,b.x,c.x))),minY=Math.max(0,Math.floor(Math.min(a.y,b.y,c.y))),maxY=Math.min(h-1,Math.ceil(Math.max(a.y,b.y,c.y)));if(minX>maxX||minY>maxY)continue;
        const dx0=(b.y-c.y)/den,dy0=(c.x-b.x)/den,dx1=(c.y-a.y)/den,dy1=(a.x-c.x)/den,base0=((b.y-c.y)*(minX+.5-c.x)+(c.x-b.x)*(minY+.5-c.y))/den,base1=((c.y-a.y)*(minX+.5-c.x)+(a.x-c.x)*(minY+.5-c.y))/den;
        const cr=v[i+6]*255,cg=v[i+7]*255,cb=v[i+8]*255;
        for(let y=minY;y<=maxY;y++){let p0=base0+(y-minY)*dy0,p1=base1+(y-minY)*dy1,idx=y*w+minX;
          for(let x=minX;x<=maxX;x++,idx++,p0+=dx0,p1+=dx1){const p2=1-p0-p1;if(p0<-.00001||p1<-.00001||p2<-.00001)continue;const z=p0*a.z+p1*b.z+p2*c.z;if(z>=depth[idx]||z< -1||z>1)continue;depth[idx]=z;const light=p0*a.light+p1*b.light+p2*c.light,j=idx*4;pixels[j]=cr*light;pixels[j+1]=cg*light;pixels[j+2]=cb*light;}
        }
      }
      sctx.putImageData(image,0,0);ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(surface,0,0,this.canvas.width,this.canvas.height);
    }
    exportCanvas(){this.draw(performance.now()/1000);const out=document.createElement('canvas');out.width=this.canvas.width;out.height=this.canvas.height+112;const ctx=out.getContext('2d');ctx.fillStyle='#eef2eb';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(this.canvas,0,80);ctx.fillStyle='#244b40';ctx.font='bold 24px sans-serif';ctx.fillText('身有度 · '+this.posture.name,28,38);ctx.font='14px sans-serif';ctx.fillText(`成人教学示意 | 身高 ${this.profile.height} cm | 非医疗诊断、非压力仿真`,28,63);ctx.font='13px sans-serif';ctx.fillText(this.anchors.map(a=>a.text).join(' · '),28,out.height-15);return out;}
    dispose(){this.observer.disconnect();cancelAnimationFrame(this.frame);if(this.gl){this.gl.deleteBuffer(this.buffer);this.gl.deleteProgram(this.program);}}
  }
  root.PostureScene=SceneView;
})(window);
