"""Build a checked V2 delivery ZIP. Development tool; Python 3 + Node.js only.
Refuses failed reports, stale browser-tested HTML, or source/build divergence.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / '日月地实验室.html'
OUTPUT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT.parent / 'Sun-Earth-Moon-Lab-v2.0.zip'
PREFIX = 'Sun-Earth-Moon-Lab-V2'

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def load_report(name):
    report = json.loads((ROOT/'tests'/name).read_text(encoding='utf-8'))
    if not report.get('total') or report.get('passed') != report['total']:
        raise RuntimeError(f'{name}: incomplete or failed tests; no ZIP produced.')
    return report

science = load_report('test-report.json')
learning = load_report('v2-report.json')
browser = load_report('v2-browser-report.json')
server = load_report('server-report.json')
before = digest(HTML.read_bytes())
subprocess.run(['node', 'tools/build.cjs'], cwd=ROOT, check=True)
if digest(HTML.read_bytes()) != before:
    raise RuntimeError('Source changed the delivered HTML. Rerun all tests, then package again.')
if browser.get('htmlSha256') != before:
    raise RuntimeError('Browser report does not match this HTML. Rerun v2-browser-test.py.')
if browser.get('errors') or browser.get('externalRequests'):
    raise RuntimeError('Browser report contains errors or external network requests.')

rows = [
    ('V1 科学计算 / 时间 / 工程回归', science, 'test-report.json'),
    ('V2 几何 / 时间轴 / 手记 / 存储适配器', learning, 'v2-report.json'),
    ('V2 Chromium 交互及故障注入', browser, 'v2-browser-report.json'),
    ('可选本机 HTTP 服务字节与安全边界', server, 'server-report.json'),
]
parts = [
    '# V2.0 实际测试与交付核对\n',
    '以下结果来自本次实际执行。测试中的 390px / 1024px 是浏览器视口，不是手机 / 平板真机认证。\n',
    '## 1. 本次结果\n',
    '| 测试组 | 通过 / 总数 | 逐项原始结果 |\n|---|---:|---|',
]
for title, report, filename in rows:
    parts.append(f'| {title} | **{report["passed"]} / {report["total"]}** | `tests/{filename}` |')
parts.extend([
    '\nNASA 的五个全球食甚核对包含在第一组中，不重复累计。V1 原有 4,000 点插值报告保留作基线，**V2 没有重新生成星历或再次运行该生成器**。',
    '\n## 2. 环境与明确边界\n',
    f'- 浏览器：Chromium `{browser["browser"]}`，Linux / Xvfb / SwiftShader。',
    f'- 浏览器检查时间：`{browser["timestamp"]}`。',
    f'- Node：`{learning["node"]}`；V2 纯逻辑检查时间：`{learning["timestamp"]}`。',
    f'- HTML SHA256：`{before}`。',
    '\n管理员 URL 策略阻止实际 file:// 导航，首次直接导航尝试收到 `net::ERR_BLOCKED_BY_ADMINISTRATOR`。未修改、绕过或关闭该策略。浏览器测试使用 Playwright `set_content` 执行**完整交付 HTML**，真实创建 WebGL、执行脚本、操作界面、下载与上传文件。此方法证明页面内容与交互能运行，不能证明本地 URL 导航、Windows 启动脚本或原生存储跨浏览器重启能运行。',
    '\n**本次未验证：Windows 实机 / Start.cmd 实际执行、真实本地 HTML 导航、原生 localStorage 跨浏览器重启、真实 iOS / Android 触控与手势、所有 GPU / 屏幕阅读器、本地中文语音播放品质、所有日期和所有城市的专业观测精度。**',
    '\n本机 HTTP 检查用 Python `http.client`，验证返回字节、404、路径穿越拒绝及非法 URL 响应；不是浏览器导航测试。',
    '\n## 3. 这次验证了什么\n',
    '月相 / 食事件两个视图共享真实时刻；切时区不移动天体；月食追踪对象不会误用太阳；A/B 不互相篡改，绘制高度一致；正午求解与影长边界；儿童预测与真实操作之后才能推进；父子角色切换；手记文字与场景恢复；JSON 下载、校验、合并与新浏览器上下文导入；PNG 实际下载；手机窄视口操作；暂停时减少重绘；非法导入与 HTML 注入防护。',
    '\n**两个测试方法必须区分：** WebGL 初始化失败使用故障注入，证明兼容分支可以运行；存储适配器夹具使用内存后端，证明旧现场不会被欢迎页覆盖、继续 / 关闭入口能恢复。二者不等于所有真实硬件故障和浏览器本地持久化已经认证。另一个“备份迁移”测试则是真的把下载的 JSON 导入新浏览器上下文。',
    '\n检查全过程未记录到 JavaScript / WebGL 控制台错误，未发生外部 HTTP(S) 请求。所有截图来自实际运行；截图中的手记文字是自动化测试示例，不是用户或孩子的真实记录。',
    '\n## 4. 独立全球食甚样本\n',
    '比较全球最大食附近的搜索时刻，而非逐城接触时刻、精确食带或天气。每个样本容限为 30 秒，只用于发现明显回归，不能据此承诺整个 1900—2100 年区间都有同等精度。\n',
    '| 事件 | 参考 UT | 本程序 UTC 近似 | 差值 / 秒 |\n|---|---|---|---:|',
])
for row in science['nasaComparison']:
    parts.append(f'| {row["date"]} {row["type"]} | {row["referenceUT"]} | {row["calculatedUTC"]} | {row["differenceSeconds"]:+.3f} |')
parts.extend([
    '\n参考：Eclipse Predictions by Fred Espenak, NASA\'s GSFC。NASA 不对本程序背书。月食目录 TD 经对应 ΔT 换算为 UT；UT 与本程序 UTC≈UT1 约定也不是严格相同。原始出处和换算备注见 `tests/nasa-reference.json`、`docs/SOURCES.md`；完整模型限制见 `docs/PRECISION.md`。',
    '\n## 5. 本次回归逐项结果\n',
])
for title, report, filename in rows:
    parts.append(f'### {title}\n')
    parts.extend(f'{i}. 通过：{item["name"]}。' for i, item in enumerate(report['results'], 1))
parts.extend([
    '\n## 6. 复现与打包\n',
    '```bash\nnode tools/build.cjs\nnode tests/test.cjs\nnode tests/v2-test.cjs\npython tests/server-test.py\nxvfb-run -a env CHROMIUM=/usr/bin/chromium python tests/v2-browser-test.py\npython tools/package.py\n```',
    '\n最后一项只用于开发交付，需要 Python 标准库和 Node。打包前重新构建并比对 SHA，拒绝与浏览器已测 HTML 不一致的版本；报告失败也不会输出正式 ZIP。打包后检查 ZIP CRC 和包内每个文件的 SHA256。`BUILD_MANIFEST.json` 记录交付文件，ZIP 外的同名 SHA256 文本可用于核对下载。普通使用只需打开 HTML。',
])
(ROOT/'docs/TEST_REPORT.md').write_text('\n'.join(parts)+'\n', encoding='utf-8')

EXCLUDED_DIRS = {'.git', '.venv', 'node_modules', '__pycache__'}
def include(path):
    rel = path.relative_to(ROOT)
    return (path.is_file() and not any(p in EXCLUDED_DIRS for p in rel.parts)
            and not rel.as_posix().startswith(('tests/tmp/', 'previews/v1/'))
            and rel.name not in {'BUILD_MANIFEST.json'}
            and path.suffix not in {'.zip', '.log', '.pyc'})

files = sorted(p for p in ROOT.rglob('*') if include(p))
manifest = {
    'project': '日月地 · 时空实验室', 'version': '2.0.0',
    'htmlSha256': before, 'browserTestTimestamp': browser['timestamp'],
    'files': [{'path': p.relative_to(ROOT).as_posix(), 'bytes': p.stat().st_size,
               'sha256': digest(p.read_bytes())} for p in files],
}
manifest_path = ROOT/'BUILD_MANIFEST.json'
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(OUTPUT, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=7) as z:
    for p in files+[manifest_path]:
        z.write(p, PREFIX+'/'+p.relative_to(ROOT).as_posix())
with zipfile.ZipFile(OUTPUT) as z:
    bad = z.testzip()
    if bad:
        raise RuntimeError('ZIP CRC failure: '+bad)
    for item in manifest['files']:
        if digest(z.read(PREFIX+'/'+item['path'])) != item['sha256']:
            raise RuntimeError('ZIP SHA mismatch: '+item['path'])
sha = digest(OUTPUT.read_bytes())
OUTPUT.with_suffix('.sha256.txt').write_text(sha+'  '+OUTPUT.name+'\n', encoding='ascii')
print(f'ZIP verified: {OUTPUT} ({OUTPUT.stat().st_size/1024/1024:.2f} MiB)')
print(f'{len(files)+1} files; CRC and each SHA256 verified.')
print('SHA256 '+sha)
