#!/usr/bin/env python3
"""Social scenes: actual offline/HTTP/published navigation, hidden answers, mobile touch and safe records.
--inject is a clearly labelled DOM-only fallback; it is not file://, HTTP or live-site validation.
"""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse, functools, json, re, threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def main():
 p=argparse.ArgumentParser(description=__doc__);g=p.add_mutually_exclusive_group()
 g.add_argument('--file',action='store_true');g.add_argument('--site',action='store_true');g.add_argument('--base');g.add_argument('--inject',action='store_true')
 p.add_argument('--browser');p.add_argument('--out',default='.qa/social');a=p.parse_args()
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True);server=None
 report={'mode':'DOM injection only' if a.inject else 'file://' if a.file else 'published HTTP' if a.base else 'local HTTP','status':'failed','checks':[],'errors':[],'external':[]}
 def check(name,ok):
  report['checks'].append({'name':name,'passed':bool(ok)})
  if not ok:raise AssertionError(name)
 def inject(page):
  entry=ROOT/'projects/social/index.html';html=entry.read_text()
  html=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+(entry.parent/m[1]).read_text()+'</style>',html)
  html=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>'+(entry.parent/m[1]).read_text().replace('</script','<\\/script')+'</script>',html)
  init="<script>if(!window.__qaStorage){const v={};window.__qaStorage={getItem:k=>v[k]||null,setItem:(k,s)=>{v[k]=s},removeItem:k=>{delete v[k]}};Object.defineProperty(window,'localStorage',{value:window.__qaStorage,configurable:true});}</script>"
  page.set_content(html.replace('<head>','<head>'+init),wait_until='load')
 if a.file:url=(ROOT/'projects/social/index.html').as_uri()
 elif a.base:url=a.base.rstrip('/')+'/projects/social/index.html'
 elif a.inject:url='about:blank'
 else:
  server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'_site' if a.site else ROOT)))
  threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/projects/social/index.html'
 report['url']=url
 def load(page):
  if a.inject:inject(page)
  else:page.goto(url,wait_until='load',timeout=60000)
  page.wait_for_function('!!window.SocialTest')
 def attach(page):
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('request',lambda r:report['external'].append(r.url) if r.url.startswith(('http:','https:')) and urlsplit(r.url).netloc!=urlsplit(url).netloc else None)
 def hidden(page):
  return page.locator('#answers').is_hidden() and page.locator('#result').text_content()=='' and page.locator('#response-text').text_content()==''
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch(executable_path=a.browser,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
   ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True)
   page=ctx.new_page();attach(page);load(page);data=page.evaluate('SocialData.entries')
   check('48 scenes initialized; requested relationship scenario first',len(data)==48 and page.evaluate('SocialTest.state().selected')=='s01')
   check('answers absent before any action',hidden(page))
   check('submit without choice disabled',page.locator('#submit').is_disabled())
   page.screenshot(path=str(out/'social-desktop-question.png'),full_page=True)
   for e in data:
    id=e['id'];page.locator('#entries [data-id="'+id+'"]').click()
    check('exact context and reset hidden answer '+id,page.locator('#scene-title').inner_text()==e['title'] and page.locator('#scene-text').inner_text()==e['scene'] and hidden(page))
    check('four distinct option texts '+id,page.locator('#options .label').all_inner_texts()==[o['text'] for o in e['options']])
    check('safety note displayed independently '+id,page.locator('#safety').is_visible()==bool(e['safety']))
    for i in range(4):
     page.locator('[data-option="'+str(i)+'"]').click()
     check('selection alone does not reveal '+id+' '+str(i),hidden(page) and page.evaluate('SocialTest.state().choice')==i)
     page.locator('#submit').click()
     check('submitted explanation matches scene '+id+' '+str(i),page.locator('#answers').is_visible() and page.locator('#principle').inner_text()==e['principle'] and page.locator('#explanations p').all_text_contents()==[o['reason'] for o in e['options']])
    page.locator('[data-variant="brief"]').click();check('brief response '+id,page.locator('#response-text').inner_text()==next(o['text'] for o in e['options'] if o['preferred']))
    page.locator('[data-variant="followup"]').click();check('pushback and follow-up specific '+id,page.locator('#pushback').inner_text()==e['pushback'] and page.locator('#response-text').inner_text()==e['followup'])
    page.locator('[data-variant="full"]').click();check('full response, actions and boundary '+id,page.locator('#response-text').inner_text()==e['reply'] and page.locator('#actions li').all_inner_texts()==e['actions'] and page.locator('#boundary').inner_text()==e['boundary'])
    page.locator('#sources summary').click();check('correct reference and psychology links '+id,page.locator('#source-list a').count()==len(e['sources']) and page.locator('#related a').count()==len(e['related']) and all(u.startswith('https://') for u in page.locator('#source-list a').evaluate_all('(xs)=>xs.map(x=>x.href)')))
   check('viewing answers does not claim mastery or auto-mark read',page.evaluate('SocialTest.state().records.read')==[])
   page.locator('#entries [data-id="s01"]').click();page.locator('#mode-read').click()
   check('direct learning mode still defaults to hidden answers',page.locator('#question').is_hidden() and hidden(page))
   page.locator('#reveal').click();check('direct reveal without selecting',page.locator('#answers').is_visible() and page.evaluate('SocialTest.state().choice') is None)
   page.locator('#reveal').click();check('collapse removes answer text',hidden(page))
   page.locator('#reveal').click();page.locator('#next').click();check('next scene hides answer in direct mode',hidden(page))
   page.locator('#previous').click();page.locator('#mode-quiz').click();page.locator('[data-option="0"]').focus();page.keyboard.press('Enter')
   check('keyboard selection retains focus and hidden answer',hidden(page) and page.evaluate("document.activeElement.dataset.option==='0'"))
   page.locator('#submit').click();page.locator('#retry').click();check('retry clears selection and answer',hidden(page) and page.evaluate('SocialTest.state().choice') is None)
   for cat in page.evaluate('SocialData.categories'):
    page.locator('#category').select_option(cat['id']);check('category filters '+cat['id'],len(page.evaluate('SocialTest.state().shown'))==6)
   page.locator('#clear-filters').click();page.locator('#audience').select_option('亲子共读');check('14 family-readable scenarios',len(page.evaluate('SocialTest.state().shown'))==14)
   page.locator('#clear-filters').click();page.locator('#search').fill('代码评审');check('search selects actual eligible scene',page.evaluate('SocialTest.state().shown')==['s14'] and page.locator('#entries [aria-current="true"]').count()==1)
   page.locator('#search').fill('zzzzunknown');check('empty filter hides unrelated content',page.locator('#empty').is_visible() and page.locator('#reading').is_hidden() and page.locator('#random').is_disabled())
   page.locator('#empty-clear').click();page.locator('#entries [data-id="s01"]').click();page.locator('#favorite').click();page.locator('#mark-read').click()
   check('only explicit favorite/read records',page.evaluate('SocialTest.state().records')=={'favorites':['s01'],'read':['s01']})
   if a.inject:load(page)
   else:page.reload(wait_until='load');page.wait_for_function('!!window.SocialTest')
   check('records persist but answer never persists',hidden(page) and page.evaluate('SocialTest.state().records')=={'favorites':['s01'],'read':['s01']})
   page.locator('#favorites-only').check();page.locator('#unread-only').check();check('filter intersection may be empty',page.locator('#empty').is_visible())
   page.locator('#empty-clear').click();before=page.evaluate('SocialTest.state().selected');page.locator('#random').click();check('random chooses another eligible scene with hidden answer',page.evaluate('SocialTest.state().selected')!=before and hidden(page))
   page.locator('.backup summary').click();incoming={'app':'family-lab-social','version':1,'favorites':['s02'],'read':['s03'],'private':'should be discarded'}
   page.locator('#import').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function("document.querySelector('#storage-status').textContent.includes('导入成功')")
   check('merge does not overwrite existing ids',set(page.evaluate('SocialTest.state().records.favorites'))=={'s01','s02'})
   saved=page.evaluate('JSON.stringify(SocialTest.state().records)');incoming['favorites']=['__proto__']
   page.locator('#import').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});page.wait_for_function("document.querySelector('#storage-status').textContent.includes('未导入')")
   check('invalid backup rejected atomically',page.evaluate('JSON.stringify(SocialTest.state().records)')==saved)
   page.locator('#entries [data-id="s01"]').click();page.locator('#reveal').click();page.locator('.practice summary').click();page.locator('#own-words').fill('不应该写入备份的私密练说内容')
   with page.expect_download() as download:page.locator('#export').click()
   exported=json.loads(Path(download.value.path()).read_text());check('export excludes answers, selected choices and private words',set(exported)=={'app','version','favorites','read'} and '私密' not in json.dumps(exported,ensure_ascii=False))
   page.locator('#reset-records').click();page.locator('#cancel-reset').click();check('cancel clear preserves records',page.evaluate('JSON.stringify(SocialTest.state().records)')==saved)
   # Isolate actual browser clipboard capability; test both explicit success and honest fallback.
   page.evaluate("Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__copied=text}}})")
   page.locator('#copy').click();page.wait_for_function("document.querySelector('#copy-status').textContent.includes('已复制')")
   check('copy current reply',page.evaluate('window.__copied')==page.locator('#response-text').inner_text())
   page.evaluate("()=>{navigator.clipboard.writeText=async()=>{throw Error('NotAllowedError')}}")
   page.locator('#copy').click();page.wait_for_function("!document.querySelector('#copy-fallback').hidden")
   check('denied clipboard offers manual selection',page.locator('#copy-fallback').input_value()==page.locator('#response-text').inner_text() and '未允许' in page.locator('#copy-status').inner_text())
   page.locator('[data-variant="followup"]').click();page.locator('#font-size').click();check('large font applies to actual reply',page.locator('#response-text').evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)')==20)
   for width in [320,390,768,1440]:
    page.set_viewport_size({'width':width,'height':1000});check(str(width)+'px no overflow in expanded answer',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   page.set_viewport_size({'width':1440,'height':1000});page.locator('.practice summary').click();page.locator('#copy-fallback').evaluate('(e)=>e.hidden=true')
   page.screenshot(path=str(out/'social-desktop-answer.png'),full_page=True)
   page.locator('#next').click();check('private practice text cleared on scenario change',page.locator('#own-words').input_value()=='' and hidden(page))
   page.evaluate("localStorage.setItem('family-lab-psychology.v1','unrelated-record')")
   page.locator('#reset-records').click();page.locator('#confirm-reset').click();check('confirmed clear only changes this museum',page.evaluate('SocialTest.state().records')=={'favorites':[],'read':[]} and page.evaluate("localStorage.getItem('family-lab-psychology.v1')")=='unrelated-record')
   mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,locale='zh-CN')
   touch=mobile.new_page();attach(touch);load(touch)
   check('mobile first view keeps directory collapsed',not touch.locator('#directory').evaluate('(e)=>e.open'))
   touch.screenshot(path=str(out/'social-mobile-top.png'),full_page=True)
   touch.locator('#open-directory').tap();touch.locator('#category').select_option('parenting');touch.locator('#entries [data-id="s07"]').tap()
   check('trusted tap selects and exposes correct heading',touch.evaluate('SocialTest.state().selected')=='s07' and not touch.locator('#directory').evaluate('(e)=>e.open') and touch.locator('#scene-title').evaluate('(e)=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight}'))
   touch.locator('[data-option="1"]').tap();check('mobile selection alone stays hidden',hidden(touch));touch.locator('#submit').tap();check('mobile submit reveals actual response',touch.locator('#response-text').text_content()==data[6]['reply'])
   touch.locator('[data-variant="followup"]').tap();check('trusted touch switches follow-up',touch.locator('#response-text').inner_text()==data[6]['followup'])
   touch.locator('#answers').scroll_into_view_if_needed();touch.evaluate("scrollTo(0,document.querySelector('#answers').getBoundingClientRect().top+scrollY)")
   y=touch.evaluate('scrollY');cdp=mobile.new_cdp_session(touch);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':366,'y':700}]})
   for yy in [650,550,450,350,250]:cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':366,'y':yy}]});touch.wait_for_timeout(25)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});touch.wait_for_function('(y)=>scrollY>y+20',arg=y)
   check('trusted swipe scrolls reading page normally',touch.evaluate('scrollY')>y+20)
   touch.screenshot(path=str(out/'social-mobile-answer.png'),full_page=True)
   touch.locator('#next').tap();check('next via touch hides answers',hidden(touch));mobile.close()
   if a.inject:page.evaluate("()=>{localStorage.setItem=()=>{throw Error('QuotaExceededError')}}")
   else:page.evaluate("()=>{Storage.prototype.setItem=()=>{throw Error('QuotaExceededError')}}")
   page.locator('#favorite').click();check('storage failure not mislabeled as success','未能保存' in page.locator('#storage-status').text_content())
   check('no uncaught errors or external runtime requests',not report['errors'] and not report['external'])
   report['status']='passed';browser.close()
 except Exception as exc:report['fatal']=str(exc);raise
 finally:
  report['passed']=sum(x['passed'] for x in report['checks']);report['failed']=sum(not x['passed'] for x in report['checks']);(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  if server:server.shutdown();server.server_close()
 print(json.dumps({'mode':report['mode'],'status':report['status'],'passed':report['passed']},ensure_ascii=False))
if __name__=='__main__':main()
