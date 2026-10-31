/* 成语与歇后语：原典、故事年代和现代流传时间严格区分。 */
(function(){
'use strict';
const D=ChinesePhrases;
const all=[...D.idioms,...D.sayings];
const byId=new Map(all.map(e=>[e.id,e]));
const $=id=>document.getElementById(id);
const key='family-lab.chinese.phrases.v1';
let kind='idiom',selected=D.idioms[0],shown=[],stage=1,visibleAnswer=false,onlyFaves=false;
let state={favorites:[],notes:{}};
// Drafts survive card changes and redraws; saving and exporting remain explicit actions.
const drafts=Object.create(null);
function hasDraft(id){return Object.prototype.hasOwnProperty.call(drafts,id);}
function safeBackup(raw){
  if(!raw||raw.app!=='family-lab-chinese-phrases'||raw.version!==1||!Array.isArray(raw.favorites)||!raw.notes||typeof raw.notes!=='object'||Array.isArray(raw.notes))throw Error('记录格式不正确');
  if(raw.favorites.length>all.length||Object.keys(raw.notes).length>all.length)throw Error('记录数量超出范围');
  const favorites=[];
  for(const id of raw.favorites){if(!byId.has(id)||typeof id!=='string')throw Error('存在未知词语');if(!favorites.includes(id))favorites.push(id);}
  const notes=Object.create(null);
  for(const [id,val] of Object.entries(raw.notes)){if(!byId.has(id)||typeof val!=='string'||val.length>200||id==='__proto__')throw Error('造句内容不符合要求');notes[id]=val;}
  return {favorites,notes};
}
try{const text=localStorage.getItem(key);if(text)state=safeBackup(JSON.parse(text));}catch(e){$('backup-info').textContent='本机旧记录无法读取；本页仍可浏览，保存前请检查存储权限。';}
function persist(){try{localStorage.setItem(key,JSON.stringify({app:'family-lab-chinese-phrases',version:1,...state}));return true;}catch(e){say('当前浏览器禁止保存，请及时导出记录');return false;}}
function say(message){$('toast').textContent=message;clearTimeout(say.timeout);say.timeout=setTimeout(()=>$('toast').textContent='',3400);}
function summary(e){return e.kind==='idiom'?e.title:e.front+'——'+e.back;}
function searchable(e){const s=e.source;return [summary(e),e.meaning,...(e.steps||[]),e.example,e.pitfall,s.work,s.era].filter(Boolean).join('');}
function sourceFor(e){return e.source;}
function renderList(){
  const keyword=$('search').value.trim();
  shown=all.filter(e=>e.kind===kind&&(!onlyFaves||state.favorites.includes(e.id))&&(!keyword||searchable(e).includes(keyword)));
  $('count').textContent='找到 '+shown.length+' 条 · 此类共 '+all.filter(x=>x.kind===kind).length+' 条';
  $('entry-list').replaceChildren();
  if(!shown.length){const p=document.createElement('p');p.textContent='没有找到，试试清除筛选。';$('entry-list').append(p);}
  for(const e of shown){const button=document.createElement('button');button.type='button';button.className='item'+(e.id===selected.id?' selected':'');button.dataset.entry=e.id;button.setAttribute('aria-current',e.id===selected.id?'true':'false');const label=document.createElement('span');label.textContent=e.kind==='idiom'?e.title:e.front;const small=document.createElement('small');small.textContent=state.favorites.includes(e.id)?'★ 已收藏':e.kind==='idiom'?'读故事':'猜下一句';button.append(label,small);$('entry-list').append(button);}
  const index=shown.findIndex(x=>x.id===selected.id);$('position').textContent=index>=0?(index+1)+' / '+shown.length:'筛选外';
  $('previous').disabled=index<=0;$('following').disabled=index<0||index>=shown.length-1;
}
function renderStages(e){
  const stages=e.kind==='idiom'?e.steps:[e.front+'，你先猜它后面会怎么说。',e.meaning,'看答案：'+e.back+'。再试着联系生活。'];
  $('story').replaceChildren();
  stages.forEach((text,i)=>{const div=document.createElement('div');div.className='stage'+(i>=stage?' locked':'');div.hidden=i>=stage&&e.kind==='saying';const label=document.createElement('span');label.textContent='第 '+(i+1)+' 步';const p=document.createElement('p');p.textContent=i>=stage?'先预测下一步':text;div.append(label,p);$('story').append(div);});
  $('story-progress').textContent=stage+' / '+stages.length;$('story-prev').disabled=stage<=1;$('story-next').disabled=stage>=stages.length;
}
function render(){
  const e=selected, s=sourceFor(e);
  $('kind-title').textContent=e.kind==='idiom'?'① 成语 · 读典故':'② 歇后语 · 猜下一句';
  $('term').textContent=e.kind==='idiom'?e.title:e.front+' —— ？';
  $('intro-tip').textContent=e.kind==='idiom'?'先看故事，试着说出深层意思。':'先猜后半句，再看谐音或比喻。';
  $('prompt').textContent=e.kind==='idiom'?'“'+e.title+'”是夸谁、提醒谁，还是告诉我们怎样做？':'“'+e.front+'”——后半句会是什么？';
  $('answer-text').textContent=e.kind==='idiom'?e.title:e.front+' —— '+e.back;
  $('meaning').textContent=e.meaning;$('answer').hidden=!visibleAnswer;
  $('reveal').textContent=visibleAnswer?'收起答案':'我猜好了，看答案';$('reveal').setAttribute('aria-expanded',String(visibleAnswer));
  $('story-section').querySelector('.section-label').textContent=e.kind==='idiom'?'02 · 看故事怎么发展':'02 · 拆开想想，为什么这样说';
  renderStages(e);
  // Do not reveal a saying's answer indirectly in its example before the learner asks for it.
  $('daily-example').textContent=e.kind==='saying'&&!visibleAnswer?'先猜一猜，再点“看答案”读生活中的用法。':e.example;
  $('pitfall').textContent=e.kind==='idiom'?'⚠️ 易误用：'+e.pitfall:visibleAnswer?'🪞 先看字面：'+e.meaning+'（多为民间口语，未必有可考的最早年代）':'🪞 想一想：这里是在打比方，还是在借用读音？';
  $('source-work').textContent=s.work;$('source-era').textContent=s.era;$('source-type').textContent=s.type;$('source-note').textContent=s.note;
  $('source-link-holder').replaceChildren();
  if(s.url&&/^https:\/\//.test(s.url)){const a=document.createElement('a');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='查阅原典或词条（需要联网）';$('source-link-holder').append(a);}
  else $('source-link-holder').textContent='这一条目前没有可以确认的最早文献链接，不补造。';
  $('favorite').setAttribute('aria-pressed',String(state.favorites.includes(e.id)));$('favorite').textContent=state.favorites.includes(e.id)?'★ 已收藏':'☆ 收藏';
  $('my-sentence').value=hasDraft(e.id)?drafts[e.id]:(state.notes[e.id]||'');
  $('saved-msg').textContent=hasDraft(e.id)?'草稿暂留在本页；刷新或关闭前请保存或导出。':state.notes[e.id]?'已读取你此前保存的造句。':'';
  renderList();
}
function pick(id,scroll){const e=byId.get(id);if(!e)return;selected=e;kind=e.kind;stage=1;visibleAnswer=false;
  for(const button of document.querySelectorAll('[data-kind]'))button.setAttribute('aria-pressed',String(button.dataset.kind===kind));
  render();if(scroll&&matchMedia('(max-width:800px)').matches)$('study').scrollIntoView({block:'start'});}
function move(n){const i=shown.findIndex(x=>x.id===selected.id);if(i+n>=0&&i+n<shown.length)pick(shown[i+n].id,false);}
function setKind(value){kind=value;onlyFaves=false;$('only-faves').checked=false;$('search').value='';pick((kind==='idiom'?D.idioms:D.sayings)[0].id,false);}
$('entry-list').addEventListener('click',e=>{const b=e.target.closest('[data-entry]');if(b)pick(b.dataset.entry,true);});
document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>setKind(b.dataset.kind)));
$('search').addEventListener('input',()=>{renderList();if(shown.length&&!shown.includes(selected))pick(shown[0].id,false);});
$('only-faves').addEventListener('change',e=>{onlyFaves=e.target.checked;renderList();if(shown.length&&!shown.includes(selected))pick(shown[0].id,false);});
$('clear').addEventListener('click',()=>{$('search').value='';onlyFaves=false;$('only-faves').checked=false;renderList();});
$('previous').onclick=()=>move(-1);$('following').onclick=()=>move(1);
$('reveal').onclick=()=>{visibleAnswer=!visibleAnswer;render();};
$('story-prev').onclick=()=>{stage=Math.max(1,stage-1);renderStages(selected);};
$('story-next').onclick=()=>{stage=Math.min(3,stage+1);renderStages(selected);};
$('story-all').onclick=()=>{stage=3;renderStages(selected);};
$('favorite').onclick=()=>{const id=selected.id;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];persist();render();};
$('my-sentence').addEventListener('input',()=>{drafts[selected.id]=$('my-sentence').value.slice(0,200);$('saved-msg').textContent='草稿暂留在本页；刷新或关闭前请保存或导出。';});
$('save').onclick=()=>{const id=selected.id;state.notes[id]=$('my-sentence').value.trim().slice(0,200);if(persist()){delete drafts[id];$('saved-msg').textContent='已保存当前词语的造句。';}else{drafts[id]=$('my-sentence').value.slice(0,200);$('saved-msg').textContent='未能保存到浏览器，只暂留在本页；请导出记录。';}};
$('practice').onclick=()=>{const list=all.filter(x=>x.kind===kind);const i=list.findIndex(x=>x.id===selected.id);pick(list[(i+1)%list.length].id,false);};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({app:'family-lab-chinese-phrases',version:1,favorites:state.favorites,notes:{...state.notes,...drafts}},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='语文-成语歇后语-学习记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);};
$('import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>200000)throw Error('文件过大');const incoming=safeBackup(JSON.parse(await file.text()));state.favorites=[...new Set([...state.favorites,...incoming.favorites])];state.notes=Object.assign(Object.create(null),incoming.notes,state.notes);const saved=persist();$('backup-info').textContent=saved?'导入成功。原有造句和本页草稿优先保留，没有被覆盖。':'记录仅合并到本页，未能写入浏览器；请导出备份。';render();}catch(error){$('backup-info').textContent='未导入：'+error.message;}finally{e.target.value='';}};
const hash=location.hash.slice(1);if(byId.has(hash))pick(hash,false);else render();
window.PhraseTest={all,shown:()=>shown.map(x=>x.id),state:()=>({selected:selected.id,kind,stage,visibleAnswer,records:state})};
})();
