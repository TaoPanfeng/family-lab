/* 纯函数：尺寸起点、参数校验、方案导入。无 DOM，便于独立测试。 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PostureCore = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const limits = Object.freeze({height:[140,205],popliteal:[28,60],eyeSeat:[50,100],elbowSeat:[12,40],seat:[25,65],desk:[45,135],screen:[75,195],distance:[40,100],backAngle:[90,120],footrest:[0,25],firmness:[1,5],pillow:[1,18],pad:[3,25],cadence:[40,120]});
  const DEFAULT_PROFILE = {height:170,calibrated:false,popliteal:43,eyeSeat:75,elbowSeat:25};
  const clamp = (value, min, max) => Math.min(max, Math.max(min,value));
  const round = (value, digits=1) => Math.round(value * 10**digits)/10**digits;
  function bounded(value, key, fallback) { const n = Number(value); return Number.isFinite(n) ? clamp(n,...limits[key]) : fallback; }
  function cleanProfile(p={}) {
    return {height:bounded(p.height,'height',170),calibrated:p.calibrated===true,popliteal:bounded(p.popliteal,'popliteal',43),eyeSeat:bounded(p.eyeSeat,'eyeSeat',75),elbowSeat:bounded(p.elbowSeat,'elbowSeat',25)};
  }
  function dimensions(profile) {
    const p=cleanProfile(profile), h=p.height;
    // 产品内的简化比例，只产生试调起点，不是人体测量标准或医学公式。
    return {popliteal: p.calibrated?p.popliteal:round(h*.25), eyeSeat:p.calibrated?p.eyeSeat:round(h*.44), elbowSeat:p.calibrated?p.elbowSeat:round(h*.145), standingEye:round(h*.936), standingElbow:round(h*.63), measured:p.calibrated};
  }
  function defaults(profile, posture) {
    const d=dimensions(profile), standing=posture.scene==='standdesk';
    const seat=round(clamp(d.popliteal-1,25,65));
    return {seat,desk:round(standing?d.standingElbow:seat+d.elbowSeat),screen:round((standing?d.standingEye:seat+d.eyeSeat)-2),distance:65,backAngle:105,footrest:0,firmness:3,pillow:posture.id==='supine'?7:posture.id==='prone'?3:9,kneePillow:posture.id!=='prone',pad:posture.scene==='seiza'?9:12,cadence:80};
  }
  function cleanParams(params={}, base={}) {
    const out={};
    Object.keys(limits).filter(k=>!['height','popliteal','eyeSeat','elbowSeat'].includes(k)).forEach(k=>{out[k]=bounded(params[k],k,base[k] ?? ({seat:42,desk:67,screen:115,distance:65,backAngle:105,footrest:0,firmness:3,pillow:9,pad:12,cadence:80})[k]);});
    out.firmness=Math.round(out.firmness); out.kneePillow=typeof params.kneePillow==='boolean'?params.kneePillow:(base.kneePillow??true);return out;
  }
  function reference(profile, posture, params) {
    const d=dimensions(profile), s=cleanParams(params), stand=posture.scene==='standdesk';
    const eye=round(stand?d.standingEye:s.seat+d.eyeSeat), elbow=round(stand?d.standingElbow:s.seat+d.elbowSeat);
    return {seatLow:round(d.popliteal-2),seatHigh:round(d.popliteal),eye,elbow,screenTop:round(eye-2),footGap:round(Math.max(0,s.seat-d.popliteal-s.footrest)),viewAngle:round(Math.atan2(eye-(s.screen-16),s.distance)*180/Math.PI), d};
  }
  function diagnostics(profile, posture, params) {
    const s=cleanParams(params), r=reference(profile,posture,s), out=[];
    const seatScenes=['office','bench','chair'];
    if(seatScenes.includes(posture.scene)){
      if(r.footGap>2) out.push({level:'warn',text:`椅面偏高的示意：脚下约差 ${r.footGap} cm。先确认脚掌能否有稳定支撑。`});
      else if(s.seat < r.d.popliteal-5) out.push({level:'warn',text:'椅面明显低于当前腿长起点。留意膝髋是否过度弯曲、起身是否费力。'});
      else out.push({level:'ok',text:'当前座高接近试调区间。仍要用双脚落地、椅缘不顶腿来确认。'});
    }
    if(['office','standdesk'].includes(posture.scene)){
      if(s.screen>r.eye+2) out.push({level:'warn',text:'屏幕上缘高于当前眼高示意。试着下调，避免仰头；镜片需求另行考虑。'});
      else if(s.screen<r.eye-15) out.push({level:'warn',text:'屏幕整体位置较低。留意是否需要持续低头或向前探。'});
      else out.push({level:'ok',text:'屏幕上缘接近眼平或略低。再用实际字号、距离与视力微调。'});
      if(Math.abs(s.desk-r.elbow)>5) out.push({level:'warn',text:'输入面与自然肘高差距较大。检查是否耸肩、伸手或折腕。'});
      if(s.distance<50) out.push({level:'warn',text:'当前屏距小于 50 cm。优先试调字号和位置，不要硬凑近。'});
    }
    if(posture.category==='lie'){
      out.push({level:'info',text:'1–5 档仅为本项目相对软硬，不对应品牌等级；凹陷是夸张示意，不是人体压力或真实沉降计算。'});
      if(s.firmness<=2) out.push({level:'warn',text:'偏软时留意躯干下陷后的排列与翻身难易；并不是软床一定不好。'});
      if(s.firmness>=4) out.push({level:'info',text:'偏硬时留意肩、髋接触处是否不舒服；硬度不等于支撑效果。'});
      if(s.pillow>=14) out.push({level:'warn',text:'当前受压后枕高较高。观察颈部是否被顶歪，不以模型代替实际试躺。'});
      if(posture.id==='prone')out.push({level:'warn',text:'俯卧用于认识常见习惯，不主动推荐；保证口鼻不被床品遮挡。'});
    }
    if(posture.id==='seiza'||posture.id==='cross')out.push({level:'warn',text:'不强压膝踝，不追求坚持时长；麻木、刺痛或疼痛时停止并换姿势。'});
    if(out.length===0)out.push({level:'info',text:'这里展示形态，不做身体诊断；舒服、可调整、可退出，比形状整齐更重要。'});
    return out;
  }
  function escapeHtml(text) {return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function makeSnapshot(name, posture, profile, params, note='') {return {id:'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),name:String(name||posture.name).trim().slice(0,60),postureId:posture.id,profile:cleanProfile(profile),params:cleanParams(params,defaults(profile,posture)),note:String(note).slice(0,1500),created:new Date().toISOString()};}
  function parseBackup(text, postures) {
    if(typeof text!=='string'||text.length>2_000_000)throw new Error('文件过大；请使用 2 MB 以内的项目备份 JSON。');
    let raw;try{raw=JSON.parse(text);}catch(e){throw new Error('不是有效的 JSON 文件，原有方案没有改变。');}
    if(!raw||raw.app!=='shenyodu-posture-lab'||raw.version!==1||!Array.isArray(raw.plans))throw new Error('备份格式或版本不匹配，原有方案没有改变。');
    if(raw.plans.length>100)throw new Error('单次最多导入 100 个方案。');
    const ids=new Set(postures.map(p=>p.id));
    const plans=raw.plans.map((p,i)=>{
      if(!p||!ids.has(p.postureId)||typeof p.name!=='string'||!p.profile||!p.params)throw new Error(`第 ${i+1} 个方案缺少必要字段或姿势不存在。`);
      if(!Number.isFinite(p.profile.height)||p.profile.height<140||p.profile.height>205)throw new Error(`第 ${i+1} 个方案的身高超出成人演示范围。`);
      for(const key of ['popliteal','eyeSeat','elbowSeat'])if(p.profile[key]!==undefined&&(!Number.isFinite(p.profile[key])||p.profile[key]<limits[key][0]||p.profile[key]>limits[key][1]))throw new Error(`第 ${i+1} 个方案的实测 ${key} 数值无效。`);
      for(const [key,value] of Object.entries(p.params))if(Object.prototype.hasOwnProperty.call(limits,key)&&(!Number.isFinite(value)||value<limits[key][0]||value>limits[key][1]))throw new Error(`第 ${i+1} 个方案的 ${key} 数值无效。`);
      const posture=postures.find(x=>x.id===p.postureId), result=makeSnapshot(p.name,posture,p.profile,p.params,p.note||'');
      if(typeof p.created==='string'&&!Number.isNaN(Date.parse(p.created)))result.created=new Date(p.created).toISOString();
      return result;
    });
    return {plans,favorites:Array.isArray(raw.favorites)?[...new Set(raw.favorites.filter(id=>ids.has(id)))]:[]};
  }
  function buildBackup(plans,favorites) {return JSON.stringify({app:'shenyodu-posture-lab',version:1,exported:new Date().toISOString(),plans,favorites},null,2);}
  return {limits,DEFAULT_PROFILE,clamp,round,bounded,cleanProfile,dimensions,defaults,cleanParams,reference,diagnostics,escapeHtml,makeSnapshot,parseBackup,buildBackup};
});
