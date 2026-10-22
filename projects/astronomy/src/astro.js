/* 日月地 · 时空实验室 — astronomical state, independent of rendering.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Input: UTC milliseconds. Output: kilometers/degrees, apparent EQD vectors.
 * Offline positions are Chebyshev approximations of Swiss Ephemeris/Moshier.
 */
(function (root) {
  'use strict';
  const DAY = 86400000, AU = 149597870.7, RE = 6378.137, RM = 1737.4, RS = 695700;
  const RAD = Math.PI / 180, MIN = Date.UTC(1900, 0, 1), MAX = Date.UTC(2100, 11, 31, 23, 59, 59);
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const mod = (x, n = 360) => ((x % n) + n) % n;
  const signed = x => mod(x + 180) - 180;
  const add = (a, b) => a.map((x, i) => x + b[i]);
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const mul = (a, k) => a.map(x => x * k);
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const len = a => Math.hypot(...a);
  const unit = a => mul(a, 1 / Math.max(1e-30, len(a)));
  const angle = (a,b) => Math.atan2(len(cross(a,b)), dot(a,b));
  const eqToEcl = (v, eps) => { const c=Math.cos(eps*RAD),s=Math.sin(eps*RAD); return [v[0], c*v[1]+s*v[2], -s*v[1]+c*v[2]]; };
  const eclToEq = (v, eps) => eqToEcl(v, -eps);
  const toWorld = (v, eps) => { const e=eqToEcl(v,eps); return [e[0],e[2],-e[1]]; };
  let coefficients, meta;
  function init(data, metadata) {
    coefficients = data instanceof Float32Array ? data : new Float32Array(data);
    meta = metadata;
    if (coefficients.length !== meta.segments * meta.channels * (meta.degree+1)) throw new Error('星历文件长度不正确。');
  }
  function raw(time) {
    if (!Number.isFinite(time)) throw new Error('时间必须为有效数字。');
    const jd = time / DAY + 2440587.5;
    const s = (jd - meta.startJD) / meta.stepDays, index = Math.floor(s);
    if(index<0 || index>=meta.segments) throw new RangeError('星历只支持 1900—2100 年。');
    const x = (s-index)*2-1, n = meta.degree+1, out=[];
    for (let channel=0;channel<meta.channels;channel++) {
      const offset=(index*meta.channels+channel)*n;
      let b1=0,b2=0;
      for(let j=n-1;j>=1;j--) { const b=2*x*b1-b2+coefficients[offset+j]; b2=b1; b1=b; }
      out.push(x*b1-b2+coefficients[offset]);
    }
    return out;
  }
  function sidereal(time, correction) {
    const jd = time/DAY+2440587.5, t=(jd-2451545)/36525;
    return mod(280.46061837+360.98564736629*(jd-2451545)+.000387933*t*t-t*t*t/38710000+correction);
  }
  function position(time, experiment=null) {
    const p=raw(time);
    let sun=mul(p.slice(0,3),AU),moon=mul(p.slice(3,6),AU),eps=p[6];
    if(experiment && experiment.enabled) {
      const s=eqToEcl(sun,eps),m=eqToEcl(moon,eps),r=len(m);
      const longitude=Math.atan2(m[1],m[0]);
      const latitude=Math.asin(m[2]/r)*(experiment.inclination/5.145);
      eps=experiment.tilt;
      moon=eclToEq([r*Math.cos(latitude)*Math.cos(longitude),r*Math.cos(latitude)*Math.sin(longitude),r*Math.sin(latitude)],eps);
      sun=eclToEq(s,eps);
    }
    const sunEcl=eqToEcl(sun,eps), moonEcl=eqToEcl(moon,eps);
    const sunLon=mod(Math.atan2(sunEcl[1],sunEcl[0])/RAD),moonLon=mod(Math.atan2(moonEcl[1],moonEcl[0])/RAD);
    const phase=mod(moonLon-sunLon), fraction=(1+dot(unit(mul(moon,-1)),unit(sub(sun,moon))))/2;
    return {time,sun,moon,eps,gast:sidereal(time,p[7]),sunLon,moonLon,phase,
      fraction:clamp(fraction,0,1),sunDistance:len(sun),moonDistance:len(moon),
      sunDeclination:Math.asin(sun[2]/len(sun))/RAD,experiment:!!experiment?.enabled};
  }
  function observerVector(gast,observer) {
    const lat=observer.lat*RAD,lon=(observer.lon+gast)*RAD;
    const f=1/298.257223563,e2=f*(2-f),sin=Math.sin(lat),n=RE/Math.sqrt(1-e2*sin*sin),h=(observer.height||0)/1000;
    return [(n+h)*Math.cos(lat)*Math.cos(lon),(n+h)*Math.cos(lat)*Math.sin(lon),(n*(1-e2)+h)*sin];
  }
  function horizontalVector(v,gast,observer) {
    const lat=observer.lat*RAD,lon=(observer.lon+gast)*RAD,c=Math.cos(lat),s=Math.sin(lat),cl=Math.cos(lon),sl=Math.sin(lon);
    // Right-handed rendering frame: +x East, +y Zenith, -z North.
    return [-sl*v[0]+cl*v[1],c*cl*v[0]+c*sl*v[1]+s*v[2],s*cl*v[0]+s*sl*v[1]-c*v[2]];
  }
  function refraction(alt) {
    if(alt < -1 || alt > 89.9) return 0;
    return 1.02/Math.tan((alt+10.3/(alt+5.11))*RAD)/60;
  }
  function horizon(v,gast,observer) {
    const h=horizontalVector(v,gast,observer),r=len(h),alt=Math.asin(clamp(h[1]/r,-1,1))/RAD;
    return {az:mod(Math.atan2(h[0],-h[2])/RAD),alt,apparentAlt:alt+refraction(alt),distance:r,vector:h};
  }
  function overlap(r1,r2,d) {
    if(d>=r1+r2) return 0;
    if(d<=Math.abs(r1-r2)) return Math.min(1,r2*r2/(r1*r1));
    const a=Math.acos(clamp((d*d+r1*r1-r2*r2)/(2*d*r1),-1,1));
    const b=Math.acos(clamp((d*d+r2*r2-r1*r1)/(2*d*r2),-1,1));
    const c=.5*Math.sqrt(Math.max(0,(-d+r1+r2)*(d+r1-r2)*(d-r1+r2)*(d+r1+r2)));
    return clamp((r1*r1*a+r2*r2*b-c)/(Math.PI*r1*r1),0,1);
  }
  function local(state,observer) {
    const o=observerVector(state.gast,observer),sun=sub(state.sun,o),moon=sub(state.moon,o);
    const separation=angle(sun,moon),sr=Math.asin(RS/len(sun)),mr=Math.asin(RM/len(moon));
    const solarCoverage=overlap(sr,mr,separation),hs=horizon(sun,state.gast,observer),hm=horizon(moon,state.gast,observer);
    let solarType='无日食';
    if(separation<sr+mr) solarType=separation<=Math.abs(sr-mr)?(mr>=sr?'日全食':'日环食'):'日偏食';
    return {sun:hs,moon:hm,sunVector:sun,moonVector:moon,sunRadius:sr,moonRadius:mr,separation,solarCoverage,solarType,
      solarVisible:hs.apparentAlt+sr/RAD>0,moonVisible:hm.apparentAlt+mr/RAD>0};
  }
  function lunar(state) {
    const dir=mul(unit(state.sun),-1),along=dot(state.moon,dir),distance=len(sub(state.moon,mul(dir,along)));
    // 2% atmospheric enlargement is a teaching approximation, not Danjon modeling.
    const r=RE*1.02,umbra=r-(RS-r)*along/state.sunDistance,penumbra=r+(RS+r)*along/state.sunDistance;
    let type='无月食';
    if(along>0 && distance<penumbra+RM) {
      type=distance<umbra-RM?'月全食':distance<umbra+RM?'月偏食':'半影月食';
    }
    return {type,distance,along,umbra,penumbra,
      coverage:along>0?overlap(RM,Math.max(0,umbra),distance):0,
      penCoverage:along>0?overlap(RM,Math.max(0,penumbra),distance):0};
  }
  function globalSolar(state) {
    const axis=unit(sub(state.moon,state.sun)),t=-dot(state.moon,axis),closest=add(state.moon,mul(axis,t));
    const distance=len(closest),sm=len(sub(state.sun,state.moon));
    const penumbra=RM+(RS+RM)*t/sm;
    let type='无日食',point=null,umbra=RM-(RS-RM)*t/sm;
    if(t>0 && distance<RE+penumbra) {
      type='日偏食';
      if(distance<RE) {
        const near=t-Math.sqrt(RE*RE-distance*distance);
        point=add(state.moon,mul(axis,near));
        umbra=RM-(RS-RM)*near/sm;
        type=umbra>=0?'日全食':'日环食';
      }
    }
    return {type,distance,penumbra,umbra,point,axis};
  }
  function groundPoint(point,gast) {
    return {lat:Math.asin(point[2]/len(point))/RAD,lon:signed(Math.atan2(point[1],point[0])/RAD-gast),height:0,name:'食带中心追踪点'};
  }
  function daylight(latitude,declination) {
    const lat=latitude*RAD,dec=declination*RAD,den=Math.cos(lat)*Math.cos(dec);
    if(Math.abs(den)<1e-12) return Math.sin(lat)*Math.sin(dec)>Math.sin(-.833*RAD)?24:0;
    const c=(Math.sin(-.833*RAD)-Math.sin(lat)*Math.sin(dec))/den;
    return c<=-1?24:c>=1?0:24*Math.acos(c)/Math.PI;
  }
  function phaseName(phase) {
    const names=['新月','蛾眉月','上弦月','盈凸月','满月','亏凸月','下弦月','残月'];
    return names[Math.floor(mod(phase+22.5)/45)];
  }
  function formatTime(time,zone=8,seconds=true) {
    return new Date(time+zone*3600000).toISOString().slice(0,seconds?19:16).replace('T',' ');
  }
  function inputTime(time,zone=8) { return formatTime(time,zone,true).replace(' ','T'); }
  function parseTime(value,zone=8) {
    const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
    if(!match) throw new Error('请输入完整的年月日和时间。');
    const [year,month,day,hour,minute,second]=match.slice(1).map((x,i)=>i===5&&!x?0:Number(x));
    const wall=Date.UTC(year,month-1,day,hour,minute,second),d=new Date(wall);
    if(d.getUTCFullYear()!==year || d.getUTCMonth()!==month-1 || d.getUTCDate()!==day || hour>23 || minute>59 || second>59) throw new Error('日期不存在，请检查闰年、月份和时间。');
    const result=wall-zone*3600000;
    if(result<MIN || result>MAX) throw new Error('支持范围：1900—2100 年（以 UTC 瞬间为准）。');
    return result;
  }
  function shiftCalendar(time,zone,{days=0,months=0,years=0}={}) {
    if(days) return clamp(time+days*DAY,MIN,MAX);
    const d=new Date(time+zone*3600000),originalDay=d.getUTCDate();
    d.setUTCDate(1);d.setUTCFullYear(d.getUTCFullYear()+years);d.setUTCMonth(d.getUTCMonth()+months);
    const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
    d.setUTCDate(Math.min(originalDay,last));
    return clamp(d.getTime()-zone*3600000,MIN,MAX);
  }
  root.Astro={DAY,AU,RE,RM,RS,RAD,MIN,MAX,clamp,mod,signed,add,sub,mul,dot,cross,len,unit,angle,eqToEcl,eclToEq,toWorld,
    init,raw,position,local,lunar,globalSolar,groundPoint,observerVector,horizontalVector,horizon,overlap,daylight,phaseName,
    formatTime,inputTime,parseTime,shiftCalendar};
})(globalThis);
