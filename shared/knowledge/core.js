/* Local-only catalogue helpers. Never evaluate imported text or store diagnostic answers. */
(function(root,factory){const c=factory();if(typeof module==='object'&&module.exports)module.exports=c;else root.KnowledgeCore=c;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function normalize(value){return String(value||'').normalize('NFKC').toLocaleLowerCase().trim();}
 function filter(entries,{query='',category='',favorites=null,unread=null}={}){const words=normalize(query).split(/\s+/).filter(Boolean);return entries.filter(e=>(!category||e.category===category)&&(!favorites||favorites.includes(e.id))&&(!unread||!unread.includes(e.id))&&words.every(w=>normalize(JSON.stringify(e)).includes(w)));}
 function empty(){return {favorites:[],read:[]};}
 function validate(raw,app,ids){if(!raw||typeof raw!=='object'||raw.app!==app||raw.version!==1)throw Error('不是本馆的学习记录');const result=empty();for(const key of ['favorites','read']){if(!Array.isArray(raw[key])||raw[key].length>ids.length)throw Error('记录结构或数量不正确');if(raw[key].some(id=>typeof id!=='string'||!ids.includes(id)))throw Error('包含未知条目');result[key]=[...new Set(raw[key])];}return result;}
 function merge(a,b){return {favorites:[...new Set([...a.favorites,...b.favorites])],read:[...new Set([...a.read,...b.read])]};}
 function toggle(values,id){return values.includes(id)?values.filter(v=>v!==id):[...values,id];}
 function safeURL(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch(_){return false;}}
 return {normalize,filter,empty,validate,merge,toggle,safeURL};
});
