# 第三方材料、来源与许可

本项目自有代码、交付物及重建脚本按 **AGPL-3.0-or-later** 提供，见根目录 `LICENSE`。第三方材料保留原许可，不表示任何上游作者对本项目作出认可或精度保证。

## Three.js r140

- `vendor/three.r140.min.js`；MIT，完整文本为 `licenses/THREE-MIT.txt`。
- 原始版权：Copyright © 2010–2022 three.js authors；文件头原样保留。
- 上游源码：<https://github.com/mrdoob/three.js/tree/r140>。
- 当前交付明确固定 r140，并不声称这是最新版本。本次取得的未修改浏览器包来自构建环境中 trimesh 所附 WebGL viewer 模板；仅提取了 Three.js 库，不包含 trimesh 的查看器业务代码。

## 星历生成来源

- 使用 `pyswisseph 2.10.3.2` 调用 **Swiss Ephemeris 2.10.03 的内置 Moshier 模型**；`FLG_MOSEPH` 被显式设置并逐次检查。
- 原作者与版权方：Swiss Ephemeris © Astrodienst AG，作者 Dieter Koch、Alois Treindl；Python 绑定 `pyswisseph 2.10.3.2` 的包元数据署名为 Stanislas Marquis；具体版权与完整源码见相应上游项目。
- 官方说明：<https://www.astro.com/swisseph/swephinfo_e.htm>。
- 源码：<https://github.com/aloistr/swisseph>；Python 绑定：<https://github.com/astrorigin/pyswisseph>。
- 上游采用 AGPL / 专业许可的双许可方案。本项目选择开放的 AGPL 交付路线，提供完整自有源码、生成器、元数据与测试。
- **本包不附带 pyswisseph 二进制、Swiss 二进制库、商业星历、JPL DE431/DE441 表或 Astrodienst 下载星历文件。** `data/ephemeris.f32` 是生成器从内置模型计算并拟合的日月数值系数；网页运行不调用 Python。
- 重建这些数值需要自行安装上游依赖并遵守其许可。AGPL 完整文本见根目录 `LICENSE`。这不是“闭源商业许可已经包含”的承诺。

## Natural Earth

- `data/coastlines.geojson` 为公共领域底图的简化几何；参见 `licenses/NATURAL-EARTH.txt`。
- 地貌颜色、云纹及月面陨坑为程序化示意，不使用未授权摄影作品。

## NASA 独立核对样本

- `tests/nasa-reference.json` 中五个事件的日期、类型与参考时刻用于独立对照，而不是运行时星历来源。
- 按来源要求署名：**Eclipse Predictions by Fred Espenak, NASA's GSFC**。
- 每条数据都附原始 NASA 页面 URL。NASA 没有测试、认可或为本软件背书。

## 分发与修改

自有源码和所需构建资源均随 ZIP 提供。`node tools/build.cjs` 可重建单 HTML，无 npm 依赖。若再发布修改版或开放在线服务，请阅读 AGPL 的完整条款并履行适用的源码提供义务。拟闭源使用时，需要重新审查上游许可或替换相关计算来源；不应默认把此包当作宽松 MIT 商用授权。
