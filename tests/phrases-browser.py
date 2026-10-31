#!/usr/bin/env python3
"""End-to-end checks for idiom and xiehouyu study pages. Uses actual file:// or HTTP navigation."""
import argparse, functools, json, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
def main():
 p=argparse.ArgumentParser()
 p.add_argument('--file',action='store_true');p.add_argument('--site',action='store_true')
 p.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/phrases')
 args=p.parse_args()
 out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
 server=None
 if args.base:base=args.base.rstrip('/')
 elif args.file:base=''
 else:
  server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if args.site else ROOT)))
  threading.Thread(target=server.serve_forever,daemon=True).start()
  base='http://127.0.0.1:'+str(server.server_port)
 url=(ROOT/'projects/chinese/phrases.html').as_uri() if args.file else base+'/projects/chinese/phrases.html'
 report={'mode':'file://' if args.file else 'published HTTP' if args.base else 'local HTTP','url':url,'checks':[],'errors':[]}
 def check(name,ok):
  report['checks'].append({'name':name,'passed':bool(ok)})
  if not ok: raise AssertionError(name)
 try:
  with sync_playwright() as p:
   kwargs={'headless':True,'args':['--no-sandbox']}
   if args.browser:kwargs['executable_path']=args.browser
   browser=p.chromium.launch(**kwargs)
   context=browser.new_context(viewport={'width':1440,'height':900},locale='zh-CN')
   page=context.new_page()
   page.on('pageerror',lambda e:report['errors'].append(str(e)))
   page.goto(url,wait_until='load')
   page.wait_for_function('window.PhraseTest')
   check('30 documented idioms and 32 sayings',page.evaluate('PhraseTest.all.length')==62)
   check('default idiom visible',page.locator('#term').inner_text()=='守株待兔')
   check('source work, era and source caveat visible',all(page.locator('#'+x).inner_text() for x in ('source-work','source-era','source-note')))
   check('hidden meaning before guessing',page.locator('#answer').is_hidden())
   page.locator('#reveal').click()
   check('reveal toggles answer',page.locator('#answer').is_visible())
   page.locator('#story-next').click()
   check('story progresses',page.evaluate('PhraseTest.state().stage')==2)
   page.locator('#story-all').click()
   check('three-step story',page.evaluate('PhraseTest.state().stage')==3)
   page.locator('#favorite').click()
   check('favorite recorded',page.evaluate("PhraseTest.state().records.favorites.includes('i01')"))
   page.locator('#my-sentence').fill('我每天做自己的练习，不守株待兔。')
   page.locator('#save').click()
   page.reload(wait_until='load');page.wait_for_function('window.PhraseTest')
   check('learning record persists across reload',page.evaluate("PhraseTest.state().records.notes['i01']")=='我每天做自己的练习，不守株待兔。')
   page.locator('#search').fill('韩非子')
   check('source full text searchable',page.evaluate("PhraseTest.shown().length>=3"))
   page.locator('#clear').click()
   page.locator('#tab-saying').click()
   check('sayings are distinct category',page.evaluate('PhraseTest.state().kind')=='saying')
   check('guess stage does not leak second half',page.locator('#term').inner_text().endswith('？') and page.locator('#answer').is_hidden())
   page.locator('#reveal').click()
   check('saying answer appears',page.locator('#answer-text').inner_text().count('——')==1)
   page.locator('[data-entry="x23"]').click()
   check('fiction source distinguished from first-use date','年代未详' in page.locator('#source-era').inner_text())
   check('no fake original date for folklore',all(('未详' in e['source']['era'] or '待考' in e['source']['era'] or '不详' in e['source']['era']) for e in page.evaluate('ChinesePhrases.sayings')))
   page.locator('#search').fill('谐音')
   check('search filters by meaning',page.evaluate('PhraseTest.shown().length')>0)
   page.locator('#search').fill('')
   for kind in ('idiom','saying'):
    page.locator('#tab-'+kind).click()
    entries=page.evaluate(f'ChinesePhrases.{"idioms" if kind=="idiom" else "sayings"}.map(x=>x.id)')
    for id in entries:
     page.locator('[data-entry="'+id+'"]').click()
     check('each source and example render '+id,len(page.locator('#source-era').inner_text())>2 and len(page.locator('#daily-example').inner_text())>5)
   page.locator('#import').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"notes":{"__proto__":"X"}}'})
   check('invalid import rejected','未导入' in page.locator('#backup-info').inner_text())
   page.screenshot(path=str(out/'phrases-desktop.png'),full_page=True)
   page.set_viewport_size({'width':390,'height':844})
   page.reload(wait_until='load');page.wait_for_function('window.PhraseTest')
   check('390px mobile has no horizontal page overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth+2'))
   page.screenshot(path=str(out/'phrases-mobile.png'),full_page=True)
   check('reading remains scrollable',page.evaluate('document.documentElement.scrollHeight>innerHeight+150'))
   check('no page errors',not report['errors'])
   browser.close()
 finally:
  (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  if server:server.shutdown()
 print('phrases browser checks:',len(report['checks']),'errors:',len(report['errors']))
if __name__=='__main__':main()
