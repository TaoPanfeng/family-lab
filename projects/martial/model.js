/* Original procedural choreography: fixed-length segments, smooth keyframe interpolation.
 * This is not captured expert motion and does not estimate force, stress or clinical safety. */
(function(root){'use strict';const C=root.WorldCore||(typeof require==='function'?require('../../shared/core.js'):null);
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(x=>x*s),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.hypot(...a),unit=a=>mul(a,1/(norm(a)||1));
function solve(root,target,upper,lower,hint){let delta=sub(target,root),d=norm(delta);if(d<1e-8)delta=[0,-1e-5,0];d=C.clamp(norm(delta),Math.abs(upper-lower)+1e-5,upper+lower-1e-5);const u=unit(delta),end=add(root,mul(u,d));let n=sub(sub(hint,root),mul(u,dot(sub(hint,root),u)));if(norm(n)<1e-6)n=sub([0,0,1],mul(u,u[2]));if(norm(n)<1e-6)n=sub([1,0,0],mul(u,u[0]));n=unit(n);const a=(upper*upper-lower*lower+d*d)/(2*d),h=Math.sqrt(Math.max(0,upper*upper-a*a));return{joint:add(add(root,mul(u,a)),mul(n,h)),end};}
const neutral={left:[.26,-.02,.10],right:[-.26,-.02,.10],sway:0,turn:0,bend:0,lower:0,head:0};
const f=(left,right,extra={})=>({...neutral,left,right,...extra});
const frames={
 stand:[neutral,f([.25,.10,.22],[-.25,.1,.22],{lower:.06}),neutral],
 raise:[neutral,f([.12,.35,.22],[-.12,.35,.22],{lower:.04}),f([.12,1.03,.02],[-.12,1.03,.02]),f([.55,.5,.05],[-.55,.5,.05]),neutral],
 bow:[neutral,f([.1,.4,.28],[-.1,.4,.28],{lower:.08}),f([.73,.5,.05],[-.12,.5,.08],{lower:.12,turn:.15}),f([.1,.4,.28],[-.1,.4,.28],{lower:.08}),f([.12,.5,.08],[-.73,.5,.05],{lower:.12,turn:-.15}),neutral],
 separate:[neutral,f([.12,.35,.20],[-.12,.35,.20]),f([.12,1.03,.03],[-.28,-.08,.05]),f([.12,.35,.20],[-.12,.35,.20]),f([.28,-.08,.05],[-.12,1.03,.03]),neutral],
 look:[neutral,f([.28,0,0],[-.28,0,0],{head:.65}),neutral,f([.28,0,0],[-.28,0,0],{head:-.65}),neutral],
 sway:[neutral,f([.27,-.07,.25],[-.27,-.07,.25],{lower:.12,bend:.22,sway:.12,turn:.2}),f([.27,-.07,.25],[-.27,-.07,.25],{lower:.12,bend:.22,sway:-.12,turn:-.2}),neutral],
 bend:[neutral,f([.18,.7,.1],[-.18,.7,.1]),f([.22,-.32,.22],[-.22,-.32,.22],{bend:.48,lower:.05}),f([.22,.2,.18],[-.22,.2,.18],{bend:.18}),neutral],
 fist:[neutral,f([.21,.15,.03],[-.21,.15,.03],{lower:.12}),f([.06,.42,.65],[-.21,.15,.03],{lower:.12,turn:-.1}),f([.21,.15,.03],[-.21,.15,.03],{lower:.12}),f([.21,.15,.03],[-.06,.42,.65],{lower:.12,turn:.1}),neutral],
 heel:[neutral,f([.25,.02,.1],[-.25,.02,.1],{lower:-.025}),neutral,f([.25,.02,.1],[-.25,.02,.1],{lower:-.025}),neutral],
 opening:[neutral,f([.23,.44,.5],[-.23,.44,.5]),f([.23,.30,.40],[-.23,.30,.40],{lower:.08}),neutral],
 cloud:[f([.30,.5,.32],[-.2,.15,.4],{sway:.1,turn:.25,lower:.06}),f([-.2,.5,.35],[-.35,.3,.32],{sway:-.1,turn:-.2,lower:.06}),f([.2,.15,.4],[-.3,.5,.32],{sway:-.1,turn:-.25,lower:.06}),f([.35,.3,.32],[.2,.5,.35],{sway:.1,turn:.2,lower:.06}),f([.30,.5,.32],[-.2,.15,.4],{sway:.1,turn:.25,lower:.06})],
 push:[f([.2,.4,.25],[-.2,.4,.25],{lower:.08}),f([.2,.42,.65],[-.2,.42,.65],{lower:.05}),f([.2,.4,.25],[-.2,.4,.25],{lower:.08})],
 tan:[f([.12,.22,.1],[-.22,.15,.05]),f([.08,.4,.54],[-.22,.15,.05]),f([.12,.22,.1],[-.22,.15,.05])],
 fook:[f([.08,.4,.52],[-.22,.15,.05]),f([.06,.29,.5],[-.22,.15,.05]),f([.08,.4,.52],[-.22,.15,.05])],
 bong:[f([.1,.35,.4],[-.22,.15,.05]),f([.03,.42,.5],[-.22,.15,.05]),f([.1,.35,.4],[-.22,.15,.05])],
 straight:[f([.17,.36,.22],[-.17,.36,.22]),f([.08,.48,.70],[-.17,.36,.22],{turn:-.14}),f([.17,.36,.22],[-.17,.36,.22]),f([.17,.36,.22],[-.08,.48,.70],{turn:.14}),f([.17,.36,.22],[-.17,.36,.22])]
};
// Labels describe this model's anchors, not a complete traditional routine.
const teaching={
 stand:{labels:['直立参考','轻微下移','回到起点'],observe:'看骨盆上下移动时膝、髋怎样配合。骨盆的位置不能当作全身重心。'},
 raise:{labels:['自然垂手','双手向前','向上托举','向侧展开','回到起点'],observe:'先比较身前、头上、身体两侧三个位置。本简图未还原十指交叉和完整翻掌。'},
 bow:{labels:['垂手参考','双手胸前','左侧展开','回到胸前','右侧展开','回到起点'],observe:'左右按人物自己的方向读，正面看时与屏幕相反。这里只比较左右展开，未还原八字掌和拉弓爪。'},
 separate:{labels:['垂手参考','双手胸前','左上右下','回到胸前','右上左下','回到起点'],observe:'一只手往上托，另一只往下按。对照手心箭头：上托掌向上，下按掌向下；两边交换后再比较。'},
 look:{labels:['面向前方','转头一侧','回到正中','转头另一侧','回到起点'],observe:'先从正面找鼻尖，再看侧面。只看转头方向，不照模型追求转动幅度。'},
 sway:{labels:['直立参考','移向一侧','移向另一侧','回到起点'],observe:'对照骨盆与肩的位置变化。本图省略完整头尾环绕，不能当作摇头摆尾的规范示范。'},
 bend:{labels:['垂手参考','双手抬起','俯身方向','逐渐回起','回到起点'],observe:'切到侧面比较躯干倾斜；此处保守幅度不到脚面，不追求摸到脚或强拉伸。'},
 fist:{labels:['垂手参考','双手收拢','左拳向前','收回胸旁','右拳向前','回到起点'],observe:'先看伸出，再看收回，比较两次左右交换。模型没有发力和传统握固细节。'},
 heel:{labels:['直立参考','骨盆上移示意','回到原位','再次上移','回到起点'],observe:'这里仅示意躯干轻微上下，脚跟未独立转动，不能作为提踵或落跟震动的跟练教程。'},
 opening:{labels:['自然垂手','双手前举','向下回落','回到起点'],observe:'从侧面看双手先向前上方，再向下回落；对照掌面箭头，不把手路当成发力路线。'},
 cloud:{labels:['双手一高一低','横向交换','高低换边','反向交换','回到循环起点'],observe:'这是一段循环，没有单独演示预备式。沿青、金两条手路看高低交换，左右始终按人物本身辨认。'},
 push:{labels:['双手收在身前','双手前推','收回原位'],observe:'切到侧面，比较肩、肘、腕的相对位置。前推距离和肘夹角都只是模型值，不表示力量大小。'},
 tan:{labels:['左手收在身前','左手向前摊出','收回原位'],observe:'选择左手近景，先找暖色手心和指甲，再比较摊出时掌面朝上。右手保留参考位置。'},
 fook:{labels:['左手在身前','左腕略屈','回到原位'],observe:'看左手近景的腕部变化，再换侧面。这里没有接触对手，不能由画面判断承压或内劲。'},
 bong:{labels:['左手在身前','左肘抬起','回到原位'],observe:'先看左肘相对手腕的位置，再看斜下掌面。本图只表达粗略方向，不给肩肘规定真人角度。'},
 straight:{labels:['双手收在身前','左拳伸出','左拳收回','右拳伸出','右拳收回'],observe:'在伸出与收回之间来回拖动，确认两拳交替。只在屏幕观察，不对人或物体打击。'}
};
function interpolate(name,t){const a=frames[name];if(!a)throw Error('Unknown motion');const f=C.clamp(t,0,1)*(a.length-1),i=Math.min(a.length-2,Math.floor(f)),u=C.smooth(f-i),out={};for(const k of Object.keys(neutral))out[k]=Array.isArray(a[i][k])?a[i][k].map((v,j)=>C.mix(v,a[i+1][k][j],u)):C.mix(a[i][k],a[i+1][k],u);return out;}
function pose(name,t,options={}){let p=interpolate(name,t);const amp=C.clamp((options.amplitude===undefined?100:options.amplitude)/100,.3,1),stance=C.clamp(options.stance===undefined?.22:options.stance,.16,.38),mirror=options.mirror?-1:1;
 for(const k of Object.keys(p))p[k]=Array.isArray(p[k])?p[k].map((x,i)=>C.mix(neutral[k][i],x,amp)):p[k]*amp;
 const pelvis=[p.sway,.92-p.lower,0],yaw=p.turn,tilt=p.bend;
 function transform(a){const b=[a[0],a[1]*Math.cos(tilt)-a[2]*Math.sin(tilt),a[1]*Math.sin(tilt)+a[2]*Math.cos(tilt)];return add(pelvis,[b[0]*Math.cos(yaw)+b[2]*Math.sin(yaw),b[1],-b[0]*Math.sin(yaw)+b[2]*Math.cos(yaw)]);}
 const j={pelvis,neck:transform([0,.62,0]),head:transform([0,.77,0]),chest:transform([0,.43,0]),lShoulder:transform([.22,.50,0]),rShoulder:transform([-.22,.50,0]),lHip:add(pelvis,[.12,0,0]),rHip:add(pelvis,[-.12,0,0])};
 for(const side of ['l','r']){const sign=side==='l'?1:-1,target=transform(side==='l'?p.left:p.right),special=name==='bong'&&side==='l';const arm=solve(j[side+'Shoulder'],target,.31,.28,transform([sign*(special?.5:.32),special?.5:.18,.14]));j[side+'Elbow']=arm.joint;j[side+'Wrist']=arm.end;const leg=solve(j[side+'Hip'],[sign*stance,.07,0],.43,.43,[sign*stance,.45,.4]);j[side+'Knee']=leg.joint;j[side+'Ankle']=leg.end;}
 for(const key in j)j[key][0]*=mirror;
 return{joints:j,head:p.head,stage:Math.min(frames[name].length-1,Math.floor(C.clamp(t,0,1)*(frames[name].length-1))),count:frames[name].length};}
function angle(a,b,c){const x=sub(a,b),y=sub(c,b);return Math.acos(C.clamp(dot(x,y)/(norm(x)*norm(y)),-1,1))*180/Math.PI;}
const api={frames,teaching,pose,angle,solve};root.MartialModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
