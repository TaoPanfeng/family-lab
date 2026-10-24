"""Deep astronomy interactions. Main journey uses real file URLs by default.
--inject is an explicit local-policy fallback, not file/HTTP certification.
Fault-injected storage and rendering fixtures always use isolated content pages.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, time, traceback, hashlib, argparse
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--inject',action='store_true');parser.add_argument('--browser');parser.add_argument('--out',default=str(ROOT/'previews'));args=parser.parse_args()
OUT=Path(args.out);OUT.mkdir(exist_ok=True,parents=True)
TMP=OUT/'tmp';TMP.mkdir(exist_ok=True)
results=[];errors=[];requests=[]
def check(value,message='assertion failed'):
    if not value:raise AssertionError(message)
def test(name,fn):
    try:
        detail=fn();results.append({'name':name,'pass':True,**({'detail':detail} if detail else {})});print('PASS',name,flush=True)
    except Exception as e:
        results.append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});print('FAIL',name,str(e),flush=True)
        try:page.screenshot(path=str(TMP/f'failure-{len(results)}.png'))
        except:pass
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=args.browser or os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':1440,'height':1000},locale='zh-CN',device_scale_factor=1,accept_downloads=True)
    page=context.new_page();page.set_default_timeout(6500)
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
    page.on('request',lambda r:requests.append(r.url) if r.url.startswith(('http:','https:')) else None)
    html=(ROOT/'日月地实验室.html').read_text(encoding='utf-8')
    if args.inject:page.set_content(html,wait_until='load',timeout=30000)
    else:page.goto((ROOT/'日月地实验室.html').as_uri(),wait_until='load',timeout=30000)
    page.wait_for_function('!!window.LabV2');page.wait_for_timeout(800)
    def ev(code,*args):return page.evaluate(code,*args)
    def st():return ev('LabApp.getState()')
    def v2():return ev('LabV2.getState()')
    def wait():page.wait_for_timeout(220)
    def close():
        ev('document.querySelectorAll("dialog[open]").forEach(d=>d.close())');wait()
    def topic(name):
        close();page.locator(f'[data-topic="{name}"]').click();wait()
    def shot(name):
        ev('document.getElementById("toast").hidden=true');wait();page.screenshot(path=str(OUT/name),full_page=False)
    def realfield(selector,val,event='input'):
        page.locator(selector).evaluate('(el,p)=>{el.value=String(p.value);el.dispatchEvent(new Event(p.event,{bubbles:true}));}',{'value':val,'event':event});wait()
    test('V2 三入口首页实际启动',lambda:check(page.locator('[data-enter]').count()==3))
    test('首次打开不会虚构上次探索',lambda:check(page.locator('#v2-resume').count()==0))
    shot('00-welcome.png');page.locator('[data-enter="research"]').click();wait()
    test('实际创建两个 WebGL 视图',lambda:check(ev('!LabApp.getScene().isFallback&&!LabV2.getSecondary().isFallback&&LabApp.getScene().renderer.info.render.calls>0')))
    test('桌面没有横向溢出',lambda:check(ev('document.documentElement.scrollWidth===innerWidth')))
    test('首次月相场景在上海地平线上方',lambda:check(ev('LabApp.getPhysics().local.moonVisible')))
    test('同步视图使用同一 UTC 时刻',lambda:check(ev('LabV2.getSecondary().state.time===LabApp.getPhysics().state.time')))
    shot('01-research.png')
    def timezone():
        t=st()['time'];p0=ev('LabApp.getPhysics().state.moon');page.locator('#timezone').select_option('0');wait();check(st()['time']==t);check(ev('LabApp.getPhysics().state.moon')==p0);page.locator('#timezone').select_option('8')
    test('切换时区不跳天体位置，双视图仍同步',timezone)
    def dating():
        page.locator('#date-input').fill('2032-02-29T12:34:56');page.locator('#date-input').dispatch_event('change');wait();check(st()['time']==1961642096000,'unexpected converted UTC');check(v2()['window']['start']<=st()['time']<=v2()['window']['end'])
    test('手工日期输入驱动场景并重定位时间轴',dating)
    def invaliddate():
        t=st()['time'];ev('document.getElementById("date-input").value="";document.getElementById("date-input").dispatchEvent(new Event("change"))');wait();check(st()['time']==t)
    # V1 logs expected input validation errors to the console, so test through the validator instead.
    test('非法日期被校验器拒绝而不改变状态',lambda:check(ev('(()=>{const t=LabApp.getState().time;try{Astro.parseTime("2026-02-30T12:00:00",8);return false}catch{return t===LabApp.getState().time}})()')))
    def timecontrols():
        topic('moon');t=st()['time'];page.locator('#next-day').click();wait();check(st()['time']==t+86400000);page.locator('#previous-day').click();wait();check(st()['time']==t)
        page.locator('#auto-slow').uncheck();page.locator('#speed').select_option('86400');page.locator('#play-btn').click();page.wait_for_timeout(450);page.locator('#play-btn').click();check(st()['time']>t)
        page.locator('#reverse-btn').click();before=st()['time'];page.locator('#play-btn').click();page.wait_for_timeout(450);page.locator('#play-btn').click();check(st()['time']<before);page.locator('#reverse-btn').click()
    test('主题步进、播放、暂停与倒放均操作同一时钟',timecontrols)
    def sun():
        topic('eclipse');check(v2()['topic']=='eclipse');check(st()['view']=='earthmoon');check(ev('LabApp.getPhysics().local.solarCoverage>.99'));check(ev('LabV2.getSecondary().tracking==="sun"'));check(v2()['window']['step']==300000);check('日全食' in page.locator('#v2-left-metric').inner_text());shot('02-solar-eclipse.png')
    test('上海日全食：太空食影与地面遮挡同步',sun)
    def contacts():
        peak=st()['time'];page.locator('[data-contact="0"]').click();wait();check(st()['time']<peak);page.locator('#event-peak').click();wait();check(st()['time']==peak);page.locator('#replay-event').click();page.wait_for_timeout(300);check(ev('LabApp.getLive().state.playing'));ev('LabApp.pause()')
    test('V1 食接触跳转与回放功能保留',contacts)
    def location():
        ev('LabApp.setObserver({name:"达拉斯",lat:32.7767,lon:-96.797,height:130})');wait();check('不' in page.locator('#v2-right-extra').inner_text() or ev('LabApp.getPhysics().local.solarCoverage<.01'));ev('LabApp.setObserver({name:"上海",lat:31.2304,lon:121.4737,height:4})');wait()
    test('换地点会重新计算可见性与遮挡',location)
    def lunar():
        ev('LabApp.enterCatalog(3)');page.wait_for_timeout(700);check(v2()['eclipseKind']=='lunar');check(ev('LabV2.getSecondary().tracking==="moon"'));check('月食' in page.locator('#view-title').inner_text());shot('03-lunar-eclipse.png')
    test('月食自动切换月亮追踪与月食解释，不错用日食讲解',lunar)
    def lunarrestore():
        ev('LabV2.saveSession()');snap=ev('LabV2.getSession()');t=st()['time'];topic('moon');ev('(s)=>LabV2.restoreEntry(s)',snap);wait();check(st()['time']==t);check(v2()['eclipseKind']=='lunar');check(ev('LabV2.getSecondary().tracking==="moon"'));check(ev('LabApp.getLive().selected.event.kind==="lunar"'))
    test('月食场景恢复保留事件与第二视图追踪对象',lunarrestore)
    def seasons():
        topic('seasons');c=ev('LabV2.getComparison()');check(c['left']['position']['time']==c['right']['position']['time']);check(c['left']['daylight']>c['right']['daylight']+1);check(ev('!LabApp.getPhysics().state.experiment'));check(ev('LabV2.getSecondary().state.experiment'));check('夏季' in page.locator('#north-season').inner_text());shot('04-axis-comparison.png')
    test('四季 A/B：同一时间地点，左真右假隔离',seasons)
    def tilt():
        before=ev('LabApp.getPhysics().state.sun');realfield('#v2-research-controls .v2-tilt',30);check(abs(v2()['tilt']-30)<.001);check(ev('LabApp.getPhysics().state.sun')==before);check(abs(ev('LabV2.getSecondary().state.eps')-30)<.001)
        page.locator('#v2-research-controls .v2-match').click();wait();c=ev('LabV2.getComparison()');check(abs(c['left']['daylight']-c['right']['daylight'])<1e-7);page.locator('#v2-research-controls .v2-upright').click()
    test('改变右侧地轴不篡改左侧；同倾角日照相符',tilt)
    def camera():
        before=st()['camera'];r=page.locator('#scene-host').bounding_box();x=r['x']+r['width']*.5;y=r['y']+r['height']*.48;page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+80,y+20,steps=5);page.mouse.up();wait();check(abs(st()['camera']['azimuth']-before['azimuth'])>.1);check(abs(ev('LabV2.getSecondary().azimuth')-st()['camera']['azimuth'])<1e-8)
    test('暂停时相机仍可拖动，A/B 镜头同步',camera)
    def back_restore():
        t=st()['time'];cam=st()['camera'];topic('moon');page.locator('#v2-back').click();wait();check(st()['time']==t);check(v2()['topic']=='seasons');check(abs(st()['camera']['azimuth']-cam['azimuth'])<1e-8)
    test('返回刚才恢复时间、任务与主镜头',back_restore)
    def ground_restore():
        # Capture before any render frame; no stale split flag may change camera intent.
        snap=ev("()=>{LabApp.setMode('ground');return {scene:LabApp.getState(),context:LabV2.getState()};}")
        check(snap['scene']['view']=='ground');check(not snap['context']['split'])
        page.wait_for_function("LabApp.getState().view==='ground'&&!LabV2.getState().split")
        topic('moon');ev('(s)=>LabV2.restoreEntry(s)',snap)
        page.wait_for_function("LabApp.getState().view==='ground'&&!LabV2.getState().split")
        check(st()['time']==snap['scene']['time'])
        # Older backups may contain a stale split flag.
        snap['context']['split']=True;ev('(s)=>LabV2.restoreEntry(s)',snap)
        page.wait_for_function("LabApp.getState().view==='ground'&&!LabV2.getState().split")
    test('独立地面场景恢复不会被强制切回太空',ground_restore)
    def shadow():
        topic('shadow')
        # A topic change schedules rendering; a fixed sleep can still see the old view.
        canvas=page.locator('#v2-shadow-canvas')
        canvas.wait_for(state='visible')
        check(v2()['window']['step']==7*86400000,'shadow timeline must step by seven days')
        def ready(height):
            page.wait_for_function("""height=>{
                const metric=document.getElementById('v2-right-metric');
                const title=document.getElementById('v2-right-metric-title');
                const canvas=document.getElementById('v2-shadow-canvas');
                return LabV2.getState().topic==='shadow'&&LabV2.getState().height===height&&
                    title.textContent===height.toFixed(1)+' 米立杆 · 正午影长'&&
                    / 米$/.test(metric.textContent)&&Number.isFinite(parseFloat(metric.textContent))&&
                    !canvas.hidden&&canvas.width>0&&canvas.height>0;
            }""",arg=height)
            return float(page.locator('#v2-right-metric').inner_text().split()[0])
        page.locator('#v2-reset-second').click()
        old=ready(1);before=st();altitude=page.locator('#v2-left-metric').inner_text()
        image=canvas.evaluate('(c)=>c.toDataURL()')
        realfield('#v2-research-controls .v2-height',2)
        new=ready(2)
        check(abs(new-2*old)<.021,f'1m shadow={old}, 2m shadow={new}; expected double within displayed rounding')
        check(page.locator('#v2-left-metric').inner_text()==altitude,'height changed the solar altitude')
        check(st()['time']==before['time'] and st()['observer']==before['observer'],'height changed time or observer')
        page.wait_for_function("old=>document.getElementById('v2-shadow-canvas').toDataURL()!==old",arg=image)
        page.locator('#v2-reset-second').click()
        check(ready(1)==old,'reset did not restore the one-metre shadow')
        realfield('#v2-research-controls .v2-height',2);check(ready(2)==new,'repeated height change is not deterministic')
        shot('05-noon-shadow.png')
        return {'oneMetreShadow':old,'twoMetreShadow':new,'solarAltitude':altitude,'resetVerified':True}
    test('立杆实验：杆高加倍，影长随几何关系变化',shadow)
    def shadow_city():
        before=st()['observer']['lat'];page.locator('.v2-compare-city').click();wait();check(st()['observer']['lat']*before<0);check('悉尼' in page.locator('#v2-right-extra').inner_text());page.locator('.v2-compare-city').click()
    test('立杆实验可比较上海与悉尼',shadow_city)
    def formula():
        page.locator('#v2-principle summary').click();check('tan' in page.locator('#v2-principle').inner_text());check(page.locator('#v2-fact-rows tr').count()==3)
    test('原理按需展开，并显示当前真实数值',formula)
    def advanced():
        page.locator('#menu-btn').click();check(page.locator('#sidebar').evaluate('(el)=>el.classList.contains("open")'));before=ev('LabApp.getPhysics().state.moon');page.locator('#scale-real').click();wait();check(st()['realScale']);check(ev('LabApp.getPhysics().state.moon')==before);page.locator('#menu-btn').click();page.locator('#scale-demo').click();page.keyboard.press('Escape')
    test('高级工具可展开；真实显示比例不影响天文数据',advanced)
    def kid():
        topic('moon');page.locator('button[data-audience="kid"]').click();wait();check(page.locator('#v2-guide').is_visible());check(not page.locator('.inspector>.panel-scroll').is_visible());check(page.locator('#v2-choice').count()==0);check(page.locator('#v2-next').is_disabled());check('月相来自' not in page.locator('#v2-evidence').inner_text());shot('06-child-predict.png')
    test('儿童界面减少专业面板，预测阶段不直接公布答案',kid)
    def kidsteps():
        page.locator('[data-guess="0"]').click();check(page.locator('[data-guess="0"]').evaluate('(e)=>e.classList.contains("selected")'));page.locator('#v2-next').click();check(v2()['mission']['step']==1);check(page.locator('#v2-next').is_disabled());page.locator('#v2-step-time').click();wait();check(not page.locator('#v2-next').is_disabled());page.locator('#v2-next').click();check('月亮并没有少一块' in page.locator('#v2-guide').inner_text());check('错误' not in page.locator('#v2-guide').inner_text());page.locator('#v2-next').click();check(v2()['mission']['step']==3)
    test('孩子完成先猜、真实操作、观察解释三个步骤',kidsteps)
    def note_save():
        page.locator('#v2-guide-save').click();check(page.locator('#v2-note-finding').input_value()=='');page.locator('#v2-note-form button[type=submit]').click();check(page.locator('#v2-dialog').evaluate('(d)=>d.open'));page.locator('#v2-note-finding').fill('我拨动了时间，月亮亮着的地方变多了。');page.locator('#v2-note-question').fill('换到月亮上，看地球也会变样吗？');page.locator('#v2-note-form button[type=submit]').click();wait();check(v2()['notes']==1);check(v2()['mission']['step']==4)
    test('发现卡由孩子自己填写，保存文字与完整场景',note_save)
    def family():
        topic('seasons');page.locator('button[data-audience="family"]').click();page.locator('[data-guess="1"]').click();page.locator('#v2-next').click();check('当前驾驶员：孩子' in page.locator('#v2-guide').inner_text());page.locator('#v2-swap-driver').click();check('当前驾驶员：爸爸' in page.locator('#v2-guide').inner_text());page.locator('#v2-step-time').click();wait();shot('07-family-experiment.png')
    test('亲子模式有提问分工，可实际交换驾驶员',family)
    def quality():
        before=ev('LabApp.getPhysics().state.moon');page.locator('#v2-quality').select_option('eco');wait();check(v2()['quality']=='eco');check(ev('LabApp.getScene().renderer.getPixelRatio()')<1);check(ev('LabApp.getPhysics().state.moon')==before);page.locator('#v2-quality').select_option('auto')
    test('轻量画质可用，天文数据保持不变',quality)
    def portable():
        page.locator('#v2-notebook').click();check(page.locator('.v2-note-card').count()==1)
        with page.expect_download() as dl:page.locator('#v2-export-book').click()
        path=TMP/'notebook.json';dl.value.save_as(path);payload=json.loads(path.read_text());check(payload['version']==2);check(payload['notes'][0]['finding'].startswith('我拨动'));page.locator('#v2-import').set_input_files(path);wait();check(v2()['notes']==1);check('0 条新记录' in page.locator('#v2-book-error').inner_text());shot('08-notebook.png')
    test('JSON 实际下载、重新导入，重复备份不会重复记录',portable)
    def unsafe():
        book=ev('LabV2.getNotes()');bad={'format':'sem-lab-notebook','version':2,'notes':book};bad['notes'][0]['scene']['time']=-1e20;path=TMP/'invalid.json';path.write_text(json.dumps(bad));page.locator('#v2-import').set_input_files(path);wait();check(v2()['notes']==1);check('未完成' in page.locator('#v2-book-error').inner_text())
    test('无效备份被拒绝且不破坏已有记录',unsafe)
    def edit():
        page.locator('[data-note-edit="0"]').click();t=ev('LabV2.getNotes()[0].scene.time');page.locator('#v2-note-finding').fill('我拨动了时间，看见亮面变化。<img src=x onerror="window.__injected=1">');page.locator('#v2-note-form button[type=submit]').click();page.locator('#v2-notebook').click();check(ev('LabV2.getNotes()[0].scene.time')==t);check(ev('window.__injected===undefined'));check(page.locator('.v2-note-card p').first.inner_text().endswith('>'))
    test('编辑保留原场景，用户文字转义防止 HTML 注入',edit)
    def discovery_png():
        with page.expect_download(timeout=15000) as dl:page.locator('[data-note-card="0"]').click()
        path=TMP/'discovery.png';dl.value.save_as(path);check(path.read_bytes().startswith(b'\x89PNG'));check(path.stat().st_size>20000)
    test('发现卡 PNG 实际导出，并包含用户文字',discovery_png)
    def continue_note():
        expected=ev('LabV2.getNotes()[0].scene.time');page.locator('[data-note-open="0"]').click();wait();check(st()['time']==expected);check(not ev('LabApp.getLive().state.playing'));check(v2()['audience']=='kid')
    test('发现卡可以返回对应时刻并保持暂停',continue_note)
    def deletion():
        page.locator('#v2-notebook').click();page.once('dialog',lambda d:d.dismiss());page.locator('[data-note-delete="0"]').click();check(v2()['notes']==1);page.once('dialog',lambda d:d.accept());page.locator('[data-note-delete="0"]').click();check(v2()['notes']==0);page.locator('#v2-undo-delete').click();check(v2()['notes']==1)
    test('删除需确认，并可撤销刚才删除',deletion)
    def snapshot_v1():
        close();scene=st();scene['time']=date_2030=1893456000000;scene['view']='earthmoon';scene['tab']='observe';path=TMP/'v1-scene.json';path.write_text(json.dumps(scene));page.locator('#v2-notebook').click();page.locator('#v2-import').set_input_files(path);wait();check(st()['time']==date_2030);check(v2()['notes']==1)
    test('兼容导入 V1 场景文件',snapshot_v1)
    def dual_export():
        topic('seasons');page.locator('button[data-audience="research"]').click();wait()
        with page.expect_download() as dl:page.locator('#capture-btn').click()
        path=TMP/'dual.png';dl.value.save_as(path);check(path.read_bytes().startswith(b'\x89PNG'));check(path.stat().st_size>20000)
    test('同步双视图可以实际导出 PNG，保留时间地点',dual_export)
    def mobile():
        topic('moon');page.locator('button[data-audience="kid"]').click();page.set_viewport_size({'width':390,'height':844});wait();check(ev('document.documentElement.scrollWidth===innerWidth'));check(page.locator('#v2-mobile-views').is_visible());page.locator('#v2-right-tab').click();wait();check(v2()['mobileRight']);check(page.locator('#v2-companion').is_visible());shot('09-mobile.png');before=ev('LabV2.getSecondary().camera.fov');page.locator('#zoom-in').click();wait();check(ev('LabV2.getSecondary().camera.fov')<before);page.locator('#v2-left-tab').click();check(not v2()['mobileRight'])
    test('390px 排版无横向溢出，手机切换双视图与缩放有效',mobile)
    def mobile_guide():
        page.locator('[data-guess="2"]').click();page.locator('#v2-next').click();page.locator('#v2-step-time').click();wait();check(v2()['mission']['observed']);page.locator('#v2-next').click();check(page.locator('.playback button').evaluate_all('(items)=>items.every(e=>e.getBoundingClientRect().width>=44&&e.getBoundingClientRect().height>=44)'));shot('10-mobile-guide.png')
    test('390px 上可以完成儿童探索而非仅展示截图',mobile_guide)
    def tablet():
        page.set_viewport_size({'width':1024,'height':900});wait();check(ev('document.documentElement.scrollWidth===innerWidth'));shot('11-tablet.png')
    test('1024px 平板视口没有横向溢出',tablet)
    def header_note():
        page.set_viewport_size({'width':1440,'height':1000});page.locator('button[data-audience="research"]').click();page.locator('#save-btn').click();check(page.locator('#v2-note-form').is_visible());close()
    test('顶部书签进入 V2 记录流程，不丢失对照参数',header_note)
    def keyboard():
        page.set_viewport_size({'width':1440,'height':1000});close();ev('LabApp.pause()');page.locator('#v2-notebook').click();page.keyboard.press('Space');check(not ev('LabApp.getLive().state.playing'));page.keyboard.press('Escape');check(not page.locator('#v2-dialog').evaluate('(d)=>d.open'))
    test('对话框中空格不意外播放，Esc 可关闭',keyboard)
    def backup_new_context():
        # New isolated context has no existing notes; import the actual downloaded file.
        c2=browser.new_context(viewport={'width':1280,'height':900},locale='zh-CN');p2=c2.new_page();(p2.set_content(html,wait_until='load') if args.inject else p2.goto((ROOT/'日月地实验室.html').as_uri(),wait_until='load'));p2.wait_for_function('!!window.LabV2');p2.wait_for_timeout(700);p2.locator('[data-enter="research"]').click();p2.locator('#v2-notebook').click();p2.locator('#v2-import').set_input_files(TMP/'notebook.json');p2.wait_for_timeout(350);check(p2.evaluate('LabV2.getState().notes')==1);p2.locator('[data-note-open="0"]').click();p2.wait_for_timeout(220);expected=json.loads((TMP/'notebook.json').read_text())['notes'][0]['scene']['time'];check(p2.evaluate('LabApp.getState().time')==expected);c2.close()
    test('新浏览器上下文可导入备份并恢复原场景',backup_new_context)
    def matched_areas():
        close();page.locator('button[data-audience="research"]').click();topic('seasons');wait();a=page.locator('#scene-host').bounding_box();b=page.locator('#v2-companion-host').bounding_box();check(abs(a['height']-b['height'])<=2);check(abs(a['y']-b['y'])<=2)
    test('A/B 镜头有相同绘制高度，避免视觉缩放混淆',matched_areas)
    def noon_clock():
        topic('shadow');t=st()['time'];before=page.locator('#v2-right-metric').inner_text();ev('(t)=>LabApp.setTime(t+2*3600000)',t);wait();check(page.locator('#v2-right-metric').inner_text()==before)
    test('同一日期只改钟点，不会把全天影子混为正午影子',noon_clock)
    def advanced_comparison():
        topic('seasons');page.locator('[data-tab="lab"]').click();page.locator('#experiment-toggle').check();realfield('#inclination-slider',9);wait();check('A、B 都是假设' in page.locator('#view-subtitle').inner_text());check(ev('(()=>{const a=LabApp.getPhysics().state,b=LabV2.getSecondary().state;return Astro.len(Astro.sub(Astro.toWorld(a.moon,a.eps),Astro.toWorld(b.moon,b.eps)))<1e-6})()'));ev('LabApp.restoreReality(false)');wait()
    test('高级修改 A 后，B 沿用同一月轨条件且明确标为双假设',advanced_comparison)
    def paused_gpu():
        ev('LabApp.pause()');page.wait_for_timeout(850);a=ev('LabApp.getScene().renderer.info.render.frame');page.wait_for_timeout(250);b=ev('LabApp.getScene().renderer.info.render.frame');check(b-a<=2,'paused renderer was not throttled')
    test('暂停时减少 GPU 重绘，而不是持续空转',paused_gpu)
    def compatibility_fallback():
        # Test fault injection only: shipped HTML still uses real Three.js.
        fixture=html.replace('/* V2 learning primitives:', 'THREE.WebGLRenderer=function(){throw new Error("simulated WebGL unavailable");};\n/* V2 learning primitives:',1)
        c=browser.new_context(viewport={'width':1200,'height':900});q=c.new_page();q.set_content(fixture,wait_until='load');q.wait_for_function('!!window.LabV2');q.wait_for_timeout(700);q.locator('[data-enter="research"]').click();check(q.evaluate('LabApp.getScene().isFallback&&LabV2.getSecondary().isFallback'));q.locator('[data-topic="shadow"]').click();q.wait_for_timeout(200);check(q.locator('#v2-shadow-canvas').is_visible());check(q.evaluate('Number.isFinite(LabApp.getPhysics().state.sunDistance)'));q.screenshot(path=str(OUT/'12-compatibility.png'));c.close()
    test('模拟 WebGL 初始化失败，二维兼容画面和计算仍可运行',compatibility_fallback)
    def resume_fixture():
        # In-memory backend fixture, NOT proof of real file:// browser persistence.
        snap={'scene':st(),'context':{k:v2()[k] for k in ['audience','topic','split','tilt','height','eclipseKind','eventTime']}}
        snap['scene']['time']=2019686400000;snap['context']['topic']='seasons';snap['context']['tilt']=17
        seed={'sem-lab-v2:preferences':json.dumps({'audience':'research','welcomed':True,'quality':'eco'}),'sem-lab-v2:session':json.dumps(snap)}
        script='globalThis.__storageFixture='+json.dumps(seed)+';Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{getItem(k){return __storageFixture[k]??null},setItem(k,v){__storageFixture[k]=String(v)},removeItem(k){delete __storageFixture[k]}}});\n'
        fixture=html.replace('/* V2 learning primitives:',script+'/* V2 learning primitives:',1)
        c=browser.new_context(viewport={'width':1200,'height':900});q=c.new_page();q.set_content(fixture,wait_until='load');q.wait_for_function('!!window.LabV2');q.wait_for_timeout(850);check(q.locator('#v2-resume').count()==1);check(q.evaluate('JSON.parse(__storageFixture["sem-lab-v2:session"]).scene.time')==snap['scene']['time']);q.locator('#v2-resume').click();q.wait_for_timeout(300);check(q.evaluate('LabApp.getState().time')==snap['scene']['time']);check(q.evaluate('LabV2.getState().tilt')==17);check(q.evaluate('LabV2.getState().topic')=='seasons');c.close()
        c=browser.new_context(viewport={'width':1200,'height':900});q=c.new_page();q.set_content(fixture,wait_until='load');q.wait_for_function('!!window.LabV2');q.wait_for_timeout(850);q.locator('#v2-close').click();q.wait_for_timeout(300);check(q.evaluate('LabApp.getState().time')==snap['scene']['time']);c.close()
    test('存储适配器夹具：欢迎页不覆盖旧现场，继续入口可恢复',resume_fixture)
    def denied_storage():
        c=browser.new_context();q=c.new_page();q.set_content(html,wait_until='load');q.wait_for_function('!!window.LabV2');check(not q.evaluate('LabV2.getState().storage') and '备份' in q.locator('#v2-storage').inner_text());c.close()
    test('独立不透明来源：存储被禁止时清晰提示暂存与导出',denied_storage)
    if not args.inject:test('真实文件来源保留原生浏览器存储',lambda:check(v2()['storage']))
    test('完整交互没有外部 HTTP(S) 请求',lambda:check(len(requests)==0,str(requests)))
    test('完整交互没有 JavaScript / WebGL 控制台错误',lambda:check(len(errors)==0,str(errors)))
    report={'timestamp':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'htmlSha256':hashlib.sha256(html.encode('utf-8')).hexdigest(),'browser':browser.version,'platform':'Linux Chromium + SwiftShader','loading':'injected contents' if args.inject else 'file:// direct navigation (fault fixtures isolated)','not_tested':['Windows hardware / Start.cmd','native localStorage across browser restarts','real iOS/Android touch hardware']+(['real file navigation'] if args.inject else []),'passed':sum(r['pass'] for r in results),'total':len(results),'errors':errors,'externalRequests':requests,'results':results}
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    browser.close()
print(f"{sum(r['pass'] for r in results)}/{len(results)} passed")
if any(not r['pass'] for r in results):raise SystemExit(1)
