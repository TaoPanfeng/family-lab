#!/usr/bin/env python3
"""浏览器回归。默认真实 file://；--inject 仅验证内容与交互，不冒充本地导航。"""
from pathlib import Path
import argparse, base64, json, re, shutil, time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--inject',action='store_true')
parser.add_argument('--browser',default=None)
parser.add_argument('--out',default=str(ROOT/'.qa/browser'))
args=parser.parse_args()
OUT=Path(args.out);OUT.mkdir(parents=True,exist_ok=True)
report={'loading':'HTML injection (not file navigation)' if args.inject else 'file:// direct navigation','checks':[],'pageErrors':[],'runtimeNetworkRequests':[],'screenshots':[],'layouts':[]}

def check(name, condition, detail=None):
    entry={'name':name,'passed':bool(condition)}
    if detail is not None:entry['detail']=detail
    report['checks'].append(entry)
    print(('PASS ' if condition else 'FAIL ')+name,flush=True)
    if not condition:raise AssertionError(name)

def load_html(entry):
    text=entry.read_text(encoding='utf-8')
    # History has multiple local scripts. Only the QA copy is inlined; delivered files stay intact.
    scripts=[]
    def script(match):
        code=(entry.parent/match.group(1)).read_text(encoding='utf-8')
        scripts.append('<script>'+re.sub(r'</script',r'<\\/script',code,flags=re.I)+'</script>')
        return ''
    text=re.sub(r'<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*</script>',script,text,flags=re.I)
    def style(match):
        css=(entry.parent/match.group(1)).read_text(encoding='utf-8')
        return '<style>'+css+'</style>'
    text=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',style,text,flags=re.I)
    def favicon(match):
        file=entry.parent/match.group(1)
        if not file.is_file():return match.group(0)
        return 'href="data:image/svg+xml;base64,'+base64.b64encode(file.read_bytes()).decode()+'"'
    text=re.sub(r'href="(assets/favicon\.svg)"',favicon,text)
    if scripts:text=text.replace('</body>','\n'.join(scripts)+'</body>')
    return text

def attach(page,slug):
    page.on('pageerror',lambda err:report['pageErrors'].append({'project':slug,'error':str(err)}))
    page.on('request',lambda req:report['runtimeNetworkRequests'].append({'project':slug,'url':req.url}) if req.url.startswith(('http://','https://')) else None)

def open_page(context,slug,entry):
    page=context.new_page();page.set_default_timeout(6000);attach(page,slug)
    if args.inject:page.set_content(load_html(ROOT/entry),wait_until='load',timeout=30000)
    else:page.goto((ROOT/entry).as_uri(),wait_until='load',timeout=30000)
    return page

def shot(page,name):
    page.screenshot(path=str(OUT/name),full_page=True)
    report['screenshots'].append(name)

def layout(page,slug):
    value=page.evaluate('({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})')
    report['layouts'].append({'project':slug,**value})

try:
  with sync_playwright() as p:
    options={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']}
    executable=args.browser or shutil.which('chromium') or shutil.which('google-chrome')
    if executable:options['executable_path']=executable
    browser=p.chromium.launch(**options)
    report['browser']=browser.version
    context=browser.new_context(viewport={'width':1440,'height':1040},locale='zh-CN',timezone_id='Asia/Shanghai',accept_downloads=True)
    page=open_page(context,'home','index.html')
    check('首页恰好五个项目入口',page.locator('[data-project]').count()==5)
    for item in json.loads((ROOT/'catalog.json').read_text()):
        link=page.locator(f'[data-project="{item["id"]}"]')
        check('首页入口存在且指向原文件：'+item['name'],link.get_attribute('href')==item['entry'] and (ROOT/item['entry']).is_file())
    for width in [1440,768,390]:
        page.set_viewport_size({'width':width,'height':1040});page.wait_for_timeout(100)
        check(f'首页 {width}px 无横向溢出',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        if width in [1440,390]:shot(page,f'home-{width}.png')
    page.locator('[data-project="astronomy"]').focus()
    check('键盘可以聚焦项目入口',page.evaluate('document.activeElement.dataset.project==="astronomy"'))
    page.locator('details.notes summary').click()
    check('首页使用说明可以展开',page.locator('details.notes').get_attribute('open') is not None)
    page.close()
    for item in json.loads((ROOT/'catalog.json').read_text()):
      slug=item['id'];page=open_page(context,slug,item['entry'])
      try:
        if slug=='astronomy':
            page.wait_for_function('!!window.LabV2')
            page.locator('[data-enter="research"]').wait_for(state='visible',timeout=12000)
            check('日月地三个学习入口',page.locator('[data-enter]').count()==3)
            page.locator('[data-enter="research"]').click();page.wait_for_timeout(150)
            for topic in ['moon','seasons','shadow','eclipse']:
                page.locator(f'[data-topic="{topic}"]').click();page.wait_for_timeout(100)
                check('日月地主题切换：'+topic,page.evaluate('LabV2.getState().topic')==topic)
            page.locator('[data-topic="moon"]').click()
            report['astronomyRenderer']=page.evaluate('LabApp.getScene().isFallback ? "2D fallback" : "WebGL"')
        elif slug=='physics':
            page.wait_for_function('!!window.GuanWu')
            labs=page.evaluate('LabCatalog.labs.map(x=>x.id)')
            check('物理包含16个实验',len(labs)==16)
            for ident in labs:
                page.locator(f'[data-lab="{ident}"]').first.click()
                check('物理实验导航：'+ident,page.evaluate('GuanWu.getState().lab')==ident)
            page.locator('[data-lab="jet"]').first.click()
        elif slug=='chemistry':
            page.wait_for_function('!!window.ChemAppTesting')
            routes=page.evaluate('ChemAppTesting.routes.map(x=>x[0])')
            check('化学包含12个页面路由',len(routes)==12)
            for route in routes:
                page.locator(f'.nav-item[data-go="{route}"]').click();page.wait_for_timeout(80)
                check('化学页面导航：'+route,len(page.locator('#main-content').inner_text())>20)
            page.locator('.nav-item[data-go="home"]').click()
        elif slug=='history':
            page.wait_for_function('document.querySelectorAll("#navigation button").length>0')
            views=page.locator('#navigation [data-view]').evaluate_all('(xs)=>xs.map(x=>x.dataset.view)')
            for view in views:
                page.locator(f'#navigation [data-view="{view}"]').click()
                check('历史页面导航：'+view,len(page.locator('#main').inner_text())>30)
            page.locator('#navigation [data-view="overview"]').click()
            before=page.locator('#zoom-label').inner_text()
            page.locator('[data-action="timeline-zoom"][data-factor="1.7"]').click()
            check('历史时间轴放大改变刻度',page.locator('#zoom-label').inner_text()!=before)
        elif slug=='posture':
            page.wait_for_function('!!window.PostureLab')
            page.locator('[data-category="all"]').click()
            ids=page.locator('#postureList [data-posture]').evaluate_all('(xs)=>xs.map(x=>x.dataset.posture)')
            check('坐卧包含15个姿势',len(ids)==15)
            for ident in ids:
                page.locator(f'#postureList [data-posture="{ident}"]').click()
                check('坐卧条目切换：'+ident,page.locator('body').inner_text().strip()!='')
        page.wait_for_timeout(150);layout(page,slug);shot(page,slug+'-desktop.png')
      except Exception as exc:
        if not report['checks'] or report['checks'][-1]['passed']:
            report['checks'].append({'name':slug+' browser flow','passed':False,'error':str(exc)})
        print('FAIL',slug,str(exc)[:400],flush=True)
        shot(page,slug+'-failure.png')
      finally:page.close()
    check('无未捕获脚本异常',not report['pageErrors'],report['pageErrors'])
    check('运行过程没有外部 HTTP 请求',not report['runtimeNetworkRequests'],report['runtimeNetworkRequests'])
    context.close();browser.close()
except Exception as exc:
    report['fatal']=str(exc)
finally:
    report['passed']=sum(1 for x in report['checks'] if x['passed'])
    report['failed']=sum(1 for x in report['checks'] if not x['passed'])
    report['status']='passed' if not report.get('fatal') and report['failed']==0 else 'failed'
    (OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'status':report['status'],'passed':report['passed'],'failed':report['failed'],'loading':report['loading']},ensure_ascii=False))
if report['status']!='passed':raise SystemExit(1)
