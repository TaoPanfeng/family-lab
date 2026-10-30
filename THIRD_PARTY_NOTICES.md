# 源码与许可清单

原有五馆许可保留；新四馆与公共学习组件使用 MIT，不统一改写子项目许可。

| 路径 | 原许可 | 原始说明 |
| --- | --- | --- |
| `projects/astronomy` | AGPL-3.0-or-later | `LICENSE`、`licenses/THIRD-PARTY-NOTICES.md`、`docs/SOURCES.md` |
| `projects/physics` | MIT | `LICENSE`、`docs/资料来源.md` |
| `projects/chemistry` | MIT | `LICENSE`、`docs/science-sources.md` |
| `projects/history` | MIT | `LICENSE`、`docs/THIRD-PARTY-NOTICES.md` |
| `projects/posture` | MIT | `LICENSE`、`README.md` |

所有许可、引用与原有源码均随包保留。首页的“源码与许可”页面提供当前副本内的源码索引。自然地理数据、Three.js、星历衍生材料和仅用于测试的依赖，仍按各自原始说明处理；本合集不宣称将它们重新授权为 MIT。

## 新四馆与共享组件

`projects/biology`、`projects/geography`、`projects/cosmos`、`projects/martial`、`shared/` 和新首页代码采用 MIT。各馆 `data.js` 列出科学资料引用；引用不等于获取来源网站全部素材的再授权。

- 地理、宇宙、武术使用原仓库 `projects/astronomy/vendor/three.r140.min.js`，Three.js MIT 许可见 `projects/astronomy/licenses/THIRD-PARTY-NOTICES.md`，不加载 astronomy 业务源码。
- 地理与宇宙使用 `projects/history/data/land.js` 中的 Natural Earth 公共领域海岸几何，来源说明保留在历史馆 `docs/THIRD-PARTY-NOTICES.md`。
- 不包含 BioDigital 商业人体模型、Stellarium 引擎或 CMU 动捕数据。武术所有动作是原创程序化关键帧，不得标成名家示范或真实运动测量。

## 2026-10-23 视觉整改补充

- `projects/geography/countries.js` 新增 177 个国家／地区的离线简化几何，来自环境内 pyogrio 测试夹具所附的 Natural Earth lowres 数据，经坐标小数位简化及中文名称整理。原始快照的发布日期无法确认，不能当作实时或权威边界。Natural Earth 数据为公共领域，政策见 https://www.naturalearthdata.com/about/terms-of-use/ 。
- `projects/geography/terrain.js` 的山脉轴线为原创教学概化，半透明带宽不是测绘范围；峰高参考逐项给出资料年代，不能称全国最高峰完整排名。
- 光学、细胞动画、肺部示意、手部几何与软件备用渲染代码均为原创。参考 OpenStax 的科学关系，不复制其插图、商业模型、教材段落或其他网站程序。
- 更新后的地理球体由原创正射投影绘制，不再依赖 WebGL 地球引擎；宇宙和武术仍使用原附 Three.js。

## 数学馆
数学卡片、例题、SVG图形、模型和证明说明由本项目编写，采用本馆MIT许可。参考教育部课程标准、MIT公开课程的知识组织，以及Mathigon/Polypad、Math Learning Center、GeoGebra的操作设计思想；没有复制其受限教材正文、软件或素材。OpenStax只参考公开课程结构，未将其正文或图像打包。参考链接见数学馆来源区。

## 教学整改：公式与连续人体（2026-10-26）
- KaTeX 0.16.25，MIT。`shared/vendor/katex/katex.min.js` 与 `LICENSE` 随仓库提供。仅输出原生 MathML，未打包字体文件，不使用运行时 CDN。上游：https://github.com/KaTeX/KaTeX 。`shared/formula.js` 为本项目的受限文本适配层，`trust:false`。
- MakeHuman 官方图形数据，固定提交 a8bc2d54ff0ac92e78ff71431b1023eda42bf482，CC0-1.0。连续人体为原数据改编，许可、来源与改编边界见 `projects/martial/HUMAN_ASSET.md`。MakeHuman 程序本身为 AGPL，本次没有导入其程序逻辑。
- 化学过程、显微样本、呼吸图与数学专属交互均为本项目原创示意，不是 RSC、NHLBI、OpenStax 的原插图，不冒充实验实拍或显微照片。机制资料在各页列出；不复制受限课程。

## 语文笔顺与诗文
- `projects/chinese/vendor/hanzi-writer.min.js`：Hanzi Writer 3.7.3，MIT，作者 David Chanin；库许可证单列在 `HANZI_WRITER_LICENSE.txt`。官方 https://hanziwriter.org/ ，源码 https://github.com/chanind/hanzi-writer ，版本提交 `7cff0a3897f160840182c29577d965707cddb77d`。
- `projects/chinese/stroke-data.js`：选取102字的原笔画路径及中线，由 JSON 包装为离线 JS；源自 Hanzi Writer Data / Make Me a Hanzi，数据提交 `68d10a4b21150cae5e1ebbd223eed289cf32d90c`，遵守 Arphic Public License（完整文本在 `projects/chinese/vendor/ARPHICPL.TXT`）；不要把这部分统称 MIT。SHA256和源版本见同目录manifest。未打包或分发系统字体。
- 古诗选录古代公版作品，按条目标作者、篇名、出处链接；名句白话说明及教学文字为原创，不复制现代教材解释。字源引用香港中文大学汉语多功能字库的释义并原创简述。
