/* Offline character explorer. Meaning, present-day form and etymology stay distinct. */
(function () {
  'use strict';
  const M=ChineseModel, D=ChineseData, entries=D.entries.slice().sort(M.compare);
  const byId=new Map(entries.map(e=>[e.id,e])), $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const link=(url,text)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`;
  const key='family-lab.chinese.v1';
  let saved={favorites:[],notes:{}}, storageOK=true;
  try { const raw=localStorage.getItem(key); if(raw)saved=M.validateBackup(JSON.parse(raw),entries); }
  catch(e){storageOK=false;}
  let current=byId.get('睡-shui4'), visible=entries, letter='', favoritesOnly=false;
  let writer=null, epoch=0, playing=false, paused=false, split=false, stroke=0, quoteIndex=0;
  let noticeTimer;
  function notice(text) { $('notice').textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').textContent='',5000); }
  function persist() {
    try { localStorage.setItem(key,JSON.stringify({app:'family-lab-chinese',version:1,...saved}));storageOK=true;return true; }
    catch(e){storageOK=false;notice('浏览器无法保存，请先导出记录。');return false;}
  }
  const highlight=(text,char)=>esc(text).split(esc(char)).join('<mark>'+esc(char)+'</mark>');
  function options() { for(const family of [...new Set(entries.map(e=>e.family))])$('family').add(new Option(family,family)); }
  function renderAlphabet() {
    const letters=new Set(entries.map(e=>M.normalize(e.numberPinyin)[0]));
    $('alphabet').innerHTML='<button data-letter="" aria-pressed="'+(!letter)+'">全部</button>'+Array.from('abcdefghijklmnopqrstuvwxyz').filter(c=>letters.has(c)).map(c=>`<button data-letter="${c}" aria-pressed="${letter===c}">${c.toUpperCase()}</button>`).join('');
  }
  function renderList() {
    $('count').textContent=`找到 ${visible.length} 个读音条目 · 全馆 ${new Set(entries.map(e=>e.char)).size} 字 / ${entries.length} 读音`;
    $('char-list').innerHTML=visible.length?visible.map(e=>`<button class="char-item" data-id="${e.id}" aria-current="${e.id===current.id}" aria-label="${e.char}，${M.pinyin(e.numberPinyin)}，${e.words[0]}"><span class="glyph">${e.char}</span><span>${M.pinyin(e.numberPinyin)}<small>${e.words[0]} · ${e.layout}</small></span><span class="star">${saved.favorites.includes(e.id)?'★':''}</span></button>`).join(''):'<p class="empty">这组条件下还没有字卡。<br>点“清除”重新找一找。</p>';
    $('favorites').setAttribute('aria-pressed',favoritesOnly);
    const index=visible.findIndex(e=>e.id===current.id);
    $('position').textContent=index>=0?`${index+1} / ${visible.length}`:'筛选外';
    $('prev').disabled=index<=0;$('next').disabled=index<0||index===visible.length-1;
    renderAlphabet();
  }
  function applyFilters() {
    visible=M.filter(entries,{query:$('search').value,letter,family:$('family').value,favoritesOnly,favorites:saved.favorites});
    $('lesson').hidden=!visible.length;
    if(visible.length&&!visible.some(e=>e.id===current.id))select(visible[0].id,false,false);
    else renderList();
  }
  function clearFilters() { $('search').value='';$('family').value='';letter='';favoritesOnly=false;visible=entries;$('lesson').hidden=false;renderList(); }
  function groupsFor(e) {
    const data=ChineseStrokes[e.char];
    if(e.layout==='独体'||!data)return null;
    if(e.char==='森')return [[0,1,2,3],[4,5,6,7],[8,9,10,11]];
    if(e.char==='众')return [[0,1],[2,3],[4,5]];
    const rad=data.radStrokes||[];
    if(rad.length===0||rad.length===data.strokes.length)return null;
    return [rad, data.strokes.map((_,i)=>i).filter(i=>!rad.includes(i))];
  }
  function drawCharacter(n) {
    const data=ChineseStrokes[current.char];
    if(!data){$('split-view').innerHTML='<p>字形资料未能加载；文字讲解仍可阅读。</p>';return;}
    const groups=groupsFor(current);const rad=new Set(data.radStrokes||[]);
    const paths=indices=>indices.map(i=>`<path d="${data.strokes[i]}" fill="${n!==undefined&&i>=n?'#dce1d5':rad.has(i)?'#286354':'#a46c3b'}"/>`).join('');
    const transforms=groups?groups.map(g=>{
      const points=g.flatMap(i=>data.medians[i]);
      const cx=points.reduce((v,p)=>v+p[0],0)/points.length;
      const cy=points.reduce((v,p)=>v+p[1],0)/points.length;
      const dx=(cx-512),dy=(cy-450),length=Math.hypot(dx,dy)||1;
      return split?`translate(${(dx/length*110).toFixed(2)} ${(dy/length*110).toFixed(2)})`:'translate(0 0)';
    }):[];
    const existing=$('split-view').querySelector('svg');
    if(groups&&n===undefined&&existing?.dataset.character===current.id&&existing.dataset.mode==='parts') {
      existing.setAttribute('aria-label',current.char+(split?'部件分开观察':'字形'));
      existing.querySelectorAll('g.part').forEach((g,i)=>g.setAttribute('transform',transforms[i]));
    } else {
      const markup=groups&&n===undefined?groups.map(g=>`<g class="part" transform="translate(0 0)">${paths(g)}</g>`).join(''):paths(data.strokes.map((_,i)=>i));
      // Use actual vector paths; leave room around separated pieces, without distorting the glyph.
      $('split-view').innerHTML=`<svg viewBox="-180 -70 1384 1164" data-character="${current.id}" data-mode="${n===undefined?'parts':'steps'}" role="img" aria-label="${esc(current.char)}${split?'部件分开观察':'字形'}"><g transform="translate(0 900) scale(1 -1)">${markup}</g></svg>`;
      const svg=$('split-view').firstElementChild;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{if(svg.isConnected)svg.querySelectorAll('g.part').forEach((g,i)=>g.setAttribute('transform',transforms[i]));}));
    }
    $('split-view').hidden=false;$('writer-view').hidden=true;
  }
  function stopWriter() {
    epoch++;playing=false;paused=false;
    if(writer){writer.pauseAnimation();writer.cancelQuiz();writer.hideCharacter({duration:0});writer=null;}
    $('writer-view').replaceChildren();$('pause').disabled=true;$('pause').textContent='暂停';
  }
  function resetCharacter() {
    stopWriter();split=false;stroke=0;drawCharacter();
    $('split').setAttribute('aria-pressed','false');
    $('stroke-status').textContent=`${ChineseStrokes[current.char]?.strokes.length||'—'} 笔 · 先看整体，再拆部件`;
  }
  function animate() {
    stopWriter();split=false;stroke=0;$('split').setAttribute('aria-pressed','false');
    if(!window.HanziWriter||!ChineseStrokes[current.char]){notice('笔顺资源未加载，请重新打开页面。');return;}
    const ownEpoch=epoch;
    $('split-view').hidden=true;$('writer-view').hidden=false;
    writer=HanziWriter.create($('writer-view'),current.char,{width:310,height:310,padding:25,showCharacter:false,showOutline:true,strokeColor:'#286354',radicalColor:'#a24736',outlineColor:'#dce1d5',strokeAnimationSpeed:Number($('speed').value),delayBetweenStrokes:150,
      charDataLoader:(char,onLoad)=>onLoad(ChineseStrokes[char])});
    const svg=$('writer-view').querySelector('svg');if(svg)svg.setAttribute('viewBox','0 0 310 310');
    playing=true;$('pause').disabled=false;$('stroke-status').textContent='正在逐笔演示；可暂停，也可重新播放。';
    writer.animateCharacter({onComplete:()=>{if(ownEpoch!==epoch)return;playing=false;$('pause').disabled=true;$('stroke-status').textContent=`${ChineseStrokes[current.char].strokes.length} 笔，演示完成。`;}}).catch(()=>{if(ownEpoch===epoch){notice('笔顺播放未完成，请点复位重试。');resetCharacter();}});
  }
  function renderQuotes() {
    const quotes=current.quotes.map(id=>D.quotes.find(q=>q.id===id));
    if(!quotes.length){$('quotes').innerHTML='<h3>先用自己的话，说清楚。</h3><p class="verse-explain">本字的这个读音暂未选入名句。旁边的句子是原创例句，不冒充诗人说过的话。</p><p class="small">试试“月”“春”“睡”，看看同一个字怎样走进诗句。</p><button data-jump="月-yue4">去读“月”的名句 →</button>';return;}
    quoteIndex%=quotes.length;const q=quotes[quoteIndex];
    $('quotes').innerHTML=`<div class="verse">${highlight(q.text.replace('，','，\n'),current.char)}</div><p class="verse-source">〔${q.dynasty}〕${q.author}《${q.title}》 · 节选</p><p class="verse-explain">${esc(q.explain)}</p>${link(q.url,'查看原文与版本')}<div class="quote-nav"><span>${quoteIndex+1} / ${quotes.length} 段</span>${quotes.length>1?'<button id="next-quote">换一句 →</button>':''}</div>`;
  }
  const partGloss={'目':'眼睛相关线索','垂':'历史上提示读音','亻':'人作偏旁','木':'树木相关线索','氵':'水作偏旁','青':'观察共同部件','忄':'心作偏旁','讠':'言作偏旁','日':'日字旁 / 日形','月':'月形部件','艹':'草字头','宀':'宝盖头','子':'子形部件','犭':'反犬旁','禾':'禾木旁 / 禾形','门':'门字框','口':'口形部件','心':'心字底 / 心形'};
  function renderRelated() {
    const family=current.family;
    const seen=new Set();const related=entries.filter(e=>e.family===family&&!seen.has(e.char)&&seen.add(e.char));
    $('related-title').textContent=family==='青字家族'?'换一个偏旁，意思就变了。':family+' · 找到下一条线索';
    $('related').innerHTML=related.filter(e=>e.char!==current.char).slice(0,12).map(e=>`<button data-jump="${e.id}"><strong>${e.char}</strong><small>${M.pinyin(e.numberPinyin)}</small></button>`).join('');
    $('related-hint').textContent=family==='青字家族'?'清水看氵，晴天看日，心情看忄，请问看讠，眼睛看目。相似部件可以帮忙，但不能保证所有字同音。':'这些字按学习主题放在一起，不表示它们都同音、同源或使用同一部首。';
  }
  function render() {
    const e=current;document.title=`${e.char} ${M.pinyin(e.numberPinyin)} · 语文探索馆`;
    $('family-label').textContent='语文 / '+e.family;
    $('title-char').textContent=e.char;$('title-pinyin').textContent=M.pinyin(e.numberPinyin);
    $('meaning').textContent=e.meaning;$('structure').textContent=e.layout+'结构';
    $('favorite').setAttribute('aria-pressed',saved.favorites.includes(e.id));$('favorite').textContent=saved.favorites.includes(e.id)?'★ 已收藏这个读音':'☆ 收藏这个读音';
    const readings=entries.filter(x=>x.char===e.char);
    $('readings').innerHTML=readings.length>1?'<span class="small">换个词读：</span>'+readings.map(x=>`<button data-reading="${x.id}" aria-pressed="${x.id===e.id}">${M.pinyin(x.numberPinyin)} · ${x.words[0]}</button>`).join(''):'<span class="small">当前常用读音 · '+M.pinyin(e.numberPinyin)+'</span>';
    $('parts').innerHTML=e.parts.map((p,i)=>(i?'<span class="plus">＋</span>':'')+`<div class="part-card">${p}<small>${esc(partGloss[p]||'字形部件')}</small></div>`).join('');
    $('structure-note').textContent=e.layout==='独体'?'独体字先观察整个字，不硬拆成几个词。':'部件卡表示现代字形观察，不是把几个词的意思机械相加。字形里的部件会缩窄、压扁或变形。';
    $('memory').textContent=e.memory;
    $('etymology').innerHTML=e.etymology?`<span class="tag">字源线索 · ${e.etymology.type}</span><p>${esc(e.etymology.text)}</p>${link(e.source,'核对：香港中文大学汉语多功能字库')}`:'<span class="tag">先分清：记字故事 ≠ 字源考证</span><p>上面的联想用来帮你认字；本卡不把现代部件故事当作已考定的造字历史。</p>';
    $('trap').textContent=e.trap;document.querySelector('.caution').open=false;
    $('words').innerHTML=e.words.map(w=>`<button data-word="${w}">${w}</button>`).join('');
    $('word-detail').textContent='点一个词，再带着它说一句话。';
    $('sentence').innerHTML=highlight(e.sentence,e.char);
    $('writing-prompt').textContent=`试着用“${e.words[0]}”或“${e.words[1]}”说一句自己的话。也可以把刚才的例句换一个人、地方或动作。`;
    $('my-sentence').value=saved.notes[e.id]||'';$('sentence-status').textContent='';
    $('dictionary-source').innerHTML=link(e.source,`查字与进一步核对：${e.sourceChar}`)+'。资料页可能列出本馆尚未教授的古义、异读和异体字。';
    $('split').disabled=!groupsFor(e);
    resetCharacter();renderQuotes();renderRelated();renderList();updateVoice();
  }
  function select(id,scroll=true,clear=true) {
    const e=byId.get(id);if(!e)return;
    if('speechSynthesis' in window)speechSynthesis.cancel();
    // Preserve the draft across navigation even before explicit Save is pressed.
    const draft=$('my-sentence').value;
    if(current&&draft!== (saved.notes[current.id]||'')) {if(draft.trim())saved.notes[current.id]=draft;else delete saved.notes[current.id];persist();}
    if(clear&&!visible.some(x=>x.id===id))clearFilters();
    current=e;quoteIndex=0;$('lesson').hidden=false;render();
    history.replaceState(null,'','#'+encodeURIComponent(e.id));
    if(scroll&&innerWidth<=800){$('catalog-panel').classList.remove('open');$('open-catalog').setAttribute('aria-expanded','false');$('lesson').scrollIntoView({block:'start'});$('lesson').focus({preventScroll:true});}
  }
  let composing=false;
  $('search').addEventListener('compositionstart',()=>composing=true);
  $('search').addEventListener('compositionend',()=>{composing=false;applyFilters();});
  $('search').addEventListener('input',()=>{if(!composing)applyFilters();});
  $('family').onchange=applyFilters;
  $('clear').onclick=()=>{clearFilters();$('search').focus();};
  $('alphabet').onclick=e=>{const b=e.target.closest('[data-letter]');if(b){letter=b.dataset.letter;applyFilters();}};
  $('char-list').onclick=e=>{const b=e.target.closest('[data-id]');if(b)select(b.dataset.id);};
  $('readings').onclick=e=>{const b=e.target.closest('[data-reading]');if(b)select(b.dataset.reading);};
  $('lesson').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(b)select(b.dataset.jump);if(e.target.id==='next-quote'){quoteIndex++;renderQuotes();}});
  $('start').onclick=()=>{clearFilters();select('睡-shui4');};
  $('favorites').onclick=()=>{favoritesOnly=!favoritesOnly;applyFilters();};
  $('favorite').onclick=()=>{const i=saved.favorites.indexOf(current.id);if(i<0)saved.favorites.push(current.id);else saved.favorites.splice(i,1);persist();$('favorite').setAttribute('aria-pressed',i<0);$('favorite').textContent=i<0?'★ 已收藏这个读音':'☆ 收藏这个读音';applyFilters();};
  $('prev').onclick=()=>{const i=visible.findIndex(e=>e.id===current.id);if(i>0)select(visible[i-1].id);};
  $('next').onclick=()=>{const i=visible.findIndex(e=>e.id===current.id);if(i>=0&&i<visible.length-1)select(visible[i+1].id);};
  $('open-catalog').onclick=()=>{const open=$('catalog-panel').classList.toggle('open');$('open-catalog').setAttribute('aria-expanded',open);if(open){$('catalog-panel').scrollIntoView({block:'start'});$('search').focus({preventScroll:true});}};
  $('split').onclick=()=>{stopWriter();split=!split;stroke=0;drawCharacter();$('split').setAttribute('aria-pressed',split);$('stroke-status').textContent=split?'分开观察：部件仍来自同一个字的笔画。':'合起来：再看它们原来的位置。';};
  $('animate').onclick=animate;
  $('pause').onclick=()=>{if(!writer||!playing)return;paused=!paused;if(paused)writer.pauseAnimation();else writer.resumeAnimation();$('pause').textContent=paused?'继续':'暂停';$('stroke-status').textContent=paused?'已暂停，点“继续”接着看。':'正在逐笔演示。';};
  $('step').onclick=()=>{stopWriter();split=false;$('split').setAttribute('aria-pressed','false');const n=ChineseStrokes[current.char].strokes.length;stroke=stroke>=n?1:stroke+1;drawCharacter(stroke);$('stroke-status').textContent=`第 ${stroke} / ${n} 笔 · 再点一次看下一笔`;} ;
  $('reset').onclick=resetCharacter;
  $('speed').onchange=()=>{if(playing)animate();};
  const wordDetails={'睡眠':'“睡眠”是休息的一种状态；可以说“充足的睡眠”。','入睡':'“入睡”强调开始睡着；可以说“慢慢入睡”。','午睡':'“午睡”指午间的睡眠；可以说“午睡一会儿”。','清水':'“清水”说水比较清；与“浑水”对照。','晴天':'“晴天”说天气；不能写成“清天”。','心情':'“心情”说心里的感受；可以说“愉快的心情”。','请问':'“请问”放在问题前，表达礼貌。','眼睛':'“眼睛”里睛常读轻声；不要因为青像清，就把睛读成qīng。','森林':'“森林”指大片树木生长的地方，不限三棵树。','休息':'“休息”是暂停活动、恢复精神；跑累了可以休息。','家人':'“家人”是家庭里亲近的人；可以说“关心家人”。'};
  $('words').onclick=e=>{const b=e.target.closest('[data-word]');if(!b)return;for(const el of $('words').querySelectorAll('button'))el.setAttribute('aria-pressed',el===b);const w=b.dataset.word;$('word-detail').textContent=wordDetails[w]||`用“${w}”试着表达一个具体情景。先想：这个词说的是事物、动作，还是感受？`;$('writing-prompt').textContent=`现在试着用“${w}”说一句话：谁，在哪里，发生了什么？`;};
  function saveSentence() {const text=$('my-sentence').value.slice(0,500);if(text.trim())saved.notes[current.id]=text;else delete saved.notes[current.id];const ok=persist();$('sentence-status').textContent=ok?'已保存在当前浏览器；可以导出备份。':'暂时只能保留在本页，请导出备份。';}
  $('save-sentence').onclick=saveSentence;
  $('check-sentence').onclick=()=>{const text=$('my-sentence').value.trim();$('sentence-status').textContent=!text?'先说一句，再把它写下来。':!text.includes(current.char)?`这句还没有用到“${current.char}”。把刚学的词放进去试试。`:`已经用到了“${current.char}”。再读一遍：谁做了什么？能不能加一个看到、听到或闻到的细节？这是写作提示，不是自动判分。`;};
  $('export').onclick=()=>{saveSentence();const data={app:'family-lab-chinese',version:1,...saved};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='语文探索馆-我的记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('backup-status').textContent='备份已生成，包含收藏和你写的句子。';};
  $('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>200000)throw Error('备份过大，未导入。');const parsed=JSON.parse(await file.text());M.validateBackup(parsed,entries);const draft=$('my-sentence').value;if(draft.trim())saved.notes[current.id]=draft;else delete saved.notes[current.id];saved=M.mergeBackup(saved,parsed,entries);const ok=persist();render();$('backup-status').textContent=ok?'已合并；原有句子不会被覆盖。':'已合并到本页，但浏览器无法保存，请导出。';}catch(err){$('backup-status').textContent='未导入：'+err.message;}finally{e.target.value='';}};
  function localVoice() {return 'speechSynthesis' in window?speechSynthesis.getVoices().filter(v=>v.localService&&/^zh(-|_)/i.test(v.lang)).sort((a,b)=>(/^zh[-_]CN$/i.test(b.lang)?1:0)-(/^zh[-_]CN$/i.test(a.lang)?1:0))[0]:null;}
  function updateVoice() {const voice=localVoice();$('speak').disabled=!voice;$('voice-status').textContent=voice?'朗读使用本地设备语音；多音字仍以本页拼音为准。':'此设备未提供本地中文语音，朗读暂不可用；拼音、文字与笔顺不受影响。';}
  if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',updateVoice);
  $('speak').onclick=()=>{const voice=localVoice();if(!voice)return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(current.sentence);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.8;utterance.onerror=()=>notice('设备语音未能播放，仍可按拼音读句。');speechSynthesis.speak(utterance);};
  const questions=[
    ['雨停了，太阳出来了，天气放□了。',['清','晴','情','请'],'晴','日字旁提示天气；清常说清水，情常说感情，请用于请求。'],
    ['小河的水很□，能看见水底的石子。',['晴','情','清','睛'],'清','三点水提示水；清水的清写氵。'],
    ['我睁大眼□，仔细观察。',['睛','晴','清','青'],'睛','目字旁提示眼睛。不要只按相似声音选字。'],
    ['□问，图书馆在哪里？',['情','请','清','睛'],'请','言字旁与说话有关；请问是一种礼貌说法。'],
    ['收到好消息，我的心□很好。',['请','晴','情','青'],'情','竖心旁与心里的感受有关。'],
    ['“一□书”，空格里选哪个字？',['末','本','木','未'],'本','一本书的本是量词；本和末的横画位置不同。'],
    ['“故事的□尾”，空格里选哪个字？',['本','木','末','未'],'末','末尾是最后部分；末的上横较长。'],
    ['“银行”的行，在这里怎么读？',['xíng','háng'],'háng','银行读yín háng；行走才读xíng zǒu。'],
    ['“音乐”的乐，在这里怎么读？',['lè','yuè'],'yuè','音乐读yīn yuè；快乐读kuài lè。'],
    ['“睡觉”的觉，在这里怎么读？',['jué','jiào'],'jiào','睡觉的觉读jiào；感觉、觉得里的觉读jué。'],
    ['“长大”的长，在这里怎么读？',['cháng','zhǎng'],'zhǎng','长大指成长；长短的长才读cháng。'],
    ['“眼皮垂下来”这句话，最合适的标签是什么？',['帮助记忆的联想','已经解释完所有字源'],'帮助记忆的联想','联想很好记，但睡的垂还有历史表音作用。记忆故事与字源线索要分开。']
  ];
  let qi=0, attempts=0;
  function renderQuiz(){const q=questions[qi];$('quiz-count').textContent=`第 ${qi+1} / ${questions.length} 题`;$('quiz-question').textContent=q[0];$('quiz-options').innerHTML=q[1].map((x,i)=>`<button data-answer="${i}">${esc(x)}</button>`).join('');$('quiz-feedback').textContent='';$('quiz-next').disabled=true;$('quiz-next').textContent=qi===questions.length-1?'完成这一轮':'下一题 →';}
  $('review').onclick=()=>{qi=0;attempts=0;renderQuiz();$('quiz').showModal();};
  $('quiz-options').onclick=e=>{const b=e.target.closest('[data-answer]');if(!b)return;const q=questions[qi];attempts++;const correct=q[1][Number(b.dataset.answer)]===q[2];b.classList.add(correct?'correct':'incorrect');$('quiz-feedback').textContent=correct?'选对了。'+q[3]:'再观察偏旁或词义，换一个答案试试。';if(correct){for(const el of $('quiz-options').children)el.disabled=true;$('quiz-next').disabled=false;}};
  $('quiz-next').onclick=()=>{if(qi<questions.length-1){qi++;renderQuiz();}else{$('quiz').close();notice(`完成了 ${questions.length} 道辨字练习；试着把其中一个词用在自己的句子里。`);}};
  addEventListener('hashchange',()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return;}if(byId.has(id)&&id!==current.id)select(id,false);else if(entries.some(e=>e.char===id))select(entries.find(e=>e.char===id).id,false);});
  options();let initial;try{initial=decodeURIComponent(location.hash.slice(1));}catch(e){initial='';}
  current=byId.get(initial)||entries.find(e=>e.char===initial)||current;render();
  if(!storageOK)notice('原有记录未能读取；请检查浏览器存储设置，并及时导出本页记录。');
  window.ChineseTest={ids:()=>entries.map(e=>e.id),state:()=>({id:current.id,visible:visible.map(e=>e.id),split,stroke,playing,paused,favorites:saved.favorites.slice(),notes:{...saved.notes}})};
})();
