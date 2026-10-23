#!/usr/bin/env python3
"""All math cards and parameter events; injection is not real file/HTTP certification."""
from pathlib import Path
import argparse,functools,http.server,json,re,shutil,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
for flag in ['inject','file','site']:p.add_argument('--'+flag,action='store_true')
p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/math');a=p.parse_args();OUT=ROOT/a.out;OUT.mkdir(parents=True,exist_ok=True)
report={'mode':'injected-content' if a.inject else 'file' if a.file else 'http','checks':[],'errors':[],'requests':[],'limits':['Not Windows/iOS physical-device testing.','Declared finite states, not every parameter combination.']};base=a.base;server=None
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
def select(page,id):
 page.locator('#topics [data-topic="'+id+'"]').click();page.wait_for_function('(id)=>MathTest.getState().topic===id',arg=id)
def control(page,key,value):page.locator('#control-'+key).evaluate('(e,v)=>{e.value=v;e.dispatchEvent(new Event("input",{bubbles:true}));}',str(value))
def shot(page,name):page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/(name+'.png')))
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox','--disable-dev-shm-usage'])
  context=browser.new_context(viewport={'width':1440,'height':1050},locale='zh-CN');page=context.new_page();page.set_default_timeout(15000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('request',lambda r:report['requests'].append(r.url) if r.url.startswith(('http:','https:')) and not(base and r.url.startswith(base)) else None)
  f=ROOT/'projects/math/index.html';url=f.as_uri() if a.file else (base or '')+'projects/math/index.html'
  if a.inject:page.set_content(inline(f))
  else:page.goto(url,wait_until='load')
  page.wait_for_function('window.MathTest');topics=page.evaluate('MathAtlas.topics.map(t=>({id:t.id,lab:t.lab,steps:t.steps.length}))');specs=page.evaluate('MathModels.specs')
  check('125 real nodes and 44 model types',len(topics)==125 and len(specs)==44)
  for t in topics:
   select(page,t['id']);check(t['id']+': navigation, worked example and applications',bool(page.locator('#title').inner_text()) and len(page.locator('#applications').inner_text())>30)
   page.locator('#stepNext').click();check(t['id']+': next step reveals substantive text',page.locator('#steps li').count()==2)
   page.locator('#stepAll').click();check(t['id']+': all steps and endpoint',page.locator('#steps li').count()==t['steps'] and page.locator('#stepNext').is_disabled())
   page.locator('#stepBack').click();check(t['id']+': reverse step',page.locator('#steps li').count()==t['steps']-1)
   if page.locator('#proofCard').is_visible():
    old=page.locator('#proofSteps').inner_text();page.locator('[data-route="1"]').click();check(t['id']+': two actual proof routes',old!=page.locator('#proofSteps').inner_text())
   if not t['lab']:check(t['id']+': honest reading-only node',page.locator('#reset').is_disabled() and page.locator('#controls input').count()==0)
  for id,spec in specs.items():
   select(page,next(t['id'] for t in topics if t['lab']==id))
   for c in spec['controls']:
    for value in [c['min'],c['max']]:
     control(page,c['key'],value)
     check(f'{id}/{c["key"]}={value}: finite rendering',page.evaluate('()=>!/NaN|Infinity/.test(document.querySelector("#visual").innerHTML)&&!document.querySelector("#metrics").textContent.includes("undefined")'))
   page.locator('#reset').click();check(id+': reset defaults',page.evaluate('JSON.stringify(MathTest.getState().params)===JSON.stringify(MathModels.normalize(MathTest.getState().lab))'))
  select(page,'fractions');old=page.locator('#visual').screenshot();page.locator('[data-part="5"]').click();check('direct fraction selection changes actual image and value',page.evaluate('MathTest.compute().v.n')==5 and old!=page.locator('#visual').screenshot())
  page.locator('[data-experiment="half"]').click();check('half preset',page.evaluate('MathTest.compute().value')==.5);page.locator('[data-experiment="empty"]').click();check('empty fraction',page.evaluate('MathTest.compute().value')==0)
  page.locator('#zoomPlot').click();check('actual SVG magnification',page.evaluate('MathTest.getState().plotZoom')==1.5 and page.evaluate('document.querySelector("#visual svg").getBoundingClientRect().width>document.querySelector("#visual").clientWidth'))
  page.locator('#zoomPlot').click();page.locator('#zoomPlot').click();check('magnification reset',page.evaluate('MathTest.getState().plotZoom')==1)
  select(page,'matrices');page.locator('[data-experiment="rotate"]').click();check('matrix rotation determinant',page.evaluate('MathTest.compute().det')==1);page.locator('[data-experiment="singular"]').click();check('singular not invertible',page.evaluate('MathTest.compute().inverse') is None);page.locator('[data-experiment="identity"]').click()
  select(page,'probability');old=page.locator('#visual').screenshot();page.locator('[data-experiment="resample"]').click();check('different random sample appears',old!=page.locator('#visual').screenshot())
  select(page,'integral');err=page.evaluate('MathTest.compute().error');page.locator('[data-experiment="refine"]').click();check('finer Riemann rectangles improve error',abs(page.evaluate('MathTest.compute().error'))<abs(err))
  select(page,'binary');page.locator('[data-bit="0"]').click();check('binary toggle exact weight',page.evaluate('MathTest.compute().v.n')==141)
  select(page,'gradient');page.locator('[data-experiment="walk"]').click();check('gradient actual next step',page.evaluate('MathTest.getState().params.steps')==7)
  for id in ['fractions','pythagoras','matrices','integral','bayes','graphs']:select(page,id);shot(page,id)
  select(page,'fractions');page.locator('#mode').click();check('advanced language toggle',page.locator('#formal').is_visible());page.locator('#mode').click();page.locator('#favorite').click();page.locator('#mark').click();page.locator('#note').fill('我发现 1/2=2/4。<img src=x onerror=alert(1)>');page.locator('#saveNote').click();page.locator('#notebook').click();check('notes keep literal text without execution',page.locator('.record img').count()==0 and '1/2=2/4' in page.locator('#records').inner_text())
  with page.expect_download() as info:page.locator('[data-record="export"]').click()
  info.value.save_as(str(OUT/'math-test-backup.json'));content=json.loads((OUT/'math-test-backup.json').read_text());check('export includes real notes',content['notes']['fractions'].startswith('我发现') and 'fractions' in content['practiced'])
  incoming={'version':1,'notes':{'fractions':'不覆盖已有观察','matrices':'新笔记'},'favorites':['matrices'],'practiced':[],'seen':[]}
  page.locator('#importFile').set_input_files({'name':'test.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function('document.querySelector("#records").textContent.includes("新笔记")');check('import merges without overwrite',page.evaluate('JSON.parse(MathTest.backup()).notes.fractions').startswith('我发现'))
  page.locator('#importFile').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{broken'});page.wait_for_function('document.querySelector("#recordStatus").textContent.includes("没有导入")');check('bad import is non-destructive',page.evaluate('Object.keys(JSON.parse(MathTest.backup()).notes).length')==2)
  if not a.inject:
   page.reload();page.wait_for_function('window.MathTest');check('real-origin notebook survives reload',page.evaluate('JSON.parse(MathTest.backup()).notes.matrices')=='新笔记')
  page.locator('#roadmap').click();check('roadmap has 125 actionable nodes',page.locator('#map [data-topic]').count()==125);page.locator('#map [data-topic="fundamental"]').click();check('roadmap opens lesson',page.evaluate('MathTest.getState().topic')=='fundamental')
  page.locator('#search').fill('不存在的XYZ');check('empty search state',page.locator('#topics [data-clear]').count()==1);page.locator('[data-clear]').click();check('clear restores catalogue',page.locator('#topics [data-topic]').count()==125)
  page.locator('#stage').select_option('小学1–2年级');check('early-stage filter',page.locator('#topics [data-topic]').count()==15);page.locator('#stage').select_option('');page.locator('#group').select_option('linear');check('linear algebra filter',page.locator('#topics [data-topic]').count()==10);page.locator('#group').select_option('')
  page.locator('#favorites').click();check('favorites filter',page.locator('#topics [data-topic]').count()==2);page.locator('#favorites').click()
  select(page,'counting');check('previous disabled at beginning',page.locator('#previous').is_disabled());page.locator('#next').click();check('next navigation',page.evaluate('MathTest.getState().topic')=='place-value');page.locator('#previous').click();select(page,'fractions')
  for width in [1440,1280,768,390,320]:
   page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(80);check(f'{width}px no page overflow or clipped primary controls',page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth+1&&["#content","#controls","#metrics"].every(s=>{let r=document.querySelector(s).getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;})'))
   if width==390:shot(page,'math-mobile')
  check('no uncaught exceptions',not report['errors']);check('no third-party runtime requests',not report['requests']);browser.close()
 report['status']='passed'
except Exception as err:report['status']='failed';report['exception']=str(err);raise
finally:
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('REPORT',len(report['checks']),report.get('status'),flush=True)
 if server:server.shutdown()
