(function(){'use strict';
 const D=PsychologyData,C=KnowledgeCore,$=id=>document.getElementById(id),ids=D.entries.map(e=>e.id),byId=new Map(D.entries.map(e=>[e.id,e]));
 const APP='family-lab-psychology',KEY=APP+'.v1';let records=C.empty(),selected=byId.get(location.hash.slice(1))||D.entries[0],shown=[],font=18;
 function announce(s){$('notice').textContent=s;clearTimeout(announce.timer);announce.timer=setTimeout(()=>$('notice').textContent='',4200);}
 function save(){try{localStorage.setItem(KEY,JSON.stringify({app:APP,version:1,...records}));$('storage-status').textContent='记录已保存在本浏览器。';return true;}catch(_){$('storage-status').textContent='未能保存到浏览器，仅本页暂存；请导出记录。';announce('保存受阻，请导出记录；没有上传任何信息。');return false;}}
 try{const v=localStorage.getItem(KEY);if(v)records=C.validate(JSON.parse(v),APP,ids);}catch(_){$('storage-status').textContent='本机旧记录未能读取，仍可正常学习；原记录未被主动清除。';}
 const node=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
 for(const cat of D.categories){const o=node('option',cat);o.value=cat;$('category').append(o);}
 for(const e of D.entries){const o=node('option',e.title);o.value=e.id;$('compare-select').append(o);}
 $('global-boundary').textContent=D.boundary;
 if(matchMedia('(max-width:840px)').matches)$('directory').open=false;
 function query(){return {query:$('search').value,category:$('category').value,favorites:$('favorites-only').checked?records.favorites:null,unread:$('unread-only').checked?records.read:null};}
 function toReading(){if(matchMedia('(max-width:840px)').matches)$('directory').open=false;$('reading').focus({preventScroll:true});$('reading').scrollIntoView({block:'start',behavior:'instant'});}
 function hash(id){try{history.replaceState(null,'','#'+id);}catch(_){/* Some local-file hosts disallow history replacement; navigation still works. */}}
 function pick(id,scroll=false){if(!byId.has(id))return;selected=byId.get(id);hash(id);render();if(scroll)toReading();}
 function renderList(){shown=C.filter(D.entries,query());$('entries').replaceChildren();$('count').textContent='找到 '+shown.length+' / '+ids.length+' 个概念';$('random').disabled=shown.length===0;
  for(const e of shown){const b=node('button',e.title);b.dataset.id=e.id;b.type='button';b.setAttribute('aria-current',String(e.id===selected.id));b.append(node('small',e.category+(records.favorites.includes(e.id)?' · ★':'')));$('entries').append(b);}
  $('progress').textContent='已读 '+records.read.length+' / '+ids.length+'（不代表掌握）';
 }
 function compare(){const other=byId.get($('compare-select').value)||D.entries[0];$('compare-grid').replaceChildren();for(const e of [selected,other]){const div=node('div');div.append(node('h4',e.title),node('p',e.definition),node('p','别混淆：'+e.boundary,'caption'));$('compare-grid').append(div);}}
 function render(){renderList();const empty=shown.length===0;$('empty').hidden=!empty;$('reading').hidden=empty;if(empty)return;if(!shown.some(x=>x.id===selected.id))selected=shown[0];hash(selected.id);
  const e=selected;for(const [id,text] of Object.entries({'term-category':e.category,'term-title':e.title,'term-english':e.english,'term-kind':e.kind,plain:e.plain,definition:e.definition,boundary:e.boundary,action:e.action}))$(id).textContent=text;
  const i=shown.findIndex(x=>x.id===e.id);$('position').textContent=(i+1)+' / '+shown.length;$('previous').disabled=i===0;$('next').disabled=i===shown.length-1;
  for(const [id,key,label] of [['favorite','favorites','收藏'],['mark-read','read','已读']]){const yes=records[key].includes(e.id);$(id).setAttribute('aria-pressed',String(yes));$(id).textContent=id==='favorite'?(yes?'★ 已收藏':'☆ 收藏'):(yes?'✓ 已读（可取消）':'标记已读');}
  $('examples').replaceChildren();for(const ex of e.examples){const div=node('div',undefined,'example');div.append(node('h4',ex.label),node('p',ex.text),node('p','这里的关键：'+ex.explanation,'caption'));$('examples').append(div);}
  $('related').replaceChildren();for(const id of e.related){const b=node('button',byId.get(id).title);b.dataset.related=id;$('related').append(b);}
  $('compare-select').value=e.related[0];$('compare').open=false;compare();$('sources').open=false;$('source-list').replaceChildren();for(const id of e.sources){const s=D.sources[id],li=node('li'),a=node('a',s.title);if(C.safeURL(s.url)){a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';}li.append(a,node('span',s.type+' · 核对日期 '+s.checked,'source-meta'),node('p',s.scope));$('source-list').append(li);}
  for(const b of $('entries').querySelectorAll('button'))b.setAttribute('aria-current',String(b.dataset.id===e.id));
 }
 function clear(){for(const id of ['search','category'])$(id).value='';$('favorites-only').checked=false;$('unread-only').checked=false;render();}
 $('entries').onclick=e=>{const b=e.target.closest('[data-id]');if(b)pick(b.dataset.id,true);};
 $('related').onclick=e=>{const b=e.target.closest('[data-related]');if(b){clear();pick(b.dataset.related,true);announce('已打开相关词条，并清除目录筛选。');}};
 for(const id of ['search','category','favorites-only','unread-only'])$(id).addEventListener(id==='search'?'input':'change',render);
 $('clear-filters').onclick=clear;$('empty-clear').onclick=clear;
 for(const [button,delta] of [['previous',-1],['next',1]])$(button).onclick=()=>{const i=shown.findIndex(x=>x.id===selected.id)+delta;if(shown[i])pick(shown[i].id,true);};
 $('random').onclick=()=>{const pool=shown.filter(e=>e.id!==selected.id);if(pool.length)pick(pool[Math.floor(Math.random()*pool.length)].id,true);else if(shown.length)pick(shown[0].id,true);};
 for(const [button,key] of [['favorite','favorites'],['mark-read','read']])$(button).onclick=()=>{records[key]=C.toggle(records[key],selected.id);save();render();};
 $('compare-select').onchange=compare;
 $('open-directory').onclick=()=>{$('directory').open=true;$('directory').scrollIntoView({block:'start',behavior:'instant'});$('search').focus({preventScroll:true});};
 $('font-size').onclick=()=>{font=font===22?18:font+2;document.documentElement.style.setProperty('--text-size',font+'px');$('font-size').textContent='字号 '+font;};
 $('export').onclick=()=>{const blob=new Blob([JSON.stringify({app:APP,version:1,...records},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='心理学-收藏与已读.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('import').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>100000)throw Error('文件过大');const incoming=C.validate(JSON.parse(await f.text()),APP,ids);records=C.merge(records,incoming);const ok=save();render();$('storage-status').textContent=ok?'导入成功，已与原记录合并。':'已合并到本页但未能写入浏览器，请导出。';}catch(error){$('storage-status').textContent='未导入：'+error.message;}finally{e.target.value='';}};
 $('reset-records').onclick=()=>{$('reset-confirm').hidden=false;};$('cancel-reset').onclick=()=>{$('reset-confirm').hidden=true;};$('confirm-reset').onclick=()=>{records=C.empty();save();$('reset-confirm').hidden=true;render();};
 window.addEventListener('hashchange',()=>{const e=byId.get(location.hash.slice(1));if(e){clear();pick(e.id,true);}});
 render();window.PsychologyTest={ids:()=>ids.slice(),state:()=>({selected:selected.id,shown:shown.map(e=>e.id),records:JSON.parse(JSON.stringify(records))})};
})();
