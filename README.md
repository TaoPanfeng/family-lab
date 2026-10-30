# 万物 · 家庭探索馆

**一个首页，十四个独立空间；每个项目只保留当前代码。**

在线入口：https://taopanfeng.github.io/family-lab/

代码入库不等于网站发布完成。实际版本、测试截图与线上验收以 GitHub Actions 中对应提交的成功运行记录为准。

## 直接使用

打开上面的 GitHub Pages 地址即可；不用下载 ZIP、安装依赖或启动服务。源码和离线副本也可以通过 Git 获取：

```bash
git clone https://github.com/TaoPanfeng/family-lab.git
cd family-lab
```

双击根目录 `index.html`，或 Windows 下运行 `打开首页.cmd`。模型、脚本和地图随仓库提供，日常使用不需要 npm、Python、后端或外网；点击外部参考资料才需要联网。

| 馆 | 入口文件 |
| --- | --- |
| 日月地 | `projects/astronomy/日月地实验室.html` |
| 物理 | `projects/physics/index.html` |
| 化学 | `projects/chemistry/chemistry-explorer.html` |
| 历史 | `projects/history/index.html` |
| 坐卧 | `projects/posture/index.html` |
| 生物 | `projects/biology/index.html` |
| 地理 | `projects/geography/index.html` |
| 宇宙 | `projects/cosmos/index.html` |
| 武术 | `projects/martial/index.html` |
| 数学 | `projects/math/index.html` |
| 语文 | `projects/chinese/index.html` |

原有五馆的核心实验保留；物理侧栏另有双缝干涉与菲索齿轮实验。生物、地理、宇宙、武术共31个主题，可切换儿童/进阶、调参数、慢放、暂停、逐帧与拖动时间条，收藏问题和导出观察笔记。

## 数学与人物体验

数学馆覆盖小学低年级15个核心节点、小学中高年级20个、初中22个、高中24个、大学公共基础与进阶44个，共125个节点。提供儿童解释、数学语言、分步例题、身边与工作用途、前置知识和路线图。

44类原创可复用参数实验并非125套独立完整课程；实分析和拓扑两个节点明确为概念阅读。23个重点结果各有两条论证路线，并写明成立条件。看过、练过不等于已经掌握。参考课程标准与公开课程结构，不冒称逐页对应所有地区教材或穷尽大学专业数学。

分数点选、二进制位开关、矩阵预设、随机样本和积分加密分割都可操作。数学笔记与其他馆分开存储，支持备份导入导出。

武术人物支持练功服、素模、骨架及局部观察；手心手背、手指与关节方向可辨。仍是程序化教学模型，不是名家动捕、专家审定拳谱、医学解剖或力量测量。共享二维场景支持缩放、拖移与复位。

资料和边界见 [扩展说明](docs/EXPANSION.md)、[视觉整改](docs/QUALITY_REFACTOR.md)、[数学与全站体验](docs/MATH_AND_EXPERIENCE.md)。地理是精选资料和近似示意，不是完整实时名录或权威导航；人体是机制图解，不是完整三维解剖库。参考产品的受限课程和商业模型没有被直接复制。

## 更新与交付

```text
读取最新代码 → 修改源码和测试 → 对应需求的中文提交
→ 新旧功能回归 → 合并 main → 同步离线成品 → Pages 发布
→ 公开网址实际交互验收 → 清理已合并临时分支
```

最终只保留 `main`，历史交给 Git。默认交付为网站和提交记录，不让使用者搬运 ZIP。未完成发布或验收失败时必须如实说明。

本地克隆的副本更新：

```bash
git pull --ff-only
```

Windows 也可运行 `更新.cmd`；有本地未提交改动时停止，不自动丢弃、强推或重置文件。

## 开发与验证

维护使用 Node.js 22.17+（推荐24）。普通使用无须构建；维护应改可读源码，不只改生成的 HTML。

```bash
npm run build
npm --prefix projects/history ci --ignore-scripts --no-audit --no-fund
npm test
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/browser-smoke.py
python tests/expansion-browser.py --file --require-webgl
python tests/quality-browser.py --file --require-webgl
python tests/math-browser.py --file
python tests/experience-browser.py --file --require-webgl
python tools/prepare-site.py
python tests/site-smoke.py
python tests/expansion-browser.py --site --require-webgl
python tests/quality-browser.py --site --require-webgl
python tests/math-browser.py --site
python tests/experience-browser.py --site --require-webgl
```

浏览器脚本用 `--browser` 可指定 Chrome/Chromium。`--inject` 仅是受限环境的内容检查，不代替真实 file://、HTTP、WebGL 或线上验收。正式工作流额外运行物理、坐卧、日月地深度交互，并在部署后检查公开网站。当前报告位于该次 Actions 的测试 artifacts，不把旧历史报告视为本次通过证据。云端 Chrome 不等于 Windows/iOS 真机；有限的测试状态不能覆盖任意组合，也不能代替内容审定和孩子是否真正理解。

`catalog.json` 管入口，`portal/` 管首页，`projects/` 保存各馆，`shared/` 保存共享组件；`source.html` 索引当前源码和许可。首页不使用 iframe，也不向旧馆强行注入菜单。

## 发布、安全与记录

`.github/workflows/pages.yml` 对 PR 只测试；main 测试通过才同步成品、发布、核验线上交互，并清理已完全合并且没有打开 PR 的指定临时分支。不会用旧构建覆盖更新的 main，也不修改可见性或计费。

Pages 首次设置为 Settings → Pages → Source → GitHub Actions；配置完成后沿用同一网址，无需新增 Jekyll 或 Static HTML 模板。

笔记只存当前浏览器和地址，线上/本地不会自动互通。换浏览器、迁移文件或清理数据前导出备份；不覆盖旧馆学习记录。不得上传私人记录、密码、令牌或密钥。

实验用于科普，不是诊疗、训练处方、导航或危险实物实验指南。日月地保留 AGPL-3.0-or-later；其余项目及第三方依赖按各自许可，见 `THIRD_PARTY_NOTICES.md`，不可把全部素材统称 MIT。

历史记录：`docs/IMPORT_STATUS.md`、`docs/INTEGRATION_REPORT.md`。

## 教学清晰度整改

数学新增逐节点第二情境、正式MathML公式与22个聚焦概念交互，相关基础工具单独标注；化学新增 [六组分阶段实验](projects/chemistry/experiments/index.html)，生物新增 [虚拟显微镜](projects/biology/microscope/index.html) 和重绘的呼吸过程。武术主体改用有明确CC0授权的连续人体网格，动作仍是教学示意。来源、范围与验收见 [教学整改](docs/LEARNING_CLARITY.md)。

## 语文：字里有世界

102个精选汉字、112个常用读音条目按拼音排序；可按字、拼音、部件、词语检索。提供现代字形拆分、逐笔播放/暂停/单步、原创记忆联想、词语搭配与例句、19段古代公版诗句、12道辨字练习及造句备份。字源与联想分开标注，未收录名句与读音不冒称穷尽。朗读仅在设备提供本地中文语音时启用。见 [语文说明](projects/chinese/README.md)。

## 新增：英语、信息与编程、音乐

三馆各含三个精选主题，直接从首页进入：
- 英语：位置图说句子、四种句型词卡、四类可数名词的单复数。
- 信息与编程：带有限重复的机器人指令、二值像素与行程编码、有序表顺序/二分查找。
- 音乐：八键音高、两行节奏、五声音阶的八拍旋律。默认静音，无录音或麦克风。

全部资源离线可用；英语朗读只在设备已有本地英语语音时启用，非必需功能。音乐采用原生Web Audio合成，不是乐器采样或声压测量。用户作品和发现只保存在浏览器，可以备份；不冒充完整教材或能力评级。详细来源与边界见docs/WORKSHOPS.md。
