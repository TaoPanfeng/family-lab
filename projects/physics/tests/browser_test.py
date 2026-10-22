"""Browser integration tests. Python + Playwright + Chromium are test-only dependencies.
The browser's policy is never disabled. If file navigation is blocked, the exact
built HTML is mounted with set_content and that limitation is recorded.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import csv, io, json, os, shutil, time, traceback
ROOT=Path(__file__).resolve().parents[1]
REPORT={'app':'GuanWu Physics Lab 1.0','checks':[],'errors':[],'network':[],'viewport_checks':[]}
ART=ROOT/'tests'/'artifacts';ART.mkdir(exist_ok=True)

def check(name, fn):
 try:
  fn();REPORT['checks'].append({'name':name,'passed':True});print('PASS',name,flush=True)
 except Exception as e:
  REPORT['checks'].append({'name':name,'passed':False,'error':str(e)});print('FAIL',name,str(e)[:260],flush=True)

def require(value, message='assertion failed'):
 if not value:raise AssertionError(message)

def near(a,b):require(abs(a-b)<1e-7*max(1,abs(a),abs(b)),f'{a} != {b}')

def run():
 with sync_playwright() as p:
  exe=os.environ.get('GW_BROWSER') or shutil.which('chromium') or shutil.which('google-chrome')
  options={'headless':True}
  if exe:options['executable_path']=exe
  if os.name!='nt' and hasattr(os,'geteuid') and os.geteuid()==0:options['args']=['--no-sandbox']
  browser=p.chromium.launch(**options);REPORT['browser']=browser.version
  context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  page=context.new_page();page.set_default_timeout(5000)
  def attach(pg):
   pg.on('pageerror',lambda e:REPORT['errors'].append(str(e)))
   pg.on('request',lambda r:REPORT['network'].append(r.url))
  try:
   page.goto((ROOT/'index.html').as_uri(),wait_until='load',timeout=8000)
   page.wait_for_function('!!window.GuanWu',timeout=2500)
   REPORT['loading']='file:// direct navigation'
  except Exception as e:
   REPORT['navigation_limitation']=str(e).split('\n')[0]
   page.close();page=context.new_page();page.set_default_timeout(5000)
   page.set_content((ROOT/'index.html').read_text('utf8'),wait_until='load')
   REPORT['loading']='exact built HTML through Playwright set_content; native file navigation unverified'
  attach(page)
  page.wait_for_function('!!window.GuanWu')
  state=lambda:page.evaluate('GuanWu.getState()')
  results=lambda:page.evaluate('GuanWu.getResults()')
  def select(id):
   page.evaluate('(id)=>GuanWu.selectLab(id)',id)
   page.wait_for_timeout(40)
  def save_png(filename,full=True):
   page.evaluate('window.scrollTo(0,0)');page.wait_for_timeout(80)
   page.screenshot(path=str(ROOT/'previews'/filename),full_page=full)
  def nval(key,value):
   el=page.locator('#value-'+key);el.fill(str(value));el.press('Enter')
  def choose_mode(mode):page.locator('button[data-mode="'+mode+'"]').click()
  def initial():
   require(state()['lab']=='jet');near(results()['speed'],14.007141035914502)
   require(page.locator('.metric').count()==4)
   require(page.locator('[data-lab]').count()==16)
   require(not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
  check('Initial lab and four live readouts',initial)
  save_png('01-default-desktop.png')
  catalog=page.evaluate('LabCatalog.labs.map(l=>({id:l.id,steps:l.steps.length,params:l.params,mission:l.mission}))')
  for item in catalog:
   id=item['id']
   def mission(item=item,id=id):
    select(id);choose_mode('family')
    require(page.locator('.discovery').count()==0,'answer leaked before guessing')
    page.locator('[data-guess="0"]').click()
    require(page.locator('#reveal-mission').is_disabled(),'answer should be gated')
    require(not state()['revealed'])
    page.locator('#apply-mission').click()
    s=state();require(s['params'][item['mission']['key']]==item['mission']['target'])
    require(s['compare'] and s['baseline'] is not None)
    require(not s['revealed'])
    page.locator('#reveal-mission').click()
    require(state()['revealed']);require(page.locator('.discovery').count()==1)
   check(id+': prediction → single-variable A/B → explanation',mission)
   def formulas(item=item,id=id):
    choose_mode('research')
    for i in range(item['steps']):
     page.locator('[data-step="'+str(i)+'"]').click()
     require(state()['step']==i)
     require(page.locator('.formula-display').inner_text().strip())
     require('NaN' not in page.locator('.substitution').inner_text())
    require(page.locator('#step-next').is_disabled())
    page.locator('[data-tab="chart"]').click()
    numeric=[q for q in item['params'] if q['type']=='number']
    page.select_option('#chart-x',numeric[-1]['key'])
    page.select_option('#chart-y',page.locator('#chart-y option').last.get_attribute('value'))
    require(page.locator('#chart-canvas').count()==1)
    page.locator('[data-tab="boundary"]').click()
    require(page.locator('#panel-boundary a').count()>0)
   check(id+': all formula steps, chart axes and sources',formulas)
   def controls(item=item,id=id):
    select(id);choose_mode('research')
    for q in item['params']:
     if q['type']=='number':
      for val in [q['min'],q['max']]:
       page.locator('#range-'+q['key']).evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}));}',val)
       near(state()['params'][q['key']],val)
     else:
      for val,label in q['options']:
       page.select_option('#value-'+q['key'],str(val))
       require(str(state()['params'][q['key']])==str(val))
     require('NaN' not in page.locator('#metrics').inner_text())
     require(page.evaluate('Object.values(GuanWu.getResults()).filter(v=>typeof v==="number").every(Number.isFinite)'))
    page.wait_for_timeout(50)
   check(id+': rendered numeric extrema and all select options',controls)
  def ab():
   select('jet');nval('diameter',10);page.locator('#pin-baseline').click();nval('diameter',20)
   s=state();require(s['baseline']['diameter']==10);near(results()['flow'],4*1.100118284405628)
   require('只改变了' in page.locator('#comparison-info').inner_text())
   nval('height',15);require('不是严格' in page.locator('#comparison-info').inner_text())
   page.locator('#reset-params').click();require(state()['baseline']['diameter']==10)
   require(state()['params']['height']==10)
   page.select_option('#value-fluid','mercury');require(page.locator('#danger-banner').is_visible())
   page.locator('#reset-params').click();nval('diameter',20)
   page.evaluate('GuanWu.setTime(1.1)');save_png('03-jet-comparison.png')
   page.locator('#compare-toggle').click();require(not state()['compare'])
   page.locator('#compare-toggle').click();require(state()['compare'])
  check('A/B isolation, multi-variable warning, reset and mercury warning',ab)
  def playback():
   select('acceleration');page.locator('#play-btn').click();page.wait_for_timeout(260)
   require(state()['time']>0);page.locator('#play-btn').click();t=state()['time'];page.wait_for_timeout(160);near(state()['time'],t)
   page.locator('#timeline').evaluate('(el)=>{el.value=500;el.dispatchEvent(new Event("input",{bubbles:true}));}')
   near(state()['time'],2.5);require('2.50' in page.locator('#time-label').inner_text())
   page.select_option('#time-scale','2');page.locator('#rewind-btn').click();page.locator('#play-btn').click();page.wait_for_timeout(180)
   require(state()['time']>.15);nval('a',3);require(not state()['playing']);near(state()['time'],0)
   page.evaluate('document.activeElement.blur()');page.keyboard.press('Space');require(state()['playing'])
   page.keyboard.press('Space');require(not state()['playing'])
   page.locator('#value-a').focus();page.keyboard.press('r');near(state()['params']['a'],3)
  check('Play/pause, scrubbing, speed, parameter restart and keyboard',playback)
  def drag():
   select('jet');page.wait_for_timeout(100)
   box=page.locator('#scene-canvas').bounding_box()
   geo=page.evaluate('LabScene.draw(document.getElementById("scene-canvas"),"jet",GuanWu.getState().params,0,{interactive:true})')
   h=geo['handles'][0];x=box['x']+geo['offsetX']+h['x']*geo['scale'];y=box['y']+geo['offsetY']+h['y']*geo['scale']
   page.mouse.move(x,y);page.mouse.down();page.mouse.move(x,y-45,steps=8);page.mouse.up()
   require(state()['params']['height']!=10,'height handle did not respond')
  check('Direct manipulation of water-height handle',drag)
  def charts():
   select('jet');page.locator('[data-tab="chart"]').click();page.select_option('#chart-x','diameter');page.select_option('#chart-y','flow')
   with page.expect_download() as dl:page.locator('#export-csv').click()
   target=ART/'jet-flow.csv';dl.value.save_as(target)
   rows=list(csv.reader(io.StringIO(target.read_text('utf-8-sig'))));require(len(rows)==63)
   near(float(rows[2][0]),2);near(float(rows[-1][0]),40)
   near(float(rows[-1][1])/float(rows[2][1]),400)
  check('Actual CSV download: 61 samples, headers and correct values',charts)
  def note_create():
   select('jet');page.locator('#pin-baseline').click();nval('diameter',20);page.evaluate('GuanWu.setTime(.75)')
   page.locator('#save-note').click()
   page.locator('[name=title]').fill('<img src=x onerror="window.hacked=true">')
   page.locator('[name=guess]').fill('孔大一倍，也许跑得更快。')
   page.locator('[name=discovery]').fill('直径加倍，速度没变，流量变成四倍。')
   page.locator('[name=question]').fill('水位下降时呢？')
   page.locator('#note-form button[type=submit]').click();require(len(page.evaluate('GuanWu.getNotes()'))==1)
   page.locator('[data-page=notes]').click();require(not page.evaluate('!!window.hacked'))
   require(page.locator('#page-notes img').count()==0)
   require('<img src=x' in page.locator('#page-notes').inner_text())
   page.locator('[data-edit-note]').click();page.locator('[name=title]').fill('孔大了，不等于水更快')
   page.locator('#note-form button[type=submit]').click()
   n=page.evaluate('GuanWu.getNotes()[0]');near(n['scene']['time'],.75);require(n['scene']['baseline']['diameter']==10)
   save_png('04-discoveries.png')
   page.locator('[data-restore-note]').click();near(state()['time'],.75);require(state()['params']['diameter']==20 and state()['compare']);require(not state()['playing'])
  check('Note create/edit, XSS text escaping, A/B and time restoration',note_create)
  def notes_files():
   page.locator('[data-page=notes]').click()
   with page.expect_download() as dl:page.locator('#export-backup').click()
   target=ART/'notes.json';dl.value.save_as(target);data=json.loads(target.read_text('utf8'));require(len(data['notes'])==1)
   page.locator('#import-input').set_input_files(target);page.wait_for_timeout(120);require(len(page.evaluate('GuanWu.getNotes()'))==1)
   invalid=ART/'invalid.json';invalid.write_text('{"app":"wrong","notes":[]}',encoding='utf8')
   page.locator('#import-input').set_input_files(invalid);page.wait_for_timeout(120);require(len(page.evaluate('GuanWu.getNotes()'))==1)
   require('原记录没有改变' in page.locator('#toast').inner_text())
   newdata=json.loads(json.dumps(data));newdata['notes'][0]['id']='import-new-01';newdata['notes'][0]['title']='导入的独立发现'
   more=ART/'valid-import.json';more.write_text(json.dumps(newdata,ensure_ascii=False),encoding='utf8')
   page.locator('#import-input').set_input_files(more);page.wait_for_timeout(120);require(len(page.evaluate('GuanWu.getNotes()'))==2)
   page.locator('[data-delete-note]').first.click();page.locator('#confirm-cancel').click();require(len(page.evaluate('GuanWu.getNotes()'))==2)
   page.locator('[data-delete-note]').first.click();page.locator('#confirm-ok').click();require(len(page.evaluate('GuanWu.getNotes()'))==1)
   page.locator('#undo-delete').click();require(len(page.evaluate('GuanWu.getNotes()'))==2)
  check('Actual JSON export/import, duplicate merge, atomic reject, delete/cancel/undo',notes_files)
  def snapshot():
   select('jet');page.locator('#pin-baseline').click();nval('diameter',20)
   with page.expect_download() as dl:page.locator('#snapshot-btn').click()
   target=ART/'snapshot.png';dl.value.save_as(target);raw=target.read_bytes();require(raw[:8]==b'\x89PNG\r\n\x1a\n');require(len(raw)>10000)
  check('Actual PNG scene export with A/B',snapshot)
  def nav():
   page.locator('[data-page=map]').click();require(page.locator('.route').count()==3)
   require('定律' in page.locator('#page-map').inner_text());save_png('05-formula-map.png')
   page.locator('[data-map-lab=boiling]').first.click();require(state()['lab']=='boiling')
   page.locator('#lab-search').fill('滑轮');require(page.locator('[data-lab]').count()==1)
   page.locator('[data-lab=pulley]').click();require(state()['lab']=='pulley')
   page.locator('#lab-search').fill('不存在的关键字');require('没有找到' in page.locator('#lab-list').inner_text())
   page.locator('#lab-search').fill('');require(page.locator('[data-lab]').count()==16)
   choose_mode('child');require(state()['tab']=='explore')
   choose_mode('family');page.locator('#swap-driver').click();require(state()['driver']=='parent')
   page.locator('#help-btn').click();require(page.locator('#help-dialog').is_visible());page.keyboard.press('Escape');require(not page.locator('#help-dialog').is_visible())
   page.locator('[data-tab=explore]').focus();page.keyboard.press('ArrowRight');require(state()['tab']=='formula')
   page.keyboard.press('End');require(state()['tab']=='boundary')
  check('Formula-map routing, library search, modes, roles, help and keyboard tabs',nav)
  def previews():
   choose_mode('research');select('boiling');page.locator('#pin-baseline').click();nval('altitude',5000);page.locator('[data-step="2"]').click();save_png('06-boiling.png')
   select('barometer');page.select_option('#value-fluid','mercury');page.locator('[data-step="2"]').click();save_png('07-barometer.png')
   select('pulley');page.select_option('#value-strands','4');page.evaluate('GuanWu.setTime(2)');page.locator('[data-step="2"]').click();save_png('08-pulley.png')
   # Every Canvas scene is exercised at a mid-point and visually auditable in artifacts.
   for item in catalog:
    select(item['id']);page.evaluate('GuanWu.setTime(Physics.duration(GuanWu.getState().lab,GuanWu.getState().params)*.4)');page.wait_for_timeout(60)
    page.locator('#scene-canvas').screenshot(path=str(ART/(item['id']+'-scene.png')))
  check('Rendered preview set and every Canvas scene at nonzero time',previews)
  def responsive():
   choose_mode('family');select('jet')
   for width,height in [(1024,768),(768,1024),(390,844),(360,800)]:
    page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(80)
    for view in ['lab','map','notes']:
     page.locator('[data-page='+view+']').click();page.wait_for_timeout(40)
     overflow=page.evaluate('document.documentElement.scrollWidth>innerWidth')
     REPORT['viewport_checks'].append({'width':width,'height':height,'view':view,'overflow':overflow});require(not overflow,f'{width} {view} overflow')
    page.locator('[data-page=lab]').click()
   page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(80)
   require(page.locator('#open-library').is_visible())
   page.locator('#open-library').click();require(page.locator('#library').evaluate('el=>el.classList.contains("open")'))
   page.locator('#close-library').click();require(not page.locator('#library').evaluate('el=>el.classList.contains("open")'))
   page.locator('#pin-baseline').click();nval('diameter',20);require(not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
   page.locator('#compare-toggle').click();nval('diameter',10);save_png('02-default-mobile.png')
  check('Tablet/mobile: 12 viewport-page combinations and library controls',responsive)
  def localstore_mock():
   # A deliberately labelled application-storage contract test, not native file:// persistence.
   pg=context.new_page();attach(pg)
   pg.evaluate('''()=>{window.__storage=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{setItem:(k,v)=>__storage.set(k,String(v)),getItem:k=>__storage.get(k)||null,removeItem:k=>__storage.delete(k)}});}''')
   pg.set_content((ROOT/'index.html').read_text('utf8'));pg.wait_for_function('!!window.GuanWu')
   pg.evaluate('GuanWu.setParam("height",12)');pg.wait_for_timeout(350)
   saved=pg.evaluate('localStorage.getItem("guanwu.physics.v1")');require(saved is not None)
   require(json.loads(saved)['scene']['params']['height']==12)
   pg.set_content((ROOT/'index.html').read_text('utf8'));pg.wait_for_function('!!window.GuanWu');require(pg.evaluate('GuanWu.getState().params.height')==12);require(not pg.evaluate('GuanWu.getState().playing'));pg.close()
  check('Explicit mocked-storage contract: autosave and paused restoration',localstore_mock)
  check('No uncaught browser errors',lambda:require(not REPORT['errors'],str(REPORT['errors'])))
  # Only user-requested Blob downloads are allowed; source links were inspected, never opened.
  external=[url for url in REPORT['network'] if url.startswith(('https://','http://'))]
  check('Offline interactions trigger no external HTTP requests',lambda:require(not external,str(external)))
  REPORT['native_storage_available']=state()['storage']
  browser.close()

try:run()
except Exception as e:
 REPORT['fatal']=str(e);traceback.print_exc()
finally:
 REPORT['passed']=sum(x['passed'] for x in REPORT['checks']);REPORT['failed']=sum(not x['passed'] for x in REPORT['checks'])
 (ROOT/'docs'/'browser-test-report.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding='utf8')
 print('SUMMARY',REPORT['passed'],'passed',REPORT['failed'],'failed',flush=True)
if REPORT.get('fatal') or REPORT['failed']:raise SystemExit(1)
