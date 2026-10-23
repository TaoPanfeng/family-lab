/* Original scientific vector plates. Anatomy is schematic; no photographic or clinical claim. */
(function () {
  'use strict';
  const D = LabDraw, C = WorldCore, P = D.colors, B = BioProcess;
  function path(c, data, fill, stroke, width = 2) {
    const p = new Path2D(data); if (fill) { c.fillStyle = fill; c.fill(p); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(p); }
  }
  function label(c, text, x, y, toX, toY, color = P.muted) {
    D.line(c, [[x, y + 12], [toX, toY]], color, 1); D.text(c, text, x, y, 16, color);
  }
  function silhouette(c, x, y, scale = 1) {
    c.save(); c.translate(x, y); c.scale(scale, scale);
    const skin = c.createLinearGradient(-100, 0, 100, 0);
    skin.addColorStop(0, '#263e56'); skin.addColorStop(.5, '#3f5d73'); skin.addColorStop(1, '#253c51');
    path(c, 'M-20 -108 C-21 -95 -23 -88 -41 -84 C-68 -80 -82 -75 -93 -52 L-115 66 L-113 104 Q-109 115 -100 106 L-96 72 L-77 -7 L-71 48 Q-69 70 -75 100 Q-76 122 -62 133 L-52 247 Q-51 259 -35 257 L-22 148 Q0 156 22 148 L35 257 Q51 259 52 247 L62 133 Q76 122 75 100 Q69 70 71 48 L77 -7 L96 72 L100 106 Q109 115 113 104 L115 66 L93 -52 C82 -75 68 -80 41 -84 C23 -88 21 -95 20 -108 Z', skin, '#5c7c93', 1.5);
    path(c, 'M-21 -109 C-31 -119 -34 -132 -32 -151 C-30 -182 30 -182 32 -151 C34 -132 31 -119 21 -109 Q0 -100 -21 -109 Z', skin, '#688ca2', 1.6);
    // Subtle clavicles, rib arcs and sternum provide orientation rather than a stick figure.
    c.globalAlpha = .35;
    D.line(c, [[-62,-73],[-29,-67],[0,-75],[29,-67],[62,-73]], '#a8c3d1', 2);
    for (let i = 0; i < 5; i++) for (const s of [-1,1]) {
      c.beginPath(); c.moveTo(s*7,-55+i*21); c.quadraticCurveTo(s*64,-54+i*21,s*67,-29+i*20);
      c.strokeStyle='#92afc0';c.lineWidth=1.4;c.stroke();
    }
    D.line(c,[[0,-66],[0,30]],'#95b1c3',2);c.globalAlpha=1;c.restore();
  }
  function cellBoundary(c, cx, cy, rx, ry, pinch, alpha = 1) {
    c.save(); c.globalAlpha = alpha;
    const g=c.createRadialGradient(cx-60,cy-50,10,cx,cy,rx);g.addColorStop(0,'#163b4a');g.addColorStop(1,'#102938');
    c.beginPath(); for(let k=0;k<=160;k++){const a=k/160*Math.PI*2,x=Math.cos(a),y=Math.sin(a)*(1-.995*pinch*Math.exp(-x*x/.12)); const px=cx+rx*x,py=cy+ry*y;k?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();
    c.fillStyle=g;c.fill();c.strokeStyle='#74ddc6';c.lineWidth=3;c.stroke();c.restore();
  }
  function chromatid(c, x, y, len, side, joined, color, alpha, highlight) {
    c.save(); c.globalAlpha=alpha;
    if(highlight){c.shadowColor=color;c.shadowBlur=14;}
    D.line(c,[[x-side*9*joined,y-len],[x,y],[x-side*9*joined,y+len]],color,7);
    D.circle(c,x,y,4,'#e8f5ff');c.restore();
  }
  function division(c,v,t) {
    const m=B.state(v.mode,t), mei=v.mode==='meiosis', ox=480, oy=307;
    D.text(c,mei?'减数分裂 · 一次复制，两次分开':'有丝分裂 · 把两份信息分给两个细胞',480,58,26);
    D.text(c,'示例 2n = 4｜蓝与粉代表亲本来源，长与短代表两对同源染色体',480,94,15,P.muted);
    if(!mei){
      const end=B.ease(t,.94,1);
      if(end<1)cellBoundary(c,ox,oy,285,164,m.pinch,1-end);
      if(end>0)for(const s of [-1,1])cellBoundary(c,ox+s*171,oy,118,135,0,end);
    }else{
      const end=B.ease(t,.64,.70);
      if(end<1)cellBoundary(c,ox,oy,292,165,m.pinch,1-end);
      if(end>0){
        const split=B.ease(t,.84,.97), finish=B.ease(t,.95,1);
        for(const side of [-1,1]){
          c.save();c.translate(ox+side*176,oy);c.rotate(Math.PI/2);
          if(finish<1)cellBoundary(c,0,0,162,122,split,end*(1-finish));c.restore();
          if(finish>0)for(const s of [-1,1])cellBoundary(c,ox+side*176,oy+s*112,112,77,0,finish);
        }
      }
    }
    if(m.envelope>0){c.save();c.globalAlpha=m.envelope;D.ellipse(c,ox,oy,135,115,'#23304c','#909bd2');c.restore();}
    // A homologue attaches to its destination pole in meiosis I; sisters separate in II.
    // Fade the two spindles independently so neither pole jumps between cells.
    const firstFibers=B.ease(t,.22,.37)*(1-B.ease(t,mei?.63:.76,mei?.70:.90));
    const secondFibers=mei?B.ease(t,.71,.77)*(1-B.ease(t,.89,.99)):0;
    function pole(x,y,alpha){c.save();c.globalAlpha=alpha;D.circle(c,x,y,8,P.gold);for(let k=0;k<8;k++){const a=k*Math.PI/4;D.line(c,[[x,y],[x+15*Math.cos(a),y+15*Math.sin(a)]],P.gold,1);}c.restore();}
    for(const ch of m.chromosomes){
      if(firstFibers>0){c.save();c.globalAlpha=firstFibers*.65*ch.visible;const side=mei?ch.poleSide:ch.side;D.line(c,[[ox+side*245,oy],[ox+ch.x,oy+ch.y]],ch.color,1);c.restore();}
      if(secondFibers>0){c.save();c.globalAlpha=secondFibers*.65*ch.visible;D.line(c,[[ox+ch.poleSide*176,oy+ch.side*155],[ox+ch.x,oy+ch.y]],ch.color,1);c.restore();}
    }
    for(const side of [-1,1]){if(firstFibers>0)pole(ox+side*245,oy,firstFibers*.7);if(secondFibers>0)for(const end of [-1,1])pole(ox+side*176,oy+end*155,secondFibers*.7);}
    if(!mei&&m.envelopeNew>0){c.save();c.globalAlpha=m.envelopeNew*.8;for(const s of [-1,1])D.ellipse(c,ox+s*167,oy,68,100,null,'#9aa4d5');c.restore();}
    for(const ch of m.chromosomes)chromatid(c,ox+ch.x,oy+ch.y,ch.length,ch.side,ch.joined,ch.color,ch.visible,v.track==='pair1'&&ch.pair===0);
    if(t>.34&&t<.55){D.line(c,[[ox,oy-143],[ox,oy+143]],'#7a9bb3',1,[4,5]);D.text(c,'中央平面',ox,oy+181,14,P.muted);}
    const captions=document.querySelector('#division-caption');if(captions){captions.textContent=m.phases[m.phase][2];document.querySelector('#division-phase').textContent=m.phases[m.phase][1];document.querySelectorAll('#division-phases button').forEach((b,i)=>b.setAttribute('aria-current',i===m.phase?'step':'false'));}
    D.text(c,m.finalPerCell===null?(t<.5?'复制改变 DNA 份数，不直接改变染色体条数':'跟随同一条染色体，观察它去了哪一侧'):mei?'4 个产物 × 每个 2 条染色体':'2 个子细胞 × 每个 4 条染色体',480,536,21,P.gold);
    return [['过程',m.phases[m.phase][1]],['示意细胞数',m.cells],['终点每细胞',m.finalPerCell===null?'继续观察':m.finalPerCell+' 条染色体']];
  }
  function lung(c,side,expansion) {
    c.save();c.translate(side*40,0);c.scale(1+expansion*.09,1+expansion*.12);
    const g=c.createLinearGradient(-35,-70,35,85);g.addColorStop(0,'#568fa5');g.addColorStop(.5,'#3b718b');g.addColorStop(1,'#2b536f');
    const p=side<0?'M8 -69 C-11 -73 -36 -44 -41 5 C-45 45 -38 71 -17 77 L22 69 C24 45 21 15 18 -15 Z':'M-8 -69 C11 -73 36 -44 41 5 C45 45 38 71 17 77 L-22 69 C-26 43 -13 37 -9 23 C-27 -2 -18 -30 -18 -15 Z';
    path(c,p,g,'#9bcddd',1.8);
    const branch=(x,y,len,angle,depth)=>{const u=x+Math.sin(angle)*len,w=y+Math.cos(angle)*len;D.line(c,[[x,y],[u,w]],depth>1?'#dfc8a4':'#b0cfce',Math.max(.7,depth*1.6));if(depth>0){branch(u,w,len*.64,angle-.44,depth-1);branch(u,w,len*.64,angle+.44,depth-1);}};
    branch(-side*9,-35,31,side*.15,3);
    D.line(c,[[-32,22],[0,39],[27,45]],'#bad0db',1.2);
    if(side<0)D.line(c,[[-32,1],[0,2],[21,-3]],'#bad0db',1.2);c.restore();
  }
  function breathing(c,v,t){
    const m=B.breathing(v.rate,v.depth,t),e=m.expansion;
    D.text(c,'从胸腔运动，到肺泡里的交换',480,55,27);
    c.save();c.translate(282,290);c.scale(1.18,1.18);silhouette(c,0,-4,.92);
    // Crop the lower body with an intentional panel rather than a stick-figure icon.
    c.save();c.translate(0,-22);lung(c,-1,e);lung(c,1,e);
    D.line(c,[[0,-106],[0,-62],[0,-35],[-26,-11]],'#e7cdae',8);D.line(c,[[0,-35],[26,-11]],'#e7cdae',6);
    for(let i=0;i<9;i++)D.line(c,[[-4,-103+i*5],[4,-103+i*5]],'#9e8973',1);
    c.beginPath();c.moveTo(-80,88+e*8);c.quadraticCurveTo(0,54+e*35,80,88+e*8);c.strokeStyle=P.red;c.lineWidth=5;c.stroke();
    for(let k=0;k<4;k++){let y=-105+(((t*18*v.rate/60)+(k/4))%1)*69;if(!m.inhaling)y=-36-(((t*18*v.rate/60)+(k/4))%1)*69;D.circle(c,0,y,3,P.teal);}c.restore();c.restore();
    // Lower portrait is deliberately masked to concentrate on thoracic anatomy.
    D.box(c,137,450,290,150,'#0b1424',null,0);
    label(c,'气管',154,161,279,204,P.gold);label(c,'右肺（3叶）',126,278,223,312,P.blue);label(c,'左肺（2叶）',420,267,340,315,P.blue);
    label(c,'膈肌 '+(m.inhaling?'收缩，下降':'放松，回升'),283,470,281,374+e*31,P.red);
    D.text(c,m.inhaling?'吸气：胸腔扩大':'呼气：胸腔回缩',282,514,20,P.teal);
    // Enlarged alveolar cross section with a capillary passing around the gas space.
    const ax=710,ay=285,ar=100+e*4;
    const g=c.createRadialGradient(ax-30,ay-40,3,ax,ay,ar);g.addColorStop(0,'#253e56');g.addColorStop(1,'#476b7b');
    D.circle(c,ax,ay,ar,g,'#91bbd5');D.circle(c,ax,ay,ar-7,null,'#6b93a7');
    c.beginPath();c.arc(ax,ay,ar+22,.15,Math.PI-.15);c.strokeStyle='#55384b';c.lineWidth=25;c.stroke();
    for(let i=0;i<9;i++){const q=(i/9+t*1.9)%1,a=Math.PI-.15-q*(Math.PI-.3),x=ax+(ar+22)*Math.cos(a),y=ay+(ar+22)*Math.sin(a);c.save();c.translate(x,y);c.rotate(a);D.ellipse(c,0,0,9,5,q<.48?'#b97b99':'#f38b98');D.ellipse(c,0,0,4,2,'#70495c');c.restore();}
    D.text(c,'肺泡剖面（放大）',710,125,20,P.blue);
    D.arrow(c,669,331,669,411,P.teal,3);D.arrow(c,755,410,755,331,P.gold,3);
    for(let i=0;i<4;i++){const q=(i/4+t*2)%1;D.circle(c,669,330+q*80,4,P.teal);D.circle(c,755,410-q*80,4,P.gold);}
    D.text(c,'O₂ 进血液',615,440,17,P.teal);D.text(c,'CO₂ 进肺泡',818,440,17,P.gold);
    D.text(c,'薄壁 + 浓度/分压差 → 气体扩散',710,489,18,P.muted);
    D.text(c,'空气走气道；红细胞留在血管内，两者不穿成一条管。',480,557,17,P.muted);
    return [['呼吸阶段',m.inhaling?'吸气':'呼气'],['模型已运行',m.seconds.toFixed(1)+' 秒'],['频率 / 胸腔幅度',v.rate+'次/分 · '+v.depth+'%']];
  }
  const originalMount=window.Museum.mount;
  window.Museum.mount=function(args){
    if(args.lesson.id==='division'){
      const phases=args.values.mode==='meiosis'?B.meiosisPhases:B.mitosisPhases;
      args.custom.innerHTML='<div class="phase-strip" id="division-phases"></div>';
      const caption=document.createElement('section');caption.className='concept-caption';caption.innerHTML='<h2 id="division-phase"></h2><p id="division-caption"></p>';document.querySelector('#controls').append(caption);
      function refresh(){if(!document.querySelector('#division-caption')){const cap=document.createElement('section');cap.className='concept-caption';cap.innerHTML='<h2 id="division-phase"></h2><p id="division-caption"></p>';document.querySelector('#controls').append(cap);}const ps=args.values.mode==='meiosis'?B.meiosisPhases:B.mitosisPhases;const row=document.querySelector('#division-phases');row.innerHTML='';ps.forEach((p,i)=>{const b=document.createElement('button');b.innerHTML='<small>步骤 '+(i+1)+'</small>'+p[1];b.onclick=()=>window.LabTest.seek(p[0]+.015);row.append(b);});}
      refresh();return{update:refresh,render:()=>{},dispose:()=>{}};
    }
    return originalMount?originalMount(args):null;
  };
  const divisionLesson=Museum.lessons.find(x=>x.id==='division');
  divisionLesson.duration=38;divisionLesson.intro='不是换几张图：跟着同一条染色体，看复制、排队、拉开，再看细胞膜怎样收拢。';
  divisionLesson.controls.push({id:'track',label:'追踪一对染色体',type:'select',value:'all',options:[['all','全部正常显示'],['pair1','高亮较长的同源对']]});
  window.BioVisuals={silhouette,division,breathing};
})();
