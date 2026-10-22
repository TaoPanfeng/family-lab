/* 化学探索馆 — 可审查的教学数据。科学来源与近似范围见 docs/science-sources.md。 */
(function (root, factory) {
  'use strict';
  var data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  root.ChemData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var sources = [
    { id: 'iupac', title: 'IUPAC 元素周期表与命名', publisher: 'IUPAC', url: 'https://iupac.org/what-we-do/periodic-table-of-elements/', scope: '118 个元素、族号与无标准原子量元素的方括号含义' },
    { id: 'iupac-table', title: 'IUPAC 2022 周期表原始 PDF', publisher: 'IUPAC', url: 'https://iupac.org/wp-content/uploads/2022/07/IUPAC_Periodic_Table-04May22_CRA.pdf', scope: '方括号内代表同位素质量数；本项目明确保留该版本' },
    { id: 'ccs-names', title: '中国化学会中文版元素周期表', publisher: '中国化学会', url: 'https://www.chemsoc.org.cn/news/international/a2613.html', scope: '元素中文名称及 113、115、117、118 号元素定名' },
    { id: 'ciaaw', title: '2024 标准原子量', publisher: 'CIAAW / IUPAC', url: 'https://ciaaw.org/atomic-weights.htm', scope: '原子量及天然同位素组成造成的变化；含锆、钆、镥的 2024 修订' },
    { id: 'ciaaw-abridged', title: '教学用简明标准原子量', publisher: 'CIAAW / IUPAC', url: 'https://ciaaw.org/abridged-atomic-weights.htm', scope: '区间原子量在常规计算中的代表值' },
    { id: 'rsc', title: '英国皇家化学会元素知识库', publisher: 'Royal Society of Chemistry', url: 'https://periodic-table.rsc.org/element/8/oxygen', scope: '元素的性质、常见用途；每张元素卡也提供对应原始资料链接' },
    { id: 'rsc-phosphorus', title: '磷的同素异形体与性质', publisher: 'Royal Society of Chemistry', url: 'https://periodic-table.rsc.org/element/15/phosphorus', scope: '白磷、红磷的差别；本项目白磷仅为封闭虚拟观察' },
    { id: 'rsc-peroxide', title: '过氧化氢与不同催化剂', publisher: 'Royal Society of Chemistry', url: 'https://edu.rsc.org/experiments/hydrogen-peroxide-decomposition-using-different-catalysts/831.article', scope: '催化剂影响分解速率；只取教学原理，不复制真实操作步骤' },
    { id: 'rsc-oxygen', title: '氧气的制取与性质', publisher: 'Royal Society of Chemistry', url: 'https://edu.rsc.org/experiments/the-preparation-and-properties-of-oxygen/396.article', scope: '高锰酸钾受热产生氧气的教学原理' },
    { id: 'rsc-displacement', title: '金属与盐之间的置换反应', publisher: 'Royal Society of Chemistry', url: 'https://edu.rsc.org/experiments/displacement-reactions-between-metals-and-their-salts/720.article', scope: '铁与硫酸铜等金属置换反应' },
    { id: 'acs-baking', title: '控制化学反应的产物数量', publisher: 'American Chemical Society', url: 'https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson2.html', scope: '乙酸与碳酸氢钠反应的产物和用量关系' },
    { id: 'colorado-precipitation', title: '氯化钙与碳酸钠的沉淀反应', publisher: 'University of Colorado Boulder', url: 'https://www.colorado.edu/lab/lecture-demo-manual/general-reactions/s130-chemical-rxns-precipitation-cacl2-na2co3-caco3', scope: 'CaCl₂ 与 Na₂CO₃ 溶液生成 CaCO₃ 沉淀' },
    { id: 'rsc-carbonates', title: '从海水中分离盐类', publisher: 'Royal Society of Chemistry', url: 'https://edu.rsc.org/experiments/separating-salts-from-seawater/484.article', scope: '过量 CO₂ 与碳酸氢钙；不能把石灰水初始沉淀模型无限延伸' },
    { id: 'nist-isotopes', title: '原子量、同位素组成与相对原子质量', publisher: 'NIST', url: 'https://www.nist.gov/pml/atomic-weights-and-isotopic-compositions-relative-atomic-masses', scope: '元素平均原子量与具体同位素质量的区别' },
    { id: 'openstax-stoich', title: '化学计量', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry', scope: '配平方程式中的摩尔比和质量换算' },
    { id: 'openstax-yield', title: '限量试剂和产率', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/4-4-reaction-yields', scope: '由 n/系数 找限量试剂；理论生成量与实际收集量' },
    { id: 'openstax-reactions', title: '化学反应分类', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions', scope: '沉淀、中和、氧化还原反应；溶液中的离子' },
    { id: 'openstax-gas', title: '理想气体定律', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law', scope: 'PV=nRT；所有体积计算明确指定温度和压强' },
    { id: 'openstax-electrolytes', title: '电解质', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes', scope: '强、弱电解质与非电解质；导电依赖可移动离子' },
    { id: 'openstax-acids', title: '酸碱强弱与电离平衡', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases', scope: '乙酸 Ka≈1.8×10⁻⁵；弱酸电离度和平衡' },
    { id: 'openstax-water', title: 'pH 与 pOH', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh', scope: '25°C 水的离子积和稀溶液 pH 计算' },
    { id: 'openstax-nuclear', title: '放射性衰变', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay', scope: 'α、β⁻、γ 核变化规则；半衰期指数模型' },
    { id: 'openstax-halflives', title: '常见核素半衰期', publisher: 'OpenStax / Rice University', url: 'https://openstax.org/books/chemistry-2e/pages/m-half-lives-for-several-radioactive-isotopes', scope: '碳-14 半衰期等教学近似数据' },
    { id: 'epa-radiation', title: 'α、β、γ 与 X 射线', publisher: 'US EPA', url: 'https://www.epa.gov/radiation/radiation-basics', scope: '粒子辐射与光子；X 射线、γ 射线的来源区别' },
    { id: 'epa-decay', title: '放射性衰变基础', publisher: 'US EPA', url: 'https://www.epa.gov/radiation/radioactive-decay', scope: '半衰期、子核与衰变链' },
    { id: 'epa-tritium', title: '氢-3（氚）', publisher: 'US EPA', url: 'https://www.epa.gov/radiation/radionuclide-basics-tritium', scope: '氚的 β 辐射与约 12.3 年半衰期' },
    { id: 'epa-cobalt', title: '钴-60', publisher: 'US EPA', url: 'https://www.epa.gov/radiation/radionuclide-basics-cobalt-60', scope: '约 5.27 年半衰期，β 与后续 γ 辐射' },
    { id: 'epa-uranium', title: '铀的天然同位素', publisher: 'US EPA', url: 'https://www.epa.gov/radiation/radionuclide-basics-uranium', scope: '铀-238 的 α 衰变与约 44.7 亿年半衰期' }
  ];

  // 方括号质量数沿用明确标注的 IUPAC 2022 表，不冒充标准原子量。
  // 非区间元素保留适合教学计算的有效位；区间元素采用 CIAAW 简明代表值。
  var rows = `
1|H|氢|hydrogen|1.008
2|He|氦|helium|4.002602
3|Li|锂|lithium|6.94
4|Be|铍|beryllium|9.0121831
5|B|硼|boron|10.81
6|C|碳|carbon|12.011
7|N|氮|nitrogen|14.007
8|O|氧|oxygen|15.999
9|F|氟|fluorine|18.998403162
10|Ne|氖|neon|20.1797
11|Na|钠|sodium|22.98976928
12|Mg|镁|magnesium|24.305
13|Al|铝|aluminium|26.9815384
14|Si|硅|silicon|28.085
15|P|磷|phosphorus|30.973761998
16|S|硫|sulfur|32.06
17|Cl|氯|chlorine|35.45
18|Ar|氩|argon|39.95
19|K|钾|potassium|39.0983
20|Ca|钙|calcium|40.078
21|Sc|钪|scandium|44.955907
22|Ti|钛|titanium|47.867
23|V|钒|vanadium|50.9415
24|Cr|铬|chromium|51.9961
25|Mn|锰|manganese|54.938043
26|Fe|铁|iron|55.845
27|Co|钴|cobalt|58.933194
28|Ni|镍|nickel|58.6934
29|Cu|铜|copper|63.546
30|Zn|锌|zinc|65.38
31|Ga|镓|gallium|69.723
32|Ge|锗|germanium|72.630
33|As|砷|arsenic|74.921595
34|Se|硒|selenium|78.971
35|Br|溴|bromine|79.904
36|Kr|氪|krypton|83.798
37|Rb|铷|rubidium|85.4678
38|Sr|锶|strontium|87.62
39|Y|钇|yttrium|88.905838
40|Zr|锆|zirconium|91.222
41|Nb|铌|niobium|92.90637
42|Mo|钼|molybdenum|95.95
43|Tc|锝|technetium|[97]
44|Ru|钌|ruthenium|101.07
45|Rh|铑|rhodium|102.90549
46|Pd|钯|palladium|106.42
47|Ag|银|silver|107.8682
48|Cd|镉|cadmium|112.414
49|In|铟|indium|114.818
50|Sn|锡|tin|118.710
51|Sb|锑|antimony|121.760
52|Te|碲|tellurium|127.60
53|I|碘|iodine|126.90447
54|Xe|氙|xenon|131.293
55|Cs|铯|caesium|132.90545196
56|Ba|钡|barium|137.327
57|La|镧|lanthanum|138.90547
58|Ce|铈|cerium|140.116
59|Pr|镨|praseodymium|140.90766
60|Nd|钕|neodymium|144.242
61|Pm|钷|promethium|[145]
62|Sm|钐|samarium|150.36
63|Eu|铕|europium|151.964
64|Gd|钆|gadolinium|157.249
65|Tb|铽|terbium|158.925354
66|Dy|镝|dysprosium|162.500
67|Ho|钬|holmium|164.930329
68|Er|铒|erbium|167.259
69|Tm|铥|thulium|168.934219
70|Yb|镱|ytterbium|173.045
71|Lu|镥|lutetium|174.96669
72|Hf|铪|hafnium|178.486
73|Ta|钽|tantalum|180.94788
74|W|钨|tungsten|183.84
75|Re|铼|rhenium|186.207
76|Os|锇|osmium|190.23
77|Ir|铱|iridium|192.217
78|Pt|铂|platinum|195.084
79|Au|金|gold|196.966570
80|Hg|汞|mercury|200.592
81|Tl|铊|thallium|204.38
82|Pb|铅|lead|207.2
83|Bi|铋|bismuth|208.98040
84|Po|钋|polonium|[209]
85|At|砹|astatine|[210]
86|Rn|氡|radon|[222]
87|Fr|钫|francium|[223]
88|Ra|镭|radium|[226]
89|Ac|锕|actinium|[227]
90|Th|钍|thorium|232.0377
91|Pa|镤|protactinium|231.03588
92|U|铀|uranium|238.02891
93|Np|镎|neptunium|[237]
94|Pu|钚|plutonium|[244]
95|Am|镅|americium|[243]
96|Cm|锔|curium|[247]
97|Bk|锫|berkelium|[247]
98|Cf|锎|californium|[251]
99|Es|锿|einsteinium|[252]
100|Fm|镄|fermium|[257]
101|Md|钔|mendelevium|[258]
102|No|锘|nobelium|[259]
103|Lr|铹|lawrencium|[262]
104|Rf|𬬻|rutherfordium|[267]
105|Db|𬭊|dubnium|[268]
106|Sg|𬭳|seaborgium|[269]
107|Bh|𬭛|bohrium|[270]
108|Hs|𬭶|hassium|[269]
109|Mt|鿏|meitnerium|[277]
110|Ds|𫟼|darmstadtium|[281]
111|Rg|𬬭|roentgenium|[282]
112|Cn|鿔|copernicium|[285]
113|Nh|鿭|nihonium|[286]
114|Fl|𫓧|flerovium|[290]
115|Mc|镆|moscovium|[290]
116|Lv|𫟷|livermorium|[293]
117|Ts|鿬|tennessine|[294]
118|Og|鿫|oganesson|[294]`.trim().split('\n').map(function (line) { return line.split('|'); });

  var categories = {
    'nonmetal': { name: '非金属', color: '#7cb6a3', note: '这些元素的单质差别很大；可形成许多共价化合物。' },
    'noble-gas': { name: '稀有气体', color: '#b39ac7', note: '第 18 族；多数常见条件下化学反应性较低，但不是绝对不反应。' },
    'alkali-metal': { name: '碱金属', color: '#eda68d', note: '氢以外的第 1 族；常见离子为 +1 价，单质通常活泼。' },
    'alkaline-earth': { name: '碱土金属', color: '#eacb87', note: '第 2 族；常见离子为 +2 价，具体反应性各有不同。' },
    'metalloid': { name: '类金属', color: '#a7ba74', note: '教学中的性质分类，边界没有唯一划法；部分具有半导体性质。' },
    'halogen': { name: '卤素', color: '#87bfc0', note: '第 17 族；常见卤素单质有氧化性，卤离子常见 −1 价。' },
    'transition-metal': { name: 'd 区金属', color: '#93aac8', note: '按周期表 d 区作教学分类，包含第 12 族；不等同于严格的过渡元素定义。' },
    'post-transition-metal': { name: '其他金属', color: '#a8b7b1', note: '以 p 区金属为主；氧化态和反应性需看具体元素。' },
    'lanthanide': { name: '镧系', color: '#c3abcb', note: '原子序数 57–71；为方便阅读从第 6 周期抽出显示。' },
    'actinide': { name: '锕系', color: '#d8acb2', note: '原子序数 89–103；均无稳定同位素，从第 7 周期抽出显示。' },
    'unknown': { name: '性质待研究', color: '#bdc4bd', note: '人工合成的超重元素，许多宏观性质尚未实验测定；族号不代表性质已获证实。' }
  };

  var periodEnds = [2, 10, 18, 36, 54, 86, 118];
  var nonmetals = [1, 6, 7, 8, 15, 16, 34];
  var metalloids = [5, 14, 32, 33, 51, 52];
  var gases = [1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86];
  var liquids = [35, 80];

  // 每行：发现它的线索 | 性质 | 常见用途。用途中的化合物不等同于元素单质。
  var detailRows = `
H|水和许多有机物都含有氢元素。|常见单质 H₂ 无色、密度小、可燃；与氧反应生成水。|氢用于合成氨，也可作为燃料电池的反应物。
He|气球里的氦和太阳名字有渊源。|单原子气体，不可燃，常见条件下反应性很低。|氦用于低温冷却、检漏和保护气氛。
Li|手机电池里能找到含锂材料。|轻质金属，常见离子 Li⁺；元素锂与锂盐性质不同。|锂化合物用于锂离子电池、玻璃和陶瓷。
Be|铍能让轻质合金更坚硬。|轻、硬的金属，表面可形成氧化层；含铍粉尘有害。|用于专业合金与 X 射线设备窗口材料。
B|耐热玻璃的一部分秘密在硼。|类金属；可形成硼酸盐，性质不同于元素硼。|硼化合物用于硼硅玻璃、玻璃纤维和材料制造。
C|铅笔芯和钻石竟然都含碳。|石墨、金刚石是同素异形体；结构不同导致硬度和导电性不同。|石墨用于电极；碳也是有机物结构的重要骨架。
N|空气里最多的气体是氮气。|常见单质 N₂；三键较强，常温下对许多物质反应较慢。|氮气用于保护气氛；含氮化合物用于肥料。
O|呼吸、铁锈和火焰都和氧有关。|常见单质 O₂ 支持许多物质燃烧，本身不是这些燃烧反应中的燃料。|氧用于医疗供氧、炼钢和工业氧化过程。
F|牙膏中的氟化物不是氟气。|F₂ 是很活泼的卤素单质；与稳定氟化物的性质截然不同。|氟化物用于部分牙膏；含氟材料有多种工业用途。
Ne|霓虹灯的名字来自氖。|单原子稀有气体，常见条件下反应性很低。|低压氖放电发出橙红色光，用于指示灯和灯管。
Na|食盐含钠，却不是金属钠。|Na 活泼，常见离子 Na⁺；氯化钠中的钠以离子形式存在。|钠盐广泛用于食品和化工；钠的化合物性质各不相同。
Mg|叶绿素的结构里有镁。|轻金属，常见 Mg²⁺；燃烧可生成白色氧化镁。|镁用于轻质合金，镁化合物用于耐火材料。
Al|易拉罐很轻，与铝有关。|表面薄的致密氧化层提供保护；氧化铝和氢氧化铝有两性。|用于包装、导线、建筑和轻质合金。
Si|沙子和芯片都和硅有关。|单质硅是半导体；二氧化硅是化合物，两者不能混为一谈。|高纯硅用于电子芯片；硅酸盐用于玻璃和陶瓷。
P|DNA、骨骼和肥料中都有磷。|白磷、红磷是同素异形体；白磷活泼且有毒，本项目仅作封闭虚拟观察。|磷酸盐用于肥料；生物体中的磷多以化合物形式存在。
S|黄色的硫和火山故事常常一起出现。|非金属，有多种同素异形体；充分燃烧主要生成 SO₂。|硫用于制造硫酸；硫化过程可改变橡胶性质。
Cl|泳池消毒与食盐都涉及氯的化学。|Cl₂ 为黄绿色气体，有氧化性；氯离子 Cl⁻ 与氯气性质不同。|含氯化合物用于水处理和制造材料；具体产品不能任意混合。
Ar|焊接时，氩气可以当保护罩。|常见条件下反应性很低，常温是单原子气体。|用于焊接保护气和一些灯泡。
K|钾和钠是周期表里的同族邻居。|金属钾活泼，常见离子 K⁺；钾盐不等于金属钾。|钾盐用于肥料；钾离子参与生物体的电信号过程。
Ca|骨骼里的钙藏在化合物中。|常见 Ca²⁺；碳酸钙难溶，氧化钙和水反应生成氢氧化钙。|石灰石、石膏、水泥等材料都与含钙化合物有关。
Sc|小量的钪能改变合金性质。|金属，常见氧化态 +3；元素单质在空气中可氧化。|用于部分铝合金和专业照明材料。
Ti|钛的强度与重量比很出色。|金属，表面氧化层使其较耐腐蚀；常见 +4 氧化态。|用于航空合金、植入器械；TiO₂ 用作白色颜料。
V|钒是合金和催化材料的帮手。|可有多种氧化态，不同化合物呈现不同颜色。|用于合金钢；五氧化二钒用于工业催化。
Cr|不锈钢的耐腐蚀性离不开铬。|可形成保护性氧化层；不同价态铬化合物的性质和风险差异很大。|用于不锈钢和表面镀层。
Mn|二氧化锰能帮助过氧化氢更快分解。|有多种氧化态；高锰酸根常呈紫色，MnO₂ 可作催化剂。|用于炼钢、电池及催化过程。
Fe|从桥梁到血红蛋白，都有铁元素。|金属铁有磁性；潮湿空气中的锈蚀涉及氧化还原，铁常见 +2、+3 价。|用于钢铁材料；人体内的铁以复杂化合物形式存在。
Co|蓝色陶瓷颜料中可含钴。|金属，可呈磁性；常见钴-59 稳定，钴-60 具有放射性。|钴化合物用于颜料和部分电池材料。
Ni|镍能帮助合金抵御腐蚀。|金属，有磁性，常见 Ni²⁺；也可作化学反应催化剂。|用于不锈钢、合金、电镀和部分电池。
Cu|电线里的铜很会传电。|导电、导热良好；常见 Cu²⁺ 盐溶液呈蓝色，具体颜色受配位环境影响。|用于电线、水管和合金；黄铜是铜锌合金。
Zn|铁板外层的锌可以帮助防锈。|常见 Zn²⁺；锌比铁更容易被氧化，能提供牺牲保护。|用于镀锌、黄铜和电池。
Ga|镓的熔点接近温暖的室温。|金属，具有较低熔点；半导体用途常涉及镓的化合物。|砷化镓、氮化镓用于电子和光电器件。
Ge|锗也能做半导体。|类金属，导电性质可通过材料结构和掺杂改变。|用于半导体、红外光学与光纤材料。
As|砷可以出现在半导体化合物里。|类金属；不同砷化合物性质不同，多种砷化合物有毒。|砷化镓用于专业半导体器件。
Se|硒的电学性质会受光影响。|非金属，有多种形态，可形成硒化物。|用于玻璃、光电及其他材料领域。
Br|常温下呈液态的非金属很少，溴就是一个。|Br₂ 为红棕色液体，具有挥发性和氧化性。|溴化合物用于材料合成和部分摄影材料。
Kr|氪属于稀有气体家族。|单原子气体，常见条件下反应性很低。|用于部分照明设备和激光技术。
Rb|铷能帮助我们研究非常精确的时间。|活泼的碱金属，常见 +1 价。|用于原子钟和基础物理研究。
Sr|锶化合物能带来鲜明的红色光。|碱土金属，常见 Sr²⁺；同位素的稳定性需分别判断。|用于磁性材料和发光材料。
Y|钇能为特殊陶瓷和发光材料帮忙。|金属，常见 +3 价，常以化合物形式使用。|用于荧光粉、陶瓷和激光晶体。
Zr|锆以较耐腐蚀而闻名。|表面可形成氧化层；氧化锆与金属锆性质不同。|氧化锆用于陶瓷；锆合金用于专业工程设备。
Nb|铌能帮助合金获得特别的性能。|金属，较耐腐蚀；部分铌合金可在低温下超导。|用于高性能钢和超导磁体材料。
Mo|高温材料中常有钼的身影。|熔点较高的金属，可有多种氧化态。|用于合金钢、催化剂与润滑材料中的二硫化钼。
Tc|锝没有稳定同位素。|放射性金属，化学性质与核素寿命是两个不同概念。|特定锝核素用于专业医学成像和科学研究。
Ru|钌是铂族金属的一员。|硬的金属，具有多种氧化态，可形成催化材料。|用于催化、合金和电子电阻材料。
Rh|汽车尾气处理催化器可用到铑。|铂族金属，较耐腐蚀，能参与催化过程。|用于尾气催化器和专业镀层。
Pd|钯能够吸收氢。|铂族金属，可作多种反应的催化剂。|用于催化、电子和合金材料。
Ag|银的导电能力很强。|金属银较不活泼，表面变黑常涉及生成硫化银。|用于电子导体、首饰和含银材料。
Cd|镉曾广泛用于一些可充电电池。|较软的金属，常见 +2 价；镉及多种化合物有毒。|用于专业材料，镍镉电池是一个历史应用例子。
In|触摸屏材料中可以找到铟。|柔软的金属；透明导电材料常使用其氧化物。|氧化铟锡用于透明导电薄膜。
Sn|锡可以给其他金属加上一层外衣。|较软金属，常见 +2、+4 氧化态。|用于镀锡板和焊料合金。
Sb|锑的性质跨在金属与非金属之间。|类金属，常见 +3、+5 氧化态。|用于合金及某些阻燃和半导体材料。
Te|碲能出现在把热和电联系起来的材料里。|类金属，可形成碲化物。|用于热电材料和部分太阳能电池材料。
I|碘单质蒸气常呈紫色。|卤素，可形成 I⁻；碘盐和碘单质的性质不一样。|含碘化合物用于食品强化和专业医药材料。
Xe|氙虽属于稀有气体，也能形成化合物。|单原子气体；在合适条件下可形成氙氟化物等。|用于光源和离子推进技术。
Cs|铯与精确定义时间有关。|活泼的碱金属，常见 Cs⁺。|铯原子钟是精密时间测量的重要工具。
Ba|钡的不同化合物，性质差别很大。|碱土金属，常见 Ba²⁺；硫酸钡难溶，不能把这一点推广到所有钡盐。|钡化合物用于玻璃、钻井及专业成像材料。
La|镧是镧系元素的起点。|金属，常见 +3 价，易与氧形成化合物。|用于光学玻璃、合金和催化材料。
Ce|氧化铈可以帮助抛光玻璃。|可呈 +3、+4 氧化态，氧化态变化对催化有意义。|用于玻璃抛光粉和催化材料。
Pr|镨能给某些玻璃带来颜色。|镧系金属，常见 +3 价。|用于磁性合金、玻璃和陶瓷着色。
Nd|强力磁铁里常有钕。|镧系金属，常见 +3 价；磁体用途涉及合金。|钕铁硼用于电机、耳机和其他永磁设备。
Pm|钷没有稳定同位素。|具有放射性的镧系元素。|主要用于专业研究和特定放射性器件。
Sm|钐能帮助磁铁耐受较高温度。|镧系金属，常见 +3 价，也有 +2 价化合物。|钐钴合金用于永磁材料。
Eu|铕常与鲜艳的发光材料有关。|可呈 +2、+3 氧化态。|含铕荧光材料用于显示和照明。
Gd|钆具有特殊的磁学性质。|镧系金属；特定核素有较强中子吸收能力。|钆化合物用于专业成像及磁性材料。
Tb|铽化合物能在发光材料中出现。|镧系金属，常见 +3 价，部分化合物有 +4 价。|用于荧光材料和磁性合金。
Dy|镝能改善部分永磁体的性能。|镧系金属，常见 +3 价。|用于永磁材料和专业合金。
Ho|钬的磁学性质很有特色。|镧系金属，常见 +3 价。|用于专业激光和磁性材料。
Er|铒可以帮助光纤中的光信号。|镧系金属，常见 +3 价。|掺铒光纤用于光通信放大器。
Tm|铥是较少见的镧系元素。|金属，常见 +3 价。|用于专业激光材料和研究。
Yb|镱可以为激光材料提供帮助。|镧系金属，常见 +2、+3 氧化态。|用于激光、精密测量和材料研究。
Lu|镥是镧系元素的末尾。|较致密的金属，常见 +3 价。|含镥晶体用于辐射探测器等专业设备。
Hf|铪与锆的化学性质相近。|金属，能形成稳定氧化层。|用于高温合金、控制材料和微电子中的氧化铪。
Ta|钽的氧化层很适合一些电子器件。|金属，较耐腐蚀，常见 +5 价。|用于电容器和耐腐蚀设备材料。
W|钨以很高的熔点著称。|致密金属；碳化钨是另一种很硬的化合物材料。|用于高温部件和含碳化钨刀具。
Re|铼能帮助合金承受苛刻环境。|高熔点金属，可有多种氧化态。|用于高温合金和催化材料。
Os|锇是非常致密的金属。|铂族金属；其氧化物与金属单质性质和危险性不同。|主要用于专业合金和研究。
Ir|铱能应对一些高温和腐蚀环境。|铂族金属，较耐腐蚀且熔点高。|用于专业电极、高温材料和合金。
Pt|铂可以帮助许多反应更快发生。|较不活泼的贵金属，也能充当催化材料。|用于催化器、首饰和专业电极。
Au|金可以被加工成很薄的金箔。|延展性好，常见环境下较不活泼。|用于首饰、电子接点和专业材料。
Hg|汞是在常温下呈液态的金属。|具有挥发性；汞和部分汞化合物有毒。|曾用于温度计和开关；此处仅通过屏幕认识。
Tl|铊的化学不能用外观判断。|较软的金属，常见 +1、+3 价；多种铊化合物有毒。|用于少量专业电子和光学材料。
Pb|铅很重，也比较软。|常见 +2、+4 价；铅及其多种化合物有毒。|用于铅酸蓄电池与专业辐射屏蔽材料。
Bi|铋有很长寿但不稳定的天然核素。|金属铋较脆；铋-209 的寿命极长，但不能因此称为稳定核素。|用于低熔点合金和含铋专业材料。
Po|钋没有稳定同位素。|放射性元素；核衰变性质必须按具体核素讨论。|主要用于专业研究。
At|砹在自然界中极为稀少。|放射性卤族元素，许多宏观性质难以直接测量。|主要用于核科学和专业研究。
Rn|氡是具有放射性的稀有气体。|无稳定同位素，属于一些天然衰变链。|环境监测会关注氡；不是家用实验材料。
Fr|钫是极稀少的放射性碱金属元素。|无稳定同位素，宏观样品性质难以直接测量。|主要用于原子物理研究。
Ra|镭的发现属于放射性研究史。|放射性碱土金属，常见 +2 价。|主要在历史和专业核科学语境中认识。
Ac|锕是锕系的起点。|放射性金属，常见 +3 价。|用于核科学和专业研究。
Th|钍是一种天然存在的放射性元素。|金属，常见 +4 价；不同核素有不同半衰期。|用于核材料及基础研究。
Pa|镤在天然衰变链里出现。|稀少的放射性金属，常见 +5 价。|主要用于基础科学研究。
U|铀-238 的衰变时钟非常漫长。|天然放射性金属，可有多种氧化态；核素性质不能只看元素名称。|用于核能及地球科学研究，本项目只提供核变化概念。
Np|镎的名字与海王星有关。|人工合成的放射性锕系元素，具有多种氧化态。|主要用于核科学研究。
Pu|钚需要按具体核素来理解。|放射性锕系金属，可有多种氧化态。|用于专业核技术与研究，非普通实验材料。
Am|某些专业烟雾探测器用到镅核素。|放射性锕系元素，常见 +3 价。|特定封装辐射源用于专业器件；不能拆解研究。
Cm|锔的名字纪念居里夫妇。|人工合成的放射性锕系元素。|用于科学研究和专业仪器。
Bk|锫的名字来自伯克利。|人工合成的放射性锕系元素。|主要用于重元素研究。
Cf|锎的名字来自加利福尼亚。|人工合成的放射性锕系元素；具体核素有各自的衰变方式。|用于核科学和专业探测研究。
Es|锿的名字纪念爱因斯坦。|仅能研究微量样品的放射性锕系元素。|主要用于基础科学研究。
Fm|镄的名字纪念费米。|人工合成的放射性元素，尚无普通宏观材料用途。|主要用于核科学研究。
Md|钔的名字纪念门捷列夫。|人工合成的放射性元素，研究依赖极少量原子。|主要用于基础科学研究。
No|锘的名字纪念诺贝尔。|人工合成的放射性元素。|主要用于重元素的化学和核性质研究。
Lr|铹是锕系元素的末尾。|人工合成的放射性元素，电子结构有特殊之处。|主要用于重元素研究。
Rf|𬬻的名字纪念卢瑟福。|人工合成、短寿命的超重元素，可研究少量原子的化学。|用于基础核科学研究。
Db|𬭊的名字与杜布纳有关。|人工合成的超重元素，宏观材料性质资料有限。|用于基础核科学研究。
Sg|𬭳的名字纪念西博格。|人工合成的超重元素，可通过极少量原子研究化学性质。|用于基础核科学研究。
Bh|𬭛的名字纪念玻尔。|人工合成的超重元素，没有普通宏观样品。|用于基础核科学研究。
Hs|𬭶的名字与黑森地区有关。|人工合成的超重元素；已开展少原子化学研究。|用于基础核科学研究。
Mt|鿏的名字纪念迈特纳。|人工合成的超重元素，很多化学性质尚未实验确定。|用于基础核科学研究。
Ds|𫟼的名字来自达姆施塔特。|人工合成的超重元素，没有普通宏观材料样品。|用于基础核科学研究。
Rg|𬬭的名字纪念伦琴。|人工合成的超重元素，宏观性质尚未实验确定。|用于基础核科学研究。
Cn|鿔的名字纪念哥白尼。|人工合成的超重元素；不能把理论预测当成全部实测性质。|用于重元素物理和化学研究。
Nh|鿭是原子序数 113 的元素。|人工合成的超重元素，性质研究仍依赖少量原子。|用于基础核科学研究。
Fl|𫓧是原子序数 114 的元素。|人工合成的超重元素，宏观性质尚不完整。|用于重元素物理和化学研究。
Mc|镆是原子序数 115 的元素。|人工合成、具有放射性的超重元素。|用于基础核科学研究。
Lv|𫟷是原子序数 116 的元素。|人工合成的超重元素，宏观材料性质未全面测定。|用于基础核科学研究。
Ts|鿬是原子序数 117 的元素。|位于第 17 族，但不能把轻卤素的全部性质直接套用。|用于基础核科学研究。
Og|鿫是原子序数 118 的元素。|位于第 18 族；常温宏观状态未实验确定，不直接标成气体。|用于基础核科学研究。`.trim().split('\n');
  var details = {};
  detailRows.forEach(function (line) { var p = line.split('|'); details[p[0]] = p.slice(1); });

  function elementLayout(number) {
    var period = periodEnds.findIndex(function (end) { return number <= end; }) + 1;
    if (number >= 57 && number <= 71) return { period: 6, group: null, row: 9, col: number - 54 };
    if (number >= 89 && number <= 103) return { period: 7, group: null, row: 10, col: number - 86 };
    var first = period === 1 ? 1 : periodEnds[period - 2] + 1;
    var local = number - first + 1;
    var group = period === 1 ? (number === 1 ? 1 : 18) :
      (period === 2 || period === 3 ? (local <= 2 ? local : local + 10) :
        (period >= 6 && local >= 18 ? local - 14 : local));
    return { period: period, group: group, row: period, col: group };
  }
  function categoryFor(n, layout) {
    if (n >= 109) return 'unknown';
    if (n >= 57 && n <= 71) return 'lanthanide';
    if (n >= 89 && n <= 103) return 'actinide';
    if (nonmetals.indexOf(n) !== -1) return 'nonmetal';
    if (metalloids.indexOf(n) !== -1) return 'metalloid';
    if (layout.group === 18) return 'noble-gas';
    if (layout.group === 17) return 'halogen';
    if (layout.group === 1) return 'alkali-metal';
    if (layout.group === 2) return 'alkaline-earth';
    if (layout.group >= 3 && layout.group <= 12) return 'transition-metal';
    return 'post-transition-metal';
  }
  var elements = rows.map(function (p) {
    var n = Number(p[0]), layout = elementLayout(n), detail = details[p[1]];
    var hasWeight = p[4].charAt(0) !== '[';
    var phase = n >= 100 || n === 85 || n === 87 ? '未知' :
      (gases.indexOf(n) !== -1 ? '气态' : (liquids.indexOf(n) !== -1 ? '液态' : '固态'));
    return {
      number: n, symbol: p[1], name: p[2], english: p[3],
      mass: Number(p[4].replace(/[\[\]]/g, '')), massDisplay: p[4], hasStandardWeight: hasWeight,
      massNote: hasWeight ? '相对原子质量的教学代表值，不是某一个原子的质量数。天然同位素比例可使数值有所变化。' : '方括号表示 IUPAC 2022 表所列代表核素的质量数，不是标准原子量。',
      group: layout.group, period: layout.period, position: { row: layout.row, col: layout.col },
      category: categoryFor(n, layout), phase: phase,
      phaseNote: '约 25°C、101.325 kPa 的单质常见状态；无法可靠实测的宏观状态标为未知。',
      summary: detail[0], properties: detail[1], uses: detail[2],
      kids: detail[0] + ' 点一点，再找找它在生活里的藏身处！',
      sourceIds: ['iupac', 'ciaaw', 'ccs-names', 'rsc'],
      reference: 'https://periodic-table.rsc.org/element/' + n + '/' + p[3]
    };
  });

  function substance(formula, name, coefficient, state) {
    return { formula: formula, name: name, coefficient: coefficient, state: state };
  }
  var reactions = [
    { id: 'peroxide', name: '过氧化氢分解制氧气', equation: '2H₂O₂ → 2H₂O + O₂↑', type: '分解反应', reactants: [substance('H2O2', '过氧化氢（纯溶质）', 2, 'aq')], products: [substance('H2O', '水', 2, 'l'), substance('O2', '氧气', 1, 'g')], conditions: '二氧化锰作催化剂', catalyst: 'MnO2', note: '催化剂改变反应速率，不改变给定纯过氧化氢的理论氧气产量。输入质量是 H₂O₂ 溶质质量，不是整瓶溶液的质量。', kids: '小帮手让气泡更快出现，但不会凭空增加氧气！', hazard: 'supervised', sourceIds: ['openstax-stoich', 'rsc'] },
    { id: 'permanganate', name: '高锰酸钾分解制氧气', equation: '2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑', type: '分解反应', reactants: [substance('KMnO4', '高锰酸钾', 2, 's')], products: [substance('K2MnO4', '锰酸钾', 1, 's'), substance('MnO2', '二氧化锰', 1, 's'), substance('O2', '氧气', 1, 'g')], conditions: '虚拟加热', note: '这是受热分解的化学计量模型，不提供真实操作温度或完整实验操作规程。', kids: '紫色材料改变了，氧气宝宝从里面出来了。', hazard: 'virtual-only', sourceIds: ['openstax-stoich'] },
    { id: 'bicarbonate', name: '乙酸与小苏打产生二氧化碳', equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑', type: '酸与碳酸氢盐', reactants: [substance('CH3COOH', '乙酸（纯溶质）', 1, 'aq'), substance('NaHCO3', '碳酸氢钠', 1, 's')], products: [substance('CH3COONa', '乙酸钠', 1, 'aq'), substance('H2O', '水', 1, 'l'), substance('CO2', '二氧化碳', 1, 'g')], conditions: '溶液中接触', note: '食醋是混合物。本模型输入的是乙酸本身的量，忽略气体溶解与逸散损失。', kids: '像做点心配材料：谁先用完，气泡就先被谁限制！', hazard: 'supervised', sourceIds: ['openstax-reactions', 'openstax-yield'] },
    { id: 'neutralization', name: '盐酸与氢氧化钠中和', equation: 'HCl + NaOH → NaCl + H₂O', type: '中和反应', reactants: [substance('HCl', '氯化氢（盐酸溶质）', 1, 'aq'), substance('NaOH', '氢氧化钠（溶质）', 1, 'aq')], products: [substance('NaCl', '氯化钠', 1, 'aq'), substance('H2O', '水', 1, 'l')], conditions: '稀水溶液', note: '净离子关系为 H⁺ + OH⁻ → H₂O。恰好中和的稀溶液在 25°C 近似 pH 7；酸或碱过量时不成立。', kids: '酸和碱要配得刚刚好，多出来的小伙伴还会留下。', hazard: 'virtual-only', sourceIds: ['openstax-reactions', 'openstax-water'] },
    { id: 'limewater', name: '二氧化碳使澄清石灰水浑浊', equation: 'CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O', type: '沉淀反应', reactants: [substance('CO2', '二氧化碳', 1, 'g'), substance('Ca(OH)2', '氢氧化钙（溶质）', 1, 'aq')], products: [substance('CaCO3', '碳酸钙沉淀', 1, 's'), substance('H2O', '水', 1, 'l')], conditions: '适量二氧化碳', note: '只模拟初始变浑浊阶段。继续通入过量 CO₂ 时，沉淀可转为可溶碳酸氢钙；本条单步计算不覆盖后续过程。', kids: '原本透明的水里，出现了许多白色的小颗粒。', hazard: 'supervised', sourceIds: ['openstax-reactions'] },
    { id: 'displacement', name: '铁置换硫酸铜中的铜', equation: 'Fe + CuSO₄ → FeSO₄ + Cu', type: '置换 / 氧化还原', reactants: [substance('Fe', '铁', 1, 's'), substance('CuSO4', '硫酸铜（无水溶质）', 1, 'aq')], products: [substance('FeSO4', '硫酸亚铁', 1, 'aq'), substance('Cu', '铜', 1, 's')], conditions: '水溶液中接触', note: '铁失去电子，铜离子得到电子。质量输入按无水 CuSO₄ 溶质计，不能把同质量五水硫酸铜直接代入。', kids: '铁把铜离子请了出来，金属铜慢慢出现。', hazard: 'virtual-only', sourceIds: ['openstax-reactions'] },
    { id: 'precipitation', name: '氯化钙与碳酸钠生成沉淀', equation: 'CaCl₂ + Na₂CO₃ → CaCO₃↓ + 2NaCl', type: '复分解 / 沉淀', reactants: [substance('CaCl2', '氯化钙（溶质）', 1, 'aq'), substance('Na2CO3', '碳酸钠（溶质）', 1, 'aq')], products: [substance('CaCO3', '碳酸钙沉淀', 1, 's'), substance('NaCl', '氯化钠', 2, 'aq')], conditions: '水溶液混合', note: '净离子关系为 Ca²⁺ + CO₃²⁻ → CaCO₃↓。理想计量忽略沉淀的有限溶解度。', kids: '两杯透明液体里的伙伴重新组合，白色颗粒出现啦。', hazard: 'supervised', sourceIds: ['openstax-reactions'] },
    { id: 'electrolysis', name: '水的电解', equation: '2H₂O → 2H₂↑ + O₂↑', type: '电解 / 氧化还原', reactants: [substance('H2O', '水', 2, 'l')], products: [substance('H2', '氢气', 2, 'g'), substance('O2', '氧气', 1, 'g')], conditions: '电能、适当电解质与惰性电极（虚拟模型）', note: '理想模型忽略电极副反应与气体损失。同温同压下 H₂∶O₂ 的体积比为 2∶1；纯水导电性很弱，不代表任意水样或电极都只有这些产物。', kids: '电能帮忙拆水分子，氢气份数是氧气的两倍。', hazard: 'virtual-only', sourceIds: ['openstax-stoich', 'openstax-electrolytes'] },
    { id: 'phosphorus', name: '白磷氧化（封闭虚拟观察）', equation: 'P₄ + 5O₂ → P₄O₁₀', type: '氧化反应', reactants: [substance('P4', '白磷（概念模型）', 1, 's'), substance('O2', '氧气', 5, 'g')], products: [substance('P4O10', '十氧化四磷', 1, 's')], conditions: '仅观察充分氧化的虚拟模型', note: '采用氧气充足时 P₄O₁₀ 的简化总反应；氧不足时可能有其他含磷氧化物。本条不提供真实取用、点燃或配量操作。', kids: '只隔着屏幕观察：有氧气时，材料可能发生很大的变化。', hazard: 'virtual-only', quantitative: false, sourceIds: ['rsc-phosphorus', 'openstax-reactions'] },
    { id: 'combustion', name: '甲烷完全燃烧', equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O', type: '燃烧 / 氧化还原', reactants: [substance('CH4', '甲烷', 1, 'g'), substance('O2', '氧气', 2, 'g')], products: [substance('CO2', '二氧化碳', 1, 'g'), substance('H2O', '水', 2, 'l')], conditions: '充分燃烧；水冷凝分离后对干气体计量', note: '只模拟完全燃烧；氧不足时可能产生一氧化碳等，不能用本方程式预测。水按冷凝分离后的液态处理，不作为干气体积。温压参数只换算另行收集的干气体体积，不重新预测产物相态。', kids: '燃料里的原子没有消失，它们重新排队组成了水和二氧化碳。', hazard: 'virtual-only', sourceIds: ['openstax-stoich', 'openstax-reactions'] },
    { id: 'calcium_carbonate', name: '碳酸钙与盐酸反应', equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑', type: '酸与碳酸盐', reactants: [substance('CaCO3', '碳酸钙', 1, 's'), substance('HCl', '氯化氢（盐酸溶质）', 2, 'aq')], products: [substance('CaCl2', '氯化钙', 1, 'aq'), substance('H2O', '水', 1, 'l'), substance('CO2', '二氧化碳', 1, 'g')], conditions: '稀溶液接触', note: '用来理解碳酸盐遇酸产生 CO₂；生活中的水垢通常是混合物，不能一概当作纯 CaCO₃。', kids: '小石头里的碳酸盐遇到合适的酸，也能放出气泡。', hazard: 'virtual-only', sourceIds: ['openstax-reactions', 'openstax-yield'] },
    { id: 'iron_oxide', name: '铁氧化的简化守恒模型', equation: '4Fe + 3O₂ → 2Fe₂O₃', type: '氧化反应', reactants: [substance('Fe', '铁', 4, 's'), substance('O2', '氧气', 3, 'g')], products: [substance('Fe2O3', '氧化铁', 2, 's')], conditions: '指定生成 Fe₂O₃ 的理想模型', note: '实际铁锈常含水合氧化物、羟基氧化物等。本条用于守恒计算，不宣称真实铁锈只有 Fe₂O₃。', kids: '铁结合了空气里的氧，生成物的质量可以比原来的铁更大。', hazard: 'supervised', sourceIds: ['openstax-reactions'] },
    { id: 'silver_chloride', name: '硝酸银与氯化钠生成沉淀', equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃', type: '复分解 / 沉淀', reactants: [substance('AgNO3', '硝酸银（溶质）', 1, 'aq'), substance('NaCl', '氯化钠（溶质）', 1, 'aq')], products: [substance('AgCl', '氯化银沉淀', 1, 's'), substance('NaNO3', '硝酸钠', 1, 'aq')], conditions: '水溶液混合', note: '净离子关系为 Ag⁺ + Cl⁻ → AgCl↓；该简化计量模型忽略溶解平衡与光照影响。', kids: '特定的离子相遇，会变成不太愿意待在水里的白色颗粒。', hazard: 'virtual-only', sourceIds: ['openstax-reactions'] },
    { id: 'hydrogen_water', name: '氢与氧生成水（计量模型）', equation: '2H₂ + O₂ → 2H₂O', type: '化合 / 氧化还原', reactants: [substance('H2', '氢气', 2, 'g'), substance('O2', '氧气', 1, 'g')], products: [substance('H2O', '水', 2, 'l')], conditions: '仅作反应计量模型', note: '方程式表达物质数量关系，不是现实中的混合或点燃指导。', kids: '每两份氢气配一份氧气，原子能刚好组成水。', hazard: 'virtual-only', sourceIds: ['openstax-stoich', 'openstax-yield'] }
  ];
  var reactionReferences = {
    peroxide: ['rsc-peroxide'], permanganate: ['rsc-oxygen'], bicarbonate: ['acs-baking'],
    displacement: ['rsc-displacement'], precipitation: ['colorado-precipitation'], limewater: ['rsc-carbonates']
  };
  reactions.forEach(function (reaction) {
    reaction.sourceIds = reaction.sourceIds.concat(reactionReferences[reaction.id] || []);
  });

  // 精选已核对核素：未在本列表中的组合显示“未收录”，不能用中子≈质子推断稳定。
  var stableRows = [
    ['H', 1], ['H', 2], ['He', 3], ['He', 4], ['Li', 6], ['Li', 7], ['Be', 9],
    ['B', 10], ['B', 11], ['C', 12], ['C', 13], ['N', 14], ['N', 15],
    ['O', 16], ['O', 17], ['O', 18], ['F', 19], ['Ne', 20], ['Ne', 21], ['Ne', 22],
    ['Na', 23], ['Mg', 24], ['Mg', 25], ['Mg', 26], ['Al', 27], ['Si', 28], ['Si', 29], ['Si', 30],
    ['P', 31], ['S', 32], ['S', 33], ['S', 34], ['S', 36], ['Cl', 35], ['Cl', 37],
    ['Ar', 36], ['Ar', 38], ['Ar', 40], ['K', 39], ['K', 41], ['Ca', 40], ['Ca', 42], ['Ca', 43], ['Ca', 44],
    ['Fe', 56], ['Co', 59], ['Ni', 60], ['Pb', 206]
  ];
  function isotope(symbol, massNumber, extra) {
    var element = elements.find(function (e) { return e.symbol === symbol; });
    return Object.assign({
      id: symbol + '-' + massNumber, symbol: symbol, name: element.name + '-' + massNumber,
      number: element.number, massNumber: massNumber, protons: element.number, neutrons: massNumber - element.number,
      stable: true, halfLifeYears: null, halfLifeLabel: '稳定核素', decayMode: null, daughterId: null,
      note: '该核素通常归为稳定核素；中性原子的电子数等于质子数。', sourceIds: ['nist-isotopes']
    }, extra || {});
  }
  var isotopes = stableRows.map(function (r) { return isotope(r[0], r[1]); });
  isotopes.push(
    isotope('H', 3, { stable: false, halfLifeYears: 12.3, halfLifeLabel: '约 12.3 年', decayMode: 'beta-', daughterId: 'He-3', note: '氚有 1 个质子、2 个中子；β⁻ 衰变成氦-3，同时放出电子和电子反中微子。', sourceIds: ['epa-tritium', 'openstax-nuclear'] }),
    isotope('C', 14, { stable: false, halfLifeYears: 5730, halfLifeLabel: '约 5730 年', decayMode: 'beta-', daughterId: 'N-14', note: 'β⁻ 衰变成氮-14；用于放射性碳测年时还需校准和样品条件判断。', sourceIds: ['openstax-halflives', 'openstax-nuclear'] }),
    isotope('Co', 60, { stable: false, halfLifeYears: 5.27, halfLifeLabel: '约 5.27 年', decayMode: 'beta-', daughterId: 'Ni-60', gammaAfter: true, note: '先 β⁻ 衰变，通常生成激发态镍-60，再发出 γ 光子退激。不能把 γ 说成让质子数改变。', sourceIds: ['epa-cobalt', 'openstax-nuclear'] }),
    isotope('U', 238, { stable: false, halfLifeYears: 4.47e9, halfLifeLabel: '约 44.7 亿年', decayMode: 'alpha', daughterId: 'Th-234', note: '主要发生 α 衰变生成钍-234；子核还会继续衰变，本馆曲线只统计原来的铀-238。', sourceIds: ['epa-uranium', 'openstax-nuclear'] })
  );

  var radiation = [
    { id: 'alpha', symbol: 'α', name: '阿尔法粒子', composition: '2 个质子 + 2 个中子，即氦-4 核', charge: '+2', nuclearChange: 'A 减 4，Z 减 2', note: '许多常见 α 粒子容易被纸张或表皮阻挡；进入体内仍可能造成严重伤害。屏蔽效果取决于能量与介质。', sourceIds: ['epa-radiation'] },
    { id: 'beta-', symbol: 'β⁻', name: '贝塔负粒子', composition: '核转变产生的高速电子，并伴随电子反中微子', charge: '−1', nuclearChange: 'A 不变，Z 加 1', note: '这里重点演示 β⁻。β⁺ 是正电子发射，核变化方向不同。β 粒子不是从电子壳层甩出去的。', sourceIds: ['openstax-nuclear'] },
    { id: 'gamma', symbol: 'γ', name: '伽马射线', composition: '核能级跃迁发出的光子', charge: '0', nuclearChange: 'A、Z 都不变', note: '来源于核过程，常跟随其他衰变；与 X 射线在能量上可以重叠，不能只凭能量划分。', sourceIds: ['epa-radiation', 'openstax-nuclear'] },
    { id: 'xray', symbol: 'X', name: 'X 射线', composition: '电子减速或核外电子能级跃迁等过程发出的光子', charge: '0', nuclearChange: '本身不是改变 A、Z 的衰变类型', note: 'X 与 γ 都是电磁辐射，主要按产生机制区分。屏蔽是逐步衰减，不是材料一放上就绝对挡住。', sourceIds: ['epa-radiation'] }
  ];

  var modelLimits = [
    '本馆提供有限反应与教学模型，未收录的材料组合不推断“会发生什么”。',
    '原子壳层是前 20 号元素的计数示意，不是真实电子固定绕圈的轨道；不预测核素稳定性。',
    '反应计算假定指定反应完全进行，输入为纯物质或纯溶质；忽略速率、活度、传热、副反应和部分溶解平衡。',
    '回收率只缩放实际收集量，未收集的产物不会在质量账本中消失；剩余原料按理论反应进度计算。',
    '干气体体积按 PV=nRT 计算；默认 25°C、101.325 kPa，忽略水蒸气和气体溶解。温压只换算独立收集的气体体积，不重新预测产物相态。',
    '衰变曲线是大量独立原子核的期望值。单个原子核何时衰变具有随机性，半衰期不是每个原子的倒计时。',
    'pH 使用理想稀溶液模型和水的自电离；默认 25°C。NaCl 示例不代表所有盐都呈中性。',
    '白磷、放射性物质及危险试剂只做虚拟观察。屏幕中的按钮、数量和动画不能直接当成真实实验操作规程。'
  ];

  function deepFreeze(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.getOwnPropertyNames(value).forEach(function (key) { deepFreeze(value[key]); });
      Object.freeze(value);
    }
    return value;
  }
  return deepFreeze({ version: '1.0.0', reviewedDate: '2026-10-19', elements: elements, categories: categories, reactions: reactions, isotopes: isotopes, radiation: radiation, sources: sources, modelLimits: modelLimits });
});
