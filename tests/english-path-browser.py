#!/usr/bin/env python3
"""Actual file/HTTP/Pages English path interactions; no HTML injection or remote grading."""
from pathlib import Path
from urllib.parse import urlsplit
import argparse,json,shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__);target=p.add_mutually_exclusive_group(required=True);target.add_argument('--file',action='store_true');target.add_argument('--base');p.add_argument('--browser');p.add_argument('--out',default='.qa/english-path');a=p.parse_args()
OUT=ROOT/a.out;OUT.mkdir(parents=True,exist_ok=True);base=(a.base or '').rstrip('/')+'/'
url=(ROOT/'projects/english/index.html').as_uri() if a.file else base+'projects/english/index.html'
report={'mode':'file' if a.file else 'HTTP','url':url,'checks':[],'errors':[],'externalRequests':[],'status':'failed','limits':['Chromium with trusted input and touch emulation, not physical iOS or screen-reader certification.','Correct answers show completion of these bounded questions, not a proficiency level or certification.','Free writing is saved data and self-review; no automatic correctness grade is claimed.']}
def check(name,ok):
 report['checks'].append({'name':name,'passed':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 if not ok:raise AssertionError(name)
def state(pg):return pg.evaluate('WorkshopTest.state()')
def load(ctx):
 pg=ctx.new_page();pg.set_default_timeout(12000);pg.on('pageerror',lambda e:report['errors'].append(str(e)))
 pg.on('request',lambda req:report['externalRequests'].append(req.url) if urlsplit(req.url).scheme in ('http','https') and (a.file or urlsplit(req.url).netloc!=urlsplit(base).netloc) else None)
 pg.goto(url,wait_until='load',timeout=60000);pg.wait_for_function('window.WorkshopTest&&window.EnglishPathUI');return pg
def choose(pg,id):
 if pg.locator('#nav-toggle').is_visible() and not pg.locator('#lessons').is_visible():pg.locator('#nav-toggle').click()
 pg.locator('[data-lesson="'+id+'"]').click()
def answer(pg,value):pg.locator('.path-option').nth(value).click();pg.locator('#path-submit').click()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=a.browser or shutil.which('chromium') or shutil.which('google-chrome'),args=['--no-sandbox','--disable-dev-shm-usage'])
  ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',accept_downloads=True)
  legacy={'app':'family-lab-workshop','version':1,'subject':'english','favorites':['sentence'],'notes':{'sentence':'原有三实验笔记'},'works':{}}
  ctx.add_init_script('localStorage.setItem("family-lab.workshop.english.1",'+json.dumps(json.dumps(legacy,ensure_ascii=False))+');')
  pg=load(ctx);lessons=pg.evaluate('EnglishPathModel.catalog().map(l=>({id:l.id,title:l.title,cases:l.cases,transfer:l.transfer,challenge:l.challenge}))')
  check('32 progressive lessons and three original experiments remain in one application',len(lessons)==32 and len(pg.evaluate('WorkshopTest.ids()'))==35 and state(pg)['lesson']=='meaning')
  check('route map and grammar explanations are initially collapsed',pg.locator('#path-directory').get_attribute('open') is None and pg.locator('#experiment details[open]').count()==0)
  for lesson in lessons:
   id=lesson['id'];choose(pg,id);check(id+': real navigation loads its actual purpose and sentence',state(pg)['pathLesson']==id and pg.locator('#title').inner_text()==lesson['title'] and pg.locator('#path-example-scene .path-sentence-display p').inner_text()==lesson['cases'][0]['en'])
   pg.locator('[data-path-case="2"]').click();check(id+': third primary example changes the displayed expression',pg.locator('#path-example-scene .path-sentence-display p').inner_text()==lesson['cases'][2]['en'] and pg.locator('[data-path-case="2"]').evaluate('e=>e===document.activeElement'))
   pg.locator('[data-path-variant="2"]').click();check(id+': transfer uses its own scenario and expression',pg.locator('#path-transfer-scene .path-sentence-display p').inner_text()==lesson['transfer']['variants'][2]['en'])
   explanation=pg.locator('#path-example-scene details');explanation.locator('summary').click();check(id+': English, translation and aligned roles are available together by choice',lesson['cases'][2]['zh'] in explanation.inner_text() and explanation.locator('.path-role-block').count()==len(lesson['cases'][2]['parts']))
   pg.locator('#path-start-challenge').click();q=lesson['challenge'][0]
   check(id+': before submit neither rationale nor translation is revealed',pg.locator('#intro').is_hidden() and pg.locator('.path-mission').is_hidden() and pg.locator('#path-submit').is_disabled() and q['translation'] not in pg.locator('#path-workspace').inner_text() and pg.locator('#path-question-feedback details').count()==0)
   answer(pg,(q['answer']+1)%4);check(id+': a wrong answer adds no evidence and focuses feedback',not state(pg)['correct'] and not state(pg)['cleared'] and pg.locator('#path-question-feedback').evaluate('e=>e===document.activeElement'))
   feedback=pg.locator('#path-question-feedback > .path-feedback > details');check(id+': grammar feedback stays collapsed until requested',feedback.get_attribute('open') is None)
   feedback.locator(':scope > summary').click();check(id+': the chosen alternative receives a specific explanation',q['options'][(q['answer']+1)%4]['why'] in feedback.inner_text())
   pg.locator('#path-retry').click();answer(pg,q['answer']);check(id+': one correct answer is not a cleared lesson',state(pg)['correct'] and not state(pg)['cleared'])
   pg.locator('#path-next-question').click();answer(pg,lesson['challenge'][1]['answer']);check(id+': only both checks clear this lesson',state(pg)['correct'] and state(pg)['cleared'] and '两道题均已通过' in pg.locator('.path-lesson-state').inner_text())
  check('all evidence is recorded once rather than counting views as progress',pg.evaluate('EnglishPathModel.summary(EnglishPathUI.state().record).cleared')==32 and len(pg.evaluate('EnglishPathUI.state().record.completed'))==64)
  check('the original three-experiment record is unchanged by the whole route',pg.evaluate('JSON.parse(localStorage.getItem("family-lab.workshop.english.1"))')==legacy)
  # Explicit writing storage, independent backup, invalid import and current-draft priority.
  pg.locator('#path-next-question').click();pg.locator('#path-draft').fill('I want to explain my idea clearly.')
  check('typing alone is not falsely reported or written as saved',pg.evaluate('JSON.parse(localStorage.getItem("family-lab.english.path.1")).drafts.paragraph===undefined') and '尚未保存' in pg.locator('#path-draft-status').inner_text())
  choose(pg,'meaning');choose(pg,'paragraph');pg.locator('[data-path-screen="produce"]').click();check('unsaved writing returns only to its own lesson',pg.locator('#path-draft').input_value()=='I want to explain my idea clearly.')
  pg.locator('#path-save-draft').click();check('an explicit save writes the current lesson only',pg.evaluate('JSON.parse(localStorage.getItem("family-lab.english.path.1")).drafts.paragraph')=='I want to explain my idea clearly.')
  pg.locator('.path-backup > summary').click()
  with pg.expect_download() as event:pg.locator('#path-export').click()
  backup_file=OUT/'english-path.json';event.value.save_as(str(backup_file));backup=json.loads(backup_file.read_text());check('actual downloaded JSON contains 64 evidence IDs and saved writing',len(backup['completed'])==64 and backup['drafts']['paragraph']=='I want to explain my idea clearly.')
  pg.locator('#path-import').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{bad'})
  pg.wait_for_function('document.querySelector("#path-status").textContent.includes("未导入")');check('invalid import leaves completed work intact',pg.evaluate('EnglishPathModel.summary(EnglishPathUI.state().record).cleared')==32)
  incoming={**backup,'drafts':{'paragraph':'Incoming text must not replace current work.'}}
  pg.locator('#path-import').set_input_files({'name':'merge.json','mimeType':'application/json','buffer':json.dumps(incoming).encode()});pg.wait_for_function('document.querySelector("#path-status").textContent.includes("已合并")');check('valid import preserves the current saved writing',pg.locator('#path-draft').input_value()=='I want to explain my idea clearly.')
  pg.reload(wait_until='load');pg.wait_for_function('window.WorkshopTest');check('route evidence and saved writing survive an actual reload',pg.evaluate('EnglishPathModel.summary(EnglishPathUI.state().record).cleared')==32 and pg.evaluate('EnglishPathUI.state().record.drafts.paragraph')=='I want to explain my idea clearly.')
  ctx.close()
  broken=browser.new_context(viewport={'width':1280,'height':900},locale='zh-CN');broken.add_init_script('localStorage.setItem("family-lab.english.path.1","{broken");');bp=load(broken)
  bp.locator('[data-path-screen="produce"]').click();bp.locator('#path-draft').fill('Temporary work.');bp.locator('#path-save-draft').click();check('unreadable original record survives later actions and saving',bp.evaluate('localStorage.getItem("family-lab.english.path.1")')=='{broken' and not state(bp)['pathStorage']['persistent'] and '内存' in bp.locator('#path-draft-status').inner_text())
  bp.locator('.path-backup > summary').click();check('original raw record can be exported explicitly',bp.locator('#path-export-raw').is_visible());broken.close()
  mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='zh-CN');mp=load(mobile)
  for width in [320,390,768]:
   mp.set_viewport_size({'width':width,'height':844});check(f'{width}px: no unintended horizontal page overflow',mp.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  mp.set_viewport_size({'width':390,'height':844});mp.locator('#path-directory > summary').tap();mp.locator('[data-path-stage="7"]').tap();mp.locator('#path-chapter-lessons [data-path-go="paragraph"]').tap();check('phone route map freely reaches the last stage',state(mp)['lesson']=='paragraph')
  mp.locator('[data-path-screen="challenge"]').tap();mp.locator('.path-option').nth(0).tap();mp.locator('#path-submit').tap();check('phone submits through native touch controls',state(mp)['submitted'])
  mp.evaluate('scrollTo(0,0)');before=mp.evaluate('scrollY');touch=mobile.new_cdp_session(mp)
  touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':195,'y':650,'id':1}]})
  for shift in range(20,181,20):touch.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':195,'y':650-shift,'id':1}]})
  touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});mp.wait_for_timeout(200)
  check('phone reading remains vertically scrollable with trusted touch input',mp.evaluate('scrollY')>before+20)
  mp.screenshot(path=str(OUT/'english-phone.png'),full_page=True)
  mobile.close();check('no uncaught errors across the route',not report['errors']);check('no remote runtime requests',not report['externalRequests']);browser.close();report['status']='passed'
except Exception as e:report['exception']=str(e);raise
finally:(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('ENGLISH PATH REPORT',len(report['checks']),report['status'],flush=True)
