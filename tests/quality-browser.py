#!/usr/bin/env python3
"""Regress reported learning/visual defects, not just clickability.

--inject is content-only testing; it does NOT certify file URLs, HTTP serving,
Windows, or GPU rendering. CI should run --file and --site --require-webgl.
"""
from pathlib import Path
import argparse, functools, http.server, json, re, shutil, threading
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--inject', action='store_true')
p.add_argument('--file', action='store_true')
p.add_argument('--site', action='store_true')
p.add_argument('--base')
p.add_argument('--browser')
p.add_argument('--require-webgl', action='store_true')
p.add_argument('--modules', default='biology,martial,geography,cosmos,optics')
p.add_argument('--out', default='.qa/quality')
a = p.parse_args()
OUT = ROOT / a.out
OUT.mkdir(parents=True, exist_ok=True)
report = {'mode': 'injected-content' if a.inject else 'file' if a.file else 'http',
          'checks': [], 'errors': [], 'renderers': {}, 'external_requests': [],
          'limitations': ['No Windows automation is performed by this script.']}
if a.inject:
    report['limitations'].append('Content injection does not verify actual file or HTTP navigation or persistent browser storage.')
server = None
base = a.base
if not a.inject and not a.file and not base:
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args): pass
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / '_site' if a.site else ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:' + str(server.server_port) + '/'


def inline(file):
    text = file.read_text(encoding='utf-8')
    def script(m):
        data = (file.parent / m[1]).read_text(encoding='utf-8')
        return '<script>' + re.sub(r'</script', r'<\\/script', data, flags=re.I) + '</script>'
    text = re.sub(r'<script src="([^"]+)"></script>', script, text)
    return re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>' + (file.parent / m[1]).read_text(encoding='utf-8') + '</style>', text)


def check(name, passed):
    report['checks'].append({'name': name, 'pass': bool(passed)})
    print(('PASS ' if passed else 'FAIL ') + name, flush=True)
    if not passed:
        raise AssertionError(name)


def scene(page):
    # Compositor screenshots work even when a WebGL drawing buffer is not preserved.
    return page.locator('#visual').screenshot(animations='disabled')


def snap(page, name):
    page.evaluate('window.scrollTo(0,0)')
    page.screenshot(path=str(OUT / (name + '.png')), full_page=False)


def select(page, lesson):
    page.evaluate('(id)=>LabTest.select(id)', lesson)


def setp(page, key, value):
    page.evaluate('([key,value])=>LabTest.set(key,value)', [key, value])


def seek(page, value):
    page.evaluate('(t)=>LabTest.seek(t)', value)


def layouts(page, name):
    for width in [1440, 1280, 768, 390, 320]:
        page.set_viewport_size({'width': width, 'height': 1000})
        page.wait_for_timeout(100)
        check(f'{name}: {width}px layout does not clip primary controls', page.evaluate("""()=>{
          const items=['#main','#visual','#controls','.top','.workbench'];
          return items.every(s=>{const r=document.querySelector(s).getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1;});
        }"""))
        if width == 390: snap(page, name + '-390')
    page.set_viewport_size({'width': 1440, 'height': 1000})

try:
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'), args=['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1040}, locale='zh-CN')
        for mod in a.modules.split(','):
            page = context.new_page()
            page.set_default_timeout(15000)
            page.on('pageerror', lambda error: report['errors'].append(str(error)))
            page.on('request', lambda r: report['external_requests'].append(r.url) if r.url.startswith(('https://', 'http://')) and not (base and r.url.startswith(base)) else None)
            relative = 'projects/physics/optics.html' if mod == 'optics' else 'projects/' + mod + '/index.html'
            file = ROOT / relative
            if a.inject: page.set_content(inline(file), wait_until='load')
            else: page.goto(file.as_uri() if a.file else base + relative, wait_until='load')
            page.wait_for_function('window.LabTest')
            check(mod + ': hint is outside the drawing area', page.evaluate("document.querySelector('#viewhint').closest('#visual')===null"))
            if mod == 'biology':
                select(page, 'division')
                for mode in ['mitosis', 'meiosis']:
                    setp(page, 'mode', mode)
                    seek(page, .535); first = scene(page)
                    seek(page, .54)
                    check(mode + ': tiny timeline change changes actual chromosomes', first != scene(page))
                    seek(page, .19)
                    first = scene(page)
                    page.locator('#step').click()
                    check(mode + ': single frame is 1/300, not a stage jump', abs(page.evaluate('LabTest.getState().time') - .19 - 1/300) < 1e-12)
                    seek(page, .66)
                    snap(page, 'division-' + mode)
                    seek(page, 1)
                    check(mode + ': daughter cell counts explained', ('两个' if mode == 'mitosis' else '四个') in page.locator('#division-phase').inner_text())
                select(page, 'breathing')
                seek(page, 0); first = scene(page)
                seek(page, 2.5/18)
                check('breathing: lung/diaphragm image changes across inspiration', first != scene(page))
                check('breathing: both exchange directions visible in explanation', all(x in page.locator('#explanation').inner_text() for x in ['氧气走进血液', '二氧化碳走出来']))
                snap(page, 'breathing-redesigned')
                layouts(page, mod)
            elif mod == 'martial':
                # Return undefined: Playwright auto-invokes a returned function value.
                page.evaluate("""() => {
                    const original = Lab3D.make;
                    Lab3D.make = (...args) => {
                        window.__qa3d = original(...args);
                        return window.__qa3d;
                    };
                }""")
                select(page, 'wingchun'); setp(page, 'motion', 'tan'); seek(page, .5)
                renderer = page.evaluate('LabTest.getState().renderer')
                report['renderers'][mod] = renderer
                if a.require_webgl: check('martial: actual WebGL, software fallback is not accepted for GPU certification', renderer == 'webgl')
                check('martial: both palm and dorsal surface meshes exist', page.evaluate("['l','r'].every(s=>{const hand=__qa3d.scene.getObjectByName('anatomical-hand-'+s);return hand&&hand.getObjectByName('palm-surface')&&hand.getObjectByName('back-of-hand');})"))
                check('martial: articulated hands have many phalanx segments, not ball hands', page.evaluate("['l','r'].every(s=>{let count=0;__qa3d.scene.getObjectByName('anatomical-hand-'+s).traverse(n=>{if(n.isMesh)count++;});return count>=25;})"))
                tan = page.evaluate("__qa3d.scene.getObjectByName('anatomical-hand-l').userData.palmNormal")
                setp(page, 'motion', 'fook'); seek(page, .5)
                fook = page.evaluate("__qa3d.scene.getObjectByName('anatomical-hand-l').userData.palmNormal")
                check('martial: actual transformed tan/fook palm normal changes sign', tan[1] > .2 and fook[1] < -.2)
                setp(page, 'motion', 'tan'); setp(page, 'detail', 'upper'); snap(page, 'martial-upper')
                first = scene(page); setp(page, 'detail', 'left')
                check('martial: single hand inspection changes camera and picture', first != scene(page)); snap(page, 'martial-palm')
                setp(page, 'camera', 'back'); snap(page, 'martial-back')
                setp(page, 'detail', 'upper'); layouts(page, mod)
            elif mod == 'geography':
                select(page, 'coordinates'); setp(page, 'lon', 128); setp(page, 'lat', 38)
                setp(page, 'reference', '17'); seek(page, 0)
                check('geography: 38/17 degree historical distinction is explicit', '边海河' in page.locator('#custom').inner_text())
                first = scene(page); page.locator('#camera-in').click()
                check('geography: globe zoom visibly changes rendering', first != scene(page)); snap(page, 'coordinates-small-marker')
                select(page, 'landforms')
                setp(page, 'ranking', 'height')
                check('mountains: all 20 sourced peak heights listed without point clicking', page.locator('[data-place]').count() == 20 and '8,848.86' in page.locator('[data-place]').first.inner_text())
                page.locator('[data-place]').nth(3).hover()
                check('mountains: hovering updates visible information', '华山' in page.locator('#place-detail').inner_text())
                checkboxes = page.locator('.compare-choice input')
                checkboxes.nth(0).check(); checkboxes.nth(1).check(); checkboxes.nth(3).check()
                check('mountains: three simultaneous comparisons remain visible', page.locator('.compare-bar').count() == 3)
                first = scene(page); setp(page, 'ranges', False)
                check('mountains: approximate range layer actually changes map', first != scene(page))
                setp(page, 'ranges', True); snap(page, 'mountain-ranges')
                select(page, 'voyages'); setp(page, 'names', False); setp(page, 'oceans', False)
                first = scene(page); setp(page, 'borders', False)
                check('voyage: country boundary toggle changes rendered pixels', first != scene(page))
                setp(page, 'borders', True); setp(page, 'oceans', True); setp(page, 'names', True)
                count = page.locator('[data-stop]').count()
                check('voyage: meaningful route node list exists', count >= 10)
                page.locator('[data-stop]').nth(5).click()
                check('voyage: node click seeks the corresponding position', abs(page.evaluate('LabTest.getState().time') - 5/(count-1)) < 1e-10)
                snap(page, 'voyage-flat')
                first = scene(page); setp(page, 'projection', 'globe')
                check('voyage: globe/flat switch visibly differs', first != scene(page)); snap(page, 'voyage-globe')
                canvas = page.locator('#canvas'); box = canvas.bounding_box()
                first = scene(page)
                page.mouse.move(box['x']+box['width']*.5, box['y']+box['height']*.5)
                page.mouse.down(); page.mouse.move(box['x']+box['width']*.65, box['y']+box['height']*.57, steps=5); page.mouse.up()
                check('voyage: drag rotates globe rather than seeking time', first != scene(page) and abs(page.evaluate('LabTest.getState().time') - 5/(count-1)) < 1e-10)
                layouts(page, mod)
            elif mod == 'cosmos':
                select(page, 'light'); setp(page, 'destination', 'sun')
                seek(page, .2); before = page.locator('#clock').inner_text()
                seek(page, .6); after = page.locator('#clock').inner_text()
                check('light: elapsed clock changes while total travel time stays fixed', before != after and before.split(' / ')[-1] == after.split(' / ')[-1])
                snap(page, 'light-elapsed')
                setp(page, 'timeMode', 'real'); seek(page, 0); page.locator('#play').click(); page.wait_for_timeout(450); page.locator('#play').click()
                elapsed = page.evaluate("LabTest.getState().time*CosmosProcess.light('sun',1).total")
                check('light: real-time mode advances seconds, not fixed total label', 0 < elapsed < 2)
                stopped = page.evaluate('LabTest.getState().time'); page.wait_for_timeout(120)
                check('light: pause freezes time and its numeric state', stopped == page.evaluate('LabTest.getState().time'))
                select(page, 'scale'); setp(page, 'level', 7); seek(page, .15); first = scene(page); snap(page, 'laniakea-basin')
                setp(page, 'level', 8); second = scene(page); snap(page, 'observable-universe')
                check('cosmos: Laniakea/universe drawings are genuinely different', first != second)
                check('cosmos: all nine levels are separate accessible buttons', page.locator('#scale-steps button').count() == 9 and page.locator('#scale-steps').evaluate('(el)=>el.scrollHeight<=el.clientHeight+1'))
                check('cosmos: observer boundary not declared whole universe edge', '整个宇宙' in page.locator('#scale-detail').inner_text())
                report['renderers'][mod] = page.evaluate('LabTest.getState().renderer')
                if a.require_webgl: check('cosmos: actual WebGL geometry, not only fallback', report['renderers'][mod] == 'webgl')
                layouts(page, mod)
            elif mod == 'optics':
                select(page, 'interference'); seek(page, .3)
                check('double slit: quantitative default spacing 6.600 mm', '6.600 mm' in page.locator('#metrics').inner_text())
                first = scene(page); page.locator('#double-distance').click()
                check('double slit: doubling spacing halves fringe spacing and changes actual screen', first != scene(page) and '3.300 mm' in page.locator('#metrics').inner_text())
                first = scene(page); page.locator('#single-slit').click()
                check('double slit: closing one slit removes interference visually', first != scene(page))
                page.locator('#restore-double').click(); setp(page, 'screenRange', 60); setp(page, 'probe', 50)
                setp(page, 'screenRange', 5)
                check('double slit: probe clamps to changed visible screen, no offscreen numeric probe', page.evaluate('LabTest.getState().values.probe') == 5)
                page.locator('#reset').click()
                check('double slit: reset restores probe range, no prior lesson range leak', page.locator('#p-probe').get_attribute('max') == '25')
                seek(page, .3); snap(page, 'double-slit')
                select(page, 'fizeau'); page.locator('#wheel-dark').click(); seek(page, 1)
                check('Fizeau: exact theoretical first extinction produces zero light', '0.00%' in page.locator('#metrics').inner_text())
                check('Fizeau: auto-located frequency stays readable', len(page.locator('[data-output="frequency"]').inner_text()) < 19)
                before = page.locator('#clock').inner_text(); seek(page, .5)
                check('Fizeau: elapsed microseconds are not a static full roundtrip', before != page.locator('#clock').inner_text())
                page.locator('#wheel-record').click()
                check('Fizeau: recording at first extinction uses correct inverse value', '299792.5' in page.locator('#wheel-records').inner_text())
                page.locator('#wheel-bright').click(); page.locator('#wheel-record').click()
                check('Fizeau: next bright point does not masquerade as measured c', '非第一暗点' in page.locator('#wheel-records tr').last.inner_text())
                page.locator('#wheel-dark').click(); seek(page, 1); snap(page, 'fizeau-first-dark')
                layouts(page, mod)
            check(mod + ': no NaN/undefined values in visible metrics', not any(x in page.locator('#metrics').inner_text() for x in ['NaN', 'undefined']))
            page.close()
        check('no uncaught JavaScript errors', not report['errors'])
        check('no external runtime asset requests', not report['external_requests'])
        browser.close()
    report['status'] = 'passed'
except Exception as exc:
    report['status'] = 'failed'
    report['exception'] = str(exc)
    raise
finally:
    (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    if server: server.shutdown()
    print('REPORT', len(report['checks']), report['status'], flush=True)
