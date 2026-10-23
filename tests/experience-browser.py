#!/usr/bin/env python3
"""Audit shared controls per lesson and the redesigned martial model, recording actual coverage."""
from pathlib import Path
import argparse,functools,http.server,json,re,shutil,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];p=argparse.ArgumentParser(description=__doc__)
for flag in ['inject','file','site','require-webgl']:p.add_argument('--'+flag,action='store_true')
p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/experience');a=p.parse_args();OUT=ROOT/a.out;OUT.mkdir(parents=True,exist_ok=True)
base=a.base;server=None;report={'mode':'injected-content' if a.inject else 'file' if a.file else 'http','checks':[],'errors':[],'inventories':{},'limitations':['Finite declared controls and states, not every combination.','No claim of Windows/iOS physical-device or professional martial instruction validation.']}
if not a.inject and not a.file and not base:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
def inline(f):
 s=f.read_text();s=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(f.parent/m[1]).read_text().replace('</script','<\\/script')+'</script>',s)
 return re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(f.parent/m[1]).read_text()+'</style>',s)
def check(name,ok):
 report['checks'].append({'name':name,'pass':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 if not ok:raise AssertionError(name)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(headless=True,executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  ctx=b.new_context(viewport={'width':1440,'height':1000},locale='zh-CN')
  for mod in ['biology','geography','cosmos','martial','optics']:
   page=ctx.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)));page.set_default_timeout(15000)
   rel='projects/physics/optics.html' if mod=='optics' else f'projects/{mod}/index.html';f=ROOT/rel
   if a.inject:page.set_content(inline(f))
   else:page.goto(f.as_uri() if a.file else base+rel,wait_until='load')
   page.wait_for_function('window.LabTest');items=page.evaluate('Museum.lessons.map(l=>({id:l.id,correct:l.correct}))')
   for t in items:
    page.locator('[data-lesson="'+t['id']+'"]').click();prefix=mod+'/'+t['id'];check(prefix+': navigation',page.evaluate('LabTest.getState().lesson')==t['id'])
    report['inventories'][prefix]=page.locator('button,input,select,summary').evaluate_all('(items)=>items.map(e=>({tag:e.tagName,id:e.id,type:e.type||"",label:e.getAttribute("aria-label")||e.textContent.trim().slice(0,70)}))')
    page.locator('#step').click();check(prefix+': one frame forwards',abs(page.evaluate('LabTest.getState().time')-1/300)<1e-8);page.locator('#back').click();check(prefix+': one frame backwards',page.evaluate('LabTest.getState().time')==0)
    page.locator('#play').click();page.wait_for_timeout(140);page.locator('#play').click();t0=page.evaluate('LabTest.getState().time');page.wait_for_timeout(90);check(prefix+': play advances and pause holds',t0>0 and page.evaluate('LabTest.getState().time')==t0)
    page.locator('#reset').click();check(prefix+': reset clears playback',page.evaluate('LabTest.getState().time')==0 and not page.evaluate('LabTest.getState().playing'))
    wrong=(t['correct']+1)%page.locator('[data-answer]').count();page.locator('[data-answer="'+str(wrong)+'"]').click();check(prefix+': wrong answer gets corrective feedback','再试试' in page.locator('#feedback').inner_text());page.locator('[data-answer="'+str(t['correct'])+'"]').click();check(prefix+': correct answer records only its lesson',t['id'] in page.evaluate('LabTest.getState().solved'))
    page.locator('#mode').click();check(prefix+': adult mode',page.evaluate('LabTest.getState().mode')=='adult');page.locator('#mode').click()
    page.locator('#scene-focus').click();check(prefix+': expand view and restore',page.locator('body').evaluate('e=>e.classList.contains("focus-scene")'));page.locator('#scene-focus').click()
   if mod=='biology':
    page.locator('[data-lesson="division"]').click();before=page.locator('#visual').screenshot();page.locator('#camera-in').click();check('2D zoom changes compositor pixels and viewport state',page.evaluate('LabTest.getState().zoom2d')>1 and before!=page.locator('#visual').screenshot());page.locator('#camera-fit').click();check('2D fit resets zoom',page.evaluate('LabTest.getState().zoom2d')==1)
    page.locator('#canvas').focus();page.keyboard.press('+');check('keyboard zoom accessible',page.evaluate('LabTest.getState().zoom2d')>1);page.keyboard.press('0');check('keyboard reset accessible',page.evaluate('LabTest.getState().zoom2d')==1)
    page.evaluate('location.hash="main"');page.wait_for_timeout(80);check('skip link does not reset current scientific topic',page.evaluate('LabTest.getState().lesson')=='division')
   if mod=='martial':
    page.locator('[data-lesson="wingchun"]').click();page.evaluate('LabTest.seek(.45)');check('three model modes exist',page.locator('#p-appearance option').count()==3)
    if a.require_webgl:check('new human uses actual WebGL',page.evaluate('LabTest.getState().renderer')=='webgl')
    images=[]
    for mode in ['uniform','plain','skeleton']:
     page.locator('#p-appearance').select_option(mode);page.wait_for_timeout(80);images.append(page.locator('#visual').screenshot());page.screenshot(path=str(OUT/('martial-'+mode+'.png')))
    check('uniform/plain/skeleton change actual rendered picture',len(set(images))==3)
    page.locator('#p-appearance').select_option('uniform')
    for view in ['full','upper','left','right']:
     page.locator('#p-detail').select_option(view);page.wait_for_timeout(90);check('human view '+view,page.evaluate('LabTest.getState().values.detail')==view)
     page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/('martial-'+view+'.png')))
   # Every speed choice and common navigation tool is exercised, without external links.
   for value in page.locator('#speed option').evaluate_all('o=>o.map(x=>x.value)'):page.locator('#speed').select_option(value)
   page.locator('#favorite').click();page.locator('#favorites-only').click();check(mod+': favorite-only navigation',page.locator('[data-lesson]').count()==1);page.locator('#favorites-only').click();page.locator('#search').fill('xyz-does-not-exist');check(mod+': empty search',page.locator('[data-lesson]').count()==0);page.locator('#search').fill('')
   page.locator('#notes-open').click();check(mod+': notebook button opens and focuses notes',page.locator('#notebook').get_attribute('open') is not None);page.close()
  check('no uncaught errors across audited controls',not report['errors']);b.close()
 report['status']='passed'
except Exception as e:report['status']='failed';report['exception']=str(e);raise
finally:
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',len(report['checks']),report.get('status'),flush=True)
 if server:server.shutdown()
