# V2 开发、构建与回归

## 模块边界

| 文件 | 职责 |
|---|---|
| `src/astro.js` | V1 纯数学、星历求值、时区输入、站心坐标和几何状态，不读取 DOM |
| `src/events.js` | V1 食事件、月相、二分二至搜索和接触求根 |
| `src/scene.js` | Three.js 三维渲染、主 / 第二镜头、贴图、阴影、指针交互 |
| `src/ui.js` | V1 单一应用时钟与核心界面；增加 V2 桥接与 WebGL 降级入口 |
| `src/learning.js` | V2 正午几何、对照计算、分主题时间轴、手记校验和存储适配器；可在 Node 测试 |
| `src/diagrams.js` | 明确标识的正午立杆图与二维兼容渲染，不作为三维天文计算的输入 |
| `src/v2.js` | 人群入口、同步视图、实验对照、探究流程、手记、恢复、导出与按需渲染调度 |
| `src/styles.css` / `src/v2.css` | 原有基础样式与 V2 自适应界面 |
| `src/index.template.html` | 页面骨架与构建占位符 |

无 Java 后端，无运行时 npm / CDN 依赖。vendored Three.js 固定为 r140，不在本次升级中顺便更换引擎版本。两个三维场景读取同一个 `LabApp.getLive().state.time`；A/B 只在 B 的位置转换中加入假设倾角。影子页明确取所选民用日期的太阳上中天样本，不冒充实时地面影子。

## 构建

```bash
node tools/build.cjs
node tests/test.cjs
node tests/v2-test.cjs
python tests/server-test.py
```

需要 Node.js 18+；Python 仅用于相应测试工具。不需要 `npm install`。构建检查 7 个 JS 源文件语法，内置所有脚本、CSS、Float32 星历和两张纹理。相同源码重建 HTML 的 SHA256 应一致；运行测试生成的时间戳不会进入成品 HTML。

`Start.cmd` 仅在自己的目录中查找 HTML 并交给默认浏览器。`Start-server.cmd` 是已经安装 Node.js 时的可选模式。服务器只监听 `127.0.0.1`；端口被占用时在后续最多 10 个端口重试。端口变化也意味着浏览器 origin 变化，本地存储不共享，因此备份仍是可靠迁移方式。不要把这个开发服务器直接暴露到公网。

## 浏览器测试

```bash
python -m pip install playwright
# 按所在操作系统安装 Chromium；Linux 无显示器环境：
xvfb-run -a env CHROMIUM=/usr/bin/chromium python tests/v2-browser-test.py
```

测试实际执行交付 HTML、Three.js / WebGL、双视图、日期输入、点击、拖动、流程、文件下载/上传与多种视口；不只是检查函数有没有返回值。报告写入 `tests/v2-browser-report.json`，截图写入 `previews/`。

受本次管理员 URL 策略限制，使用 `page.set_content` 加载整个自有 HTML，没有修改策略。故**不代表真实 file:// 导航和原生 localStorage 跨重启已验证**。备份导入另一浏览器上下文是实际文件迁移检查；“存储适配器夹具”则明确是内存后端模拟，不能把它说成真实磁盘持久化。WebGL 不可用测试使用故障注入，只证明降级代码分支能运行。

自动化测试中的 `--no-sandbox` / SwiftShader 参数仅用于受控测试容器；普通用户不需要、也不应因此降低浏览器安全性。Windows、触控真机、不同 GPU 请另建实机测试报告。本包不把未执行的设备检查列为通过。

## 手记与迁移格式

顶层备份：

```json
{"format":"sem-lab-notebook","version":2,"notes":[]}
```

每条 note 具有 id、created、title、guess、finding、question、outdoor、scene、context、thumbnail。scene 保留 V1 `version:1` 契约；context 保存 audience、topic、split、tilt、height、eclipseKind 和 eventTime。缩略图只允许限制大小的内嵌 JPEG，不接受远程 URL 或可执行 SVG。

导入先完整校验，后合并；最多 40 条，重复 ID 保留当前版本，超限拒绝而非偷偷截断。单个备份导入限制 8 MB。V1 场景仍经原有 `validateSnapshot` 校验；恢复后统一暂停。

自动保存 session 还包含探究步骤和主镜头；这与用户填写的永久手记不是同一个对象。最后会话仅保留一份，点击“继续上次探索”才恢复；欢迎页不能用默认示范覆盖原会话。历史“返回刚才”是当前页面内最多 15 个主动导航，不是永久无限撤销。

保存采用可注入存储适配器；被禁止 / 配额不足会给出错误并保留当前内存，不能返回“已持久化成功”。HTML 直接文件打开时浏览器存储语义不稳定，重要内容仍应导出 JSON。不要在未知来源下执行导入 JSON 的内容，也不要把任何用户文字插为未转义 HTML。

## 调试入口

`window.LabApp` 保留 V1 核心方法，并增加 `getLive / setEventContext / setKids / clearEvent / setRate`。

`window.LabV2` 提供 `getState / getSecondary / getComparison / getNotes / getSession / setAudience / setTopic / setSplit / restoreEntry / saveSession / back / welcome / notebook / writeNote / importBook / captureBoth / exportBook`。

这些是本地测试入口，不是网络 API。修改正式状态应调用公开方法，不要只改 DOM 文本。任意调试修改都不等于经过用户界面验证。

## 星历与贴图生成

普通构建不需要重新生成。沿用 V1 的固定数据、来源和许可；详细参数见 `PRECISION.md`。需要生成时：

```bash
python -m pip install numpy pyswisseph==2.10.3.2
python tools/generate_ephemeris.py
python -m pip install pillow scipy
python tools/generate_textures.py
```

生成器使用 Moshier 而不是 JPL 星历，原来的 4,000 留出样本报告只验证插值新增误差。V2 没有重新生成数据，不应伪称重新执行了 4,000 次独立高精度天文核验。

## 值得后续独立投入的工作

真实 Windows / 移动设备矩阵、专业食带与地平线区间求根、真实月面朝向和天平动、历史时区数据库、更多无障碍输入验证。它们不应只靠增加按钮或小数位宣称完成。

## 生成交付 ZIP

执行完全部回归后运行 `python tools/package.py`，或给它传入一个输出 ZIP 路径。脚本重新构建检查源码与 HTML 一致性，再核对浏览器报告的 HTML SHA；只有当前回归全部通过才生成交付。它同步生成 `docs/TEST_REPORT.md`、`BUILD_MANIFEST.json`，排除临时测试下载和旧版截图，并检查成品 ZIP 的 CRC 与每个文件的 SHA256。开发工具不改变普通用户“直接打开 HTML”的运行方式。
