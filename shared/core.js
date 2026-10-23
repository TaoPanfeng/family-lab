/* Family Lab: pure educational models. No clinical predictions or network dependencies. */
(function(root){'use strict';
const finite=(v,name='number')=>{if(typeof v!=='number'||!Number.isFinite(v))throw Error('Invalid '+name);return v;};
const clamp=(v,a,b)=>Math.min(b,Math.max(a,finite(v)));
const mix=(a,b,t)=>a+(b-a)*clamp(t,0,1);
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;};}
function caffeine(dose,hours,half){[dose,hours,half].forEach(finite);if(dose<0||hours<0||half<=0)throw Error('Invalid half-life parameters');return dose*2**(-hours/half);}
function cross(a,b){if(!['AA','Aa','aa'].includes(a)||!['AA','Aa','aa'].includes(b))throw Error('Unknown genotype');const cells=[...a].flatMap(x=>[...b].map(y=>[x,y].sort().join('')));const counts={AA:0,Aa:0,aa:0};cells.forEach(x=>counts[x]++);return{cells,counts,dominant:(counts.AA+counts.Aa)/4,recessive:counts.aa/4};}
function offspring(a,b,n,seed){if(!Number.isInteger(n)||n<1||n>10000)throw Error('Invalid sample count');const c=cross(a,b),r=rng(seed),counts={AA:0,Aa:0,aa:0};for(let i=0;i<n;i++)counts[c.cells[Math.floor(r()*4)]]++;return counts;}
function chromosome(mode,t){const s=Math.min(4,Math.floor(clamp(t,0,1)*5));if(!['mitosis','meiosis'].includes(mode))throw Error('Unknown division');const n=mode==='meiosis';return{stage:s,cells:n?(s<3?1:s===3?2:4):(s<4?1:2),perCell:s===4?(n?2:4):null,labels:n?['起点：2n = 4','DNA 复制一次','同源染色体配对','第一次分裂：同源分开','第二次分裂：姐妹分开']:['起点：2n = 4','DNA 复制一次','排列在细胞中部','姐妹染色单体分开','两个子细胞：各 2n = 4']};}
function photosynthesis(light,water,co2){return Math.min(clamp(light,0,100),clamp(water,0,100),clamp(co2,0,100));}
function geoPoint(lon,lat,r=1){finite(lon);finite(lat);finite(r);if(Math.abs(lat)>90||r<=0)throw Error('Invalid geographic point');const a=lat*Math.PI/180,b=lon*Math.PI/180;return[r*Math.cos(a)*Math.cos(b),r*Math.sin(a),-r*Math.cos(a)*Math.sin(b)];}
function distance(a,b){[...a,...b].forEach(finite);if(a.length!==2||b.length!==2||Math.abs(a[1])>90||Math.abs(b[1])>90)throw Error('Invalid coordinate');const rad=Math.PI/180,dlat=(b[1]-a[1])*rad,dlon=(b[0]-a[0])*rad,h=Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlon/2)**2;return 6371*2*Math.atan2(Math.sqrt(clamp(h,0,1)),Math.sqrt(1-clamp(h,0,1)));}
function interpolateRoute(points,t){if(!Array.isArray(points)||points.length<2)throw Error('Route requires two points');const x=clamp(t,0,1)*(points.length-1),i=Math.min(points.length-2,Math.floor(x)),f=x-i;let delta=((points[i+1][0]-points[i][0]+540)%360)-180;return[(((points[i][0]+delta*f)+540)%360)-180,mix(points[i][1],points[i+1][1],f)];}
function atmosphere(km){finite(km);if(km<0)throw Error('Negative altitude');return km<12?'对流层':km<50?'平流层':km<85?'中间层':km<600?'热层':km<=10000?'外逸层':'更远的太空';}
function period(a){finite(a);if(a<=0)throw Error('Invalid semi-major axis');return Math.sqrt(a*a*a);}
function orbitPeriod(altitude){finite(altitude);if(altitude<0)throw Error('Negative altitude');return 2*Math.PI*Math.sqrt((6371+altitude)**3/398600.4418)/60;}
function solarRadius(au,scale){finite(au);if(au<=0)throw Error('Invalid AU');return scale==='linear'?au/30.069*8:Math.log1p(au)*2.3;}
function solarDeclination(longitude,tilt){finite(longitude);finite(tilt);const d=Math.asin(Math.sin(tilt*Math.PI/180)*Math.sin(longitude*Math.PI/180))*180/Math.PI;return Math.abs(d)<1e-12?0:d;}
function lightSeconds(km){finite(km);if(km<0)throw Error('Negative distance');return km/299792.458;}
function sexCross(){return['XX','XY','XX','XY'];}
function validateNotes(x){if(!x||x.version!==1||!Array.isArray(x.notes)||x.notes.length>100)throw Error('备份格式不正确');return x.notes.map(n=>{if(!n||typeof n.topic!=='string'||n.topic.length>100||typeof n.text!=='string'||n.text.length>2000||typeof n.date!=='string'||n.date.length>50)throw Error('笔记字段不正确');return{topic:n.topic,text:n.text,date:n.date};});}
const api={finite,clamp,mix,smooth,rng,caffeine,cross,offspring,chromosome,photosynthesis,geoPoint,distance,interpolateRoute,atmosphere,period,orbitPeriod,solarRadius,solarDeclination,lightSeconds,sexCross,validateNotes};if(typeof module!=='undefined')module.exports=api;root.WorldCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
