/* Joint-driven mannequin with articulated fingers, explicit palm orientation and inspectable views. */
(function () {
  'use strict';
  const M=Museum,B=MartialModel,H=MartialHands,D=LabDraw,P=D.colors;
  const links=[['lShoulder','lElbow'],['lElbow','lWrist'],['rShoulder','rElbow'],['rElbow','rWrist'],['lHip','lKnee'],['lKnee','lAnkle'],['rHip','rKnee'],['rKnee','rAnkle']];
  let frameKey='';
  const fields=v=>({amplitude:v.amplitude,stance:v.stance||.22,mirror:v.mirror});
  for(const l of M.lessons){
    l.controls.push({id:'detail',label:'观察范围',type:'select',value:l.id==='wingchun'?'upper':'full',options:[['full','全身与站姿'],['upper','上半身与双手'],['left','左手近景'],['right','右手近景']]});
    l.controls.push({id:'appearance',label:'人物显示',type:'select',value:'uniform',options:[['uniform','练功服 · 完整人物'],['plain','素模 · 看结构'],['skeleton','骨架 · 看关节']]});
    l.controls.push({id:'palms',label:'显示掌面方向箭头',type:'checkbox',value:true});
    l.duration=25;l.sources.push(['Wing Chun Halesowen · 掌型与结构','https://www.wingchunhalesowen.co.uk/tan-sau-bong-sau-pak-sau/']);
    l.controls.find(p=>p.id==='skeleton').value=false;
  }
  function connect(a,b,obj){const u=new THREE.Vector3(...a),d=new THREE.Vector3(...b).sub(u);obj.position.copy(u.addScaledVector(d,.5));obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());obj.scale.y=d.length();}
  function mesh(geometry,color){return new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.82,metalness:0}));}
  function label(text,color){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=80;const c=canvas.getContext('2d');c.fillStyle='#0b1626df';c.roundRect(0,0,256,80,14);c.fill();c.fillStyle=color;c.font='600 26px system-ui,"Microsoft YaHei"';c.textAlign='center';c.textBaseline='middle';c.fillText(text,128,40);const texture=new THREE.CanvasTexture(canvas),sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));sprite.scale.set(.26,.081,1);return sprite;}
  M.mount=({lesson:l,values:v,container,custom})=>{
    frameKey='';custom.innerHTML='<section class="card"><h2>先看身形，再看掌向与动作</h2><div class="legend"><span class="legend-chip"><i style="--chip:#f0c7a5"></i>暖色面＝手心（可见掌纹）</span><span class="legend-chip"><i style="--chip:#9eb6cb"></i>蓝灰面＝手背（可见指甲）</span><span>青环＝人物左腕；金环＝人物右腕</span></div><p id="hand-state" class="details-text"></p><div class="phase-strip" id="pose-frames"></div><p class="tiny">模型展示关节位置与掌面，不推算发力或内劲；不同传承动作存在差异，不能代替教练纠正。</p></section>';
    const s=Lab3D.make(container,{distance:3.25,target:[0,.99,0],yaw:0,pitch:.12,min:.3,max:10,allowSoftware:true});if(!s)return null;
    const bones=links.map(([a],i)=>{const upper=i%2===0,leg=i>=4;const top=leg?(upper?.09:.064):(upper?.067:.045),bottom=leg?(upper?.062:.037):(upper?.047:.027);const obj=mesh(new THREE.CylinderGeometry(bottom,top,1,20),leg?0x223747:0xe5ded0);s.scene.add(obj);return obj;});
    const joints={};for(const name of ['lShoulder','rShoulder','lElbow','rElbow','lWrist','rWrist','lHip','rHip','lKnee','rKnee']){const obj=mesh(new THREE.SphereGeometry(.018,14,10),0xe3e8e5);obj.material.depthTest=false;obj.renderOrder=9;joints[name]=obj;s.scene.add(obj);}
    const torsoPoints=[[.155,0],[.16,.10],[.145,.20],[.19,.34],[.224,.45],[.22,.5],[.12,.56],[.065,.60]].map(p=>new THREE.Vector2(...p));
    const torso=mesh(new THREE.LatheGeometry(torsoPoints,48),0xe5ded0);torso.scale.z=.63;s.scene.add(torso);
    const hips=mesh(new THREE.SphereGeometry(1,24,16),0x263e50);hips.scale.set(.18,.145,.115);s.scene.add(hips);
    const belt=mesh(new THREE.TorusGeometry(.16,.025,12,48),0x233848);belt.rotation.x=Math.PI/2;belt.scale.y=.68;s.scene.add(belt);
    const neck=mesh(new THREE.CylinderGeometry(.055,.061,.13,20),0xd8b093);s.scene.add(neck);
    const head=new THREE.Group(),skull=mesh(new THREE.SphereGeometry(1,32,24),0xd8b093);skull.scale.set(.091,.123,.092);head.add(skull);
    const face=mesh(new THREE.SphereGeometry(1,24,18),0xd8b093);face.scale.set(.075,.084,.059);face.position.set(0,-.024,.047);head.add(face);
    const nose=mesh(new THREE.ConeGeometry(.016,.042,4),0xc8a189);nose.rotation.x=Math.PI/2;nose.position.set(0,-.011,.105);head.add(nose);
    for(const x of [-.093,.093]){const ear=mesh(new THREE.SphereGeometry(1,12,10),0xc59e82);ear.scale.set(.012,.025,.018);ear.position.set(x,-.006,0);head.add(ear);}// Face details use adult proportions; no oversized cartoon eyes.
    const hair=mesh(new THREE.SphereGeometry(1,28,20,0,Math.PI*2,0,Math.PI*.48),0x253342);hair.scale.set(.092,.126,.094);head.add(hair);
    for(const x of [-.031,.031]){const eye=mesh(new THREE.SphereGeometry(1,14,10),0x2d302f);eye.scale.set(.008,.0035,.003);eye.position.set(x,.006,.099);head.add(eye);const brow=mesh(new THREE.BoxGeometry(.022,.003,.003),0x343631);brow.position.set(x,.022,.093);head.add(brow);}
    const mouth=mesh(new THREE.BoxGeometry(.029,.003,.003),0xa27d6d);mouth.position.set(0,-.05,.101);head.add(mouth);
    const uniformDetails=new THREE.Group();uniformDetails.name='practice-uniform';torso.add(uniformDetails);
    const seam=mesh(new THREE.BoxGeometry(.012,.43,.009),0xc9beac);seam.position.set(0,.29,.133);uniformDetails.add(seam);
    for(let k=0;k<4;k++){const toggle=mesh(new THREE.CapsuleGeometry(.005,.037,4,10),0x263e50);toggle.rotation.z=Math.PI/2;toggle.position.set(0,.21+k*.076,.14);uniformDetails.add(toggle);}
    for(const x of [-.027,.027]){const collar=mesh(new THREE.BoxGeometry(.055,.055,.012),0xd5cab8);collar.position.set(x,.55,.08);collar.rotation.z=x>0?-.25:.25;uniformDetails.add(collar);}
    const connectors={};for(const name of ['lShoulder','rShoulder','lElbow','rElbow','lKnee','rKnee']){const isLeg=name.includes('Knee'),o=mesh(new THREE.SphereGeometry(isLeg?.065:name.includes('Shoulder')?.071:.048,24,16),isLeg?0x223747:0xe5ded0);connectors[name]=o;s.scene.add(o);}
    const rig=links.map(([name])=>{const o=mesh(new THREE.CylinderGeometry(.009,.009,1,12),name[0]==='l'?0x79dfca:0xffd18b);s.scene.add(o);return o;});
    s.scene.add(head);
    const hands={l:H.createHand('l'),r:H.createHand('r')},feet={},wristRings={},arrows={},labels={};
    for(const side of ['l','r']){
      s.scene.add(hands[side].group);feet[side]=mesh(new THREE.SphereGeometry(1,24,14),0x273b4c);feet[side].scale.set(.062,.046,.136);s.scene.add(feet[side]);
      wristRings[side]=mesh(new THREE.TorusGeometry(.029,.005,6,24),side==='l'?0x79dfca:0xffd18b);s.scene.add(wristRings[side]);
      arrows[side]=new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(),.17,0xf0c7a5,.025,.012);s.scene.add(arrows[side]);
      labels[side]=label(side==='l'?'左掌':'右掌',side==='l'?'#79dfca':'#ffd18b');s.scene.add(labels[side]);
    }
    const floor=mesh(new THREE.CircleGeometry(1.7,64),0x182c3c);floor.rotation.x=-Math.PI/2;floor.position.y=-.005;s.scene.add(floor);
    const grid=new THREE.GridHelper(3.4,20,0x46687b,0x243c4c);grid.material.transparent=true;grid.material.opacity=.45;s.scene.add(grid);
    let cameraKey='',trailKey='',trails=[];
    const selectCamera=(value,j)=>{
      const angle=value.camera==='side'?Math.PI/2:value.camera==='back'?Math.PI:0;
      if(value.detail==='left'||value.detail==='right'){const side=value.detail==='left'?'l':'r',w=j[side+'Wrist'];s.setView(.55,angle+.4,.38,[w[0],w[1]+.045,w[2]+.07]);}
      else if(value.detail==='upper')s.setView(1.8,angle+.14,.08,[0,1.38,.18]);
      else s.setView(3.25,angle,.12,[0,.99,0]);
    };
    return {three:true,renderer:s.mode,zoom:s.zoom,resetCamera:()=>{cameraKey='';const p=B.pose(v.motion||l.motion,window.LabTest?.getState().time||0,fields(v));selectCamera(v,p.joints);},render:(t,v)=>{
      const name=v.motion||l.motion,p=B.pose(name,t,fields(v)),j=p.joints;
      const style=v.appearance||'uniform',skeleton=style==='skeleton';
      links.forEach(([a,b],i)=>{connect(j[a],j[b],bones[i]);connect(j[a],j[b],rig[i]);bones[i].visible=!skeleton;rig[i].visible=skeleton;bones[i].material.color.setHex(style==='plain'?0x9eacb6:i>=4?0x223747:0xe5ded0);});
      for(const [name,o] of Object.entries(connectors)){o.position.set(...j[name]);o.visible=!skeleton;o.material.color.setHex(style==='plain'?0x9eacb6:name.includes('Knee')?0x223747:0xe5ded0);}
      for(const o of [torso,hips,belt,neck,head])o.visible=!skeleton;
      torso.material.color.setHex(style==='plain'?0x9eacb6:0xe5ded0);hips.material.color.setHex(style==='plain'?0x8c9da9:0x223747);uniformDetails.visible=style==='uniform';belt.visible=style==='uniform';

      for(const key in joints){joints[key].position.set(...j[key]);joints[key].visible=v.skeleton||skeleton;}
      torso.position.set(...j.pelvis);torso.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(...j.neck).sub(new THREE.Vector3(...j.pelvis)).normalize());
      hips.position.set(...j.pelvis);belt.position.set(j.pelvis[0],j.pelvis[1]+.13,j.pelvis[2]);neck.position.set(...j.neck);head.position.set(...j.head);head.rotation.y=p.head;
      for(const side of ['l','r']){
        const state=H.handState(name,t,side,v.mirror);hands[side].update(j,state,v.mirror);
        feet[side].visible=!skeleton;feet[side].position.set(j[side+'Ankle'][0],.045,j[side+'Ankle'][2]+.06);
        wristRings[side].position.set(...j[side+'Wrist']);wristRings[side].quaternion.copy(hands[side].group.quaternion);wristRings[side].rotateX(Math.PI/2);
        const hand=hands[side].group,normal=new THREE.Vector3(0,0,1).applyQuaternion(hand.quaternion),origin=new THREE.Vector3(0,.05,.02).applyQuaternion(hand.quaternion).add(hand.position);
        arrows[side].position.copy(origin);arrows[side].setDirection(normal);arrows[side].visible=v.palms;
        labels[side].position.copy(origin.clone().addScaledVector(normal,.12));labels[side].visible=v.palms; const size=(v.detail==='left'||v.detail==='right')?.075:.20; labels[side].scale.set(size,size*80/256,1); arrows[side].setLength((v.detail==='left'||v.detail==='right')?.09:.14,.017,.008);
        if(v.detail==='left'||v.detail==='right'){const focus=v.detail==='left'?'l':'r';labels[side].visible=v.palms&&side===focus;}
      }
      const ck=v.camera+':'+v.detail;if(ck!==cameraKey){cameraKey=ck;selectCamera(v,j);}
      if(v.detail==='left'||v.detail==='right'){const w=j[(v.detail==='left'?'l':'r')+'Wrist'];s.target([w[0],w[1]+.045,w[2]+.07]);}
      const tk=JSON.stringify([name,fields(v)]);if(tk!==trailKey){trailKey=tk;for(const q of trails){s.scene.remove(q);q.geometry.dispose();q.material.dispose();}trails=[];for(const side of ['l','r']){const pts=[];for(let k=0;k<=120;k++)pts.push(B.pose(name,k/120,fields(v)).joints[side+'Wrist']);const q=Lab3D.line(pts,side==='l'?0x79dfca:0xffd18b);s.scene.add(q);trails.push(q);}}
      for(const q of trails){q.visible=v.trail;q.geometry.setDrawRange(0,Math.max(2,Math.floor(t*120)+1));}
      s.draw();
    },dispose:s.dispose};
  };
  function fallback(c,p,v){D.clear(c);D.text(c,'三维不可用 · 二维骨架仅用于位置检查',480,55,24,P.gold);const j=p.joints,proj=a=>[480+a[0]*230,520-a[1]*230];for(const [a,b]of links)D.line(c,[proj(j[a]),proj(j[b])],a[0]==='l'?P.teal:P.gold,10);D.line(c,[proj(j.pelvis),proj(j.chest),proj(j.neck)],'#6a93a5',44);D.ellipse(c,...proj(j.head),22,29,'#ceb094');D.text(c,'此备用图不具备三维手型验收能力',480,570,18,P.muted);}
  M.render=({ctx:c,lesson:l,values:v,time:t,view})=>{
    const name=v.motion||l.motion,p=B.pose(name,t,fields(v)),j=p.joints;
    if(!view||!view.three)fallback(c,p,v);
    if(frameKey!==name){frameKey=name;const box=document.querySelector('#pose-frames');box.innerHTML='';for(let i=0;i<p.count;i++){const b=document.createElement('button');b.textContent=i===0?'预备':i===p.count-1?'收式':'分解 '+i;b.onclick=()=>LabTest.seek(i/(p.count-1));box.append(b);}}
    document.querySelectorAll('#pose-frames button').forEach((b,i)=>b.setAttribute('aria-pressed',p.stage===i));
    const a=H.handState(name,t,'l',v.mirror),b=H.handState(name,t,'r',v.mirror);document.querySelector('#hand-state').textContent='人物左手：'+a.description+'；人物右手：'+b.description+'。掌纹、指甲和箭头一起判断朝向，不靠一个圆球猜手型。';
    return {metrics:[['人物左肘内夹角',B.angle(j.lShoulder,j.lElbow,j.lWrist).toFixed(1)+'°'],['人物右肘内夹角',B.angle(j.rShoulder,j.rElbow,j.rWrist).toFixed(1)+'°'],['人物左手',a.description]],
      hint:view&&view.three?(view.renderer==='canvas3d'?'软件三维（非 WebGL） · ':'')+'拖动旋转、滚轮缩放；“观察范围”可放大单手。箭头垂直于掌面，暖色手心、蓝灰手背。':'三维未启动；此处仅显示二维备用骨架。',clock:'动作进度 '+Math.round(t*100)+'%'};
  };
})();
