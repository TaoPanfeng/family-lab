#!/usr/bin/env python3
"""Exercise the published fourteen-museum home and all actual popup links under a subpath."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urljoin, urlsplit, unquote
import argparse, functools, json, tempfile, threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--browser')
    parser.add_argument('--site', type=Path, default=ROOT/'_site')
    parser.add_argument('--url')
    parser.add_argument('--out', type=Path, default=ROOT/'.qa/site')
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    report = dict(checks=[], errors=[], externalRequests=[], status='failed')
    server = None
    def check(name, value):
        report['checks'].append(dict(name=name, passed=bool(value)))
        print(('PASS ' if value else 'FAIL ') + name, flush=True)
        if not value:
            raise AssertionError(name)
    class Quiet(SimpleHTTPRequestHandler):
        def log_message(self, *_):
            pass
    try:
        with tempfile.TemporaryDirectory(prefix='family-lab-') as temp:
            if args.url:
                base = args.url.rstrip('/') + '/'
                if urlsplit(base).scheme not in ('http','https'):
                    raise ValueError('Expected HTTP(S) URL')
            else:
                (Path(temp)/'family-lab').symlink_to(args.site.resolve(), target_is_directory=True)
                server = ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=temp))
                threading.Thread(target=server.serve_forever,daemon=True).start()
                base = f'http://127.0.0.1:{server.server_port}/family-lab/'
            report['baseUrl'] = base
            with sync_playwright() as pw:
                browser = pw.chromium.launch(executable_path=args.browser,headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
                context = browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN')
                context.on('page',lambda p:p.on('pageerror',lambda e:report['errors'].append(str(e))))
                context.on('request',lambda r:report['externalRequests'].append(r.url) if urlsplit(r.url).scheme in ('http','https') and urlsplit(r.url).netloc != urlsplit(base).netloc else None)
                page = context.new_page()
                response = page.goto(base,wait_until='load',timeout=60000)
                check('homepage HTTP 200',response.status==200)
                check('fourteen independent museum entries',page.locator('[data-project]').count()==14)
                page.locator('#museum-search').fill('氧气')
                check('homepage search filters actual cards',page.locator('[data-project]:visible').count()==1)
                page.locator('#museum-search').fill('000missing')
                check('homepage empty search state',page.locator('#home-empty').is_visible())
                page.locator('#museum-search').press('Escape')
                check('Escape restores all cards',page.locator('[data-project]:visible').count()==14)
                entries=page.locator('[data-project]').evaluate_all('(ls)=>ls.map(a=>({id:a.dataset.project,href:a.getAttribute("href")}))')
                ready={'english':'!!window.WorkshopTest','computing':'!!window.WorkshopTest','music':'!!window.WorkshopTest','chinese':'!!window.ChineseTest','math':'!!window.MathTest','astronomy':'!!window.LabV2','physics':'!!window.GuanWu','chemistry':'!!window.ChemAppTesting','history':'!!document.querySelector("#navigation [data-view]")','posture':'!!window.PostureLab'}
                for entry in entries:
                    with page.expect_popup(timeout=30000) as opened:
                        page.locator('[data-project="'+entry['id']+'"]').click()
                    child=opened.value
                    child.wait_for_load_state('load',timeout=60000)
                    check('card opens exact application: '+entry['id'],unquote(child.url.split('#')[0])==unquote(urljoin(base,entry['href']).split('#')[0]))
                    child.wait_for_function(ready.get(entry['id'],'!!window.LabTest'),timeout=30000)
                    check('application initialized: '+entry['id'],True)
                    child.close()
                    check('homepage remains after popup closes: '+entry['id'],page.url==base)
                for width in (1440,768,390):
                    page.set_viewport_size({'width':width,'height':1000})
                    check(str(width)+'px no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                    if width!=768:
                        page.screenshot(path=str(args.out/f'home-{width}.png'),full_page=True)
                check('source index accessible',context.request.get(urljoin(base,'source.html')).status==200)
                check('no page exceptions',not report['errors'])
                check('no external runtime dependencies',not report['externalRequests'])
                context.close();browser.close()
            report['status']='passed'
    except Exception as e:
        report['fatal']=str(e)
        print('FAIL '+str(e),flush=True)
    finally:
        if server:
            server.shutdown();server.server_close()
        report['passed']=sum(x['passed'] for x in report['checks'])
        (args.out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if report['status']=='passed' else 1
if __name__=='__main__':
    raise SystemExit(main())
