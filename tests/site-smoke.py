#!/usr/bin/env python3
"""通过 /family-lab/ 子路径验证真正的 HTTP 首页、五个入口及移动布局。"""
from __future__ import annotations

import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import tempfile
import threading
from urllib.parse import urljoin, urlsplit, unquote

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser', help='Optional Chromium executable for local testing')
    parser.add_argument('--site', type=Path, default=ROOT / '_site')
    parser.add_argument('--url', help='核验已部署的网站；不传时启动本地子路径服务器。')
    parser.add_argument('--out', type=Path, default=ROOT / '.qa/site')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    report = {'checks': [], 'errors': [], 'externalRequests': [], 'status': 'failed'}
    server = None
    temporary = tempfile.TemporaryDirectory(prefix='family-lab-http-')

    def check(name, condition):
        report['checks'].append({'name': name, 'passed': bool(condition)})
        print(('PASS ' if condition else 'FAIL ') + name, flush=True)
        if not condition:
            raise AssertionError(name)

    try:
        if args.url:
            base = args.url.rstrip('/') + '/'
            if urlsplit(base).scheme not in ('http', 'https'):
                raise ValueError('--url must be an HTTP(S) website')
        else:
            if not (args.site / 'index.html').is_file():
                raise FileNotFoundError('Run python tools/prepare-site.py first')
            # 子目录前缀用于发现只在网站根路径有效的链接。
            (Path(temporary.name) / 'family-lab').symlink_to(args.site.resolve(), target_is_directory=True)
            handler = functools.partial(QuietHandler, directory=temporary.name)
            server = ThreadingHTTPServer(('127.0.0.1', 0), handler)
            threading.Thread(target=server.serve_forever, daemon=True).start()
            base = f'http://127.0.0.1:{server.server_port}/family-lab/'
        report['baseUrl'] = base
        origin = urlsplit(base).netloc
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(executable_path=args.browser, headless=True, args=[
                '--no-sandbox', '--disable-dev-shm-usage',
                '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='zh-CN')
            context.on('page', lambda page: page.on('pageerror', lambda err: report['errors'].append(str(err))))
            context.on('request', lambda req: report['externalRequests'].append(req.url)
                       if urlsplit(req.url).scheme in ('http', 'https') and urlsplit(req.url).netloc != origin else None)
            page = context.new_page()
            response = page.goto(base, wait_until='load', timeout=60000)
            check('子路径首页返回 HTTP 200', response is not None and response.status == 200)
            check('首页保留五个独立入口', page.locator('[data-project]').count() == 5)
            entries = page.locator('[data-project]').evaluate_all(
                '(links) => links.map(a => ({id: a.dataset.project, href: a.getAttribute("href")}))')
            ready = {
                'astronomy': '!!window.LabV2 && !!document.querySelector("[data-enter=research]")',
                'physics': '!!window.GuanWu',
                'chemistry': '!!window.ChemAppTesting',
                'history': 'document.querySelectorAll("#navigation [data-view]").length > 0',
                'posture': '!!window.PostureLab',
            }
            for entry in entries:
                with page.expect_popup(timeout=30000) as opened:
                    page.locator(f'[data-project="{entry["id"]}"]').click()
                child = opened.value
                child.wait_for_load_state('load', timeout=60000)
                actual = unquote(child.url.split('#', 1)[0])
                expected = unquote(urljoin(base, entry['href']).split('#', 1)[0])
                check('点击卡片进入原项目：' + entry['id'], actual == expected)
                child.wait_for_function(ready[entry['id']], timeout=30000)
                check('项目脚本初始化成功：' + entry['id'], True)
                child.close()
                check('关闭项目后首页仍在：' + entry['id'], page.url == base)
            for width in (1440, 768, 390):
                page.set_viewport_size({'width': width, 'height': 1000})
                check(f'HTTP 首页 {width}px 无横向溢出', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
            page.screenshot(path=str(args.out / 'home-mobile.png'), full_page=True)
            source = context.request.get(urljoin(base, 'source.html'))
            check('源码与许可页可以访问', source.status == 200 and '源码与许可' in source.text())
            check('没有未捕获脚本异常', not report['errors'])
            check('运行时没有外部网络依赖', not report['externalRequests'])
            context.close()
            browser.close()
        report['status'] = 'passed'
    except Exception as error:
        report['fatal'] = str(error)
        print('FAIL ' + str(error), flush=True)
    finally:
        if server is not None:
            server.shutdown()
            server.server_close()
        temporary.cleanup()
        report['passed'] = sum(item['passed'] for item in report['checks'])
        report['failed'] = sum(not item['passed'] for item in report['checks'])
        (args.out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(json.dumps({k: report[k] for k in ('status', 'passed', 'failed')}, ensure_ascii=False))
    return 0 if report['status'] == 'passed' else 1


if __name__ == '__main__':
    raise SystemExit(main())
