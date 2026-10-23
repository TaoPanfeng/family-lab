/* Exact constants for light time; deliberately schematic, seeded 3D large-scale morphology. */
(function(root){'use strict';const C=root.WorldCore||(typeof require==='function'?require('../../shared/core.js'):null),TAU=2*Math.PI;
 const distances={moon:{from:'地球',to:'月球',km:384400},sun:{from:'太阳',to:'地球',km:149597870.7},proxima:{from:'太阳',to:'比邻星',km:4.24*9460730472580.8}};
 function light(destination,t){if(!distances[destination])throw Error('Unknown light destination');if(!Number.isFinite(t))throw Error('Invalid time');const p=C.clamp(t,0,1),d=distances[destination],total=d.km/299792.458;return{...d,total,elapsed:total*p,remaining:total*(1-p),travelled:d.km*p,arrived:p===1};}
 function format(seconds){if(seconds>=31557600)return(seconds/31557600).toFixed(3)+' 年';if(seconds>=86400)return(seconds/86400).toFixed(2)+' 天';if(seconds>=3600)return(seconds/3600).toFixed(2)+' 小时';if(seconds>=60)return Math.floor(seconds/60)+'分 '+(seconds%60).toFixed(1).padStart(4,'0')+'秒';return seconds.toFixed(2)+' 秒';}
 const widths=[12742/9460730472580.8,384400/9460730472580.8,60*149597870.7/9460730472580.8,12,1e5,1e7,1.1e8,5.2e8,9.3e10];
 function morphology(level){const random=C.rng(8301+level*7919),points=[],lines=[],markers=[];const add=(p,warm=false)=>points.push({p,color:warm?[1,.76,.44]:[.52+random()*.3,.7+random()*.2,1]});
  if(level===7){
   const attractor=[.8,-.08,0];for(let branch=0;branch<30;branch++){
    const angle=branch/30*TAU,start=[2.9*Math.cos(angle),1.15*Math.sin(angle),1.4*Math.sin(angle*3+.4)],path=[];
    for(let j=0;j<=90;j++){const u=j/90,v=1-u,p=[attractor[0]+v*(start[0]-attractor[0]),attractor[1]+v*(start[1]-attractor[1])+.45*Math.sin(u*Math.PI)*Math.cos(angle),v*start[2]+.7*Math.sin(u*Math.PI)*Math.sin(angle)];path.push(p);for(let q=0;q<2;q++)add(p.map(x=>x+(random()-.5)*.045),true);}lines.push(path);
   }
   markers.push({name:'银河系所在邻域（示意）',p:[-1.75,.25,.12],color:0x79dfca},{name:'速度流域汇聚区（示意）',p:attractor,color:0xffd18b});
  }else if(level===8){
   const nodes=[];for(let i=0;i<55;i++){const radius=Math.cbrt(random())*2.65,a=random()*TAU,z=random()*2-1;nodes.push([radius*Math.sqrt(1-z*z)*Math.cos(a),radius*z,radius*Math.sqrt(1-z*z)*Math.sin(a)]);}
   const edges=new Set();for(let i=0;i<nodes.length;i++){
    const neighbors=nodes.map((p,j)=>({j,d:j===i?Infinity:Math.hypot(...p.map((v,k)=>v-nodes[i][k]))})).sort((a,b)=>a.d-b.d).slice(0,3);
    for(const {j}of neighbors){const key=[i,j].sort((a,b)=>a-b).join(':');if(edges.has(key))continue;edges.add(key);const a=nodes[i],b=nodes[j],line=[];for(let n=0;n<=40;n++){const u=n/40,p=a.map((v,k)=>v+(b[k]-v)*u);line.push(p);for(let q=0;q<2;q++)add(p.map(x=>x+(random()-.5)*.065));}lines.push(line);}
    for(let j=0;j<22;j++)add(nodes[i].map(x=>x+(random()-.5)*.13));
   }
   markers.push({name:'我们的位置：观测中心，不是宇宙中心',p:[0,0,0],color:0xffd18b});
  }else{
   const n=level===6?2000:level===4?2800:600;
   for(let i=0;i<n;i++){const radius=Math.sqrt(random())*2.6,a=random()*TAU;
    if(level===4){const arm=i%4*TAU/4+radius*1.8+(random()-.5)*.5;add([radius*Math.cos(arm),(random()-.5)*.15,radius*Math.sin(arm)],i%5===0);}
    else if(level===6){const r=radius*.48;add([1+r*Math.cos(a),(random()-.5)*1.3,r*Math.sin(a)]);}
    else add([radius*Math.cos(a),(random()-.5)*2,radius*Math.sin(a)]);
   }
   if(level===6)markers.push({name:'本星系群：在星系团外',p:[-2.2,0,0],color:0xffd18b},{name:'室女座星系团',p:[1,0,0],color:0x79dfca});
  }
  return{points,lines,markers,width:widths[level],kind:level===7?'velocity-basin':level===8?'observable-volume':level===6?'neighboring-cluster':'schematic'};
 }
 const api={light,format,widths,morphology};root.CosmosProcess=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
