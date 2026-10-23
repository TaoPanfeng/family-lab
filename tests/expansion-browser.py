#!/usr/bin/env python3
"""Browser regression for new museums; local HTTP, real file://, or public deployed base URL."""
from pathlib import Path
import argparse, functools, http.server, threading, json, shutil, re, sys
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--modules',default='biology,geography,cosmos,martial');p.add_argument('--browser');p.add_argument('--file',action='store_true');p.add_argument('--base');p.add_argument('--out',default='.qa/expansion');p.add_argument('--inject',action='store_true');p.add_argument('--site',action='store_true');p.add_argument('--require-webgl',action='store_true');args=p.parse_args()
OUT=ROOT/args.out;OUT.mkdir(parents=True,exist_ok=True)
report={'mode':'injected contents' if args.inject else 'file' if args.file else 'http','checks':[],'errors':[],'network':[]}
server=None
if not args.file and not args.inject and not args.base:
 class Quiet(http.server.SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT / "_site" if args.site else ROOT)))
 threading.Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port)+'/'
else:base=args.base

def check(name,ok):
 report['checks'].append({'name':name,'pass':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 if not ok:raise AssertionError(name)

def inline(file):
 text=file.read_text();scripts=[]
 def js(m):scripts.append('<script>'+re.sub(r'</script',r'<\\/script',(file.parent/m[1]).read_text(),flags=re.I)+'</script>');return ''
 text=re.sub(r'<script src="([^"]+)"></script>',js,text)
 text=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(file.parent/m[1]).read_text()+'</style>',text)
 return text.replace('</body>',''.join(scripts)+'</body>')

try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=args.browser or shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  context=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True)
  for mod in args.modules.split(','):
   page=context.new_page();page.set_default_timeout(10000)
   page.on('pageerror',lambda e:report['errors'].append(str(e)))
   page.on('request',lambda r:report['network'].append(r.url) if r.url.startswith(('https://','http://')) and not (base and r.url.startswith(base)) else None)
   file=ROOT/'projects'/mod/'index.html'
   if args.inject:page.set_content(inline(file),wait_until='load')
   else:page.goto(file.as_uri() if args.file else base+'projects/'+mod+'/index.html',wait_until='load')
   page.wait_for_function('!!window.LabTest');lessons=page.evaluate('Museum.lessons.map(l=>({id:l.id,controls:l.controls,correct:l.correct}))')
   check(mod+': registered lessons',len(lessons)>=4)
   for l in lessons:
    page.locator('[data-lesson="'+l['id']+'"]').click();check(mod+'/'+l['id']+': navigation',page.evaluate('LabTest.getState().lesson')==l['id'])
    if args.require_webgl and ((mod=='cosmos' and l['id'] in ['orbit','solar','scale','sky']) or mod=='martial'):
     check(mod+'/'+l['id']+': actual WebGL renderer',page.evaluate("LabTest.getState().renderer === 'webgl'") and page.locator('.three-canvas').is_visible())
    for t in [0,.25,.6,1]:page.evaluate('(t)=>LabTest.seek(t)',t)
    check(mod+'/'+l['id']+': timeline endpoint',page.evaluate('LabTest.getState().time')==1)
    for c in l['controls']:
     loc=page.locator('#p-'+c['id'])
     if c.get('type')=='select':
      # Large country datasets are exhaustively checked in model tests; sample UI boundaries here.
      options=c['options'] if len(c['options'])<=40 else [c['options'][i] for i in [0,1,len(c['options'])//2,len(c['options'])-1]]
      for value,_ in options:loc.select_option(str(value))
     elif c.get('type')=='checkbox':loc.uncheck();loc.check()
     else:
      for value in [c['min'],c['max']]:loc.evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}));}',value)
    check(mod+'/'+l['id']+': controls finite','NaN' not in page.locator('#metrics').inner_text())
    page.locator('#mode').click();check(mod+'/'+l['id']+': adult explanation',len(page.locator('#explanation').inner_text())>30);page.locator('#mode').click()
    page.locator('[data-answer="'+str(l['correct'])+'"]').click();check(mod+'/'+l['id']+': answer recorded',l['id'] in page.evaluate('LabTest.getState().solved'))
    page.locator('#reset').click();check(mod+'/'+l['id']+': reset',page.evaluate('LabTest.getState().time')==0)
   if mod=='biology':
    page.evaluate("LabTest.select('sleep');LabTest.seek(0.5)")
    check('biology: sleep model shows explicit remaining dose','mg' in page.locator('#metrics').inner_text())
   if mod=='geography':
    page.evaluate("LabTest.select('landforms')")
    page.locator('#place-search').fill('黄山');check('geography: real place search',page.locator('[data-place]').count()==1)
    page.locator('[data-place]').click();check('geography: selection updates details','黄山' in page.locator('#place-detail').inner_text())
    page.locator('#place-search').fill('000missing');check('geography: no fake results',page.locator('[data-place]').count()==0)
    page.locator('#place-search').fill('');page.locator('#p-kind').select_option('lake');check('geography: lake layer changes data',page.locator('[data-place]').count()==10)
   if mod=='cosmos':
    page.evaluate("LabTest.select('scale')")
    for i in range(9):
     page.locator('#scale-steps button').nth(i).click()
     check('cosmos: scale '+str(i),page.evaluate('LabTest.getState().values.level')==i and len(page.locator('#scale-detail').inner_text())>15)
    page.evaluate("LabTest.select('sky');LabTest.set('tilt',0);LabTest.seek(.25)")
    check('cosmos: zero tilt means zero declination','0.0°' in page.locator('#metrics').inner_text())
   if mod=='martial':
    page.evaluate("LabTest.select('baduanjin')")
    for value,label in page.evaluate("Museum.lessons.find(x=>x.id==='baduanjin').controls[0].options"):
     page.locator('#p-motion').select_option(value)
     count=page.locator('#pose-frames button').count()
     for i in range(count):
      page.locator('#pose-frames button').nth(i).click()
      check('martial: '+value+' frame '+str(i),abs(page.evaluate('LabTest.getState().time')-i/(count-1))<1e-9)
    page.screenshot(path=str(OUT/'martial-pose.png'),full_page=True)
   page.locator('#reset').click()
   page.locator('#play').click();page.wait_for_timeout(200);page.locator('#play').click();check(mod+': playback advances',page.evaluate('LabTest.getState().time')>0)
   page.locator('#favorite').click();check(mod+': favorite',page.locator('#favorite').get_attribute('aria-pressed')=='true')
   page.locator('#notes-open').click();page.locator('#note').fill('观察 <script>window.PWNED=1</script>');page.locator('#save-note').click();check(mod+': literal notes and no injection',page.evaluate('!window.PWNED') and 'window.PWNED' in page.locator('#note-list').inner_text())
   with page.expect_download() as d:page.locator('#export').click()
   d.value.save_as(OUT/(mod+'-notes.json'));check(mod+': exported JSON',len(json.loads((OUT/(mod+'-notes.json')).read_text())['notes'])>=1)
   page.locator('#import').set_input_files(str(OUT/(mod+'-notes.json')))
   page.wait_for_timeout(100);check(mod+': import deduplicates without overwriting',page.evaluate('LabTest.getState().notes')==1)
   if not args.inject:
    page.reload(wait_until='load');page.wait_for_function('!!window.LabTest')
    check(mod+': notes and completed questions survive reload',page.evaluate('LabTest.getState().notes')==1 and len(page.evaluate('LabTest.getState().solved'))==len(lessons))
   page.locator('#import').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"version":99,"notes":[]}'})
   page.wait_for_timeout(100);check(mod+': invalid import rejected','导入失败' in page.locator('#toast').inner_text())
   page.locator('#search').fill('nevermatching000');check(mod+': search empty state',page.locator('#empty').is_visible());page.locator('#search').fill('')
   page.locator('[data-lesson]').first.click();page.evaluate('document.querySelector("#notebook").open=false;window.scrollTo(0,0)');page.wait_for_timeout(3600)
   for width in [1440,768,390]:
    page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(150)
    check(mod+f': {width}px no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    if width in [1440,390]:page.screenshot(path=str(OUT/(mod+f'-{width}.png')),full_page=True)
   page.close()
  check('no uncaught errors',not report['errors']);check('no external runtime network',not report['network']);browser.close()
 report['status']='passed'
except Exception as exc:
 report['status']='failed';report['exception']=str(exc);raise
finally:
 (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 if server:server.shutdown()
 print('REPORT',len(report['checks']),report['status'])
