/* Canvas 2D rendering fallback for small instructional meshes.
 * It renders the same joints/triangles without WebGL. It is NOT a WebGL test substitute.
 */
(function () {
  'use strict';
  const T=window.THREE;
  window.LabCanvas3D=function(){
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');let width=1,height=1,pixel=1,background='#0b1424';
    function render(scene,camera){
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
      const vp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),commands=[];
      scene.traverseVisible(obj=>{
        if(obj.isSprite){const w=new T.Vector3().setFromMatrixPosition(obj.matrixWorld),p=w.clone().project(camera);if(p.z<-1||p.z>1)return;const distance=camera.position.distanceTo(w),h=height*obj.scale.y/(2*Math.tan(camera.fov*Math.PI/360)*distance),image=obj.material.map?.image;if(image)commands.push({z:-1e5,kind:'sprite',image,x:(p.x+1)*width/2,y:(1-p.y)*height/2,w:h*image.width/image.height,h});return;}
        const geo=obj.geometry,mat=obj.material;if(!geo||!mat||Array.isArray(mat)||!geo.attributes.position)return;
        const attr=geo.attributes.position,index=geo.index,transform=new T.Matrix4().multiplyMatrices(vp,obj.matrixWorld),vertices=[];
        for(let k=0;k<attr.count;k++){const v=new T.Vector3().fromBufferAttribute(attr,k).applyMatrix4(transform);vertices.push([(v.x+1)*width/2,(1-v.y)*height/2,v.z]);}
        const rgb=mat.color||new T.Color(0xffffff),alpha=mat.opacity??1;
        if(obj.isMesh){
          const total=index?index.count:attr.count,start=geo.drawRange.start||0,end=Math.min(total,start+geo.drawRange.count);
          const normalMatrix=new T.Matrix3().getNormalMatrix(obj.matrixWorld),a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
          for(let k=start;k+2<end;k+=3){const ids=[0,1,2].map(j=>index?index.getX(k+j):k+j),p=ids.map(i=>vertices[i]);
            if(p.some(v=>!Number.isFinite(v[0]+v[1]+v[2])||v[2]<-1||v[2]>1))continue;
            if(p.every(v=>v[0]<0)||p.every(v=>v[0]>width)||p.every(v=>v[1]<0)||p.every(v=>v[1]>height))continue;
            const area=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[1][1]-p[0][1])*(p[2][0]-p[0][0]);if(mat.side!==T.DoubleSide&&area>0)continue;
            a.fromBufferAttribute(attr,ids[0]);b.fromBufferAttribute(attr,ids[1]).sub(a);c.fromBufferAttribute(attr,ids[2]).sub(a);
            let n=b.cross(c).normalize();if(geo.attributes.normal){n.set(0,0,0);for(const id of ids)n.add(new T.Vector3().fromBufferAttribute(geo.attributes.normal,id));n.normalize();}n.applyMatrix3(normalMatrix).normalize();const shade=mat.isMeshBasicMaterial?1:.53+.45*Math.max(0,n.dot(new T.Vector3(.3,.65,.7).normalize()));
            const color=`rgb(${Math.round(rgb.r*255*shade)},${Math.round(rgb.g*255*shade)},${Math.round(rgb.b*255*shade)})`;
            commands.push({z:p.reduce((s,v)=>s+v[2],0)/3-(obj.renderOrder||0)*10,kind:'triangle',p,color,alpha});
          }
        }else if(obj.isLine){const end=Math.min(index?index.count:attr.count,geo.drawRange.start+geo.drawRange.count),start=geo.drawRange.start||0,step=obj.isLineSegments?2:1;
          for(let k=start;k+1<end;k+=step){const p=[vertices[index?index.getX(k):k],vertices[index?index.getX(k+1):k+1]];if(p.some(v=>v[2]<-1||v[2]>1))continue;commands.push({z:(p[0][2]+p[1][2])/2,kind:'line',p,color:'#'+rgb.getHexString(),alpha});}
        }
      });
      commands.sort((a,b)=>b.z-a.z);ctx.setTransform(pixel,0,0,pixel,0,0);ctx.globalAlpha=1;ctx.fillStyle=background;ctx.fillRect(0,0,width,height);
      for(const cmd of commands){ctx.globalAlpha=cmd.alpha??1;if(cmd.kind==='sprite'){ctx.drawImage(cmd.image,cmd.x-cmd.w/2,cmd.y-cmd.h/2,cmd.w,cmd.h);continue;}ctx.beginPath();cmd.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(cmd.kind==='triangle'){ctx.closePath();ctx.fillStyle=cmd.color;ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle=cmd.color;ctx.stroke();}else{ctx.strokeStyle=cmd.color;ctx.lineWidth=1;ctx.stroke();}}
      ctx.globalAlpha=1;
    }
    return{domElement:canvas,isSoftware:true,setPixelRatio:p=>pixel=p,setClearColor:hex=>background='#'+new T.Color(hex).getHexString(),setSize:(w,h)=>{width=w;height=h;canvas.width=Math.round(w*pixel);canvas.height=Math.round(h*pixel);},render,dispose:()=>{},forceContextLoss:()=>{}};
  };
})();
