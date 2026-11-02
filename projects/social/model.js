/* Pure helpers: no quiz scores, diagnosis or storage of the learner's private words. */
(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.SocialModel=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const normalize=value=>String(value||'').normalize('NFKC').toLocaleLowerCase().trim();
function filter(entries,{query='',category='',audience='',favorites=null,unread=null}={}){
 const words=normalize(query).split(/\s+/).filter(Boolean);
 return entries.filter(e=>(!category||category===e.category)&&(!audience||audience===e.audience)&&(!favorites||favorites.includes(e.id))&&(!unread||!unread.includes(e.id))&&words.every(w=>normalize([e.title,e.scene,e.trigger,e.goal,e.audience].join(' ')).includes(w)));
}
function preferred(entry){const choices=entry.options.map((o,i)=>o.preferred?i:-1).filter(i=>i>=0);if(choices.length!==1)throw Error('场景参考选择配置错误');return choices[0];}
function answer(entry,index){return entry.options[preferred(entry)].text;}
function response(entry,variant){if(variant==='brief')return answer(entry);if(variant==='followup')return entry.followup;return entry.reply;}
function choose(shown,current,random=Math.random){const rest=shown.filter(e=>e.id!==current);if(!rest.length)return shown[0]||null;return rest[Math.min(rest.length-1,Math.floor(Math.max(0,random())*rest.length))];}
return {filter,preferred,response,choose};
});
