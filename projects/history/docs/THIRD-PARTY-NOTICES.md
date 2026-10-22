# 第三方材料说明

## Natural Earth 自然地理数据

- 文件：`data/land.js`
- 原始数据：Natural Earth, `ne_110m_land.geojson`
- 数据地址：https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
- 仓库：https://github.com/nvkelso/natural-earth-vector
- 使用说明：https://www.naturalearthdata.com/about/terms-of-use/
- 授权：Public Domain，公有领域。
- 下载日期：2026-10-19。
- 项目处理：保留 GeoJSON 数据，将其包为 JavaScript 全局对象，以便直接双击网页也能离线读取；显示时将经纬度转为 SVG 路径。
- 此数据只提供自然陆地形状，不包含本项目历史色块，也不为手绘历史地图的准确性背书。

## 历史资料

人物、朝代、事件与世界参照的来源分别列在数据项、界面的资料入口以及 `sources-*-notes.md` 中。

中文教学摘要重新组织事实、因果与阅读问题，没有打包外部网页全文、影视、地图图片或帝王肖像。古籍原典与现代资料的授权各不相同，点击外链后的再使用应遵循原站规定。机构名称和来源链接不是机构对本项目的认可。

## 开发测试依赖

`jsdom@26.1.0` 及其依赖仅在开发测试时安装。版本与完整性记录见 `package-lock.json`；其许可证按上游项目各自声明执行。ZIP 不包含 `node_modules`，普通页面运行不使用这些库。

程序没有运行时 CDN、外部字体、统计埋点或后端 API。
