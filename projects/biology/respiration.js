/* Original layered respiratory illustration. Structure and process are kept distinct. */
(function(){'use strict';
const D=LabDraw,B=BioProcess,ink='#24434e',muted='#607985',air='#2999ba',blood='#b85769',co2='#bb9350';
function text(c,s,x,y,size=18,color=ink,align='center'){D.text(c,s,x,y,size,color,align);}
function path(c,data,fill,stroke,width=2){const p=new Path2D(data);if(fill){c.fillStyle=fill;c.fill(p);}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke(p);}}
function torso(c,e,labels=true){
 const down=e*28;
 c.save();
 // Front view: patient's right lung is on the viewer's left; the cardiac notch is on the other lung.
 path(c,'M216 117Q187 126 145 145Q108 171 98 238L83 405Q90 433 111 418L135 268L143 465Q185 490 250 491Q318 488 356 463L363 268L389 418Q410 434 420 407L404 239Q393 170 355 145L285 117L283 81L219 81Z','#d6b8ae45','#b5aa9e',1.4);
 c.save();c.translate(252,260);c.scale(1+e*.08,1+e*.09);c.translate(-252,-260);
 const gradient=c.createLinearGradient(135,170,360,430);gradient.addColorStop(0,'#d398a1');gradient.addColorStop(.45,'#e6bbc0');gradient.addColorStop(1,'#b9798a');
 path(c,'M228 153C192 136 164 170 145 215C126 261 128 367 144 412C171 427 201 414 224 398Q243 337 240 271Q238 208 228 153Z',gradient,'#9f6f7f',2);
 path(c,'M277 153C310 137 340 170 357 216C375 261 375 363 358 410C333 418 312 415 295 400Q315 363 290 334Q273 319 268 301Q264 211 277 153Z',gradient,'#9f6f7f',2);
 // Lobes and mediastinum are meaningful guides, not an anatomical scan.
 path(c,'M142 268Q186 284 238 265M142 365Q197 320 237 286',null,'#a47587',2);
 path(c,'M278 268Q322 300 367 363',null,'#a47587',2);
 // Pulmonary branches taper and end in the tissue, never join the blood vessel drawing.
 const branch=(x,y,angle,len,width,depth)=>{let X=x+Math.sin(angle)*len,Y=y+Math.cos(angle)*len;D.line(c,[[x,y],[X,Y]],'#ecd4a9',width);D.line(c,[[x,y],[X,Y]],'#fff0cd',Math.max(1,width*.35));if(depth){branch(X,Y,angle-.42,len*.66,width*.64,depth-1);branch(X,Y,angle+.38,len*.66,width*.64,depth-1);}else{for(let k=0;k<5;k++)D.circle(c,X+Math.cos(k*1.3)*6,Y+Math.sin(k*1.3)*6,3,'#f2d2cb','#ba8f93');}};
 branch(250,211,-.52,62,12,3);branch(250,211,.53,61,12,3);
 // Heart shown only to orient the left cardiac notch.
 path(c,'M254 301C230 273 217 310 239 347L273 378Q311 347 298 316Q282 294 270 312Z','#b76772','#965563',2);
 c.restore();
 path(c,'M239 88H262V214L252 224L240 212Z','#e4cfac','#b09a7a',1.5);
 for(let y=101;y<210;y+=10)D.line(c,[[240,y],[261,y]],'#b69e7c',2.5);
 // Expanding rib cage; the lung does not actively pull itself open.
 for(let i=0;i<8;i++){const y=177+i*27;path(c,`M241 ${y}Q${148-e*8} ${y-42} ${131-e*7} ${y+22}M269 ${y}Q${353+e*8} ${y-42} ${371+e*7} ${y+22}`,null,'#f1e5cc95',5);}
 path(c,`M132 ${451+down}Q250 ${395+down*2.15} 369 ${451+down}`,null,'#885d8e',13);
 path(c,`M132 ${451+down}Q250 ${395+down*2.15} 369 ${451+down}`,null,'#bf9ac6',4);
 if(labels){text(c,'本人右肺 · 3叶',155,515,16);text(c,'本人左肺 · 2叶',344,515,16);text(c,'气管',354,108,17);D.line(c,[[328,110],[266,125]],'#7f9399',1);text(c,'膈肌',390,488,17,'#765781');D.line(c,[[373,483],[343,451+down]],'#8a7798',1);}
 c.restore();
}
function alveolus(c,t,labels=true){
 // Air on one side, blood on the other, a continuous thin interface between them.
 const cx=734,cy=267,R=107;
 const g=c.createRadialGradient(cx-32,cy-25,10,cx,cy,120);g.addColorStop(0,'#f9f4e4');g.addColorStop(.8,'#e1e8db');g.addColorStop(1,'#c9d6cd');
 D.circle(c,cx,cy,R,g);c.beginPath();c.arc(cx,cy,R,-.41*Math.PI,1.41*Math.PI);c.strokeStyle='#dca5b4';c.lineWidth=13;c.stroke();
 // Alveolar neck is open to the airway, not a sealed balloon.
 path(c,'M705 165V124M763 165V124',null,'#dca5b4',12);path(c,'M711 165V122H757V165','#edf0df',null);
 c.beginPath();c.arc(cx,cy,145,-.15*Math.PI,1.15*Math.PI);const vessel=c.createLinearGradient(590,0,900,0);vessel.addColorStop(0,'#86516b');vessel.addColorStop(1,'#d66775');c.strokeStyle=vessel;c.lineWidth=36;c.stroke();
 for(let k=0;k<8;k++){const f=(t*1.8+k/8)%1,a=(1.15-f*1.3)*Math.PI,x=cx+145*Math.cos(a),y=cy+145*Math.sin(a);c.save();c.translate(x,y);c.rotate(a+Math.PI/2);D.ellipse(c,0,0,13,8,f<.5?'#a84e64':'#ce5b66','#873c50');D.ellipse(c,0,0,6,3,'#df8d94');c.restore();}
 // O₂ and CO₂ cross along different small paths, with no whole-air bubbles entering blood.
 for(let k=0;k<5;k++){const f=(t*4+k/5)%1;D.circle(c,690+Math.sin(k)*5,303+f*84,4,air);D.circle(c,779+Math.sin(k)*5,391-f*87,4,co2);}
 D.arrow(c,687,301,687,392,air,2);D.arrow(c,783,391,783,304,co2,2);
 if(labels){text(c,'肺泡内空气',cx,229,19);text(c,'O₂',664,343,21,air);text(c,'CO₂',812,343,21,co2);text(c,'很薄的肺泡—毛细血管屏障',cx,452,16,muted);text(c,'红细胞留在血管里，氧气跨膜进入',cx,483,16,muted);text(c,'由右心来',588,158,15,'#88506d');text(c,'去左心',886,158,15,'#b95765');}
}
function render(c,v,t){const m=B.breathing(v.rate,v.depth,t),e=m.expansion,zoom=v.view||'both';D.clear(c);c.fillStyle='#f5f5ed';c.fillRect(0,0,960,600);text(c,'① 胸腔改变容积　　② 空气流动　　③ 气体跨膜',480,39,24);
 if(zoom==='alveoli'){c.save();c.translate(-670,-150);c.scale(1.65,1.65);alveolus(c,t,false);c.restore();text(c,'肺泡一侧是空气，毛细血管里是血液',480,500,24);text(c,'氧气扩散进入血液；二氧化碳反向扩散。不是整口空气进入血管。',480,548,20,muted);}
 else if(zoom==='chest'){c.save();c.translate(130,-30);c.scale(1.25,1.1);torso(c,e,true);c.restore();text(c,m.inhaling?'吸气：膈肌收缩、下降，胸廓向外':'呼气：膈肌放松、回拱，肺弹性回缩',480,560,23,m.inhaling?air:'#8b698e');}
 else{torso(c,e,true);alveolus(c,t,true);D.line(c,[[450,95],[450,515]],'#c9d6d5',1);text(c,'机械通气 · 正面透视',250,75,17,muted);text(c,'局部放大 · 气体交换',734,75,17,muted);}
 if(zoom!=='alveoli'){c.save();if(zoom==='chest'){c.translate(130,-30);c.scale(1.25,1.1);}for(let k=0;k<7;k++){let f=(t*4+k/7)%1,y=95+f*112;if(!m.inhaling)y=207-f*112;D.circle(c,250,y,3,m.inhaling?air:co2);}c.restore();}
 if(zoom==='both'){text(c,m.inhaling?'吸气：膈肌往下，空气流入':'呼气：膈肌回拱，空气流出',252,555,19,m.inhaling?air:'#8a698c');text(c,'结构简化且放大；不是临床影像',734,555,17,muted);}
 return [['呼吸阶段',m.inhaling?'吸气':'呼气'],['演示频率',v.rate+'次/分'],['交换位置','肺泡 ↔ 毛细血管']];
}
BioVisuals.breathing=render;
const l=Museum.lessons.find(x=>x.id==='breathing');l.controls.push({id:'view',label:'观察层级',type:'select',value:'both',options:[['both','胸腔与肺泡联动'],['chest','放大胸腔机械运动'],['alveoli','放大肺泡交换']]});l.intro='先看膈肌怎样带动胸腔，再看氧气怎样跨过薄壁。两块画面不是相同大小的物体。';l.sources.push(['NHLBI：呼吸系统结构与气体交换','https://www.nhlbi.nih.gov/health/lungs/respiratory-system']);l.limits+=' 此图表示正面透视：图的左侧是人体右肺；气体、肺泡和红细胞不使用同一比例。左右肺叶与心切迹仅用于建立结构方向，绝非完整解剖图。';
})();
