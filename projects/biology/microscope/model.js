/* Finite brightfield teaching instrument; scales are declared synthetic calibrations. */
(function(r){'use strict';
const specimens=[
{id:'onion',name:'洋葱鳞片叶内表皮',title:'像砖墙一样排列，但这是细胞',size:240,detail:'清楚的细胞壁围住细胞；染色后细胞核较易观察。这里选择鳞片叶内表皮，通常看不到绿色叶绿体。',focus:0,color:'#b58b98'},
{id:'leaf',name:'水生植物薄叶',title:'绿色小体，在细胞边缘排队',size:75,detail:'绿色颗粒示意叶绿体；大液泡把细胞质挤向周边。慢流动为细胞质环流示意，并非所有叶片都会出现同样速度。',focus:.3,color:'#78a15b'},
{id:'petal',name:'花瓣表皮薄层',title:'花瓣的颜色，不等于叶绿体的绿色',size:55,detail:'此样本模拟含花青素的花瓣表皮。色素位于液泡等结构中；不是每一颗彩色点都叫叶绿体。',focus:-.4,color:'#c87096'},
{id:'pollen',name:'花粉（教学薄层）',title:'花粉有外壁，不是植物的种子',size:35,detail:'花粉外形因植物不同而变化；本页仅示意一种颗粒形态。完整微细外壁纹理常需更高分辨率的方法。',focus:.5,color:'#b5954c'},
{id:'sperm',name:'精子（合成示意）',title:'有头部与鞭毛的生殖细胞',size:55,detail:'模拟人类精子的头部约几微米、全长约50–60微米量级。染色、活体、光学条件影响可见度；本页不是样本视频、医学检查或采样教程。',focus:-.2,color:'#797ca0'}
];
const objectives=[{power:4,na:.10},{power:10,na:.25},{power:40,na:.65}];
function normalize(v={}){const finite=(x,d)=>Number.isFinite(Number(x))?Number(x):d,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));return{specimen:specimens.some(s=>s.id===v.specimen)?v.specimen:'onion',objective:objectives.some(o=>o.power===Number(v.objective))?Number(v.objective):4,x:clamp(finite(v.x,0),-2400,2400),y:clamp(finite(v.y,0),-2400,2400),coarse:clamp(finite(v.coarse,0),-8,8),fine:clamp(finite(v.fine,0),-1,1),light:clamp(finite(v.light,65),10,100),aperture:clamp(finite(v.aperture,60),10,100),stain:!!v.stain,moving:v.moving!==false};}
function optics(input){const v=normalize(input),specimen=specimens.find(s=>s.id===v.specimen),o=objectives.find(o=>o.power===v.objective),field=18000/o.power,total=10*o.power,focus=v.coarse+v.fine,defocus=Math.abs(focus-specimen.focus),resolution=.61*.55/(o.na*(.5+v.aperture/200));return{...v,total,field,focus,defocus,resolution,pxPerUm:560/field,scale:field>1500?500:field>700?200:50,blur:Math.min(16,defocus*(v.objective/5)),specimenData:specimen};}
r.MicroModel={specimens,objectives,normalize,optics};if(typeof module!=='undefined')module.exports=r.MicroModel;
})(typeof globalThis!=='undefined'?globalThis:this);
