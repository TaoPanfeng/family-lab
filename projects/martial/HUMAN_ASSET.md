# 连续人物模型的来源、许可与处理

本馆 `assets/human.js` 的几何来自 MakeHuman 官方分发的 **CC0 1.0 Universal 图形资产**，不是某位真人的扫描，也不是名家动作采集。MakeHuman 程序代码另为 AGPL；本项目未复用其程序逻辑。

- 上游：https://github.com/makehumancommunity/makehuman
- 固定提交：`a8bc2d54ff0ac92e78ff71431b1023eda42bf482`
- 数据：`makehuman/data/3dobjs/base.obj`、`makehuman/data/rigs/default.mhskel`、`makehuman/data/rigs/default_weights.mhw`
- 原数据署名包括 MakeHuman Team、Data Collection AB、Joel Palmius、Jonas Hauquier；各文件的原始署名和 CC0 声明保留在固定上游。
- 许可原文：本目录 `assets/MAKEHUMAN_CC0.md`；上游 `LICENSE.md` 明确区分程序与图形资产。

`tools/build-human.py` 校验原始 Git blob 哈希，只保留人体表面，排除辅助几何；简化为13段权重、保留最多4个权重，衣着区域不显示不必要的解剖细节，手部由本项目原有的关节手模型接续。当前连续网格为10238顶点、20428三角形。顶点色是衣着示意，不是布料仿真。

`human.js` 是原创粗骨架重定向。面部和关节外观改善不意味着动作经专家认证。肘肩等处会有蒙皮近似；不用于医学、运动处方、真实力矩或内劲测量。

复现：下载上述固定提交的三份图形数据到一个目录，运行 `python tools/build-human.py /path/to/reference`。普通使用无需此步骤，也无需联网；生成数据随网站与离线仓库提供。
