/* 纯计算模块：无 DOM、无随机数。所有结果由参数和模拟时间唯一决定。 */
(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./catalog.js'):root.LabCatalog;
const G0=9.80665, R=287.05287, P0=101325;
const fluids={water:{name:'水',rho:1000,color:'#46c5c2'},oil:{name:'示例油',rho:800,color:'#e7bd65'},mercury:{name:'水银 · 仅模拟',rho:13600,color:'#c6cfdc'}};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const clone=x=>JSON.parse(JSON.stringify(x));
function defaults(id){const l=C.byId[id];if(!l)throw Error('未知实验');return Object.fromEntries(l.params.map(p=>[p.key,p.value]));}
function parameters(id,raw={},strict=false){
 const l=C.byId[id];if(!l||!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('参数格式无效');
 const out={};for(const p of l.params){let v=Object.prototype.hasOwnProperty.call(raw,p.key)?raw[p.key]:p.value;
  if(p.type==='select'){const hit=p.options.find(o=>String(o[0])===String(v));if(!hit){if(strict)throw Error('选项无效：'+p.label);v=p.value;}else v=hit[0];}
  else{if(typeof v!=='number'||!Number.isFinite(v)){if(strict)throw Error('数值无效：'+p.label);v=p.value;}if(strict&&(v<p.min||v>p.max))throw Error('超出范围：'+p.label);v=clamp(v,p.min,p.max);}
  out[p.key]=v;
 }return out;
}
function atmosphere(h){
 if(!Number.isFinite(h)||h<0||h>9000)throw Error('海拔必须在 0–9000 m');
 const T=288.15-.0065*h, p=P0*Math.pow(T/288.15,G0/(R*.0065));
 return {p,T,rho:p/(R*T)};
}
// IAPWS SR1-86(1992), Eq.1. Input Celsius; output Pa. No extrapolation.
function saturation(tc){
 const T=tc+273.15,Tc=647.096;
 if(!Number.isFinite(tc)||T<273.16-1e-9||T>Tc)throw Error('饱和压公式仅限三相点至临界点');
 const tau=Math.max(0,1-T/Tc),a=[-7.85951783,1.84408259,-11.7866497,22.6807411,-15.9618719,1.80122502],b=[1,1.5,3,3.5,4,7.5];
 return 22.064e6*Math.exp(Tc/T*a.reduce((s,v,i)=>s+v*Math.pow(tau,b[i]),0));
}
function boilingPoint(pressure){
 if(!Number.isFinite(pressure)||pressure<saturation(.01)||pressure>22.064e6)throw Error('不在液水饱和范围内');
 let lo=.01,hi=373.946;for(let i=0;i<64;i++){const mid=(lo+hi)/2;if(saturation(mid)<pressure)lo=mid;else hi=mid;}return (lo+hi)/2;
}
// Stable analytic solution for m dv/dt=mg-cv² from rest, ignoring air buoyancy.
const logCosh=x=>Math.abs(x)+Math.log1p(Math.exp(-2*Math.abs(x)))-Math.LN2;
const acoshExp=x=>x>20?x+Math.LN2:Math.acosh(Math.exp(x));
function fallTime(h,m,g,c=0){return c<=0?Math.sqrt(2*h/g):Math.sqrt(m/(g*c))*acoshExp(c*h/m);}
function falling(h,m,g,c,t){const hit=fallTime(h,m,g,c),u=clamp(t,0,hit),k=c>0?Math.sqrt(g*c/m):0;return {hit,y:c>0?Math.min(h,m/c*logCosh(k*u)):Math.min(h,.5*g*u*u),v:c>0?Math.sqrt(m*g/c)*Math.tanh(k*u):g*u,done:t>=hit};}
function duration(id,p){switch(id){case 'speed':case 'acceleration':case 'force':case 'work':case 'circuit':return p.duration;case 'fall':return Math.max(fallTime(p.height,p.massA,p.g,p.drag==='none'?0:p.c),fallTime(p.height,p.massB,p.g,p.drag==='none'?0:p.c))*1.04;case 'jet':{if(p.tank==='fixed')return Math.sqrt(2*p.height/p.g)*1.4;const area=Math.PI*(p.diameter/2000)**2,cd=p.loss==='ideal'?1:.97*.64;return Math.min(86400,p.tankArea*Math.sqrt(2*p.height/p.g)/(cd*area));}case 'spring':return 4*2*Math.PI*Math.sqrt(p.mass/p.k);case 'pendulum':return 4*2*Math.PI*Math.sqrt(p.length/p.g);case 'pulley':return 6;default:return 10;}}
function solve(id,input={},time=0){
 const p=parameters(id,input),t=clamp(Number.isFinite(time)?time:0,0,duration(id,p));
 let o={};switch(id){
 case 'speed':{const v=p.distance/p.duration;o={velocity:v,distance:p.distance,duration:p.duration,kmh:3.6*v,x:v*t,v};break;}
 case 'acceleration':{const T=p.duration;o={a:p.a,vEnd:p.v0+p.a*T,dx:p.v0*T+.5*p.a*T*T,dv:p.a*T,x:p.v0*t+.5*p.a*t*t,v:p.v0+p.a*t};break;}
 case 'force':{const friction=Math.min(p.force,p.mu*p.mass*p.g),net=p.force-friction,a=net/p.mass;o={a,net,friction,vEnd:a*p.duration,x:.5*a*t*t,v:a*t,dx:.5*a*p.duration**2};break;}
 case 'work':{const parallel=p.force*Math.cos(p.angle*Math.PI/180),work=Math.abs(parallel)<1e-10?0:parallel*p.distance;o={parallel:Math.abs(parallel)<1e-10?0:parallel,work,power:work/p.duration,distance:p.distance,x:p.distance*t/p.duration,liveWork:work*t/p.duration};break;}
 case 'fall':{const c=p.drag==='none'?0:p.c,A=falling(p.height,p.massA,p.g,c,t),B=falling(p.height,p.massB,p.g,c,t);o={impactA:falling(p.height,p.massA,p.g,c,1e9).v,impactB:falling(p.height,p.massB,p.g,c,1e9).v,timeA:A.hit,timeB:B.hit,A,B,potentialA:p.massA*p.g*(p.height-A.y),kineticA:.5*p.massA*A.v*A.v,initialEnergy:p.massA*p.g*p.height};o.lostEnergy=Math.max(0,o.initialEnergy-o.potentialA-o.kineticA);break;}
 case 'jet':{const A=Math.PI*(p.diameter/2000)**2,Cv=p.loss==='ideal'?1:.97,Cc=p.loss==='ideal'?1:.64,Cd=Cv*Cc,k=Cd*A*Math.sqrt(2*p.g)/(2*p.tankArea),head=p.tank==='drain'?Math.max(0,Math.sqrt(p.height)-k*t)**2:p.height;const speed=Cv*Math.sqrt(2*p.g*head),flow=Cc*A*speed*1000,ball=falling(p.height,p.mass,p.g,0,t);o={speed,flow,head,impact:Math.sqrt(2*p.g*p.height),ball,ideal:Math.sqrt(2*p.g*head),area:A,Cv,Cc,Cd,density:fluids[p.fluid].rho,gauge:fluids[p.fluid].rho*p.g*head/1000,drained:(p.height-head)*p.tankArea*1000,emptyTime:Math.sqrt(p.height)/k,jetArea:Cc*A};break;}
 case 'pressure':{const rho=fluids[p.fluid].rho,gauge=rho*p.g*p.depth/1000;o={density:rho,gauge,absolute:p.ambient+gauge,force:gauge*1000*p.area/10000};break;}
 case 'atmosphere':{const a=atmosphere(p.altitude);o={pressure:a.p/1000,relative:a.p/P0*100,density:a.rho,temperature:a.T-273.15,oneSideForce:a.p*p.area/10000};break;}
 case 'boiling':{const a=atmosphere(p.altitude),v=saturation(p.temperature),need=a.p+1000*G0*p.depth/100+.12/(p.radius/1000);o={boil:boilingPoint(a.p),pressure:a.p/1000,vapor:v/1000,bubbleNeed:need/1000,surfaceBoils:v>=a.p,bubbleGrows:v>=need,bubbleBoil:boilingPoint(need)};break;}
 case 'barometer':{const a=atmosphere(p.altitude),pv=p.fluid==='water'&&p.vapor==='include'?saturation(20):0,top=Math.min(a.p,a.p*p.airFraction/100+pv),delta=a.p-top;o={column:delta/(fluids[p.fluid].rho*G0),pressure:a.p/1000,topPressure:top/1000,delta:delta/1000,density:fluids[p.fluid].rho};break;}
 case 'buoyancy':{const vol=p.volume/1000,density=p.mass/vol,rho=fluids[p.fluid].rho,maxBuoyancy=rho*p.g*vol,weight=p.mass*p.g;o={density,maxBuoyancy,weight,submerged:density/rho*100,floating:density<rho-1e-7,neutral:Math.abs(density-rho)<1e-7,fraction:Math.min(1,density/rho),actualBuoyancy:Math.min(weight,maxBuoyancy)};break;}
 case 'lever':{const left=p.massLeft*p.g*p.armLeft,right=p.massRight*p.g*p.armRight;o={torqueLeft:left,torqueRight:right,balanceMass:p.massRight*p.armRight/p.armLeft,netTorque:right-left,balance:Math.abs(left-right)<1e-7};break;}
 case 'pulley':{const n=Number(p.strands),eta=p.efficiency/100,pull=p.mass*p.g/(n*eta),ropeDistance=n*p.height,usefulWork=p.mass*p.g*p.height;o={pull,ropeDistance,inputWork:usefulWork/eta,usefulWork,rise:p.height*t/6,ropeTravel:n*p.height*t/6,loss:usefulWork/eta-usefulWork,n};break;}
 case 'spring':{const omega=Math.sqrt(p.k/p.mass),x=p.amplitude*Math.cos(omega*t),v=-p.amplitude*omega*Math.sin(omega*t);o={maxForce:p.k*p.amplitude,energy:.5*p.k*p.amplitude**2,period:2*Math.PI/omega,vmax:p.amplitude*omega,x,v,force:-p.k*x,elastic:.5*p.k*x*x,kinetic:.5*p.mass*v*v};break;}
 case 'pendulum':{const theta0=p.angle*Math.PI/180,omega=Math.sqrt(p.g/p.length),theta=theta0*Math.cos(omega*t),v=-p.length*theta0*omega*Math.sin(omega*t);o={period:2*Math.PI/omega,frequency:omega/(2*Math.PI),energy:.5*p.mass*p.g*p.length*theta0**2,vmax:p.length*theta0*omega,theta,v,potential:.5*p.mass*p.g*p.length*theta**2,kinetic:.5*p.mass*v*v};break;}
 case 'circuit':{const equivalent=p.connection==='series'?p.r1+p.r2:p.r1*p.r2/(p.r1+p.r2),current=p.closed==='yes'?p.voltage/equivalent:0,power=p.voltage*current;o={equivalent,current,power,energy:power*p.duration,liveEnergy:power*t,i1:p.connection==='series'?current:p.closed==='yes'?p.voltage/p.r1:0,i2:p.connection==='series'?current:p.closed==='yes'?p.voltage/p.r2:0};break;}
 default:throw Error('没有该实验的计算模型');
 }
 return {...o,t,duration:duration(id,p)};
}
function scan(id,input,xkey,ykey,count=61){const p=parameters(id,input),def=C.byId[id].params.find(q=>q.key===xkey&&q.type==='number');if(!def)throw Error('只能扫描连续数值参数');if(!C.byId[id].metrics.some(m=>m.key===ykey))throw Error('未知纵轴');const n=Number.isFinite(count)?clamp(Math.round(count),2,501):61;return Array.from({length:n},(_,i)=>{const x=def.min+(def.max-def.min)*i/(n-1),q={...p,[xkey]:x};return {x,y:solve(id,q,0)[ykey]};});}
function validateScene(s){if(!s||typeof s!=='object'||!C.byId[s.lab])throw Error('实验记录无法识别');const params=parameters(s.lab,s.params,true);if(typeof s.time!=='number'||!Number.isFinite(s.time)||s.time<0||s.time>86400*2)throw Error('时间无效');const baseline=s.baseline?parameters(s.lab,s.baseline,true):null,compare=!!s.compare&&!!baseline,limit=Math.max(duration(s.lab,params),compare?duration(s.lab,baseline):0);return {lab:s.lab,params,time:Math.min(s.time,limit),baseline,compare,mode:['research','child','family'].includes(s.mode)?s.mode:'family'};}
function validateBackup(raw){
 if(!raw||raw.app!=='guanwu-physics'||raw.version!==1||!Array.isArray(raw.notes)||raw.notes.length>100)throw Error('备份格式、版本或数量无效');
 const ids=new Set();const notes=raw.notes.map(n=>{if(!n||typeof n!=='object'||typeof n.id!=='string'||n.id.length>120||ids.has(n.id))throw Error('记录编号无效或重复');ids.add(n.id);
  for(const k of ['title','guess','discovery','question','created'])if(typeof n[k]!=='string'||n[k].length>(k==='title'?120:k==='created'?60:2000))throw Error('记录文字无效或过长');
  if(!Number.isFinite(Date.parse(n.created)))throw Error('记录日期无效');
  return {id:n.id,title:n.title,guess:n.guess,discovery:n.discovery,question:n.question,created:n.created,scene:validateScene(n.scene)};
 });return {app:'guanwu-physics',version:1,notes};
}
function mergeNotes(existing,incoming){const map=new Map(existing.map(n=>[n.id,n]));for(const n of incoming)if(!map.has(n.id))map.set(n.id,n);if(map.size>100)throw Error('合并后超过 100 条，请先整理记录');return [...map.values()];}
function fmt(value,digits=2){if(!Number.isFinite(value))return '—';if(Math.abs(value)<1e-10)value=0;return value.toLocaleString('zh-CN',{minimumFractionDigits:digits,maximumFractionDigits:digits});}
const out={G0,P0,fluids,defaults,parameters,solve,duration,atmosphere,saturation,boilingPoint,falling,fallTime,scan,validateScene,validateBackup,mergeNotes,fmt,clamp,clone};
if(typeof module!=='undefined'&&module.exports)module.exports=out;root.Physics=out;
})(typeof globalThis!=='undefined'?globalThis:this);
