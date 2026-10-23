# 万物 · 家庭探索馆

**一个首页，十个独立空间；每个项目只保留当前代码。**

在线入口：https://taopanfeng.github.io/family-lab/

> 本交付包含尚未推送的视觉整改与两项光学实验。线上地址仍以实际部署结果为准；本轮范围、测试及限制见 [整改记录](docs/QUALITY_REFACTOR.md)。

## 本地使用

```bash
git clone https://github.com/TaoPanfeng/family-lab.git
cd family-lab
```

双击根目录 `index.html`，或 Windows 下运行 `打开首页.cmd`。所有模型、脚本和地图随仓库提供，日常使用不需要 npm、Python、后端或网络；点击外部参考资料才需要联网。

| 馆 | 路径 | 入口 |
| --- | --- | --- |
| 日月地 | projects/astronomy | 日月地实验室.html |
| 物理 | projects/physics | index.html |
| 化学 | projects/chemistry | chemistry-explorer.html |
| 历史 | projects/history | index.html |
| 坐卧 | projects/posture | index.html |
| 生物 | projects/biology | index.html |
| 地理 | projects/geography | index.html |
| 宇宙 | projects/cosmos | index.html |
| 武术 | projects/martial | index.html |

原有五馆的核心实验保留，物理馆侧栏新增双缝干涉与菲索齿轮实验入口。四个新馆共31个主题，可切换儿童/进阶、调参数、慢放、暂停、单步、拖动时间条，收藏问题和导出观察笔记。

内容范围、来源与模型边界见 [docs/EXPANSION.md](docs/EXPANSION.md)。尤其：地理为精选资料不是全国完整实时名录；人体是机制图解不是完整三维解剖库；武术是程序化教学片段，不是名家动捕、完整拳谱或发力测量。参考的商业产品没有被直接搬入本仓库。

## 后续更新

```text
读取最新代码 → 修改源码与测试 → 对应需求的中文提交
→ 构建及新旧馆回归 → 自动同步离线成品 → Pages部署 → 在线核验
```

例如：`feat(biology): 增加心肺循环的氧气追踪与对照实验`。构建提交会关联功能提交。测试和 `sync-offline` 通过后，本地执行：

```bash
git pull --ff-only
```

Windows 也可运行 `更新.cmd`。遇到本地未提交改动会停止，不自动 stash、reset、强推或丢弃文件。ZIP解压目录不等于Git克隆。

## 开发与验证

使用 Node.js 22.17+（推荐24）；普通使用无须构建。修改可读源码，不只修改打包HTML。

```bash
npm run build
npm --prefix projects/history ci --ignore-scripts --no-audit --no-fund
npm test
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/browser-smoke.py
python tests/expansion-browser.py --file --require-webgl
python tools/prepare-site.py
python tests/site-smoke.py
python tests/expansion-browser.py --site --require-webgl
python tests/quality-browser.py --file --require-webgl
python tests/quality-browser.py --site --require-webgl
```

浏览器脚本可用 `--browser` 指定已安装的 Chrome/Chromium。`--inject` 仅用于受限环境的内容测试，不能代替真实 file://、HTTP 和 WebGL。云端复用 Ubuntu24.04 的 Chrome；当前运行证据见 Actions 的 `browser-test-results`，不是旧项目自带的历史报告。Windows真机需要单独验证。

`catalog.json` 管入口；`portal/` 管首页；`projects/` 保存独立项目；`shared/` 是新四馆的学习与绘图组件。旧馆不被注入公共菜单或 iframe。`source.html` 索引当前版本源码和许可。

## 发布、安全与记录

`.github/workflows/pages.yml` 对 PR 只测试，对 main 在测试通过后同步成品并发布。不会将旧构建覆盖较新的 main，也不会改变仓库可见性或计费。

Pages 首次配置由所有者在 Settings → Pages → Source 选择 GitHub Actions；不需要再套 Jekyll 或 Static HTML 模板。网站已配置后，每次成功发布沿用同一地址。只有部署结果与访问核验成功才能说新版本已上线。

笔记只保存在当前浏览器和地址中，线上/本地不会自动互通。移动文件、换浏览器或清理数据前导出备份；新馆不修改旧馆学习记录。不得上传私人记录、密码、令牌或密钥。

实验是科普，不是诊疗、训练处方、导航或危险实物实验指南。日月地保留 AGPL-3.0-or-later；其余项目及第三方依赖按自身许可。详情见 `THIRD_PARTY_NOTICES.md`，不能把全部素材统称MIT。

历史记录：`docs/IMPORT_STATUS.md`、`docs/INTEGRATION_REPORT.md`。本次扩展范围：`docs/EXPANSION.md`。


## 数学与体验更新

数学馆：小学低年级15个节点、小学中高年级20个、初中22个、高中24个、大学基础与进阶44个，共125个核心知识节点。节点有儿童解释、数学语言、3步例题、身边与工作用途、前置知识。44个原创可复用定量实验并非125套独立课程；实分析、拓扑2个节点明确为概念阅读。23个重点结果各给两条论证路线，并保留成立条件。

入口：`projects/math/index.html`。分数点选、二进制位开关、矩阵预设、随机样本、积分加密分割都可操作；笔记与其他馆分开存储、支持备份导入导出。地图覆盖核心课程结构，不声称穷尽所有教材和大学专业。

武术人物新增练功服、素模、骨架切换及接缝细节；仍是关节驱动教学模型，不是名家动捕、医学解剖或力量测量。共享二维场景新增真实缩放、拖移与复位，修复跳到正文时误换主题。

验收方法和覆盖边界见 `docs/MATH_AND_EXPERIENCE.md`。页面数量和测试数量不能替代科学内容审核与孩子的实际理解。
