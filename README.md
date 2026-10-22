# 万物 · 家庭探索馆

日月地、物理、化学、历史、坐卧：**一个首页，五个独立项目，每个项目只保留当前版本。**

## 直接使用

```bash
git clone https://github.com/TaoPanfeng/family-lab.git
cd family-lab
```

克隆后双击根目录 **`index.html`**，或在 Windows 运行 `打开首页.cmd`。点击卡片在新标签页进入原项目。日常使用不需要 Node.js、Python、npm 或启动服务；打开外部参考资料才需要网络。私有仓库的首次克隆使用自己的 GitHub 授权，不要把密码、令牌或私钥提交到聊天或仓库。

五个项目已解压入库，首次导入记录见 `docs/IMPORT_STATUS.md`。**代码入库不等于网站上线**：发布是否完成，以 Actions 中 `deploy` 和发布后的 HTTP 检查结果为准。

| 项目 | 路径 | 运行入口 |
| --- | --- | --- |
| 日月地 | `projects/astronomy` | `日月地实验室.html` |
| 物理 | `projects/physics` | `index.html` |
| 化学 | `projects/chemistry` | `chemistry-explorer.html` |
| 历史 | `projects/history` | `index.html` |
| 坐卧 | `projects/posture` | `index.html` |

日月地采用原上传包中的 V2，其余采用各自上传版本。首页不再提供多版本选择，未重复收录旧应用及嵌套 ZIP。源码版本标记和历史测试基线仅用于追踪来源，不代表存在第二套应用。

## 后续更新

提出具体功能需求即可继续维护本仓库，不需要重新上传 ZIP：

```text
读取最新代码 → 修改源码及测试 → 中文功能提交
             → 云端构建、测试 → 自动提交离线成品
             → Pages 部署及网址检查
```

提交说明应匹配实际修改，例如 `feat(physics): 增加自由落体空气阻力开关`。成品提交会记录对应的源码提交。工作流不会强推，也不会用旧构建覆盖更新的 main。

等待对应提交的测试和 `sync-offline` 通过后，在本地仓库执行：

```bash
git pull --ff-only
```

然后重新打开首页。Windows 也可以双击 `更新.cmd`；它遇到未提交改动会停止，不会自动 stash、reset 或丢弃本地修改。普通 ZIP 解压目录不是 Git 克隆，更新脚本会明确提示。

## 开发与测试

普通使用不需要构建。维护者使用 Node.js 22.17+，推荐 Node.js 24：

```bash
npm run build
npm run test:offline
npm --prefix projects/history ci --ignore-scripts --no-audit --no-fund
npm test
```

浏览器测试使用 Python Playwright 1.57.0。云端固定 Ubuntu 24.04，复用并记录该环境预装的 Chrome 版本，避免重复安装系统依赖。自建环境可安装对应的 Chromium：

```bash
python -m pip install playwright==1.57.0
python -m playwright install chromium
python tests/browser-smoke.py
python tools/prepare-site.py
python tests/site-smoke.py
```

`browser-smoke.py` 默认测试真实 `file://` 导航；`site-smoke.py` 测试 `/family-lab/` HTTP 子路径、五个实际入口和移动布局。两者都支持 `--browser` 指定 Chrome/Chromium。受限环境使用 `--inject` 只代表内容和交互测试，不代表真实文件导航，更不能当作 Windows 双击实测。

`catalog.json` 管名称与入口；`portal/` 管首页；`projects/` 保存五个项目完整内容；`tools/build-home.cjs` 生成首页和源码索引。修改可读源码后必须生成并提交离线成品，不能只改打包结果。

## 静态网站发布

`.github/workflows/pages.yml` 会依次执行构建、模型/DOM、真实 file:// 和 HTTP 浏览器检查，同步离线成品，再发布 GitHub Pages。测试报告和截图保存在对应 Actions 的 artifacts 中。

首次启用 Pages 可能需要仓库所有者在 **Settings → Pages → Source** 选择 **GitHub Actions**。普通 Actions 令牌不具备新建站点需要的仓库管理权限。完成设置后重新运行发布工作流；读取部署步骤返回的真实地址，不能把预计域名当作已上线地址。

GitHub Free 的 Pages 适用于公开仓库；私有仓库需支持该功能的计划。不要为了托管擅自公开代码或变更计费。网站公开性和仓库公开性须分别确认。

官方依据：
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://github.com/actions/configure-pages/blob/main/action.yml

所有运行路径均为相对路径。`source.html` 提供同一副本的源码与许可。`tools/prepare-site.py` 只生成 `_site`，排除 Git、凭据与依赖目录；它本身不会上传网站。

## 记录、安全与许可

学习记录仍由各项目保存在当前浏览器。换路径、换域名或清理浏览器前先导出，不承诺自动迁移。确认备份前保留旧文件夹。

化学与物理实验仅为教学模拟；坐卧不是医疗诊断工具。原始许可、科学来源与模型局限均保留。日月地遵循其原有 AGPL-3.0-or-later，不能被首页 MIT 许可覆盖。

原整合测试记录见 `docs/INTEGRATION_REPORT.md`；首次云端导入记录见 `docs/IMPORT_STATUS.md`。旧项目自带报告不能当作本次新跑结果，当前结果以对应 Actions 日志和 artifacts 为准。
