/* Hand geometry and palm orientation; original model, not a motion-capture claim. */
(function (root) {
  'use strict';
  const C = root.WorldCore || (typeof require === 'function' ? require('../../shared/core.js') : null);
  function handState(name, t, side, mirror=false) {
    if (!['l','r'].includes(side)) throw Error('Invalid hand side');
    C.clamp(t,0,1);
    let normal=[0,0,1],curl=.12,wrist=0,description='自然掌';
    if(['straight','fist','bow'].includes(name)){curl=1;normal=[side==='l'?-1:1,0,0];description='握拳 · 拇指在拳外';}
    else if(name==='tan'&&side==='l'){normal=[0,1,0];curl=.04;description='摊手 · 掌心向上';}
    else if(name==='fook'&&side==='l'){normal=[0,-1,0];curl=.55;wrist=.36;description='伏手 · 掌心向下，腕略屈';}
    else if(name==='bong'&&side==='l'){normal=[0,-.85,.35];curl=.16;description='膀手 · 肘抬高，掌面斜下';}
    else if(['raise','separate'].includes(name)){normal=[0,1,.12];curl=.05;description='托掌 · 掌面朝上';}
    else if(name==='cloud'){normal=side==='l'?[0,.2,1]:[0,.2,1];curl=.12;description='云手 · 松展掌';}
    else if(name==='push'){normal=[0,0,1];curl=.06;wrist=-.6;description='推掌 · 指尖向上';}
    else if(name==='opening'){normal=[0,-1,0];curl=.08;description='起势 · 掌心向下';}
    else{normal=[side==='l'?-1:1,0,.2];description='自然下垂';}
    if(mirror)normal[0]*=-1;
    const n=Math.hypot(...normal);normal=normal.map(v=>v/n);
    return{normal,curl,wrist,description,thumbSign:(side==='l'?1:-1)*(mirror?-1:1)};
  }
  function createHand(side) {
    const T=root.THREE,group=new T.Group();group.name='anatomical-hand-'+side;
    const skin=new T.MeshStandardMaterial({color:0xd8b093,roughness:.85}),palmMat=new T.MeshStandardMaterial({color:0xf0c7a5,roughness:.9});
    function ellipsoid(x,y,z,rx,ry,rz,mat=skin){const m=new T.Mesh(new T.SphereGeometry(1,16,12),mat);m.position.set(x,y,z);m.scale.set(rx,ry,rz);group.add(m);return m;}
    ellipsoid(0,.044,0,.044,.055,.019);
    const palm=ellipsoid(0,.046,.015,.035,.041,.006,palmMat);palm.name='palm-surface';
    const dorsal=ellipsoid(0,.046,-.016,.034,.041,.004,new T.MeshStandardMaterial({color:0x9eb6cb,roughness:.85}));dorsal.name='back-of-hand';
    // Palm creases are physical lines on the palmar surface, not screen text.
    for(const y of [.026,.055]){const q=Lab3D.line([[-.027,y,.021],[0,y-.007,.023],[.025,y,.020]],0xa77f65);group.add(q);}
    const fingers=[];
    for(let k=0;k<4;k++){
      const base=new T.Group();base.position.set((k-1.5)*.021,.080,0);group.add(base);
      const lengths=[.030,.034,.033,.026],len=lengths[k],joints=[];let parent=base;
      for(let j=0;j<3;j++){
        const hinge=new T.Group();if(j)hinge.position.y=len*(j===1?1:.7);parent.add(hinge);
        const l=len*(j===0?1:j===1?.7:.55);
        const seg=new T.Mesh(new T.CylinderGeometry(.008-j*.001,.009-j*.001,l,10),skin);seg.position.y=l/2;hinge.add(seg);
        const knuckle=new T.Mesh(new T.SphereGeometry(.009-j*.001,10,8),skin);hinge.add(knuckle);
        if(j===2){const nail=new T.Mesh(new T.SphereGeometry(1,10,8),new T.MeshStandardMaterial({color:0xf2d5c0,roughness:.6}));nail.scale.set(.005,l*.31,.0018);nail.position.set(0,l*.67,-.007);hinge.add(nail);}
        joints.push(hinge);parent=hinge;
      }
      fingers.push({base,joints});
    }
    const thumbBase=new T.Group();group.add(thumbBase);const thumbJoints=[];let parent=thumbBase;
    for(let k=0;k<2;k++){
      const joint=new T.Group();if(k)joint.position.y=.031;parent.add(joint);
      const m=new T.Mesh(new T.CylinderGeometry(.010,.012,.032,12),skin);m.position.y=.016;joint.add(m);thumbJoints.push(joint);parent=joint;
    }
    function update(joints,state,mirror){
      const w=new T.Vector3(...joints[side+'Wrist']),elbow=new T.Vector3(...joints[side+'Elbow']);
      let y=w.clone().sub(elbow).normalize(),z=new T.Vector3(...state.normal);z.addScaledVector(y,-z.dot(y));
      if(z.length()<.05){z.set(0,0,1);z.addScaledVector(y,-z.dot(y));if(z.length()<.05){z.set(1,0,0);z.addScaledVector(y,-z.dot(y));}}z.normalize();
      const x=y.clone().cross(z).normalize();z=x.clone().cross(y).normalize();
      const rotation=new T.Matrix4().makeBasis(x,y,z);group.quaternion.setFromRotationMatrix(rotation);
      group.rotateX(state.wrist);group.position.copy(w);
      fingers.forEach(({base,joints:js},i)=>{base.rotation.z=(i-1.5)*.026*(1-state.curl);js.forEach((j,k)=>{j.rotation.x=state.curl*(k===0?1.15:k===1?1.35:.85);});});
      thumbBase.position.set(state.thumbSign*.037,.028,.004);thumbBase.rotation.set(.25+state.curl*.2,0,-state.thumbSign*(.7-state.curl*.3));
      thumbJoints[0].rotation.x=.25+state.curl*.55;thumbJoints[1].rotation.x=.15+state.curl*.5;
      group.userData.palmNormal=new T.Vector3(0,0,1).applyQuaternion(group.quaternion).toArray();group.userData.handState=state;
    }
    return{group,update};
  }
  root.MartialHands={handState,createHand};if(typeof module!=='undefined')module.exports={handState};
})(typeof globalThis!=='undefined'?globalThis:this);
