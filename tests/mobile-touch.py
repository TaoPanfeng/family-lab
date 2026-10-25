#!/usr/bin/env python3
"""Trusted Chromium touch input: native page scroll vs model drag/pinch, not mouse clicks.
Emulation is not physical iPhone/Safari certification. --inject does not certify navigation.
"""
from pathlib import Path
import argparse,base64,functools,http.server,json,re,shutil,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
for flag in ['inject','file','site','require-webgl']:p.add_argument('--'+flag,action='store_true')
p.add_argument('--modules',default='geography,biology,cosmos,martial,optics,home,math,history,physics,posture,chemistry,astronomy');p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/mobile');a=p.parse_args();OUT=ROOT/a.out;OUT.mkdir(parents=True,exist_ok=True)
base=a.base;server=None
report={'mode':'injected-content' if a.inject else 'file' if a.file else 'http','input':'CDP Input.dispatchTouchEvent (browser-trusted)','checks':[],'errors':[],'skipped':[],'limits':['Chromium touch emulation, not physical iOS/Android Safari/Chrome hardware.','Finite gestures and control states, not every possible combination.']}
if not a.inject and not a.file and not base:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
def inline(f):
 s=f.read_text();scripts=[]
 def replace(m):
  scripts.append('<script>'+re.sub(r'</script',r'<\\/script',(f.parent/m[1]).read_text(),flags=re.I)+'</script>');return ''
 s=re.sub(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*</script>',replace,s)
 s=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',lambda m:'<style>'+(f.parent/m[1]).read_text()+'</style>',s)
 return s.replace('</body>',''.join(scripts)+'</body>')
def check(name,ok,detail=None):
 report['checks'].append({'name':name,'pass':bool(ok),'detail':detail});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 if not ok:
  try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
  except Exception:pass
  raise AssertionError(name+': '+str(detail))
def center(page,selector):
 el=page.locator(selector);el.evaluate('e=>e.scrollIntoView({block:"center",inline:"center",behavior:"instant"})');page.wait_for_timeout(100);r=el.bounding_box();return r['x']+r['width']/2,r['y']+r['height']/2

def touch(c,type,points):c.send('Input.dispatchTouchEvent',{'type':type,'touchPoints':[{'x':x,'y':y,'id':i,'radiusX':3,'radiusY':3} for i,x,y in points]})
def swipe(page,c,selector,dx=22,dy=-70):
 x,y=center(page,selector);start=page.evaluate('scrollY');touch(c,'touchStart',[(1,x,y)])
 for i in range(1,11):touch(c,'touchMove',[(1,x+dx*i/10,y+dy*i/10)]);page.wait_for_timeout(16)
 touch(c,'touchEnd',[]);page.wait_for_timeout(120);return start,page.evaluate('scrollY')
def pinch(page,c,selector):
 x,y=center(page,selector);start=page.evaluate('scrollY');touch(c,'touchStart',[(1,x-25,y),(2,x+25,y)])
 for i in range(1,9):touch(c,'touchMove',[(1,x-25-i*3,y),(2,x+25+i*3,y)]);page.wait_for_timeout(16)
 # Lift one finger, then move the remaining pointer: no jump or false tap.
 touch(c,'touchEnd',[(1,x-49,y)]);touch(c,'touchMove',[(1,x-46,y-3)]);touch(c,'touchEnd',[]);page.wait_for_timeout(90)
 return start,page.evaluate('scrollY')
def range_drag(page,c,selector):
 el=page.locator(selector).first;el.evaluate('e=>e.scrollIntoView({block:"center",behavior:"instant"})');page.wait_for_timeout(60);r=el.bounding_box();old=float(el.input_value());start=page.evaluate('scrollY');mn=float(el.get_attribute('min') or 0);mx=float(el.get_attribute('max') or 100);fraction=(old-mn)/(mx-mn);x=r['x']+12+(r['width']-24)*fraction;y=r['y']+r['height']/2;dest=r['x']+r['width']*(.8 if fraction<.5 else .2)
 touch(c,'touchStart',[(1,x,y)])
 for i in range(1,9):touch(c,'touchMove',[(1,x+(dest-x)*i/8,y+4*i/8)]);page.wait_for_timeout(18)
 touch(c,'touchEnd',[]);page.wait_for_timeout(60)
 check(selector+': slider drag changes its actual value',float(el.input_value())!=old)
 check(selector+': slider drag does not scroll page',abs(page.evaluate('scrollY')-start)<=2)

def layout(page,slug):
 for w,h in [(320,780),(390,844),(430,932),(844,390)]:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(60);m=page.evaluate('({w:innerWidth,scroll:document.documentElement.scrollWidth})');check(slug+f': layout {w}x{h}',m['scroll']<=m['w']+1,m)
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(120)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  ctx=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1,locale='zh-CN')
  def load(rel,ready):
   page=ctx.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:report['errors'].append(str(e)));f=ROOT/rel
   if a.inject:page.set_content(inline(f),wait_until='load')
   else:page.goto(f.as_uri() if a.file else base+rel,wait_until='load')
   page.wait_for_function(ready);return page,ctx.new_cdp_session(page)
  for mod,topic in [('geography','globe'),('biology','division'),('cosmos','orbit'),('martial','wingchun'),('optics','double-slit')]:
   if mod not in a.modules.split(','):continue
   rel='projects/physics/optics.html' if mod=='optics' else f'projects/{mod}/index.html';page,c=load(rel,'window.LabTest')
   ids=page.evaluate('Museum.lessons.map(l=>l.id)');topic=topic if topic in ids else ids[0]
   page.locator('[data-lesson="'+topic+'"]').tap();page.wait_for_timeout(80)
   selector='.three-canvas' if page.locator('.three-canvas').count() else '#canvas'
   page.evaluate('window.__trusted=[];document.querySelector("#visual").addEventListener("pointerdown",e=>__trusted.push(e.isTrusted))')
   before=page.evaluate('LabTest.getState()');shot0=page.locator('#visual').screenshot();ys=swipe(page,c,selector);after=page.evaluate('LabTest.getState()')
   check(mod+': scene drag does not scroll the page',abs(ys[1]-ys[0])<=2,ys)
   if mod=='geography':check('globe: one finger really rotates',before['viewState']['lon']!=after['viewState']['lon'])
   if mod in ['martial','cosmos']:
    if a.require_webgl:check(mod+': genuine WebGL scene',after['renderer']=='webgl')
    if after.get('viewState'):check(mod+': drag changes camera',before['viewState']!=after['viewState'])
    else:report['skipped'].append(mod+': WebGL unavailable locally; CI requires it.')
   before=page.evaluate('LabTest.getState()');ys=pinch(page,c,selector);after=page.evaluate('LabTest.getState()')
   check(mod+': pinch does not scroll page',abs(ys[1]-ys[0])<=2,ys)
   if mod=='geography':check('globe: pinch changes scale',after['viewState']['zoom']>before['viewState']['zoom'])
   elif after.get('viewState'):check(mod+': pinch moves camera closer',after['viewState']['radius']<before['viewState']['radius'])
   else:check(mod+': pinch enlarges 2D illustration',after['zoom2d']>before['zoom2d'])
   # Cancellation must not leave a stuck drag; a new gesture can start immediately.
   x,y=center(page,selector);touch(c,'touchStart',[(1,x,y)]);touch(c,'touchCancel',[]);ys=swipe(page,c,selector)
   check(mod+': cancelled touch releases for next gesture',abs(ys[1]-ys[0])<=2)
   check(mod+': browser emitted trusted touch pointers',page.evaluate('__trusted.length>0&&__trusted.every(Boolean)'))
   page.locator('#touch-mode').tap();before=page.evaluate('LabTest.getState()');ys=swipe(page,c,selector,0,-95);after=page.evaluate('LabTest.getState()')
   check(mod+': explicit reading mode permits native page scroll',ys[1]>ys[0]+10,ys)
   check(mod+': reading swipe does not rotate/zoom model',before['viewState']==after['viewState'] and before['zoom2d']==after['zoom2d'])
   page.locator('#touch-mode').tap();page.locator('#camera-fit').tap();range_drag(page,c,'#timeline')
   page.locator('#reset').tap();check(mod+': reset retains interaction mode',page.locator('#visual').get_attribute('data-touch-mode')=='model')
   ys=swipe(page,c,'.intro',0,-90);check(mod+': text remains normally scrollable',ys[1]>ys[0]+10,ys)
   page.locator('#favorite').tap();check(mod+': favorite tap works',page.locator('#favorite').get_attribute('aria-pressed')=='true')
   page.locator('#mode').tap();check(mod+': explanation mode tap works',page.evaluate('LabTest.getState().mode')=='adult')
   small=page.locator('#scene-focus,#camera-fit,#camera-in,#camera-out,#play,#step,#reset').evaluate_all('es=>es.filter(e=>e.getBoundingClientRect().height<43).map(e=>e.id)');check(mod+': key buttons at least 44 CSS px',not small,small)
   layout(page,mod);page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/(mod+'-mobile.png')),full_page=True);page.close()
  # Existing, independent applications keep their own layouts and workflows.
  for mod,rel,ready in [('home','index.html','document.querySelector("[data-project]")'),('math','projects/math/index.html','window.MathTest'),('history','projects/history/index.html','document.querySelector("[data-action=nav]")'),('physics','projects/physics/index.html','window.GuanWu'),('posture','projects/posture/index.html','window.PostureLab'),('chemistry','projects/chemistry/chemistry-explorer.html','document.querySelector("button")'),('astronomy','projects/astronomy/日月地实验室.html','window.LabV2')]:
   if mod not in a.modules.split(','):continue
   page,c=load(rel,ready)
   if mod=='math':
    ident=page.evaluate('MathAtlas.topics.find(t=>t.lab==="fractions").id');page.locator('#topics [data-topic="'+ident+'"]').tap();check('math: choosing a topic reaches content, not top of navigation',page.locator('#content').bounding_box()['y']<100)
    range_drag(page,c,'#controls input[type=range]');page.locator('#stepNext').tap();check('math: step button is touch-sized',page.locator('#stepNext').bounding_box()['height']>=44)
   if mod=='chemistry':
    page.locator('.menu-toggle').tap();check('chemistry: menu opens on tap',page.locator('.menu-toggle').get_attribute('aria-expanded')=='true');page.locator('.sidebar [data-go=periodic]').tap();check('chemistry: topic closes the navigation',page.locator('.menu-toggle').get_attribute('aria-expanded')=='false');page.wait_for_timeout(80)
   if mod=='history':
    page.locator('#navigation [data-view="atlas"]').tap();page.wait_for_selector('#atlas-svg');old=page.locator('#atlas-svg').get_attribute('viewBox');ys=swipe(page,c,'#atlas-svg');check('history: map drag stays in map',abs(ys[1]-ys[0])<=2,ys);check('history: touch pans map',old!=page.locator('#atlas-svg').get_attribute('viewBox'));old=float(page.locator('#atlas-svg').get_attribute('viewBox').split()[2]);pinch(page,c,'#atlas-svg');check('history: two fingers zoom the map',float(page.locator('#atlas-svg').get_attribute('viewBox').split()[2])<old)
   if mod=='physics':
    page.locator('#open-library').tap();check('physics: mobile library opens',page.locator('#library').evaluate('e=>e.classList.contains("open")'));page.locator('#close-library').tap();range_drag(page,c,'#timeline')
   if mod=='posture':
    old=page.locator('#sceneCanvas').screenshot();ys=swipe(page,c,'#sceneCanvas');check('posture: rotation stays inside canvas',abs(ys[1]-ys[0])<=2);check('posture: touch changes rendered scene',old!=page.locator('#sceneCanvas').screenshot());pinch(page,c,'#sceneCanvas');range_drag(page,c,'#heightRange')
   if mod=='astronomy':
    page.locator('[data-enter="research"]').tap();page.wait_for_timeout(300)
    fallback=page.evaluate('!!LabApp.getScene().isFallback')
    if a.require_webgl:check('astronomy: real WebGL',not fallback)
    if not fallback:
     old=page.evaluate('LabApp.getState().camera');ys=swipe(page,c,'#scene-host canvas');check('astronomy: earth drag stays inside scene',abs(ys[1]-ys[0])<=2);check('astronomy: camera turns',page.evaluate('LabApp.getState().camera')!=old);pinch(page,c,'#scene-host canvas')
    else:report['skipped'].append('astronomy: local fallback; real drag is mandatory in CI')
   layout(page,mod);page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/(mod+'-mobile.png')));page.close()
  check('no uncaught JavaScript errors during mobile controls',not report['errors'],report['errors']);browser.close()
 report['status']='passed'
except Exception as e:
 report['status']='failed';report['exception']=str(e)
 try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
 except Exception:pass
 raise
finally:
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',len(report['checks']),report.get('status'),flush=True)
 if server:server.shutdown()
