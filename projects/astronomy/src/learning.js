/* V2 learning primitives: pure geometry, time windows and bounded portable notes.
 * Shared by the browser and Node tests. No UI state or rendering scales here.
 * SPDX-License-Identifier: AGPL-3.0-or-later */
(function(root){
  'use strict';
  const A=root.Astro, DAY=A.DAY;
  const AUDIENCES=['research','kid','family'], TOPICS=['moon','eclipse','seasons','shadow'];
  const text=(v,max=1200)=>typeof v==='string'?v.slice(0,max):'';
  function noonShadow(latitude,declination,height=1){
    if(![latitude,declination,height].every(Number.isFinite)||Math.abs(latitude)>90||Math.abs(declination)>90||height<=0||height>10)throw new Error('影子参数无效。');
    const altitude=90-Math.abs(latitude-declination);
    const length=altitude<=0?null:Math.abs(altitude-90)<1e-8?0:height/Math.tan(altitude*A.RAD);
    return {altitude,length,height,visible:altitude>0,direction:altitude<=0?'无地面日照':length===0?'脚下':latitude>=declination?'北':'南'};
  }
  function noonPosition(time,observer,zone=8,experiment=null){
    if(!Number.isFinite(time)||time<A.MIN||time>A.MAX||!Number.isFinite(zone)||zone< -12||zone>14||!Number.isFinite(observer.lon)||Math.abs(observer.lon)>180)throw new Error('正午日期或经度不合法。');
    // Choose the civil calendar date displayed in the UI, then solve upper solar
    // transit at the selected longitude. This makes changing only the clock time
    // on that date leave the noon experiment unchanged (not an all-day shadow).
    const day=new Date(time+zone*3600000);
    let t=A.clamp(Date.UTC(day.getUTCFullYear(),day.getUTCMonth(),day.getUTCDate(),12)-observer.lon/15*3600000,A.MIN,A.MAX),p;
    for(let i=0;i<4;i++){
      p=A.position(t,experiment);const ra=Math.atan2(p.sun[1],p.sun[0])/A.RAD;
      const hourAngle=A.signed(p.gast+observer.lon-ra);
      t=A.clamp(t-hourAngle/360*DAY,A.MIN,A.MAX);
    }
    return A.position(t,experiment);
  }
  function compare(time,observer,tilt=0,height=1){
    if(!Number.isFinite(tilt)||tilt<0||tilt>45)throw new Error('地轴角度应为 0～45°。');
    const real=A.position(time),hyp=A.position(time,{enabled:true,tilt,inclination:5.145});
    const pack=p=>({position:p,daylight:A.daylight(observer.lat,p.sunDeclination),shadow:noonShadow(observer.lat,p.sunDeclination,height)});
    const left=pack(real),right=pack(hyp);
    return {time,left,right,daylightDelta:right.daylight-left.daylight};
  }
  function timeWindow(topic,time,zone=8,event=null){
    let start,end,step,label;
    if(topic==='eclipse'){
      start=event?.start||time-3*3600000;end=event?.end||time+3*3600000;
      // Keep contact margins inside a clamped timeline, not an extra simulation clock.
      start-=10*60000;end+=10*60000;step=5*60000;label='食过程 · 每步 5 分钟';
    }else if(topic==='seasons'||topic==='shadow'){
      const y=new Date(time+zone*3600000).getUTCFullYear();start=Date.UTC(y,0,1)-zone*3600000;end=Date.UTC(y+1,0,1)-zone*3600000-1000;
      step=7*DAY;label=topic==='shadow'?'一年里的正午 · 每步 7 天':'四季 · 每步 7 天';
    }else{
      start=time-15*DAY;end=time+15*DAY;step=DAY;label='月相 · 每步 1 天';
    }
    return {start:A.clamp(start,A.MIN,A.MAX),end:A.clamp(end,A.MIN,A.MAX),step,label};
  }
  function timeAt(window,value){
    if(!Number.isFinite(value))throw new Error('时间轴位置无效。');
    return A.clamp(window.start+(window.end-window.start)*A.clamp(value,0,10000)/10000,A.MIN,A.MAX);
  }
  function validateContext(v){
    if(!v||!AUDIENCES.includes(v.audience)||!TOPICS.includes(v.topic))throw new Error('探索模式不合法。');
    if(typeof v.split!=='boolean'||!Number.isFinite(v.tilt)||v.tilt<0||v.tilt>45||!Number.isFinite(v.height)||v.height<.1||v.height>5)throw new Error('实验参数不合法。');
    const eclipseKind=v.eclipseKind===undefined?'solar':v.eclipseKind,eventTime=v.eventTime??null;
    if(!['solar','lunar'].includes(eclipseKind)||eventTime!==null&&(!Number.isFinite(eventTime)||eventTime<A.MIN||eventTime>A.MAX))throw new Error('食事件上下文不合法。');
    return {audience:v.audience,topic:v.topic,split:v.split,tilt:v.tilt,height:v.height,eclipseKind,eventTime};
  }
  function validateNote(note,validateScene){
    if(!note||typeof note.id!=='string'||!/^[-\w]{1,90}$/.test(note.id))throw new Error('记录标识无效。');
    if(!Number.isFinite(note.created)||note.created<0||note.created>8640000000000000)throw new Error('记录日期无效。');
    if(!note.scene||typeof note.scene!=='object')throw new Error('记录缺少场景。');
    const scene=validateScene(JSON.parse(JSON.stringify(note.scene))),context=validateContext(note.context);
    const thumbnail=typeof note.thumbnail==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(note.thumbnail)&&note.thumbnail.length<180000?note.thumbnail:'';
    return {id:note.id,created:note.created,title:text(note.title,100)||'我的发现',guess:text(note.guess),finding:text(note.finding),question:text(note.question),outdoor:text(note.outdoor),scene,context,thumbnail};
  }
  function validateBook(payload,validateScene){
    if(!payload||payload.format!=='sem-lab-notebook'||payload.version!==2||!Array.isArray(payload.notes)||payload.notes.length>40)throw new Error('需要 V2 探索手记备份，最多 40 条记录。');
    const notes=payload.notes.map(n=>validateNote(n,validateScene));
    if(new Set(notes.map(n=>n.id)).size!==notes.length)throw new Error('备份内存在重复记录标识。');
    return notes;
  }
  function mergeNotes(current,incoming){
    // Existing IDs win: importing an older backup cannot overwrite newer writing.
    const ids=new Set(current.map(n=>n.id)),result=[...current];
    for(const note of incoming)if(!ids.has(note.id)){result.push(note);ids.add(note.id);}
    if(result.length>40)throw new Error('合并后超过 40 条。请先备份并整理旧记录，原记录未改动。');
    return result.sort((a,b)=>b.created-a.created);
  }
  class Store{
    constructor(storage,key='sem-lab-v2'){
      this.storage=storage;this.key=key;this.persistent=false;this.error='';this.memory={};
      try{storage.setItem(key+':probe','1');storage.removeItem(key+':probe');this.persistent=true;}catch(e){this.error='浏览器不允许本地保存，请导出 JSON 备份。';}
    }
    get(name,fallback=null){
      try{const raw=Object.prototype.hasOwnProperty.call(this.memory,name)?this.memory[name]:this.persistent?this.storage.getItem(this.key+':'+name):null;return raw?JSON.parse(raw):fallback;}
      catch(e){this.error='有一份本地记录无法读取。导入已保存的备份可以恢复。';return fallback;}
    }
    put(name,value){
      const raw=JSON.stringify(value);this.memory[name]=raw;
      if(this.persistent){try{this.storage.setItem(this.key+':'+name,raw);return true;}catch(e){this.error='浏览器存储空间不足或被禁用；本次只暂存，请立即导出备份。';return false;}}
      return false;
    }
  }
  root.Learning={AUDIENCES,TOPICS,noonShadow,noonPosition,compare,timeWindow,timeAt,validateContext,validateNote,validateBook,mergeNotes,Store};
})(globalThis);
