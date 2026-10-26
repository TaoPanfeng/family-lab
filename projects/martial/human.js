/* Original coarse retargeter for the explicitly CC0 MakeHuman mesh.
 * Mesh fidelity is not motion accuracy. Skinning here is illustrative, not biomechanics.
 */
(function(){'use strict';const T=THREE,D=window.MartialHumanData;let active=null;
function make(scene){if(!D)return null;const g=new T.BufferGeometry(),base=new Float32Array(D.position),position=base.slice(),colors=new Float32Array(base.length),tmp=new T.Vector3(),q=new T.Quaternion();
 g.setAttribute('position',new T.BufferAttribute(position,3));g.setAttribute('color',new T.BufferAttribute(colors,3));g.setIndex(D.index);g.computeVertexNormals();
 const mat=new T.MeshStandardMaterial({vertexColors:true,roughness:.87,metalness:0,side:T.DoubleSide}),mesh=new T.Mesh(g,mat);mesh.name='licensed-continuous-human';active={g,mesh,position};mesh.frustumCulled=false;scene.add(mesh);
 const eyes=D.eyes.map(()=>{const eye=new T.Mesh(new T.SphereGeometry(.009,16,12),new T.MeshStandardMaterial({color:0xe7e4d6,roughness:.6})),iris=new T.Mesh(new T.SphereGeometry(.0047,12,10),new T.MeshStandardMaterial({color:0x384546}));iris.position.z=.008;eye.add(iris);scene.add(eye);return eye;});
 const rest=D.segments.map(([a,b])=>{const A=new T.Vector3(...D.joints[a]),B=new T.Vector3(...D.joints[b]),direction=B.sub(A);return{a:A,dir:direction.clone().normalize(),len:direction.length()};});
 let lastStyle='',lastMirror=null;
 const reversed=D.index.slice();for(let i=0;i<reversed.length;i+=3)[reversed[i+1],reversed[i+2]]=[reversed[i+2],reversed[i+1]];
 const belt=new T.Mesh(new T.CylinderGeometry(.174,.17,.065,48,1,true),new T.MeshStandardMaterial({color:0x233d51,roughness:.9,side:T.DoubleSide}));belt.scale.z=.75;scene.add(belt);
 const buttons=Array.from({length:4},()=>{const b=new T.Mesh(new T.CapsuleGeometry(.004,.025,3,8),new T.MeshStandardMaterial({color:0x43535b}));b.rotation.z=Math.PI/2;scene.add(b);return b;});const uniforms=[new T.Color(0xd8d4bd),new T.Color(0x243c4e),new T.Color(0xc5a68e)],plain=[new T.Color(0x9fb1bc),new T.Color(0x718997),new T.Color(0xb5b2a7)];
 function render(j,style,headYaw=0,mirror=false){mesh.visible=style!=='skeleton';eyes.forEach(e=>e.visible=mesh.visible);belt.visible=style==='uniform';buttons.forEach(b=>b.visible=style==='uniform');if(!mesh.visible)return;
 if(mirror)j=Object.fromEntries(Object.entries(j).map(([k,v])=>[k,[-v[0],v[1],v[2]]]));
 if(lastMirror!==mirror){lastMirror=mirror;g.setIndex(mirror?reversed:D.index);}
 const pelvis=new T.Vector3(...j.pelvis),neck=new T.Vector3(...j.neck),head=new T.Vector3(...j.head),up=neck.clone().sub(pelvis).normalize();
 const target={...j,headTop:head.clone().addScaledVector(up,.143).toArray()};for(const side of ['l','r'])target[side+'Foot']=[j[side+'Ankle'][0],j[side+'Ankle'][1]-.065,j[side+'Ankle'][2]+.12];
 const transforms=rest.map((r,k)=>{const[a,b]=D.segments[k],A=new T.Vector3(...target[a]),v=new T.Vector3(...target[b]).sub(A),len=v.length(),rot=new T.Quaternion().setFromUnitVectors(r.dir,v.normalize());
  // Torso must face the same direction as shoulders, not just match its long axis.
  if(k===0||k===1||k===2){const right=new T.Vector3(...j.lShoulder).sub(new T.Vector3(...j.rShoulder)).normalize(),forward=right.clone().cross(up).normalize(),actualRight=up.clone().cross(forward).normalize();rot.setFromRotationMatrix(new T.Matrix4().makeBasis(actualRight,up,forward));if(k===2)rot.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),headYaw));}
  return{a:A,rot,ratio:len/r.len};});
 const transform=(x,y,z,k,out)=>{const r=rest[k],tr=transforms[k];out.set(x-r.a.x,y-r.a.y,z-r.a.z);const along=out.dot(r.dir);out.addScaledVector(r.dir,along*(tr.ratio-1));out.applyQuaternion(tr.rot).add(tr.a);if(mirror)out.x*=-1;return out;};
 for(let i=0;i<base.length/3;i++){let x=0,y=0,z=0;for(let a=0;a<4;a++){const k=D.weights[i*8+a*2],w=D.weights[i*8+a*2+1];if(!w)continue;transform(base[i*3],base[i*3+1],base[i*3+2],k,tmp);x+=tmp.x*w;y+=tmp.y*w;z+=tmp.z*w;}position[i*3]=x;position[i*3+1]=y;position[i*3+2]=z;}
 if(lastStyle!==style){lastStyle=style;const palette=style==='plain'?plain:uniforms;for(let i=0;i<D.zone.length;i++){const c=palette[D.zone[i]];colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;}g.attributes.color.needsUpdate=true;}
 for(let i=0;i<eyes.length;i++){const e=D.eyes[i];transform(...e,2,tmp);eyes[i].position.copy(tmp);eyes[i].quaternion.copy(transforms[2].rot);}
 transform(0,.075,0,0,tmp);belt.position.copy(tmp);belt.quaternion.copy(transforms[0].rot);
 for(let i=0;i<buttons.length;i++){transform(0,.20+i*.085,.159,0,tmp);buttons[i].position.copy(tmp);buttons[i].quaternion.copy(transforms[0].rot);buttons[i].rotateZ(Math.PI/2);}
 g.attributes.position.needsUpdate=true;g.computeVertexNormals();mesh.userData.vertexCount=base.length/3;mesh.userData.source='CC0 MakeHuman';
 }
 return{mesh,render};}
window.MartialHuman={make,inspect:()=>active?{vertices:active.g.attributes.position.count,triangles:active.g.index.count/3,visible:active.mesh.visible,finite:active.position.every(Number.isFinite),sample:Array.from(active.position.filter((_,i)=>Math.floor(i/3)%53===0))}:null};})();
