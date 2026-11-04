#!/usr/bin/env python3
"""All proof routes: step/figure/formula agreement, replay and phone reading."""
from pathlib import Path
import argparse,functools,http.server,json,shutil,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--file',action='store_true');p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/proof-routes');a=p.parse_args()
out=ROOT/a.out;out.mkdir(parents=True,exist_ok=True);server=None;base=a.base
if not a.file and not base:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
report={'mode':'file' if a.file else 'live' if a.base else 'http','checks':[],'errors':[],'limits':['Not a physical iOS/Android device or Windows double-click test.']}
def check(name,ok):
 report['checks'].append({'name':name,'pass':bool(ok)})
 if not ok:raise AssertionError(name)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1280,'height':950},locale='zh-CN',reduced_motion='reduce');page.set_default_timeout(15000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.goto((ROOT/'projects/math/index.html').as_uri() if a.file else base.rstrip('/')+'/projects/math/index.html',wait_until='load');page.wait_for_function('window.MathTest&&window.MathProofVisuals')
  proofs=page.evaluate('Object.entries(MathProofs).map(([id,p])=>({id,routes:p.routes.map(r=>({name:r.name,steps:r.steps.length}))}))')
  screenshots={'multiplication':2,'triangle-area':0,'pythagoras':2,'conics':1,'space-geometry':2,'quadratic':2,'fraction-ops':2}
  for proof in proofs:
   id=proof['id'];page.locator('#topics [data-topic="'+id+'"]').click()
   for ri,r in enumerate(proof['routes']):
    page.locator('#proofRoutes [data-route="'+str(ri)+'"]').click()
    check(f'{id}/{ri}: resets to first step',page.locator('#proofProgress').input_value()=='0')
    for step in range(r['steps']):
     expected=page.evaluate('([id,r,s])=>MathProofVisuals.draw(id,r,s)',[id,ri,step])
     check(f'{id}/{ri}/{step}: figure, reason, formula and highlighted reasoning agree',page.locator('#proofWhy').inner_text()==expected['note'] and page.locator('#proofFormula math').count()==1 and page.locator('#proofFormula annotation').text_content()==expected['formula'] and page.locator('#proofSteps li.proof-current').count()==1 and page.locator('#proofSteps li').nth(step).get_attribute('class')=='proof-current')
     check(f'{id}/{ri}/{step}: reduced motion keeps the completed static construction',page.locator('#proofVisual animateTransform,#proofVisual animate,#proofVisual animateMotion').count()==0)
     check(f'{id}/{ri}/{step}: finite unclipped diagram',page.locator('#proofVisual svg').evaluate('(e)=>{const b=e.getBBox();return !/NaN|undefined|Infinity/.test(e.innerHTML)&&b.x>=-2&&b.y>=-2&&b.x+b.width<=602&&b.y+b.height<=362;}'))
     if step==r['steps']-1:check(f'{id}/{ri}: next ends here',page.locator('#proofStepNext').is_disabled())
     else:page.locator('#proofStepNext').click()
    if screenshots.get(id)==ri:
     page.locator('#proofCard').screenshot(path=str(out/(id+'.png')))
    page.locator('#proofRestart').click();check(f'{id}/{ri}: restart resets',page.locator('#proofProgress').input_value()=='0')
  page.locator('#topics [data-topic="multiplication"]').click();page.locator('#proofPlay').click()
  page.wait_for_function('Number(document.querySelector("#proofProgress").value)>0',timeout=6000)
  page.locator('#proofPlay').click();value=page.locator('#proofProgress').input_value();page.wait_for_timeout(150)
  check('play advances and pause preserves the step',page.locator('#proofPlay').get_attribute('aria-pressed')=='false' and page.locator('#proofProgress').input_value()==value)
  page.locator('#proofPlay').click();page.locator('#topics [data-topic="circle"]').click();check('changing lessons stops playback',page.locator('#proofPlay').get_attribute('aria-pressed')=='false')
  page.locator('#proofProgress').evaluate('(e)=>{e.value=e.max;e.dispatchEvent(new Event("input",{bubbles:true}))');check('timeline seeks to end',page.locator('#proofStepNext').is_disabled())
  page.locator('#proofZoom').click();check('proof zoom exposes a larger scrollable diagram',page.locator('#proofVisual').evaluate('(e)=>e.scrollWidth>e.clientWidth+1'));page.locator('#proofZoom').click()
  for width in [390,320]:
   page.set_viewport_size({'width':width,'height':1000})
   for id in ['multiplication','pythagoras','quadratic','conics','space-geometry','fraction-ops']:
    page.locator('#topics [data-topic="'+id+'"]').click()
    check(f'{width}/{id}: phone page and method controls fit',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1') and page.locator('#proofRoutes').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'))
   page.locator('#proofCard').screenshot(path=str(out/f'phone-{width}.png'))
  touchctx=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='zh-CN')
  touchpage=touchctx.new_page();touchpage.goto((ROOT/'projects/math/index.html').as_uri() if a.file else base.rstrip('/')+'/projects/math/index.html',wait_until='load')
  touchpage.locator('#topics [data-topic="multiplication"]').tap();touchpage.locator('#proofProgress').scroll_into_view_if_needed();touchpage.wait_for_timeout(80)
  slider=touchpage.locator('#proofProgress');box=slider.bounding_box();old=slider.input_value();sy=touchpage.evaluate('scrollY');cdp=touchctx.new_cdp_session(touchpage);x=box['x']+12;y=box['y']+box['height']/2
  def touch(kind,points):cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':xx,'y':yy,'id':1,'radiusX':3,'radiusY':3} for xx,yy in points]})
  touch('touchStart',[(x,y)])
  for i in range(1,9):touch('touchMove',[(x+(box['width']-30)*i/8,y)]);touchpage.wait_for_timeout(18)
  touch('touchEnd',[]);touchpage.wait_for_timeout(80)
  check('trusted finger drag seeks proof timeline without scrolling the page',slider.input_value()!=old and abs(touchpage.evaluate('scrollY')-sy)<=2)
  touchpage.locator('#proofZoom').tap();check('phone zoom permits reading at full diagram scale',touchpage.locator('#proofVisual svg').bounding_box()['width']>=600)
  touchctx.close();check('no runtime exceptions',not report['errors']);browser.close()
 report['status']='passed'
except Exception as error:
 report['status']='failed';report['exception']=str(error);raise
finally:
 (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('PROOF REPORT',len(report['checks']),report.get('status'),flush=True)
 if server:server.shutdown()
