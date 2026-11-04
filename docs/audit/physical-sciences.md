# 物理、化学审查记录

日期：2026-11-04。范围：`projects/physics/`（原16实验、光学）与 `projects/chemistry/`（主馆、实验剧场）。本报告初始清单先于本组源码修改建立；源码和确定性DOM检查不能代替真实屏幕、可信触摸、file/HTTP或线上验收。

## 初始发现与实施清单

|编号|优先级|位置、复现与影响|计划最小改动|初始状态|
|---|---|---|---|---|
|PC01|P2|`chemistry/dist/app.js:178–184`：进入我的实验记录，仅能导出Markdown；原机清空后无导入入口，跨设备不能恢复学习足迹与笔记。|保留阅读导出，增加版本化JSON备份/严格校验/按编号合并；坏文件不改变当前记录。|已证实，待修|
|PC02|P2|`chemistry/dist/explore.js:217`、`dist/lab.js:776–806`、`experiments/app.js:47`：开始衰变/实验/剧场后隐藏页面，衰变定时器继续；剧场隐藏时不推进但playing仍true，回来会自行继续。|隐藏与pagehide持久暂停，回来由用户明确继续；卸载移除监听。|源码路径已证实，待行为回归|
|PC03|P2|`chemistry/experiments/app.js:24,34–36`：氧气实验拖到收集阶段再关闭气体示踪，蓝色“气体”填充仍存在；铁铜起点有移动电子，Fe标签在反应后仍是Fe。|让示踪开关控制氧气填色；起点不传电子，反应时铁/铜离子同时变化；补模型标签避免把电子流视作单条真实轨迹。|已证实，待修|
|PC04|P2|`physics/src/app.js:31–34`：点数字输入框清空并触发change；显示空白但模型用旧参数，因syncControls跳过焦点输入而未恢复。|提交无效值时恢复实际参数并给反馈；新增聚焦输入DOM行为回归。|已证实，待修|

## G01–G16 初始核验矩阵

“Pass（源码/数值）”仅指所列范围，浏览器可视/设备结果另列；未把既有测试数量视为教学完整性的证明。

|项|物理（16实验+光学）|化学（主馆+实验剧场）|证据/待验|
|---|---|---|---|
|G01|Pass（源码）|Pass（源码）|catalog任务先猜再改单变量；optics介绍/try；lab getGuide逐步器材；剧场问题+当前阶段说明。|
|G02|Pass（内容结构）|Pass（内容结构）|物理每实验mission/base+公式步骤和边界；光学单缝/相干/不相干；化学12场景+6种阶段教学；非穷尽真实课程。|
|G03|Pass（源码），焦点未验证|Pass（源码），焦点未验证|物理renderLibrary空结果；化学periodic组合筛选和无匹配；真正键盘焦点流待云端。|
|G04|问题PC03、PC04|问题PC03|参数-读数-图形模型均有显式状态，仍须实际画面逐控件验收。|
|G05|Pass（源码/既有数值），待DOM补验|问题PC02|物理visibilitychange调用pause；化学剧场seek暂停，主馆计时后台未暂停。|
|G06|Pass（所查数值），图形待验|问题PC03，配平表待独立数值验算|物理P.solve的SI换算、力/功/压强/光学归一化；化学parseFormula/validateReaction、半反应同步标签。|
|G07|Pass（参数域源码），PC04输入反馈|Pass（参数校验源码），备份PC01|物理clamp/strict；化学正数配平与零投料拒绝虚构生成物。|
|G08|未验证|未验证|320/390/768真布局交给根代理，不把CSS媒体查询当作实测。|
|G09|未验证|未验证|物理仅jet/pressure/lever操作canvas触摸限制；化学bench指针取消；可信触摸交给根代理。|
|G10|部分Pass（名称/状态源码）；焦点未验证|部分Pass（原生按钮/标签）；焦点未验证|原生range、select、button，旧物理tab箭头；屏幕阅读器/可见焦点需真实浏览器。|
|G11|Pass（旧馆后台暂停源码），光学共享待根代理核验|问题PC02|无声音；默认暂停；减少动态效果可通过暂停+逐阶段回看，但真实系统设置未验。|
|G12|Pass（模型校验/合并），真实存储未验|问题PC01|物理validateBackup/mergeNotes；光学表格明确仅页内记录；化学只有Markdown导出。|
|G13|Pass（来源/边界源码）|Pass（来源/边界源码）|原创画面、非实测、理想化/危险内容屏幕限定均声明；仅抽查相关官方来源。|
|G14|未验证真实file/HTTP/live|未验证真实file/HTTP/live|本地引用无运行时CDN；不启动服务或浏览器，交根代理集成验收。|
|G15|进行中|进行中|已检索PhET、OpenStax与W3C，下面记录吸收与修复映射。|
|G16|未验证|未验证|完成自测后请求跨组独立复核。|

## 官方/原作者参考与适用理由

1. PhET官方：https://phet.colorado.edu/en/about ，本轮读取2026-11-04。借鉴多种表征同步、即时反馈、让不可见过程可理解的原则。实际拟用：PC03粒子、物质标签和开关一致；不会复制PhET代码、美术或引入CDN。适用于本馆已有宏观/粒子/反应式三层展示。
2. OpenStax Chemistry 2e §4.1：https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations ，本轮读取2026-11-04。借鉴元素原子数按“系数×下标”计数，配平只能改系数。实际用：保留现有只改系数交互，追加从化学式独立解析的剧场反应/电荷核验，避免仅比较手写左右数字就宣布配平。
3. W3C WAI Understanding 2.2.2：https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html ，本轮读取2026-11-04。借鉴用户应可暂停变化并在原时刻继续。实际拟用：PC02后台永久暂停，取消自动续播。后台暂停是本项目约定，不把它声称为WCAG本条逐字要求，也不以此宣称全站无障碍合规。

## 验证与交付状态

以上是修改前快照。最终源码修复、回归和独立复核状态以下文为准。

## 本轮实际修复结果

PC01–PC04均已修复源码并有行为回归，尚待根代理生成离线成品与真实浏览器验收。

|编号|最终位置与改动|验证及实际结果|
|---|---|---|
|PC01|`projects/chemistry/dist/app.js`：保留原Markdown导出；新增JSON导出、导入按钮和原生文件选择。支持旧本机无kind笔记；版本/条数/编号/正文/日期全文件校验后再合并。相同编号保留本机笔记与已掌握项目，超上限整次拒绝；不改变当前模式。|`projects/chemistry/tests/audit.test.cjs`：真实DOM导出→修改备份→导入；旧笔记未覆盖、新笔记/足迹加入、重复导入无重复、坏JSON/版本/日期/正文/重复编号原记录均不变。下载对话框与跨设备实际迁移待浏览器。|
|PC02|`chemistry/dist/explore.js`：衰变隐藏/pagehide停止计时且aria-pressed同步。`dist/lab.js`：隐藏/pagehide/卸载均暂停，卸载移除监听。`experiments/app.js`：后台与pagehide调用pause，返回后明确播放才继续。|确定性时钟先实际播放再切hidden/pagehide，前后进度完全相同；返回后仍不推进，点击继续后再次前进。现有“离开路由自动继续”的用例保留并改成新行为断言，明确该需求改变。|
|PC03|`chemistry/experiments/app.js`、`model.js`、`index.html`：氧气示踪着色随开关关闭并标注不是真实颜色；统一开关名为示踪粒子与气体着色。铁起点先在液面上，接触完成后才出现铜和电子流；Fe→Fe²⁺与Cu²⁺→Cu标签同时变，停止阶段不画流动电子；说明两个半反应同时发生且点不是实际电子轨迹。|DOM检查实际SVG颜色、物质标签与粒子；模型检查接触前进度0、末态1。新增从实际显示TeX解析物种/系数/下标/电荷，独立于手写left/right表核验全部10条反应守恒。可视相邻帧仍待根代理。|
|PC04|`physics/src/app.js:setParam`：无效数字提交后强制恢复实际模型值；已在边界时再次提交越界数也归一显示，避免控件与读数不同步。|`physics/tests/audit.test.cjs`运行实际应用脚本+原始HTML：令输入框保持焦点，提交空白、非法字符、上限100、下限-1，输入显示、模型参数、速度读数一致；有效5m输入仍正常。|
|PC05（后续独立审查发现，P1防御）|`chemistry/dist/app.js:43,47`原逻辑：预置坏JSON或未来版本数据后刷新，再切学习模式/保存会把原key写成默认空记录。现加入读取失败保护，后续自动保存/导入只暂存本页，不覆写原raw；显式确认“清空本机记录”后才允许重建。正常旧数据不迁移、不另建key。|新增DOM用例分别预置坏JSON与version99，切模式、保存新笔记、导入、导出后原key字节不变；本次暂存笔记可完整导出。提示明确原数据未自动覆盖与本次需导出。|

新增内容仅为恢复已有学习记录、澄清已有气体/电子示意、让交互状态一致；没有额外引入教学栏目、外部依赖或许可不明素材。

## 修复后的G01–G16状态

|项|物理馆|化学馆|最终证据与限制|
|---|---|---|---|
|G01|Pass（源码）|Pass（源码）|本轮保留主问题、先猜、任务步骤/当前阶段；儿童实际首次使用观察未做。|
|G02|Pass（内容结构）|Pass（内容结构）|针对性任务、不同条件与边界存在；未宣称每个实验都是完整课程。|
|G03|Pass（筛选源码）；焦点待GUI|Pass（筛选源码）；焦点待GUI|保留检索/分类/空结果；浏览器焦点与手机退出由集成验收。|
|G04|Pass（PC04真实应用DOM）|Pass（PC03真实应用DOM）|画面实际像素和原生触摸待GUI。|
|G05|Pass（模型/暂停源码）|Pass（播放/暂停/seek/reset DOM）|确认后台/离开不自动续播；原生滑条和相邻帧可视验收待根代理。|
|G06|Pass（本轮独立核对数值）|Pass（TeX物种原子/电荷及计算模型）|物理52旧数值、光学解析回归；化学全10式独立计数。不是教学完整正确性认证。|
|G07|Pass（默认/端点及无效输入DOM）|Pass（输入/零投料/备份校验）|未穷举所有参数同时极值组合，保留理想模型边界。|
|G08|未验证|未验证|320/390/768布局须真实浏览器，未用DOM或媒体查询冒充。|
|G09|未验证|未验证|可信触摸、滚动退出、原生缩放须根代理验收。|
|G10|部分Pass（原生控件+标签源码）|部分Pass（原生控件+aria状态DOM）|屏幕阅读器、原生Tab/focus-visible和文件对话框待GUI。|
|G11|旧馆Pass（后台暂停源码）；光学共享交根代理|Pass（后台与pagehide DOM）|默认暂停，无自动声音；减少动态设置下可用手动时间/阶段控件，真实系统设置未验。|
|G12|Pass（模型校验/合并）；真实持久化待GUI|Pass（JSON合并、坏文件非破坏与坏本机raw保护DOM）|未实际跨设备迁移；光学读数表明确页内暂存，不承诺自动保存。|
|G13|Pass（本轮抽查来源与边界）|Pass（本轮抽查来源与边界）|原LICENSE和来源不变；危险内容只作屏幕演示，无操作配方。|
|G14|未验证真实file/HTTP/live|未验证真实file/HTTP/live|本组未构建生成成品、未创建服务器、未启动浏览器。|
|G15|Pass|Pass|PhET→表征与反馈；OpenStax→从显示公式独立计数；W3C→可控制变化并保持暂停，见上方具体映射。|
|G16|Pass（人文组独立复核）|Pass（人文组独立复核）|人文组只读复核PC01–PC05并独立运行新增化学8+物理1共9项全部通过，未见确定回归；其暂存导入提示建议已吸收。|

## 回归结果

最终本组命令执行成功，合计305项通过、0失败：化学主馆原223项+新增8项，物理原52项+新增1项，以及共享教学/光学模型21项。命令：

```bash
node --test --test-reporter=dot projects/chemistry/tests/audit.test.cjs projects/chemistry/tests/core.test.cjs projects/chemistry/tests/app.test.cjs projects/chemistry/tests/explore.test.cjs projects/chemistry/tests/lab.test.cjs projects/chemistry/tests/integration.test.cjs projects/chemistry/tests/cross-module.test.cjs projects/physics/tests/physics.test.cjs projects/physics/tests/audit.test.cjs tests/learning-models.test.cjs tests/refactor-models.test.cjs
```

本组未运行会改写生成成品/测试报告的`chemistry/tests/run-report.cjs`；交根代理构建后运行全量离线、全馆与GUI测试。`git diff --check`本组文件通过。最后仅新增暂存导入提示文案，不改变模型/持久化行为。

## 人文组只读交叉复核

- 已审历史JSON的严格校验、两份手记完整合并与总长拒绝、选定模式/年份保持；历史重绘焦点、答题反馈焦点；词语零结果隐藏旧正文、草稿保留、在当前筛选内换题。未见确定回归。
- 独立发现历史/词语异常本机raw可被自动覆写，及词语/字卡隐藏file input不可键盘到达，已告知人文组；对方已加入保护与透明可聚焦原生input。只读复核其新版CSS覆写生效顺序、focus-within可见焦点合理。
- 独立运行`node --test projects/history/tests/humanities-ui.test.cjs`，当时23项全通过（包含异常存储原raw保护）；之后人文组新增的2项文件焦点回归由其作者报告通过，本组尚未重跑该后续版本。
- 以上均是源码/DOM证据，不代替根代理原生Tab、file/HTTP/线上及可信触摸验收。

## 保留建议与未验证

1. P3建议：化学主馆首次进入“我的实验记录”时，未来可加入一份简短备份示例帮助理解Markdown阅读与JSON恢复的差别；本轮按钮和现有说明已可直接操作，不扩建流程。
2. P3建议：光学菲索表格仍是页内记录，现文案要求保存手记与导出，未来可明确加入单次数据CSV；不算本轮已完成。
3. 真机Safari/Windows双击、下载对话框、触摸手势、320/390/768布局、系统减少动态、屏幕阅读器、WebGL、公开上线地址均未由本组验证，由根代理统一执行并在总报告标清范围。

## 最终补查：旧物理馆异常本机记录（2026-11-04）

- 旧物理馆确有学习记录，key为`guanwu.physics.v1`。`src/app.js:9`读取JSON、版本或场景验证失败后把`storage`设为false；`persist()`的延时回调先检查该标志；`pagehide`写回也以该标志为条件。后续代码没有把该标志自动恢复为true的路径，因此已具有持久的读失败写保护，无需重复加入另一把锁。
- 独立新增3项回归：分别预置坏JSON和version99，在启动、切学习模式、改参数、拖时间、导入新记录和pagehide后比对原raw字节不变；新增记录仍能从可见“导出全部备份”按钮导出。另核验合法旧version1记录沿用原key并仍可保存，不迁移或新增记录key。
- 原有“仅本次暂存”状态、顶部警告和导出提示均保留。本次补查仅增强`projects/physics/tests/audit.test.cjs`，没有改应用源码或生成成品。
- 执行`node --test projects/physics/tests/audit.test.cjs`，现4项全部通过；上方305项是补查前完整组合结果，新增3项单独回归通过，不冒称本次重跑了完整308项组合。
