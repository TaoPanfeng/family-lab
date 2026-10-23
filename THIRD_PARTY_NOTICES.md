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
