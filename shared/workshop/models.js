/* Original pure teaching models. Shared by the three studios and their tests. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WorkshopModels=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const positions=['in','on','under','next to'];
const nouns={apple:['apples','苹果','an'],book:['books','书','a'],box:['boxes','盒子','a'],child:['children','孩子','a']};
const sentences=[
 {words:['I','am','happy'],meaning:'我很开心。',rule:'I 和 am 搭配；happy 说的是“开心”这个状态。不是每句话都在说动作。',roles:['谁','系动词','什么状态']},
 {words:['She','is','reading'],meaning:'她正在读书。',rule:'She 后用 is；is reading 一起表示“正在读”。不要把 is 丢掉。',roles:['谁','助动词 is','动作的 -ing 形式']},
 {words:['We','can','swim'],meaning:'我们会游泳。',rule:'can 后用动词原形 swim，不用 swims。换成 He can swim 也一样。',roles:['谁','能够','做什么']},
 {words:['He','likes','apples'],meaning:'他喜欢苹果。',rule:'这里说平常的喜好：He 后用 likes。换成 I，就说 I like apples。',roles:['谁','喜欢','什么']}
];
// Malformed pasted URL fragments must not prevent offline lessons from loading.
function lessonHash(hash){try{return decodeURIComponent(String(hash||'').replace(/^#/,''));}catch(_){return '';}}
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw Error('参数超出范围。');return v;}
function plural(noun,count){integer(count,1,6);if(!Object.hasOwn(nouns,noun))throw Error('未知名词。');return count===1?noun:nouns[noun][0];}
function robot(commands){if(!Array.isArray(commands)||commands.length>32||commands.some(c=>typeof c!=='string'||!/^([LR]|F[1-4]?)$/.test(c)))throw Error('指令无效或超过32块。');
 const expanded=commands.flatMap((c,block)=>Array.from({length:c[0]==='F'?Number(c[1]||1):1},()=>({cmd:c[0],block})));
 let x=0,y=4,dir=1;const states=[{x,y,dir,block:-1,status:'ready'}];
 for(const {cmd,block} of expanded){let status='moving';if(cmd==='L')dir=(dir+3)%4;else if(cmd==='R')dir=(dir+1)%4;else{const [dx,dy]=[[0,-1],[1,0],[0,1],[-1,0]][dir],nx=x+dx,ny=y+dy;
 if(nx<0||nx>4||ny<0||ny>4||[[2,2],[3,2]].some(p=>p[0]===nx&&p[1]===ny))status='blocked';else{x=nx;y=ny;}}
 if(x===4&&y===0)status='goal';states.push({x,y,dir,block,status});if(status==='blocked'||status==='goal')break;}
 return states;
}
function search(target,n=32){integer(n,1,64);integer(target,1,n);let lo=1,hi=n;const binary=[];while(lo<=hi){const mid=Math.floor((lo+hi)/2);binary.push({lo,hi,mid,found:mid===target});if(mid===target)break;if(mid<target)lo=mid+1;else hi=mid-1;}return {linear:Array.from({length:target},(_,i)=>i+1),binary};}
function pixels(bits){if(!Array.isArray(bits)||bits.length!==36||bits.some(x=>x!==0&&x!==1))throw Error('像素必须是36个0或1。');const rows=[];for(let r=0;r<6;r++){const row=bits.slice(r*6,r*6+6),runs=[];let count=1;for(let i=1;i<6;i++){if(row[i]===row[i-1])count++;else{runs.push(count);count=1;}}runs.push(count);rows.push({start:row[0],runs,raw:row.join('')});}return {rows,rawBits:36,encodedBits:6+rows.reduce((s,r)=>s+r.runs.length*3,0)};}
function frequency(midi){integer(midi,0,127);return 440*Math.pow(2,(midi-69)/12);}
function beatSeconds(bpm){if(!Number.isFinite(bpm)||bpm<40||bpm>180)throw Error('速度范围为40—180拍/分。');return 60/bpm;}
function validateWork(id,value){
 if(id==='program'){robot(value);return value.slice();}
 if(id==='pixels'){pixels(value);return value.slice();}
 if(id==='rhythm'){if(!Array.isArray(value)||value.length!==16||value.some(x=>x!==0&&x!==1))throw Error('节奏格式无效。');return value.slice();}
 if(id==='melody'){if(!Array.isArray(value)||value.length!==8||value.some(x=>!Number.isInteger(x)||x< -1||x>4))throw Error('旋律格式无效。');return value.slice();}
 throw Error('未知作品类型。');
}
function backup(input,subject,ids){if(!input||input.app!=='family-lab-workshop'||input.version!==1||input.subject!==subject||!Array.isArray(input.favorites)||!input.notes||typeof input.notes!=='object'||Array.isArray(input.notes)||!input.works||typeof input.works!=='object'||Array.isArray(input.works))throw Error('不是本馆支持的备份。');
 if(input.favorites.length>ids.length||input.favorites.some(x=>!ids.includes(x))||Object.keys(input.notes).length>ids.length)throw Error('含未知或过多的课题。');const notes={},works={};for(const [k,v] of Object.entries(input.notes)){if(!ids.includes(k)||typeof v!=='string'||v.length>500)throw Error('笔记无效或超过500字。');notes[k]=v;}
 const allowed=subject==='computing'?['pixels','program']:subject==='music'?['rhythm','melody']:[];
 for(const [k,v] of Object.entries(input.works)){if(!allowed.includes(k))throw Error('作品不属于本馆。');works[k]=validateWork(k,v);}return {app:input.app,version:1,subject,favorites:[...new Set(input.favorites)],notes,works};
}
return {positions,nouns,sentences,lessonHash,plural,robot,search,pixels,frequency,beatSeconds,validateWork,backup};
});
