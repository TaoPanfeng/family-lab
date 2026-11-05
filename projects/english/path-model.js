/* Local evidence of practice, not an English proficiency certificate. */
(function(r){'use strict';
const stages=[
 ['foundation','表达骨架','先把谁、发生什么和状态说清楚'],['reference','指代与数量','让听者知道说的是谁、哪个和多少'],
 ['time','时间视角','从场景判断习惯、过程、过去和现在联系'],['viewpoint','视角与语气','调整提问、可能性、计划和关注对象'],
 ['expansion','扩展句子','给骨架补位置、方式、目的和活动'],['connection','连接想法','把修饰、内容、原因和条件连接起来'],
 ['reasoning','阅读推理','抓主干、分层级，再检验证据'],['expression','综合表达','翻译、改写、衔接，完成一段表达']
].map(([id,title,goal],index)=>({id,title,goal,index}));
const catalog=()=>[...(r.EnglishPathData||[])].sort((a,b)=>a.order-b.order),lesson=id=>catalog().find(x=>x.id===id);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k),object=x=>x&&typeof x==='object'&&!Array.isArray(x);
function blank(){return{app:'family-lab-english-path',version:1,completed:[],seen:[],drafts:{},last:catalog()[0]?.id||'meaning'};}
function validate(raw){
 if(!object(raw)||raw.app!=='family-lab-english-path'||raw.version!==1)throw Error('不是支持的英语路线备份。');
 const lessons=catalog(),ids=lessons.map(x=>x.id),questions=lessons.flatMap(x=>x.challenge.map(q=>q.id));
 function list(key,known){if(!Array.isArray(raw[key])||raw[key].length>known.length||raw[key].some(x=>typeof x!=='string'||!known.includes(x)))throw Error('记录编号或数量不支持。');return [...new Set(raw[key])];}
 const completed=list('completed',questions),seen=list('seen',ids),drafts={};
 if(!object(raw.drafts)||Object.keys(raw.drafts).length>ids.length||!ids.includes(raw.last))throw Error('学习位置或练写记录不支持。');
 for(const [id,value]of Object.entries(raw.drafts)){if(!ids.includes(id)||typeof value!=='string'||value.length>5000)throw Error('练写内容过长或主题不支持。');drafts[id]=value;}
 return{app:raw.app,version:1,completed,seen,drafts,last:raw.last};
}
function merge(current,incoming){const a=validate(current),b=validate(incoming);return validate({...a,completed:[...new Set([...a.completed,...b.completed])],seen:[...new Set([...a.seen,...b.seen])],drafts:{...b.drafts,...a.drafts}});}
function answer(state,lessonId,questionId,choice){
 const l=lesson(lessonId),q=l?.challenge.find(q=>q.id===questionId);
 if(!q||!Number.isInteger(choice)||choice<0||choice>=q.options.length)throw Error('请选择本题的一个选项。');
 const next=validate(state),correct=choice===q.answer;
 if(correct&&!next.completed.includes(q.id))next.completed.push(q.id);
 return{state:next,correct,feedback:q.options[choice].why};
}
function isCleared(state,id){const l=lesson(id);return !!l&&l.challenge.length===2&&l.challenge.every(q=>state.completed.includes(q.id));}
function summary(state){const safe=validate(state),all=catalog(),cleared=all.filter(l=>isCleared(safe,l.id)).length;return{cleared,total:all.length,next:all.find(l=>!isCleared(safe,l.id))?.id||all[0]?.id,stages:stages.map((s,index)=>({index,cleared:all.filter(l=>l.stage===index&&isCleared(safe,l.id)).length,total:all.filter(l=>l.stage===index).length}))};}
r.EnglishPathModel={stages,catalog,lesson,blank,validate,merge,answer,isCleared,summary};
if(typeof module!=='undefined')module.exports=r.EnglishPathModel;
})(typeof window!=='undefined'?window:globalThis);
