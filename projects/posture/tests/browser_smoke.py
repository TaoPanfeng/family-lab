#!/usr/bin/env python3
"""可选浏览器回归测试。pip install playwright; playwright install chromium。
默认打开真实 file://。--inject 专用于禁止 file/localhost 导航的测试环境：
以 set_content 载入相同独立 HTML，并用内存替身测试存储逻辑，不等于实机持久化验证。
"""
from __future__ import annotations
import argparse, json, shutil, struct, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PARSER = argparse.ArgumentParser(description=__doc__)
PARSER.add_argument('--inject', action='store_true')
PARSER.add_argument('--browser', default=None, help='Chromium/Chrome executable path')
PARSER.add_argument('--out', default=str(ROOT/'test-output'))
ARGS = PARSER.parse_args()
OUT = Path(ARGS.out); OUT.mkdir(parents=True, exist_ok=True)
HTML = (ROOT/'index.html').read_text(encoding='utf-8')
checks: list[dict] = []
errors: list[str] = []
requests: list[str] = []


def check(name: str, condition: bool, detail=None):
    checks.append({'name':name, 'passed':bool(condition), 'detail':detail})
    if not condition:
        raise AssertionError(name + (': '+str(detail) if detail is not None else ''))


def storage_bootstrap(seed=None):
    # QA-only: never included in the shipped entry or application source.
    return '<script>window.__testStore='+json.dumps(seed or {})+';Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:k=>window.__testStore[k]??null,setItem:(k,v)=>window.__testStore[k]=String(v),removeItem:k=>delete window.__testStore[k],clear:()=>window.__testStore={}}});</script>'


def load(page, seed=None, denied=False):
    if ARGS.inject:
        content=HTML if denied else HTML.replace('<head>', '<head>'+storage_bootstrap(seed), 1)
        page.set_content(content, wait_until='load')
    else:
        page.goto((ROOT/'index.html').as_uri(), wait_until='load')
    page.wait_for_function('!!window.PostureLab')
    page.wait_for_timeout(150)


def state(page):
    return page.evaluate('PostureLab.getState()')


def input_number(page, selector, value):
    page.locator(selector).fill(str(value))
    page.locator(selector).press('Tab')


def choose(page, ident):
    # Header is visible across pages; filters are reset for precise library actions.
    if state(page)['page']!='lab':
        page.locator('.main-nav [data-page="lab"]').click()
    page.locator('#searchInput').fill('')
    page.locator('[data-category="all"]').click()
    if state(page)['favoriteOnly']:
        page.locator('#favoriteFilter').click()
    page.locator('#postureList [data-posture="'+ident+'"]').click()


def save_plan(page, name, note=''):
    page.locator('#savePlanBtn').click()
    page.locator('#planName').fill(name)
    page.locator('#planNote').fill(note)
    page.locator('#saveForm button[type="submit"]').click()
    check('保存方案：'+name, not page.locator('#saveDialog').evaluate('(e)=>e.open') and state(page)['plans'][0]['name']==name)


def import_json(page, payload: str, filename='backup.json'):
    page.locator('#importFile').set_input_files({'name':filename,'mimeType':'application/json','buffer':payload.encode()})
    page.wait_for_timeout(120)

with sync_playwright() as p:
    executable=ARGS.browser or shutil.which('chromium') or shutil.which('google-chrome')
    launch={'headless':True, 'args':['--no-sandbox','--disable-dev-shm-usage']}
    if executable: launch['executable_path']=executable
    browser=p.chromium.launch(**launch)
    context=browser.new_context(viewport={'width':1440,'height':1100}, locale='zh-CN', accept_downloads=True)
    page=context.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:requests.append(r.url))
    start=time.time()
    try:
        load(page)
        check('独立入口初始化', page.title().startswith('身有度') and state(page)['postureId']=='office')
        check('全部 15 个条目可发现',page.locator('#postureList [data-posture]').count()==15)
        poses=page.evaluate('PostureData.postures.map(p=>({id:p.id,steps:p.steps.length,category:p.category}))')
        for cat in ['walk','stand','sit','lie']:
            page.locator('[data-category="'+cat+'"]').click()
            check('分类筛选：'+cat,page.locator('#postureList [data-posture]').count()==len([v for v in poses if v['category']==cat]))
        page.locator('[data-category="all"]').click()
        page.locator('#searchInput').fill('唐僧睡')
        check('唐僧睡别名搜索',page.locator('#postureList [data-posture="auspicious"]').count()==1)
        page.locator('#searchInput').fill('正坐')
        check('正坐含椅坐及跪坐',page.locator('#postureList [data-posture]').count()==2)
        page.locator('#searchInput').fill('不存在的姿势000')
        check('搜索无结果与恢复入口',page.locator('[data-clear-search]').count()==1)
        page.locator('[data-clear-search]').click()
        page.locator('#listView').click()
        check('紧凑列表切换',page.locator('#postureList').evaluate('(e)=>e.classList.contains("compact")'))
        page.locator('#cardView').click()
        page.locator('#favoriteBtn').click();page.locator('#favoriteFilter').click()
        check('收藏筛选',page.locator('#postureList [data-posture]').count()==1 and state(page)['favorites']==['office'])
        page.locator('#favoriteFilter').click()
        total_steps=0
        for pose in poses:
            choose(page,pose['id'])
            for i in range(pose['steps']):
                page.locator('[data-step="'+str(i)+'"]').click()
                page.wait_for_timeout(22)
                scene=page.evaluate('PostureLab.getSceneInfo()')
                check(f'三维姿势与步骤：{pose["id"]}/{i+1}', scene['finite'] and scene['vertices']>1000 and state(page)['step']==i)
                total_steps+=1
            page.locator('[data-detail="tradeoffs"]').click()
            check('优劣自查：'+pose['id'],page.locator('[data-check]').count()>=3)
            page.locator('[data-check="0"]').check()
            page.locator('[data-detail="sources"]').click()
            check('来源可见：'+pose['id'],page.locator('#detailContent a[href^="https://"]').count()>=1)
        choose(page,'office')
        input_number(page,'#heightNumber',180)
        s=state(page);check('180cm 自动适配',s['profile']['height']==180 and s['configs']['office']['seat']==44)
        page.locator('.calibration summary').click()
        page.locator('#calibrated').check()
        input_number(page,'#popliteal',46);input_number(page,'#eyeSeat',80);input_number(page,'#elbowSeat',26)
        s=state(page);check('实测优先、联动家具',s['configs']['office']['seat']==45 and s['configs']['office']['desk']==71 and s['configs']['office']['screen']==123)
        page.locator('#autoFitToggle').uncheck();input_number(page,'#heightNumber',190)
        check('关闭联动保留家具',state(page)['configs']['office']['seat']==45)
        input_number(page,'#param-seat',999)
        check('椅高越界钳制',state(page)['configs']['office']['seat']==65)
        input_number(page,'#param-seat','')
        check('空输入保留已有参数',state(page)['configs']['office']['seat']==65 and page.locator('#param-seat').input_value()=='65')
        input_number(page,'#heightNumber',120)
        check('身高下限保护',state(page)['profile']['height']==140)
        input_number(page,'#heightNumber',170);page.locator('#calibrated').uncheck();page.locator('#autoFitToggle').check();page.locator('#autoFitBtn').click()
        page.locator('.calibration summary').click()
        input_number(page,'#param-desk',95)
        check('失配提示随参数更新',page.locator('#diagnostics .warn').count()>0)
        page.locator('#autoFitBtn').click()
        before=page.evaluate('PostureLab.getSceneInfo().renderCount')
        for name in ['front','side','top','home']:
            page.locator('[data-camera="'+name+'"]').click();page.wait_for_timeout(40)
        check('视角切换真实重绘',page.evaluate('PostureLab.getSceneInfo().renderCount')>before)
        page.locator('#measureToggle').uncheck();check('尺寸标注关闭',page.locator('#sceneLabels').inner_text()=='')
        page.locator('#measureToggle').check();page.locator('#sceneCanvas').focus();page.keyboard.press('ArrowLeft');page.keyboard.press('Home')
        # Actual canvas click uses the visible projected head target from renderer metadata labels as a stable approximate point.
        box=page.locator('#sceneCanvas').bounding_box()
        page.mouse.move(box['x']+box['width']*.5,box['y']+box['height']*.5)
        page.mouse.down();page.mouse.move(box['x']+box['width']*.6,box['y']+box['height']*.5,steps=4);page.mouse.up()
        page.locator('[data-camera="home"]').click()
        page.screenshot(path=str(OUT/'desktop.png'),full_page=True)
        save_plan(page,'办公位 · 初次试调','<img src=x onerror="window.__xss=1"> 这是普通文本，不执行。')
        choose(page,'auspicious');page.locator('[data-firmness="1"]').click();page.wait_for_timeout(60)
        soft=page.locator('#sceneCanvas').screenshot()
        page.locator('[data-firmness="5"]').click();page.wait_for_timeout(60)
        hard=page.locator('#sceneCanvas').screenshot()
        check('床垫档位改变实际画面',soft!=hard and state(page)['configs']['auspicious']['firmness']==5)
        input_number(page,'#param-pillow',10.5);page.locator('#kneePillow').uncheck()
        check('枕高与膝间支撑可调整',state(page)['configs']['auspicious']['pillow']==10.5 and not state(page)['configs']['auspicious']['kneePillow'])
        page.locator('[data-step="3"]').click()
        check('左右手标注', '左手 L' in page.locator('#sceneLabels').inner_text() and '右手 R' in page.locator('#sceneLabels').inner_text())
        page.screenshot(path=str(OUT/'sleep.png'),full_page=True)
        save_plan(page,'侧卧 · 支撑对照','示例记录，不代表适合本人。')
        page.locator('.main-nav [data-page="plans"]').click()
        check('方案文本不执行 HTML',page.locator('#plansList img').count()==0 and page.evaluate('window.__xss===undefined'))
        check('双方案展示',page.locator('.plan-card').count()==2)
        page.locator('[data-compare-id]').nth(0).check();page.locator('[data-compare-id]').nth(1).check()
        page.locator('#compareBtn').click();page.wait_for_timeout(180)
        check('并排三维对照及差异行',page.locator('#compareDialog').evaluate('(e)=>e.open') and page.locator('#compareDialog canvas').count()==2 and page.locator('.comparison-table .different').count()>0)
        page.screenshot(path=str(OUT/'compare.png'),full_page=True)
        page.locator('[data-close="compareDialog"]').click();page.wait_for_timeout(60)
        check('对照关闭后释放界面',page.locator('#compareContent canvas').count()==0)
        with page.expect_download() as dl:
            page.locator('#exportBtn').click()
        exported=dl.value;exported.save_as(str(OUT/'backup.json'))
        backup=(OUT/'backup.json').read_text(encoding='utf-8');parsed=json.loads(backup)
        check('JSON 实际下载内容完整',len(parsed['plans'])==2 and parsed['favorites']==['office'])
        import_json(page,backup);check('重复导入跳过',len(state(page)['plans'])==2)
        damaged=json.loads(backup);damaged['plans'][0]['params']['pillow']=1000
        import_json(page,json.dumps(damaged));check('非法备份不改变现有方案',len(state(page)['plans'])==2 and '数值无效' in page.locator('#toast').inner_text())
        import_json(page,'{invalid');check('损坏 JSON 错误提示',len(state(page)['plans'])==2 and 'JSON' in page.locator('#toast').inner_text())
        added=json.loads(backup);added['plans']=added['plans'][:1];added['plans'][0]['name']='导入的观察样例'
        import_json(page,json.dumps(added));check('有效新方案导入',len(state(page)['plans'])==3 and state(page)['plans'][0]['name']=='导入的观察样例')
        page.once('dialog',lambda d:d.accept());page.locator('[data-delete-plan]').first.click()
        check('确认后仅删除指定方案',len(state(page)['plans'])==2)
        page.locator('[data-apply-plan]').last.click()
        check('应用方案恢复身高姿势和家具',state(page)['postureId']=='office' and state(page)['profile']['height']==170 and state(page)['configs']['office']['seat']==41.5)
        with page.expect_download() as dl:
            page.locator('#captureBtn').click()
        dl.value.save_as(str(OUT/'exported-view.png'))
        png=(OUT/'exported-view.png').read_bytes();w,h=struct.unpack('>II',png[16:24])
        check('PNG 实际导出可解码',png[:8]==b'\x89PNG\r\n\x1a\n' and w>=500 and h>=300, {'width':w,'height':h})
        page.evaluate('() => {window.__printCalls=0;window.print=()=>window.__printCalls++;}')
        page.locator('#printBtn').click()
        check('打印卡生成参数步骤来源',page.evaluate('window.__printCalls')==1 and page.locator('#printSheet li').count()==6 and page.locator('#printSheet a').count()>0, {'calls':page.evaluate('window.__printCalls'),'steps':page.locator('#printSheet li').count(),'sources':page.locator('#printSheet a').count()})
        page.locator('#breathMode').select_option('paced');page.locator('#breathStart').click();page.wait_for_timeout(160)
        check('自愿呼吸节拍启停',page.locator('#breathStart').inner_text()=='停止节拍' and page.locator('#breathPhase').inner_text() in ['轻吸','缓呼'])
        page.locator('#breathStart').click();check('恢复自然呼吸',page.locator('#breathPhase').inner_text()=='自然')
        page.locator('#breathMode').select_option('natural')
        input_number(page,'#timerMinutes',1);page.locator('#timerStart').click()
        check('计时提醒启动',page.locator('#timerMinutes').is_disabled())
        page.evaluate('window.__realNow=Date.now;Date.now=()=>window.__realNow()+61000');page.wait_for_timeout(160)
        check('到期提醒正常触发',not page.locator('#timerMinutes').is_disabled() and '到时间' in page.locator('#timerStatus').inner_text())
        page.evaluate('Date.now=window.__realNow')
        choose(page,'walk');page.locator('#walkPlay').click();page.wait_for_timeout(400)
        a=page.evaluate('PostureLab.getSceneInfo()');page.wait_for_timeout(250);b=page.evaluate('PostureLab.getSceneInfo()')
        check('步态持续动画可暂停',b['playing'] and b['renderCount']>a['renderCount'] and b['finite'])
        page.locator('#walkPlay').click();check('步态停止',not page.evaluate('PostureLab.getSceneInfo().playing'))
        page.locator('.main-nav [data-page="guide"]').click()
        check('安全边界与 13 条资料展示',page.locator('#allSources .source-card').count()==13 and '不是医学公式' in page.locator('#guidePage').inner_text())
        choose(page,'office')
        for width in [1024,768,390,320]:
            page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(120)
            sizes=page.evaluate('({inner:innerWidth, scroll:document.documentElement.scrollWidth})')
            check(f'{width}px 响应式无横向溢出',sizes['scroll']<=sizes['inner']+1,sizes)
            if width==390: page.screenshot(path=str(OUT/'mobile.png'),full_page=True)
        if ARGS.inject:
            page.wait_for_timeout(300);seed=page.evaluate('window.__testStore')
            restored=context.new_page();restored.on('pageerror',lambda e:errors.append(str(e)));load(restored,seed)
            check('新页面恢复已存方案逻辑（存储替身）',len(state(restored)['plans'])==2 and state(restored)['favorites']==['office'])
            restored.close()
            denied=context.new_page();denied.on('pageerror',lambda e:errors.append(str(e)));load(denied,denied=True)
            check('原生存储被拒时保留功能与提示',denied.locator('#storageWarning').is_visible() and len(state(denied)['plans'])==0)
            save_plan(denied,'无法持久化时的临时记录')
            check('存储失败不谎报成功', '本次会话' in denied.locator('#toast').inner_text())
            denied.close()
        check('运行期间无外部网络依赖',not [r for r in requests if r.startswith(('http://','https://'))],requests)
        check('无未处理 JavaScript 错误',len(errors)==0,errors)
        report={'mode':'injected-html+storage-mock' if ARGS.inject else 'file-url','browser':browser.version,'renderer':page.evaluate('PostureLab.getSceneInfo()'),'durationSeconds':round(time.time()-start,2),'poseCount':len(poses),'stepCount':total_steps,'passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'pageErrors':errors,'requests':requests,'limitations':['注入模式不是 Windows 实际 file:// 双击测试。','内存替身只验证存储读写恢复逻辑，不验证原生磁盘持久化。','实际系统打印弹窗替换为计数器；未测试打印设备。'] if ARGS.inject else []}
        (OUT/'browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps({k:report[k] for k in ['mode','browser','durationSeconds','poseCount','stepCount','passed','failed','renderer']},ensure_ascii=False,indent=2))
    except Exception:
        (OUT/'failure.json').write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf-8')
        try:page.screenshot(path=str(OUT/'failure.png'),full_page=True)
        except Exception:pass
        raise
    finally:
        browser.close()
