/* English route: meaning first, explanations by choice, progress from two checked questions. */
(function(r){'use strict';
const KEY='family-lab.english.path.1',MAX_FILE=512000;
const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let record=null,rawRecord=null,readLocked=false,persistent=true,active=null,stageIndex=0,decorated=false;
const pendingDrafts={};
const model=()=>r.EnglishPathModel;
function ensureRecord(){
 if(record)return;
 record=model().blank();
 try{rawRecord=r.localStorage.getItem(KEY);if(rawRecord!==null)record=model().validate(JSON.parse(rawRecord));}
 catch(_){readLocked=true;persistent=false;}
}
function announce(t){const box=document.getElementById('path-status');if(box)box.textContent=t;}
function store(){
 if(readLocked){persistent=false;updateStorage();return false;}
 try{r.localStorage.setItem(KEY,JSON.stringify(record));persistent=true;}catch(_){persistent=false;}
 updateStorage();return persistent;
}
function storageText(){return readLocked?'路线记录未能读取：原记录不会被覆盖。本次内容暂存在内存，请导出。':persistent?'路线与练说只保存在这个浏览器。换设备前，请导出备份。':'浏览器暂时无法保存。本次内容仍在内存，请导出备份。';}
function updateStorage(){document.querySelectorAll('[data-path-storage]').forEach(n=>n.textContent=storageText());const b=document.getElementById('path-export-raw');if(b)b.hidden=!readLocked||rawRecord===null;}
function download(text,name,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function go(id){
 const button=document.querySelector('#lessons [data-lesson="'+id+'"]');
 const focusTitle=()=>{const title=document.getElementById('title');if(title){title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}};
 if(r.WorkshopTest?.select){r.WorkshopTest.select(id);focusTitle();return;}
 if(button){button.click();focusTitle();return;}
 if(location.hash!=='#'+id)location.hash=id;
}
function statusFor(id){return model().isCleared(record,id)?'已过双题':record.seen.includes(id)?'已探索':'可自由进入';}
function updateRoute(){
 const wrap=document.getElementById('path-route');if(!wrap||!record)return;
 const directoryOpen=wrap.querySelector('#path-directory')?.open||false;
 const summary=model().summary(record),stages=model().stages,lessons=model().catalog(),selected=stages[stageIndex];
 const next=model().lesson(summary.next)||lessons[0];
 wrap.innerHTML=`<div class="path-route-heading"><div><p class="eyebrow">ENGLISH · 一条能走下去的路</p><h2>从一句话，到一段话。</h2><p class="path-route-intro">看见意思，换个情境，再自己说。</p></div><div class="path-total"><strong>${summary.cleared}<span> / ${summary.total}</span></strong><span>课通过了双题检验</span></div></div><div class="path-progress" role="progressbar" aria-label="双题通过课程" aria-valuemin="0" aria-valuemax="${summary.total}" aria-valuenow="${summary.cleared}"><span style="width:${summary.cleared/summary.total*100}%"></span></div><div class="path-route-actions"><p>每课两道选择题都答对，才记录通过；看过、练说都不会增加通过数。</p><button class="primary" data-path-go="${escape(next.id)}">${summary.cleared===summary.total?'再练一课':'建议下一课'} <span>${escape(next.title)}</span> →</button></div><details id="path-directory" class="path-directory" ${directoryOpen?'open':''}><summary>展开课程地图 <span>8 个阶段 · 可自由跳转</span></summary><nav class="path-chapters" aria-label="八个学习阶段">${stages.map((s,i)=>{const done=summary.stages.find(x=>x.index===i)||{cleared:0,total:4};return `<button data-path-stage="${i}" aria-pressed="${i===stageIndex}" ${i===stageIndex?'aria-controls="path-chapter-lessons"':''}><span class="path-chapter-number">${String(i+1).padStart(2,'0')}</span><span>${escape(s.title)}<small>${done.cleared} / ${done.total} 课</small></span></button>`;}).join('')}</nav><div class="path-stage-label"><p><strong>${escape(selected.title)}</strong><span>${escape(selected.goal||'选一课，直接开始。')}</span></p><span>可自由跳转</span></div><div id="path-chapter-lessons" class="path-lesson-map">${lessons.filter(x=>x.stage===stageIndex).map(l=>`<button data-path-go="${escape(l.id)}" class="path-map-lesson ${l.id===active?'path-current':''} ${model().isCleared(record,l.id)?'path-cleared':''}" ${l.id===active?'aria-current="page"':''}><span class="path-map-index">${model().isCleared(record,l.id)?'✓':String(l.order+1).padStart(2,'0')}</span><strong>${escape(l.title)}</strong><span>${escape(l.mission)}</span><small>${statusFor(l.id)}</small></button>`).join('')}</div></details><details class="path-backup"><summary>学习记录与备份 <span>只存本机</span></summary><p data-path-storage class="tiny">${storageText()}</p><div class="controls"><button id="path-export">导出路线与练说</button><button id="path-export-raw" ${!readLocked||rawRecord===null?'hidden':''}>导出未能读取的原记录</button><label class="path-import-label">合并导入备份<input id="path-import" type="file" accept="application/json,.json"></label></div><p class="tiny">导入会合并已通过题目和已探索课程；同课练说保留当前浏览器的内容。路线记录与原来的三个实验记录分别保存。</p></details><p id="path-status" role="status" class="path-status"></p>`;
 wrap.querySelector('#path-export').onclick=()=>{download(JSON.stringify(record,null,2),'english-path-backup.json');announce('已导出路线与练说。');};
 wrap.querySelector('#path-export-raw').onclick=()=>{if(rawRecord!==null)download(rawRecord,'english-path-original-record.txt','text/plain');};
 wrap.querySelector('#path-import').onchange=async e=>{
  const input=e.target,f=input.files?.[0];if(!f)return;
  try{if(f.size>MAX_FILE)throw Error('文件超过 500 KB，请选择本馆导出的备份。');const incoming=model().validate(JSON.parse(await f.text()));record=model().merge(record,incoming);const ok=store();if(active&&mounted?.refreshDraft)mounted.refreshDraft();updateRoute();mounted?.refreshProgress?.();announce(ok?'已合并；当前同课练说已保留。':'已合并到内存，原记录未覆盖；请导出本次备份。');}
  catch(err){announce('未导入：'+(err.message||'备份格式不符合本馆要求。'));}finally{input.value='';}
 };
}
let mounted=null;
function decorate(){
 ensureRecord();
 if(!document.getElementById('path-route')){
  const main=document.getElementById('main');if(!main)return;
  const wrap=document.createElement('section');wrap.id='path-route';wrap.className='path-route';wrap.setAttribute('aria-label','英语学习路线');main.insertBefore(wrap,main.firstChild);
  wrap.onclick=e=>{const s=e.target.closest('[data-path-stage]'),b=e.target.closest('[data-path-go]');if(s){stageIndex=+s.dataset.pathStage;updateRoute();document.querySelector('[data-path-stage="'+stageIndex+'"]')?.focus({preventScroll:true});}if(b)go(b.dataset.pathGo);};
 }
 if(!decorated){
  document.getElementById('mode')?.addEventListener('click',()=>mounted?.updateDepth?.());
  decorated=true;
 }
 const toggle=document.getElementById('nav-toggle');if(toggle)toggle.textContent='☰ 全部课程与原有实验';
 updateRoute();
}
function mount(id,ctx){
 ensureRecord();const lesson=model().lesson(id);if(!lesson)return null;
 active=id;stageIndex=lesson.stage;document.body.classList.add('path-active');
 record={...record,seen:[...new Set([...record.seen,id])],last:id};store();
 const root=ctx.root,E=ctx.esc||escape,$=s=>root.querySelector(s);
 const chapter=document.getElementById('chapter');if(chapter)chapter.textContent=`英语路线 / 第 ${lesson.stage+1} 阶段 · 第 ${lesson.order+1} / ${model().catalog().length} 课`;
 let exampleIndex=0,transferIndex=0,screen='study',questionIndex=0,selection=null,submitted=false,correct=false;
 const detail=(summary,body,classes='')=>`<details class="path-explanation ${classes}"><summary>${summary}</summary>${body}</details>`;
 function roleBlocks(c){return `<div class="path-role-blocks" aria-label="这句话的角色积木">${c.parts.map((p,i)=>`<div class="path-role-block path-role-${i%4}"><span lang="en">${E(p.text)}</span><small>${E(p.role)}</small></div>`).join('')}</div>`;}
 function explanation(c){return detail('拆开这句话：英文、中文与角色',`<p class="path-explanation-en" lang="en">${E(c.en)}</p><p>${E(c.zh)}</p>${roleBlocks(c)}<p>${E(c.why)}</p>`);}
 function sceneCard(c,transfer=false){return `<div class="path-scene"><span class="path-scene-mark" aria-hidden="true">${transfer?'↗':'◌'}</span><div><p class="path-label">${transfer?'换了条件，再表达':'先看这次真实情境'}</p><p>${E(c.scene)}</p></div></div><div class="path-sentence-display"><span>${transfer?'换个情境说':'这一句怎么说'}</span><p lang="en">${E(c.en)}</p></div>${explanation(c)}`;}
 function tabs(items,type,index){return `<div class="path-case-tabs" role="group" aria-label="${type==='case'?'切换三个例子':'切换三个迁移情境'}">${items.map((c,i)=>`<button data-path-${type}="${i}" aria-pressed="${i===index}"><span>${i+1}</span>${E(c.label)}</button>`).join('')}</div>`;}
 function challengeDots(){return lesson.challenge.map((q,i)=>`<span class="${record.completed.includes(q.id)?'path-check-done':''}">${record.completed.includes(q.id)?'✓':'○'} ${i===0?'情境判断':'迁移判断'}</span>`).join('');}
 function render(){
  document.body.classList.toggle('path-challenging',screen==='challenge');
  const cleared=model().isCleared(record,id);
  root.innerHTML=`<div class="path-lesson-top"><span class="path-kicker">LESSON ${String(lesson.order+1).padStart(2,'0')}</span><span class="path-lesson-state ${cleared?'path-is-cleared':''}">${cleared?'✓ 两道题均已通过':'待完成两道判断'}</span></div><p class="path-mission">${E(lesson.mission)}</p><nav class="path-workflow" aria-label="本课活动"><button data-path-screen="study" aria-pressed="${screen==='study'}"><span>01</span>看懂与变换</button><button data-path-screen="challenge" aria-pressed="${screen==='challenge'}"><span>02</span>双题检验</button><button data-path-screen="produce" aria-pressed="${screen==='produce'}"><span>03</span>自己说一句</button></nav><div id="path-workspace" tabindex="-1"></div>`;
  if(screen==='study')renderStudy();else if(screen==='challenge')renderChallenge();else renderProduction();
  root.querySelectorAll('[data-path-screen]').forEach(b=>b.onclick=()=>{screen=b.dataset.pathScreen;if(screen==='challenge'){questionIndex=0;resetAnswer();}render();$('#path-workspace')?.focus({preventScroll:true});});
 }
 function renderStudy(){
  const c=lesson.cases[exampleIndex],v=lesson.transfer.variants[transferIndex];
  $('#path-workspace').innerHTML=`<section class="path-study-panel"><div class="path-section-heading"><div><p class="path-label">观察 · 让一句话对上意思</p><h2>同一个方法，三次看见</h2></div><span class="path-count">${exampleIndex+1} / 3</span></div>${tabs(lesson.cases,'case',exampleIndex)}<div id="path-example-scene">${sceneCard(c)}</div></section><section class="path-transfer-panel"><p class="path-label">迁移 · 不是只背刚才那句</p><h2>${E(lesson.transfer.prompt)}</h2>${tabs(lesson.transfer.variants,'variant',transferIndex)}<div id="path-transfer-scene">${sceneCard(v,true)}</div></section>${detail('为什么这样表达？从意思走到句子',`<p id="path-depth-explanation"></p><h3>${E(lesson.principle.question)}</h3><p>${E(lesson.principle.reason)}</p><ol>${lesson.principle.steps.map(x=>`<li>${E(x)}</li>`).join('')}</ol><p class="path-boundary"><strong>这次方法的边界</strong>${E(lesson.principle.boundary)}</p>`)}${detail('只改一点，意思有什么不同？',lesson.contrasts.map((p,i)=>`<article class="path-pair"><p class="path-label">对比 ${i+1} · ${p.judgement==='repair'?'识别本情境里需要修正的表达':p.judgement==='both'?'两句都能说，看看条件':'看看两句的意思差别'}</p><div class="path-pair-lines"><p><span>A</span><strong lang="en">${E(p.a)}</strong><small>${E(p.aZh)}</small></p><p><span>B</span><strong lang="en">${E(p.b)}</strong><small>${E(p.bZh)}</small></p></div><p>${E(p.reason)}</p></article>`).join(''))}${detail('带回生活：用处、误区与资料',`<div class="path-life-grid"><div><h3>在家试试</h3><p>${E(lesson.home)}</p></div><div><h3>长大以后</h3><p>${E(lesson.work)}</p></div></div><p><strong>容易误会</strong> ${E(lesson.trap)}</p><p><strong>学习边界</strong> ${E(lesson.limits)}</p><ul>${lesson.sources.map(([label,url])=>`<li><a href="${E(url)}" target="_blank" rel="noopener noreferrer">${E(label)} ↗</a></li>`).join('')}</ul><p class="tiny">情境、交互与题目为原创；资料用于核对语言用法，不代表为例句背书。</p>`)}<div class="path-study-bottom"><p>先想好意思，再去判断；双题检验时会收起这里的解释。</p><button class="primary" id="path-start-challenge">开始双题检验 →</button></div>`;
  updateDepth();
  root.querySelectorAll('[data-path-case]').forEach(b=>b.onclick=()=>{exampleIndex=+b.dataset.pathCase;renderStudy();root.querySelector('[data-path-case="'+exampleIndex+'"]')?.focus({preventScroll:true});});
  root.querySelectorAll('[data-path-variant]').forEach(b=>b.onclick=()=>{transferIndex=+b.dataset.pathVariant;renderStudy();root.querySelector('[data-path-variant="'+transferIndex+'"]')?.focus({preventScroll:true});});
  $('#path-start-challenge').onclick=()=>{screen='challenge';questionIndex=0;resetAnswer();render();$('#path-question-title')?.focus({preventScroll:true});};
 }
 function updateDepth(){const p=$('#path-depth-explanation');if(p)p.textContent=document.getElementById('mode')?.getAttribute('aria-pressed')==='true'?lesson.adult:lesson.child;}
 function resetAnswer(){selection=null;submitted=false;correct=false;}
 function renderChallenge(){
  const stateTag=root.querySelector('.path-lesson-state'),passed=model().isCleared(record,id);if(stateTag){stateTag.textContent=passed?'✓ 两道题均已通过':'待完成两道判断';stateTag.classList.toggle('path-is-cleared',passed);}
  const q=lesson.challenge[questionIndex];
  $('#path-workspace').innerHTML=`<section class="path-quiz"><div class="path-section-heading"><div><p class="path-label">双题检验 · 第 ${questionIndex+1} / 2 题</p><h2 id="path-question-title" tabindex="-1">${questionIndex===0?'认出这个意思':'换个情境再判断'}</h2></div><span class="path-count">${questionIndex===0?'情境':'迁移'}</span></div><div class="path-check-list" aria-label="本课已通过的题目">${challengeDots()}</div><p class="path-quiz-context" lang="en">${E(q.context)}</p><p class="path-quiz-prompt" lang="en">${E(q.prompt)}</p><fieldset class="path-options"><legend class="path-sr-only">Choose one answer</legend>${q.options.map((o,i)=>`<label class="path-option ${selection===i?'path-selected':''} ${submitted&&selection===i?(correct?'path-answer-right':'path-answer-wrong'):''}"><input type="radio" name="path-choice" value="${i}" ${selection===i?'checked':''} ${submitted?'disabled':''}><span class="path-option-letter">${'ABCD'[i]}</span><span lang="en">${E(o.text)}</span></label>`).join('')}</fieldset><div class="path-quiz-actions"><button id="path-submit" class="primary" ${selection===null||submitted?'disabled':''}>提交这一题</button>${submitted?'<button id="path-retry">重新作答这一题</button>':''}</div><div id="path-question-feedback" tabindex="-1" aria-live="polite">${submitted?feedback(q):'<p class="path-quiz-hint">先选一项，再提交。提交后才会显示解释。</p>'}</div><div class="path-quiz-nav">${questionIndex===1?'<button id="path-prev-question">← 上一道</button>':'<span></span>'}<button id="path-next-question" ${!submitted?'disabled':''}>${questionIndex===0?'下一道：迁移判断 →':'完成检验，自己说 →'}</button></div></section>`;
  root.querySelectorAll('input[name="path-choice"]').forEach(input=>input.onchange=()=>{selection=+input.value;root.querySelectorAll('.path-option').forEach(n=>n.classList.toggle('path-selected',n.contains(input)));$('#path-submit').disabled=false;});
  $('#path-submit').onclick=()=>{if(selection===null||submitted)return;const result=model().answer(record,id,q.id,selection);record=result.state;correct=result.correct;submitted=true;store();updateRoute();mounted?.refreshProgress();$('#path-question-feedback')?.focus({preventScroll:true});$('#path-question-feedback')?.scrollIntoView({block:'nearest'});};
  const retry=$('#path-retry');if(retry)retry.onclick=()=>{resetAnswer();renderChallenge();root.querySelector('input[name="path-choice"]')?.focus({preventScroll:true});};
  const prev=$('#path-prev-question');if(prev)prev.onclick=()=>{questionIndex=0;resetAnswer();renderChallenge();$('#path-question-title').focus({preventScroll:true});};
  $('#path-next-question').onclick=()=>{if(!submitted)return;if(questionIndex===0){questionIndex=1;resetAnswer();renderChallenge();$('#path-question-title').focus({preventScroll:true});}else{screen='produce';render();$('#path-production-title')?.focus({preventScroll:true});}};
 }
 function feedback(q){return `<div class="path-feedback ${correct?'path-feedback-right':'path-feedback-wrong'}"><p><strong>${correct?'✓ 这次判断正确':'这次尚未答对，再想一想'}</strong></p>${detail('查看本题反馈：为什么这样选',`<p>${E(q.options[selection].why)}</p><div class="path-feedback-explanation"><p lang="en">${E(q.options[q.answer].text)}</p><p>${E(q.translation)}</p><p>${E(q.explanation)}</p></div>${detail('逐项核对这四个选择',q.options.map((o,i)=>`<div class="path-option-explanation"><p lang="en"><strong>${'ABCD'[i]}.</strong> ${E(o.text)}</p><p>${E(o.why)}</p></div>`).join(''))}`)}<p class="tiny">${model().isCleared(record,id)?'本课两道题都已通过；可以继续练说或再次检验。':correct?'这道题已记录通过。还需要另一道题也答对，本课才会通过。':'本次没有新增通过记录。重答会清空当前选择与解释，已经通过的记录会保留。'}</p></div>`;}

 function renderProduction(){
  const cleared=model().isCleared(record,id),draft=Object.prototype.hasOwnProperty.call(pendingDrafts,id)?pendingDrafts[id]:(record.drafts[id]||'');
  $('#path-workspace').innerHTML=`<section class="path-production"><p class="path-label">输出 · 把英语变成自己的话</p><h2 id="path-production-title" tabindex="-1">现在，换你说。</h2><p>${E(lesson.nextUse)}</p><label for="path-draft">写一两句真实想说的话</label><textarea id="path-draft" maxlength="5000" placeholder="先想：谁？想表达什么？再试着写下英语。" spellcheck="true">${E(draft)}</textarea><div class="path-draft-row"><span id="path-draft-count">${draft.length} / 5000</span><button id="path-save-draft">保存这次练说</button></div><p id="path-draft-status" role="status" class="tiny">${Object.prototype.hasOwnProperty.call(pendingDrafts,id)?'尚未保存；点击“保存这次练说”后才写入记录。':record.drafts[id]!==undefined?(persistent?'已恢复这课保存的练说。':'已恢复这课练说；当前保存不可用，请导出备份。'):''}</p>${detail('自查时再打开：参考表达与检查方法',`<p>下面是本课的参考表达，不是你的句子的唯一答案。先对照意思、主体与时间，再检查词与词怎么搭配。</p><div class="path-reference">${lesson.transfer.variants.map(v=>`<div><p lang="en">${E(v.en)}</p><p>${E(v.zh)}</p></div>`).join('')}</div><ul><li>这句话说的是我真正想表达的事吗？</li><li>换了人、时间或语气，相应的表达也检查了吗？</li><li>拿不准的地方，能说清具体疑问，再查资料或请人帮助吗？</li></ul>`)}<p class="path-production-note">自由表达由你自查，本页不会自动判定这段文字是否正确，也不把保存练说计为通过。</p><div class="path-completion ${cleared?'path-completion-done':''}"><div><strong>${cleared?'✓ 本课双题已通过':'本课双题尚未全部通过'}</strong><p>${cleared?'意思看懂了，再把它用到生活中。':'可以先练说，再回到双题检验补上判断。'}</p></div><button id="path-production-review">${cleared?'再次检验':'继续双题检验'}</button></div><div class="path-production-nav"><button id="path-return-study">← 回到情境</button><button id="path-next-lesson" class="primary">${lesson.order===model().catalog().length-1?'回看建议课程':'前往下一课'} →</button></div><p class="tiny" data-path-storage>${storageText()}</p></section>`;
  $('#path-draft').oninput=()=>{pendingDrafts[id]=$('#path-draft').value.slice(0,5000);$('#path-draft-count').textContent=$('#path-draft').value.length+' / 5000';$('#path-draft-status').textContent='尚未保存；点击“保存这次练说”后才写入记录。';};
  $('#path-save-draft').onclick=()=>{record={...record,drafts:{...record.drafts,[id]:$('#path-draft').value.slice(0,5000)}};delete pendingDrafts[id];const ok=store();$('#path-draft-status').textContent=ok?'这次练说已保存在这个浏览器。':'这次练说仅暂存在内存，请导出备份。';};
  $('#path-production-review').onclick=()=>{screen='challenge';questionIndex=record.completed.includes(lesson.challenge[0].id)&&!record.completed.includes(lesson.challenge[1].id)?1:0;resetAnswer();render();$('#path-question-title')?.focus({preventScroll:true});};
  $('#path-return-study').onclick=()=>{screen='study';render();};
  $('#path-next-lesson').onclick=()=>{const next=model().catalog().find(l=>l.order===lesson.order+1)||model().lesson(model().summary(record).next);if(next)go(next.id);};
 }
 render();
 const api={state:()=>({pathLesson:id,pathScreen:screen,caseIndex:exampleIndex,transferIndex,questionIndex,selected:selection,submitted,correct,cleared:model().isCleared(record,id),pathRecord:JSON.parse(JSON.stringify(record)),pathStorage:{readLocked,persistent}}),updateDepth,refreshDraft:()=>{if(screen==='produce')renderProduction();},refreshProgress:()=>{const state=root.querySelector('.path-lesson-state'),ok=model().isCleared(record,id);if(state){state.textContent=ok?'✓ 两道题均已通过':'待完成两道判断';state.classList.toggle('path-is-cleared',ok);}if(screen==='challenge')renderChallenge();},stop(){},dispose(){if(mounted===api){mounted=null;active=null;document.body.classList.remove('path-active','path-challenging');updateRoute();}}};
 mounted=api;updateRoute();return api;
}
r.EnglishPathUI={mount,decorate,storageKey:KEY,state:()=>{ensureRecord();return {record:JSON.parse(JSON.stringify(record)),readLocked,persistent};}};
})(typeof window!=='undefined'?window:globalThis);
