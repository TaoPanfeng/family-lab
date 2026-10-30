#!/usr/bin/env python3
"""Real click/touch and state checks for English, Computing and Music. --inject is limited QA."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse, functools, json, re, shutil, threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--file',action='store_true');p.add_argument('--site',action='store_true');p.add_argument('--inject',action='store_true')
    p.add_argument('--base');p.add_argument('--browser');p.add_argument('--subject',choices=['english','computing','music']);p.add_argument('--out',default='.qa/workshops')
    a=p.parse_args();out=ROOT/a.out;out.mkdir(parents=True,exist_ok=True)
    report={'mode':'injected content only' if a.inject else 'file' if a.file else 'published HTTP' if a.base else 'local HTTP','status':'failed','checks':[],'errors':[],'externalRequests':[],'limits':['Chromium desktop/touch emulation, not physical iPhone/Android certification.','Audio graph/parameters are checked; automated tests cannot certify audible quality or speaker volume.']}
    server=None;base=a.base
    if not (a.file or a.inject or a.base):
        class Quiet(SimpleHTTPRequestHandler):
            def log_message(self,*args):pass
        server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)))
        threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
    def check(name,ok):
        report['checks'].append({'name':name,'passed':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
        if not ok:raise AssertionError(name)
    def load(ctx,subject):
        pg=ctx.new_page();pg.set_default_timeout(12000);pg.on('pageerror',lambda e:report['errors'].append(str(e)))
        pg.on('request',lambda req:report['externalRequests'].append(req.url) if urlsplit(req.url).scheme in ('http','https') and (a.file or a.inject or urlsplit(req.url).netloc!=urlsplit(base).netloc) else None)
        f=ROOT/'projects'/subject/'index.html'
        if a.inject:
            text=f.read_text();text=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(f.parent/m[1]).read_text().replace('</script','<\\/script')+'</script>',text)
            text=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(f.parent/m[1]).read_text()+'</style>',text);pg.set_content(text,wait_until='load')
        else:pg.goto(f.as_uri() if a.file else base.rstrip('/')+f'/projects/{subject}/index.html',wait_until='load',timeout=60000)
        pg.wait_for_function('window.WorkshopTest');return pg
    def state(pg):return pg.evaluate('WorkshopTest.state()')
    def choose(pg,id):
        if pg.locator('#nav-toggle').is_visible() and not pg.locator('#lessons').is_visible():pg.locator('#nav-toggle').click()
        pg.locator(f'[data-lesson="{id}"]').click()
    def english(pg):
        for i,pos in enumerate(['in','on','under','next to']):
            pg.locator(f'[data-pos="{i}"]').click();check('English position '+pos,state(pg)['pos']==pos and pos in pg.locator('#utterance').inner_text())
            x=pg.locator('#picture').inner_html();pg.locator(f'[data-pos="{(i+1)%4}"]').click();check('English geometry '+pos,pg.locator('#picture').inner_html()!=x)
        pg.locator('#quiz').click();check('Quiz hides sentence and translation',pg.locator('#translation').is_hidden() and pg.locator('#positions').is_hidden())
        pg.locator('[data-answer="0"]').click();check('Wrong position gives specific feedback','再看' in pg.locator('#feedback').inner_text())
        pg.locator('[data-answer="1"]').click();check('Correct position is verified','对了' in pg.locator('#feedback').inner_text())
        pg.locator('#explore').click();pg.evaluate('scrollTo(0,0)');pg.screenshot(path=str(out/'english-desktop.png'),full_page=True)
        choose(pg,'sentence')
        for case in range(4):
            pg.locator('[data-word="1"]').click();pg.locator('#check').click();check(f'Incomplete sentence {case}','还没' in pg.locator('#feedback').inner_text())
            pg.locator('#undo').click();check(f'Undo sentence {case}',state(pg)['selected']==[])
            for i in [2,1,0]:pg.locator(f'[data-word="{i}"]').click()
            pg.locator('#check').click();check(f'Wrong order {case}','没有表达' in pg.locator('#feedback').inner_text());pg.locator('#clear').click()
            for i in [0,1,2]:pg.locator(f'[data-word="{i}"]').click()
            pg.locator('#check').click();check(f'Correct sentence and role explanation {case}','对了' in pg.locator('#feedback').inner_text() and pg.locator('.role').count()==3)
            pg.locator('#next-case').click()
        choose(pg,'number')
        for noun,plural in [('apple','apples'),('book','books'),('box','boxes'),('child','children')]:
            pg.locator('#noun').select_option(noun)
            for n in [1,2,6]:
                pg.locator('#count').fill(str(n));pg.locator('#count').dispatch_event('input')
                check(f'Count and word form {noun} {n}',state(pg)['count']==n and pg.locator('#phrase').inner_text().endswith(noun if n==1 else plural))
        pg.locator('#number-quiz').click();pg.locator('[data-choice="book"]').click();check('Number quiz rejects singular for three','再数' in pg.locator('#feedback').inner_text())
        pg.locator('[data-choice="books"]').click();check('Number quiz accepts plural','对了' in pg.locator('#feedback').inner_text())
        pg.locator('#number-explore').click()
    def computing(pg):
        pg.locator('#play').click();check('Empty robot program cannot run',not state(pg)['playing'] and state(pg)['progress']==0)
        pg.locator('[data-cmd="R"]').click();pg.locator('[data-cmd="F"]').click()
        pg.locator('#step').click();pg.locator('#step').click()
        check('Robot boundary collision stops without moving',state(pg)['robot']['status']=='blocked' and state(pg)['robot']['y']==4)
        pg.locator('#demo').click();check('Three program blocks expand to nine actions',state(pg)['commands']==['F4','L','F4'] and state(pg)['end']==9)
        for i in range(9):pg.locator('#step').click();check(f'Robot step {i+1}',state(pg)['progress']==i+1)
        check('Robot reached goal',state(pg)['robot']['status']=='goal' and '到了' in pg.locator('#feedback').inner_text())
        pg.locator('#seek').fill('500');pg.locator('#seek').dispatch_event('input');check('Robot timeline inspects same execution trace',state(pg)['progress']==4.5)
        pg.locator('#reset').click();pg.locator('#play').click();pg.wait_for_function('WorkshopTest.state().progress>.2');pg.locator('#play').click();before=state(pg)['progress'];pg.wait_for_timeout(220)
        check('Robot pause really freezes fractional position',state(pg)['progress']==before and not state(pg)['playing'])
        pg.locator('#save-work').click();check('Robot program saved as data, not executable code',state(pg)['saved']['works']['program']==['F4','L','F4'])
        pg.evaluate('scrollTo(0,0)');pg.screenshot(path=str(out/'robot-desktop.png'),full_page=True)
        choose(pg,'pixels');check('Exactly 36 individually operable pixels',pg.locator('[data-pixel]').count()==36)
        pg.locator('#all-dark').click();check('Uniform bitmap RLE takes 24 bits',state(pg)['encoding']['encodedBits']==24)
        pg.locator('#checker').click();check('Checker bitmap RLE expands to 114 bits',state(pg)['encoding']['encodedBits']==114)
        pg.locator('#pixel-undo').click();check('Bitmap undo restores uniform data',state(pg)['bits']==[1]*36)
        pg.locator('[data-pixel="0"]').click();check('Pixel and binary row agree',state(pg)['bits'][0]==0 and pg.locator('#raw').inner_text().startswith('011111'))
        pg.locator('#save-work').click();check('Artwork saved',state(pg)['saved']['works']['pixels']==state(pg)['bits'])
        choose(pg,'search')
        for target,binary in [(1,5),(16,1),(32,6)]:
            pg.locator('#target').fill(str(target));pg.locator('#target').dispatch_event('input')
            for _ in range(max(target,binary)):pg.locator('#step').click()
            check(f'Search target {target}: exact counts and both found',state(pg)['linear']==target and state(pg)['binary']==binary and '找到了' in pg.locator('#linear-state').inner_text() and '找到了' in pg.locator('#binary-state').inner_text())
        pg.locator('#reset').click();pg.locator('#play').click();pg.wait_for_function('WorkshopTest.state().step>=2');pg.locator('#play').click();before=state(pg)['step'];pg.wait_for_timeout(550);check('Search pause cancels timer',state(pg)['step']==before)
        choose(pg,'robot');check('Saved robot program survives lesson switch',state(pg)['commands']==['F4','L','F4'])
    def music(pg):
        check('Music is silent before explicit consent',state(pg)['audio']['context']=='not-created' and not state(pg)['audio']['enabled'])
        before=pg.locator('#wave').inner_html();pg.locator('[data-note="7"]').click();check('High do doubles frequency and changes waveform',abs(state(pg)['frequency']-523.25113)<.01 and pg.locator('#wave').inner_html()!=before)
        check('Touching piano while muted creates no audio',state(pg)['audio']['events']==[])
        pg.locator('#audio').click();pg.wait_for_function('WorkshopTest.state().audio.enabled');check('Enabling sound alone plays nothing',state(pg)['audio']['events']==[])
        pg.locator('[data-note="5"]').click();pg.wait_for_function('WorkshopTest.state().audio.energy>0.00001');check('A4 produces actual audio signal at 440Hz',state(pg)['audio']['events'][-1]['frequency']==440)
        pg.locator('#octave').click();events=state(pg)['audio']['events'];check('Octave pair scheduled with 2:1 ratio and gap',abs(events[-1]['frequency']/events[-2]['frequency']-2)<1e-10 and abs(events[-1]['time']-events[-2]['time']-.6)<.01)
        pg.locator('#silence').click();check('Immediate stop cancels scheduled sounds',state(pg)['audio']['nodes']==0)
        pg.locator('#volume').fill('0');pg.locator('#volume').dispatch_event('input');check('Zero volume does not change pitch',state(pg)['audio']['volume']==0 and state(pg)['frequency']==440)
        pg.locator('#audio').click();pg.wait_for_function('!WorkshopTest.state().audio.enabled');check('Mute suspends audio context',state(pg)['audio']['context']=='suspended')
        pg.evaluate('scrollTo(0,0)');pg.locator('#volume').fill('35');pg.locator('#volume').dispatch_event('input');pg.screenshot(path=str(out/'music-pitch.png'),full_page=True)
        choose(pg,'rhythm');check('Lesson switch starts muted',not state(pg)['audio']['enabled'])
        check('Sixteen rhythm switches',pg.locator('[data-cell]').count()==16)
        pg.locator('#tempo').fill('60');pg.locator('#tempo').dispatch_event('input');check('60BPM gives 8 seconds for eight beats',state(pg)['seconds']==8)
        pg.locator('#play').click();pg.wait_for_function('WorkshopTest.state().shown>=1');pg.locator('#play').click();before=state(pg)['shown'];pg.wait_for_timeout(350);check('Pause freezes cursor and sound schedule',state(pg)['shown']==before and not state(pg)['playing'])
        pg.locator('#seek').fill('7');pg.locator('#seek').dispatch_event('input');check('Timeline positions seventh beat without playing',state(pg)['shown']==6 and not state(pg)['playing'])
        pg.locator('#clear').click();pg.locator('#audio').click();pg.wait_for_function('WorkshopTest.state().audio.enabled');pg.locator('#step').click();check('Rest occupies a beat without an oscillator',state(pg)['shown']==0 and state(pg)['audio']['events']==[])
        pg.locator('[data-cell="0,0"]').click();pg.locator('[data-cell="1,0"]').click();pg.locator('#reset').click();pg.locator('#step').click();events=state(pg)['audio']['events'];check('Two rows schedule two tones on same beat',len(events)==2 and {e['frequency'] for e in events}=={150,900} and abs(events[0]['time']-events[1]['time'])<.02)
        pg.locator('#save-work').click();check('Rhythm pattern saved',state(pg)['saved']['works']['rhythm']==state(pg)['pattern'])
        choose(pg,'melody');check('Forty melody cells and five pitch levels',pg.locator('[data-cell]').count()==40)
        pg.locator('#clear').click();pg.locator('[data-cell="0,0"]').click();pg.locator('[data-cell="4,0"]').click();check('One note per melody column',state(pg)['pattern'][0]==4 and pg.locator('[data-cell$=",0"][aria-pressed=true]').count()==1)
        pg.locator('[data-cell="4,0"]').click();check('Tapping selected note makes a rest',state(pg)['pattern'][0]==-1)
        pg.locator('#demo').click();pg.locator('#tempo').fill('180');pg.locator('#tempo').dispatch_event('input');pg.locator('#audio').click();pg.wait_for_function('WorkshopTest.state().audio.enabled');pg.locator('#play').click();pg.wait_for_function('!WorkshopTest.state().playing&&WorkshopTest.state().shown===7',timeout=10000)
        events=state(pg)['audio']['events'];check('Eight-note melody plays once and stops',len(events)==8 and state(pg)['audio']['nodes']==0)
        check('Audio beat timing matches tempo',all(abs(events[i+1]['time']-events[i]['time']-1/3)<.005 for i in range(7)))
        pg.locator('#save-work').click();check('Melody saved',state(pg)['saved']['works']['melody']==state(pg)['pattern'])
        pg.evaluate('scrollTo(0,0)');pg.screenshot(path=str(out/'music-melody.png'),full_page=True)
        choose(pg,'rhythm');check('Saved rhythm survives scene switch',state(pg)['pattern'][0]==1 and state(pg)['pattern'][8]==1)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
            for subject in ([a.subject] if a.subject else ['english','computing','music']):
                ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True);pg=load(ctx,subject)
                check(subject+': exactly three distinct lessons',len(pg.evaluate('WorkshopTest.ids()'))==3)
                for id in pg.evaluate('WorkshopTest.ids()'):
                    choose(pg,id);check(subject+id+': distinct topic and complete rationale',state(pg)['lesson']==id and pg.locator('#steps li').count()==3 and len(pg.locator('#explain').inner_text())>30)
                    pg.locator('#mode').click();check(subject+id+': adult explanation',state(pg)['mode']=='adult');pg.locator('#mode').click()
                choose(pg,pg.evaluate('WorkshopTest.ids()[0]'))
                if subject=='english':english(pg)
                if subject=='computing':computing(pg)
                if subject=='music':music(pg)
                # Exercise shared controls on every new museum.
                pg.locator('#favorite').click();check(subject+': favorite saved',state(pg)['lesson'] in state(pg)['saved']['favorites'])
                pg.locator('#favorites').click();check(subject+': favorite filter',pg.locator('[data-lesson]').count()==1);pg.locator('#favorites').click()
                pg.locator('#search').fill('不会存在的主题');check(subject+': empty search feedback',pg.locator('#empty').is_visible());pg.locator('#search').fill('')
                pg.locator('#notebook summary').click();pg.locator('#note').fill('我发现：<script>不是代码</script>');pg.locator('#save-note').click()
                check(subject+': note preserved as text',state(pg)['saved']['notes'][state(pg)['lesson']]=='我发现：<script>不是代码</script>')
                with pg.expect_download() as info:pg.locator('#export').click()
                f=out/(subject+'-backup.json');info.value.save_as(str(f));backup=json.loads(f.read_text());check(subject+': exported correct subject',backup['subject']==subject)
                invalid=out/'invalid.json';invalid.write_text('{"bad":true}');pg.locator('#import').set_input_files(str(invalid));pg.wait_for_function('document.querySelector("#status").textContent.includes("未导入")');check(subject+': invalid import kept note',len(state(pg)['saved']['notes'])==1)
                pg.locator('#import').set_input_files(str(f));pg.wait_for_function('document.querySelector("#status").textContent.includes("已合并")');check(subject+': merge kept original text',len(state(pg)['saved']['notes'])==1)
                pg.evaluate('scrollTo(0,0)');pg.screenshot(path=str(out/(subject+'-full.png')),full_page=True);ctx.close()
                mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,locale='zh-CN');mp=load(mobile,subject)
                check(subject+': mobile collapsed navigation',not mp.locator('#lessons').is_visible())
                mp.locator('#nav-toggle').tap();mp.locator('[data-lesson]').nth(1).tap();check(subject+': mobile selection closes directory',not mp.locator('#lessons').is_visible())
                check(subject+': no page horizontal overflow',mp.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
                if subject=='english':
                    mp.locator('[data-word="0"]').tap();check('Phone can add a sentence word',state(mp)['selected']==['I'])
                elif subject=='computing':
                    old=state(mp)['bits'][0];mp.locator('[data-pixel="0"]').tap();check('Phone can toggle a pixel',state(mp)['bits'][0]!=old)
                else:
                    old=state(mp)['pattern'][0];mp.locator('[data-cell="0,0"]').tap();check('Phone can toggle a rhythm beat',state(mp)['pattern'][0]!=old)
                    wrap=mp.locator('.matrix-wrap');wrap.scroll_into_view_if_needed();box=wrap.bounding_box();d=mobile.new_cdp_session(mp);x=box['x']+box['width']-20;y=box['y']+box['height']/2
                    d.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
                    for shift in range(20,181,20):d.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-shift,'y':y,'id':1}]})
                    d.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});mp.wait_for_timeout(200)
                    check('Phone can scroll beat grid without shifting page horizontally',wrap.evaluate('e=>e.scrollLeft')>20 and mp.evaluate('scrollX')==0)
                mp.set_viewport_size({'width':320,'height':844});check(subject+': 320px no page overflow',mp.evaluate('document.documentElement.scrollWidth<=innerWidth+1'));mp.set_viewport_size({'width':390,'height':844})
                mp.screenshot(path=str(out/(subject+'-mobile.png')),full_page=True)
                # Trusted touch scroll over the scene: no global touch lock.
                surface=mp.locator('#experiment .scene, #experiment .matrix-wrap').first;surface.scroll_into_view_if_needed();cdp=mobile.new_cdp_session(mp);before=mp.evaluate('scrollY');rect=surface.bounding_box();x=rect['x']+rect['width']/2;y=min(650,max(240,rect['y']+rect['height']/2))
                cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
                for d in range(20,181,20):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-d,'id':1}]})
                cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});mp.wait_for_timeout(300)
                check(subject+': scene allows ordinary vertical touch scrolling',mp.evaluate('scrollY')>before+20)
                mobile.close()
            check('No uncaught browser errors',not report['errors']);check('No runtime external requests',not report['externalRequests']);browser.close();report['status']='passed'
    except Exception as exc:
        report['fatal']=str(exc)
        raise
    finally:
        report['passed']=sum(x['passed'] for x in report['checks']);report['failed']=sum(not x['passed'] for x in report['checks']);(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
        if server:server.shutdown()
if __name__=='__main__':main()
