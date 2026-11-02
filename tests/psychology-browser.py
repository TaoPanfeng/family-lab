#!/usr/bin/env python3
"""Psychology card verification. --inject is DOM-only, never real file/HTTP/online evidence."""
import argparse, functools, json, re, threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*_):pass
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--file',action='store_true');p.add_argument('--site',action='store_true');p.add_argument('--inject',action='store_true');p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/psychology');a=p.parse_args()
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True);server=None
 report={'mode':'DOM injection only' if a.inject else 'file://' if a.file else 'published HTTP' if a.base else 'local HTTP','status':'failed','checks':[],'errors':[],'external':[]}
 def check(name,ok):
  report['checks'].append({'name':name,'passed':bool(ok)})
  if not ok:raise AssertionError(name)
 def inject(page):
  entry=ROOT/'projects/psychology/index.html';h=entry.read_text()
  h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(entry.parent/m[1]).read_text()+'</style>',h)
  h=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(entry.parent/m[1]).read_text().replace('</script','<\\/script')+'</script>',h)
  # Sandbox storage substitute is strictly restricted to the explicitly labelled DOM-only mode.
  init="<script>if(!window.__qaStorage){const v={};window.__qaStorage={getItem:k=>v[k]||null,setItem:(k,s)=>{v[k]=s},removeItem:k=>{delete v[k]}};Object.defineProperty(window,'localStorage',{value:window.__qaStorage,configurable:true});}</script>"
  page.set_content(h.replace('<head>','<head>'+init),wait_until='load')
 if a.file:url=(ROOT/'projects/psychology/index.html').as_uri()
 elif a.base:url=a.base.rstrip('/')+'/projects/psychology/index.html'
 elif a.inject:url='about:blank'
 else:
  server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)))
  threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/projects/psychology/index.html'
 report['url']=url
 def load(page):
  if a.inject:inject(page)
  else:page.goto(url,wait_until='load',timeout=60000)
  page.wait_for_function('!!window.PsychologyTest')
 def errors(page):
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('request',lambda r:report['external'].append(r.url) if r.url.startswith(('http:','https:')) and urlsplit(r.url).netloc!=urlsplit(url).netloc else None)
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=a.browser,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
   ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True)
   page=ctx.new_page();errors(page);load(page)
   data=page.evaluate('PsychologyData.entries');check('60 concepts initialize and requested topic opens first',len(data)==60 and page.locator('#term-title').inner_text()=='知识诅咒')
   check('both complete examples visible without unlocking',page.locator('#examples .example:visible').count()==2)
   for e in data:
    page.locator('#entries [data-id="'+e['id']+'"]').click()
    check('exact definition and examples '+e['id'],page.locator('#definition').inner_text()==e['definition'] and all(x['text'] in page.locator('#examples').inner_text() and x['explanation'] in page.locator('#examples').inner_text() for x in e['examples']))
    check('exact misconception and action '+e['id'],page.locator('#boundary').inner_text()==e['boundary'] and page.locator('#action').inner_text()==e['action'])
    page.locator('#sources summary').click();check('professional references resolve for '+e['id'],page.locator('#source-list a').count()==len(e['sources']) and all(x.startswith('https://') for x in page.locator('#source-list a').evaluate_all('(a)=>a.map(x=>x.href)')))
   for cat in page.evaluate('PsychologyData.categories'):
    page.locator('#category').select_option(cat);check('category '+cat,page.evaluate('PsychologyTest.state().shown.length')==10)
   page.locator('#clear-filters').click();page.locator('#search').fill('CURSE of KNOWLEDGE');check('English search normalized',page.evaluate('PsychologyTest.state().shown')==['curse'])
   page.locator('#search').fill('zzzzunknown');check('empty search hides unrelated reading',page.locator('#empty').is_visible() and page.locator('#reading').is_hidden() and page.locator('#random').is_disabled())
   page.locator('#empty-clear').click();page.locator('#entries [data-id="curse"]').click()
   page.locator('#compare summary').click();page.locator('#compare-select').select_option('negative')
   check('comparison uses selected actual concepts',page.locator('#compare-grid h4').all_inner_texts()==['知识诅咒','负强化'])
   page.locator('#favorite').click();page.locator('#mark-read').click();check('favorite and read independent',page.evaluate('PsychologyTest.state().records')=={'favorites':['curse'],'read':['curse']})
   if a.inject:load(page)
   else:page.reload(wait_until='load');page.wait_for_function('!!window.PsychologyTest')
   check('records survive reload',page.evaluate('PsychologyTest.state().records.favorites')==['curse'])
   page.locator('#favorites-only').check();check('favorite filter',page.evaluate('PsychologyTest.state().shown')==['curse']);page.locator('#unread-only').check();check('intersecting empty filters',page.locator('#empty').is_visible())
   page.locator('#empty-clear').click();page.locator('#entries [data-id="curse"]').click()
   page.locator('#related button').first.click();check('related concept changes actual content',page.locator('#term-title').inner_text()=='视角采择')
   before=page.evaluate('PsychologyTest.state().selected');page.locator('#next').click();check('next changes content',page.evaluate('PsychologyTest.state().selected')!=before);page.locator('#previous').click();check('previous reverses navigation',page.evaluate('PsychologyTest.state().selected')==before)
   page.locator('#random').click();check('random picks different eligible concept',page.evaluate('PsychologyTest.state().selected')!=before)
   page.locator('.backup summary').click()
   incoming={'app':'family-lab-psychology','version':1,'favorites':['negative'],'read':['testing']}
   page.locator('#import').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function("document.querySelector('#storage-status').textContent.includes('导入成功')")
   check('valid import merges instead of overwriting',set(page.evaluate('PsychologyTest.state().records.favorites'))=={'curse','negative'})
   previous=page.evaluate('JSON.stringify(PsychologyTest.state().records)');incoming['favorites']=['__proto__']
   page.locator('#import').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function("document.querySelector('#storage-status').textContent.includes('未导入')")
   check('invalid import rejected atomically',page.evaluate('JSON.stringify(PsychologyTest.state().records)')==previous)
   with page.expect_download() as download:page.locator('#export').click()
   exported=json.loads(Path(download.value.path()).read_text());check('backup export roundtrips',exported['app']=='family-lab-psychology' and set(exported['favorites'])=={'curse','negative'})
   page.locator('#reset-records').click();page.locator('#cancel-reset').click();check('cancel reset preserves records',page.evaluate('JSON.stringify(PsychologyTest.state().records)')==previous)
   page.locator('#font-size').click();check('larger font actually applies',page.locator('#definition').evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')==20)
   page.screenshot(path=str(out/'psychology-desktop.png'),full_page=True)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':1000});check(str(width)+'px no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,locale='zh-CN')
   touch=mobile.new_page();errors(touch);load(touch);check('mobile reading is not blocked by 60-entry directory',not touch.locator('#directory').evaluate('(e)=>e.open'))
   touch.locator('#open-directory').tap();touch.locator('#search').fill('负强化');touch.locator('#entries [data-id="negative"]').tap();check('trusted tap navigates and closes directory',touch.locator('#term-title').inner_text()=='负强化' and not touch.locator('#directory').evaluate('(e)=>e.open'))
   check('selected heading visible after navigation',touch.locator('#term-title').evaluate('(e)=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight}'))
   y=touch.evaluate('scrollY');cdp=mobile.new_cdp_session(touch)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':365,'y':700}]})
   for yy in [650,550,450,350,250]:cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':365,'y':yy}]});touch.wait_for_timeout(25)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});touch.wait_for_function('(y)=>scrollY>y+20',arg=y)
   check('trusted swipe scrolls normal text page',touch.evaluate('scrollY')>y+20)
   touch.screenshot(path=str(out/'psychology-mobile.png'),full_page=True);mobile.close()
   # Explicitly simulate storage quota failures, never bypass a browser navigation policy.
   if a.inject:page.evaluate("()=>{localStorage.setItem=()=>{throw Error('QuotaExceededError')}}")
   else:page.evaluate("()=>{Storage.prototype.setItem=()=>{throw Error('QuotaExceededError')}}")
   page.set_viewport_size({'width':1440,'height':1000});page.locator('#clear-filters').click();page.locator('#favorite').click()
   check('storage failure not reported as saved','未能保存' in page.locator('#storage-status').text_content())
   check('no uncaught errors or external runtime requests',not report['errors'] and not report['external'])
   report['status']='passed';browser.close()
 except Exception as e:report['fatal']=str(e);raise
 finally:
  report['passed']=sum(x['passed'] for x in report['checks']);report['failed']=sum(not x['passed'] for x in report['checks']);(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  if server:server.shutdown();server.server_close()
 print(json.dumps({'mode':report['mode'],'status':report['status'],'passed':report['passed']},ensure_ascii=False))
if __name__=='__main__':main()
