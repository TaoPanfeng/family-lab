/* 化学探索馆：交互知识展区。无网络依赖；数值模型与绘图分开，便于校验。 */
(function (global) {
  'use strict';
  const $ = (root, selector) => root.querySelector(selector);
  const $$ = (root, selector) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const fmt = (n, digits = 2) => Number.isFinite(n) ? Number(n.toFixed(digits)).toLocaleString('zh-CN', {maximumFractionDigits:digits}) : '—';
  const sci = n => n === 0 ? '0' : n >= 0.001 && n < 10000 ? fmt(n, 5) : n.toExponential(2).replace('e+', ' × 10^').replace('e-', ' × 10^−');
  const svg = (body, label, width = 600, height = 320) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const dot = (x, y, r, fill, text = '', cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" class="${cls}"/>${text ? `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="${fill === '#e2ece7' ? '#183a32' : '#fff'}">${esc(text)}</text>` : ''}`;
  const label = (x,y,text,anchor='middle',size=13,color='#6c8079') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${color}">${esc(text)}</text>`;
  const sources = links => `<div class="cx-sources">知识依据 ${links.map(([name,url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)} ↗</a>`).join(' · ')}</div>`;
  const facts = entries => `<div class="cx-facts">${entries.map(([name,value])=>`<div><span>${name}</span><strong>${value}</strong></div>`).join('')}</div>`;
  const range = (id,title,min,max,step,value,unit='') => `<div class="cx-control"><div><label for="${id}">${title}</label><output id="${id}-out">${fmt(value)}${unit}</output></div><input class="range" id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-cx-unit="${esc(unit)}"/></div>`;
  const select = (id,title,options,value) => `<label class="cx-select-label" for="${id}">${title}<select class="select" id="${id}">${options.map(([val,text])=>`<option value="${esc(val)}" ${String(val) === String(value) ? 'selected' : ''}>${esc(text)}</option>`).join('')}</select></label>`;
  const check = (id,title,checked) => `<label class="cx-checkbox"><input id="${id}" type="checkbox" ${checked?'checked':''}/><span>${title}</span></label>`;
  const modeText = (ctx,kids,adult) => ctx.mode === 'kids' ? kids : adult;
  const note = text => `<div class="cx-model">${text}</div>`;
  function bind(root,type,fn) {root.addEventListener(type,fn); return () => root.removeEventListener(type,fn);}
  function updateRangeOutputs(root) { $$ (root,'input[type="range"]').forEach(input => {const out = $(root,`#${input.id}-out`); if (out) out.textContent = `${fmt(Number(input.value))}${input.dataset.cxUnit || ''}`;}); }
  function checkpoint(id,title,question,answers,correct,explanation) {
    return `<section class="cx-checkpoint" data-checkpoint="${id}" data-title="${esc(title)}" data-correct="${correct}" data-explanation="${esc(explanation)}"><div><span class="eyebrow">想一想 · 记住一个关键点</span><h3>${question}</h3></div><div class="cx-answer-list">${answers.map((answer,i)=>`<button class="btn secondary" data-answer="${i}">${answer}</button>`).join('')}</div><p class="cx-answer-feedback" role="status"></p></section>`;
  }
  function checkpointHandler(root,ctx,event) {
    const button = event.target.closest('[data-answer]'); if (!button) return false;
    const block = button.closest('[data-checkpoint]'); if (!block) return false;
    const correct = button.dataset.answer === block.dataset.correct;
    $(block,'.cx-answer-feedback').textContent = `${correct?'答对啦！':'再想一想。'}${block.dataset.explanation}`;
    $(block,'.cx-answer-feedback').classList.toggle('is-correct',correct);
    $$ (block,'[data-answer]').forEach(b=>b.classList.remove('is-right','is-wrong'));
    button.classList.add(correct?'is-right':'is-wrong');
    if (correct) ctx.complete(block.dataset.checkpoint,block.dataset.title,block.dataset.explanation);
    return true;
  }
  const CATEGORY = {'nonmetal':['其他非金属','#daf0da'],'noble-gas':['稀有气体','#dce8fb'],'alkali-metal':['碱金属','#f8dfc5'],'alkaline-earth':['碱土金属','#f7edba'],'metalloid':['类金属','#dae9c5'],'halogen':['卤素','#d5eded'],'transition-metal':['d 区金属','#e3e7f5'],'post-transition-metal':['其他金属','#d9e7e4'],'lanthanide':['镧系','#f1ddea'],'actinide':['锕系','#e7dcf2'],'unknown':['性质待研究','#e7e9e4']};

  // 固定种子生成每个原子的寿命，拖回时间时仍是同一次随机实验。
  function sampleLifetimes(count,seed=12345) {
    if (!Number.isInteger(count) || count < 0 || count > 100000) throw new Error('原子数需要是 0–100000 的整数');
    let state = seed >>> 0;
    return Array.from({length:count},()=>{state = (Math.imul(1664525,state) + 1013904223) >>> 0; return -Math.log((state + 0.5) / 4294967296) / Math.LN2;});
  }
  function sampleRemaining(lifetimes,time) { if (!Number.isFinite(time) || time < 0) throw new Error('时间不能为负数'); return lifetimes.filter(t=>t>time).length; }
  function boilingPoint(pressureKPa) {
    if (!Number.isFinite(pressureKPa) || pressureKPa < 50 || pressureKPa > 101.325) throw new Error('本水蒸气模型只支持 50–101.325 kPa');
    // NIST / Bridgeman & Aldrich 的 344–373 K Antoine 拟合；常压附近约 0.2 K 外推。
    return 1663.125 / (5.08354 - Math.log10(pressureKPa / 100)) + 45.622 - 273.15;
  }
  function distillationBalance(collected,initialWater=200,salt=5) {
    if (![collected,initialWater,salt].every(Number.isFinite) || collected < 0 || initialWater < 0 || salt < 0 || collected > initialWater) throw new Error('蒸馏质量参数无效');
    return {collected,waterRemaining:initialWater-collected,saltRemaining:salt,total:initialWater+salt,residue:initialWater-collected+salt};
  }
  function crystallization(salt,water) {
    if (![salt,water].every(Number.isFinite) || salt < 0 || water < 0) throw new Error('质量必须是非负数');
    const dissolved = Math.min(salt,water*0.36);
    return {dissolved,crystals:Math.max(0,salt-dissolved),water,total:salt+water};
  }
  function neutralization(acidMl,baseMl,concentration=0.1) {
    if (![acidMl,baseMl,concentration].every(Number.isFinite) || acidMl < 0 || baseMl < 0 || concentration < 0) throw new Error('中和输入必须是非负数');
    const acid = acidMl/1000*concentration, base = baseMl/1000*concentration, volume = (acidMl+baseMl)/1000;
    return {acidMoles:acid,baseMoles:base,waterMoles:Math.min(acid,base),excess:Math.abs(acid-base),kind:acid>=base?'strong-acid':'strong-base',concentration:volume>0?Math.abs(acid-base)/volume:0,volume};
  }

  function periodic(root,ctx) {
    const elements = global.ChemData.elements;
    let selected = Number(ctx.initialElement || (ctx.params && ctx.params.element) || 6);
    if (!elements.some(e=>e.number===selected)) selected=6;
    const visited = new Set([selected]);
    root.innerHTML = `<div class="cx cx-periodic"><div class="cx-intro"><span class="eyebrow">118 个元素 · 组成万物的字母表</span><h2>${modeText(ctx,'世界，是用什么搭出来的？','元素周期表')}</h2><p>${modeText(ctx,'点一张卡片，认识一位元素朋友。横着是一排，竖着是一家！','从原子序数、元素族到生活用途。点击元素，读懂性质与结构之间的联系。')}</p></div><section class="panel"><div class="cx-table-toolbar"><label class="cx-search"><span class="sr-only">搜索元素</span><input class="input" id="cx-element-search" type="search" placeholder="搜索：碳 / C / 6" autocomplete="off"/></label>${select('cx-element-category','元素类别',[['all','全部类别'],...Object.entries(CATEGORY).map(([key,value])=>[key,value[0]])],'all')}<span class="cx-result-count" role="status">118 个元素</span></div><div class="cx-table-scroll" tabindex="0" aria-label="完整元素周期表，窄屏可左右滑动"><div class="cx-element-grid">${Array.from({length:18},(_,i)=>`<span class="cx-group-number" style="grid-column:${i+1};grid-row:1">${i+1}</span>`).join('')}${elements.map(e=>`<button class="cx-element ${e.number===selected?'is-selected':''}" style="grid-column:${e.position.col};grid-row:${e.position.row+1};--element-color:${(CATEGORY[e.category]||CATEGORY.unknown)[1]}" data-element="${e.number}" aria-label="${e.number} ${e.name} ${e.symbol}" aria-pressed="${e.number===selected}"><small>${e.number}</small><strong>${e.symbol}</strong><span>${e.name}</span></button>`).join('')}<div class="cx-fblock-hint" style="grid-column:3;grid-row:7">57–71<small>镧系 ↓</small></div><div class="cx-fblock-hint" style="grid-column:3;grid-row:8">89–103<small>锕系 ↓</small></div><div class="cx-grid-note" style="grid-column:3 / 13;grid-row:3 / 5"><span>每一个格子，一种元素</span><strong>质子数决定它是谁</strong><small>原子序数从 1 到 118 · 上方数字是族号</small></div></div></div><div class="cx-table-footer"><span>窄屏可左右滑动查看完整表格</span><span id="cx-visited">已认识 1 位元素朋友</span></div></section><div id="cx-element-detail"></div>${checkpoint('periodic-identity','元素的身份证','决定元素身份的是哪一个？',['质子数','中子数','电子数'],0,'质子数改变，元素才改变；中子数不同可能是同位素，电子数不同会改变电荷。')}${sources([['RSC 周期表','https://periodic-table.rsc.org/'],['CIAAW 原子量','https://ciaaw.org/atomic-weights.htm']])}</div>`;
    function detail() {
      const e = elements.find(el=>el.number===selected);
      const cat = CATEGORY[e.category] || CATEGORY.unknown;
      const isotopes = (global.ChemData.isotopes||[]).filter(i=>i.number===e.number);
      $(root,'#cx-element-detail').innerHTML = `<section class="panel cx-element-detail"><div class="cx-element-poster" style="--element-color:${cat[1]}"><span>${e.number}</span><strong>${e.symbol}</strong><h3>${e.name}</h3><small>${cat[0]}</small></div><div class="cx-element-description"><div class="cx-panel-top"><div><span class="eyebrow">元素档案</span><h3>${e.name} · ${e.symbol}</h3></div><div class="cx-inline-actions"><button class="btn small secondary" data-step-element="-1" ${selected===1?'disabled':''} aria-label="上一个元素">←</button><button class="btn small secondary" data-step-element="1" ${selected===118?'disabled':''} aria-label="下一个元素">→</button></div></div><p class="cx-lead">${esc(ctx.mode==='kids' ? e.kids : e.summary)}</p>${facts([['质子数 / 原子序数',e.number],['周期 / 族',`${e.period} / ${e.group || (e.category==='lanthanide'?'镧系':'锕系')}`],[e.hasStandardWeight===false?'代表核素的质量数':'相对原子质量',esc(e.massDisplay)],['室温常压状态',esc(e.phase)]])}<div class="cx-knowledge-grid"><div><h4>身边在哪里？</h4><p>${esc(e.uses)}</p></div><div><h4>它的化学性格</h4><p>${esc(e.properties)}</p></div></div>${isotopes.length?`<div class="cx-isotope-chips"><span>认识同位素</span>${isotopes.slice(0,5).map(i=>`<button class="chip" data-open-isotope="${esc(i.id)}">${esc(i.name)} · ${i.stable?'稳定':'放射性'}</button>`).join('')}</div>`:''}<div class="cx-inline-actions">${e.number<=20?'<button class="btn primary" data-build-element>去搭建这个原子 →</button>':''}<button class="btn secondary" data-save-element>记入观察本</button></div>${note(e.hasStandardWeight===false?'方括号内是所选代表同位素的质量数，不是该元素的平均原子量。':'相对原子质量反映同位素组成，通常不是整数；它不等于某个原子的质子数 + 中子数。')}</div></section>`;
      $$ (root,'[data-element]').forEach(button=>{const active=Number(button.dataset.element)===selected;button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));});
      $(root,'#cx-visited').textContent=`已认识 ${visited.size} 位元素朋友`;
    }
    function filter() {
      const query=$(root,'#cx-element-search').value.trim().toLowerCase(), category=$(root,'#cx-element-category').value;
      const matches=elements.filter(e=>(category==='all'||category===e.category) && (!query || (/^\d+$/.test(query)?e.number===Number(query):`${e.symbol} ${e.name}`.toLowerCase().includes(query))));
      const ids=new Set(matches.map(e=>e.number));
      $$ (root,'[data-element]').forEach(button=>{const valid=ids.has(Number(button.dataset.element));button.classList.toggle('is-dimmed',!valid);button.disabled=!valid;});
      $(root,'.cx-result-count').textContent=matches.length?`找到 ${matches.length} 个元素`:'没有匹配，试试名称、符号或原子序数';
      if (matches.length && !ids.has(selected)) {selected=matches[0].number;visited.add(selected);detail();}
    }
    const removeInput=bind(root,'input',e=>{if(e.target.id==='cx-element-search'||e.target.id==='cx-element-category')filter();});
    const removeClick=bind(root,'click',event=>{
      if(checkpointHandler(root,ctx,event))return;
      const element=event.target.closest('[data-element]'), step=event.target.closest('[data-step-element]'), isotope=event.target.closest('[data-open-isotope]');
      if(element){selected=Number(element.dataset.element);visited.add(selected);detail();}
      if(step){selected=clamp(selected+Number(step.dataset.stepElement),1,118);visited.add(selected);detail();}
      if(isotope){const iso=global.ChemData.isotopes.find(i=>i.id===isotope.dataset.openIsotope);if(iso.number<=20)ctx.navigate('atom',{isotope:iso.id,element:iso.number});else if(!iso.stable)ctx.navigate('decay',{isotope:iso.id,element:iso.number});else{const target=$(root,'.cx-isotope-chips');let info=$(root,'#cx-stable-isotope-detail');if(!info){info=root.ownerDocument.createElement('p');info.id='cx-stable-isotope-detail';info.className='cx-feedback';info.setAttribute('role','status');target.insertAdjacentElement('afterend',info);}info.textContent=`${iso.name}：${iso.protons} 个质子，${iso.neutrons} 个中子，质量数 ${iso.massNumber}。这是已收录的稳定核素，不进入放射性衰变模拟。${iso.note||''}`;}}
      if(event.target.closest('[data-build-element]'))ctx.navigate('atom',{element:selected});
      if(event.target.closest('[data-save-element]')){const e=elements.find(el=>el.number===selected);ctx.saveNote({title:`元素观察：${e.name} ${e.symbol}`,body:`原子序数 ${e.number}。${e.summary}\n用途：${e.uses}\n性质：${e.properties}`});ctx.toast('元素观察已记下');}
    });
    detail();return()=>{removeInput();removeClick();};
  }

  function atomDrawing(state,cloud) {
    const {protons:p,neutrons:n,electrons:e}=state, shells=global.ChemCore.electronShells(e);
    let drawing='<circle cx="210" cy="167" r="145" fill="#f3f7f2"/>';
    if (cloud) {
      drawing+='<defs><radialGradient id="cx-electron-cloud"><stop offset="0" stop-color="#58bda4" stop-opacity="0"/><stop offset=".58" stop-color="#58bda4" stop-opacity=".24"/><stop offset="1" stop-color="#58bda4" stop-opacity="0"/></radialGradient></defs>';
      if(e) drawing+='<circle cx="210" cy="167" r="142" fill="url(#cx-electron-cloud)"/>';
      drawing+=label(210,328,`电子云概念图 · ${e} 个电子`);
    } else {
      shells.forEach((count,layer)=>{
        const r=62+layer*25;drawing+=`<circle cx="210" cy="167" r="${r}" stroke="#cbdad2" stroke-dasharray="4 5" fill="none"/>`;
        for(let i=0;i<count;i++){const angle=(i/count*Math.PI*2)-Math.PI/2+layer*.3;drawing+=dot(210+Math.cos(angle)*r,167+Math.sin(angle)*r,7,'#087f6a','−');}
      });
      drawing+=label(210,328,e?`电子层计数：${shells.join(' · ')}`:'电子数为 0：只显示原子核');
    }
    const total=p+n;
    for(let i=0;i<total;i++){
      const a=i*2.39996,r=total>1?Math.sqrt((i+.3)/total)*Math.min(39,12+total):0;
      const isProton=i<p;
      drawing+=dot(210+Math.cos(a)*r,167+Math.sin(a)*r,total>30?5:7,isProton?'#e39a61':'#8fa4a2',isProton&&total<=24?'+':'');
    }
    drawing+=label(210,22,'原子核与电子区域没有按真实比例绘制','middle',12);
    return svg(drawing,`${p} 个质子、${n} 个中子、${e} 个电子的概念示意`,420,350);
  }
  function atom(root,ctx) {
    const initial=Number(ctx.initialElement || (ctx.params&&ctx.params.element) || 6);
    let p=Number.isInteger(initial)&&initial>=1&&initial<=20?initial:6;
    const defaultIso=global.ChemData.isotopes.find(i=>i.number===p&&i.stable);
    let n=defaultIso?defaultIso.neutrons:p,e=p,cloud=false;
    const requested=ctx.params&&ctx.params.isotope;
    const requestedIso=(global.ChemData.isotopes||[]).find(i=>i.id===requested&&i.number<=20);
    if(requestedIso){p=requestedIso.protons;n=requestedIso.neutrons;e=p;}
    const challenges=[{id:'carbon14',title:'搭一个中性的碳-14',p:6,n:8,e:6,hint:'碳有 6 个质子；14 = 质子 + 中子；中性时电子与质子一样多。'},{id:'sodium',title:'搭一个钠-23 的 Na⁺',p:11,n:12,e:10,hint:'钠有 11 个质子，质量数 23，正一价意味着少了 1 个电子。'},{id:'deuterium',title:'搭一个中性的氢-2',p:1,n:1,e:1,hint:'它仍是氢，所以只有 1 个质子；另有 1 个中子。'}];
    root.innerHTML=`<div class="cx cx-atom"><div class="cx-intro"><span class="eyebrow">微观搭建台</span><h2>${modeText(ctx,'亲手搭一个原子','原子、同位素与离子')}</h2><p>${modeText(ctx,'红色小球决定名字，灰色小球改变重量，绿色小球改变电荷。动手试一试！','改变一种粒子，观察元素身份、质量数和电荷如何变化。')}</p></div><div class="cx-work-grid"><section class="panel cx-atom-stage"><div class="cx-panel-top"><span class="chip">前 20 号元素 · 入门模型</span><div class="cx-segment"><button class="is-active" data-view="shell" aria-pressed="true">电子层</button><button data-view="cloud" aria-pressed="false">电子云</button></div></div><div id="cx-atom-scene" class="cx-scene"></div><div class="cx-particle-legend"><span><i style="background:#e39a61"></i>质子 +</span><span><i style="background:#8fa4a2"></i>中子 0</span><span><i style="background:#087f6a"></i>电子 −</span></div>${note('圆环用于数电子层，不是电子实际绕圈的轨迹。电子云只是概率分布的概念图；真实轨道需要量子力学描述。')}</section><section class="panel"><span class="eyebrow">调一调，观察变化</span><div id="cx-atom-identity" aria-live="polite"></div>${range('cx-protons','质子数 · 决定元素',1,20,1,p)}${range('cx-neutrons','中子数 · 改变同位素',0,40,1,n)}${range('cx-electrons','电子数 · 改变电荷',0,20,1,e)}<div class="cx-presets"><button class="chip" data-atom-preset="C-12">碳-12</button><button class="chip" data-atom-preset="C-14">碳-14</button><button class="chip" data-atom-preset="H-2">氢-2</button><button class="chip" data-atom-preset="Na+">Na⁺</button><button class="chip" data-neutral>恢复电中性</button></div></section></div><section class="panel cx-atom-challenge"><div><span class="eyebrow">搭建任务</span>${select('cx-atom-challenge','选择挑战',challenges.map(c=>[c.id,c.title]),'carbon14')}<p id="cx-atom-hint" class="muted">${challenges[0].hint}</p></div><div><button class="btn primary" data-check-atom>检查我的原子</button><p id="cx-atom-feedback" role="status"></p></div></section><section class="cx-three-rules"><div><b>01</b><h3>换质子 → 换元素</h3><p>6 个质子是碳，7 个质子就是氮。</p></div><div><b>02</b><h3>换中子 → 同位素</h3><p>碳-12 和碳-14 都是碳，中子数不同。</p></div><div><b>03</b><h3>换电子 → 换电荷</h3><p>钠少 1 个电子成为 Na⁺，原子核不变。</p></div></section>${sources([['RSC 元素与同位素','https://periodic-table.rsc.org/Help/FactBox'],['OpenStax 原子结构','https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism']])}</div>`;
    function update() {
      const identity=global.ChemCore.atomicIdentity(p,n,e),charge=p-e;
      const status=identity.stability==='stable'?'已收录的稳定核素':identity.stability==='radioactive'?'已收录的放射性核素':'当前核素未收录稳定性数据';
      $(root,'#cx-atom-scene').innerHTML=atomDrawing({protons:p,neutrons:n,electrons:e},cloud);
      $(root,'#cx-atom-identity').innerHTML=`<div class="cx-isotope-display"><span class="cx-nuclide"><span><sup>${p+n}</sup><sub>${p}</sub></span>${esc(identity.symbol)}${charge?`<sup>${Math.abs(charge)===1?'':Math.abs(charge)}${charge>0?'+':'−'}</sup>`:''}</span><div><h3>${esc(identity.name)}-${p+n}</h3><span>${charge===0?'电中性':charge>0?`带 ${charge} 个正电荷`:`带 ${-charge} 个负电荷`}</span></div></div><div class="cx-status-chip ${identity.stability==='unknown'?'is-unknown':''}">${status}</div>${facts([['质量数 A',p+n],['电荷数',charge>0?`+${charge}`:charge]])}`;
      updateRangeOutputs(root);
      if(identity.stability==='unknown')$(root,'#cx-atom-identity').insertAdjacentHTML('beforeend','<p class="cx-tiny">可以搭出数字组合，不代表这种核素或高电荷离子能稳定存在。</p>');
    }
    const removeInput=bind(root,'input',event=>{
      const id=event.target.id;
      if(id==='cx-protons')p=Number(event.target.value);if(id==='cx-neutrons')n=Number(event.target.value);if(id==='cx-electrons')e=Number(event.target.value);
      if(id==='cx-atom-challenge'){$(root,'#cx-atom-hint').textContent=challenges.find(c=>c.id===event.target.value).hint;$(root,'#cx-atom-feedback').textContent='';return;}
      if(['cx-protons','cx-neutrons','cx-electrons'].includes(id)){$(root,'#cx-atom-feedback').textContent='';update();}
    });
    const removeClick=bind(root,'click',event=>{
      const preset=event.target.closest('[data-atom-preset]'), view=event.target.closest('[data-view]');
      if(preset){if(preset.dataset.atomPreset==='Na+'){p=11;n=12;e=10;}else{const iso=global.ChemData.isotopes.find(i=>i.id===preset.dataset.atomPreset);p=iso.protons;n=iso.neutrons;e=p;}$(root,'#cx-protons').value=p;$(root,'#cx-neutrons').value=n;$(root,'#cx-electrons').value=e;$(root,'#cx-atom-feedback').textContent='';update();}
      if(view){cloud=view.dataset.view==='cloud';$$ (root,'[data-view]').forEach(b=>{const active=b===view;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});update();}
      if(event.target.closest('[data-neutral]')){e=p;$(root,'#cx-electrons').value=e;update();}
      if(event.target.closest('[data-check-atom]')){const challenge=challenges.find(c=>c.id===$(root,'#cx-atom-challenge').value),success=p===challenge.p&&n===challenge.n&&e===challenge.e;$(root,'#cx-atom-feedback').textContent=success?'搭对啦！身份、质量数、电荷都正确。':`还差一点：${p!==challenge.p?'质子数决定元素身份。':n!==challenge.n?'检查质量数 = 质子数 + 中子数。':'检查电荷数 = 质子数 − 电子数。'}`;$(root,'#cx-atom-feedback').classList.toggle('is-correct',success);if(success)ctx.complete(`atom-${challenge.id}`,challenge.title,`${p} 个质子、${n} 个中子、${e} 个电子。`);}
    });
    update();return()=>{removeInput();removeClick();};
  }

  const RADIATION={
    alpha:{symbol:'α',name:'阿尔法',kind:'氦原子核 · 2 质子 + 2 中子',origin:'来自原子核',kid:'像一个四人小队离开原子核，原来的元素也变啦。',adult:'α 衰变使质量数 A 减少 4、原子序数 Z 减少 2。它带 +2 电荷。',equation:'²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He',before:'铀-238',after:'钍-234',p:92,n:146,dp:-2,dn:-2,color:'#e3a069'},
    beta:{symbol:'β⁻',name:'贝塔负',kind:'高速电子 · 在核转变时产生',origin:'来自原子核的弱相互作用过程',kid:'一个中子变成质子，同时送出电子和反中微子。不是外圈电子跑出来！',adult:'β⁻ 衰变中，中子变为质子，A 不变、Z 增加 1；同时放出电子和电子反中微子。β 也包括 β⁺，这里演示 β⁻。',equation:'¹⁴₆C → ¹⁴₇N + e⁻ + ν̅ₑ',before:'碳-14',after:'氮-14',p:6,n:8,dp:1,dn:-1,color:'#85ab9d'},
    gamma:{symbol:'γ',name:'伽马',kind:'电磁波 · 光子',origin:'来自原子核的能级变化',kid:'原子核放出一束能量，质子和中子的数量不变。',adult:'γ 发射降低原子核的激发能，A、Z 均不变。它与 X 射线都是光子，不能只用能量高低来区分。',equation:'⁹⁹ᵐ₄₃Tc → ⁹⁹₄₃Tc + γ',before:'锝-99m（激发态）',after:'锝-99',p:43,n:56,dp:0,dn:0,color:'#a89bbe'},
    x:{symbol:'X',name:'X 射线',kind:'电磁波 · 光子',origin:'核外电子跃迁或带电粒子减速等过程',kid:'电子换能级，或者快速电子被减速，也能发出这种高能光。',adult:'X 射线常由内层电子跃迁或制动辐射产生。这里没有把 X 射线作为原子核衰变的一种。',equation:'核外电子能量变化 → X 光子',before:'核外电子的过程',after:'原子核身份不变',p:6,n:6,dp:0,dn:0,color:'#739db7'}
  };
  function decayGraph(lifetimes,total,time) {
    const x=t=>48+t/6*468,y=n=>187-n/total*153;
    let body='';
    [0,.25,.5,.75,1].forEach(f=>{body+=`<line x1="48" x2="516" y1="${y(total*f)}" y2="${y(total*f)}" stroke="#e5ebe1"/>`+label(37,y(total*f)+4,fmt(total*f,0),'end',10);});
    for(let t=0;t<=6;t++)body+=label(x(t),209,t,'middle',10);
    body+=`<path d="M48 25V187H528" stroke="#adbdaf" fill="none"/>`+label(295,232,'经过的半衰期个数','middle',11)+label(48,16,'剩余母核','start',11);
    const expected=Array.from({length:121},(_,i)=>{const t=i/20;return`${x(t)},${y(total*Math.pow(.5,t))}`;}).join(' ');
    const stochastic=Array.from({length:121},(_,i)=>{const t=i/20;return`${x(t)},${y(sampleRemaining(lifetimes,t))}`;}).join(' ');
    body+=`<polyline points="${stochastic}" stroke="#e1a36e" stroke-width="2" fill="none" stroke-linejoin="round"/><polyline points="${expected}" stroke="#087f6a" stroke-width="2.5" fill="none"/><line x1="${x(time)}" x2="${x(time)}" y1="25" y2="187" stroke="#719b7f" stroke-dasharray="4 4"/>`+dot(x(time),y(total*Math.pow(.5,time)),5,'#087f6a');
    return svg(body,'理论期望与这一次随机实验的剩余母核数量曲线',560,242);
  }
  function decay(root,ctx) {
    const isotopes=global.ChemData.isotopes.filter(i=>!i.stable&&i.halfLifeYears>0);
    let isotope=isotopes.find(i=>i.id===(ctx.params&&ctx.params.isotope))||isotopes.find(i=>i.id==='C-14')||isotopes[0];
    let time=0,total=128,seed=12345,lifetimes=sampleLifetimes(total,seed),timer=null,ray='alpha',shield='paper',transformed=false;
    root.innerHTML=`<div class="cx cx-decay"><div class="cx-intro"><span class="eyebrow">看不见的变化，也有规律</span><h2>${modeText(ctx,'原子也会“变身”吗？','放射性衰变与射线')}</h2><p>${modeText(ctx,'单个原子什么时候变身，我们猜不准。一大群原子，却有可以发现的规律。','把随机的单次事件与可预测的统计规律放在一起观察。')}</p></div><div class="cx-work-grid"><section class="panel"><div class="cx-panel-top"><h3>一群原子的计时器</h3><span class="chip">绿色：未衰变 · 灰色：已衰变</span></div><div id="cx-decay-dots" class="cx-decay-dots"></div><div id="cx-decay-stats" aria-live="polite"></div><div id="cx-decay-chart" class="cx-chart"></div><div class="cx-chart-legend"><span><i style="background:#087f6a"></i>理论期望</span><span><i style="background:#e1a36e"></i>这一次的随机结果</span></div></section><section class="panel"><span class="eyebrow">时间实验</span>${select('cx-decay-isotope','选择核素',isotopes.map(i=>[i.id,`${i.name} · ${i.halfLifeLabel}`]),isotope.id)}${select('cx-decay-count','初始母核数量',[[32,'32 个'],[64,'64 个'],[128,'128 个'],[256,'256 个']],total)}${range('cx-decay-time','经过几个半衰期',0,6,.05,time,' 个')}<p id="cx-decay-clock" class="cx-time-value"></p><div class="cx-inline-actions"><button class="btn primary" data-decay-play>▶ 播放时间</button><button class="btn secondary" data-decay-reset>回到开始</button></div><button class="btn secondary cx-full" data-decay-new>换一群原子，再试一次</button><div id="cx-decay-formula" class="cx-equation-block"></div><p id="cx-decay-note" class="cx-tiny"></p>${note('点代表原子核，灰点仍然存在，只是已经变成别的核素。本模型统计母核，不展开子核的后续衰变链。')}</section></div><section class="panel"><div class="cx-panel-top"><div><span class="eyebrow">α / β / γ / X</span><h3>它们来自哪里，又是什么？</h3></div><span class="chip">γ 是希腊字母，不是 y</span></div><div class="cx-ray-selector">${Object.entries(RADIATION).map(([id,r])=>`<button data-ray="${id}" class="cx-ray-card ${id===ray?'is-active':''}" aria-pressed="${id===ray}"><strong style="color:${r.color}">${r.symbol}</strong><span>${r.name}</span><small>${id==='alpha'||id==='beta'?'粒子':'光子'}</small></button>`).join('')}</div><div class="cx-radiation-grid"><div id="cx-radiation-detail"></div><div><label class="cx-select-label" for="cx-shield">换一道屏障<select class="select" id="cx-shield"><option value="none">没有屏障</option><option value="paper" selected>纸张</option><option value="aluminium">铝板（概念示意）</option><option value="dense">厚实的致密材料（概念示意）</option></select></label><div id="cx-shield-scene" class="cx-scene"></div><p id="cx-shield-note" class="cx-tiny"></p></div></div>${note('穿透示意不是剂量计算，也不是防护设计。实际穿透取决于射线能量、材料、厚度和几何条件；光子通常是逐步衰减，不是跨过一堵墙就全部消失。放射性材料只在虚拟展区演示。')}</section>${checkpoint('decay-probability','半衰期的真正意思','经过一个半衰期，哪句话更准确？',['每个原子都变成了半个','大量母核的剩余期望约为一半','所有母核必须恰好剩一半'],1,'单个原子不是被切成两半；有限样本会波动，理论期望按指数规律减少。')}${sources([['EPA 放射性基础','https://www.epa.gov/radiation/radiation-basics'],['EPA 衰变与半衰期','https://www.epa.gov/radiation/radioactive-decay']])}</div>`;
    function stop(){if(timer){clearInterval(timer);timer=null;}const button=$(root,'[data-decay-play]');if(button)button.textContent='▶ 播放时间';}
    function update(){
      const left=sampleRemaining(lifetimes,time),expected=global.ChemCore.decayRemaining(total,time,1);
      $(root,'#cx-decay-dots').innerHTML=lifetimes.map(t=>`<i class="${t>time?'':'has-decayed'}"></i>`).join('');
      $(root,'#cx-decay-dots').setAttribute('aria-label',`初始 ${total} 个，剩余 ${left} 个，已衰变 ${total-left} 个`);
      $(root,'#cx-decay-stats').innerHTML=facts([['理论剩余期望',`${fmt(expected,1)} 个`],['本次实际剩余',`${left} 个`]]);
      $(root,'#cx-decay-chart').innerHTML=decayGraph(lifetimes,total,time);
      $(root,'#cx-decay-clock').textContent=`相当于经过 ${sci(time*isotope.halfLifeYears)} 年`;
      $(root,'#cx-decay-formula').innerHTML=ctx.mode==='kids'?`<strong>${fmt(time)} 个半衰期</strong><span>剩余比例的期望：${fmt(100*Math.pow(.5,time),2)}%</span>`:`<strong>N(t) = N₀ × 2<sup>−t / T½</sup></strong><span>${total} × 2<sup>−${fmt(time)}</sup> = ${fmt(expected,2)}</span>`;
      $(root,'#cx-decay-note').textContent=`${isotope.name} 的半衰期为 ${isotope.halfLifeLabel}。${isotope.note||''}`;
      $(root,'#cx-decay-time').value=time;updateRangeOutputs(root);
    }
    function updateRadiation(){
      const r=RADIATION[ray];
      $(root,'#cx-radiation-detail').innerHTML=`<h3>${r.symbol} · ${r.kind}</h3><span class="cx-status-chip">${r.origin}</span><p class="cx-ray-description">${modeText(ctx,r.kid,r.adult)}</p><div class="cx-equation-block"><strong>${r.equation}</strong><span>${transformed?r.after:r.before}</span></div><div class="cx-nuclear-count">${facts([['质子数 Z',transformed?r.p+r.dp:r.p],['质量数 A',r.p+r.n+(transformed?r.dp+r.dn:0)]])}</div><button class="btn secondary" data-ray-transform>${transformed?'↺ 看转变前':'演示一次转变 →'}</button>`;
      const xShield=260;
      let end=490,opacity=1,explain='没有屏障，示意束继续传播。';
      if(shield!=='none'){
        if(ray==='alpha'){end=xShield;opacity=0;explain='多数 α 粒子很容易被纸等薄层材料阻挡；这不代表摄入体内无害。';}
        else if(ray==='beta'){if(shield==='paper'){end=490;opacity=.8;explain='典型 β 粒子比 α 更容易穿透纸。实际结果与能量、纸厚有关。';}else{end=xShield+20;opacity=.08;explain='合适厚度的材料可显著减弱 β 粒子；不同能量及次级辐射需另行考虑。';}}
        else{opacity=shield==='dense'?.23:shield==='aluminium'?.7:.93;explain='γ 与 X 都是光子。这道屏障使强度减弱，不表示每个光子都在此停止；没有统一的“绝对穿透排名”。';}
      }
      let body=label(60,30,r.symbol,'middle',28,r.color)+label(260,30,shield==='none'?'无屏障':shield==='paper'?'纸张':shield==='aluminium'?'铝板':'致密材料','middle',12);
      body+=`<rect x="30" y="55" width="60" height="90" rx="15" fill="${r.color}" opacity=".18"/>`+label(60,107,'源','middle',17,r.color);
      if(shield!=='none')body+=`<rect x="${xShield}" y="45" width="${shield==='paper'?5:shield==='dense'?44:18}" height="110" rx="3" fill="${shield==='paper'?'#e5dbc3':shield==='dense'?'#9caba8':'#ccd7d2'}"/>`;
      [80,100,120].forEach(y=>{body+=`<path d="M93 ${y}H${shield==='none'?490:xShield}" stroke="${r.color}" stroke-width="${ray==='alpha'?5:2}" stroke-dasharray="${ray==='alpha'?'2 18':ray==='beta'?'5 12':'0'}" fill="none"/>`;if(shield!=='none'&&end>xShield)body+=`<path d="M${xShield+8} ${y}H${end}" stroke="${r.color}" stroke-width="2" opacity="${opacity}" stroke-dasharray="${ray==='beta'?'5 12':'0'}"/>`;});
      body+=label(290,180,'长度与亮度只是定性图示','middle',10);
      $(root,'#cx-shield-scene').innerHTML=svg(body,`${r.name} 遇到所选屏障的定性穿透示意`,540,195);
      $(root,'#cx-shield-note').textContent=explain;
    }
    const removeInput=bind(root,'input',event=>{
      if(event.target.id==='cx-decay-time'){stop();time=Number(event.target.value);update();}
      if(event.target.id==='cx-decay-count'){stop();total=Number(event.target.value);lifetimes=sampleLifetimes(total,seed);update();}
      if(event.target.id==='cx-decay-isotope'){stop();isotope=isotopes.find(i=>i.id===event.target.value);update();}
      if(event.target.id==='cx-shield'){shield=event.target.value;updateRadiation();}
    });
    const removeClick=bind(root,'click',event=>{
      if(checkpointHandler(root,ctx,event))return;
      if(event.target.closest('[data-decay-play]')){if(timer){stop();return;}if(time>=6)time=0;$(root,'[data-decay-play]').textContent='Ⅱ 暂停';timer=setInterval(()=>{time=Math.min(6,Math.round((time+.05)*100)/100);update();if(time>=6)stop();},150);}
      if(event.target.closest('[data-decay-reset]')){stop();time=0;update();}
      if(event.target.closest('[data-decay-new]')){lifetimes=sampleLifetimes(total,++seed);update();ctx.toast('换了一群原子：规律不变，单次结果会不同');}
      const rayButton=event.target.closest('[data-ray]');if(rayButton){ray=rayButton.dataset.ray;transformed=false;$$ (root,'[data-ray]').forEach(b=>{const active=b===rayButton;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});updateRadiation();}
      if(event.target.closest('[data-ray-transform]')){transformed=!transformed;updateRadiation();}
    });
    update();updateRadiation();return()=>{stop();removeInput();removeClick();};
  }

  function distillationDrawing(temperature,pressure,cooling,collected) {
    const bp=boilingPoint(pressure),boiling=temperature>=bp,water=200-collected,waterY=253-water/200*76;
    let body='<defs><clipPath id="cx-flask-clip"><circle cx="126" cy="195" r="59"/></clipPath></defs><rect x="22" y="281" width="548" height="9" rx="4" fill="#dbe5d6"/>';
    body+=`<rect x="67" y="${waterY}" width="118" height="90" fill="#b4dfdb" clip-path="url(#cx-flask-clip)"/><circle cx="126" cy="195" r="59" fill="#d3ebe71a" stroke="#719e95" stroke-width="3"/><path d="M108 139V77H145V139M127 77V50H210L408 145V191" fill="none" stroke="#79a599" stroke-width="6" stroke-linejoin="round"/>`;
    body+='<path d="M222 67L383 144" stroke="#b7dcd5" stroke-width="30" stroke-linecap="round"/><path d="M224 67L384 144" stroke="#638f86" stroke-width="3"/>';
    body+=`<path d="M127 109V50H210L408 145V199" stroke="${boiling?'#e8af7b':'#bfd6d0'}" stroke-width="2" fill="none" stroke-dasharray="${boiling?'5 8':'0'}" class="${boiling?'cx-flow':''}"/>`;
    body+='<path d="M235 64V36H282M372 149V179H337" fill="none" stroke="#80b4cc" stroke-width="3"/>';
    body+=label(285,30,'冷却水出口','middle',10)+label(333,196,'冷却水入口','middle',10);
    if(cooling)body+='<path d="M339 178H371V155M240 64V37H276" fill="none" stroke="#4c9bc1" stroke-width="2" stroke-dasharray="4 6" class="cx-flow"/>';
    body+=`<path d="M377 200V265Q377 274 386 274H469Q478 274 478 265V200" fill="#f7fbfa" stroke="#7ca197" stroke-width="3"/><rect x="380" y="${271-collected/180*61}" width="95" height="${collected/180*61}" rx="3" fill="#b3ddd9"/>`;
    body+='<rect x="78" y="257" width="97" height="22" rx="7" fill="#cbd7c7"/>';
    body+=label(126,272,`${fmt(Math.min(temperature,bp),1)} °C`,'middle',12,'#3e6f5a');
    if(boiling){for(let i=0;i<7;i++)body+=`<circle cx="${92+(i*19)%70}" cy="${214-(i*13)%40}" r="${3+i%3}" fill="none" stroke="#fff" stroke-width="1.7"/>`;if(cooling)body+=dot(409,210,4,'#6bbcc1');}
    for(let i=0;i<5;i++)body+=dot(92+i*17,238,3,'#5c938d');
    body+=label(126,320,`烧瓶：盐留下，水减少`,'middle',12)+label(422,320,`收集：${fmt(collected,0)} g 水`,'middle',12)+label(300,92,'冷凝管','middle',12)+label(126,22,`${fmt(pressure,1)} kPa`,'middle',12)+label(525,166,cooling?'冷却开':'冷却关','middle',11,cooling?'#087f6a':'#b58d6b');
    return svg(body,'盐水蒸馏：水汽经过冷凝管进入接收烧杯，盐留在原烧瓶',600,345);
  }
  const CHROMA_COLORS={red:{name:'红色组分',color:'#db817a',a:.62,b:.28},blue:{name:'蓝色组分',color:'#6c9bb8',a:.31,b:.77},yellow:{name:'黄色组分',color:'#d5b24d',a:.86,b:.55}};
  function chromatographyComponents(ink,solvent) {
    if(!['black','purple','green'].includes(ink)||!['a','b'].includes(solvent))throw new Error('未知色谱模型');
    return (ink==='black'?['red','blue','yellow']:ink==='purple'?['red','blue']:['blue','yellow']).map(key=>({...CHROMA_COLORS[key],rf:CHROMA_COLORS[key][solvent]}));
  }
  function separation(root,ctx) {
    let tab='distill',temperature=95,pressure=101.3,cooling=true,collected=0,filterSalt=5,filterSand=10,filterProgress=0,crystalSalt=20,evaporated=0,chromaProgress=0,ink='black',solvent='a',submerged=false;
    const tabNames={distill:['蒸馏','让水旅行一次'],filter:['过滤','留下不溶颗粒'],crystal:['蒸发结晶','把盐找回来'],chroma:['色谱','拆开隐藏的颜色']};
    root.innerHTML=`<div class="cx cx-separation"><div class="cx-intro"><span class="eyebrow">混合物分离工坊</span><h2>${modeText(ctx,'把混在一起的东西，分开！','分离、提纯与物态变化')}</h2><p>${modeText(ctx,'沙子、盐和水混在一起，要选哪一种办法？每件工具都有自己的本领。','按粒子大小、挥发性、溶解度和两相间分配差异，选择合适的方法。')}</p></div><div class="cx-exhibit-tabs">${Object.entries(tabNames).map(([id,names])=>`<button class="${id===tab?'is-active':''}" data-separation-tab="${id}" aria-pressed="${id===tab}"><strong>${names[0]}</strong><span>${names[1]}</span></button>`).join('')}</div><div id="cx-separation-inner"></div>${checkpoint('separation-choice','为目标选择方法','想从盐水中收集水，最合适的方法是？',['普通滤纸过滤','蒸馏并冷凝收集','只把盐水放着蒸干'],1,'盐离子会穿过普通滤纸；蒸馏让水汽冷凝，水被收集，非挥发性的盐留在原处。')}${sources([['NIST 水蒸气数据','https://webbook.nist.gov/cgi/cbook.cgi?ID=C7732185&Mask=4'],['PubChem 食盐溶解度','https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-Chloride'],['RSC 色谱','https://edu.rsc.org/resources/chromatography/1301.article']])}</div>`;
    function renderTab() {
      const descriptions={distill:modeText(ctx,'水变成看不见的水蒸气，再在冷凝管里变回小水滴。盐没有一起旅行。','蒸馏利用挥发性差异，包含汽化和冷凝。此处只计算水与非挥发性 NaCl 的理想分离。'),filter:modeText(ctx,'滤纸像一道门：沙粒留在门口，水和已经溶解的盐能通过。','理想普通过滤保留不溶沙粒，溶解的 Na⁺、Cl⁻ 随滤液通过。滤液清澈不代表没有溶质。'),crystal:modeText(ctx,'水越来越少，能藏在水里的盐也越来越少，多出来的盐就变成小晶体。','蒸发移去溶剂；在给定温度下，超过溶解度的溶质成为固相。这里每一步均回到 25°C 的平衡状态。'),chroma:modeText(ctx,'一滴深色墨水里，可能藏着好几种颜色。它们在纸上跑得快慢不一样。','各组分在流动相和固定相之间的分配不同，形成不同迁移距离。切换模型溶剂，观察顺序如何改变。')};
      let controls='',foot='';
      if(tab==='distill'){
        controls=`${range('cx-distill-temp','加热设定',20,120,1,temperature,' °C')}${range('cx-distill-pressure','外界压强',50,101.3,.1,pressure,' kPa')}${check('cx-distill-cooling','冷凝管中有冷却水',cooling)}<div class="cx-inline-actions"><button class="btn primary" data-collect>收集 20 g 水</button><button class="btn secondary" data-distill-reset>重新开始</button></div><p id="cx-distill-feedback" class="cx-feedback" role="status">先观察当前温度，能开始沸腾吗？</p>`;
        foot='纯水沸点由 NIST 的 Antoine 方程近似。盐水按稀溶液处理，忽略沸点升高、热损失与雾滴夹带；加热设定不等于沸腾液体温度。低于沸点也会蒸发，本关只计算沸腾收集阶段。';
      }else if(tab==='filter'){
        controls=`${range('cx-filter-salt','溶解的盐',0,20,1,filterSalt,' g')}${range('cx-filter-sand','不溶的沙粒',0,20,1,filterSand,' g')}${range('cx-filter-progress','这批混合物已过滤',0,100,1,filterProgress,' %')}<div class="cx-inline-actions"><button class="btn primary" data-filter-all>完成过滤</button><button class="btn secondary" data-filter-again>滤液再过一次</button></div><p id="cx-filter-feedback" class="cx-feedback" role="status">起始加入 100 g 水。试试：盐能被普通滤纸拦住吗？</p>`;
        foot='假定沙粒全部被滤纸截留，滤液无损失，起始混合物均匀。实际操作中的粒径、吸附和滤纸残留可能影响回收率。该模型不评估饮水安全。';
      }else if(tab==='crystal'){
        controls=`${range('cx-crystal-salt','起始食盐质量',5,60,1,crystalSalt,' g')}${range('cx-crystal-evap','100 g 水已蒸发',0,100,1,evaporated,' %')}<div class="cx-inline-actions"><button class="btn primary" data-crystal-more>再蒸发 10 g 水</button><button class="btn secondary" data-crystal-reset>把水补回去</button></div><p id="cx-crystal-feedback" class="cx-feedback" role="status"></p>`;
        foot='25°C 时 NaCl 溶解度按 36.0 g / 100 g 水计算。模型假定达到平衡，忽略过饱和、成核速率与其他杂质；“蒸发进度”不是实际所需时间。';
      }else{
        controls=`${select('cx-chroma-ink','选择一滴模型墨水',[['black','深色：红 + 蓝 + 黄'],['purple','紫色：红 + 蓝'],['green','绿色：蓝 + 黄']],ink)}${select('cx-chroma-solvent','流动相',[['a','模型溶剂 A'],['b','模型溶剂 B']],solvent)}${range('cx-chroma-progress','溶剂前沿行程',0,100,1,chromaProgress,' %')}${check('cx-chroma-submerged','让起点浸入溶剂，看看会怎样',submerged)}<div class="cx-inline-actions"><button class="btn primary" data-chroma-run>让溶剂前进</button><button class="btn secondary" data-chroma-reset>回到起点</button></div><p id="cx-chroma-feedback" class="cx-feedback" role="status"></p>`;
        foot='模型墨水和 A/B 溶剂的 Rf 是用于比较的演示参数，不代表特定商品或真实化学品的数据。Rf 只有在相同实验条件下才有比较意义；同色不一定是同一种物质。';
      }
      $(root,'#cx-separation-inner').innerHTML=`<div class="cx-work-grid"><section class="panel"><div class="cx-panel-top"><h3>${tabNames[tab][0]}观察台</h3><span class="chip">${tab==='distill'?'盐水 → 水 + 浓盐水':tab==='filter'?'沙 + 盐水 → 沙 / 盐水':tab==='crystal'?'25 °C · 平衡近似':'墨水中的组分'}</span></div><div id="cx-separation-scene" class="cx-scene"></div><div id="cx-separation-stats" aria-live="polite"></div>${note(foot)}</section><section class="panel"><span class="eyebrow">${tabNames[tab][1]}</span><p class="cx-lead">${descriptions[tab]}</p>${controls}<div id="cx-separation-insight" class="cx-equation-block"></div></section></div>`;
      $$ (root,'[data-separation-tab]').forEach(b=>{const active=b.dataset.separationTab===tab;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
      update();
    }
    function update(){
      updateRangeOutputs(root);
      if(tab==='distill'){
        const bp=boilingPoint(pressure),balance=distillationBalance(collected);
        $(root,'#cx-separation-scene').innerHTML=distillationDrawing(temperature,pressure,cooling,collected);
        $(root,'#cx-separation-stats').innerHTML=facts([['本模型的沸点',`${fmt(bp,1)} °C`],['已收集水',`${collected} g`],['烧瓶剩余水',`${balance.waterRemaining} g`],['烧瓶中的盐',`${balance.saltRemaining} g`]]);
        $(root,'#cx-separation-insight').innerHTML=`<strong>${collected} g + ${balance.residue} g = 205 g</strong><span>接收器 + 原烧瓶，总质量保持不变。${pressure<90?'压强降低，沸点也降低。':''}</span>`;
        $(root,'[data-collect]').disabled=collected>=180;
      }else if(tab==='filter'){
        const f=filterProgress/100;
        let body='<rect x="65" y="40" width="190" height="115" rx="15" fill="#e8f1e9"/>'+label(160,65,'待过滤的混合物','middle',12);
        for(let i=0;i<Math.ceil(filterSand*(1-f));i++)body+=dot(86+(i*29)%149,88+(i*17)%42,4,'#b29774');
        for(let i=0;i<Math.ceil(filterSalt*(1-f));i++)body+=dot(97+(i*33)%128,91+(i*21)%42,7,i%2?'#9cbccd':'#89b1a1',i%2?'−':'+');
        body+='<path d="M310 67L500 67L418 161V185H392V161Z" fill="#f6f5e9" stroke="#95b1a0" stroke-width="2"/><path d="M327 81L405 143L483 81" fill="#ede6d4" stroke="#cec4a8"/>'+label(408,38,'普通滤纸','middle',12);
        for(let i=0;i<Math.ceil(filterSand*f);i++)body+=dot(365+(i*17)%80,86+(i*11)%25,4,'#b29774');
        body+='<path d="M316 198V296H496V198" fill="#f3f9f6" stroke="#7ea494" stroke-width="2"/>';
        body+=`<rect x="320" y="${293-f*72}" width="172" height="${f*72}" fill="#c3e4df"/>`;
        for(let i=0;i<Math.ceil(filterSalt*f);i++)body+=dot(338+(i*37)%137,278-(i*19)%Math.max(10,f*58),8,i%2?'#8db2c8':'#69a595',i%2?'−':'+');
        body+=label(160,184,`剩余原料 ${fmt((100+filterSalt+filterSand)*(1-f),1)} g`,'middle',11)+label(405,321,'滤液：水 + 已溶解的盐','middle',12)+'<path d="M271 114H300M294 107L301 114L294 121" stroke="#719d89" stroke-width="2" fill="none"/>';
        $(root,'#cx-separation-scene').innerHTML=svg(body,'滤纸保留沙粒，盐离子随水进入滤液',580,345);
        $(root,'#cx-separation-stats').innerHTML=facts([['滤纸上的沙',`${fmt(filterSand*f,1)} g`],['滤液中的盐',`${fmt(filterSalt*f,1)} g`],['滤液中的水',`${fmt(100*f,1)} g`],['已过滤比例',`${filterProgress}%`]]);
        $(root,'#cx-separation-insight').innerHTML='<strong>清澈 ≠ 纯净</strong><span>盐已经分散为微观离子，普通滤纸拦不住它们。再过滤也不能把盐水变成纯水。</span>';
      }else if(tab==='crystal'){
        const water=100-evaporated,result=crystallization(crystalSalt,water);
        let body='<ellipse cx="280" cy="263" rx="179" ry="30" fill="#dae5d6"/><path d="M115 117Q107 273 280 273Q453 273 445 117" fill="#f7faf5" stroke="#88a393" stroke-width="3"/>';
        if(water>0)body+=`<path d="M${122+evaporated*.2} ${254-water*1.04}Q280 ${240-water*1.04} ${438-evaporated*.2} ${254-water*1.04}Q413 264 280 264Q147 264 ${122+evaporated*.2} ${254-water*1.04}" fill="#c5e4df"/>`;
        body+='<ellipse cx="280" cy="117" rx="165" ry="18" fill="none" stroke="#88a393" stroke-width="3"/>';
        for(let i=0;i<Math.min(70,Math.ceil(result.crystals*2));i++){const x=190+(i*43)%182,y=231+(i*17)%24;body+=`<rect x="${x}" y="${y}" width="8" height="8" fill="#fff" stroke="#b7c5c5" transform="rotate(${i*29%65} ${x+4} ${y+4})"/>`;}
        if(evaporated>0)for(let i=0;i<5;i++)body+=`<path d="M${205+i*37} 102q-13-15 0-29t0-29" stroke="#b7d4cb" stroke-width="2" fill="none" stroke-dasharray="5 6" class="cx-flow"/>`;
        body+=label(280,23,`蒸发到空气中的水：${evaporated} g`,'middle',12)+label(280,315,result.crystals>0?'看，固体食盐出现了！':'盐还全部溶在水里','middle',15,'#4d795d');
        $(root,'#cx-separation-scene').innerHTML=svg(body,'水逐渐蒸发，超过溶解度的食盐析出成为固体',560,345);
        $(root,'#cx-separation-stats').innerHTML=facts([['剩余水',`${water} g`],['仍溶解的盐',`${fmt(result.dissolved,2)} g`],['固体食盐',`${fmt(result.crystals,2)} g`],['食盐总量',`${crystalSalt} g`]]);
        $(root,'#cx-separation-insight').innerHTML=`<strong>${fmt(result.dissolved,2)} + ${fmt(result.crystals,2)} = ${crystalSalt} g</strong><span>溶解的盐 + 固体盐 = 起始食盐。水走了，盐没有消失。</span>`;
        $(root,'#cx-crystal-feedback').textContent=result.crystals>0?'现在有固体。把水补回去，看看它会不会再溶解。':'继续移去一些水，什么时候开始出现晶体？';
        $(root,'[data-crystal-more]').disabled=evaporated>=100;
      }else{
        const f=chromaProgress/100,components=chromatographyComponents(ink,solvent),base=submerged?302:264,front=264-f*202;
        let body='<rect x="191" y="15" width="193" height="302" rx="8" fill="#f4f8f3" stroke="#a9b9ac" stroke-width="2"/><rect x="207" y="32" width="161" height="273" fill="#fffdf0" stroke="#d9d9bf"/><rect x="193" y="289" width="189" height="26" fill="#c1e2dc"/>';
        body+=`<line x1="207" x2="368" y1="${base}" y2="${base}" stroke="#9da797" stroke-dasharray="4 4"/>`+label(181,base+4,'起点','end',12);
        if(!submerged){body+=`<rect x="208" y="${front}" width="159" height="${264-front}" fill="#dfeedd" opacity=".38"/><line x1="207" x2="368" y1="${front}" y2="${front}" stroke="#8eab8b" stroke-dasharray="5 5"/>`+label(392,front+4,'溶剂前沿','start',12);components.forEach((c,i)=>{body+=`<ellipse cx="${262+i*24}" cy="${base-f*202*c.rf}" rx="${f>0?11:7}" ry="${f>0?8:6}" fill="${c.color}" opacity=".83"/>`;});}
        else body+='<ellipse cx="285" cy="302" rx="74" ry="12" fill="#948eaf" opacity=".38"/>';
        body+=label(287,341,submerged?'起点浸没：样品会直接进入溶剂':'样品起点要高于溶剂液面','middle',12);
        $(root,'#cx-separation-scene').innerHTML=svg(body,'纸色谱中不同组分随溶剂前沿上升，迁移距离不同',570,355);
        $(root,'#cx-separation-stats').innerHTML=facts(components.map(c=>[c.name+' · Rf',submerged||f===0?'待有效展开':fmt(c.rf,2)]));
        $(root,'#cx-separation-insight').innerHTML='<strong>Rf = 组分距离 / 前沿距离</strong><span>两段距离都从同一条起始线量起。改变溶剂后，迁移次序也可能改变。</span>';
        $(root,'#cx-chroma-feedback').textContent=submerged?'起点被淹没，样品可能洗入溶剂，这次不能按正常色谱计算。':f===0?'让溶剂前进，看看同一滴墨水能分出几种组分。':'不同组分分开了。切换溶剂，比较它们的位置。';
        $(root,'[data-chroma-run]').disabled=chromaProgress>=100;
      }
    }
    const removeInput=bind(root,'input',event=>{
      const target=event.target,id=target.id,value=Number(target.value);
      if(id==='cx-distill-temp')temperature=value;if(id==='cx-distill-pressure')pressure=value;if(id==='cx-distill-cooling')cooling=target.checked;
      if(id==='cx-filter-salt')filterSalt=value;if(id==='cx-filter-sand')filterSand=value;if(id==='cx-filter-progress')filterProgress=value;
      if(id==='cx-crystal-salt')crystalSalt=value;if(id==='cx-crystal-evap')evaporated=value;
      if(id==='cx-chroma-ink')ink=target.value;if(id==='cx-chroma-solvent')solvent=target.value;if(id==='cx-chroma-progress')chromaProgress=value;if(id==='cx-chroma-submerged')submerged=target.checked;
      if(id.startsWith('cx-'))update();
    });
    const removeClick=bind(root,'click',event=>{
      if(checkpointHandler(root,ctx,event))return;
      const tabButton=event.target.closest('[data-separation-tab]');if(tabButton){tab=tabButton.dataset.separationTab;renderTab();return;}
      if(event.target.closest('[data-collect]')){const feedback=$(root,'#cx-distill-feedback');if(temperature<boilingPoint(pressure)){feedback.textContent='还没到本模型的沸腾温度。提高加热设定，或降低压强再观察。';return;}if(!cooling){feedback.textContent='水汽还需要冷凝成液体：打开冷却水，才能按本模型收集。';return;}collected=Math.min(180,collected+20);feedback.textContent=`成功收集 ${collected} g 水。盐仍留在烧瓶中。`;if(collected>=40)ctx.complete('separation-distill','让水旅行一次',`在 ${pressure} kPa 下分离并收集了 ${collected} g 水。`);update();}
      if(event.target.closest('[data-distill-reset]')){collected=0;$(root,'#cx-distill-feedback').textContent='重新放入 200 g 水与 5 g 盐。';update();}
      if(event.target.closest('[data-filter-all]')){filterProgress=100;$(root,'#cx-filter-progress').value=100;$(root,'#cx-filter-feedback').textContent=`过滤完成：${filterSand} g 沙留在滤紙上，${filterSalt} g 盐仍在滤液中。`;update();ctx.complete('separation-filter','过滤能分开什么','不溶沙粒被截留；溶解盐随水通过。');}
      if(event.target.closest('[data-filter-again]')){$(root,'#cx-filter-feedback').textContent=filterProgress===0?'先完成一部分过滤，才有滤液可以再次过滤。':`再次过滤也不能除去这 ${fmt(filterSalt*filterProgress/100,1)} g 已溶解的盐。`;}
      if(event.target.closest('[data-crystal-more]')){evaporated=Math.min(100,evaporated+10);$(root,'#cx-crystal-evap').value=evaporated;update();if(crystallization(crystalSalt,100-evaporated).crystals>0)ctx.complete('separation-crystal','找回盐晶体','溶剂减少，超过溶解度的盐成为固相。');}
      if(event.target.closest('[data-crystal-reset]')){evaporated=0;$(root,'#cx-crystal-evap').value=0;update();}
      if(event.target.closest('[data-chroma-run]')){chromaProgress=Math.min(100,chromaProgress+25);$(root,'#cx-chroma-progress').value=chromaProgress;update();if(!submerged&&chromaProgress>=75)ctx.complete('separation-chromatography','拆开隐藏的颜色','组分在两相间分配不同，迁移速度不同。');}
      if(event.target.closest('[data-chroma-reset]')){chromaProgress=0;$(root,'#cx-chroma-progress').value=0;update();}
    });
    renderTab();return()=>{removeInput();removeClick();};
  }

  const SOLUTIONS={
    salt:{name:'食盐水 · NaCl',kid:'盐进入水后分成带电的小伙伴。它看起来透明，也能传递电流。',adult:'NaCl 溶解时解离为 Na⁺、Cl⁻，是强电解质。这里采用中性 NaCl 模型，不代表所有盐溶液都中性。',equation:'NaCl(s) → Na⁺(aq) + Cl⁻(aq)',classification:'强电解质 · 已溶部分解离',positive:'Na⁺',negative:'Cl⁻'},
    sugar:{name:'蔗糖水 · C₁₂H₂₂O₁₁',kid:'糖看不见了，但糖分子还在。它们没有因此变成带电离子。',adult:'蔗糖溶解后主要以分子存在，是非电解质。“溶解”不等于“电离”。微弱背景电导来自水及实际杂质。',equation:'C₁₂H₂₂O₁₁(s) → C₁₂H₂₂O₁₁(aq)',classification:'非电解质 · 仍为分子',positive:'',negative:''},
    'strong-acid':{name:'稀盐酸 · HCl',kid:'盐酸在水里形成许多带电的小伙伴。加水后，它们分得更散。',adult:'理想稀溶液中 HCl 完全电离。极稀时必须计入水的自电离，稀释酸不会让它越过中性而变成碱。',equation:'HCl + H₂O → H₃O⁺ + Cl⁻',classification:'强酸 · 强电解质',positive:'H₃O⁺',negative:'Cl⁻'},
    'strong-base':{name:'稀氢氧化钠 · NaOH',kid:'这种溶液里有 OH⁻。加水会让溶液越来越接近中性。',adult:'NaOH 为强碱，本模型采用完全解离。25°C 下同时满足电荷守恒与 [H⁺][OH⁻] = 10⁻¹⁴。',equation:'NaOH(s) → Na⁺(aq) + OH⁻(aq)',classification:'强碱 · 强电解质',positive:'Na⁺',negative:'OH⁻'},
    'weak-acid':{name:'乙酸水溶液 · CH₃COOH',kid:'大部分乙酸仍是完整分子，只有一部分变成带电的小伙伴。',adult:'乙酸只部分电离。以 Ka = 1.8 × 10⁻⁵、25°C 理想模型求平衡，并包含水自电离。稀释时电离比例通常增大，但离子浓度会降低。',equation:'CH₃COOH + H₂O ⇌ CH₃COO⁻ + H₃O⁺',classification:'弱酸 · 弱电解质',positive:'H₃O⁺',negative:'Ac⁻'},
    water:{name:'理想纯水 · H₂O',kid:'水也有极少极少的带电小伙伴。这里的纯水没有空气和杂质来打扰。',adult:'25°C 理想纯水中 [H⁺] = [OH⁻] = 10⁻⁷ mol/L，pH = 7。实际暴露于空气的水会受 CO₂ 和杂质影响。',equation:'2H₂O ⇌ H₃O⁺ + OH⁻',classification:'仅有微量水自电离',positive:'H₃O⁺',negative:'OH⁻'}
  };
  function phColor(ph){const colors=['#c6646a','#d7756d','#e08c6d','#e7a878','#e6c172','#d4cc7c','#aac486','#79b58c','#72b2a0','#70aebe','#769fc5','#8992bf','#9c88b9','#af82ac','#b87696'];return colors[clamp(Math.round(ph),0,14)];}
  function phMeter(ph) {return `<div class="cx-ph-meter" aria-label="pH ${fmt(ph,3)}，刻度从 0 到 14"><div class="cx-ph-gradient"><i style="left:${clamp(ph,0,14)/14*100}%"></i></div><div class="cx-ph-numbers">${[0,2,4,6,8,10,12,14].map(n=>`<span>${n}</span>`).join('')}</div><div class="cx-ph-ends"><span>酸性</span><span>7 中性（25°C）</span><span>碱性</span></div></div>`;}
  function ionDrawing(kind,result,c){
    const solution=SOLUTIONS[kind],ionized=result.ionized||0;
    const brightness=kind==='sugar'||kind==='water'?.03:clamp((Math.log10(Math.max(2e-7,ionized*2))+7)/6,0,1);
    let body=`<defs><radialGradient id="cx-bulb-glow"><stop stop-color="#f2d68d" stop-opacity="${brightness*.6}"/><stop offset="1" stop-color="#f2d68d" stop-opacity="0"/></radialGradient></defs><circle cx="292" cy="62" r="54" fill="url(#cx-bulb-glow)"/><path d="M197 146V63H269M313 63H391V146" stroke="#99b4a0" stroke-width="3" fill="none"/><circle cx="291" cy="62" r="21" fill="${brightness>.05?'#f7e4ac':'#e8ece4'}" stroke="#95a78d" stroke-width="2"/><path d="M281 82H302M283 88H300" stroke="#869582" stroke-width="3"/><path d="M145 127V291Q145 303 159 303H425Q439 303 439 291V127" stroke="#80a193" stroke-width="3" fill="#fbfcf9"/><path d="M149 174Q225 168 295 175T435 174V289Q435 299 425 299H159Q149 299 149 289Z" fill="#d2e8e0"/><rect x="188" y="129" width="16" height="81" rx="4" fill="#a0b4ac"/><rect x="384" y="129" width="16" height="81" rx="4" fill="#a0b4ac"/>`;
    if(kind==='water'){
      for(let i=0;i<7;i++)body+=dot(179+(i*47)%232,228+(i*29)%45,11,'#a9c9bc','水');
      body+=label(291,263,'微量 H₃O⁺ / OH⁻ 未按比例画出','middle',11);
    }else if(kind==='sugar'){
      for(let i=0;i<10;i++){const x=173+(i*47)%238,y=228+(i*29)%53;body+=`<rect x="${x-12}" y="${y-9}" width="24" height="18" rx="7" fill="#d8c196"/>`+label(x,y+4,'糖','middle',10,'#6f604a');}
    }else{
      const pairs=kind==='weak-acid'?Math.max(1,Math.round(9*result.ionicFraction)):9;
      for(let i=0;i<9;i++){
        const x=177+(i*43)%224,y=225+(i*31)%56;
        if(i<pairs)body+=dot(x,y,11,'#72a898','+')+dot(x+15,y+8,10,'#8babc1','−');
        else body+=`<rect x="${x-12}" y="${y-8}" width="30" height="18" rx="8" fill="#b1c5ab"/>`+label(x+3,y+4,'HA','middle',9,'#4e6e55');
      }
    }
    body+=label(291,21,brightness<.1?'灯泡几乎不亮（示意）':brightness<.55?'灯泡较暗（示意）':'灯泡较亮（示意）','middle',12)+label(291,334,kind==='sugar'?'糖分子不带净电荷':kind==='water'?'理想纯水：背景导电很弱':`${solution.positive} 与 ${solution.negative} 可以移动`,'middle',12);
    return svg(body,'溶液中分子与离子示意，以及定性的导电灯泡',580,350);
  }
  function ions(root,ctx){
    let kind='salt',exponent=-2,dilution=0,acidMl=50,baseMl=0;
    root.innerHTML=`<div class="cx cx-ions"><div class="cx-intro"><span class="eyebrow">水里的微观世界</span><h2>${modeText(ctx,'糖水和盐水，看着一样吗？','电离、酸碱与中和')}</h2><p>${modeText(ctx,'都变透明了，为什么一杯能让小灯发亮，另一杯却很弱？到微观世界找答案。','把“溶解”“电离”“酸碱性”“导电性”分开理解，再看它们如何关联。')}</p></div><div class="cx-work-grid"><section class="panel"><div class="cx-panel-top"><h3>溶液微观观察镜</h3><span class="chip">25 °C · 理想稀溶液</span></div><div id="cx-ion-scene" class="cx-scene"></div><div id="cx-ion-meter"></div><div id="cx-ion-stats" aria-live="polite"></div>${note('颜色是指示效果示意，不是溶液本来的颜色。粒子图放大了稀少离子，不代表真实颗数或比例；灯泡只定性说明移动离子导电，不模拟电极副反应。')}</section><section class="panel"><span class="eyebrow">选择一杯溶液</span>${select('cx-ion-kind','溶质',Object.entries(SOLUTIONS).map(([id,s])=>[id,s.name]),kind)}<div id="cx-ion-description"></div>${range('cx-ion-concentration','初始溶质浓度',-8,-1,.25,exponent)}${range('cx-ion-dilution','逐级加水稀释',0,6,1,dilution)}<div class="cx-inline-actions"><button class="btn secondary" data-ion-dilute>再稀释 10 倍</button><button class="btn secondary" data-ion-reset>恢复浓度</button></div><div id="cx-ion-equation" class="cx-equation-block"></div><p id="cx-ion-model" class="cx-tiny"></p></section></div><section class="panel"><div class="cx-panel-top"><div><span class="eyebrow">酸 + 碱，会怎样？</span><h3>中和配平台</h3></div><span class="chip">两种溶液浓度均为 0.100 mol/L</span></div><div class="cx-neutral-grid"><div><div id="cx-neutral-scene" class="cx-scene"></div><div id="cx-neutral-meter"></div></div><div>${range('cx-neutral-acid','虚拟稀盐酸 HCl',0,100,1,acidMl,' mL')}${range('cx-neutral-base','虚拟稀 NaOH 溶液',0,100,1,baseMl,' mL')}<div class="cx-presets"><button class="chip" data-neutral-preset="50,25">酸过量</button><button class="chip" data-neutral-preset="50,50">恰好中和</button><button class="chip" data-neutral-preset="25,50">碱过量</button></div><div id="cx-neutral-stats" aria-live="polite"></div><button class="btn primary" data-neutral-check>检查这个中和点</button><p id="cx-neutral-feedback" class="cx-tiny" role="status"></p></div></div><div class="cx-equation-block"><strong>HCl + NaOH → NaCl + H₂O</strong><span>净离子方程式：H₃O⁺ + OH⁻ → 2H₂O（常简写为 H⁺ + OH⁻ → H₂O）</span></div>${note('按物质的量 1:1 中和，体积相加，25°C、忽略活度与混合放热。强酸强碱的这个等当点近似中性；弱酸或弱碱的等当点未必 pH = 7。')}</section>${checkpoint('ions-conductivity','酸碱性与导电性','食盐水的 pH 接近 7，可以说明它不导电吗？',['可以，中性就不导电','不可以，还要看能移动的离子'],1,'pH 反映酸碱性，不直接代表总离子浓度。中性的食盐水仍含 Na⁺、Cl⁻，能够导电。')}${sources([['OpenStax 电解质','https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes'],['OpenStax pH 与 pOH','https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh'],['OpenStax 弱酸平衡','https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases']])}</div>`;
    function update(){
      const c=kind==='water'?0:Math.pow(10,exponent-dilution),solution=SOLUTIONS[kind],result=global.ChemCore.solutionPH(kind,c),nearNeutral=Math.abs(result.pH-7)<.01;
      $(root,'#cx-ion-scene').innerHTML=ionDrawing(kind,result,c);
      $(root,'#cx-ion-meter').innerHTML=phMeter(result.pH);
      $(root,'#cx-ion-stats').innerHTML=facts(ctx.mode==='kids'?[['pH',fmt(result.pH,3)],['酸碱性',nearNeutral?'接近中性':result.pH<7?'酸性':'碱性']]:[['pH',fmt(result.pH,4)],['实际溶质浓度',`${sci(c)} M`],['[H⁺]',`${sci(result.hydrogen)} M`],['溶质电离比例',`${fmt(result.ionicFraction*100,3)}%`]]);
      $(root,'#cx-ion-description').innerHTML=`<span class="cx-status-chip">${solution.classification}</span><p class="cx-solution-text">${modeText(ctx,solution.kid,solution.adult)}</p>`;
      $(root,'#cx-ion-equation').innerHTML=`<strong>${solution.equation}</strong><span>${kind==='sugar'?'溶解了，仍是中性的糖分子。':kind==='weak-acid'?'双向箭头表示可逆平衡。Ac⁻ 是乙酸根 CH₃COO⁻ 的图示简写。':kind==='salt'?'强电解质说的是溶解部分的解离程度；不是“任何浓度下都导电很强”。':'H⁺ 是水合氢离子的常用简写。'}</span>`;
      $(root,'#cx-ion-model').textContent='理想稀溶液用浓度近似活度，包含水自电离。M = mol/L。实际电导还依赖离子种类、浓度、温度与装置。';
      $(root,'#cx-ion-concentration').disabled=kind==='water';$(root,'#cx-ion-dilution').disabled=kind==='water';$(root,'[data-ion-dilute]').disabled=kind==='water'||dilution>=6;
      updateRangeOutputs(root);$(root,'#cx-ion-concentration-out').textContent=kind==='water'?'没有外加溶质':`${sci(Math.pow(10,exponent))} mol/L`;$(root,'#cx-ion-dilution-out').textContent=`${fmt(Math.pow(10,dilution),0)} 倍`;
    }
    function updateNeutral(){
      const result=neutralization(acidMl,baseMl),ph=global.ChemCore.solutionPH(result.kind,result.concentration).pH;
      const neutral=result.volume>0&&Math.abs(result.acidMoles-result.baseMoles)<1e-12,status=result.volume===0?'尚未加入溶液':neutral?'恰好中和':result.kind==='strong-acid'?'酸过量':'碱过量';
      let body=`<path d="M110 58V267Q110 280 125 280H345Q360 280 360 267V58" fill="#f9fbf6" stroke="#92b0a0" stroke-width="3"/>`;
      const height=(acidMl+baseMl)/200*150;
      if(result.volume>0)body+=`<path d="M114 ${277-height}Q230 ${270-height} 356 ${277-height}V266Q356 276 345 276H125Q114 276 114 266Z" fill="${phColor(ph)}" opacity=".63"/>`;
      body+=label(235,39,status,'middle',16,'#416f55')+label(235,181,result.volume===0?'空容器':`pH ${fmt(ph,3)}`,'middle',27,'#234b3b')+label(235,306,`总体积：${acidMl+baseMl} mL`,'middle',12);
      $(root,'#cx-neutral-scene').innerHTML=svg(body,'强酸强碱按物质的量中和后的溶液',470,325);
      $(root,'#cx-neutral-meter').innerHTML=result.volume>0?phMeter(ph):'<p class="cx-tiny">拖动滑块，先加入一些溶液。</p>';
      $(root,'#cx-neutral-stats').innerHTML=facts([['HCl 的物质的量',`${fmt(result.acidMoles*1000,2)} mmol`],['NaOH 的物质的量',`${fmt(result.baseMoles*1000,2)} mmol`],['已反应的物质的量',`${fmt(result.waterMoles*1000,2)} mmol`],['剩余酸 / 碱',`${fmt(result.excess*1000,2)} mmol`]]);
      updateRangeOutputs(root);
      // 这两个控件用科学计数显示浓度与稀释倍数，不能被通用范围输出覆盖。
      $(root,'#cx-ion-concentration-out').textContent=kind==='water'?'没有外加溶质':`${sci(Math.pow(10,exponent))} mol/L`;$(root,'#cx-ion-dilution-out').textContent=`${fmt(Math.pow(10,dilution),0)} 倍`;
    }
    const removeInput=bind(root,'input',event=>{
      const id=event.target.id;
      if(id==='cx-ion-kind')kind=event.target.value;if(id==='cx-ion-concentration')exponent=Number(event.target.value);if(id==='cx-ion-dilution')dilution=Number(event.target.value);
      if(id.startsWith('cx-ion-'))update();
      if(id==='cx-neutral-acid')acidMl=Number(event.target.value);if(id==='cx-neutral-base')baseMl=Number(event.target.value);
      if(id.startsWith('cx-neutral-')){$(root,'#cx-neutral-feedback').textContent='';updateNeutral();}
    });
    const removeClick=bind(root,'click',event=>{
      if(checkpointHandler(root,ctx,event))return;
      if(event.target.closest('[data-ion-dilute]')){dilution=Math.min(6,dilution+1);$(root,'#cx-ion-dilution').value=dilution;update();}
      if(event.target.closest('[data-ion-reset]')){dilution=0;$(root,'#cx-ion-dilution').value=0;update();}
      const preset=event.target.closest('[data-neutral-preset]');if(preset){[acidMl,baseMl]=preset.dataset.neutralPreset.split(',').map(Number);$(root,'#cx-neutral-acid').value=acidMl;$(root,'#cx-neutral-base').value=baseMl;$(root,'#cx-neutral-feedback').textContent='';updateNeutral();}
      if(event.target.closest('[data-neutral-check]')){const success=acidMl>0&&acidMl===baseMl;$(root,'#cx-neutral-feedback').textContent=success?'配对成功！两边浓度相同、体积相同，物质的量也相同。':acidMl+baseMl===0?'还没有溶液，空容器不算中和。':'还有一方过量。比较物质的量，再调一调。';$(root,'#cx-neutral-feedback').classList.toggle('is-correct',success);if(success)ctx.complete('ions-neutralization','找到强酸强碱中和点',`${acidMl} mL 0.100 mol/L HCl 与等量同浓度 NaOH 恰好中和。`);}
    });
    update();updateNeutral();return()=>{removeInput();removeClick();};
  }

  const LIFE={
    bread:{name:'面团为什么长大',tag:'发酵 / 产气',symbol:'CO₂',color:'#e6c388',kid:'面团里有许多小房间。酵母吃掉糖，放出二氧化碳，小房间鼓起来，面团就长大啦！',adult:'酵母发酵产生 CO₂，气体被面团结构保留。泡打粉则包含可产气的酸碱组分；两条途径都能膨松，却不是同一种反应。',equation:'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂↑',model:'以葡萄糖表示发酵的总反应，实际面团含多种成分；气泡和膨胀仅定性示意，不预测配方、体积或发酵时间。',question:'是谁把面团里的小房间撑起来？',answers:['新生成的二氧化碳','盐自己变大了','质子数量翻倍了'],correct:0,explanation:'酵母发酵或泡打粉反应生成气体，气体被面团结构保留，帮助膨松。',source:['RSC 酵母与面团','https://edu.rsc.org/experiments/yeast-and-the-expansion-of-bread-dough/1748.article'],defaults:{leavening:'yeast',progress:0}},
    apple:{name:'苹果为何变褐色',tag:'酶 / 氧化',symbol:'O₂',color:'#e0a08c',kid:'苹果切开后，里面的小帮手“酶”和空气一起，让表面慢慢变褐。我们能让这个过程慢下来吗？',adult:'切开破坏细胞结构，多酚氧化酶参与含氧的氧化反应，后续形成褐色产物。减少接触氧或改变酸度，可影响褐变速度。',equation:'多酚 + O₂ → 醌类 → 褐色产物（路径示意）',model:'褐变颜色不是食品是否安全的判断标准。这里比较单一因素的趋势，不给出真实反应速率；“覆盖”不意味着完全去除原有氧气。',question:'为什么覆盖切口可能延缓褐变？',answers:['减少与新鲜空气中氧的接触','把苹果变成另一种元素','让所有化学反应永久停止'],correct:0,explanation:'减少与氧接触可以影响酶促氧化；覆盖并不会让苹果停止所有变化。',source:['ACS 苹果褐变','https://www.acs.org/education/celebrating-chemistry-editions/2021-ncw/slowing-apple-browning.html'],defaults:{covered:false,acidic:false,progress:0}},
    rust:{name:'自行车为什么生锈',tag:'氧化还原 / 防护',symbol:'Fe',color:'#bf9b7d',kid:'铁遇上水和氧气，会慢慢换上一件红褐色的“锈衣服”。涂层完好时，能挡住这些小伙伴。',adult:'常见潮湿环境中，铁失电子，氧在水参与下被还原。铁锈是含水氧化物和羟基氧化物等的混合物，不是固定一种纯化合物。',equation:'Fe → Fe²⁺ + 2e⁻；O₂ + 2H₂O + 4e⁻ → 4OH⁻',model:'固定室温，表现水、氧、盐和完整涂层的作用趋势。真实腐蚀还受合金、pH、表面状态等影响，不预测使用寿命。',question:'保护铁，哪一种做法抓住了原因？',answers:['保持干燥或用完整涂层隔绝水和氧','给铁改一个名字','只把锈的颜色涂掉'],correct:0,explanation:'减少水、氧与铁接触，能从反应条件入手减缓常见锈蚀。',source:['ACS 海边腐蚀','https://www.acs.org/education/activities/coastal-chemistry.html'],defaults:{water:true,oxygen:true,coating:false,salty:false,progress:0}},
    soap:{name:'肥皂如何带走油',tag:'表面活性 / 硬水',symbol:'RCOO⁻',color:'#9db9b8',kid:'肥皂的一头喜欢水，一头喜欢油。许多肥皂小伙伴围住油滴，帮水把油带走。',adult:'肥皂的亲水头与疏水尾有助于分散油污。Ca²⁺、Mg²⁺ 可与皂根形成难溶物，消耗有效肥皂；泡沫多少不直接等于清洁效果。',equation:'2RCOO⁻ + Ca²⁺ → (RCOO)₂Ca↓',model:'胶束、油滴和沉淀未按比例绘制。“硬度”滑块是低到高的趋势，不是已标定的 mg/L；不模拟不同洗涤剂配方。',question:'硬水为什么会消耗一部分肥皂？',answers:['钙镁离子可与皂根形成难溶物','水把肥皂变成了氧气','泡泡把所有肥皂吃掉了'],correct:0,explanation:'硬水中的部分离子能与皂根生成难溶物，也就是常说的皂垢。',source:['ACS 皂垢与沉淀','https://www.acs.org/education/resources/k-8/inquiryinaction/fifth-grade/chapter-3/forming-a-precipitate.html'],defaults:{soap:true,hardness:0,progress:0}},
    egg:{name:'蛋清为什么变白',tag:'蛋白质 / 结构',symbol:'蛋白质',color:'#e9d49a',kid:'蛋白质像卷起来的长线。加热时它们舒展开、抱成一团，蛋清就不再像原来那样透明了。',adult:'加热使蛋白质空间结构改变并聚集，形成凝胶网络和更强的光散射。它不是单纯“水变白”，也不是某一种元素变成另一种元素。',equation:'折叠的蛋白质 → 展开 → 聚集（结构变化示意）',model:'这里只演示热变性与聚集的趋势，不给出食物烹饪或食用安全标准；不同蛋白质的变化温度并不相同。',question:'加热后蛋清变白，关键变化发生在哪？',answers:['蛋白质的结构与聚集状态','所有氧原子都变成氮原子','蛋清里的电子全部消失'],correct:0,explanation:'化学现象常与分子的排列、结构和相互作用有关，不必改变原子核。',source:['ACS 蛋白质热处理研究','https://pubs.acs.org/doi/10.1021/jf903536z'],defaults:{heating:true,progress:0}},
    scale:{name:'水壶里的白色水垢',tag:'硬度 / 沉淀',symbol:'CaCO₃',color:'#b5c4aa',kid:'有些水里藏着钙的小伙伴。加热后，它们能形成不易溶解的白色固体，留在水壶里。',adult:'含碳酸氢钙的水受热可形成 CaCO₃ 沉淀。煮沸能去除部分暂时硬度；不能据此认为所有硬度或溶解物都会消失。',equation:'Ca(HCO₃)₂ → CaCO₃↓ + CO₂↑ + H₂O',model:'本例专指碳酸氢钙型暂时硬度，箭头条件为受热。水垢量仅示意，实际受平衡、温度及其他离子影响。',question:'烧开后，水里的所有溶解物都会消失吗？',answers:['不会，只能使某些成分发生特定变化','会，沸腾等于完全提纯'],correct:0,explanation:'煮沸不等于蒸馏。非挥发性溶质未必离开水，也不是所有盐都会沉淀。',source:['USGS 水的硬度','https://www.usgs.gov/special-topics/water-science-school/science/hardness-water'],defaults:{heating:true,hardness:50,progress:0}},
    battery:{name:'电池怎样让灯亮',tag:'电子转移 / 电路',symbol:'e⁻',color:'#a8b4c2',kid:'这边金属送出电子，那边接收电子。电子沿着外面的导线走，点亮小灯；里面的离子也要帮忙。',adult:'锌铜原电池中锌氧化、Cu²⁺ 被还原。外电路传递电子；盐桥内离子迁移维持两侧电荷平衡。断路或离子通路缺失会阻碍持续电流。',equation:'Zn + Cu²⁺ → Zn²⁺ + Cu',model:'锌铜原电池为虚拟概念图，不代表所有商业电池；不计算真实电压、电流、电极动力学或内阻。',question:'盐桥和外部导线的作用相同吗？',answers:['不同：盐桥主要传递离子，导线传递电子','相同：都只有电子穿过'],correct:0,explanation:'持续的电流需要完整的电子通路与离子通路。两部分传递电荷的粒子不同。',source:['OpenStax 原电池','https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells'],defaults:{circuit:true,bridge:true,progress:0}},
    soda:{name:'汽水打开为什么冒泡',tag:'气体溶解 / 平衡',symbol:'CO₂',color:'#aec9b1',kid:'瓶子里本来就溶着二氧化碳。打开盖子，气体更容易离开水，跑出来变成小泡泡。',adult:'开瓶降低液面上方 CO₂ 的分压，原先溶解的 CO₂ 逐渐逸出。其他条件相同时，升温通常降低 CO₂ 在水中的溶解度。',equation:'CO₂(aq) ⇌ CO₂(g)',model:'比较开盖、温度与逸气趋势，不给出真实气压或气体体积。摇晃、成核点和配方等也影响可见气泡。',question:'开瓶冒出的气体，大多从哪里来？',answers:['原先已经溶在液体中的二氧化碳','瓶盖创造出来的新元素','外面的氧气全部变成了水'],correct:0,explanation:'气泡不一定代表生成了新物质；原先溶解的气体离开液体也会形成气泡。',source:['OpenStax 气体溶解度','https://openstax.org/books/chemistry-2e/pages/11-3-solubility'],defaults:{opened:false,warm:false,progress:0}}
  };
  // 生活展区参数用于表现因果方向；返回的 magnitude 是绘图进度，不是实验测量。
  function lifeOutcome(id,state) {
    if(!Object.prototype.hasOwnProperty.call(LIFE,id))throw new Error('未知生活化学场景');
    const s={...LIFE[id].defaults,...state},p=clamp(Number(s.progress)||0,0,100)/100;
    let magnitude=0,status='等待观察';
    if(id==='bread'){magnitude=s.leavening==='none'?0:p;status=s.leavening==='none'?'没有本例的产气来源':p===0?'面团刚刚准备好':p<.4?'小气泡开始出现':'气体把面团撑起来';}
    if(id==='apple'){magnitude=p*(s.covered?.18:1)*(s.acidic?.25:1);status=magnitude<.03?'切口仍较浅':magnitude<.3?'褐变较慢、颜色较浅':'切口逐渐变褐';}
    if(id==='rust'){magnitude=s.water&&s.oxygen&&!s.coating?Math.min(1,p*(s.salty?1.5:1)):0;status=s.coating?'完整涂层隔开反应环境':!s.water?'缺少水，常见锈蚀受抑制':!s.oxygen?'缺少氧，常见锈蚀受抑制':p===0?'开始观察裸露的铁':'潮湿环境下出现锈迹';}
    if(id==='soap'){magnitude=s.soap?p*(1-clamp(s.hardness,0,100)/100*.75):0;status=!s.soap?'油滴与水容易分开':s.hardness>65?'部分肥皂被消耗，皂垢增多':p===0?'准备观察肥皂的两端':'肥皂帮助分散油滴';}
    if(id==='egg'){magnitude=s.heating?p:0;status=!s.heating?'未加热，保持初始结构':p<.2?'刚开始加热':p<.6?'蛋白质逐渐展开并聚集':'蛋清逐渐变得不透明';}
    if(id==='scale'){magnitude=s.heating?p*clamp(s.hardness,0,100)/100:0;status=!s.heating?'未开启受热过程':s.hardness===0?'本例没有碳酸氢钙来源':magnitude<.05?'先观察水中的溶解成分':'部分钙形成白色固体';}
    if(id==='battery'){magnitude=s.circuit&&s.bridge?p:0;status=!s.circuit?'外电路断开，不能持续供电':!s.bridge?'缺少离子通路，不能持续供电':p>=1?'模型中的反应物已耗尽':'电子沿导线流动，离子维持平衡';}
    if(id==='soda'){magnitude=s.opened?p*(s.warm?1:.6):0;status=!s.opened?'盖子关闭，维持封闭条件':p===0?'刚刚开盖，开始观察':s.warm?'较暖时更容易逸出 CO₂':'开盖后溶解的 CO₂ 逐渐逸出';}
    return {magnitude:clamp(magnitude,0,1),status};
  }
  function blend(a,b,t){const pa=a.match(/\w\w/g).map(h=>parseInt(h,16)),pb=b.match(/\w\w/g).map(h=>parseInt(h,16));return '#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('');}
  function lifeDrawing(id,s){
    const outcome=lifeOutcome(id,s),f=outcome.magnitude;
    let body='<ellipse cx="290" cy="177" rx="235" ry="154" fill="#f0f5eb"/><ellipse cx="290" cy="303" rx="197" ry="15" fill="#dce7d4"/>';
    if(id==='bread'){
      const top=190-75*f;
      body+=`<path d="M128 213Q121 302 288 302Q455 302 448 213" fill="#b2c8b1" stroke="#729575" stroke-width="3"/><path d="M140 215Q150 ${top} 231 ${top-3}Q289 ${top-25} 347 ${top}Q433 ${top-7} 435 215Q289 258 140 215Z" fill="#ecd09e" stroke="#d8b17d" stroke-width="2"/><path d="M126 216Q288 265 450 216" fill="none" stroke="#729575" stroke-width="3"/>`;
      for(let i=0;i<Math.ceil(f*20);i++){const x=179+(i*43)%221,y=top+23+(i*19)%Math.max(12,205-top);body+=`<circle cx="${x}" cy="${y}" r="${3+i%4}" fill="#f8e5c0" opacity=".85"/>`;}
      body+=label(290,47,s.leavening==='yeast'?'酵母发酵':s.leavening==='powder'?'泡打粉产气':'没有膨松剂','middle',14)+label(290,338,'气体 + 能留住气体的面团结构','middle',12);
    }else if(id==='apple'){
      [177,402].forEach((x,i)=>{const v=i?f:0;body+=`<path d="M${x} 104C${x-84} 69 ${x-117} 151 ${x-73} 242Q${x-39} 296 ${x} 271Q${x+46} 297 ${x+78} 235C${x+113} 139 ${x+73} 72 ${x} 104Z" fill="#d5886e"/><path d="M${x} 115C${x-74} 85 ${x-95} 151 ${x-59} 232Q${x-35} 276 ${x} 255Q${x+38} 279 ${x+65} 224C${x+92} 139 ${x+65} 88 ${x} 115Z" fill="${blend('f7e6b4','a78058',v*.75)}"/><path d="M${x} 108q-7-27 12-39" stroke="#71945f" stroke-width="6" fill="none"/>`+dot(x-12,195,5,'#a48a63')+dot(x+12,200,5,'#a48a63')+label(x,324,i?'当前观察':'初始切面','middle',12);});
      if(s.covered)body+='<rect x="311" y="88" width="183" height="197" rx="37" fill="#eaf4f5" fill-opacity=".22" stroke="#a6c2c2" stroke-dasharray="7 5"/>';
      body+=label(290,43,s.acidic?'弱酸性环境下作比较':'同一种苹果的概念比较','middle',13);
    }else if(id==='rust'){
      body+='<g stroke="#93a8a0" stroke-width="7" fill="none"><circle cx="170" cy="235" r="69"/><circle cx="417" cy="235" r="69"/><path d="M170 235L225 125L293 235H170L302 144L417 235M302 144L278 95H260M207 125H246M396 114L383 131L417 235"/></g>';
      if(s.coating)body+='<path d="M170 235L225 125L293 235H170L302 144L417 235" stroke="#589b88" stroke-width="10" fill="none"/>';
      for(let i=0;i<Math.round(f*31);i++)body+=dot(190+(i*29)%190,151+(i*23)%82,4+(i%4),'#b2794d');
      body+=label(290,45,`${s.water?'有水':'干燥'} · ${s.oxygen?'有氧':'无氧'}${s.salty?' · 有盐':''}`,'middle',13)+label(290,334,'反应条件决定变化的机会','middle',12);
    }else if(id==='soap'){
      body+='<path d="M96 100V277Q96 296 116 296H464Q484 296 484 277V100" fill="#d3e9e31a" stroke="#8aaca0" stroke-width="3"/><path d="M100 159Q285 145 480 159V276Q480 292 464 292H116Q100 292 100 276Z" fill="#cbe3e0"/>';
      const r=58-25*f;body+=`<circle cx="290" cy="217" r="${r}" fill="#d6ad66" opacity=".86"/>`;
      if(s.soap&&s.progress>0)for(let i=0;i<18;i++){const angle=i/18*Math.PI*2;body+=`<line x1="${290+Math.cos(angle)*(r+6)}" y1="${217+Math.sin(angle)*(r+6)}" x2="${290+Math.cos(angle)*(r+21)}" y2="${217+Math.sin(angle)*(r+21)}" stroke="#679c8a" stroke-width="3"/>`+dot(290+Math.cos(angle)*(r+24),217+Math.sin(angle)*(r+24),5,'#639989');}
      if(s.soap&&s.progress>0)for(let i=0;i<Math.round(s.hardness/4*s.progress/100);i++)body+=`<rect x="${125+(i*53)%321}" y="${272+(i*7)%13}" width="9" height="5" fill="#fffdf1" stroke="#b7c6b7"/>`;
      body+=label(290,51,s.soap?'亲水头朝水 · 疏水尾朝油':'油和水不容易均匀混合','middle',13)+label(290,335,s.hardness>65?'更多硬度离子 → 可能有更多皂垢':'围住油滴，帮助它分散','middle',12);
    }else if(id==='egg'){
      body+='<ellipse cx="284" cy="214" rx="184" ry="87" fill="#a6b6a0"/><ellipse cx="284" cy="204" rx="176" ry="78" fill="#c7d3bd"/>';
      body+=`<path d="M160 175Q177 120 238 144Q291 113 323 148Q383 125 414 187Q439 234 380 242Q344 279 295 248Q224 282 190 242Q126 226 160 175Z" fill="${blend('d7d8b7','fffdf1',f)}" fill-opacity="${.35+.65*f}" stroke="#e6e2c7" stroke-width="2"/><ellipse cx="286" cy="193" rx="45" ry="40" fill="${blend('e9bf69','e2b364',f)}"/>`;
      for(let i=0;i<5;i++){const y=66+i*9;body+=`<path d="M98 ${y}q8-15 19 0t19 0t19 0" stroke="#7e9f8b" stroke-width="2" fill="none"/>`;}
      body+=label(196,80,'蛋白质结构变化 →','start',12)+label(290,331,s.heating?'展开与聚集，使光散射改变':'尚未加热','middle',13);
    }else if(id==='scale'){
      body+='<path d="M375 98Q492 98 463 208Q452 240 416 227" stroke="#94aaa0" stroke-width="17" fill="none"/><path d="M161 142L108 123L133 203L167 220" fill="#c5d8cc" stroke="#849e91" stroke-width="3"/><path d="M176 100H380L416 260Q422 291 387 291H164Q133 291 143 260Z" fill="#dbe7df" stroke="#8fa89a" stroke-width="3"/><rect x="169" y="91" width="218" height="22" rx="10" fill="#a5bbb0"/><rect x="247" y="70" width="62" height="25" rx="10" fill="#8ba393"/><path d="M162 180H397L410 256Q416 282 387 282H164Q144 282 151 256Z" fill="#afd4cf"/>';
      for(let i=0;i<Math.round(f*60);i++)body+=`<rect x="${164+(i*47)%230}" y="${263+(i*11)%16}" width="8" height="5" fill="#fffdf4"/>`;
      if(s.heating&&s.progress>0)for(let i=0;i<9;i++)body+=`<circle cx="${185+(i*31)%183}" cy="${235-(i*19)%49}" r="${2+i%4}" fill="none" stroke="#e6f7ec" stroke-width="2"/>`;
      body+=label(290,39,'暂时硬度 · 碳酸氢钙模型','middle',13)+label(290,331,'白色固体：主要示意 CaCO₃','middle',12);
    }else if(id==='battery'){
      const active=s.circuit&&s.bridge&&s.progress<100;
      body+='<path d="M70 154V289H245V154M350 154V289H525V154" fill="#f6faf5" stroke="#8caa99" stroke-width="3"/><rect x="73" y="202" width="168" height="83" fill="#d3e8e0"/>';
      body+=`<rect x="353" y="202" width="168" height="83" fill="#96c3d6" opacity="${1-f*.55}"/><rect x="114" y="140" width="${24-f*9}" height="119" rx="4" fill="#b2c0bc"/><rect x="464" y="140" width="${24+f*11}" height="119" rx="4" fill="#c6956d"/>`;
      if(s.bridge)body+='<path d="M204 228V156Q204 138 222 138H373Q392 138 392 156V228" stroke="#dacdb1" stroke-width="20" fill="none"/><path d="M204 228V156Q204 138 222 138H373Q392 138 392 156V228" stroke="#f3eee0" stroke-width="8" fill="none"/>';
      body+=`<path d="M127 140V68H274M317 68H477V140" fill="none" stroke="#94ad96" stroke-width="3"/><circle cx="294" cy="68" r="22" fill="${active?'#f4d38c':'#e2e9dc'}" stroke="#a8ac89" stroke-width="2"/>`;
      if(!s.circuit)body+='<path d="M166 68H211" stroke="#f0f5eb" stroke-width="7"/><path d="M166 68L205 48" stroke="#7c9e87" stroke-width="3"/>';
      if(active)body+='<path d="M145 68H264M327 68H458" stroke="#5e9b82" stroke-width="3" stroke-dasharray="3 15" class="cx-flow"/>';
      body+=label(294,26,'外电路：电子由锌侧 → 铜侧','middle',12)+label(145,320,'Zn → Zn²⁺ + 2e⁻','middle',12)+label(440,320,'Cu²⁺ + 2e⁻ → Cu','middle',12)+label(297,179,s.bridge?'盐桥：离子通路':'盐桥断开','middle',11);
    }else if(id==='soda'){
      body+='<path d="M235 82V139Q190 165 190 211V285Q190 302 208 302H369Q387 302 387 285V211Q387 165 342 139V82Z" fill="#edf5df" stroke="#91aa84" stroke-width="3"/><path d="M194 187Q290 177 383 187V284Q383 298 368 298H208Q194 298 194 284Z" fill="#d2dfa0"/>';
      body+=`<rect x="${s.opened?374:230}" y="${s.opened?55:63}" width="117" height="28" rx="8" fill="#86a573"/>`;
      for(let i=0;i<Math.round(f*33);i++)body+=`<circle cx="${213+(i*31)%148}" cy="${269-(i*29)%167}" r="${2+i%4}" fill="none" stroke="#fffdf0" stroke-width="2"/>`;
      if(s.opened&&s.progress>0)body+='<path d="M265 61l-6-18M291 58V37M316 61l7-18" stroke="#b0c596" stroke-width="2"/>';
      body+=label(290,27,`${s.opened?'打开瓶盖':'盖子关闭'} · ${s.warm?'较暖':'较凉'}`,'middle',13)+label(290,336,'气体离开溶液，也会出现气泡','middle',12);
    }
    return svg(body,LIFE[id].name+'的互动概念图',590,360);
  }
  function life(root,ctx){
    let scenario=ctx.params&&Object.prototype.hasOwnProperty.call(LIFE,ctx.params.scenario)?ctx.params.scenario:'bread';
    const states=Object.fromEntries(Object.entries(LIFE).map(([id,l])=>[id,{...l.defaults}]));
    root.innerHTML=`<div class="cx cx-life"><div class="cx-intro"><span class="eyebrow">厨房 · 家里 · 每一天</span><h2>${modeText(ctx,'化学，原来就在我身边','生活中的化学')}</h2><p>${modeText(ctx,'把“为什么呀”变成一次小探索。换一个条件，看看会发生什么！','每次只改变一个因素。连接看得见的现象与看不见的分子、离子和电子。')}</p></div><div class="cx-life-grid">${Object.entries(LIFE).map(([id,l])=>`<button class="cx-life-card ${id===scenario?'is-active':''}" data-life-scenario="${id}" aria-pressed="${id===scenario}"><span class="cx-life-symbol" style="--life-color:${l.color}">${l.symbol}</span><span><strong>${l.name}</strong><small>${l.tag}</small></span></button>`).join('')}</div><div id="cx-life-inner"></div></div>`;
    function render(){
      const l=LIFE[scenario],s=states[scenario];let controls='';
      if(scenario==='bread')controls=select('cx-life-leavening','选择膨松途径',[['yeast','酵母发酵'],['powder','泡打粉反应'],['none','不加膨松剂作比较']],s.leavening);
      if(scenario==='apple')controls=check('cx-life-covered','覆盖切口，减少接触新鲜空气',s.covered)+check('cx-life-acidic','在较弱酸性环境下比较',s.acidic);
      if(scenario==='rust')controls=check('cx-life-water','有水或潮湿环境',s.water)+check('cx-life-oxygen','有氧气接触',s.oxygen)+check('cx-life-salty','水中有盐',s.salty)+check('cx-life-coating','表面有完整的防护涂层',s.coating);
      if(scenario==='soap')controls=check('cx-life-soap','加入肥皂',s.soap)+range('cx-life-hardness','水的硬度：低 → 高',0,100,1,s.hardness);
      if(scenario==='egg')controls=check('cx-life-heating','对蛋清进行加热',s.heating);
      if(scenario==='scale')controls=check('cx-life-heating','开启受热变化',s.heating)+range('cx-life-hardness','碳酸氢钙含量：少 → 多',0,100,1,s.hardness);
      if(scenario==='battery')controls=check('cx-life-circuit','接通外部导线',s.circuit)+check('cx-life-bridge','接通盐桥中的离子通路',s.bridge);
      if(scenario==='soda')controls=check('cx-life-opened','打开瓶盖',s.opened)+check('cx-life-warm','比较较暖的同种汽水',s.warm);
      $(root,'#cx-life-inner').innerHTML=`<div class="cx-work-grid"><section class="panel"><div class="cx-panel-top"><h3>${l.name}</h3><span class="chip">${l.tag}</span></div><div id="cx-life-scene" class="cx-scene"></div><p id="cx-life-status" class="cx-observation" aria-live="polite"></p>${note(l.model)}</section><section class="panel"><span class="eyebrow">改变一个条件，再比较</span><p class="cx-lead">${modeText(ctx,l.kid,l.adult)}</p>${controls}${range('cx-life-progress','观察进程（示意）',0,100,1,s.progress,' %')}<div class="cx-inline-actions"><button class="btn primary" data-life-advance>${modeText(ctx,'再观察一会儿 →','推进观察 →')}</button><button class="btn secondary" data-life-reset>从头观察</button></div><div id="cx-life-equation" class="cx-equation-block"></div><button class="btn secondary cx-full" data-life-save>记下我的观察</button></section></div>${checkpoint(`life-${scenario}`,l.name,l.question,l.answers,l.correct,l.explanation)}${sources([l.source])}`;
      $$ (root,'[data-life-scenario]').forEach(b=>{const active=b.dataset.lifeScenario===scenario;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
      update();
    }
    function update(){
      const l=LIFE[scenario],s=states[scenario],outcome=lifeOutcome(scenario,s);
      $(root,'#cx-life-scene').innerHTML=lifeDrawing(scenario,s);
      $(root,'#cx-life-status').textContent=outcome.status;
      const equation=scenario==='bread'?(s.leavening==='powder'?'HCO₃⁻ + H⁺ → CO₂↑ + H₂O':s.leavening==='none'?'当前对照：没有酵母或泡打粉的产气途径':l.equation):l.equation;
      $(root,'#cx-life-equation').innerHTML=`<strong>${equation}</strong><span>${scenario==='apple'||scenario==='egg'?'这是过程说明，不是可以拿来计算产量的单一配平方程式。':scenario==='rust'?'上面是两个电极半反应；生成的铁锈成分比这个起始过程更复杂。':scenario==='scale'?'箭头条件：受热。白色固体是部分溶解成分的去向。':scenario==='soda'?'溶解平衡改变，不一定发生生成新物质的化学反应。':'比较现象，再解释背后的粒子变化。'}</span>`;
      $(root,'[data-life-advance]').disabled=s.progress>=100;updateRangeOutputs(root);
      const hardness=$(root,'#cx-life-hardness-out');if(hardness)hardness.textContent=s.hardness<25?'低':s.hardness>75?'高':'中等';
    }
    const removeInput=bind(root,'input',event=>{if(!event.target.id.startsWith('cx-life-'))return;const key=event.target.id.slice('cx-life-'.length);if(!(key in states[scenario]))return;states[scenario][key]=event.target.type==='checkbox'?event.target.checked:event.target.type==='range'?Number(event.target.value):event.target.value;update();});
    const removeClick=bind(root,'click',event=>{
      if(checkpointHandler(root,ctx,event))return;
      const card=event.target.closest('[data-life-scenario]');if(card){scenario=card.dataset.lifeScenario;render();return;}
      if(event.target.closest('[data-life-advance]')){states[scenario].progress=Math.min(100,states[scenario].progress+25);$(root,'#cx-life-progress').value=states[scenario].progress;update();}
      if(event.target.closest('[data-life-reset]')){states[scenario].progress=0;$(root,'#cx-life-progress').value=0;update();}
      if(event.target.closest('[data-life-save]')){const l=LIFE[scenario];ctx.saveNote({title:`生活观察：${l.name}`,body:`我看到：${lifeOutcome(scenario,states[scenario]).status}。\n背后的原因：${l.adult}\n模型范围：${l.model}`});ctx.toast('观察已记入笔记本');}
    });
    render();return()=>{removeInput();removeClick();};
  }

  const api={mount(route,container,ctx){const routes={periodic,atom,decay,separation,ions,life};if(!routes[route])throw new Error(`未知知识展区：${route}`);return routes[route](container,ctx);},sampleLifetimes,sampleRemaining,boilingPoint,distillationBalance,crystallization,neutralization,chromatographyComponents,lifeOutcome,lifeScenarios:Object.keys(LIFE)};
  global.ChemExplore=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
