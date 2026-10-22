/* Geometric eclipse/phase/season searches. All UTC times; no display scaling.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  const A=root.Astro,D=A.DAY;
  function bisect(fn,a,b,tolerance=200) {
    let fa=fn(a),fb=fn(b);
    if(fa===0)return a;if(fb===0)return b;
    if(fa*fb>0) return null;
    for(let k=0;k<60 && b-a>tolerance;k++) {const c=(a+b)/2,fc=fn(c);if(fc*fa<=0){b=c;fb=fc;}else{a=c;fa=fc;}}
    return (a+b)/2;
  }
  function minimize(fn,a,b) {
    const r=(Math.sqrt(5)-1)/2;
    let c=b-r*(b-a),d=a+r*(b-a),fc=fn(c),fd=fn(d);
    for(let i=0;i<70 && b-a>100;i++) {
      if(fc<fd){b=d;d=c;fd=fc;c=b-r*(b-a);fc=fn(c);}else{a=c;c=d;fc=fd;d=a+r*(b-a);fd=fn(d);}
    }
    return (a+b)/2;
  }
  function nextAngle(start,target,field,maxDays,step) {
    const f=t=>A.signed(A.position(t)[field]-target);
    let a=Math.max(A.MIN,start),fa=f(a);
    const end=Math.min(A.MAX,a+maxDays*D);
    for(let b=Math.min(a+step*D,end);b<=end && b>a;b=Math.min(a+step*D,end)) {
      const fb=f(b);
      if(fa<=0 && fb>=0 && fb-fa<180) return bisect(f,a,b);
      a=b;fa=fb;
    }
    return null;
  }
  const nextPhase=(start,phase)=>nextAngle(start,phase,'phase',35,1);
  function seasons(year) {
    const start=Math.max(A.MIN,Date.UTC(year,0,1)),names=['春分','夏至','秋分','冬至'];
    return [0,90,180,270].map((angle,i)=>({name:names[i],kind:'season',target:angle,time:nextAngle(start,angle,'sunLon',366,5)})).filter(x=>x.time!==null);
  }
  function solarEvent(start) {
    let cursor=Math.max(start,A.MIN);
    for(let i=0;i<20 && cursor<A.MAX;i++) {
      const newMoon=nextPhase(cursor,0);if(newMoon===null)return null;
      const low=Math.max(A.MIN,newMoon-.25*D),high=Math.min(A.MAX,newMoon+.25*D);
      const peak=minimize(t=>A.globalSolar(A.position(t)).distance,low,high);
      const state=A.position(peak),g=A.globalSolar(state);
      if(g.type!=='无日食' && peak>=start-1000) {
        const contact=t=>{const x=A.globalSolar(A.position(t));return x.distance-A.RE-x.penumbra;};
        const first=bisect(contact,Math.max(A.MIN,peak-.3*D),peak),last=bisect(contact,peak,Math.min(A.MAX,peak+.3*D));
        return {kind:'solar',type:g.type,time:peak,start:first,end:last,
          observer:g.point?A.groundPoint(g.point,state.gast):null,
          note:'全球食甚；球形地球近似。不解析混合日食的沿程分类。'};
      }
      cursor=newMoon+20*D;
    }
    return null;
  }
  function lunarEvent(start) {
    let cursor=Math.max(start,A.MIN);
    for(let i=0;i<20 && cursor<A.MAX;i++) {
      const fullMoon=nextPhase(cursor,180);if(fullMoon===null)return null;
      const peak=minimize(t=>A.lunar(A.position(t)).distance,Math.max(A.MIN,fullMoon-.25*D),Math.min(A.MAX,fullMoon+.25*D));
      const event=A.lunar(A.position(peak));
      if(event.type!=='无月食' && peak>=start-1000) {
        const roots=(name,sign)=>{
          const fn=t=>{const x=A.lunar(A.position(t));return x.distance-x[name]-sign*A.RM;};
          return [bisect(fn,Math.max(A.MIN,peak-.4*D),peak),bisect(fn,peak,Math.min(A.MAX,peak+.4*D))];
        };
        const [p1,p4]=roots('penumbra',1),[u1,u4]=roots('umbra',1),[u2,u3]=roots('umbra',-1);
        return {kind:'lunar',type:event.type,time:peak,start:p1,end:p4,contacts:[
          {label:'半影始',time:p1},{label:'初亏',time:u1},{label:'食既',time:u2},{label:'食甚',time:peak},
          {label:'生光',time:u3},{label:'复圆',time:u4},{label:'半影终',time:p4}].filter(x=>x.time!==null),
          note:'大气影子采用 2% 放大近似；接触时刻为教学估算。'};
      }
      cursor=fullMoon+20*D;
    }
    return null;
  }
  function localSolar(globalEvent,observer) {
    const peak=minimize(t=>A.local(A.position(t),observer).separation,Math.max(A.MIN,globalEvent.time-.22*D),Math.min(A.MAX,globalEvent.time+.22*D));
    const local=A.local(A.position(peak),observer);
    if(local.solarType==='无日食')return {visible:false,reason:'这个地点不在本次日食的几何可见区域。',time:peak,type:'当地无日食',contacts:[]};
    const fn=t=>{const p=A.local(A.position(t),observer);return p.separation-p.sunRadius-p.moonRadius;};
    const first=bisect(fn,Math.max(A.MIN,peak-.3*D),peak),last=bisect(fn,peak,Math.min(A.MAX,peak+.3*D));
    const inner=t=>{const p=A.local(A.position(t),observer);return p.separation-Math.abs(p.sunRadius-p.moonRadius);};
    const second=bisect(inner,first||peak-.15*D,peak),third=bisect(inner,peak,last||peak+.15*D);
    const contacts=[{label:'初亏',time:first},{label:'食既 / 环食始',time:second},{label:'食甚',time:peak},
      {label:'生光 / 环食终',time:third},{label:'复圆',time:last}].filter(c=>c.time!==null);
    // Check the whole partial phase, not only the peak: an eclipse may rise/set midway.
    let visible=false;
    for(let i=0;i<=32;i++) {const t=(first||peak)+((last||peak)-(first||peak))*i/32;if(A.local(A.position(t),observer).solarVisible){visible=true;break;}}
    contacts.forEach(c=>{const p=A.local(A.position(c.time),observer);c.alt=p.sun.apparentAlt;c.visible=p.solarVisible;});
    return {kind:'solar',time:peak,type:local.solarType,coverage:local.solarCoverage,contacts,start:first,end:last,visible,
      reason:visible?'至少一部分食过程发生时，太阳在当地地平线上方。':'存在几何遮挡，但整个食过程太阳都在当地地平线下。'};
  }
  function nearby(time) {
    const events=[];
    let s=solarEvent(time),m=lunarEvent(time);
    if(s)events.push(s);if(m)events.push(m);
    for(const [target,type] of [[0,'新月'],[90,'上弦月'],[180,'满月'],[270,'下弦月']]) {
      const t=nextPhase(time,target);if(t!==null)events.push({kind:'phase',type,time:t});
    }
    return events.sort((a,b)=>a.time-b.time);
  }
  const catalog=[
    {title:'月影掠过北美',type:'日全食',date:'2024-04-08',kind:'solar',observer:{name:'达拉斯 · 美国',lat:32.7767,lon:-96.7970,height:130},description:'站在全食带里，看白昼被月亮按下暂停。'},
    {title:'上海的白昼星空',type:'日全食',date:'2009-07-22',kind:'solar',observer:{name:'上海',lat:31.2304,lon:121.4737,height:4},description:'回到 2009 年，从地面与太空观察同一片月影。'},
    {title:'太阳变成金色指环',type:'日环食',date:'2023-10-14',kind:'solar',observer:{name:'阿尔伯克基 · 美国',lat:35.0844,lon:-106.6504,height:1619},description:'月亮看起来小了一点，太阳边缘便留下一圈光。'},
    {title:'月亮走进地球的影子',type:'月全食',date:'2025-03-14',kind:'lunar',observer:{name:'洛杉矶 · 美国',lat:34.0522,lon:-118.2437,height:90},description:'不是月亮熄灯，是地球站到了阳光前面。'},
    {title:'在上海等一轮红月亮',type:'月全食',date:'2025-09-07',kind:'lunar',observer:{name:'上海',lat:31.2304,lon:121.4737,height:4},description:'UTC 9 月 7 日；北京时间已到 9 月 8 日凌晨。'}
  ];
  root.Events={bisect,minimize,nextPhase,seasons,solarEvent,lunarEvent,localSolar,nearby,catalog};
})(globalThis);
