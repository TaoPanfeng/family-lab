#!/usr/bin/env python3
"""Bounded, real file/HTTP regressions for the 2026-11-04 site audit.
Uses actual navigation, downloads and keyboard input; never injects application HTML.
"""
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
import argparse
import json
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument('--file', action='store_true')
    target.add_argument('--base', help='HTTP(S) site root, including a repository subpath if present')
    parser.add_argument('--browser', help='Existing Chromium executable; no installation is attempted')
    parser.add_argument('--out', default='.qa/site-audit')
    args = parser.parse_args()
    out = ROOT / args.out
    out.mkdir(parents=True, exist_ok=True)
    base = (args.base or '').rstrip('/') + '/'
    report = {
        'mode': 'file' if args.file else 'HTTP',
        'base': None if args.file else base,
        'status': 'failed', 'checks': [], 'errors': [], 'externalRequests': [], 'pages': [],
        'limits': [
            'A bounded desktop regression plus one narrow viewport; not physical phone or Safari certification.',
            'Camera pixels and renderer state are checked, but this is not a complete WebGL or scientific-content audit.',
            'No real audio output, browser visibility transition, or exhaustive parameter combination is certified here.'
        ]
    }
    page = None

    def check(name, passed):
        report['checks'].append({'name': name, 'passed': bool(passed)})
        print(('PASS ' if passed else 'FAIL ') + name, flush=True)
        if not passed:
            raise AssertionError(name)

    def focus(page, selector):
        return page.locator(selector).evaluate('(e)=>document.activeElement===e')

    def value(page, selector, number):
        page.locator(selector).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}', str(number))

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                executable_path=args.browser or shutil.which('chromium') or shutil.which('google-chrome'),
                headless=True,
                args=['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
            )
            context = browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='zh-CN', accept_downloads=True)

            def load(rel, ready, ctx=context):
                p = ctx.new_page()
                p.set_default_timeout(12000)
                p.on('pageerror', lambda error: report['errors'].append(str(error)))
                p.on('request', lambda request: report['externalRequests'].append(request.url)
                     if urlsplit(request.url).scheme in ('http', 'https') and
                     (args.file or not request.url.startswith(base)) else None)
                if args.file:
                    target = urlsplit(rel)
                    local = urlsplit((ROOT / target.path).as_uri())
                    url = urlunsplit(local._replace(query=target.query, fragment=target.fragment))
                else:
                    url = base + rel
                report['pages'].append(url)
                p.goto(url, wait_until='load', timeout=60000)
                p.wait_for_function(ready)
                return p

            # Shared shell: two independent drafts, actual focus and a complete download.
            page = load('projects/biology/index.html', 'window.LabTest')
            page.locator('[data-lesson="cells"]').click()
            check('shared: desktop topic navigation keeps focus on its replacement button',
                  focus(page, '[data-lesson="cells"]') and page.evaluate('LabTest.getState().lesson') == 'cells')
            page.locator('#notes-open').click()
            page.locator('#note').fill('审查草稿A：细胞结构。')
            page.locator('[data-lesson="division"]').click()
            check('shared: another topic starts with its own empty draft', page.locator('#note').input_value() == '')
            page.locator('#notes-open').click()
            page.locator('#note').fill('审查草稿B：细胞分裂。')
            page.locator('[data-lesson="cells"]').click()
            check('shared: returning restores the first unsaved topic draft', page.locator('#note').input_value() == '审查草稿A：细胞结构。')
            page.locator('[data-lesson="division"]').click()
            check('shared: returning restores the second unsaved topic draft', page.locator('#note').input_value() == '审查草稿B：细胞分裂。')
            page.locator('#save-note').click()
            check('shared: explicit save clears only the current draft',
                  page.locator('#note').input_value() == '' and page.evaluate('LabTest.getState().notes') == 1)
            page.locator('#favorite').click()
            correct = page.evaluate('Museum.lessons.find(l=>l.id===LabTest.getState().lesson).correct')
            page.locator(f'[data-answer="{correct}"]').click()
            check('shared: favorite and verified progress have matching UI state',
                  page.locator('#favorite').get_attribute('aria-pressed') == 'true' and
                  'division' in page.evaluate('LabTest.getState().solved'))
            with page.expect_download() as download:
                page.locator('#export').click()
            backup_file = out / 'biology-learning.json'
            download.value.save_as(str(backup_file))
            backup = json.loads(backup_file.read_text())
            check('shared: real JSON download includes favorites, progress and saved notes only',
                  backup.get('app') == 'family-lab-learning' and backup.get('version') == 1 and
                  backup.get('subject') == 'biology' and backup.get('mode') == 'child' and
                  backup.get('favorites') == ['division'] and backup.get('solved') == ['division'] and
                  len(backup.get('notes', [])) == 1 and backup['notes'][0]['text'] == '审查草稿B：细胞分裂。')
            page.locator('#import').set_input_files({'name': 'invalid.json', 'mimeType': 'application/json', 'buffer': b'{broken'})
            page.wait_for_function('document.querySelector("#toast").textContent.includes("导入失败")')
            check('shared: malformed import keeps the saved observation',
                  page.evaluate('LabTest.getState().notes') == 1 and '审查草稿B' in page.locator('#note-list').inner_text())
            page.set_viewport_size({'width': 390, 'height': 844})
            page.locator('[data-lesson="cells"]').click()
            check('shared: narrow-screen topic navigation focuses the reading area and retains its draft',
                  focus(page, '#main') and page.locator('#note').input_value() == '审查草稿A：细胞结构。')
            page.close()

            # Native Space activation must still work after the grid replaces a button.
            page = load('projects/computing/index.html', 'window.WorkshopTest')
            page.locator('[data-lesson="pixels"]').click()
            pixel = page.locator('[data-pixel="9"]')
            before = page.evaluate('WorkshopTest.state().bits[9]')
            pixel.focus()
            page.keyboard.press('Space')
            check('computing: Space toggles a pixel and keeps focus on the same grid cell',
                  focus(page, '[data-pixel="9"]') and page.evaluate('WorkshopTest.state().bits[9]') == 1 - before)
            page.keyboard.press('Space')
            check('computing: a second Space toggles the rebuilt pixel back',
                  focus(page, '[data-pixel="9"]') and page.evaluate('WorkshopTest.state().bits[9]') == before)
            page.locator('#save-work').click()
            page.locator('#notebook > summary').click()
            with page.expect_download() as download:
                page.locator('#export').click()
            work_file = out / 'computing-work.json'
            download.value.save_as(str(work_file))
            work = json.loads(work_file.read_text())
            check('computing: the actual exported artwork matches all 36 current pixels',
                  work.get('subject') == 'computing' and work.get('works', {}).get('pixels') == page.evaluate('WorkshopTest.state().bits'))
            page.close()

            # The camera menu must change geometry, not merely its label.
            page = load('projects/cosmos/index.html#orbit', 'window.LabTest')
            check('camera: the selected orbit has a real WebGL camera state',
                  page.evaluate('LabTest.getState().renderer') == 'webgl' and page.evaluate('LabTest.getState().viewState') is not None)
            page.locator('.camera-directions > summary').click()
            camera_before = page.evaluate('LabTest.getState().viewState')
            picture_before = page.locator('.three-canvas').screenshot(path=str(out / 'camera-before.png'), mask=[page.locator('.camera-directions')])
            page.locator('[data-camera-turn="left"]').click()
            camera_after = page.evaluate('LabTest.getState().viewState')
            picture_after = page.locator('.three-canvas').screenshot(path=str(out / 'camera-after.png'), mask=[page.locator('.camera-directions')])
            check('camera: one direction click changes both yaw and the rendered image',
                  abs(camera_after['yaw'] - camera_before['yaw'] + .2) < 1e-9 and picture_before != picture_after)
            page.locator('[data-camera-turn="right"]').click()
            check('camera: opposite direction returns to the previous orientation',
                  abs(page.evaluate('LabTest.getState().viewState.yaw') - camera_before['yaw']) < 1e-9)
            page.locator('[data-camera-turn="up"]').click()
            page.locator('#camera-fit').click()
            check('camera: fit restores the declared default yaw and pitch',
                  abs(page.evaluate('LabTest.getState().viewState.yaw') - .6) < 1e-9 and
                  abs(page.evaluate('LabTest.getState().viewState.pitch') - .25) < 1e-9)
            page.close()

            page = load('projects/geography/index.html#landforms', 'window.LabTest')
            map_before = page.evaluate('LabTest.getState().viewState')
            check('geography: the first flat view keeps the lesson-specific regional zoom',
                  map_before['projection'] == 'flat' and map_before['zoom'] == 4)
            selected = page.locator('[data-place]').nth(1)
            expected = page.evaluate('GeoData.mountains[1]')
            selected.click()
            located = page.evaluate('LabTest.getState().viewState')
            check('geography: selecting a listed place locates it and keeps the pressed button focused',
                  abs(located['lon'] - expected['lon']) < 1e-9 and abs(located['lat'] - expected['lat']) < 1e-9 and
                  selected.get_attribute('aria-pressed') == 'true' and selected.evaluate('(e)=>document.activeElement===e'))
            page.locator('.map-direction-controls > summary').click()
            map_picture = page.locator('#canvas').screenshot(path=str(out / 'map-before.png'), mask=[page.locator('.map-direction-controls')])
            page.locator('[data-map-turn="right"]').click()
            moved = page.evaluate('LabTest.getState().viewState')
            check('geography: a direction button changes longitude and actual map pixels without changing zoom',
                  abs(moved['lon'] - located['lon'] - 6 / located['zoom']) < 1e-9 and moved['zoom'] == located['zoom'] and
                  map_picture != page.locator('#canvas').screenshot(path=str(out / 'map-after.png'), mask=[page.locator('.map-direction-controls')]))
            page.close()

            page = load('projects/chinese/phrases.html', 'window.PhraseTest')
            page.locator('#search').fill('审查不存在的词语xyz')
            check('phrases: empty search hides the old lesson and exposes a clear action',
                  page.locator('#study').is_hidden() and page.locator('#empty').is_visible() and
                  page.locator('#empty-clear').is_visible() and page.evaluate('PhraseTest.shown().length') == 0)
            page.locator('#empty-clear').click()
            check('phrases: clearing the empty result restores the category and search focus',
                  page.locator('#study').is_visible() and page.locator('#search').input_value() == '' and
                  page.evaluate('PhraseTest.shown().length') == 30 and focus(page, '#search'))
            page.close()

            reduced_context = browser.new_context(viewport={'width': 1200, 'height': 900}, locale='zh-CN', reduced_motion='reduce')
            page = load('projects/biology/microscope/index.html', 'window.MicroscopeTest', reduced_context)
            check('microscope: reduced motion starts with movement disabled in model and checkbox',
                  not page.evaluate('MicroscopeTest.getState().moving') and not page.locator('#moving').is_checked())
            page.locator('#specimen').select_option('leaf')
            still = page.locator('#micro-canvas').screenshot()
            page.wait_for_timeout(180)
            check('microscope: the reduced-motion specimen and its simulation time stay still',
                  page.evaluate('MicroscopeTest.getState().time') == 0 and still == page.locator('#micro-canvas').screenshot())
            page.locator('#objective').select_option('40')
            value(page, '#fine', .7)
            value(page, '#light', 35)
            page.locator('[data-move="1,0"]').click()
            page.locator('#reset').click()
            reset = page.evaluate('MicroscopeTest.getState()')
            check('microscope: reset restores optical controls and stage while keeping the selected specimen',
                  reset['specimen'] == 'leaf' and reset['objective'] == 4 and reset['x'] == reset['y'] == 0 and
                  reset['coarse'] == reset['fine'] == reset['time'] == 0 and reset['light'] == 65 and reset['aperture'] == 60 and
                  not reset['moving'] and not reset['stain'] and page.locator('#objective').input_value() == '4')
            page.locator('#moving').check()
            page.wait_for_function('MicroscopeTest.getState().time>.02')
            check('microscope: an explicit movement choice still advances time',
                  page.evaluate('MicroscopeTest.getState().moving') and page.locator('#moving').is_checked())
            page.close()
            # A fresh preference gives one observable transition; rapid round trips may coalesce.
            motion_context = browser.new_context(viewport={'width': 1200, 'height': 900}, locale='zh-CN', reduced_motion='no-preference')
            page = load('projects/biology/microscope/index.html', 'window.MicroscopeTest', motion_context)
            page.locator('#specimen').select_option('leaf')
            page.wait_for_function('MicroscopeTest.getState().time>.02')
            check('microscope: the ordinary-motion page starts with movement enabled',
                  page.evaluate('MicroscopeTest.getState().moving') and page.locator('#moving').is_checked())
            page.evaluate('''()=>{const query=matchMedia("(prefers-reduced-motion: reduce)");window.__auditMotion={query,changes:[]};query.addEventListener('change',e=>window.__auditMotion.changes.push(e.matches));}''')
            page.emulate_media(reduced_motion='reduce')
            page.wait_for_function('window.__auditMotion.changes.includes(true)')
            page.wait_for_function('!MicroscopeTest.getState().moving')
            stopped = page.evaluate('MicroscopeTest.getState().time')
            page.wait_for_timeout(100)
            check('microscope: turning reduced motion on stops and freezes the running specimen',
                  not page.locator('#moving').is_checked() and page.evaluate('MicroscopeTest.getState().time') == stopped)
            page.close()
            check('all sampled pages have no uncaught JavaScript errors', not report['errors'])
            check('all sampled pages use local runtime resources', not report['externalRequests'])
            reduced_context.close()
            motion_context.close()
            context.close()
            browser.close()
        report['status'] = 'passed'
    except Exception as error:
        report['exception'] = str(error)
        if page is not None and not page.is_closed():
            try:
                page.screenshot(path=str(out / 'failure.png'), full_page=True)
            except Exception:
                pass
        raise
    finally:
        (out / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
        print('REPORT', len(report['checks']), report['status'], flush=True)


if __name__ == '__main__':
    main()
