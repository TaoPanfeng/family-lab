(function(){
'use strict';
const D=SocialData,C=KnowledgeCore,M=SocialModel,$=id=>document.getElementById(id);
const APP='family-lab-social',KEY=APP+'.v1',ids=D.entries.map(e=>e.id),byId=new Map(D.entries.map(e=>[e.id,e]));
const categories=new Map(D.categories.map(c=>[c.id,c]));
let records=C.empty(),selected=byId.get(location.hash.slice(1))||D.entries[0],shown=[],choice=null,revealed=false,mode='quiz',variant='full',font=18,storageReadBlocked=false;
const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
function announce(text){$('notice').textContent=text;clearTimeout(announce.timer);announce.timer=setTimeout(()=>$('notice').textContent='',4000);}
function save(){if(storageReadBlocked){$('storage-status').textContent='旧记录未能读取，已停止覆盖；本页新记录请导出。';return false;}try{localStorage.setItem(KEY,JSON.stringify({app:APP,version:1,...records}));$('storage-status').textContent='已保存本馆收藏与看过记录。';return true;}catch(_){$('storage-status').textContent='未能保存到浏览器；本页暂存，请导出记录。';announce('保存受阻；请导出记录。没有上传任何信息。');return false;}}
try{const raw=localStorage.getItem(KEY);if(raw)records=C.validate(JSON.parse(raw),APP,ids);}catch(_){storageReadBlocked=true;$('storage-status').textContent='旧记录无法读取，已停止自动覆盖；本页新记录请导出。';}
function clearExercise(){choice=null;revealed=false;variant='full';$('own-words').value='';$('copy-status').textContent='';$('copy-fallback').value='';$('copy-fallback').hidden=true;}
function hash(){try{history.replaceState(null,'','#'+selected.id);}catch(_){/* A local-file policy may disallow history updates; content still works. */}}
function query(){return {query:$('search').value,category:$('category').value,audience:$('audience').value,favorites:$('favorites-only').checked?records.favorites:null,unread:$('unread-only').checked?records.read:null};}
function clearFilters(){$('search').value='';$('category').value='';$('audience').value='';$('favorites-only').checked=false;$('unread-only').checked=false;}
function toReading(){if(matchMedia('(max-width:840px)').matches)$('directory').open=false;$('reading').focus({preventScroll:true});$('reading').scrollIntoView({block:'start',behavior:'instant'});}
function pick(id,scroll=false){if(!byId.has(id))return;selected=byId.get(id);clearExercise();render();if(scroll)toReading();}
function renderList(){
 shown=M.filter(D.entries,query());
 if(shown.length&&!shown.some(e=>e.id===selected.id)){selected=shown[0];clearExercise();}
 $('entries').replaceChildren();
 for(const e of shown){const b=node('button',e.title);b.type='button';b.dataset.id=e.id;b.setAttribute('aria-current',String(selected.id===e.id));b.append(node('small',categories.get(e.category).name+(records.favorites.includes(e.id)?' · ★':'')));$('entries').append(b);}
 $('count').textContent='找到 '+shown.length+' / '+ids.length+' 个场景';$('progress').textContent='看过 '+records.read.length+' / '+ids.length+'（不代表掌握）';$('random').disabled=shown.length<2;
 $('empty').hidden=shown.length!==0;$('reading').hidden=shown.length===0;
}
function renderSources(){
 $('sources').open=false;$('source-list').replaceChildren();
 for(const id of selected.sources){const s=D.sources[id],li=node('li'),a=node('a',s.name);if(!C.safeURL(s.url))continue;a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a,node('span',s.kind+' · '+s.scope,'source-meta'));$('source-list').append(li);}
 $('related').replaceChildren();
 for(const id of selected.related){const a=node('a',D.psychology[id]+' ↗');a.href='../psychology/index.html#'+id;a.target='_blank';a.rel='noopener';$('related').append(a);}
}
function renderOptions(){
 $('question').hidden=mode==='read';$('mode-quiz').setAttribute('aria-pressed',String(mode==='quiz'));$('mode-read').setAttribute('aria-pressed',String(mode==='read'));
 $('options').replaceChildren();
 selected.options.forEach((o,i)=>{const b=node('button');b.type='button';b.dataset.option=String(i);b.setAttribute('aria-pressed',String(i===choice));b.append(node('span','ABCD'[i],'letter'),node('span',o.text,'label'));$('options').append(b);});
 $('submit').disabled=choice===null;choiceStatus();
}
function choiceStatus(){
 $('choice-status').textContent=revealed?(choice===null?'已展开参考回答，没有提交选择。':'已选 '+'ABCD'[choice]+'；下方已展开参考解析。'):choice===null?'先选一项，再看分析；也可以跳过选择。':'已选 '+'ABCD'[choice]+'；结果尚未揭晓，请点查看解析。';
}
function renderResponse(){
 document.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===variant)));
 $('pushback-box').hidden=variant!=='followup';$('pushback').textContent=selected.pushback;$('response-text').textContent=M.response(selected,variant);
 $('copy-status').textContent='';$('copy-fallback').hidden=true;$('copy-fallback').value='';
}
function renderAnswer(){
 choiceStatus();
 $('answers').hidden=!revealed;$('reveal').setAttribute('aria-expanded',String(revealed));$('reveal').textContent=revealed?'收起参考回答':mode==='read'?'展开参考回答（默认隐藏）':'直接看参考回答';
 // No answer text or correctness decoration is placed into the DOM before reveal.
 if(!revealed){for(const id of ['result','principle','response-text','pushback','boundary'])$(id).textContent='';$('explanations').replaceChildren();$('actions').replaceChildren();return;}
 const best=M.preferred(selected),letter='ABCD'[best];
 $('result').textContent=choice===null?'本情境的参考选择：'+letter:choice===best?'你的选择与本题参考一致：'+letter:'你选择了 '+'ABCD'[choice]+'；本情境更稳妥的起点：'+letter;
 $('principle').textContent=selected.principle;$('explanations').replaceChildren();
 selected.options.forEach((o,i)=>{const div=node('div'),h=node('h4','ABCD'[i]+' · '+o.text);if(o.preferred)h.append(node('span','本情境优先','preferred-tag'));div.append(h,node('p',o.reason));$('explanations').append(div);});
 $('actions').replaceChildren();for(const a of selected.actions)$('actions').append(node('li',a));$('boundary').textContent=selected.boundary;renderResponse();
}
function render(){
 renderList();if(!shown.length){clearExercise();renderAnswer();return;}hash();
 const e=selected;$('scene-category').textContent=categories.get(e.category).name;$('scene-title').textContent=e.title;$('scene-text').textContent=e.scene;$('trigger').textContent='“'+e.trigger+'”';$('goal').textContent=e.goal;$('audience-label').textContent=e.audience+' · 原创情境';
 $('safety').hidden=!e.safety;$('safety').textContent=e.safety?'⚠️ '+e.safety:'';
 const index=shown.findIndex(x=>x.id===e.id);$('position').textContent=(index+1)+' / '+shown.length;$('previous').disabled=index===0;$('next').disabled=index===shown.length-1;
 for(const [id,key] of [['favorite','favorites'],['mark-read','read']]){const yes=records[key].includes(e.id);$(id).setAttribute('aria-pressed',String(yes));$(id).textContent=id==='favorite'?(yes?'★ 已收藏':'☆ 收藏'):(yes?'✓ 已看过（可取消）':'标记看过');}
 renderOptions();renderAnswer();renderSources();
}
function showAnswer(){revealed=true;renderAnswer();$('answers').focus({preventScroll:true});$('answers').scrollIntoView({block:'start',behavior:'instant'});}
for(const cat of D.categories){const o=node('option',cat.name);o.value=cat.id;$('category').append(o);}
$('source-note').textContent=D.sourceNote;$('global-boundary').textContent=D.boundary;
if(matchMedia('(max-width:840px)').matches)$('directory').open=false;
$('entries').onclick=e=>{const b=e.target.closest('[data-id]');if(b)pick(b.dataset.id,true);};
$('options').onclick=e=>{const b=e.target.closest('[data-option]');if(!b)return;choice=Number(b.dataset.option);revealed=false;renderOptions();renderAnswer();$('options').querySelector('[data-option="'+choice+'"]').focus({preventScroll:true});};
for(const id of ['category','audience','favorites-only','unread-only'])$(id).onchange=()=>{clearExercise();render();};
$('search').oninput=()=>{clearExercise();render();};
for(const id of ['clear-filters','empty-clear'])$(id).onclick=()=>{clearFilters();clearExercise();render();if(id==='empty-clear'){$('directory').open=true;$('search').focus({preventScroll:true});}};
$('search').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();clearFilters();clearExercise();render();}};
$('previous').onclick=()=>{const i=shown.findIndex(e=>e.id===selected.id);if(i>0)pick(shown[i-1].id,true);};
$('next').onclick=()=>{const i=shown.findIndex(e=>e.id===selected.id);if(i>=0&&i<shown.length-1)pick(shown[i+1].id,true);};
$('random').onclick=()=>{const e=M.choose(shown,selected.id);if(e)pick(e.id,true);};
$('open-directory').onclick=()=>{$('directory').open=true;$('directory').scrollIntoView({block:'start',behavior:'instant'});$('search').focus({preventScroll:true});};
$('font-size').onclick=()=>{font=font===18?20:font===20?22:18;document.documentElement.style.setProperty('--text-size',font+'px');$('font-size').textContent='字号 '+font;};
for(const id of ['mode-quiz','mode-read'])$(id).onclick=()=>{mode=id==='mode-quiz'?'quiz':'read';choice=null;revealed=false;renderOptions();renderAnswer();};
$('submit').onclick=()=>{if(choice!==null)showAnswer();};
$('reveal').onclick=()=>{if(revealed){revealed=false;renderAnswer();}else showAnswer();};
$('retry').onclick=()=>{choice=null;revealed=false;variant='full';renderOptions();renderAnswer();$(mode==='read'?'reveal':'question-title').scrollIntoView({block:'center',behavior:'instant'});};
document.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>{variant=b.dataset.variant;renderResponse();});
for(const [id,key] of [['favorite','favorites'],['mark-read','read']])$(id).onclick=()=>{records[key]=C.toggle(records[key],selected.id);save();render();};
$('copy').onclick=async()=>{const text=M.response(selected,variant),scene=selected.id,view=variant;try{if(!navigator.clipboard?.writeText)throw Error('unsupported');await navigator.clipboard.writeText(text);if(scene===selected.id&&view===variant&&revealed)$('copy-status').textContent='已复制当前表达。';}catch(_){if(scene!==selected.id||view!==variant||!revealed)return;$('copy-fallback').value=text;$('copy-fallback').hidden=false;$('copy-status').textContent='浏览器未允许自动复制，请在下框长按或选择文字复制。';$('copy-fallback').focus();$('copy-fallback').select();}};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({app:APP,version:1,...records},null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=node('a');a.href=u;a.download='人情世故-收藏与阅读记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>100000)throw Error('文件过大');const incoming=C.validate(JSON.parse(await file.text()),APP,ids);records=C.merge(records,incoming);const ok=save();$('storage-status').textContent=ok?'导入成功，只合并收藏与看过编号。':'合并到本页，但未能保存到浏览器，请导出记录。';render();}catch(error){$('storage-status').textContent='未导入：'+error.message;}finally{e.target.value='';}};
$('reset-records').onclick=()=>{$('reset-confirm').hidden=false;$('cancel-reset').focus({preventScroll:true});};$('cancel-reset').onclick=()=>{$('reset-confirm').hidden=true;$('reset-records').focus({preventScroll:true});};
$('confirm-reset').onclick=()=>{try{localStorage.removeItem(KEY);storageReadBlocked=false;records=C.empty();$('reset-confirm').hidden=true;$('storage-status').textContent='已清空本馆记录，其他馆未更改。';clearExercise();render();$('reset-records').focus({preventScroll:true});}catch(_){$('storage-status').textContent='清空失败，原记录未主动更改。';}};
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(byId.has(id)){clearFilters();pick(id,true);}});
window.SocialTest={state:()=>({selected:selected.id,shown:shown.map(e=>e.id),choice,revealed,mode,variant,records}),ids:()=>ids.slice()};
render();
})();
