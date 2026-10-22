"""Optional loopback HTTP smoke test. Needs Python 3 and Node.js, no packages.
This is a server-byte/response test, NOT a browser navigation test.
"""
from pathlib import Path
import http.client
import json
import os
import socket
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    port = sock.getsockname()[1]
proc = subprocess.Popen(['node', str(ROOT / 'tools/serve.cjs')], cwd=ROOT,
                        env={**os.environ, 'PORT': str(port)},
                        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
results = []

def get(path):
    conn = http.client.HTTPConnection('127.0.0.1', port, timeout=8)
    try:
        conn.request('GET', path)
        response = conn.getresponse()
        return response.status, response.read(), response.getheader('Content-Type', '')
    finally:
        conn.close()

try:
    for _ in range(100):
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=0.1):
                break
        except OSError:
            if proc.poll() is not None:
                raise RuntimeError('Local server exited before starting.')
            time.sleep(0.05)
    else:
        raise TimeoutError('Local server did not start in five seconds.')
    status, body, content_type = get('/')
    checks = [
        ('本机 HTTP 首页返回与交付 HTML 完全相同的字节',
         status == 200 and body == (ROOT/'日月地实验室.html').read_bytes() and 'text/html' in content_type),
        ('不存在的资源返回 404', get('/not-a-real-file')[0] == 404),
        ('编码后的目录穿越请求被拒绝', get('/%2e%2e%2f%2e%2e%2fetc/passwd')[0] == 403),
        ('非法 URL 转义返回 400', get('/%ZZ')[0] == 400),
        ('源码可通过本机开发服务读取', get('/src/astro.js')[1] == (ROOT/'src/astro.js').read_bytes()),
    ]
    results = [{'name': name, 'pass': bool(ok)} for name, ok in checks]
finally:
    proc.terminate()
    proc.wait(timeout=5)
report = {
    'testedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    'method': 'Python http.client on loopback; not browser URL navigation',
    'total': len(results), 'passed': sum(x['pass'] for x in results), 'results': results,
}
(ROOT/'tests/server-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
for result in results:
    print(('PASS ' if result['pass'] else 'FAIL ') + result['name'])
if not all(x['pass'] for x in results):
    raise SystemExit(1)
