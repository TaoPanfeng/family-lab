"""Browser/WebGL interaction regression. Optional Python Playwright + Chromium.
CHROMIUM=/path/to/browser python tests/browser-test.py
In this runner URL navigation is forbidden by administrator policy. We load our
own generated HTML with set_content; that is not a file:// navigation test.
No policy is modified. Linux software WebGL needs DISPLAY (e.g. xvfb-run).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json,time,traceback
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'previews';OUT.mkdir(exist_ok=True)
results=[];errors=[];requests=[]
def test(name,fn):
    try:
        detail=fn();results.append({'name':name,'pass':True,**({'details':detail} if detail else {})});print('PASS',name,flush=True)
    except Exception as e:
        results.append({'name':name,'pass':False,'error':str(e)});print('FAIL',name,str(e),flush=True)
def check(value,message='assertion failed'):
    if not value:raise AssertionError(message)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,locale='zh-CN',accept_downloads=True)
    page=context.new_page();page.set_default_timeout(5000)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http://','https://')) else None)
    page.set_content((ROOT/'日月地实验室.html').read_text(encoding='utf-8'),wait_until='load',timeout=30000)
    page.wait_for_function('!!window.LabApp');page.wait_for_timeout(650)
    def ev(s,*args):return page.evaluate(s,*args)
    def st():return ev('LabApp.getState()')
    def settime(iso):ev('(s)=>LabApp.setTime(Date.parse(s))',iso)
    def reset():ev('LabApp.pause();LabApp.setMode("earthmoon");LabApp.setTab("observe")')
    def shot(name):
        ev('document.getElementById("toast").hidden=true');page.wait_for_timeout(180);page.screenshot(path=str(OUT/name),full_page=False)
    test('界面启动并移除加载页',lambda:check(page.locator('#boot').count()==0))
    test('WebGL 实际创建，球体着色器已渲染',lambda:check(ev('LabApp.getScene().renderer.info.render.triangles>5000 && LabApp.getScene().renderer.getContext().getError()===0')))
    settime('2026-10-16T02:00:00Z');shot('01-earth-moon.png')
    test('桌面 1440px 无横向溢出',lambda:check(ev('document.documentElement.scrollWidth===innerWidth')))
    def tz():
        before=ev('LabApp.getPhysics().state.sun'),st()['time'];page.locator('#timezone').select_option('0');after=ev('LabApp.getPhysics().state.sun'),st()['time'];check(before==after);check(page.locator('#date-input').input_value().startswith('2026-10-16T02:00'))
        page.locator('#timezone').select_option('8')
    test('切换时区只改显示，不跳天体位置',tz)
    def direct_date():
        page.locator('#date-input').fill('2000-02-29T12:34:56');page.locator('#date-input').dispatch_event('change');check(st()['time']==951798896000)
    test('年月日时分秒输入驱动星历',direct_date)
    def date_buttons():
        t=st()['time'];page.locator('#next-day').click();check(st()['time']==t+86400000);page.locator('#previous-day').click();check(st()['time']==t)
    test('前后一天可逆',date_buttons)
    def year_end():
        settime('2026-07-01T00:00:00Z');ev('let el=document.getElementById("year-slider");el.value="10000";el.dispatchEvent(new Event("input"))');check(page.locator('#timeline-year').inner_text()=='2026');page.locator('#next-year').click();check(page.locator('#timeline-year').inner_text()=='2027')
    test('拖到年末不意外跳年，年按钮有效',year_end)
    def camera():
        reset();before=st()['camera'];box=page.locator('#scene-host').bounding_box();x=box['x']+box['width']*.5;y=box['y']+box['height']*.55;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+80,y+22,steps=5);page.mouse.up();after=st()['camera'];check(abs(after['azimuth']-before['azimuth'])>.1);page.locator('#zoom-in').click();check(st()['camera']['distance']<after['distance']);page.locator('#reset-camera').click()
    test('暂停时三维镜头拖动和缩放有效',camera)
    def scaling():
        base=ev('LabApp.getPhysics().state.moon');page.locator('#scale-real').click();check(st()['realScale']);r=ev('LabApp.getScene().moon.position.clone().sub(LabApp.getScene().earth.position).length()/LabApp.getScene().earth.scale.x');check(abs(r-ev('LabApp.getPhysics().state.moonDistance/Astro.RE'))<1e-6);check(base==ev('LabApp.getPhysics().state.moon'));page.locator('#scale-demo').click();check(not st()['realScale'])
    test('真实地月比和显示放大不改变物理数据',scaling)
    def dblclick():
        reset();settime('2026-10-16T02:00:00Z');page.locator('#reset-camera').click();page.wait_for_timeout(80)
        pos=ev('''() => {const s=LabApp.getScene(),v=s.moon.position.clone().project(s.camera),r=document.getElementById('scene-host').getBoundingClientRect();return {x:r.x+(v.x+1)*r.width/2,y:r.y+(1-v.y)*r.height/2};}''')
        page.mouse.dblclick(pos['x'],pos['y']);check(st()['camera']['focus']=='moon');page.locator('#reset-camera').click()
    test('双击月球可以靠近并跟随',dblclick)
    def play():
        settime('2026-01-01T00:00:00Z');page.locator('#auto-slow').uncheck();page.locator('#speed').select_option('86400');before=st()['time'];page.locator('#play-btn').click();page.wait_for_timeout(400);page.locator('#play-btn').click();check(st()['time']>before);page.locator('#reverse-btn').click();before=st()['time'];page.locator('#play-btn').click();page.wait_for_timeout(350);page.locator('#play-btn').click();check(st()['time']<before);page.locator('#reverse-btn').click();page.locator('#auto-slow').check()
    test('播放、暂停、调速与倒放都推进同一时钟',play)
    def autoslow():
        settime('2024-04-08T17:40:00Z');page.locator('#speed').select_option('86400');page.locator('#play-btn').click();page.wait_for_function('LabApp.getState().rate===120',timeout=5000);page.locator('#play-btn').click();check(st()['rate']==120)
    test('高速跨越食事件时提前减速而不漏过',autoslow)
    def seasons():
        settime('2026-06-21T08:24:31Z');page.locator('[data-tab="seasons"]').click();page.locator('[data-view="overview"]').click();check(page.locator('#season-buttons button').count()==4);check('夏季' in page.locator('#north-season').inner_text());shot('02-seasons.png');page.locator('#season-buttons button').nth(3).click();check('冬季' in page.locator('#north-season').inner_text())
    test('二分二至跳转、天文四季与日照图',seasons)
    def experiment():
        page.locator('[data-tab="lab"]').click();before=st()['time'];page.locator('#upright-earth').click();check(st()['experiment']['tilt']==0);check(page.locator('#experiment-banner').is_visible());check(abs(ev('LabApp.getPhysics().state.sunDeclination'))<.01);page.locator('#flat-moon').click();check(st()['experiment']['inclination']==0);page.locator('[data-tab="events"]').click();check(page.locator('#search-events').is_disabled());page.locator('[data-tab="lab"]').click();shot('03-experiment.png');page.locator('#restore-reality').click();check(not st()['experiment']['enabled']);check(st()['time']==before)
    test('扶正地轴、压平月轨、实验隔离与一键恢复',experiment)
    def quiz():
        page.locator('#quiz button').nth(1).click();check(page.locator('#quiz-explanation').is_visible());check('判断正确' in page.locator('#quiz-explanation').inner_text());page.locator('#kids-btn').click();check(st()['kids']);check('小小科学家' in page.locator('#quiz').inner_text());page.locator('#kids-btn').click()
    test('互动问答和儿童讲解切换',quiz)
    def eclipse(index,typ,screenshot):
        ev('(i)=>LabApp.enterCatalog(i)',index);page.wait_for_function('(t)=>document.getElementById("event-detail").innerText.includes(t)',arg=typ);page.wait_for_timeout(400);check(st()['view']=='ground');check(typ in page.locator('#event-detail').inner_text());shot(screenshot)
    test('2024 日全食：当地真实角直径遮挡与日冕',lambda:eclipse(0,'月影掠过北美','04-total-solar.png'))
    test('日全食太阳全遮挡，日冕仅视觉示意',lambda:check(ev('LabApp.getPhysics().local.solarCoverage===1 && LabApp.getScene().corona.visible')))
    def grounddrag():
        before=ev('LabApp.getScene().camera.quaternion.toArray()');box=page.locator('#scene-host').bounding_box();x=box['x']+box['width']*.52;y=box['y']+box['height']*.5;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+25,y+13,steps=3);page.mouse.up();page.wait_for_timeout(100);check(before!=ev('LabApp.getScene().camera.quaternion.toArray()'));page.locator('[data-track="sun"]').click();page.locator('#zoom-in').click();page.wait_for_timeout(80);check('视角 1.5' in page.locator('.ground-hud').inner_text());page.locator('#reset-camera').click()
    test('暂停时地面镜头可旋转、缩放并恢复追踪',grounddrag)
    def contacts():
        page.locator('[data-contact="0"]').click();first=st()['time'];page.locator('#event-peak').click();check(st()['time']>first);page.locator('#replay-event').click();page.wait_for_timeout(300);check('播放中' in page.locator('#clock-status').inner_text() or page.locator('#play-btn').get_attribute('aria-label')=='暂停');ev('LabApp.pause()');page.locator('#event-peak').click();page.locator('#event-space').click();check(st()['view']=='earthmoon');shot('05-eclipse-from-space.png')
    test('食接触点跳转、过程回放、太空视角联动',contacts)
    def observer_visibility():
        page.locator('[data-tab="observe"]').click();page.locator('#city-select').select_option('0');page.locator('[data-tab="events"]').click();check('当前地点不可见' in page.locator('#event-detail').inner_text())
    test('同场北美日食换到上海明确显示不可见',observer_visibility)
    test('2009 上海日全食可重建',lambda:eclipse(1,'上海的白昼星空','06-shanghai-2009.png'))
    test('2023 日环食可重建',lambda:eclipse(2,'太阳变成金色指环','07-annular.png'))
    test('2025 月全食红月亮可重建',lambda:eclipse(3,'月亮走进地球的影子','08-total-lunar.png'))
    def moonvisibility():
        page.locator('[data-tab="observe"]').click();page.locator('#city-select').select_option('0');page.locator('[data-tab="events"]').click();check('当前地点不可见' in page.locator('#event-detail').inner_text())
    test('月食可见性也检查所选地点地平线',moonvisibility)
    def search():
        settime('2026-01-01T00:00:00Z');page.locator('#search-events').click();page.wait_for_function('document.getElementById("upcoming-events").querySelectorAll("button").length>=6');check(page.locator('#upcoming-events button').count()==6)
    test('搜索下一场日月食与四种主要月相',search)
    def phasejump():
        page.locator('[data-tab="observe"]').click();page.locator('[data-phase="180"]').click();check(ev('LabApp.getPhysics().state.fraction>.995'))
    test('月相小图标可以跳到真实满月',phasejump)
    def snapshot():
        base=st();settime('2030-01-01T00:00:00Z');ev('(s)=>LabApp.restoreSnapshot(s)',base);check(st()['time']==base['time']);check(st()['observer']==base['observer']);check(st()['camera']==base['camera']);check(page.locator('#play-btn').get_attribute('aria-label')=='播放')
    test('场景可恢复日期、地点、图层、镜头并保持暂停',snapshot)
    def reject():
        valid=st()
        for field,val in [('version',999),('time',-1e15),('rate',1e10),('view','<script>')]:
            obj=dict(valid);obj[field]=val
            check(ev('(s)=>{try{LabApp.validateSnapshot(s);return false;}catch{return true;}}',obj))
        obj=json.loads(json.dumps(valid));obj['observer']['lat']=91;check(ev('(s)=>{try{LabApp.validateSnapshot(s);return false;}catch{return true;}}',obj))
    test('导入格式、非法范围与异常枚举被拒绝',reject)
    def jsonexport():
        page.locator('#save-btn').click()
        with page.expect_download(timeout=5000) as dl:page.locator('#export-scene').click()
        download=dl.value;tmp=ROOT/'tests/export-roundtrip.json';download.save_as(tmp)
        parsed=json.loads(tmp.read_text());check(parsed['version']==1);check(parsed['time']==st()['time']);settime('2030-01-01T00:00:00Z')
        page.locator('#import-file').set_input_files(tmp);page.wait_for_timeout(150);check(st()['time']==parsed['time']);tmp.unlink()
    test('真实点击导出 JSON，再从文件导入恢复',jsonexport)
    def png():
        if page.locator('#modal').evaluate('(el)=>el.open'):page.locator('#close-modal').click()
        with page.expect_download(timeout=5000) as dl:page.locator('#capture-btn').click()
        tmp=ROOT/'tests/observation-export.png';dl.value.save_as(tmp);check(tmp.read_bytes().startswith(b'\x89PNG\r\n\x1a\n'));check(tmp.stat().st_size>10000);tmp.unlink()
    test('观测画面 PNG 实际导出',png)
    def helpdialog():
        page.locator('#help-btn').click();check(page.locator('#modal').evaluate('(el)=>el.open'));page.locator('#help-about').click();check('Moshier' in page.locator('#modal-body').inner_text());check('AGPL' in page.locator('#modal-body').inner_text());page.locator('#close-modal').click()
    test('帮助、精度与许可说明可打开',helpdialog)
    def resize():
        reset();settime('2026-10-16T02:00:00Z');page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300);check(ev('document.documentElement.scrollWidth===innerWidth'));shot('09-mobile.png');page.locator('#menu-btn').click();check(page.locator('#sidebar').evaluate('(el)=>el.classList.contains("open")'));page.locator('[data-view="ground"]').click();check(st()['view']=='ground');check(not page.locator('#sidebar').evaluate('(el)=>el.classList.contains("open")'))
    test('390px 手机排版、菜单和视角切换',resize)
    def tablet():
        page.set_viewport_size({'width':1024,'height':768});reset();page.wait_for_timeout(200);check(ev('document.documentElement.scrollWidth===innerWidth'));shot('10-tablet.png')
    test('1024px 平板排版无横向溢出',tablet)
    test('应用运行不请求任何外部网络资源',lambda:check(len(requests)==0,str(requests)))
    test('交互全过程没有 JavaScript 或 WebGL 错误',lambda:check(len(errors)==0,str(errors)))
    report={'testedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'browser':browser.version,'platform':'Linux Chromium / SwiftShader WebGL / Xvfb',
      'loadMethod':'Playwright set_content; no browser URL navigation due runner administrator policy',
      'notTested':['Windows operating system','actual local file:// navigation','native localStorage persistence','real iOS/Android touch hardware'],
      'total':len(results),'passed':sum(r['pass'] for r in results),'failed':sum(not r['pass'] for r in results),'errors':errors,'externalRequests':requests,'results':results}
    (ROOT/'tests/browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');browser.close()
print(json.dumps({k:report[k] for k in ('total','passed','failed')},ensure_ascii=False))
if report['failed']:raise SystemExit(1)
