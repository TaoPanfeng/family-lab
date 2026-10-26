#!/usr/bin/env python3
"""Teaching-content interactions, typesetting, new chemistry, optics, and continuous human.
Finite Chrome validation is not a content peer review or physical-device certification.
"""
from pathlib import Path
import argparse,functools,http.server,json,re,shutil,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
for flag in ['inject','file','site','require-webgl']:p.add_argument('--'+flag,action='store_true')
p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/learning');a=p.parse_args();OUT=ROOT/a.out;OUT.mkdir(parents=True,exist_ok=True)
base=a.base;server=None;report={'mode':'injected-content' if a.inject else 'file' if a.file else 'http','checks':[],'errors':[],'requests':[],'limits':['Chrome automation, not physical phone certification.','Examples are authored teaching content, not academic peer review.','Microscope is synthetic, human mesh is retargeted, motion not captured.']}
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
def value(page,s,v):page.locator(s).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(v))
def layouts(page,name):
 for width,height in [(320,780),(390,844),(768,1024),(1440,1050)]:
  page.set_viewport_size({'width':width,'height':height});check(f'{name} layout {width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  if width==390:page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/(name+'-mobile.png')))
def shot(page,name):page.screenshot(path=str(OUT/(name+'.png')))
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':1440,'height':1050},locale='zh-CN')
  def load(rel,ready):
   page=context.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:report['errors'].append(str(e)))
   page.on('request',lambda r:report['requests'].append(r.url) if r.url.startswith(('http:','https:')) and not(base and r.url.startswith(base)) else None)
   f=ROOT/rel
   if a.inject:page.set_content(inline(f),wait_until='load')
   else:page.goto(f.as_uri() if a.file else base+rel,wait_until='load')
   page.wait_for_function(ready);return page
  q=load('projects/math/index.html','window.MathTest');ids=q.evaluate('MathTest.ids()')
  for id in ids:
   q.evaluate('(id)=>MathTest.select(id,false)',id)
   for e in [0,1]:
    q.locator('[data-example="'+str(e)+'"]').click();q.locator('#stepAll').click()
    check(f'math/{id}/case{e}: real derivation and MathML',q.locator('#steps li').count()==3 and q.locator('#teaching math').count()>0 and q.locator('.katex-error').count()==0)
    if e:check(id+': alternate equation matches its actual case',q.evaluate('()=>document.querySelector("#teaching-formula annotation").textContent===MathTeaching[MathTest.getState().topic].alternate.steps.find(s=>s.includes("\\\\(")).match(/\\\\\\(([\\s\\S]*?)\\\\\\)/)[1]'))
   q.locator('[data-example="0"]').click()
  q.evaluate('MathTest.select("logic",false)');check('logic: no fruit population tool shown as primary',q.locator('.experiment').is_hidden() and q.locator('#logic-width').is_visible());q.locator('#logic-direction').click();check('logic: unequal rectangle is a counterexample','找到反例' in q.locator('#logic-truth').inner_text());value(q,'#logic-height',5);check('logic: equality does not prove universal converse','一个符合例子不能证明' in q.locator('#logic-feedback').inner_text());q.locator('#teaching').scroll_into_view_if_needed();shot(q,'logic')
  for id in ['sets','shapes','commutative','direction','coordinates','data-count','sorting','patterns','order-operations','symmetry','continuity','limits','fraction-ops','identities','function-domain','function-transform','sine-cosine-law','dot-product','orthogonal','conditional','spread','logarithms']:
   q.evaluate('(id)=>MathTest.select(id,false)',id);before=q.locator('.focused-picture').screenshot()
   for el in q.locator('[data-lesson-control]').all():
    for n in [el.get_attribute('min'),el.get_attribute('max')]:el.evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input"));}',n);check(id+': parameter produces finite display',q.locator('.focused-result math').count()>0 and 'NaN' not in q.locator('.focused-lab').inner_text())
   for el in q.locator('[data-lesson-action]').all():el.click()
   if id=='sets':q.locator('[data-member="A5"]').click();check('sets: actual member selection',5 in q.evaluate('MathLessonVisuals.state().st.A'))
   check(id+': dedicated diagram reacts',before!=q.locator('.focused-picture').screenshot() or id in ['commutative','shapes','conditional'])
  q.evaluate('MathTest.select("counting",false)');q.locator('[data-count="0"]').click();q.locator('[data-count="1"]').click();check('counting: one-to-one visited tokens', '2 / 5' in q.locator('.concrete').inner_text())
  q.evaluate('MathTest.select("addition",false)');q.locator('[data-example="1"]').click();check('addition second case is 6+4, not fixed 7+5','6+4=10' in q.locator('#teaching-formula annotation').text_content())
  q.evaluate('MathTest.select("division",false)');q.evaluate('MathTest.set("n",17);MathTest.set("d",5)');check('integer division leaves two objects undistributed',q.locator('.concrete circle[fill="#969e9f"]').count()==2)
  q.evaluate('MathTest.select("matrices",false)');q.locator('#teaching').scroll_into_view_if_needed();check('matrix fences cover both rows',q.locator('#teaching-formula math').first.evaluate('e=>e.querySelector("mo[fence]").getBoundingClientRect().height>=e.querySelector("mtable").getBoundingClientRect().height*.9'));shot(q,'matrix-typesetting');layouts(q,'math');q.close()
  q=load('projects/chemistry/experiments/index.html','window.ChemLabTest');chemids=q.evaluate('ChemTimeline.lessons.map(l=>l.id)')
  for id in chemids:
   q.evaluate('(id)=>ChemLabTest.select(id)',id)
   for i in range(5):
    q.locator('[data-stage="'+str(i)+'"]').click();state=q.evaluate('ChemLabTest.getState()');check(f'chem/{id}/{i}: stage and word explanation',state['index']==i and bool(q.locator('#stage-description').inner_text()))
    if state['stage'].get('reaction'):check(id+': balanced formula rendered',q.locator('#equation math').count()>0 and '→' in q.locator('#word-equation').inner_text())
   q.locator('#reset').click();q.locator('#play').click();q.wait_for_timeout(180);q.locator('#play').click();t=q.evaluate('ChemLabTest.getState().t');q.wait_for_timeout(100);check(id+': playback and pause',t>0 and q.evaluate('ChemLabTest.getState().t')==t)
  q.evaluate('ChemLabTest.select("carbon-dioxide");ChemLabTest.seek(.72)');before=q.locator('#experiment-svg').screenshot();q.evaluate('ChemLabTest.seek(.99)');check('CO2: pouring and extinction visually differ',before!=q.locator('#experiment-svg').screenshot());check('CO2: two flames extinguished',q.evaluate('ChemLabTest.getState().lowFlame===0&&ChemLabTest.getState().highFlame===0'));shot(q,'co2');layouts(q,'chemistry');q.close()
  q=load('projects/biology/microscope/index.html','window.MicroscopeTest')
  box=q.locator('#micro-canvas').bounding_box();check('microscope circular field is not stretched',abs(box['width']-box['height'])<1)
  for id in q.evaluate('MicroModel.specimens.map(s=>s.id)'):
   q.locator('#specimen').select_option(id);q.locator('#moving').uncheck()
   for n in ['4','10','40']:
    q.locator('#objective').select_option(n);check(id+f': {n}x objective keeps calibrated view',q.evaluate('MicroscopeTest.getState().optics.total')==int(n)*10 and q.locator('#coarse').is_disabled()==(n=='40'))
   value(q,'#fine',1);blur=q.locator('#micro-canvas').screenshot();q.evaluate('MicroscopeTest.set("fine",MicroModel.specimens.find(s=>s.id===MicroscopeTest.getState().specimen).focus)');check(id+': refocusing changes image',blur!=q.locator('#micro-canvas').screenshot());q.locator('[data-move="1,0"]').click();check(id+': stage moves in specimen coordinates',q.evaluate('MicroscopeTest.getState().x')>0);q.locator('#center').click();check(id+': stage recentres',q.evaluate('MicroscopeTest.getState().x')==0)
   q.locator('#capture').click();check(id+': observation states synthetic conditions','观察卡' in q.locator('#saved').inner_text());shot(q,'microscope-'+id)
  layouts(q,'microscope');q.close()
  q=load('projects/biology/index.html','window.LabTest');q.evaluate('LabTest.select("breathing",false)')
  for mode in ['both','chest','alveoli']:
   q.locator('#p-view').select_option(mode);q.evaluate('LabTest.seek(.1)');before=q.locator('#canvas').screenshot();q.evaluate('LabTest.seek(.3)');check('breathing '+mode+': real process changes',before!=q.locator('#canvas').screenshot());shot(q,'breathing-'+mode)
  check('microscope is discoverable from biology',q.locator('a[href="microscope/index.html"]').count()==1);q.close()
  q=load('projects/martial/index.html','window.LabTest');q.evaluate('LabTest.select("wingchun",false);LabTest.seek(.4)')
  if a.require_webgl:check('continuous human uses real WebGL',q.evaluate('LabTest.getState().renderer')=='webgl')
  check('not the old primitive body',q.evaluate('MartialHuman.inspect().vertices>10000&&MartialHuman.inspect().triangles>20000'))
  samples=q.evaluate('MartialHuman.inspect().sample');q.locator('#p-mirror').check();flipped=q.evaluate('MartialHuman.inspect().sample');check('mirror changes x only, without limb explosion',all(abs(x-(-y if i%3==0 else y))<1e-5 for i,(x,y) in enumerate(zip(flipped,samples))))
  for l in q.evaluate('Museum.lessons.map(l=>l.id)'):
   q.evaluate('(id)=>LabTest.select(id,false)',l)
   for t in [0,.25,.5,.75,1]:q.evaluate('(t)=>LabTest.seek(t)',t);check(l+': finite continuous mesh',q.evaluate('MartialHuman.inspect().finite'))
  q.evaluate('LabTest.select("wingchun",false);LabTest.seek(.5)');pics=[]
  for style in ['uniform','plain','skeleton']:
   q.locator('#p-appearance').select_option(style);pics.append(q.locator('#visual').screenshot());shot(q,'human-'+style)
  check('human styles are visibly distinct',len(set(pics))==3);q.locator('#p-appearance').select_option('uniform');layouts(q,'human');q.close()
  context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1,locale='zh-CN')
  def swipe_touch(q,selector,slider=False):
   el=q.locator(selector);el.evaluate('e=>e.scrollIntoView({block:"center",behavior:"instant"})');q.wait_for_timeout(80);r=el.bounding_box();x=r['x']+r['width']/2;y=r['y']+r['height']/2;cdp=context.new_cdp_session(q);before=q.evaluate('scrollY')
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'id':1,'x':x,'y':y}]})
   for i in range(1,9):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'id':1,'x':x+i*5,'y':y+(i*.5 if slider else -i*6)}]});q.wait_for_timeout(16)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});q.wait_for_timeout(80);check(selector+': touch does not move page',abs(q.evaluate('scrollY')-before)<2)
  q=load('projects/biology/microscope/index.html','window.MicroscopeTest');q.locator('#moving').uncheck();before=q.evaluate('MicroscopeTest.getState().x');swipe_touch(q,'#micro-canvas');check('microscope touch changes stage coordinates',q.evaluate('MicroscopeTest.getState().x')!=before);q.close()
  q=load('projects/chemistry/experiments/index.html','window.ChemLabTest');swipe_touch(q,'#timeline',True);check('chemistry touch changes time',q.evaluate('ChemLabTest.getState().t')>0);q.close()
  check('no uncaught browser errors' ,not report['errors']);check('no third-party runtime dependencies',not report['requests']);browser.close()
 report['status']='passed'
except Exception as e:
 report['status']='failed';report['exception']=str(e)
 try:q.screenshot(path=str(OUT/'failure.png'),full_page=True)
 except Exception:pass
 raise
finally:
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',len(report['checks']),report.get('status'),flush=True)
 if server:server.shutdown()
