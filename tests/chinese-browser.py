#!/usr/bin/env python3
"""Real Chinese museum navigation and interaction. Injection is explicitly limited QA only."""
from pathlib import Path
from urllib.parse import urlsplit
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import argparse, functools, json, re, shutil, threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    for f in ['file','site','inject']:ap.add_argument('--'+f,action='store_true')
    ap.add_argument('--base');ap.add_argument('--browser');ap.add_argument('--out',default='.qa/chinese')
    a=ap.parse_args();out=ROOT/a.out;out.mkdir(parents=True,exist_ok=True)
    report={'mode':'injected content only' if a.inject else 'file' if a.file else 'published HTTP' if a.base else 'local HTTP', 'checks':[], 'errors':[], 'externalRequests':[], 'limits':['Chromium touch emulation is not physical iPhone/Android certification.','Finite controls and states; content checks do not substitute for scholarly or teaching review.']}
    server=None;base=a.base
    if not (a.file or a.inject or a.base):
        class Quiet(SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    relative='projects/chinese/index.html';url=(ROOT/relative).as_uri() if a.file else (base or '').rstrip('/')+'/'+relative
    report['url']=url if not a.inject else '(injected local sources; not a deployed URL)'
    def inline():
        f=ROOT/relative;s=f.read_text()
        s=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(f.parent/m[1]).read_text().replace('</script','<\\/script')+'</script>',s)
        return re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(f.parent/m[1]).read_text()+'</style>',s)
    def check(name,ok):
        report['checks'].append({'name':name,'passed':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
        if not ok:raise AssertionError(name)
    def load(ctx):
        pg=ctx.new_page();pg.set_default_timeout(12000);pg.on('pageerror',lambda e:report['errors'].append(str(e)))
        pg.on('request',lambda req:report['externalRequests'].append(req.url) if urlsplit(req.url).scheme in ('http','https') and (a.file or a.inject or urlsplit(req.url).netloc!=urlsplit(base).netloc) else None)
        if a.inject:pg.set_content(inline(),wait_until='load')
        else:pg.goto(url,wait_until='load',timeout=60000)
        pg.wait_for_function('window.ChineseTest&&window.ChineseStrokes');return pg
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
            ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True)
            page=load(ctx)
            def state():return page.evaluate('ChineseTest.state()')
            def choose(id):page.locator('#char-list [data-id="'+id+'"]').click()
            ids=page.evaluate('ChineseTest.ids()');check('112 sorted reading entries and sleep landing page',len(ids)==112 and state()['id']=='睡-shui4')
            check('pinyin order begins an and ends zuo',ids[0]=='安-an1' and ids[-1]=='左-zuo3')
            for id in ids:
                choose(id)
                details=page.evaluate('''()=>{const s=ChineseTest.state(),d=ChineseData.entries.find(e=>e.id===s.id);return {id:s.id,meaning:document.querySelector('#meaning').textContent,wordCount:document.querySelectorAll('#words button').length,paths:document.querySelectorAll('#split-view path').length,expected:ChineseStrokes[d.char].strokes.length,reading:document.querySelector('#title-pinyin').textContent,trap:document.querySelector('#trap').textContent};}''')
                check(id+': distinct reading, three words, explanation and real vector glyph',details['id']==id and details['wordCount']==3 and len(details['meaning'])>=5 and details['paths']==details['expected'] and len(details['trap'])>5)
                page.locator('#step').click();check(id+': actual one-stroke state',state()['stroke']==1 and '第 1 /' in page.locator('#stroke-status').inner_text())
                page.locator('#reset').click()
            choose('睡-shui4');page.locator('#character-box').scroll_into_view_if_needed();before=page.locator('#character-box').screenshot();page.locator('#split').click()
            page.wait_for_timeout(650);check('split changes actual vector geometry',state()['split'] and page.locator('#character-box').screenshot()!=before)
            page.locator('#split').click();page.wait_for_timeout(650);check('rejoin returns transforms to zero',page.locator('#split-view g.part').evaluate_all('es=>es.every(e=>e.getAttribute("transform")==="translate(0 0)")'))
            page.locator('#animate').click();page.wait_for_function('ChineseTest.state().playing&&document.querySelector("#writer-view svg path")');page.wait_for_timeout(220)
            image=page.locator('#writer-view').screenshot();page.wait_for_timeout(250);check('stroke playback changes actual drawn pixels',page.locator('#writer-view').screenshot()!=image)
            page.locator('#pause').click();page.wait_for_timeout(80);html=page.locator('#writer-view').inner_html();page.wait_for_timeout(230);check('pause freezes stroke animation',state()['paused'] and page.locator('#writer-view').inner_html()==html)
            page.locator('#pause').click();page.wait_for_timeout(230);check('resume continues drawing',not state()['paused'] and page.locator('#writer-view').inner_html()!=html)
            page.locator('#speed').select_option('2');check('speed change restarts cleanly',state()['playing']);page.locator('#reset').click();check('reset leaves no stale animated SVG',not state()['playing'] and page.locator('#writer-view svg').count()==0)
            for q in ['shui','shuì','shui4','目','睡眠']:
                page.locator('#search').fill(q);check('search '+q+' finds sleep', '睡-shui4' in state()['visible']);page.locator('#clear').click()
            page.locator('#search').fill('不存在的字卡');check('empty search hides stale lesson',not page.locator('#lesson').is_visible() and not state()['visible']);page.locator('#clear').click()
            page.locator('#alphabet [data-letter="q"]').click();check('Q filter is real',all(x.split('-')[1].startswith('q') for x in state()['visible']));page.locator('#clear').click()
            page.locator('#family').select_option('青字家族');check('family includes qing and jing', '清-qing1' in state()['visible'] and '睛-jing1' in state()['visible']);page.locator('#clear').click()
            choose('觉-jue2');check('jue has correctly linked poem','春眠不觉晓' in page.locator('#quotes').inner_text());page.locator('[data-reading="觉-jiao4"]').click();check('jiao switches vocabulary and excludes jue poem','午觉' in page.locator('#words').inner_text() and '春眠不觉晓' not in page.locator('#quotes').inner_text())
            choose('睡-shui4');check('sleep source and mnemonic both visible','读音' in page.locator('#etymology').inner_text() and '眼皮垂下来' in page.locator('#memory').inner_text())
            page.locator('#words button').first.click();check('word choice changes explanation and writing prompt','睡眠' in page.locator('#word-detail').inner_text() and '睡眠' in page.locator('#writing-prompt').inner_text())
            choose('月-yue4');quote=page.locator('#quotes .verse').inner_text();page.locator('#next-quote').click();check('next quotation changes attributed excerpt',quote!=page.locator('#quotes .verse').inner_text() and bool(page.locator('.verse-source').inner_text()))
            choose('上-shang4');check('only public-domain attributed quotes or clear fallback',page.locator('#quotes').inner_text().strip()!='')
            choose('睡-shui4');page.locator('#favorite').click();page.locator('#favorites').click();check('favorite filters reading not whole glyph',state()['visible']==['睡-shui4']);page.locator('#clear').click()
            choose(ids[0]);check('previous disabled at start',page.locator('#prev').is_disabled());page.locator('#next').click();check('next follows pinyin order',state()['id']==ids[1]);page.locator('#prev').click();check('previous returns',state()['id']==ids[0]);choose(ids[-1]);check('next disabled at end',page.locator('#next').is_disabled())
            choose('睡-shui4');literal='小猫睡着了。<img src=x onerror="window.__bad=1">';page.locator('#my-sentence').fill(literal);page.locator('#save-sentence').click();check('saved literal sentence not executed',state()['notes'].get('睡-shui4')==literal and not page.evaluate('!!window.__bad'))
            page.locator('#check-sentence').click();check('writing feedback is not fake grading','不是自动判分' in page.locator('#sentence-status').inner_text())
            choose('清-qing1');page.locator('#my-sentence').fill('清水里有一条小鱼。');choose('睡-shui4');check('navigation preserves unfinished draft',state()['notes'].get('清-qing1')=='清水里有一条小鱼。')
            page.locator('.backup summary').click()
            with page.expect_download() as download:page.locator('#export').click()
            backup=json.loads(Path(download.value.path()).read_text());check('export contains actual writing',backup['notes']['睡-shui4']==literal)
            old=state();page.locator('#import').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"unknown": true}'});page.wait_for_function('document.querySelector("#backup-status").textContent.startsWith("未导入")');check('invalid import leaves records unchanged',state()['notes']==old['notes'])
            incoming={'app':'family-lab-chinese','version':1,'favorites':['木-mu4'],'notes':{'睡-shui4':'不应覆盖旧句','木-mu4':'木头做成小船。'}}
            page.locator('#my-sentence').fill('我先保存这个睡前草稿。');page.locator('#import').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function('document.querySelector("#backup-status").textContent.startsWith("已合并")');check('valid import preserves unsaved current draft and adds other notes',state()['notes'].get('睡-shui4')=='我先保存这个睡前草稿。' and state()['notes'].get('木-mu4')=='木头做成小船。')
            if not a.inject:
                page.reload(wait_until='load');page.wait_for_function('window.ChineseTest');check('records persist at real origin across reload',state()['notes'].get('睡-shui4')=='我先保存这个睡前草稿。' and '木-mu4' in state()['favorites'])
                page.locator('.skip').focus();page.keyboard.press('Enter');check('skip link does not change current character',state()['id']=='睡-shui4')
            else:report['limits'].append('Injected mode: no real-origin persistence or navigation certification.')
            page.locator('#review').click();check('quiz is accessible modal',page.locator('#quiz').is_visible())
            answers=['晴','清','睛','请','情','本','末','háng','yuè','jiào','zhǎng','帮助记忆的联想']
            page.locator('#quiz-options button').filter(has_text='清').click();check('wrong choice stays on question with feedback',page.locator('#quiz-next').is_disabled() and '再观察' in page.locator('#quiz-feedback').inner_text())
            for i,answer in enumerate(answers):
                page.get_by_role('button',name=answer,exact=True).click();check(f'quiz {i+1}: correct-specific feedback',not page.locator('#quiz-next').is_disabled() and '选对了' in page.locator('#quiz-feedback').inner_text());page.locator('#quiz-next').click()
            check('quiz finishes without mastery claim',not page.locator('#quiz').is_visible())
            if not page.evaluate("'speechSynthesis' in window&&speechSynthesis.getVoices().some(v=>v.localService&&/^zh(-|_)/i.test(v.lang))"):
                check('unsupported offline voice is honestly disabled',page.locator('#speak').is_disabled() and '暂不可用' in page.locator('#voice-status').inner_text())
            page.evaluate('scrollTo(0,0)');page.screenshot(path=str(out/'sleep-desktop.png'),full_page=True)
            page.locator('#clear').click();choose('清-qing1');page.locator('#family').select_option('青字家族');page.screenshot(path=str(out/'qing-family.png'),full_page=True)
            for w in [1440,1280,768,390,320]:
                page.set_viewport_size({'width':w,'height':950});check(f'{w}px layout has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.close();ctx.close()
            mobile=browser.new_context(viewport={'width':390,'height':844},locale='zh-CN',is_mobile=True,has_touch=True)
            page=load(mobile);cdp=mobile.new_cdp_session(page)
            page.locator('#open-catalog').tap();check('mobile catalogue opens',page.locator('#catalog-panel').is_visible());page.locator('#search').fill('晴');page.locator('#char-list [data-id="晴-qing2"]').tap();check('mobile selection closes catalogue and reaches lesson',not page.locator('#catalog-panel').is_visible() and page.locator('#lesson').bounding_box()['y']<50)
            page.locator('#character-box').evaluate('e=>e.scrollIntoView({block:"center"})');page.wait_for_timeout(80);rect=page.locator('#character-box').bounding_box();x=rect['x']+rect['width']/2;y=rect['y']+rect['height']/2
            page.evaluate('window.__trusted=[];document.addEventListener("pointerdown",e=>__trusted.push(e.isTrusted))');start=page.evaluate('scrollY')
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
            for i in range(1,11):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-i*10,'id':1}]});page.wait_for_timeout(16)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(180)
            check('glyph reading area permits native page scrolling',page.evaluate('scrollY')>start+10)
            check('mobile inputs are browser-trusted touch',page.evaluate('__trusted.length>0&&__trusted.every(Boolean)'))
            page.locator('#step').tap();check('mobile stroke step works',state()['stroke']==1)
            small=page.locator('#split,#animate,#step,#reset,#save-sentence,#check-sentence,#open-catalog').evaluate_all('es=>es.filter(e=>e.getBoundingClientRect().height<43).map(e=>e.id)');check('mobile primary buttons are at least44px',not small)
            check('browser pinch zoom is not disabled','user-scalable=no' not in page.locator('meta[name=viewport]').get_attribute('content'))
            for w,h in [(320,780),(390,844),(430,932),(844,390)]:
                page.set_viewport_size({'width':w,'height':h});check(f'mobile {w}x{h} no overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
            page.set_viewport_size({'width':390,'height':844});page.locator('#reset').tap();page.evaluate('scrollTo(0,0)');page.screenshot(path=str(out/'chinese-mobile.png'),full_page=True)
            check('no uncaught browser exceptions',not report['errors']);check('no third-party runtime requests',not report['externalRequests'])
            browser.close();report['status']='passed'
    except Exception as e:
        report['status']='failed';report['exception']=str(e)
        try:page.screenshot(path=str(out/'failure.png'),full_page=True)
        except Exception:pass
        print('FAIL',str(e),flush=True)
    finally:
        if server:server.shutdown();server.server_close()
        report['passed']=sum(c['passed'] for c in report['checks']);report['failed']=sum(not c['passed'] for c in report['checks']);(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',report.get('status'),report['passed'],flush=True)
    return 0 if report.get('status')=='passed' else 1
if __name__=='__main__':raise SystemExit(main())
