# 万物 · 家庭探索馆

日月地、物理、化学、历史、坐卧：**一个首页，五个独立项目，每个项目只保留当前版本。**

## 直接使用

完整解压，双击根目录 **`index.html`**。点击卡片在新标签页进入原项目。Windows 可运行 `打开首页.cmd`。日常使用不需要 Node.js、Python、npm、账号或启动服务；打开外部资料链接才需要网络。

代码已导入此 GitHub 仓库；克隆后可直接打开根目录 `index.html`。**代码入库不等于网站上线**：部署状态请查看 Actions 和 Settings → Pages。原整合测试记录保留在 `docs/INTEGRATION_REPORT.md`，本次导入记录见 `docs/IMPORT_STATUS.md`。

## 已整理内容

| 项目 | 路径 | 运行入口 |
| --- | --- | --- |
| 日月地 | `projects/astronomy` | `日月地实验室.html` |
| 物理 | `projects/physics` | `index.html` |
| 化学 | `projects/chemistry` | `chemistry-explorer.html` |
| 历史 | `projects/history` | `index.html` |
| 坐卧 | `projects/posture` | `index.html` |

日月地来源为上传包中的 V2，其余为各自上传版本。根目录与首页不提供多版本选择，未重复收录嵌套 ZIP 或日月地旧应用。原项目内的版本号和历史测试说明仅用于来源追踪，运行界面未因此改写。

## 后续修改

普通使用不需要构建。维护代码时使用 Node.js 22.17+，推荐 Node.js 24：

```bash
# 重新生成可直接打开的成品
npm run build
# 不需要安装额外依赖的模型、数据、DOM 与入口检查
npm run test:offline
# 历史完整 DOM 测试需要锁定的开发依赖；页面运行不需要
npm --prefix projects/history ci --ignore-scripts
npm test
```

浏览器回归：安装测试依赖 `pip install playwright`，然后 `playwright install chromium`、`python tests/browser-smoke.py`。受限环境可使用 `--inject`，报告将明确不算真实本地文件导航。测试依赖不用于应用运行。

文件职责：`catalog.json` 管五个项目的名称与入口；`portal/` 管首页模板、样式和示意图；`tools/build-home.cjs` 生成首页及本地源码索引；`projects/` 保存原项目完整内容。

## Git 更新

远端仓库建立后，首次克隆；以后在该克隆目录执行：

```bash
git pull --ff-only
```

再重新打开首页。`更新.cmd` 会先检查未提交修改；不会自动 stash、reset 或丢弃本地改动。普通 ZIP 解压目录不是 Git 克隆，更新脚本会明确提示，不会假装更新。

## GitHub Pages 发布准备

本仓库包含 `.github/workflows/pages.yml`，但配置文件存在不等于已经启用托管。

在具备写入和仓库管理授权的环境中：创建目标仓库，将本项目提交到 `main`，在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**，然后运行发布工作流。工作流先构建和测试，再上传静态站。首次启用后可从 Actions 手动运行；成功后读取部署步骤返回的真实地址，检查首页及五个入口。

GitHub Free 账户的 Pages 需要公开仓库；支持私有仓库 Pages 的其他计划另有条件。不要为了托管擅自把私有代码公开；站点公开性与仓库公开性须分别确认。原始依据：
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

本站所有运行路径均为相对路径，不写死仓库名，也不用前端 History API 路由。`source.html` 提供同一副本的源码与许可索引。`tools/prepare-site.py` 只生成 `_site`，不包含账户凭据，也不会自行创建仓库或上传。

## 记录与安全

各项目的收藏和手记仍由各自浏览器存储管理。换路径、换域名或清理浏览器前先导出已有记录；不承诺自动迁移。保留旧文件夹直到确认资料已备份。

化学和物理实验仅为教学模拟；原有安全边界保持不变。坐卧项目不是医疗诊断工具。所有原始许可、科学来源和模型局限均保留。

## 本次测试

见 `docs/INTEGRATION_REPORT.md`。旧项目自带测试报告仍保留，但不能当作本次新跑的结果。
