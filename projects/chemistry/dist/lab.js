/* 化学探索馆 · curated virtual laboratory. No network or external dependency.
 * Sources are linked on each experiment. Simulated time/colour is illustrative;
 * stoichiometry follows balanced equations, with pure-solute amounts explicitly stated.
 * Public pure API is also exported for Node verification.
 */
(function (global) {
  'use strict';
  const GAS_ML_PER_MOL = 8.31446261815324 * 298.15 / 101.325 * 1000;
  const FARADAY = 96485.33212;
  const AW = { H: 1.008, C: 12.011, O: 15.999, Na: 22.98976928, P: 30.973761998, S: 32.06, Cl: 35.45, K: 39.0983, Ca: 40.078, Mn: 54.938043, Fe: 55.845, Cu: 63.546 };
  function mass(atoms) { return Object.keys(atoms).reduce((v, el) => v + AW[el] * atoms[el], 0); }
  const species = {
    H2O2: { name: '过氧化氢', atoms: { H: 2, O: 2 } }, H2O: { name: '水', atoms: { H: 2, O: 1 } }, O2: { name: '氧气', atoms: { O: 2 }, gas: true },
    KMnO4: { name: '高锰酸钾', atoms: { K: 1, Mn: 1, O: 4 } }, K2MnO4: { name: '锰酸钾', atoms: { K: 2, Mn: 1, O: 4 } }, MnO2: { name: '二氧化锰', atoms: { Mn: 1, O: 2 } },
    CH3COOH: { name: '乙酸', atoms: { C: 2, H: 4, O: 2 } }, NaHCO3: { name: '碳酸氢钠', atoms: { Na: 1, H: 1, C: 1, O: 3 } }, CH3COONa: { name: '乙酸钠', atoms: { C: 2, H: 3, O: 2, Na: 1 } }, CO2: { name: '二氧化碳', atoms: { C: 1, O: 2 }, gas: true },
    HCl: { name: '氯化氢溶质', atoms: { H: 1, Cl: 1 } }, NaOH: { name: '氢氧化钠', atoms: { Na: 1, O: 1, H: 1 } }, NaCl: { name: '氯化钠', atoms: { Na: 1, Cl: 1 } },
    'Ca(OH)2': { name: '氢氧化钙', atoms: { Ca: 1, O: 2, H: 2 } }, CaCO3: { name: '碳酸钙', atoms: { Ca: 1, C: 1, O: 3 } }, 'Ca(HCO3)2': { name: '碳酸氢钙（溶液中）', atoms: { Ca: 1, H: 2, C: 2, O: 6 } },
    Fe: { name: '铁', atoms: { Fe: 1 } }, CuSO4: { name: '硫酸铜溶质', atoms: { Cu: 1, S: 1, O: 4 } }, FeSO4: { name: '硫酸亚铁溶质', atoms: { Fe: 1, S: 1, O: 4 } }, Cu: { name: '铜', atoms: { Cu: 1 } },
    CaCl2: { name: '氯化钙溶质', atoms: { Ca: 1, Cl: 2 } }, Na2CO3: { name: '碳酸钠溶质', atoms: { Na: 2, C: 1, O: 3 } }, H2: { name: '氢气', atoms: { H: 2 }, gas: true }
  };
  Object.keys(species).forEach(f => { species[f].molarMass = mass(species[f].atoms); });
  const materials = {
    peroxide: { name: '过氧化氢溶液', short: 'H₂O₂', color: '#aedee1', kind: 'liquid', formula: 'H2O2' },
    catalyst: { name: '二氧化锰催化剂', short: 'MnO₂', color: '#57534e', kind: 'solid' },
    permanganate: { name: '高锰酸钾', short: 'KMnO₄', color: '#6c4684', kind: 'solid', formula: 'KMnO4' },
    vinegar: { name: '食醋模型（乙酸）', short: 'CH₃COOH', color: '#ecc77a', kind: 'liquid', formula: 'CH3COOH' },
    bicarbonate: { name: '小苏打', short: 'NaHCO₃', color: '#d5d8d0', kind: 'solid', formula: 'NaHCO3' },
    hcl: { name: '盐酸模型溶液', short: 'HCl', color: '#f2a391', kind: 'liquid', formula: 'HCl' },
    naoh: { name: '氢氧化钠模型溶液', short: 'NaOH', color: '#a1b9e2', kind: 'liquid', formula: 'NaOH' },
    universal: { name: '通用指示剂', short: 'pH', color: '#85b792', kind: 'drop' },
    cabbage: { name: '紫甘蓝指示剂', short: '花青素', color: '#aa70b5', kind: 'drop' },
    'soda-water': { name: '小苏打水模型', short: '弱碱性', color: '#a4cbb5', kind: 'liquid' },
    water: { name: '水', short: 'H₂O', color: '#a5d9e6', kind: 'liquid', formula: 'H2O' },
    limewater: { name: '澄清石灰水', short: 'Ca(OH)₂', color: '#c8e2d7', kind: 'liquid', formula: 'Ca(OH)2' },
    co2: { name: '二氧化碳模型气体', short: 'CO₂', color: '#a3aeb7', kind: 'gas', formula: 'CO2' },
    iron: { name: '铁片', short: 'Fe', color: '#7d9295', kind: 'metal', formula: 'Fe' },
    'copper-sulfate': { name: '硫酸铜溶液', short: 'CuSO₄', color: '#49a8d4', kind: 'liquid', formula: 'CuSO4' },
    'calcium-chloride': { name: '氯化钙溶液', short: 'CaCl₂', color: '#b3dcd6', kind: 'liquid', formula: 'CaCl2' },
    'sodium-carbonate': { name: '碳酸钠溶液', short: 'Na₂CO₃', color: '#bed7e7', kind: 'liquid', formula: 'Na2CO3' },
    sand: { name: '沙子', short: '不溶固体', color: '#c6a46f', kind: 'solid' },
    salt: { name: '食盐', short: 'NaCl', color: '#dadbd3', kind: 'solid', formula: 'NaCl' },
    'filter-paper': { name: '滤纸', short: '过滤屏障', color: '#e3cfab', kind: 'paper' },
    sulfate: { name: '硫酸钠支持电解质', short: '帮助导电', color: '#b8d9d5', kind: 'solid' },
    'phosphorus-model': { name: 'P₄ 粒子模型卡', short: '虚拟白磷', color: '#e8d398', kind: 'card' },
    'oxygen-model': { name: 'O₂ 场景模型卡', short: '有氧 / 无氧', color: '#ce9b92', kind: 'card' }
  };
  const port = (id, name, x, y, kind, direction) => ({ id, name, x, y, kind, direction });
  const apparatus = {
    flask: { name: '锥形瓶', kind: 'flask', ports: [port('out', '出气 / 蒸气口', 0, -70, 'gas', 'out')], pos: [205, 260] },
    'gas-syringe': { name: '集气筒', kind: 'syringe', ports: [port('in', '气体入口', -94, 0, 'gas', 'in')], pos: [580, 210] },
    dropper: { name: '滴管', kind: 'dropper', ports: [], pos: [430, 130] },
    testtube: { name: '耐热试管', kind: 'testtube', ports: [port('out', '出气口', 0, -79, 'gas', 'out')], pos: [210, 200] },
    heater: { name: '虚拟加热台', kind: 'heater', ports: [], pos: [205, 345] },
    stand: { name: '铁架台', kind: 'stand', ports: [], pos: [115, 260] },
    beaker: { name: '反应烧杯', kind: 'beaker', ports: [port('in', '杯内入口', 0, -68, 'liquid', 'in'), port('gas-in', '通气管入口', 43, -42, 'gas', 'in')], pos: [310, 265] },
    burette: { name: '滴定管', kind: 'burette', ports: [port('out', '滴液口', 0, 81, 'liquid', 'out')], pos: [310, 105] },
    stirrer: { name: '搅拌器', kind: 'stirrer', ports: [], pos: [310, 355] },
    'cup-acid': { name: '酸性样品杯', kind: 'beaker', ports: [], pos: [205, 260] },
    'cup-neutral': { name: '中性样品杯', kind: 'beaker', ports: [], pos: [425, 260] },
    'cup-base': { name: '碱性样品杯', kind: 'beaker', ports: [], pos: [645, 260] },
    'gas-canister': { name: '模型气体罐', kind: 'canister', ports: [port('out', '出气口', 48, -60, 'gas', 'out')], pos: [190, 245] },
    tongs: { name: '镊子', kind: 'tongs', ports: [], pos: [550, 210] },
    funnel: { name: '漏斗', kind: 'funnel', ports: [port('out', '漏斗下端', 0, 62, 'liquid', 'out')], pos: [570, 150] },
    receiver: { name: '接收杯（开口）', kind: 'beaker', ports: [port('in', '接收入口', 0, -67, 'liquid', 'in')], pos: [590, 305] },
    glassrod: { name: '玻璃棒', kind: 'rod', ports: [], pos: [400, 155] },
    condenser: { name: '直形冷凝管', kind: 'condenser', ports: [port('vapor-in', '蒸气入口', -104, -30, 'gas', 'in'), port('liquid-out', '馏出液出口', 104, 30, 'liquid', 'out'), port('cool-low', '冷却水低口（进）', 73, 68, 'cooling', 'in'), port('cool-high', '冷却水高口（出）', -70, -66, 'cooling', 'out')], pos: [435, 200] },
    'cooling-water': { name: '冷却水供水', kind: 'tap', ports: [port('out', '供水口', 42, 0, 'cooling', 'out')], pos: [440, 360] },
    drain: { name: '冷却水回收', kind: 'drain', ports: [port('in', '回水入口', 0, -35, 'cooling', 'in')], pos: [630, 85] },
    electrolyzer: { name: '双管电解槽', kind: 'electrolyzer', ports: [port('cathode', '阴极（−）', -60, 58, 'electric', 'in'), port('anode', '阳极（＋）', 60, 58, 'electric', 'in')], pos: [340, 220] },
    battery: { name: '直流电源', kind: 'battery', ports: [port('negative', '电源负极（−）', -44, -47, 'electric', 'out'), port('positive', '电源正极（＋）', 44, -47, 'electric', 'out')], pos: [610, 315] },
    'sealed-chamber': { name: '封闭演示盒', kind: 'chamber', ports: [port('signal', '观察信号', 99, 20, 'data', 'out')], pos: [305, 235] },
    screen: { name: '远程观察屏', kind: 'screen', ports: [port('in', '画面输入', -83, 16, 'data', 'in')], pos: [625, 230] }
  };
  const reagent = (id, target, amount, unit = 'mmol', extra = {}) => Object.assign({ id, target, amount, unit, min: unit === '份' ? 1 : 0.1, max: unit === '份' ? 3 : 30, step: unit === '份' ? 1 : 0.5 }, extra);
  const operation = (id, label, kids, detail) => ({ id, label, kids, detail: detail || label });
  const source = (title, url) => ({ title, url });
  const experiments = [
    {
      id: 'oxygen-peroxide', title: '氧气泡泡工厂', category: '气体', icon: 'bubble', level: '入门', color: '#86cdbc',
      subtitle: '同样的原料，催化剂能改变什么？', kidsGoal: '帮小气泡找到通往集气筒的路！',
      gear: ['flask', 'gas-syringe', 'dropper'], reagents: [reagent('peroxide', 'flask', 10), reagent('catalyst', 'flask', 1, '份')],
      links: [['flask.out', 'gas-syringe.in']], operations: [operation('check', '检查气路', '看看气泡的路通不通', '检查模型导气通路和可移动集气筒。'), operation('release', '释放催化剂', '让催化小帮手来帮忙', '模型将预置催化剂与溶液接触，观察氧气进入集气筒。')],
      question: '增加催化剂，主要会改变什么？', options: ['更快产生气泡', '凭空多出更多氧气', '氧气变成水'], correct: 0,
      equation: '2 H₂O₂ → 2 H₂O + O₂ ↑', condition: 'MnO₂ 催化',
      kidsExplain: '催化剂像一条更好走的小路，让反应跑得快一点。氧气有多少，仍要看原料有多少。',
      explain: '二氧化锰加快过氧化氢分解，反应前后催化剂的质量和化学性质不变。每 2 mol H₂O₂ 最多生成 1 mol O₂。催化剂不会改变本反应的理论产量。',
      limit: '本场景用教学时间表示相对快慢，不模拟真实动力学、温升或气体溶解。质量账本只计纯溶质，溶剂和催化剂不计入反应净变化。',
      sources: [source('RSC · 氧气的制备与性质', 'https://edu.rsc.org/experiments/the-preparation-and-properties-of-oxygen/396.article')]
    },
    {
      id: 'oxygen-permanganate', title: '另一条制氧路线', category: '气体', icon: 'heat', level: '进阶', color: '#b8a1d0',
      subtitle: '热分解与催化分解，有什么不同？', kidsGoal: '搭好模型，看看紫色固体能发生什么变化。',
      gear: ['stand', 'testtube', 'heater', 'gas-syringe'], reagents: [reagent('permanganate', 'testtube', 8)], links: [['testtube.out', 'gas-syringe.in']],
      operations: [operation('check', '检查固定与气路', '检查架子和气泡通道', '确认试管、支撑、加热台和集气装置齐全。'), operation('heat', '启动虚拟热分解', '打开屏幕里的加热台', '用动画观察热分解，模型加热档位只控制演示速度。')],
      question: '高锰酸钾在这次反应中是什么角色？', options: ['会被消耗的反应物', '完全不变的催化剂', '只是溶剂'], correct: 0,
      equation: '2 KMnO₄ → K₂MnO₄ + MnO₂ + O₂ ↑', condition: '加热（仅虚拟）',
      kidsExplain: '这次紫色原料自己发生了变化，一部分原子组成氧气，剩下的原子组成新的固体。',
      explain: '高锰酸钾受热分解生成锰酸钾、二氧化锰和氧气。这里的高锰酸钾是反应物。别把“含锰的物质”都当成催化剂：角色由具体反应决定。',
      limit: '虚拟热分解不提供现实加热步骤。固体颜色和加热速率经过简化；不用于预测真实实验温度、收集效率或危险程度。',
      controls: ['heat'], sources: [source('RSC · 锰及其化合物背景', 'https://periodic-table.rsc.org/element/25/manganese')]
    },
    {
      id: 'carbon-dioxide', title: '会冒泡的小苏打', category: '气体', icon: 'bubble', level: '入门', color: '#e7c583',
      subtitle: '谁先用完，谁决定能产生多少气体。', kidsGoal: '给泡泡工厂配原料，找出谁先用完。',
      gear: ['flask', 'gas-syringe', 'dropper'], reagents: [reagent('vinegar', 'flask', 8), reagent('bicarbonate', 'flask', 6)], links: [['flask.out', 'gas-syringe.in']],
      operations: [operation('check', '检查气体收集通路', '给泡泡检查出口', '集气筒活塞能够移动；本模型不模拟封闭容器增压。'), operation('mix', '让原料接触', '轻轻混合，观察泡泡', '模型此前把原料隔开放置，此时让乙酸与碳酸氢钠接触。')],
      question: '只把小苏打加倍，气体一定加倍吗？', options: ['不一定，还要看乙酸够不够', '一定加倍', '气体一定不变'], correct: 0,
      equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂ ↑', condition: '乙酸与碳酸氢钠接触',
      kidsExplain: '像做饼干，面粉有很多、鸡蛋不够，也做不出更多。反应里先用完的原料，就是这次的“限量队员”。',
      explain: '乙酸和碳酸氢钠按 1 : 1 的物质的量反应，生成乙酸钠、水和二氧化碳。先耗尽的反应物限制产量。泡打粉让烘焙食品变松软，也利用产生气体的原理。',
      limit: '食醋的真实乙酸浓度随产品变化。本实验直接指定乙酸溶质 mmol，不能把它当成同样数值的食醋质量。忽略 CO₂ 在液体中的溶解。',
      sources: [source('ACS · 泡泡与小苏打反应', 'https://www.acs.org/education/whatischemistry/adventures-in-chemistry/experiments/fizz-bang.html')]
    },
    {
      id: 'neutralization', title: '酸碱恰好碰个面', category: '反应', icon: 'drop', level: '进阶', color: '#d2e788',
      subtitle: '中和发生了，不代表溶液一定中性。', kidsGoal: '让酸和碱配对，看看哪一边还剩队员。',
      gear: ['beaker', 'burette', 'stirrer'], reagents: [reagent('hcl', 'beaker', 3, 'mmol', { max: 10 }), reagent('naoh', 'burette', 3, 'mmol', { max: 10 }), reagent('universal', 'beaker', 1, '份')],
      links: [['burette.out', 'beaker.in']], operations: [operation('stir', '开启搅拌', '让杯子里的小伙伴动起来', '把酸和指示剂在模型中混合均匀。'), operation('titrate', '打开滴定阀', '让碱一点一点落下来', '按投料量逐步滴加，观察颜色和最后的过量物质。')],
      question: '酸和碱反应后，一定是 pH 7 吗？', options: ['要看种类和比例', '一定是 pH 7', '一定是 pH 14'], correct: 0,
      equation: 'HCl + NaOH → NaCl + H₂O', condition: '净离子式：H⁺ + OH⁻ → H₂O',
      kidsExplain: '酸队员和碱队员可以一对一配对。只有恰好配完，这个模型里的颜色才会停在中间；还有剩余，就会偏向那一边。',
      explain: '这是强酸与强碱的中和模型。酸或碱过量时，中和仍会发生，但最终溶液不一定呈中性。弱酸强碱等体系在当量点的 pH 也可能不等于 7。',
      limit: 'pH 按 25°C 的理想强酸强碱模型计算：两份溶液各 50 mL、混合总体积固定 100 mL，忽略体积收缩、活度和指示剂体积。不模拟真实滴定曲线的全部细节。',
      sources: [source('RSC · 中和与沉淀微型实验', 'https://edu.rsc.org/experiments/microscale-neutralisation-and-precipitation-reactions/500.article')]
    },
    {
      id: 'indicators', title: '紫甘蓝彩虹杯', category: '反应', icon: 'rainbow', level: '入门', color: '#c7afe3',
      subtitle: '同一种指示剂，遇到不同环境就变色。', kidsGoal: '给三只杯子滴上紫色侦探，找出谁酸、谁碱。',
      gear: ['cup-acid', 'cup-neutral', 'cup-base', 'dropper'],
      reagents: [reagent('vinegar', 'cup-acid', 1, '份'), reagent('water', 'cup-neutral', 1, '份'), reagent('soda-water', 'cup-base', 1, '份'), reagent('cabbage', 'cup-acid', 1, '份'), reagent('cabbage', 'cup-neutral', 1, '份'), reagent('cabbage', 'cup-base', 1, '份')], links: [],
      operations: [operation('label', '确认三杯标签', '给三只杯子认认名字', '分别保留酸性、中性和弱碱性样品，避免混在一起。'), operation('develop', '释放指示剂并比较', '请紫色侦探开始工作', '比较同一指示剂在三种环境中的示意颜色。')],
      question: '颜色告诉了我们什么？', options: ['样品的酸碱性线索', '每种物质的精确含量', '能不能直接喝'], correct: 0,
      equation: '指示剂的分子结构随酸碱环境改变', condition: '示意颜色：酸性偏红 · 近中性偏紫 · 弱碱性偏蓝绿',
      kidsExplain: '紫甘蓝里的花青素像会换衣服的小侦探。遇到酸、碱，它的样子会变，所以我们看到了不同颜色。',
      explain: '紫甘蓝中的花青素可用作天然酸碱指示剂。颜色是酸碱环境的线索，不是特定物质的身份证，也不能据此判断食用安全。真实颜色受提取液、浓度、光照和样品影响。',
      limit: '这里显示的是典型颜色范围，不把食醋或小苏打水设成固定、精确的 pH。指示剂自身涉及平衡变化，未用单一方程式概括所有结构。',
      sources: [source('RSC · 紫甘蓝彩虹', 'https://edu.rsc.org/primary-science/red-cabbage-rainbows/4011608.article')]
    },
    {
      id: 'limewater', title: '气体侦探与白云', category: '气体', icon: 'cloud', level: '进阶', color: '#bcd8d0',
      subtitle: '先变浑浊，继续通气为什么又变清？', kidsGoal: '让气泡拜访石灰水，看看小白云会不会出现。',
      gear: ['gas-canister', 'beaker'], reagents: [reagent('co2', 'gas-canister', 1), reagent('limewater', 'beaker', 2)], links: [['gas-canister.out', 'beaker.gas-in']],
      operations: [operation('check', '检查导气管伸入液体', '让气泡从水里经过', '通气管在模型烧杯中伸到液面下，气体与溶液接触。'), operation('bubble', '通入选定量 CO₂', '打开气泡，让它们来做客', '持续到选定模型气体量全部进入；观察浑浊程度的变化。')],
      question: '二氧化碳足够多时，浑浊可能怎样？', options: ['先出现，随后可能消失', '一定越来越白', '一定变成蓝色'], correct: 0,
      equation: 'Ca(OH)₂ + CO₂ → CaCO₃ ↓ + H₂O', equation2: 'CaCO₃ + CO₂ + H₂O → Ca(HCO₃)₂', condition: '后一个反应描述足量 CO₂ 下沉淀的溶解',
      kidsExplain: '先来的气泡帮忙造出白色小颗粒。气泡再多一些，小颗粒又能变成溶在水里的物质，白云就可能散开。',
      explain: '适量 CO₂ 使石灰水中生成碳酸钙白色沉淀。继续通入足量 CO₂，碳酸钙可形成可溶的碳酸氢钙。本模型按两步计量计算最终沉淀。',
      limit: '用理想两步完全反应说明“先浑后清”。不模拟真实溶解平衡、pH、通气效率与过饱和程度；模型投料不能换算成现实操作配方。',
      sources: [source('RSC · 指示剂与二氧化碳实验', 'https://edu.rsc.org/experiments/indicators-and-dry-ice-demonstration/703.article')]
    },
    {
      id: 'displacement', title: '铁片穿上铜外衣', category: '反应', icon: 'metal', level: '入门', color: '#dbb397',
      subtitle: '从宏观颜色，看见电子转移的结果。', kidsGoal: '看看灰色铁片能不能穿上红棕色的新外衣。',
      gear: ['beaker', 'tongs'], reagents: [reagent('copper-sulfate', 'beaker', 2), reagent('iron', 'tongs', 3)], links: [],
      operations: [operation('immerse', '用镊子浸入铁片', '把模型铁片放进蓝色溶液', '使铁与硫酸铜溶液接触。'), operation('observe', '观察表面与溶液', '仔细看铁片的衣服', '动画加快了表面析铜和溶液颜色变化。')],
      question: '铁片上出现的红棕色物质主要是什么？', options: ['析出的铜', '铁锈', '原来的蓝色溶液'], correct: 0,
      equation: 'Fe + CuSO₄ → FeSO₄ + Cu', condition: 'Fe → Fe²⁺ + 2 e⁻；Cu²⁺ + 2 e⁻ → Cu',
      kidsExplain: '铁把电子交给了铜离子。铜离子变成铜，贴在铁片上，像穿了一件红棕色外衣。',
      explain: '铁比铜更容易失去电子，能把铜离子还原成铜单质。铜离子的蓝色减弱，亚铁离子的溶液呈浅绿色；若硫酸铜仍过量，最终可能是混合颜色。',
      limit: '忽略铁表面氧化膜、反应速率和溶液中亚铁离子的进一步氧化。颜色用于说明趋势，不能当作浓度计。硫酸铜用无水溶质的物质的量表示。',
      sources: [source('RSC · 金属与盐的置换反应', 'https://edu.rsc.org/experiments/displacement-reactions-between-metals-and-their-salts/720.article')]
    },
    {
      id: 'precipitation', title: '两杯清水变白云', category: '反应', icon: 'cloud', level: '入门', color: '#b5d8df',
      subtitle: '溶液中的离子重新组合，出现不溶固体。', kidsGoal: '把两种透明模型溶液相遇，找找白色小颗粒。',
      gear: ['beaker', 'dropper'], reagents: [reagent('calcium-chloride', 'beaker', 2), reagent('sodium-carbonate', 'dropper', 2)], links: [],
      operations: [operation('drip', '滴加碳酸钠溶液', '让小水滴进入烧杯', '使两份模型溶液接触。'), operation('settle', '静置观察沉淀', '等一等，看看杯底', '反应生成的细小固体先使液体浑浊，随后逐渐沉降。')],
      question: '白色浑浊主要来自什么？', options: ['新生成的不溶固体', '新生成的氧气', '所有水都冻成了冰'], correct: 0,
      equation: 'CaCl₂ + Na₂CO₃ → CaCO₃ ↓ + 2 NaCl', condition: '净离子式：Ca²⁺ + CO₃²⁻ → CaCO₃ ↓',
      kidsExplain: '钙离子和碳酸根离子找到了新搭档，组成不容易溶在水里的小颗粒。许多颗粒聚在一起，就像一朵白云。',
      explain: '碳酸钙在水中难溶，生成的细小颗粒使溶液浑浊。钠离子和氯离子仍主要留在溶液中，是这个净离子反应的旁观离子。',
      limit: '按完全沉淀的理论上限计算，忽略溶度积、溶解的少量 CaCO₃ 和离子活度。画出的颗粒明显放大。',
      sources: [source('RSC · 微型中和与沉淀反应', 'https://edu.rsc.org/experiments/microscale-neutralisation-and-precipitation-reactions/500.article')]
    },
    {
      id: 'filtration', title: '给沙水过一道门', category: '分离', icon: 'filter', level: '入门', color: '#ddc596',
      subtitle: '滤纸拦得住沙子，为什么拦不住食盐？', kidsGoal: '帮水穿过小门，把沙子留在上面。',
      gear: ['beaker', 'funnel', 'receiver', 'glassrod'], reagents: [reagent('sand', 'beaker', 5, 'g', { max: 20 }), reagent('water', 'beaker', 100, 'g', { min: 100, max: 300, step: 20 }), reagent('filter-paper', 'funnel', 1, '份', { max: 1 }), reagent('salt', 'beaker', 2, 'g', { optional: true, max: 10 })],
      links: [['funnel.out', 'receiver.in']], operations: [operation('paper', '贴合滤纸', '把滤纸小门放稳', '确认滤纸已安装在漏斗内。'), operation('guide', '用玻璃棒引流', '给水搭一座小滑梯', '模型用玻璃棒引导混合物，减少飞溅。'), operation('pour', '倾倒并过滤', '让沙水慢慢通过小门', '观察滤纸上的残渣与接收杯中的滤液。')],
      question: '如果沙水里还溶有食盐，滤纸能除掉盐吗？', options: ['不能，溶解的盐随水通过', '能，全部留下', '盐会变成氧气'], correct: 0,
      equation: '沙 + 水（+ 溶解的盐） → 残渣 + 滤液', condition: '物理分离，没有产生新物质',
      kidsExplain: '沙粒太大，留在滤纸上。已经溶在水里的盐，能跟着水一起通过。看起来清清的水，也不代表可以直接喝。',
      explain: '过滤主要分离液体与其中不溶的固体。可选加入食盐对照，看到滤液依然含盐。过滤、除去溶解杂质和消毒是不同任务。',
      limit: '假定沙子全部被截留、液体无损失、少量食盐完全溶解。真实过滤会有残留、吸附和细颗粒穿透；该结果不是饮用水安全判断。',
      sources: [source('RSC · 蒸发、过滤与结晶', 'https://edu.rsc.org/cpd/evaporation-filtration-and-crystallisation-teaching-practical-science/3009017.article')]
    },
    {
      id: 'distillation', title: '盐水里的清水旅行', category: '分离', icon: 'distill', level: '挑战', color: '#aed5db',
      subtitle: '汽化 → 冷凝 → 收集，水完成一次小旅行。', kidsGoal: '接好水蒸气的路，再给冷凝管穿上凉外套。',
      gear: ['flask', 'heater', 'condenser', 'receiver', 'cooling-water', 'drain'], reagents: [reagent('water', 'flask', 100, 'g', { min: 100, max: 300, step: 20 }), reagent('salt', 'flask', 5, 'g', { max: 10 })],
      links: [['flask.out', 'condenser.vapor-in'], ['condenser.liquid-out', 'receiver.in'], ['cooling-water.out', 'condenser.cool-low'], ['condenser.cool-high', 'drain.in']],
      operations: [operation('cool', '先开启冷却水', '先让凉水穿过外套', '冷却水低口进、高口出，让冷凝管外套充满水。'), operation('heat', '开启虚拟加热', '让水变成水蒸气', '水蒸气走内管；冷却水走外套，两条路径不混合。'), operation('collect', '收集设定比例的馏出液', '在终点接住小水滴', '达到设定比例即停止模型加热，保留部分液体，不蒸干。')],
      question: '冷却水应该怎样经过冷凝管？', options: ['低口进入，高口流出', '高口进入，低口流出', '直接倒进水蒸气内管'], correct: 0,
      equation: 'H₂O(l) → H₂O(g) → H₂O(l)', condition: '水汽化、冷凝；不挥发的盐留在原瓶',
      kidsExplain: '水先变成看不见的水蒸气，钻过凉凉的管子，又变回小水滴。盐不跟着一起飞，留在原来的瓶子里。',
      explain: '蒸馏利用挥发性差异。此处只有水是易挥发组分：水蒸气经冷凝后在开口接收杯中收集，食盐留在蒸馏残液中。冷凝管内管和冷却水外套必须分清。',
      limit: '按理想无损失分离计算；忽略盐引起的沸点升高、夹带和设备死体积。默认收集一半水，最多 70%，不模拟蒸干。它不能保证任意混合物都能这样提纯。',
      controls: ['heat', 'fraction'], sources: [source('RSC · 简单蒸馏：低口进水、高口出水', 'https://edu.rsc.org/separating-mixtures/simple-distillation-practical-videos-14-16-years/4018538.article')]
    },
    {
      id: 'electrolysis', title: '用电把水分开', category: '模型', icon: 'electric', level: '挑战', color: '#e7d68d',
      subtitle: '两侧都有气泡，为什么体积是 2 : 1？', kidsGoal: '接好正负两根线，比较两边气泡谁更多。',
      gear: ['electrolyzer', 'battery'], reagents: [reagent('water', 'electrolyzer', 20), reagent('sulfate', 'electrolyzer', 1, '份')], links: [['battery.negative', 'electrolyzer.cathode'], ['battery.positive', 'electrolyzer.anode']],
      operations: [operation('electrodes', '核对阴极与阳极', '认清小减号和小加号', '负极连阴极，正极连阳极。采用惰性电极和硫酸钠支持电解质。'), operation('power', '通入设定模型电荷', '给模型通电，数一数气泡', '分别收集两侧气体，不把氢气与氧气混合或点燃。')],
      question: '同温同压下，氢气与氧气的体积比是？', options: ['2 : 1', '1 : 1', '1 : 2'], correct: 0,
      equation: '2 H₂O → 2 H₂ ↑ + O₂ ↑', condition: '通电 · 阴极产 H₂ · 阳极产 O₂',
      kidsExplain: '每个水分子里有两个氢原子、一个氧原子。许多水分子重新组队，氢气和氧气分子数量就是二比一。',
      explain: '阴极发生还原生成氢气，阳极发生氧化生成氧气。理想情况下 n(H₂)=Q/(2F)，n(O₂)=Q/(4F)。硫酸钠帮助溶液导电，净反应是水的分解。',
      limit: '假设惰性电极、100% 电流效率，忽略气体溶解、过电位和副反应。纯水导电很弱；不能把食盐随意替代支持电解质，含氯离子体系可能产生不同产物。两侧气体不混合、不点燃。',
      controls: ['charge'], sources: [source('RSC · 微型霍夫曼电解装置', 'https://edu.rsc.org/experiments/electrolysis-using-a-microscale-hoffman-apparatus/541.article')]
    },
    {
      id: 'phosphorus', title: '封闭盒里的燃烧观察', category: '模型', icon: 'shield', level: '仅虚拟', color: '#e2b592',
      subtitle: '比较有氧与无氧的概念场景，认识燃烧和氧化物。', kidsGoal: '隔着观察窗，看看两种场景有什么不同。',
      gear: ['sealed-chamber', 'screen'], reagents: [reagent('phosphorus-model', 'sealed-chamber', 1, '份', { max: 1 }), reagent('oxygen-model', 'sealed-chamber', 1, '份', { max: 1 })], links: [['sealed-chamber.signal', 'screen.in']],
      operations: [operation('window', '确认只通过观察窗观看', '我们只看屏幕里的模型', '这是工厂封闭的虚拟观察盒，不提供材料获取、用量或点火操作。'), operation('compare', '播放所选概念场景', '播放动画，找找变化', '观察有氧与无氧场景的差异；可切换场景后重新播放。')],
      question: '比较这两种场景，可以认识什么？', options: ['氧气参与燃烧，生成新的氧化物', '白磷适合徒手玩耍', '任何发光都是放射性'], correct: 0,
      equation: 'P₄ + 5 O₂ → P₄O₁₀', condition: '氧气充足的概念场景；不提供现实操作条件',
      kidsExplain: '有氧场景里，磷和氧组成了新物质，会放出光和热。白色的烟雾里有很小的固体颗粒，它不是“氧气的颜色”。',
      explain: '白磷由 P₄ 分子构成。在氧气充足的概念场景中生成磷(V)氧化物 P₄O₁₀。P₂O₅ 是它的最简式。燃烧是化学变化，与放射性核衰变不同。',
      limit: '白磷有毒且易燃：仅观看封闭虚拟模型，不提供现实实验步骤、温度、剂量或材料获取方法。无氧场景仅用于概念比较；动画不预测真实起燃过程。',
      controls: ['oxygen'], virtualOnly: true, sources: [source('RSC · 磷的结构与性质', 'https://periodic-table.rsc.org/element/15/phosphorus/')]
    }
  ];
  const byId = Object.fromEntries(experiments.map(e => [e.id, e]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const keyLink = (a, b) => [a, b].sort().join('|');
  const expFor = state => byId[state.experimentId];
  const allPorts = gear => (apparatus[gear] ? apparatus[gear].ports.map(p => Object.assign({ gear, fullId: gear + '.' + p.id }, p)) : []);
  const findPort = fullId => { const i = String(fullId).indexOf('.'); return i < 0 ? null : allPorts(fullId.slice(0, i)).find(p => p.id === fullId.slice(i + 1)); };
  const amountOf = (state, id, target) => target ? ((state.contents[target] || {})[id] || 0) : Object.keys(state.contents).reduce((a, k) => a + (state.contents[k][id] || 0), 0);
  const requirement = (e, id, target) => e.reagents.find(r => r.id === id && r.target === target);
  const fmt = (value, digits = 3) => Number.isFinite(value) ? Number(value.toFixed(digits)).toLocaleString('zh-CN', { maximumFractionDigits: digits }) : '—';
  function createState(id = experiments[0].id) {
    if (!byId[id]) throw new RangeError('未知实验：' + id);
    return { experimentId: id, gear: {}, contents: {}, connections: [], selectedGear: null, selectedPort: null, prediction: null, performed: [], phase: 'setup', elapsed: 0, progress: 0, paused: false, controls: { heat: 1, fraction: 50, charge: 386, oxygen: 'present', speed: 1 }, feedback: { type: 'info', text: byId[id].kidsGoal }, history: [] };
  }
  function validateSetup(state) {
    const e = expFor(state);
    if (!e) return { ok: false, errors: ['未知实验'], missingGear: [], missingConnections: [], missingMaterials: [] };
    const missingGear = e.gear.filter(id => !state.gear[id]);
    const missingConnections = e.links.filter(([a, b]) => !state.connections.some(c => c.key === keyLink(a, b)));
    const missingMaterials = e.reagents.filter(r => !r.optional && amountOf(state, r.id, r.target) < r.min);
    const errors = missingGear.map(id => '请放置' + apparatus[id].name)
      .concat(missingConnections.map(([a, b]) => '请连接' + portLabel(a) + ' → ' + portLabel(b)))
      .concat(missingMaterials.map(r => '请向' + apparatus[r.target].name + '加入' + materials[r.id].name));
    Object.entries(state.contents).forEach(([target, entries]) => Object.entries(entries).forEach(([id, n]) => {
      const r = requirement(e, id, target);
      if (!r) errors.push('当前模型未支持这个混合组合，不能据此判断现实是否反应。');
      else if (!Number.isFinite(n) || n < r.min || n > r.max) errors.push(materials[id].name + '的模型用量超出范围。');
    }));
    return { ok: !errors.length, missingGear, missingConnections, missingMaterials, errors };
  }
  function portLabel(id) { const p = findPort(id); return p ? apparatus[p.gear].name + ' · ' + p.name : String(id); }
  function getGuide(state) {
    const e = expFor(state), v = validateSetup(state);
    if (state.phase === 'running') return { stage: 'observe', text: state.paused ? '动画暂停了。点“继续观察”就能接着看。' : '实验进行中，仔细看看颜色、气泡和颗粒的变化。' };
    if (state.phase === 'done') return { stage: 'done', text: '观察完成！读一读发现，再改一个条件做对比。' };
    if (v.missingGear.length) return { stage: 'gear', id: v.missingGear[0], text: '先从器材架拿出“' + apparatus[v.missingGear[0]].name + '”，放到台面上。' };
    if (v.missingConnections.length) { const link = v.missingConnections[0]; return { stage: 'connect', link, text: '把“' + portLabel(link[0]) + '”连接到“' + portLabel(link[1]) + '”。' }; }
    if (v.missingMaterials.length) { const r = v.missingMaterials[0]; return { stage: 'material', id: r.id, target: r.target, text: '向“' + apparatus[r.target].name + '”加入“' + materials[r.id].name + '”。' }; }
    if (state.prediction === null) return { stage: 'predict', text: '准备好了！先选一个猜想，答错也没关系，观察会告诉我们。' };
    const op = e.operations[state.performed.length];
    return { stage: 'operate', id: op && op.id, text: op ? '接下来：' + op.kids + '。' : '准备观察。' };
  }
  function feedback(state, text, type = 'error') { return Object.assign({}, state, { feedback: { type, text } }); }
  function changed(state, updates, message) {
    const snapshot = Object.assign({}, state); delete snapshot.history;
    return Object.assign({}, state, updates, { performed: [], phase: 'setup', elapsed: 0, progress: 0, paused: false, feedback: { type: 'success', text: message }, history: state.history.concat([snapshot]).slice(-50) });
  }
  function duration(state) {
    const base = state.experimentId === 'distillation' ? 9000 : state.experimentId === 'phosphorus' ? 6000 : 7200;
    const factor = state.experimentId === 'oxygen-peroxide' ? 1 + 0.38 * Math.max(0, amountOf(state, 'catalyst') - 1) : expFor(state).controls && expFor(state).controls.includes('heat') ? 1 + (state.controls.heat - 1) * 0.3 : 1;
    return base / factor;
  }
  function reduce(state, action) {
    if (!state || !expFor(state) || !action || typeof action.type !== 'string') throw new TypeError('需要有效的实验状态和动作。');
    const e = expFor(state), type = action.type;
    if (type === 'RESET') return createState(action.experimentId || state.experimentId);
    if (type === 'RESTART') return Object.assign({}, state, { phase: 'setup', performed: [], elapsed: 0, progress: 0, paused: false, prediction: null, history: [], feedback: { type: 'info', text: '保留装置与投料，重新选择猜想，再开始观察。' } });
    if (type === 'UNDO') {
      if (!state.history.length) return feedback(state, '还没有可以撤回的操作。', 'info');
      if (state.phase === 'running') return feedback(state, '先暂停并重开实验，再修改装置。');
      const previous = clone(state.history[state.history.length - 1]);
      return Object.assign(previous, { phase: 'setup', elapsed: 0, progress: 0, paused: false, performed: [], history: state.history.slice(0, -1), feedback: { type: 'info', text: '已撤回上一步，可以重新选择。' } });
    }
    if (type === 'SELECT_GEAR') return action.id && !state.gear[action.id] ? feedback(state, '请先把这件器材放上台面。') : Object.assign({}, state, { selectedGear: action.id || null, selectedPort: null });
    if (type === 'SELECT_PORT') {
      const p = findPort(action.id);
      if (!p || !state.gear[p.gear]) return feedback(state, '先把接口所在的器材放上台面。');
      if (state.selectedPort === action.id) return Object.assign({}, state, { selectedPort: null });
      if (state.selectedPort) return reduce(Object.assign({}, state, { selectedPort: null }), { type: 'CONNECT', a: state.selectedPort, b: action.id });
      return Object.assign({}, state, { selectedPort: action.id, feedback: { type: 'info', text: '已选中' + portLabel(action.id) + '。再点另一端；再次点击当前接口可取消。' } });
    }
    if (type === 'PREDICT') {
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= e.options.length) return feedback(state, '请选择一个有效的猜想。');
      if (state.phase !== 'setup') return feedback(state, '这次预测已记录。重新实验时可以修改。');
      return Object.assign({}, state, { prediction: action.index, feedback: { type: 'info', text: '猜想已记录。用观察检验它，答错也是发现的开始。' } });
    }
    if (type === 'SET_CONTROL' && action.name === 'speed') {
      if (![1, 2, 4].includes(Number(action.value))) return feedback(state, '播放速度只能是 1、2 或 4 倍。');
      return Object.assign({}, state, { controls: Object.assign({}, state.controls, { speed: Number(action.value) }) });
    }
    if (type === 'PAUSE') return state.phase === 'running' ? Object.assign({}, state, { paused: !state.paused }) : state;
    if (type === 'TICK') {
      if (state.phase !== 'running' || state.paused) return state;
      const dt = Number(action.ms);
      if (!Number.isFinite(dt) || dt < 0) return feedback(state, '播放时间必须是非负有限数。');
      const elapsed = Math.min(duration(state), state.elapsed + dt * state.controls.speed), progress = clamp(elapsed / duration(state), 0, 1);
      return Object.assign({}, state, { elapsed, progress, phase: progress >= 1 ? 'done' : 'running', feedback: progress >= 1 ? { type: 'success', text: '观察完成。看看结果和你的猜想是否一致。' } : state.feedback });
    }
    if (state.phase !== 'setup' && !['MOVE_GEAR'].includes(type)) return feedback(state, '本次实验已开始。点“保留装置重做”后再修改投料或连接。');
    if (type === 'PLACE_GEAR') {
      if (!apparatus[action.id]) return feedback(state, '器材库中没有这件器材。');
      if (state.gear[action.id]) return Object.assign({}, state, { selectedGear: action.id, feedback: { type: 'info', text: '这件器材已经在台面上，已为你选中。' } });
      const position = defaultPosition(state.experimentId, action.id);
      return changed(state, { gear: Object.assign({}, state.gear, { [action.id]: { x: position[0], y: position[1] } }), selectedGear: action.id, selectedPort: null }, apparatus[action.id].name + '已放上台面。可以拖动，也可以用方向按钮移动。');
    }
    if (type === 'MOVE_GEAR') {
      if (!state.gear[action.id] || !Number.isFinite(Number(action.x)) || !Number.isFinite(Number(action.y))) return feedback(state, '移动位置无效。');
      const gear = Object.assign({}, state.gear, { [action.id]: { x: clamp(Number(action.x), 108, 750), y: clamp(Number(action.y), 85, 355) } });
      return Object.assign({}, state, { gear, selectedGear: action.id });
    }
    if (type === 'REMOVE_GEAR') {
      if (!state.gear[action.id]) return feedback(state, '这件器材不在台面上。');
      const gear = Object.assign({}, state.gear), contents = clone(state.contents); delete gear[action.id]; delete contents[action.id];
      return changed(state, { gear, contents, selectedGear: null, selectedPort: null, connections: state.connections.filter(c => !c.a.startsWith(action.id + '.') && !c.b.startsWith(action.id + '.')) }, '已收回' + apparatus[action.id].name + '，并清除其中材料及相关连接。');
    }
    if (type === 'CONNECT') {
      const a = findPort(action.a), b = findPort(action.b);
      if (!a || !b || !state.gear[a.gear] || !state.gear[b.gear]) return feedback(state, '请先放置两端器材，再选择它们的接口。');
      if (a.fullId === b.fullId || a.gear === b.gear) return feedback(state, '请连接不同器材的两个接口。');
      const key = keyLink(action.a, action.b), expected = e.links.find(l => keyLink(l[0], l[1]) === key);
      if (state.connections.some(c => c.key === key)) return feedback(state, '这条连接已经接好了。', 'info');
      if (!expected) {
        if (state.experimentId === 'distillation' && (a.kind === 'cooling' || b.kind === 'cooling')) return feedback(state, '冷却水走外套：供水接“冷却水低口（进）”，高口接回水。不要接反，也不要接入蒸气内管。');
        if (state.experimentId === 'electrolysis') return feedback(state, '正负极接反或接口不对：电源负极连阴极（−），正极连阳极（＋）。请重新选两端。');
        return feedback(state, '这不是本实验的连接路线。' + (e.links.length ? '请查看“连接向导”，按接口名称连接。' : '这项实验无需导管连接，请直接配置材料。'));
      }
      if (state.connections.some(c => [c.a, c.b].includes(a.fullId) || [c.a, c.b].includes(b.fullId))) return feedback(state, '接口已有连接。先在连线清单中断开，再重新连接。');
      const connection = { a: expected[0], b: expected[1], key, kind: findPort(expected[0]).kind };
      return changed(state, { connections: state.connections.concat([connection]), selectedPort: null }, '已接好：' + portLabel(expected[0]) + ' → ' + portLabel(expected[1]) + '。');
    }
    if (type === 'DISCONNECT') {
      if (!state.connections.some(c => c.key === action.key)) return feedback(state, '没有找到这条连接。');
      return changed(state, { connections: state.connections.filter(c => c.key !== action.key), selectedPort: null }, '连接已断开，可以重新接线。');
    }
    if (type === 'ADD_MATERIAL') {
      const r = requirement(e, action.id, action.target), amount = Number(action.amount);
      if (!materials[action.id]) return feedback(state, '当前模型未收录这种材料，不能判断它与其他物质是否反应。');
      if (!state.gear[action.target]) return feedback(state, '先放置目标器材，再加入材料。');
      if (!r) return feedback(state, '当前模型尚未支持把“' + materials[action.id].name + '”加入“' + apparatus[action.target].name + '”的组合，不能据此判断现实是否反应。请按任务材料卡选择容器。');
      if (!Number.isFinite(amount) || amount <= 0 || (r.unit === '份' && !Number.isInteger(amount))) return feedback(state, '请输入有效的正数模型用量；“份”需要整数。');
      const total = amountOf(state, r.id, r.target) + amount;
      if (total < r.min - 1e-9 || total > r.max + 1e-9) return feedback(state, '该材料在此容器中的总用量须在 ' + r.min + '～' + r.max + ' ' + r.unit + ' 内。可先移除材料，再重新添加。');
      // The acceptance tolerance handles floating-point addition at an endpoint.
      // Normalize back to that endpoint so a successful add remains valid.
      const contents = clone(state.contents); contents[r.target] = Object.assign({}, contents[r.target], { [r.id]: clamp(Number(total.toFixed(9)), r.min, r.max) });
      return changed(state, { contents, selectedGear: r.target }, materials[r.id].name + '已加入' + apparatus[r.target].name + '。原料在准备阶段由模型隔开，操作时才接触。');
    }
    if (type === 'REMOVE_MATERIAL') {
      if (!amountOf(state, action.id, action.target)) return feedback(state, '这个容器中没有这份材料。');
      const contents = clone(state.contents); delete contents[action.target][action.id];
      if (!Object.keys(contents[action.target]).length) delete contents[action.target];
      return changed(state, { contents }, '已移除这份模型材料，可以换一个用量再加入。');
    }
    if (type === 'SET_CONTROL') {
      if (!(e.controls || []).includes(action.name)) return feedback(state, '本实验没有这个控制项。');
      let value = action.value;
      if (action.name === 'oxygen') { if (!['present', 'absent'].includes(value)) return feedback(state, '请选择有氧或无氧模型场景。'); }
      else {
        value = Number(value); const bounds = { heat: [1, 3], fraction: [10, 70], charge: [40, 1200] }[action.name];
        if (!bounds || !Number.isFinite(value) || value < bounds[0] || value > bounds[1] || (action.name === 'heat' && !Number.isInteger(value))) return feedback(state, '该模型参数超出允许范围。');
      }
      return changed(state, { controls: Object.assign({}, state.controls, { [action.name]: value }) }, '模型条件已更新。重新执行操作，就能比较变化。');
    }
    if (type === 'OPERATE') {
      const validation = validateSetup(state);
      if (!validation.ok) return feedback(state, validation.errors[0] + '，再进行操作。');
      if (state.prediction === null) return feedback(state, '请先选一个猜想，再开始操作。科学探索从预测开始。');
      const expected = e.operations[state.performed.length];
      if (!expected || action.id !== expected.id) return feedback(state, expected ? '顺序还不对。请先“' + expected.label + '”，再进行后面的操作。' : '本次操作已经全部完成。');
      const performed = state.performed.concat([action.id]), last = performed.length === e.operations.length;
      return Object.assign({}, state, { performed, phase: last ? 'running' : 'setup', elapsed: 0, progress: 0, paused: false, feedback: { type: 'success', text: expected.detail + (last ? ' 实验开始，留意台面变化。' : '') } });
    }
    return feedback(state, '当前模型不支持这个操作。');
  }
  function defaultPosition(id, gear) {
    const custom = {
      'oxygen-permanganate': { stand: [118, 250], testtube: [206, 205], heater: [205, 341] },
      'neutralization': { beaker: [365, 275], burette: [365, 110], stirrer: [365, 355] },
      limewater: { beaker: [560, 265] },
      filtration: { beaker: [200, 260], funnel: [560, 150], receiver: [565, 306], glassrod: [360, 135] },
      distillation: { flask: [160, 260], heater: [160, 350], receiver: [720, 315], condenser: [430, 198], 'cooling-water': [445, 351], drain: [640, 84] },
      precipitation: { beaker: [320, 277], dropper: [390, 120] }
    };
    return (custom[id] && custom[id][gear]) || apparatus[gear].pos;
  }
  function reagentMoles(state, id) {
    const e = expFor(state), reqs = e.reagents.filter(r => r.id === id);
    return reqs.reduce((n, r) => { const amount = amountOf(state, id, r.target); return n + (r.unit === 'mmol' ? amount / 1000 : r.unit === 'g' && materials[id].formula ? amount / species[materials[id].formula].molarMass : 0); }, 0);
  }
  function entry(formula, moles) { const s = species[formula]; return { formula, name: s.name, moles, grams: moles * s.molarMass, gasVolumeMl: s.gas ? moles * GAS_ML_PER_MOL : null }; }
  function solveStoichiometry(state, reactants, products) {
    const sourceAmounts = reactants.map(r => reagentMoles(state, r[0])), extent = Math.max(0, Math.min(...reactants.map((r, i) => sourceAmounts[i] / r[2])));
    const ins = reactants.map((r, i) => { const consumed = extent * r[2], remaining = Math.max(0, sourceAmounts[i] - consumed); return Object.assign(entry(r[1], sourceAmounts[i]), { material: r[0], consumedMoles: consumed, consumedGrams: consumed * species[r[1]].molarMass, remainingMoles: remaining, remainingGrams: remaining * species[r[1]].molarMass }); });
    const outs = products.map(p => entry(p[0], extent * p[1]));
    const inputMass = ins.reduce((s, r) => s + r.grams, 0), productMass = outs.reduce((s, r) => s + r.grams, 0), leftoverMass = ins.reduce((s, r) => s + r.remainingGrams, 0);
    return { kind: 'reaction', reactants: ins, products: outs, limiting: ins.filter(r => r.remainingMoles < 1e-10).map(r => r.name), mass: { input: inputMass, products: productMass, leftover: leftoverMass, error: inputMass - productMass - leftoverMass } };
  }
  function calculateResult(state) {
    const e = expFor(state), id = state.experimentId;
    if (!e) throw new RangeError('未知实验。');
    let r;
    if (id === 'oxygen-peroxide') { r = solveStoichiometry(state, [['peroxide', 'H2O2', 2]], [['H2O', 2], ['O2', 1]]); r.summary = '氧气进入集气筒，活塞向外移动。催化剂改变快慢，理论产量由过氧化氢决定。'; }
    if (id === 'oxygen-permanganate') { r = solveStoichiometry(state, [['permanganate', 'KMnO4', 2]], [['K2MnO4', 1], ['MnO2', 1], ['O2', 1]]); r.summary = '原来的高锰酸钾被消耗，留下新固体，并收集到氧气。'; }
    if (id === 'carbon-dioxide') { r = solveStoichiometry(state, [['vinegar', 'CH3COOH', 1], ['bicarbonate', 'NaHCO3', 1]], [['CH3COONa', 1], ['H2O', 1], ['CO2', 1]]); r.summary = '产生二氧化碳气泡；' + r.limiting.join('、') + '先用完，决定了本次理论产量。'; }
    if (id === 'neutralization') {
      r = solveStoichiometry(state, [['hcl', 'HCl', 1], ['naoh', 'NaOH', 1]], [['NaCl', 1], ['H2O', 1]]);
      const excess = reagentMoles(state, 'hcl') - reagentMoles(state, 'naoh'), conc = Math.abs(excess) / 0.1;
      r.pH = Math.abs(excess) < 1e-12 ? 7 : excess > 0 ? -Math.log10((conc + Math.sqrt(conc * conc + 4e-14)) / 2) : 14 + Math.log10((conc + Math.sqrt(conc * conc + 4e-14)) / 2);
      r.acidity = Math.abs(excess) < 1e-12 ? '近中性' : excess > 0 ? '酸性' : '碱性';
      r.color = r.pH < 3 ? '#db766d' : r.pH < 6 ? '#e5c87c' : r.pH <= 8 ? '#94cba6' : r.pH < 11 ? '#72b8c5' : '#9187c5';
      r.summary = '最终呈' + r.acidity + '，理想模型 pH ≈ ' + fmt(r.pH, 2) + '。' + (Math.abs(excess) < 1e-12 ? '强酸与强碱恰好按 1 : 1 配对。' : excess > 0 ? '中和发生了，但酸仍有剩余。' : '中和发生了，但碱仍有剩余。');
    }
    if (id === 'indicators') r = { kind: 'qualitative', colors: ['#d982a8', '#a383bc', '#78b8b0'], summary: '酸性样品偏红，中性样品偏紫，弱碱性样品偏蓝绿。同一种指示剂给出不同线索。', cards: [{ label: '酸性样品', value: '红 / 粉红' }, { label: '中性样品', value: '紫色' }, { label: '弱碱性样品', value: '蓝 / 蓝绿' }] };
    if (id === 'limewater') {
      const calcium = reagentMoles(state, 'limewater'), carbon = reagentMoles(state, 'co2'), first = Math.min(calcium, carbon), second = Math.min(first, Math.max(0, carbon - calcium));
      const products = [entry('CaCO3', first - second), entry('Ca(HCO3)2', second), entry('H2O', first - second)];
      const reactants = [Object.assign(entry('Ca(OH)2', calcium), { remainingMoles: Math.max(0, calcium - first), remainingGrams: Math.max(0, calcium - first) * species['Ca(OH)2'].molarMass }), Object.assign(entry('CO2', carbon), { remainingMoles: Math.max(0, carbon - first - second), remainingGrams: Math.max(0, carbon - first - second) * species.CO2.molarMass })];
      const input = reactants.reduce((v, x) => v + x.grams, 0), product = products.reduce((v, x) => v + x.grams, 0), leftover = reactants.reduce((v, x) => v + x.remainingGrams, 0);
      r = { kind: 'reaction', products, reactants, limiting: [], precipitateMoles: first - second, dissolvedMoles: second, mass: { input, products: product, leftover, error: input - product - leftover }, summary: first - second > 1e-10 ? '出现碳酸钙白色沉淀，最后仍有浑浊。' + (second > 0 ? '部分沉淀已经在更多 CO₂ 的作用下溶解。' : '') : first > 0 ? '先出现浑浊，再随足量 CO₂ 进入而变清：沉淀转化为溶液中的碳酸氢钙。' : '模型还没有足够的反应物。' };
    }
    if (id === 'displacement') { r = solveStoichiometry(state, [['iron', 'Fe', 1], ['copper-sulfate', 'CuSO4', 1]], [['FeSO4', 1], ['Cu', 1]]); const cu = r.reactants.find(x => x.formula === 'CuSO4'); r.copperRemainingFraction = cu.moles ? cu.remainingMoles / cu.moles : 0; r.summary = '铁片上析出红棕色铜，蓝色减弱。' + (r.copperRemainingFraction > 1e-8 ? '仍有铜离子，溶液保留部分蓝色。' : '铜离子在理想模型中用完，溶液以亚铁离子的浅绿色为主。'); }
    if (id === 'precipitation') { r = solveStoichiometry(state, [['calcium-chloride', 'CaCl2', 1], ['sodium-carbonate', 'Na2CO3', 1]], [['CaCO3', 1], ['NaCl', 2]]); r.summary = '生成白色碳酸钙沉淀，静置后聚集到杯底。钠离子与氯离子仍留在水中。'; }
    if (id === 'filtration') {
      const sand = amountOf(state, 'sand'), water = amountOf(state, 'water'), salt = amountOf(state, 'salt'), total = sand + water + salt;
      r = { kind: 'separation', summary: '沙子留在滤纸上，水进入接收杯。' + (salt > 0 ? '你加入了食盐：盐随水进入滤液，并没有被滤纸除掉。' : '可选加入食盐后重做，比较溶解物能否被截留。'), cards: [{ label: '滤纸残渣 · 沙', value: fmt(sand) + ' g' }, { label: '滤液 · 水', value: fmt(water) + ' g' }, { label: '滤液 · 溶解的盐', value: fmt(salt) + ' g' }], mass: { input: total, products: total, leftover: 0, error: 0 }, sand, water, salt };
    }
    if (id === 'distillation') {
      const water = amountOf(state, 'water'), salt = amountOf(state, 'salt'), recovered = water * state.controls.fraction / 100, leftWater = water - recovered, total = water + salt;
      r = { kind: 'separation', summary: '接收杯得到 ' + fmt(recovered) + ' g 模型馏出水；食盐留在原瓶的残液中。收集到设定比例后停止，没有蒸干。', cards: [{ label: '收集的水', value: fmt(recovered) + ' g' }, { label: '原瓶剩余的水', value: fmt(leftWater) + ' g' }, { label: '原瓶里的盐', value: fmt(salt) + ' g' }], mass: { input: total, products: recovered, leftover: leftWater + salt, error: total - recovered - leftWater - salt }, recovered, leftWater, salt };
    }
    if (id === 'electrolysis') {
      const inputWater = reagentMoles(state, 'water'), extent = Math.min(inputWater / 2, state.controls.charge / (4 * FARADAY)), usedWater = extent * 2, remaining = Math.max(0, inputWater - usedWater);
      const products = [entry('H2', extent * 2), entry('O2', extent)], input = inputWater * species.H2O.molarMass, product = products.reduce((v, x) => v + x.grams, 0), leftover = remaining * species.H2O.molarMass;
      r = { kind: 'reaction', products, reactants: [Object.assign(entry('H2O', inputWater), { consumedMoles: usedWater, consumedGrams: usedWater * species.H2O.molarMass, remainingMoles: remaining, remainingGrams: leftover })], limiting: inputWater / 2 <= state.controls.charge / (4 * FARADAY) ? ['水'] : ['设定电荷'], mass: { input, products: product, leftover, error: input - product - leftover }, ratio: '2 : 1', usedCharge: extent * 4 * FARADAY, summary: '阴极（−）产生氢气，阳极（＋）产生氧气。相同温压下，气体体积比为 2 : 1。' + (remaining <= 1e-10 ? '模型用水先耗尽，实际通过的反应电荷低于或等于设定值。' : '电荷用完后仍有水剩余，并非所有水都自动分解。') };
    }
    if (id === 'phosphorus') r = { kind: 'qualitative', burning: state.controls.oxygen === 'present', summary: state.controls.oxygen === 'present' ? '有氧概念场景：出现光、热和白色微粒，磷与氧组成新的氧化物。' : '无氧概念场景：没有出现同样的可见燃烧。切回有氧场景可以比较。', cards: [{ label: '观察场景', value: state.controls.oxygen === 'present' ? '氧气充足（概念）' : '无氧（概念）' }, { label: '变化层级', value: '化学变化，不是核衰变' }] };
    return Object.assign({ experimentId: id, gasConditions: '25°C · 101.325 kPa · 理想干燥气体', model: e.limit }, r);
  }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function formulaHTML(value) { return esc(value).replace(/(\d+)/g, '<sub>$1</sub>'); }
  function symbol(kind, size = 22) {
    const paths = {
      bubble: '<circle cx="8" cy="16" r="4"/><circle cx="17" cy="7" r="3"/><circle cx="18" cy="18" r="2"/>',
      heat: '<path d="M12 3c2 5 7 6 7 12a7 7 0 0 1-14 0c0-3 2-6 4-8 0 4 1 5 3 6 2-3 1-6 0-10Z"/>',
      drop: '<path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/>',
      rainbow: '<path d="M3 19v-5a9 9 0 0 1 18 0v5M7 19v-5a5 5 0 0 1 10 0v5M11 19v-5a1 1 0 0 1 2 0v5"/>',
      cloud: '<path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11-1 5 5 0 0 1 0 11Z"/><path d="M8 21h8"/>',
      metal: '<path d="m8 3 10 3-4 15-10-3Z"/><path d="m8 3 2 6 8-3M10 9 6 20"/>',
      filter: '<path d="M3 4h18l-7 9v7l-4-2v-5Z"/><path d="M6 8h12"/>',
      distill: '<path d="M5 3h6M7 3v7l-4 8a2 2 0 0 0 2 3h9a2 2 0 0 0 2-3l-5-8V3M12 8l9 4v6M4 17h10"/>',
      electric: '<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
      shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
      flask: '<path d="M8 3h8M10 3v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3M7 16h10"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      link: '<path d="m9 15 6-6M8 13l-2 2a3 3 0 0 0 4 4l3-3M11 8l3-3a3 3 0 0 1 4 4l-2 2"/>',
      book: '<path d="M3 4h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v16h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3ZM12 6v16"/>',
      reset: '<path d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/>',
      arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
      spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>'
    };
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[kind] || paths.flask) + '</svg>';
  }
  function bottleIcon(id) {
    const m = materials[id], card = m.kind === 'card';
    return '<svg viewBox="0 0 40 48" width="30" height="36" aria-hidden="true"><path d="' + (card ? 'M7 8h26v33H7Z' : 'M14 4h12v9l7 6v22H7V19l7-6Z') + '" fill="#fff" stroke="#788f84" stroke-width="1.5"/><path d="M9 25h22v14H9Z" fill="' + m.color + '"/><rect x="11" y="23" width="18" height="10" rx="2" fill="#fff" opacity=".8"/>' + (card ? '<circle cx="20" cy="28" r="4" fill="' + m.color + '"/>' : '<path d="M13 5h14" stroke="#547567" stroke-width="4" stroke-linecap="round"/>') + '</svg>';
  }
  function mixColor(a, b, t) {
    const read = s => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    const aa = read(a), bb = read(b); return '#' + aa.map((v, i) => Math.round(v + (bb[i] - v) * clamp(t, 0, 1)).toString(16).padStart(2, '0')).join('');
  }
  function liquidColor(id, state) {
    const p = state.progress, contents = state.contents[id] || {}, e = state.experimentId, result = calculateResult(state);
    let color = Object.keys(contents).find(k => ['liquid', 'drop'].includes(materials[k].kind));
    color = color ? materials[color].color : '#b6dce0';
    if (['cup-acid', 'cup-neutral', 'cup-base'].includes(id)) {
      const index = ['cup-acid', 'cup-neutral', 'cup-base'].indexOf(id);
      return amountOf(state, 'cabbage', id) ? mixColor('#b092c5', ['#d982a8', '#a383bc', '#78b8b0'][index], p) : color;
    }
    if (id === 'beaker' && e === 'neutralization') return mixColor('#e59784', result.color || '#94cba6', p);
    if (id === 'beaker' && e === 'displacement') return mixColor('#61b4d7', mixColor('#a1c5a2', '#61b4d7', result.copperRemainingFraction || 0), p);
    if (e === 'filtration' && id === 'beaker' && amountOf(state, 'sand')) return '#c1ad8b';
    if (id === 'beaker' && e === 'precipitation') return mixColor('#c6dfdf', '#eef0dc', p);
    if (id === 'beaker' && e === 'limewater') {
      const a = reagentMoles(state, 'limewater'), b = reagentMoles(state, 'co2') * p, first = Math.min(a, b), second = Math.min(first, Math.max(0, b - a));
      return mixColor('#cce3df', '#f5f5e6', a > 0 ? (first - second) / a : 0);
    }
    return color;
  }
  function circles(state, count = 7, color = '#ffffff', mode = 'bubble') {
    const time = state.elapsed / 1000;
    if (state.phase !== 'running' && !(mode === 'settle' && state.phase === 'done')) return '';
    return Array.from({ length: count }, (_, i) => {
      const x = Math.sin(i * 2.39) * 32, phase = (time * 0.38 + i * 0.137) % 1, y = mode === 'settle' ? (state.phase === 'done' ? 47 + (i % 3) * 4 : -14 + phase * 70) : 50 - phase * 78;
      return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (mode === 'settle' ? 3 : 2 + i % 3) + '" fill="' + color + '" fill-opacity="' + (mode === 'settle' ? '.86' : '.4') + '" stroke="' + (mode === 'settle' ? color : '#fff') + '" stroke-width="1.2"/>';
    }).join('');
  }
  function gearArt(id, state) {
    const kind = apparatus[id].kind, p = state.progress, e = state.experimentId, contents = state.contents[id] || {}, has = Object.keys(contents).length > 0;
    const color = liquidColor(id, state), stroke = '#537f79', glass = 'fill="url(#lab-glass)" stroke="' + stroke + '" stroke-width="2.5"', result = calculateResult(state);
    const ongoing = state.phase === 'running', progress = p > 0;
    if (kind === 'flask') {
      const draining = e === 'distillation' ? 1 - p * state.controls.fraction / 100 : 1, top = 3 + (1 - draining) * 57;
      return '<path d="M-18-71h36v49l46 83q4 10-8 10H-56q-12 0-8-10l46-83Z" ' + glass + '/>' + (has ? '<path d="M' + (-34 - top * .47) + ' ' + top + 'H' + (34 + top * .47) + 'L57 60q3 5-5 5H-52q-8 0-5-5Z" fill="' + color + '" opacity=".83"/><path d="M-21 49h42" stroke="#829a88" stroke-width="2" opacity=".45"/>' : '') +
        (has && amountOf(state, 'catalyst', id) ? '<ellipse cx="0" cy="59" rx="22" ry="5" fill="#535551"/>' : '') + (ongoing && e !== 'distillation' ? circles(state) : '') + '<path d="M-9-62v39l-24 42" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/><path d="M-20-72h40" stroke="#54756e" stroke-width="6" stroke-linecap="round"/>';
    }
    if (kind === 'beaker') {
      let amount = has ? 1 : 0;
      if (id === 'receiver' && ['filtration', 'distillation'].includes(e)) amount = p;
      if (id === 'beaker' && e === 'filtration') amount *= 1 - .84 * p;
      const top = 55 - amount * 81;
      let inner = amount > 0 ? '<path d="M-50 ' + top + 'H50V53q0 12-12 12H-38q-12 0-12-12Z" fill="' + (id === 'receiver' ? '#9ed5e2' : color) + '" opacity=".87"/>' : '';
      if (id === 'beaker' && e === 'displacement' && state.performed.includes('immerse')) inner += '<path d="m-12-23 19 1-5 77-19-1Z" fill="' + mixColor('#81918f', '#b77348', p) + '" stroke="#737a70" stroke-width="1.5"/><path d="m-16-25 28 2" stroke="#727f76" stroke-width="5"/>';
      if (id === 'beaker' && e === 'precipitation') inner += circles(state, 14, '#fffef3', 'settle');
      if (id === 'beaker' && e === 'limewater') inner += '<path d="M43-43V37" stroke="#7bada8" stroke-width="6"/>' + circles(state, 6);
      if (id === 'beaker' && e === 'filtration' && has) inner += '<path d="M-46 53q15-10 32 0t30 0t30 0v8h-92Z" fill="#a38c66" opacity="' + (1 - p * .9) + '"/>';
      if (id === 'receiver' && ongoing && ['filtration', 'distillation'].includes(e)) inner += '<path d="M0-66v22" stroke="#7dbdca" stroke-width="3" stroke-dasharray="4 8" stroke-dashoffset="' + (-state.elapsed / 80) + '"/>';
      return '<path d="M-57-62h12v-6H55V55q0 15-15 15H-40q-15 0-15-15v-106" ' + glass + '/>' + inner + '<path d="M-44-45V43" stroke="#fff" stroke-width="5" opacity=".7"/>' + [0, 1, 2].map(i => '<path d="M29 ' + (-25 + i * 23) + 'h16" stroke="' + stroke + '" stroke-width="1.5" opacity=".6"/>').join('');
    }
    if (kind === 'syringe') {
      const gasMl = (result.products || []).reduce((sum, x) => sum + (x.gasVolumeMl || 0), 0), capacity = Math.max(100, Math.ceil(gasMl / 100) * 100), amount = gasMl / capacity * p, piston = -78 + 140 * amount;
      return '<path d="M-94-6h12v-21H83v54H-82V6h-12Z" ' + glass + '/><rect x="-79" y="-23" width="' + Math.max(0, piston + 79) + '" height="46" fill="#d7edbc" opacity=".7"/>' + Array.from({ length: 8 }, (_, i) => '<path d="M' + (-66 + i * 19) + '-26v9" stroke="#65867d"/>').join('') + '<path d="M' + piston + '-23v46" stroke="#617c75" stroke-width="8"/><path d="M' + (piston + 4) + ' 0h49m0-17v34" stroke="#91a69b" stroke-width="5"/>' + '<text x="0" y="57" text-anchor="middle" fill="#245c50" font-size="18" font-weight="700">' + fmt(gasMl * p, 1) + ' mL</text><text x="0" y="75" text-anchor="middle" fill="#67857c" font-size="10">理想干气体 · 量程自动缩放</text>';
    }
    if (kind === 'dropper') return '<path d="M-12-58q12-14 24 0v33l-6 9v53L0 62l-6-25v-53l-6-9Z" ' + glass + '/><path d="M-12-59q12-14 24 0v27H-12Z" fill="#648e81"/>' + (has ? '<path d="M-4-10h8v45L0 51l-4-16Z" fill="' + color + '"/>' : '') + (ongoing ? '<circle cx="0" cy="' + (68 + ((state.elapsed / 20) % 36)) + '" r="4" fill="' + color + '"/>' : '');
    if (kind === 'testtube') return '<path d="M-22-80H22V54a22 22 0 0 1-44 0Z" ' + glass + '/>' + (has ? '<path d="M-17 28h34v25a17 17 0 0 1-34 0Z" fill="' + mixColor('#77558f', '#586b54', p) + '"/>' : '') + (ongoing ? circles(state, 5) : '') + '<path d="M-13-62v81" stroke="#fff" stroke-width="4"/><path d="M-25-80h50" stroke="#65857a" stroke-width="6" stroke-linecap="round"/>';
    if (kind === 'heater') {
      const on = state.performed.includes('heat') && state.phase !== 'done';
      return '<rect x="-68" y="-17" width="136" height="40" rx="11" fill="#729589"/><rect x="-58" y="-24" width="116" height="12" rx="5" fill="#456c60"/><circle cx="39" cy="4" r="10" fill="#e7ebd9"/><circle cx="-39" cy="3" r="5" fill="' + (on ? '#f5a15a' : '#c2d1bf') + '"/><path d="M-35 26v7m70-7v7" stroke="#375c51" stroke-width="7" stroke-linecap="round"/>' + (on ? [-25, 0, 25].map((x, i) => '<path d="M' + x + '-30q-9-9 0-18t0-18" fill="none" stroke="#dcab6d" opacity="' + (.45 + .3 * Math.sin(state.elapsed / 300 + i)) + '" stroke-width="3"/>').join('') : '');
    }
    if (kind === 'stand') return '<path d="M-47 72h93l-8 13h-77Z" fill="#92a69b"/><path d="M-22 69v-157h8V69Z" fill="#708a7b"/><path d="M-19-44H68m-6-11v22" stroke="#849a8b" stroke-width="7" stroke-linecap="round"/><circle cx="-18" cy="-44" r="7" fill="#4c6e5d"/>';
    if (kind === 'burette') return '<path d="M-12-88h24V47L4 61v19H-4V61l-8-14Z" ' + glass + '/>' + (has ? '<path d="M-8 ' + (-75 + p * 112) + 'h16V46l-8 9-8-9Z" fill="#a4c3df" opacity=".85"/>' : '') + Array.from({ length: 6 }, (_, i) => '<path d="M1 ' + (-66 + i * 19) + 'h10" stroke="#759488"/>').join('') + '<path d="M-21 55h42" stroke="#749c8c" stroke-width="6" stroke-linecap="round"/>' + (ongoing ? '<circle cx="0" cy="' + (91 + (state.elapsed / 25) % 26) + '" r="3.5" fill="#9bc0d7"/>' : '');
    if (kind === 'stirrer') return '<rect x="-63" y="-18" width="126" height="34" rx="9" fill="#88a49a"/><ellipse cy="-18" rx="54" ry="8" fill="#cbd8cb"/><circle cx="39" cy="1" r="8" fill="#dde6d6"/><circle cx="-38" cy="1" r="4" fill="' + (state.performed.includes('stir') ? '#d9f286' : '#5d7c6c') + '"/>';
    if (kind === 'tongs') return '<path d="M-26-64q22-5 28 14l39 114M-26-64q-2 14 12 22l30 109" fill="none" stroke="#829b93" stroke-width="9" stroke-linecap="round"/><path d="m-19-53 14 10 31 91" fill="none" stroke="#d0ddd3" stroke-width="3"/>' + (has && !state.performed.includes('immerse') ? '<path d="m13 39 17-4 14 44-17 4Z" fill="#859491"/>' : '');
    if (kind === 'funnel') return '<path d="M-74-51H74L12 21v41H-12V21Z" ' + glass + '/>' + (amountOf(state, 'filter-paper', id) ? '<path d="M-64-45H64L0 19Z" fill="#e8dec4" stroke="#d1bda0" stroke-width="1.5"/>' : '') + (progress ? '<path d="M-35-16h70L0 15Z" fill="#b39a75" opacity="' + p + '"/>' : '') + (ongoing ? '<path d="M0 23v39" stroke="#a7d3dc" stroke-width="7"/>' : '');
    if (kind === 'rod') return '<path d="m-45-61 87 125" stroke="#6c9f96" stroke-width="10" stroke-linecap="round"/><path d="m-45-61 87 125" stroke="#d5e7de" stroke-width="5" stroke-linecap="round"/>';
    if (kind === 'condenser') {
      const on = state.performed.includes('cool');
      return '<g transform="rotate(16)"><rect x="-86" y="-21" width="172" height="42" rx="11" fill="' + (on ? '#bfe2e6' : '#e0ede8') + '" stroke="#73998b" stroke-width="2.5"/><path d="M-111 0H111" stroke="#6f9c8f" stroke-width="12"/><path d="M-111 0H111" stroke="#f2f5e9" stroke-width="7"/><path d="M-70-21v-23M70 21v23" stroke="#6e9b8d" stroke-width="9"/><path d="M-70-21v-23M70 21v23" stroke="#c4e5e5" stroke-width="4"/>' + (ongoing ? '<path d="M-107 0H107" stroke="#a5c6bb" stroke-width="4" stroke-dasharray="7 12" stroke-dashoffset="' + (-state.elapsed / 90) + '"/>' : '') + '</g><text x="0" y="-42" text-anchor="middle" fill="#54786d" font-size="10">外套走冷却水 · 内管走蒸气</text>';
    }
    if (kind === 'tap') return '<path d="M-52 31h67V-5h27v-15H1v35h-53Z" fill="#aec7bd" stroke="#67877b" stroke-width="2"/><path d="M-14-23h32m-16-7v18" stroke="#6c9685" stroke-width="7" stroke-linecap="round"/><rect x="-53" y="33" width="58" height="10" rx="4" fill="#d9e3d4"/>';
    if (kind === 'drain') return '<path d="M-49-15h98l-10 53h-78Z" fill="#dbe6dc" stroke="#88a394" stroke-width="2"/><ellipse cy="-15" rx="49" ry="12" fill="#c3dcd9" stroke="#86a393" stroke-width="2"/><path d="M0-35v22" stroke="#87b4b1" stroke-width="7"/>';
    if (kind === 'canister') return '<rect x="-38" y="-62" width="76" height="129" rx="26" fill="#b7cbbd" stroke="#62806d" stroke-width="2.5"/><path d="M-9-60v-17h18v17m0-13h35v14" fill="none" stroke="#6e9080" stroke-width="8"/><rect x="-29" y="-22" width="58" height="43" rx="6" fill="#f4f5e9"/><text x="0" y="5" text-anchor="middle" fill="#426e5a" font-size="18" font-weight="600">CO₂</text><path d="M-26-41v83" stroke="#dce6d7" stroke-width="5" opacity=".7"/>';
    if (kind === 'electrolyzer') return '<path d="M-105 30h210v51H-105Z" fill="#b8dce0" stroke="#6c948b" stroke-width="2.5"/>' + [-60, 60].map((x, i) => '<path d="M' + (x - 22) + ' 48V-74a22 22 0 0 1 44 0V48Z" fill="#c7e4df" stroke="#608d83" stroke-width="2.5"/><path d="M' + (x - 18) + ' ' + (-69 + p * (i ? 39 : 78)) + 'V-73a18 18 0 0 1 36 0v' + (4 + p * (i ? 39 : 78)) + 'Z" fill="' + (i ? '#ead9b8' : '#dcedb5') + '"/>' + (ongoing ? '<g transform="translate(' + x + ',-5) scale(.43,1)">' + circles(state, i ? 3 : 6) + '</g>' : '') + '<path d="M' + x + ' 57V7" stroke="#4f7368" stroke-width="6"/><text x="' + x + '" y="-111" text-anchor="middle" fill="#426f63" font-size="15" font-weight="700">' + (i ? 'O₂ · 1' : 'H₂ · 2') + '</text>').join('') + '<text x="0" y="106" text-anchor="middle" fill="#648477" font-size="11">两侧气体分别收集 · 体积示意</text>';
    if (kind === 'battery') return '<rect x="-75" y="-41" width="150" height="86" rx="14" fill="#78968a"/><rect x="-53" y="-20" width="64" height="33" rx="5" fill="#e7eddb"/><text x="-21" y="3" text-anchor="middle" fill="#587566" font-size="13" font-weight="600">DC</text><circle cx="43" cy="-3" r="13" fill="#c7d5c2"/><circle cx="-39" cy="28" r="4" fill="' + (ongoing ? '#d9f286' : '#456656') + '"/><path d="M-44-47v9M44-47v9" stroke="#5b7e6d" stroke-width="8"/><text x="-44" y="-60" text-anchor="middle" fill="#527869" font-size="16">−</text><text x="44" y="-60" text-anchor="middle" fill="#ab6f60" font-size="16">＋</text>';
    if (kind === 'chamber') {
      const burning = state.controls.oxygen === 'present' && progress, flame = burning && p < .85;
      return '<rect x="-97" y="-91" width="194" height="179" rx="20" fill="#dbe8df" stroke="#6e9583" stroke-width="3"/><rect x="-81" y="-75" width="162" height="143" rx="13" fill="#ecf2e9" stroke="#a6c1ac" stroke-width="2"/><path d="M-65 51h130" stroke="#91a996" stroke-width="8"/><path d="M-37 49h74l-8-14h-58Z" fill="#b4bb9d"/>' + (has ? '<g opacity="' + (burning ? Math.max(.16, 1 - p) : 1) + '"><path d="M-16 17 0-9l19 28Z" fill="none" stroke="#bba56e" stroke-width="3"/><circle cx="-16" cy="17" r="10" fill="#e5d99e"/><circle cx="0" cy="-9" r="10" fill="#eadfb3"/><circle cx="19" cy="19" r="10" fill="#d4c58c"/><circle cx="1" cy="30" r="10" fill="#dfd1a2"/></g>' : '') + (flame ? '<path d="M-34 26q-7-23 13-36-6 15 9 10 9-28 5-43 30 29 37 46 9 29-20 35Z" fill="#efb964" opacity=".72"/><path d="M-13 23q-6-18 9-32 2 12 13 15 13 18-3 28Z" fill="#fff9d2"/>' : '') + (burning ? '<ellipse cx="0" cy="-25" rx="' + (18 + 47 * p) + '" ry="' + (12 + 34 * p) + '" fill="#fff" opacity="' + Math.min(.85, p) + '"/>' : '') + '<rect x="-46" y="73" width="92" height="21" rx="6" fill="#759985"/><text x="0" y="88" text-anchor="middle" fill="#fff" font-size="10">封闭 · 仅虚拟观察</text>';
    }
    if (kind === 'screen') return '<rect x="-82" y="-57" width="164" height="112" rx="11" fill="#5d7d6c"/><rect x="-71" y="-46" width="142" height="88" rx="5" fill="#e2ebd8"/><path d="M0 56v20m-36 0h72" stroke="#74917e" stroke-width="9" stroke-linecap="round"/><text x="0" y="-16" text-anchor="middle" fill="#55785e" font-size="12">' + (progress ? state.controls.oxygen === 'present' ? '氧气参与反应' : '无氧概念场景' : '远程观察画面') + '</text><path d="M-48 20h96" stroke="#a6b897" stroke-width="2"/><path d="M-40 18h12v-' + (7 + (state.controls.oxygen === 'present' ? p * 25 : 0)) + 'h-12Z" fill="#d6b66c"/><path d="M-10 18H2V-' + (1 + (state.controls.oxygen === 'present' ? p * 17 : 0)) + 'h-12Z" fill="#97ba98"/><path d="M20 18h12v-' + (6 + p * 8) + 'H20Z" fill="#abc8b5"/>';
    return '';
  }
  function portPoint(state, fullId) { const p = findPort(fullId), pos = p && state.gear[p.gear]; return p && pos ? { x: pos.x + p.x, y: pos.y + p.y } : null; }
  function wirePath(state, connection) {
    const a = portPoint(state, connection.a), b = portPoint(state, connection.b);
    if (!a || !b) return '';
    if (connection.kind === 'electric') { const y = Math.max(a.y, b.y) + 39; return 'M' + a.x + ',' + a.y + ' C' + a.x + ',' + y + ' ' + b.x + ',' + y + ' ' + b.x + ',' + b.y; }
    if (connection.kind === 'liquid') return 'M' + a.x + ',' + a.y + ' C' + a.x + ',' + (a.y + 35) + ' ' + b.x + ',' + (b.y - 35) + ' ' + b.x + ',' + b.y;
    if (connection.kind === 'data') return 'M' + a.x + ',' + a.y + ' C' + (a.x + 30) + ',' + a.y + ' ' + (b.x - 30) + ',' + b.y + ' ' + b.x + ',' + b.y;
    const y = connection.kind === 'cooling' ? Math.min(a.y, b.y) - 36 : Math.min(a.y, b.y) - 48;
    return 'M' + a.x + ',' + a.y + ' C' + a.x + ',' + y + ' ' + b.x + ',' + y + ' ' + b.x + ',' + b.y;
  }
  function benchSVG(state) {
    const e = expFor(state), guide = getGuide(state), hasGear = Object.keys(state.gear).length > 0;
    let str = '<svg class="lab-bench-svg" viewBox="0 0 860 460" role="img" aria-label="' + esc(e.title) + '交互台面，器材可选中和拖动"><defs><linearGradient id="lab-glass" x1="0" x2="1"><stop stop-color="#e5f0e9" stop-opacity=".75"/><stop offset=".48" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#c5ddd3" stop-opacity=".65"/></linearGradient><pattern id="lab-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#cbd8c9" opacity=".6"/></pattern></defs><rect width="860" height="460" rx="18" fill="#f0f4e8"/><rect width="860" height="420" rx="18" fill="url(#lab-grid)"/><path d="M0 419H860" stroke="#c3d2bc" stroke-width="2"/><rect y="420" width="860" height="40" fill="#e0e8d6"/><text x="22" y="447" fill="#70866b" font-size="11">VIRTUAL CHEMISTRY WORKBENCH</text><text x="838" y="447" text-anchor="end" fill="#70866b" font-size="11">' + (state.phase === 'running' ? '观察中 · ' + Math.round(state.progress * 100) + '%' : state.phase === 'done' ? '观察完成' : '点选器材 · 连接接口 · 发现变化') + '</text>';
    if (!hasGear) str += '<g aria-hidden="true"><circle cx="430" cy="185" r="68" fill="#e3ecd6"/><path d="M411 141h38m-29 0v34l-32 54q-5 9 7 9h70q12 0 7-9l-32-54v-34" fill="none" stroke="#9bb495" stroke-width="4" stroke-linecap="round"/><path d="M405 205h50" stroke="#b2c69d" stroke-width="9" stroke-linecap="round"/><text x="430" y="298" text-anchor="middle" fill="#4e735e" font-size="18" font-weight="600">一张空台面，无限个为什么</text><text x="430" y="324" text-anchor="middle" fill="#738971" font-size="13">从器材架拿出第一件器材，开始你的实验</text></g>';
    else if (guide.stage === 'gear') {
      const pos = defaultPosition(e.id, guide.id);
      str += '<g aria-hidden="true" transform="translate(' + pos[0] + ',' + pos[1] + ')"><rect x="-60" y="-65" width="120" height="144" rx="18" fill="none" stroke="#a3bd98" stroke-dasharray="6 7"/><text y="7" text-anchor="middle" fill="#96aa8b" font-size="12">' + esc(apparatus[guide.id].name) + '</text><text y="30" text-anchor="middle" fill="#a2b596" font-size="24">＋</text></g>';
    }
    state.connections.forEach(c => {
      const color = c.kind === 'cooling' ? '#5ba2bd' : c.kind === 'electric' ? c.a.includes('positive') ? '#c78e77' : '#648276' : c.kind === 'data' ? '#a4af8b' : '#88b4a5';
      str += '<path d="' + wirePath(state, c) + '" fill="none" stroke="#edf4e9" stroke-width="11"/><path d="' + wirePath(state, c) + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round"/>' + (state.phase === 'running' ? '<path d="' + wirePath(state, c) + '" fill="none" stroke="#edf6d6" stroke-width="2.5" stroke-dasharray="6 17" stroke-dashoffset="' + (-state.elapsed / 70) + '"/>' : '');
    });
    // Supports sit behind glassware; moving an item only changes schematic layout.
    Object.keys(state.gear).sort((a, b) => ['stand', 'heater', 'stirrer'].includes(a) ? -1 : ['stand', 'heater', 'stirrer'].includes(b) ? 1 : 0).forEach(id => {
      const pos = state.gear[id], selected = state.selectedGear === id;
      str += '<g class="lab-apparatus' + (selected ? ' is-selected' : '') + '" data-draggable-gear="' + id + '" data-lab-action="select-gear" data-id="' + id + '" transform="translate(' + pos.x + ',' + pos.y + ')" tabindex="0" role="button" aria-label="选择' + esc(apparatus[id].name) + '，可拖动或用方向键移动"><ellipse cx="0" cy="82" rx="65" ry="10" fill="#a9bb9c" opacity=".16"/>' + (selected ? '<rect x="-103" y="-116" width="206" height="220" rx="22" fill="none" stroke="#67a180" stroke-dasharray="4 6" stroke-width="1.5" opacity=".5"/>' : '') + gearArt(id, state) + '<text x="0" y="' + (apparatus[id].kind === 'electrolyzer' ? 124 : apparatus[id].kind === 'syringe' ? 98 : ['heater', 'stirrer', 'drain', 'tap'].includes(apparatus[id].kind) ? 58 : 113) + '" text-anchor="middle" fill="#496e5b" font-size="12" font-weight="600">' + esc(apparatus[id].name) + '</text></g>';
    });
    Object.keys(state.gear).forEach(id => {
      const pos = state.gear[id];
      allPorts(id).forEach(p => {
        const active = state.selectedPort === p.fullId, connected = state.connections.some(c => [c.a, c.b].includes(p.fullId)), needed = e.links.some(l => l.includes(p.fullId));
        if (!needed && !active) return;
        const name = p.kind === 'cooling' ? p.id.includes('low') ? '低口进' : p.id.includes('high') ? '高口出' : p.direction === 'out' ? '供水' : '回水' : p.kind === 'electric' ? (p.id === 'positive' || p.id === 'anode') ? '＋' : '−' : p.kind === 'data' ? '信号' : p.direction === 'out' ? '出口' : '入口';
        str += '<g class="lab-port" data-lab-action="port" data-id="' + p.fullId + '" transform="translate(' + (pos.x + p.x) + ',' + (pos.y + p.y) + ')" tabindex="0" role="button" aria-label="接口：' + esc(portLabel(p.fullId)) + (connected ? '，已连接' : '，未连接') + '"><circle r="22" fill="transparent"/><circle r="' + (active ? 14 : 11) + '" fill="' + (connected ? '#76aa8e' : '#fffef2') + '" stroke="' + (active ? '#d0a34f' : '#62977c') + '" stroke-width="2.5"/><circle r="3.5" fill="' + (connected ? '#f0f7df' : '#76a189') + '"/><rect x="-24" y="-36" width="48" height="17" rx="6" fill="#f6f8ee" opacity=".94"/><text y="-24" text-anchor="middle" fill="#5c7f6b" font-size="10">' + name + '</text></g>';
      });
    });
    return str + '</svg>';
  }
  let rememberedState = null;
  function mount(container, ctx = {}) {
    if (!container || typeof container.innerHTML === 'undefined') throw new TypeError('需要实验室的容器节点。');
    const initial = ctx.initialExperiment || (ctx.params && (ctx.params.experiment || ctx.params.id));
    let state = rememberedState && (!initial || initial === rememberedState.experimentId) ? clone(rememberedState) : createState(byId[initial] ? initial : experiments[0].id);
    const kids = ctx.mode === 'kids';
    const ui = { guide: kids, shelf: Object.keys(state.gear).length ? 'materials' : 'gear', allGear: false, amounts: {}, from: '', to: '', freeMaterial: 'water', freeTarget: '', freeAmount: '1' };
    let alive = true, frame = null, lastFrame = null, lastDraw = 0, drag = null, suppressClick = false;
    const requestFrame = typeof global.requestAnimationFrame === 'function' ? fn => global.requestAnimationFrame(fn) : fn => global.setTimeout(() => fn(Date.now()), 40);
    const cancelFrame = typeof global.cancelAnimationFrame === 'function' ? id => global.cancelAnimationFrame(id) : id => global.clearTimeout(id);
    function remember() { rememberedState = clone(state); }
    function dispatch(action) {
      const prev = state;
      state = reduce(state, action);
      if (action.type === 'RESET') { ui.shelf = 'gear'; ui.amounts = {}; ui.from = ''; ui.to = ''; }
      if (action.type === 'PLACE_GEAR' && validateSetup(state).missingGear.length === 0) ui.shelf = 'materials';
      if (state.phase === 'done' && prev.phase !== 'done' && typeof ctx.complete === 'function') ctx.complete('lab-' + state.experimentId, expFor(state).title, calculateResult(state).summary);
      remember();
      render();
      return state;
    }
    function shelfHTML() {
      const e = expFor(state), guide = getGuide(state), locked = state.phase !== 'setup';
      const gearIds = ui.allGear && !kids ? Object.keys(apparatus) : e.gear;
      let body = '';
      if (ui.shelf === 'gear') {
        body = '<div class="lab-equipment-grid">' + gearIds.map(id => {
          const placed = !!state.gear[id], needed = e.gear.includes(id), highlight = ui.guide && guide.stage === 'gear' && guide.id === id;
          return '<button type="button" class="lab-equipment-card' + (placed ? ' is-placed' : '') + (highlight ? ' is-next' : '') + '" data-lab-action="place" data-id="' + id + '" aria-label="放置' + esc(apparatus[id].name) + '" ' + (locked && !placed ? 'disabled' : '') + '><span class="lab-equipment-symbol">' + symbol(apparatus[id].kind === 'heater' ? 'heat' : apparatus[id].kind === 'battery' ? 'electric' : apparatus[id].kind === 'funnel' ? 'filter' : apparatus[id].kind === 'condenser' ? 'distill' : 'flask', 28) + '</span><strong>' + esc(apparatus[id].name) + '</strong><small>' + (placed ? '✓ 已上台面' : needed ? '点我放置' : '可选器材') + '</small></button>';
        }).join('') + '</div>' + (!kids ? '<button class="lab-text-button" type="button" data-lab-action="all-gear">' + (ui.allGear ? '只看本次需要' : '打开完整器材抽屉（' + Object.keys(apparatus).length + ' 件）') + '</button>' : '');
      } else {
        body = '<div class="lab-reagent-list">' + e.reagents.map(r => {
          const k = r.id + '@' + r.target, amount = ui.amounts[k] == null ? r.amount : ui.amounts[k], present = amountOf(state, r.id, r.target), next = ui.guide && guide.stage === 'material' && guide.id === r.id && guide.target === r.target;
          return '<div class="lab-reagent' + (next ? ' is-next' : '') + (present ? ' has-material' : '') + '"><div class="lab-reagent-name">' + bottleIcon(r.id) + '<span><strong>' + esc(materials[r.id].name) + '</strong><small>→ ' + esc(apparatus[r.target].name) + (r.optional ? ' · 可选对照' : '') + '</small></span>' + (present ? '<span class="lab-tiny-check" aria-label="已加入">✓</span>' : '') + '</div>' +
            (!kids && !e.virtualOnly ? '<div class="lab-dose"><label><span>模型用量 · ' + (r.unit === 'mmol' ? '溶质 mmol' : r.unit) + '</span><input class="input" type="number" inputmode="decimal" min="' + r.min + '" max="' + r.max + '" step="' + r.step + '" value="' + esc(amount) + '" data-lab-dose="' + k + '" aria-label="' + esc(materials[r.id].name + '加入' + apparatus[r.target].name + '的用量') + '" ' + (locked ? 'disabled' : '') + '></label></div>' : '') +
            '<button type="button" class="lab-add-button" data-lab-action="add" data-material="' + r.id + '" data-target="' + r.target + '" aria-label="加入' + esc(materials[r.id].name) + '到' + esc(apparatus[r.target].name) + '" ' + (locked ? 'disabled' : '') + '>' + (present ? '再加入一份' : r.id.includes('model') ? '放入模型卡' : kids ? '加入这份材料' : '加入') + ' <span aria-hidden="true">＋</span></button>' + (present ? '<small class="lab-present">已有：' + (kids || e.virtualOnly ? '这份材料' : fmt(present) + ' ' + r.unit) + '</small>' : '') + '</div>';
        }).join('') + '</div>';
        if (!kids && !e.virtualOnly) body += '<details class="lab-free-mix"><summary>自由选材 · 检查模型支持范围</summary><p>已收录材料可自由选择；未建模的组合会明确提示“尚未支持”。</p><label>选择材料<select class="select" data-lab-free="material" aria-label="自由选择材料">' + Object.keys(materials).filter(id => !id.includes('model')).map(id => '<option value="' + id + '" ' + (ui.freeMaterial === id ? 'selected' : '') + '>' + esc(materials[id].name) + '</option>').join('') + '</select></label><label>目标器材<select class="select" data-lab-free="target" aria-label="自由选择目标器材"><option value="">请选择台面器材</option>' + Object.keys(state.gear).map(id => '<option value="' + id + '" ' + (ui.freeTarget === id ? 'selected' : '') + '>' + esc(apparatus[id].name) + '</option>').join('') + '</select></label><label>模型数量<input class="input" type="number" min="0.1" max="300" step="0.5" value="' + esc(ui.freeAmount) + '" data-lab-free="amount" aria-label="自由选材数量"></label><button class="btn secondary" type="button" data-lab-action="free-add" ' + (locked ? 'disabled' : '') + '>尝试加入</button><small>支持的组合沿用任务材料卡的单位。</small></details>';
      }
      return '<aside class="lab-shelf panel"><div class="lab-region-title"><span>' + symbol('flask') + '<strong>器材与材料</strong></span><small>' + (kids ? '点一点，放上台面' : '选择 · 配量 · 添加') + '</small></div><div class="lab-shelf-tabs" role="tablist" aria-label="物品架分类"><button role="tab" type="button" aria-selected="' + (ui.shelf === 'gear') + '" data-lab-action="shelf" data-tab="gear">器材架 <span>' + e.gear.length + '</span></button><button role="tab" type="button" aria-selected="' + (ui.shelf === 'materials') + '" data-lab-action="shelf" data-tab="materials">材料架 <span>' + e.reagents.length + '</span></button></div>' + body + '<p class="lab-shelf-foot">' + (kids ? '拿错了也没关系，点器材可以收回。' : '准备阶段的原料由模型隔离；执行操作时才接触反应。') + '</p></aside>';
    }
    function controlsHTML() {
      const e = expFor(state), locked = state.phase !== 'setup';
      if (!(e.controls || []).length) return '';
      return '<div class="lab-model-controls"><h4>改变一个条件</h4>' + (e.controls.includes('oxygen') ? '<label>概念场景<select class="select" data-lab-control="oxygen" aria-label="白磷观察场景" ' + (locked ? 'disabled' : '') + '><option value="present" ' + (state.controls.oxygen === 'present' ? 'selected' : '') + '>氧气充足（仅概念）</option><option value="absent" ' + (state.controls.oxygen === 'absent' ? 'selected' : '') + '>无氧场景（仅概念）</option></select></label>' : '') +
        (e.controls.includes('heat') ? '<label>模型加热档位 <strong>' + state.controls.heat + '</strong><input type="range" class="range" min="1" max="3" step="1" value="' + state.controls.heat + '" data-lab-control="heat" aria-label="模型加热档位" ' + (locked ? 'disabled' : '') + '></label><small>仅改变动画快慢，不表示实际温度。</small>' : '') +
        (!kids && e.controls.includes('fraction') ? '<label>收集水的比例 <strong>' + state.controls.fraction + '%</strong><input type="range" class="range" min="10" max="70" step="10" value="' + state.controls.fraction + '" data-lab-control="fraction" aria-label="蒸馏收集比例" ' + (locked ? 'disabled' : '') + '></label>' : '') +
        (!kids && e.controls.includes('charge') ? '<label>模型电荷 Q（C）<input class="input" type="number" min="40" max="1200" step="1" value="' + state.controls.charge + '" data-lab-control="charge" aria-label="电解模型电荷" ' + (locked ? 'disabled' : '') + '></label><small>F ≈ 96,485 C/mol；按理想电流效率计算。</small>' : '') + '</div>';
    }
    function connectionHTML() {
      const e = expFor(state), ports = Object.keys(state.gear).flatMap(id => allPorts(id)), locked = state.phase !== 'setup';
      if (!e.links.length) return '<div class="lab-no-links">' + symbol('check', 18) + '<span>这项实验不需要导管或电线，放好器材后配置材料。</span></div>';
      const options = (current, prompt) => '<option value="">' + prompt + '</option>' + ports.map(p => '<option value="' + p.fullId + '" ' + (current === p.fullId ? 'selected' : '') + '>' + esc(portLabel(p.fullId)) + '</option>').join('');
      return '<div class="lab-connection-box"><div class="lab-region-title"><span>' + symbol('link', 19) + '<strong>连接向导</strong></span><small>' + state.connections.length + ' / ' + e.links.length + ' 已连接</small></div><p>点台面上的两个圆形接口，或用下面的选择框连接。</p><div class="lab-connect-form"><label>第一端<select class="select" data-lab-endpoint="from" aria-label="连接的第一端" ' + (locked ? 'disabled' : '') + '>' + options(ui.from, '选择一个接口') + '</select></label><span class="lab-connect-arrow" aria-hidden="true">→</span><label>第二端<select class="select" data-lab-endpoint="to" aria-label="连接的第二端" ' + (locked ? 'disabled' : '') + '>' + options(ui.to, '再选择一个接口') + '</select></label><button type="button" class="btn primary" data-lab-action="connect" ' + (locked ? 'disabled' : '') + '>连接</button></div>' + (ui.guide ? '<ol class="lab-link-guide">' + e.links.map(([a, b]) => '<li class="' + (state.connections.some(c => c.key === keyLink(a, b)) ? 'is-complete' : '') + '">' + esc(portLabel(a)) + ' → ' + esc(portLabel(b)) + '</li>').join('') + '</ol>' : '') + (state.connections.length ? '<ul class="lab-connected-list">' + state.connections.map(c => '<li><span>✓ ' + esc(portLabel(c.a)) + ' → ' + esc(portLabel(c.b)) + '</span><button type="button" data-lab-action="disconnect" data-key="' + c.key + '" aria-label="断开' + esc(portLabel(c.a)) + '到' + esc(portLabel(c.b)) + '" ' + (locked ? 'disabled' : '') + '>断开</button></li>').join('') + '</ul>' : '') + '</div>';
    }
    function selectedHTML() {
      const id = state.selectedGear, locked = state.phase !== 'setup';
      if (!id || !state.gear[id]) return '<div class="lab-selection-empty">点一件台面器材，可查看材料、移动位置或收回器材。</div>';
      const contents = state.contents[id] || {};
      return '<div class="lab-selected"><div class="lab-selected-header"><strong>' + esc(apparatus[id].name) + '</strong><button type="button" class="lab-text-button" data-lab-action="remove-gear" data-id="' + id + '" ' + (locked ? 'disabled' : '') + '>收回器材</button></div><div class="lab-move-row"><span>移动位置</span>' + [['left', '←'], ['up', '↑'], ['down', '↓'], ['right', '→']].map(([dir, label]) => '<button type="button" class="lab-move-button" data-lab-action="move" data-direction="' + dir + '" aria-label="' + ({ left: '向左', up: '向上', down: '向下', right: '向右' }[dir]) + '移动' + esc(apparatus[id].name) + '">' + label + '</button>').join('') + '</div>' + (Object.keys(contents).length ? '<ul class="lab-content-list">' + Object.keys(contents).map(mid => { const r = requirement(expFor(state), mid, id); return '<li><span><i style="background:' + materials[mid].color + '"></i>' + esc(materials[mid].name) + (!kids && !expFor(state).virtualOnly ? ' · ' + fmt(contents[mid]) + ' ' + r.unit : '') + '</span><button type="button" data-lab-action="remove-material" data-material="' + mid + '" data-target="' + id + '" ' + (locked ? 'disabled' : '') + ' aria-label="从' + esc(apparatus[id].name) + '移除' + esc(materials[mid].name) + '">移除</button></li>'; }).join('') + '</ul>' : '<p>里面还没有材料。</p>') + '</div>';
    }
    function missionHTML() {
      const e = expFor(state), guide = getGuide(state), locked = state.phase !== 'setup';
      return '<aside class="lab-mission panel"><div class="lab-region-title"><span>' + symbol('spark') + '<strong>实验任务</strong></span></div><div class="lab-prediction"><span class="lab-small-label">先猜一猜</span><h3>' + esc(e.question) + '</h3><div class="lab-prediction-options" role="group" aria-label="实验预测">' + e.options.map((option, index) => '<button class="lab-prediction-button' + (state.prediction === index ? ' is-selected' : '') + '" type="button" data-lab-action="predict" data-index="' + index + '" aria-pressed="' + (state.prediction === index) + '" ' + (locked ? 'disabled' : '') + '><span>' + String.fromCharCode(65 + index) + '</span>' + esc(option) + '</button>').join('') + '</div></div>' + controlsHTML() + '<div class="lab-operations"><span class="lab-small-label">再动手操作</span>' + e.operations.map((op, i) => '<button type="button" class="lab-operation' + (state.performed.includes(op.id) ? ' is-done' : '') + (guide.stage === 'operate' && guide.id === op.id ? ' is-next' : '') + '" data-lab-action="operate" data-operation="' + op.id + '" ' + (locked || state.performed.includes(op.id) ? 'disabled' : '') + '><span>' + (state.performed.includes(op.id) ? '✓' : i + 1) + '</span><strong>' + esc(kids ? op.kids : op.label) + '</strong></button>').join('') + '</div><div class="lab-mini-note">' + (kids ? '猜错也没关系。先观察，再让证据帮我们改答案。' : '操作必须按顺序完成。改变投料或连线后，操作步骤会重新开始。') + '</div></aside>';
    }
    function resultHTML() {
      const e = expFor(state);
      if (state.phase !== 'done') return '<section class="lab-awaiting"><span>' + symbol('book', 24) + '</span><div><h3>你的发现会记录在这里</h3><p>搭好装置、配好材料，先预测再观察。完成后会看到解释' + (!kids ? '、理论产量与质量账本' : '') + '。</p></div></section>';
      const result = calculateResult(state), correct = state.prediction === e.correct;
      return '<section class="lab-result panel" aria-labelledby="lab-result-heading"><div class="lab-result-heading"><div><span class="lab-small-label">OBSERVE → EXPLAIN</span><h2 id="lab-result-heading">' + symbol('spark', 24) + ' 这次我们发现了</h2></div><span class="lab-completed-badge">✓ 观察完成</span></div><p class="lab-result-summary">' + esc(result.summary) + '</p><p class="lab-prediction-result ' + (correct ? 'is-correct' : 'is-revised') + '">' + (correct ? '✓ 你的猜想与这次观察一致。' : '🪞 观察帮我们修正猜想：' + esc(e.options[e.correct]) + '。') + '</p><div class="lab-explanation"><p>' + esc(kids ? e.kidsExplain : e.explain) + '</p><div class="lab-equation">' + esc(e.equation) + '</div>' + (e.equation2 ? '<div class="lab-equation secondary-equation">' + esc(e.equation2) + '</div>' : '') + '<small>' + esc(e.condition) + '</small></div>' +
        (result.cards ? '<div class="lab-result-cards">' + result.cards.map((c, i) => '<div class="lab-result-stat"' + (result.colors ? ' style="border-top:4px solid ' + result.colors[i] + '"' : '') + '><span>' + esc(c.label) + '</span><strong>' + esc(c.value) + '</strong></div>').join('') + '</div>' : '') +
        (!kids && result.products ? '<div class="lab-table-scroll"><table class="lab-yield-table"><caption>理论生成量 · 按当前模型投料</caption><thead><tr><th scope="col">生成物</th><th scope="col">物质的量</th><th scope="col">质量</th><th scope="col">气体体积</th></tr></thead><tbody>' + result.products.map(x => '<tr><th scope="row">' + esc(x.name) + ' <span>' + formulaHTML(x.formula) + '</span></th><td>' + fmt(x.moles * 1000, 4) + ' mmol</td><td>' + fmt(x.grams, 5) + ' g</td><td>' + (x.gasVolumeMl == null ? '—' : fmt(x.gasVolumeMl, 2) + ' mL') + '</td></tr>').join('') + '</tbody></table></div><p class="lab-gas-condition">气体体积条件：' + result.gasConditions + '；理论转化与理想收集，不代表实测回收量。</p>' + (result.limiting.length ? '<p class="lab-limit-reagent"><strong>限制因素：</strong>' + esc(result.limiting.join('、')) + '</p>' : '') + (result.reactants.some(x => x.remainingGrams > 1e-10) ? '<div class="lab-leftovers"><strong>反应后还剩：</strong>' + result.reactants.filter(x => x.remainingGrams > 1e-10).map(x => esc(x.name) + ' ' + fmt(x.remainingGrams, 5) + ' g').join('；') + '</div>' : '') : '') +
        (kids && result.products && result.products.some(x => x.gasVolumeMl != null) ? '<div class="lab-result-cards">' + result.products.filter(x => x.gasVolumeMl != null).map(x => '<div class="lab-result-stat"><span>' + esc(x.name) + ' · 模型收集量</span><strong>' + fmt(x.gasVolumeMl, 1) + ' mL</strong></div>').join('') + '</div><p class="lab-gas-condition">在相同的温度和压强下比较：25°C、101.325 kPa。</p>' : '') +
        (!kids && result.mass ? '<div class="lab-mass-balance"><strong>质量账本</strong><span>投入 ' + fmt(result.mass.input, 5) + ' g = 产物 / 分离所得 ' + fmt(result.mass.products, 5) + ' g + 剩余 ' + fmt(result.mass.leftover, 5) + ' g</span><small>按同一原子量表计算守恒；显示值独立四舍五入。' + (result.kind === 'reaction' ? '溶液只计参与反应的纯溶质，未变的溶剂、催化剂和支持电解质不列入。' : '理想无损失物理分离，器材与滤纸不计入物料质量。') + '</small></div>' : '') + '<div class="lab-result-actions"><button type="button" class="btn primary" data-lab-action="save-note">' + symbol('book', 18) + ' 保存实验笔记</button><button type="button" class="btn secondary" data-lab-action="restart">保留装置重做</button><button type="button" class="btn secondary" data-lab-action="next-experiment">下一个实验 ' + symbol('arrow', 18) + '</button></div></section>';
    }
    function scienceHTML() {
      const e = expFor(state);
      return '<details class="lab-science panel"><summary>' + symbol('book', 20) + ' 方程式、模型边界与资料来源</summary><div class="lab-science-body"><h3>这项实验在教什么？</h3><p>' + esc(e.explain) + '</p><div class="lab-equation">' + esc(e.equation) + '</div>' + (e.equation2 ? '<div class="lab-equation secondary-equation">' + esc(e.equation2) + '</div>' : '') + '<p class="lab-condition">' + esc(e.condition) + '</p><h3>模型的边界</h3><p>' + esc(e.limit) + '</p><p>器材大小、位置、连线弯曲和动画时长均是教学示意，不表示真实安装尺寸、反应时间或现实操作规程。仅对收录场景给出结果；没有建模的混合物不能据此判断“不会反应”。</p><h3>核对知识</h3><ul>' + e.sources.map(s => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + ' ↗</a></li>').join('') + '</ul></div></details>';
    }
    function render() {
      if (!alive) return;
      const e = expFor(state), guide = getGuide(state), v = validateSetup(state), gearReady = !v.missingGear.length && !v.missingConnections.length;
      const stages = [['搭装置', gearReady], ['配材料', !v.missingMaterials.length], ['先猜想', state.prediction !== null], ['做操作', state.performed.length === e.operations.length], ['看结果', state.phase === 'done']];
      container.innerHTML = '<div class="chem-lab ' + (kids ? 'lab-kids' : 'lab-advanced') + '"><header class="lab-heading"><div><div class="lab-eyebrow">VIRTUAL LAB · 12 个可交互实验</div><h1>' + (kids ? '小小化学实验室' : '把化学，放到实验台上') + '</h1><p>' + (kids ? '亲手选、连一连、猜一猜，再用眼睛发现答案。' : '从选择材料到连接仪器，把预测、操作、观察和解释连起来。') + '</p></div><span class="lab-mode-badge">' + symbol(kids ? 'spark' : 'flask', 20) + (kids ? '儿童探索' : '进阶研究') + '</span></header><section class="lab-experiment-select panel"><div class="lab-current-icon" style="--lab-accent:' + e.color + '">' + symbol(e.icon, 31) + '</div><div class="lab-experiment-copy"><span class="lab-small-label">' + esc(e.category) + ' · ' + esc(e.level) + '</span><h2>' + esc(e.title) + '</h2><p>' + esc(e.subtitle) + '</p></div><label class="lab-recipe-label"><span>切换实验</span><select class="select" data-lab-recipe aria-label="选择实验">' + ['气体', '反应', '分离', '模型'].map(cat => '<optgroup label="' + cat + '">' + experiments.filter(x => x.category === cat).map(x => '<option value="' + x.id + '" ' + (e.id === x.id ? 'selected' : '') + '>' + esc(x.title) + '</option>').join('') + '</optgroup>').join('') + '</select></label></section>' +
        (e.virtualOnly ? '<div class="lab-virtual-note">' + symbol('shield', 23) + '<span><strong>只在屏幕里观察。</strong>白磷有毒且易燃，本场景使用模型卡和封闭观察盒，不提供现实操作步骤。</span></div>' : '') +
        '<div class="lab-stage-row" aria-label="实验流程">' + stages.map(([title, done], i) => '<div class="lab-stage' + (done ? ' is-done' : '') + '"><span>' + (done ? '✓' : i + 1) + '</span>' + title + '</div>').join('') + '</div><div class="lab-guide-bar"><div class="lab-guide-avatar" aria-hidden="true">' + symbol('spark', 23) + '</div><div><strong>' + (ui.guide ? '现在做这一小步' : '自主探索已开启') + '</strong><p>' + esc(ui.guide ? guide.text : '自己选择器材和路线；遇到问题时，随时打开引导。') + '</p></div><button type="button" class="lab-guide-toggle" data-lab-action="toggle-guide" aria-pressed="' + ui.guide + '">' + (ui.guide ? '收起引导' : '打开引导') + '</button></div><div class="lab-feedback ' + esc(state.feedback.type) + '" role="status" aria-live="polite"><span aria-hidden="true">' + (state.feedback.type === 'error' ? '↺' : state.feedback.type === 'success' ? '✓' : 'i') + '</span>' + esc(state.feedback.text) + '</div><div class="lab-workspace">' + shelfHTML() + '<section class="lab-workbench panel"><div class="lab-bench-toolbar"><span>' + symbol('flask', 18) + '<strong>我的实验台</strong></span><div><button type="button" class="lab-tool-button" data-lab-action="undo" ' + (!state.history.length || state.phase === 'running' ? 'disabled' : '') + '>撤回</button><button type="button" class="lab-tool-button" data-lab-action="reset">' + symbol('reset', 16) + '清空</button></div></div><div class="lab-bench-art" data-lab-bench>' + benchSVG(state) + '</div><div class="lab-playback"><span data-lab-progress-text>' + (state.phase === 'setup' ? '等待装置、材料和操作准备完成' : state.phase === 'done' ? '观察已完成，可以查看下方的发现' : '观察进度 ' + Math.round(state.progress * 100) + '%') + '</span><div class="lab-playback-actions"><label>播放<select class="select" data-lab-control="speed" aria-label="动画播放速度"><option value="1" ' + (state.controls.speed === 1 ? 'selected' : '') + '>×1</option><option value="2" ' + (state.controls.speed === 2 ? 'selected' : '') + '>×2</option><option value="4" ' + (state.controls.speed === 4 ? 'selected' : '') + '>×4</option></select></label>' + (state.phase === 'running' ? '<button class="btn secondary small" type="button" data-lab-action="pause">' + (state.paused ? '继续观察' : '暂停观察') + '</button>' : '') + '</div></div><div class="lab-observation-meter" role="progressbar" aria-label="实验观察进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(state.progress * 100) + '"><i style="width:' + state.progress * 100 + '%"></i></div>' + connectionHTML() + selectedHTML() + '<p class="lab-position-note">台面为连接示意；拖动只调整布局。手机也可以用选择框连接、用方向按钮移动。</p></section>' + missionHTML() + '</div>' + resultHTML() + scienceHTML() + '</div>';
    }
    function saveNote() {
      if (state.phase !== 'done') return;
      const e = expFor(state), r = calculateResult(state);
      const body = ['实验：' + e.title, '我的猜想：' + e.options[state.prediction], '观察：' + r.summary, '解释：' + (kids ? e.kidsExplain : e.explain), '方程式 / 分离过程：' + e.equation, e.equation2 || '', '模型边界：' + e.limit].filter(Boolean).join('\n\n');
      if (typeof ctx.saveNote === 'function') ctx.saveNote({ title: e.title + ' · 实验发现', body, experimentId: e.id });
      else if (typeof ctx.toast === 'function') ctx.toast('本次发现已展示在下方，可复制保存。');
    }
    function click(event) {
      if (suppressClick) { suppressClick = false; return; }
      const el = event.target.closest && event.target.closest('[data-lab-action]');
      if (!el || !container.contains(el) || el.disabled) return;
      const action = el.getAttribute('data-lab-action'), id = el.getAttribute('data-id');
      if (action === 'shelf') { ui.shelf = el.getAttribute('data-tab'); render(); return; }
      if (action === 'all-gear') { ui.allGear = !ui.allGear; render(); return; }
      if (action === 'toggle-guide') { ui.guide = !ui.guide; render(); return; }
      if (action === 'place') return dispatch({ type: 'PLACE_GEAR', id });
      if (action === 'select-gear') return dispatch({ type: 'SELECT_GEAR', id });
      if (action === 'port') return dispatch({ type: 'SELECT_PORT', id });
      if (action === 'add') {
        const material = el.getAttribute('data-material'), target = el.getAttribute('data-target'), r = requirement(expFor(state), material, target), amount = ui.amounts[material + '@' + target];
        return dispatch({ type: 'ADD_MATERIAL', id: material, target, amount: kids || expFor(state).virtualOnly || amount == null ? r.amount : amount });
      }
      if (action === 'free-add') return dispatch({ type: 'ADD_MATERIAL', id: ui.freeMaterial, target: ui.freeTarget, amount: ui.freeAmount });
      if (action === 'connect') return dispatch({ type: 'CONNECT', a: ui.from, b: ui.to });
      if (action === 'disconnect') return dispatch({ type: 'DISCONNECT', key: el.getAttribute('data-key') });
      if (action === 'remove-gear') return dispatch({ type: 'REMOVE_GEAR', id });
      if (action === 'remove-material') return dispatch({ type: 'REMOVE_MATERIAL', id: el.getAttribute('data-material'), target: el.getAttribute('data-target') });
      if (action === 'predict') return dispatch({ type: 'PREDICT', index: Number(el.getAttribute('data-index')) });
      if (action === 'operate') return dispatch({ type: 'OPERATE', id: el.getAttribute('data-operation') });
      if (action === 'pause') return dispatch({ type: 'PAUSE' });
      if (action === 'undo') return dispatch({ type: 'UNDO' });
      if (action === 'reset') return dispatch({ type: 'RESET' });
      if (action === 'restart') return dispatch({ type: 'RESTART' });
      if (action === 'move' && state.selectedGear) {
        const pos = state.gear[state.selectedGear], dir = el.getAttribute('data-direction');
        return dispatch({ type: 'MOVE_GEAR', id: state.selectedGear, x: pos.x + (dir === 'left' ? -24 : dir === 'right' ? 24 : 0), y: pos.y + (dir === 'up' ? -24 : dir === 'down' ? 24 : 0) });
      }
      if (action === 'save-note') return saveNote();
      if (action === 'next-experiment') return dispatch({ type: 'RESET', experimentId: experiments[(experiments.findIndex(e => e.id === state.experimentId) + 1) % experiments.length].id });
    }
    function input(event) {
      const el = event.target, dose = el.getAttribute && el.getAttribute('data-lab-dose');
      if (dose != null) ui.amounts[dose] = el.value;
      const free = el.getAttribute && el.getAttribute('data-lab-free');
      if (free) ui[{ material: 'freeMaterial', target: 'freeTarget', amount: 'freeAmount' }[free]] = el.value;
    }
    function change(event) {
      const el = event.target;
      if (!el.getAttribute) return;
      input(event);
      if (el.hasAttribute('data-lab-recipe')) return dispatch({ type: 'RESET', experimentId: el.value });
      if (el.hasAttribute('data-lab-endpoint')) ui[el.getAttribute('data-lab-endpoint')] = el.value;
      if (el.hasAttribute('data-lab-control')) return dispatch({ type: 'SET_CONTROL', name: el.getAttribute('data-lab-control'), value: el.value });
    }
    function keydown(event) {
      const el = event.target.closest && event.target.closest('[data-lab-action]');
      if (!el) return;
      if (['Enter', ' '].includes(event.key) && el.tagName && el.tagName.toLowerCase() === 'g') { event.preventDefault(); click({ target: el }); return; }
      if (el.getAttribute('data-lab-action') === 'select-gear' && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault(); const id = el.getAttribute('data-id'), pos = state.gear[id];
        if (!pos) return;
        dispatch({ type: 'MOVE_GEAR', id, x: pos.x + (event.key === 'ArrowLeft' ? -16 : event.key === 'ArrowRight' ? 16 : 0), y: pos.y + (event.key === 'ArrowUp' ? -16 : event.key === 'ArrowDown' ? 16 : 0) });
        const next = container.querySelector('[data-draggable-gear="' + id + '"]'); if (next && next.focus) next.focus();
      }
    }
    function pointerDown(event) {
      const g = event.target.closest && event.target.closest('[data-draggable-gear]');
      if (!g || event.button > 0) return;
      const svg = g.closest('svg'), bounds = svg.getBoundingClientRect(), id = g.getAttribute('data-draggable-gear');
      if (!bounds.width || !bounds.height) return;
      drag = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, pos: Object.assign({}, state.gear[id]), scaleX: 860 / bounds.width, scaleY: 460 / bounds.height, moved: false, svg };
      if (container.setPointerCapture && event.pointerId != null) { try { container.setPointerCapture(event.pointerId); } catch (_) { /* Tap fallback remains available. */ } }
    }
    function pointerMove(event) {
      if (!drag || (event.pointerId != null && drag.pointerId !== event.pointerId)) return;
      const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 7) return;
      drag.moved = true; if (event.cancelable) event.preventDefault();
      state = reduce(state, { type: 'MOVE_GEAR', id: drag.id, x: drag.pos.x + dx * drag.scaleX, y: drag.pos.y + dy * drag.scaleY });
      const art = container.querySelector('[data-lab-bench]'); if (art) art.innerHTML = benchSVG(state);
    }
    function pointerUp() {
      if (!drag) return;
      const moved = drag.moved; drag = null;
      if (moved) { suppressClick = true; remember(); render(); }
    }
    function animate(now) {
      if (!alive) return;
      if (lastFrame == null) lastFrame = now;
      const dt = Math.max(0, Math.min(now - lastFrame, 200)); lastFrame = now;
      if (state.phase === 'running' && !state.paused) {
        const prevPhase = state.phase;
        state = reduce(state, { type: 'TICK', ms: dt });
        if (state.phase === 'done' && prevPhase !== 'done') {
          if (typeof ctx.complete === 'function') ctx.complete('lab-' + state.experimentId, expFor(state).title, calculateResult(state).summary);
          remember(); render();
        } else if (now - lastDraw > 70 && !drag) {
          lastDraw = now;
          const art = container.querySelector('[data-lab-bench]'); if (art) art.innerHTML = benchSVG(state);
          const label = container.querySelector('[data-lab-progress-text]'); if (label) label.textContent = '观察进度 ' + Math.round(state.progress * 100) + '%';
          const meter = container.querySelector('.lab-observation-meter'); if (meter) { meter.setAttribute('aria-valuenow', String(Math.round(state.progress * 100))); const fill = meter.querySelector('i'); if (fill) fill.style.width = state.progress * 100 + '%'; }
        }
      }
      frame = requestFrame(animate);
    }
    container.addEventListener('click', click);
    container.addEventListener('input', input);
    container.addEventListener('change', change);
    container.addEventListener('keydown', keydown);
    container.addEventListener('pointerdown', pointerDown);
    container.addEventListener('pointermove', pointerMove, { passive: false });
    container.addEventListener('pointerup', pointerUp);
    container.addEventListener('pointercancel', pointerUp);
    container.chemLabInstance = { getState: () => clone(state), dispatch, getResult: () => calculateResult(state) };
    render(); frame = requestFrame(animate);
    return function cleanup() {
      if (!alive) return; alive = false; remember(); if (frame != null) cancelFrame(frame);
      container.removeEventListener('click', click); container.removeEventListener('input', input); container.removeEventListener('change', change); container.removeEventListener('keydown', keydown);
      container.removeEventListener('pointerdown', pointerDown); container.removeEventListener('pointermove', pointerMove); container.removeEventListener('pointerup', pointerUp); container.removeEventListener('pointercancel', pointerUp);
      delete container.chemLabInstance;
    };
  }
  const api = { mount, experiments, apparatus, materials, species, createState, reduce, validateSetup, calculateResult, getGuide, duration, portLabel, GAS_ML_PER_MOL, FARADAY };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.ChemLab = api;
})(typeof window !== 'undefined' ? window : globalThis);
