window.Museum={id:'physics-optics',name:'物理 · 光学实验台',en:'LIGHT / WAVES & MEASUREMENT',glossary:'λ：波长；d：双缝中心距；a：每条缝宽；L：缝到屏幕的距离。N：齿数（同时有N个缝）；f：每秒转数；c：真空光速。',lessons:[
{id:'interference',title:'两条缝，为什么出现许多明暗条纹？',intro:'同时看波面示意和定量屏幕。把缝距加倍，条纹会变密还是变疏？',category:'双缝干涉与衍射',duration:14,badge:'左侧波面为慢放示意 · 右侧强度由公式计算',
 child:'光波从两条缝出发，在同一位置相遇。有的位置相互加强，有的位置相互抵消。改缝距或波长，右边的条纹会跟着变化；堵住一条缝后，不会剩下原来的双缝细条纹。',
 adult:'远场、均匀照明、同相等幅双缝模型：I/I₀ = sinc²(πa sinθ/λ) cos²(πd sinθ/λ)，sinθ=y/√(L²+y²)。单缝及不相干对照只保留归一化衍射包络。相邻亮纹间距近轴近似为Δy≈λL/d。各模式按自身中央峰归一化，不能据此比较绝对总功率。',
 controls:[{id:'wavelength',label:'波长 λ',min:400,max:700,value:550,step:5,unit:' nm'},{id:'separation',label:'双缝中心距 d',min:.12,max:.8,value:.25,step:.01,unit:' mm'},{id:'width',label:'每条缝宽 a',min:.01,max:.1,value:.04,step:.005,unit:' mm'},{id:'distance',label:'到屏幕距离 L',min:2,max:8,value:3,step:.1,unit:' m'},{id:'mode',label:'比较条件',type:'select',value:'double',options:[['double','双缝 · 相干照明'],['single','只开放一条缝'],['incoherent','双缝 · 不相干对照']]},{id:'screenRange',label:'屏幕半幅',min:5,max:60,value:25,step:1,unit:' mm'},{id:'probe',label:'屏幕探针 y',min:-25,max:25,value:0,step:.05,unit:' mm'}],
 question:'其他条件相同，把双缝间距加倍，近轴条纹间距怎样变化？',answers:['变成一半','变成两倍','保持不变'],correct:0,feedback:'Δy≈λL/d，d加倍，间距减半。动手改一次，比较右侧有毫米标尺的屏幕。',
 try:'拖动探针可读取光程差和强度；点击屏幕条带也能移动探针。播放只是把波动减速展示，平均光强不随慢放时间乱跳。',
 sources:[['OpenStax · 双缝衍射公式与适用范围','https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction'],['Falstad · 可操作波动模拟（交互参考）','https://www.falstad.com/ripple/']],
 limits:'经典标量远场模型；不模拟偏振、量子测量或哪个缝的信息。左侧器材与波面使用独立显示比例；右侧屏幕坐标、光程差和光强使用SI计算。Fresnel数较大时会给出近似提醒。显示颜色是近似，不是光谱仪读数。代码与图示原创，不复制参考网站素材。',related:[['回到16个力学等实验','index.html'],['光也需要赶路','../cosmos/index.html#light']]},
{id:'fizeau',title:'光回来时，齿缝为什么被挡住了？',intro:'一束光穿过齿缝，碰到远处镜子再回来。正好转过半个齿距，原来的缝就变成了齿。',category:'菲索齿轮法测光速',duration:20,badge:'回程延迟与齿轮转角联动 · 齿缝局部放大',
 child:'把齿轮想成一排转动的门。光出发时门开着；等它跑到镜子再回来，门可能已经转成墙。调到第一次完全挡住，就能利用距离和转速算出光走得多快。',
 adult:'理想齿与缝等宽，N个齿和N个缝。光往返耗时τ=2L/c。第一次消光时轮转1/(2N)圈，所以τ=1/(2Nf₁)，c=4LNf₁。连续光束平均通光率采用周期方波透过函数的归一化自相关；光束中心射线与平均光束要区别。此处用已知c反推模型现象，并非独立测量c。',
 controls:[{id:'length',label:'到镜子单程 L',min:5,max:15,value:8.633,step:.001,unit:' km'},{id:'teeth',label:'齿数 N（另有N个缝）',type:'select',value:'720',options:[['360','360 齿'],['720','720 齿'],['1440','1440 齿']]},{id:'frequency',label:'转速 f',min:0,max:100,value:10,step:.01,unit:' 转/秒'}],
 question:'第一次消光时，光往返过程中齿轮转了多少？',answers:['半个齿距，即从缝中心到相邻齿中心','一整圈','半圈'],correct:0,feedback:'一圈有N个齿距；半个齿距是1/(2N)圈，不是半圈。配合单程距离L，就得到c=4LNf₁。',
 try:'先在0转/秒看回光，再逐渐增加转速。下方可定位理论第一暗点，并记录当前L、N、f。',
 sources:[['OpenStax · 菲索测光速实验与传播速度','https://openstax.org/books/university-physics-volume-3/pages/1-1-the-propagation-of-light'],['Wolfram Demonstrations · Fizeau Wheel（交互参考）','https://demonstrations.wolfram.com/FizeauWheel/']],
 limits:'理想真空、齿缝等宽且转速稳定的教学模型。忽略空气折射、机械误差、光束有限尺寸与镜面偏移。局部窗口横向放大齿距；整轮实际转角依模型，不人为转成半圈。这里的参数示例不是复原一份完整历史测量记录；不提供现实激光装置操作指导。',related:[['双缝干涉','optics.html#interference'],['光的传播时间','../cosmos/index.html#light']]}
]};
