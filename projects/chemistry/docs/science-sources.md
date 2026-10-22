# 化学探索馆：科学依据、模型边界与计算校验

核对日期：2026-10-19。范围：`dist/data.js`、`dist/core.js` 及对应计算测试。

本项目采用公开的学会、标准机构、大学教材和政府科学资料。解释文字、数据组织、界面与交互均为本项目自行编写。没有把实验资料中的真实装置操作、危险物质剂量或操作温度复制进白磷观察场景。

## 1. 数据从哪里来

### 元素与同位素

| 资料 | 用途 | 原始链接 |
| --- | --- | --- |
| IUPAC 周期表说明 | 118 个元素、元素符号、族号、方括号规则 | https://iupac.org/what-we-do/periodic-table-of-elements/ |
| IUPAC 2022 周期表 PDF | 无标准原子量元素的代表核素质量数 | https://iupac.org/wp-content/uploads/2022/07/IUPAC_Periodic_Table-04May22_CRA.pdf |
| CIAAW 2024 标准原子量 | 数值及天然同位素组成引起的范围 | https://ciaaw.org/atomic-weights.htm |
| CIAAW 简明标准原子量 | 区间元素的教学代表值 | https://ciaaw.org/abridged-atomic-weights.htm |
| 中国化学会中文版周期表 | 中文元素名称 | https://www.chemsoc.org.cn/news/international/a2613.html |
| 英国皇家化学会元素资料 | 常见性质与用途；元素卡连接到各元素对应页面 | https://periodic-table.rsc.org/element/8/oxygen |
| 英国皇家化学会磷元素资料 | 白磷、红磷及元素与化合物的区别 | https://periodic-table.rsc.org/element/15/phosphorus |
| NIST 原子量与同位素组成 | 同位素、质量与天然组成的概念 | https://www.nist.gov/pml/atomic-weights-and-isotopic-compositions-relative-atomic-masses |

**版本选择明确记录：**标准原子量依据 CIAAW 当前公开的 2024 表。锆取 91.222，钆取 157.249，镥取 174.96669；区间原子量元素使用简明教学代表值，例如 H 为 1.008、C 为 12.011、O 为 15.999。方括号内的代表质量数明确沿用 IUPAC 2022 周期表，例如 Tc 为 [97]、Lr 为 [262]。不把这组带版本的数据描述成实时更新的核素数据库。

这里的原子量是无量纲的相对量。用于常规教学时，其数值对应以 g/mol 表示的摩尔质量，但不意味着每个碳原子的质量数都是 12.011，也不意味着原子中有小数个中子。方括号中的一个整数是代表核素的质量数，不是天然平均原子量。因此 `molarMass()` 对无标准原子量的元素明确报错；不会把 [97] 偷换成“锝的精确摩尔质量”。

### 反应、计量与溶液

| 资料 | 用途 | 原始链接 |
| --- | --- | --- |
| OpenStax Chemistry 2e 4.2 | 沉淀、中和、氧化还原分类 | https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions |
| OpenStax 4.3 | 反应系数与摩尔比 | https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry |
| OpenStax 4.4 | 限量试剂、理论产量、产率 | https://openstax.org/books/chemistry-2e/pages/4-4-reaction-yields |
| OpenStax 9.2 | 理想气体定律 | https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law |
| OpenStax 11.2 | 强弱电解质与非电解质 | https://openstax.org/books/chemistry-2e/pages/11-2-electrolytes |
| OpenStax 14.2 | pH、水的自电离 | https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh |
| OpenStax 14.3 | 弱酸平衡及乙酸 Ka | https://openstax.org/books/chemistry-2e/pages/14-3-relative-strengths-of-acids-and-bases |
| RSC 催化剂比较 | 过氧化氢分解速率与催化作用 | https://edu.rsc.org/experiments/hydrogen-peroxide-decomposition-using-different-catalysts/831.article |
| RSC 氧气的制取与性质 | 高锰酸钾受热产生氧气 | https://edu.rsc.org/experiments/the-preparation-and-properties-of-oxygen/396.article |
| RSC 金属置换反应 | 铁与硫酸铜等置换关系 | https://edu.rsc.org/experiments/displacement-reactions-between-metals-and-their-salts/720.article |
| ACS 中学化学 6.2 | 乙酸与碳酸氢钠、原料和产物量的联系 | https://www.acs.org/middleschoolchemistry/lessonplans/chapter6/lesson2.html |
| University of Colorado Boulder 教学演示 | 氯化钙与碳酸钠生成沉淀 | https://www.colorado.edu/lab/lecture-demo-manual/general-reactions/s130-chemical-rxns-precipitation-cacl2-na2co3-caco3 |
| RSC 从海水分离盐类 | 过量 CO₂ 与碳酸氢钙的关系 | https://edu.rsc.org/experiments/separating-salts-from-seawater/484.article |

RSC Education 的部分页面在自动访问时返回 405；上述页面的标题和相关教学内容在官方页面搜索摘要中完成交叉核对。周期表、OpenStax、EPA、ACS 等可直接访问的正文也参与核对。链接是给使用者进一步学习的原始出处，不是本项目鼓励照做的真实操作指南。

### 核变化与射线

| 资料 | 用途 | 原始链接 |
| --- | --- | --- |
| OpenStax 21.3 | 核变化规则、半衰期、钴-60 的子核 | https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay |
| OpenStax 附录 M | 碳-14 的 5730 年半衰期等教学数据 | https://openstax.org/books/chemistry-2e/pages/m-half-lives-for-several-radioactive-isotopes |
| US EPA Radiation Basics | α、β、γ、X 射线的性质与产生机制 | https://www.epa.gov/radiation/radiation-basics |
| US EPA Radioactive Decay | 半衰期、子核与衰变链 | https://www.epa.gov/radiation/radioactive-decay |
| US EPA Tritium | 氢-3 约 12.3 年半衰期 | https://www.epa.gov/radiation/radionuclide-basics-tritium |
| US EPA Cobalt-60 | 钴-60 约 5.27 年半衰期，β 与 γ | https://www.epa.gov/radiation/radionuclide-basics-cobalt-60 |
| US EPA Uranium | 铀-238 约 44.7 亿年半衰期 | https://www.epa.gov/radiation/radionuclide-basics-uranium |

## 2. 避免误导的关键设计

1. **元素与单质、化合物分开。**食盐里有钠元素，不代表食盐具有金属钠的性质；牙膏中的氟化物也不是氟气。每张元素卡的用途会说明是在讲单质、合金还是化合物。
2. **周期表的颜色只是教学分类。**`transition-metal` 在界面名称为“d 区金属”，包括第 12 族，不冒充严格的过渡元素定义；类金属的边界并不唯一。镧系和锕系完整抽出显示，不用某一种第 3 族排法装作唯一标准答案。
3. **预测和实测分开。**超重元素的宏观状态不会根据族号简单标为气体或固体。Og 位于第 18 族，不因此标为常温气体。
4. **核素稳定性只按收录记录判断。**本表收录 52 个精选核素（48 个常见稳定核素、4 个放射性示例）。未收录的核组成显示“未收录/未知”，不声称它稳定、存在或会按某一路径衰变。
5. **壳层图是计数示意。**前 20 号元素的中性原子可用简化的 2、8、8、2 分层展示。这个数组不是所有元素和任意离子的普遍电子排布规则，不是电子沿固定圆轨道飞行的照片，也不预测任意高电荷离子是否能存在。
6. **射线按产生机制区分。**α 是氦核；这里主要演示的 β⁻ 是核转变生成的电子，伴随电子反中微子；γ 是核能级跃迁光子；X 射线来自核外电子过程。X 与 γ 的能量区间可以重叠，不能只按“谁能量大”区分。
7. **γ 不改变质量数或质子数。**钴-60 的例子区分先 β⁻ 变成镍-60、后由激发态放出 γ 的过程。质量数守恒不等同于静质量精确不变，核能量变化涉及质量与能量的关系。
8. **半衰期统计原来的母核。**子核不一定稳定，可能继续衰变。曲线不把原子的减少画成物质凭空消失，也不是整条衰变链的剂量预测。
9. **实验目录是有限模型。**未收录的混合不能因为“拖到了同一个杯子里”就由程序编造反应、颜色或产物；配平只能检验原子账本，不能证明某种反应现实中一定发生。
10. **白磷只供封闭虚拟观察。**使用氧气充足时 P₄ + 5O₂ → P₄O₁₀ 的总反应解释氧化；氧不足不是自动得到同一种产物。没有现实取用、点燃条件、配料剂量或自制方法。

## 3. 化学计量引擎的数学约定

### 输入与方程式

`parseFormula(formula)` 返回每个元素的原子个数，支持 `H2O`、`Ca(OH)2`、`K4[Fe(CN)6]` 和 `CuSO4·5H2O`。支持 Unicode 下标输入，结晶水只能用居中点 `·` 分隔，避免将小数点与结晶水符号混淆。

反应系数独立存在反应数据中，因此 `2H2O` 不作为一个中性化学式输入。电荷、物态、反应箭头也不在这个解析器的范围内。它不会跳过不认识的字符继续给结果。

对于第 i 个反应物，系数为 νᵢ，物质的量为 nᵢ：

```text
反应进度 ξ = min(nᵢ / νᵢ)
理论消耗量 = ξ × νᵢ
剩余反应物 = 输入量 − 理论消耗量
第 j 个产物的理论生成量 = ξ × νⱼ
摩尔质量 M = Σ(原子个数 × 元素原子量)
质量 m = n × M
```

所有反应物都必须填写。输入单位为 g 或 mol；质量指纯物质或者溶液中的纯溶质。例如，食醋的总质量不能直接当乙酸质量，五水硫酸铜晶体质量也不能直接当无水 CuSO₄ 溶质质量。二氧化锰催化剂不加入过氧化氢反应的原料计量账本。

### 回收率的明确含义

本引擎选择一个容易审查的假设：指定反应按理论进度完成，然后只收集其中一部分产物。

```text
实际收集量 = 理论生成量 × 假设回收率
未收集产物 = 理论生成量 − 实际收集量
输入总质量 = 剩余反应物 + 收集产物 + 未收集产物
```

因此，回收率 80% 不自动表示原料只反应了 80%，也不把其余 20% 当成消失。真实实验产率可能同时受反应不完全、副反应、平衡及操作损失影响；这个工具不能从一个百分数反推出那些机制。

### 气体体积

采用 `V = nRT/P`，R = 8.31446261815324 kPa·L·mol⁻¹·K⁻¹；输入为摄氏温度，内部加 273.15 变为开尔文。默认 25°C、101.325 kPa。

独立核对值：在 0°C、101.325 kPa 下，理想气体 1 mol 约为 22.41397 L；在 25°C、同样压强下约为 24.46540 L。程序没有不分温压地套用“1 mol 永远 22.4 L”。

输出为干气体的理想体积，忽略水蒸气、气体溶解、泄漏、非理想性和混合物的后续反应。甲烷模型中的水按冷凝分离后的液态记录，不把这部分水算入干气体积；其物态约定写在对应反应备注中。温压参数仅换算另行收集的干气体体积，不重新计算原反应、溶液或其他产物的相态；这不是温压驱动的相平衡模拟。

### 单步反应的边界

| 反应 | 已建模 | 未自动推断 |
| --- | --- | --- |
| 过氧化氢分解 | 原子守恒、催化剂角色、理论氧气数量 | 真实分解速率、催化剂失活、液体过热和喷溅 |
| 高锰酸钾受热 | 学校常用的简化总反应与计量 | 完整固相机理、真实操作温度和加热规程 |
| 酸与碳酸氢盐 | 指定纯溶质的计量和限量关系 | CO₂ 溶解、逸散、食醋其他成分 |
| 石灰水变浑浊 | 初始生成 CaCO₃ 的阶段 | 过量 CO₂ 下继续生成碳酸氢盐的全过程 |
| 沉淀反应 | 主要产物、离子重组与理想计量 | 溶度积、离子活度、络合、晶型变化 |
| 水电解 | 理想净反应，氢氧同温同压体积比 2∶1 | 任意电极或电解质的副反应、电流效率 |
| 铁的氧化 | 指定 Fe₂O₃ 产物的守恒例子 | 把真实铁锈当作纯 Fe₂O₃ |
| 甲烷完全燃烧 | 完全燃烧产物及冷却后的气体计量 | 缺氧时 CO、烟炱等不完全燃烧产物 |

上表说明的是反应计算台的单步计量边界。交互实验室另有两个明确扩展：石灰水实验按理想的两步完全反应展示过量 CO₂ 使沉淀继续转为碳酸氢钙；水电解实验同时受原料量与设定电荷限制。前者不求真实溶解平衡，后者假设惰性电极及 100% 电流效率。过滤、蒸馏属于质量分配模型，指示剂与白磷观察属于定性模型，不把它们强行套进单一步反应计算。

## 4. 电离与 pH 模型

默认 `Kw = 1×10⁻¹⁴`（25°C），乙酸 `Ka = 1.8×10⁻⁵`。使用浓度近似活度；主要面向稀水溶液，不是浓酸、浓碱、混合盐或者缓冲体系的通用计算器。

强一元酸，分析浓度为 C：

```text
[H⁺] = (C + √(C² + 4Kw)) / 2
```

强一元碱用对应的 `[OH⁻]` 关系，并通过 `[H⁺][OH⁻] = Kw` 求氢离子浓度。程序使用数值稳定的 `Math.hypot` 形式。

弱一元酸先由电中性条件求 H：

```text
H = Kw/H + C·Ka/(Ka+H)
电离比例 = Ka/(Ka+H)
pH = −log₁₀(H)
```

方程左侧减右侧严格单调，程序以几何二分求正根。自电离不能省略，否则把 10⁻⁸ mol/L 强酸直接代入 `−log(C)` 会错误得到 pH 8。正确的本模型结果约为 6.9783。

NaCl 与糖水例子在理想条件下都近似中性，但盐溶液中有由溶质产生的可移动离子，糖主要以分子形式存在。**所有盐都中性**和**强电解质溶液一定比任何弱电解质溶液导电更强**都不是本模型的结论。

## 5. 放射性衰变模型

```text
期望剩余母核数量 N(t) = N₀ × 2^(−t/T)
时间步 Δt 内的衰变概率 p = 1 − exp(−ln(2) × Δt/T)
```

T 是半衰期，t 与 T 必须使用同一时间单位。`decayProbability` 以 `expm1` 保留很短时间步下的小概率。曲线给出大量独立原子核的期望，粒子动画可以围绕该期望波动；不能宣称每组小样本经过一个半衰期都会恰好剩下一半。

`decayTransform()` 只执行核子和电荷的代数守恒规则；`isotopeAfterDecay()` 才使用已收录的真实示例模式。后者不信任调用者篡改的 `decayMode` 字段。X 射线不是该函数支持的改变核素身份的衰变类型。

## 6. 自动测试和独立核对值

运行：

```bash
node tests/core.test.cjs
```

截至本次核对，58 个计算与数据测试全部通过。包含：

- 118 元素连续性、唯一性、族周期坐标、方括号规则及源码数据不可变性。
- 化学式嵌套括号、结晶水、Unicode 下标；空输入、非法字符、错误括号、零/负/超大数量的拒绝。
- 14 条反应逐项核对独立原子计数，故意未配平方程式必须拒绝计算。
- 14 条反应 × 6 种投料量 × 3 种回收率，共 252 组质量守恒案例。
- 过量原料、零投料、双限量、极小非零投料、NaN/Infinity/负数/漏项/错单位。
- 气体的温度、压强、绝对零度边界；前 20 个电子数的壳层计数。
- 同位素身份、α/β⁻/γ 核变化、钴-60 先 β 后 γ、半衰期与小时间步概率。
- 水自电离、极稀酸、乙酸平衡、电离率、离子积、未知溶液类型拒绝。
- 在无 `require`/`module` 的浏览器全局环境中直接加载本地脚本。

几个手算基准值写死在测试中，避免只使用引擎自身输出验证自身：

| 条件 | 独立期望 |
| --- | --- |
| H₂O 摩尔质量 | 18.015 g/mol |
| Ca(OH)₂ 摩尔质量 | 74.092 g/mol |
| CuSO₄·5H₂O 摩尔质量 | 249.677 g/mol |
| 68.028 g 纯 H₂O₂ 理论分解 | 31.998 g O₂、36.030 g H₂O |
| 1 mol KMnO₄ 的理想分解模型 | 0.5 mol O₂ |
| 3 mol H₂ + 1 mol O₂ | 2 mol H₂O，剩 1 mol H₂ |
| 100 个母核，经过 0/1/2/3 个半衰期 | 期望 100 / 50 / 25 / 12.5 个母核 |
| 0.1 mol/L 乙酸 | pH 约 2.8753，电离约 1.33% |

测试通过表明这些已定义模型和已检查边界符合预期，不能当作任意真实实验、全体核素、所有设备或所有浏览器都不存在问题的保证。界面、连接装置、模式切换和端到端交互由项目其余测试另行覆盖。

另有 `tests/cross-module.test.cjs` 保留了 12 个实验的跨模块科学核对：13 个测试用例涵盖 33 个针对性场景、330 项数值断言，检查共用摩尔质量、反应物余量、产物质量、干气体体积、两步石灰水、电荷限制电解以及分离模型的质量分配。这里的场景数和断言数是覆盖范围，不能与上面的 58 个核心测试简单混称为同一类测试数量。
