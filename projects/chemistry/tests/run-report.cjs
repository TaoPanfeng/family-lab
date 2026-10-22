'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {run}=require('node:test');
const {tap}=require('node:test/reporters');
const root=path.resolve(__dirname,'..');
const files=fs.readdirSync(__dirname).filter(x=>x.endsWith('.test.cjs')).sort().map(x=>'tests/'+x);
async function main(){
const [major,minor]=process.versions.node.split('.').map(Number);
if(major<22||(major===22&&minor<17))throw Error('测试报告需要 Node.js 22.17 或以上；网页本身不需要 Node.js。');
require('../build-offline.cjs');
require('./check-files.cjs');
fs.mkdirSync(path.join(root,'docs'),{recursive:true});
// Use the supported in-process runner. DOM cases create their own VM and clock;
// no subprocess privilege or network access is needed to reproduce the report.
const results=files.map(file=>({file,status:0,tests:0,pass:0,fail:0,skipped:0}));
const perFile=new Map(results.map(r=>[path.resolve(root,r.file),r]));
let executionSummary=null;
const stream=run({files:files.map(file=>path.resolve(root,file)),isolation:'none',concurrency:1});
function record(data,ok){
  if(data.details?.type==='suite')return;
  const result=perFile.get(data.file);
  if(!result)return;
  result.tests++;
  if(data.skip||data.todo)result.skipped++;
  else if(ok)result.pass++;
  else{result.fail++;result.status=1;}
}
stream.on('test:pass',data=>record(data,true));
stream.on('test:fail',data=>record(data,false));
stream.on('test:summary',data=>{executionSummary=data;});
let log='';
for await(const chunk of stream.compose(tap))log+=chunk;
fs.writeFileSync(path.join(root,'docs','test-results.tap'),log);
const sum=k=>results.reduce((n,r)=>n+r[k],0);
const passed=executionSummary?.success===true&&results.every(r=>r.status===0&&r.tests>0)&&sum('tests')===executionSummary.counts.tests&&sum('fail')===0&&sum('skipped')===0;
const summary={timestamp:new Date().toISOString(),node:process.version,suites:results.map(({log,...r})=>r),tests:sum('tests'),pass:sum('pass'),fail:sum('fail'),skipped:sum('skipped'),status:passed?'passed':'failed',verification:{models:passed,domEvents:passed&&files.some(x=>x.includes('integration')),realBrowser:false},browserLimit:'受管理预览服务因 bwrap 无法挂载 proc 而未能启动；DOM 模拟测试不验证浏览器布局、触屏手势、GPU 绘图或下载对话框。'};
fs.writeFileSync(path.join(root,'docs','test-summary.json'),JSON.stringify(summary,null,2)+'\n');
const labels={
  'app.test.cjs':'首页、双模式、反应计算、配平、披萨、答题、记录与输入处理',
  'core.test.cjs':'化学式解析、原子与核素、反应计量、溶液与守恒',
  'cross-module.test.cjs':'实验室与公共化学引擎的数值一致性',
  'explore.test.cjs':'周期表筛选、原子搭建、衰变、分离、酸碱与生活场景',
  'integration.test.cjs':'全部展区双模式与十二实验完整 DOM 事件流程',
  'lab.test.cjs':'实验状态机、材料与接口、操作顺序、控制和边界',
  'offline.test.cjs':'单文件离线版路由、交互及资源完整性'
};
const report=[
  '# 万物化学 · 测试与验收报告',
  '',
  `生成时间：${summary.timestamp}。运行环境：Node.js ${summary.node}。`,
  '',
  `**自动化结果：${summary.tests} 项测试，${summary.pass} 项通过，${summary.fail} 项失败，${summary.skipped} 项跳过。总体状态：${passed?'通过':'未通过'}。**`,
  '',
  '这里的“项”按 Node.js 测试用例统计；用例内部遍历的元素、反应、模式和参数组合不再重复累加。',
  '',
  '## 分模块结果',
  '',
  '| 测试入口 | 覆盖内容 | 通过 / 总数 |',
  '| --- | --- | --- |',
  ...results.map(r=>`| \`${r.file}\` | ${labels[path.basename(r.file)]||'模块检查'} | ${r.pass} / ${r.tests} |`),
  '',
  '## 本轮验证了什么',
  '',
  '- 化学计算：化学式解析与配平、摩尔质量、限量反应物、剩余物质、理论产物与回收产物、质量守恒、温压换算、核变化与酸碱模型。',
  '- 展区导航：全部 12 个路由在儿童与进阶两种模式下挂载；118 张元素卡在两种模式下逐一打开。',
  '- 实验全流程：12 项实验 × 2 种模式，实际应用脚本处理点选仪器、连接接口、加入材料、预测、分步操作、暂停、加速、结果展示、记录保存、重做和清空。',
  '- 异常流程：缺器材、错误材料与连接、过早操作、非法数值、路由参数异常、页面离开后的动画清理、重复事件和损坏的本机记录。',
  '- 学习闭环：配平反馈、披萨配料的全部滑块组合、18 道题的答错与重试、进度去重、记录转义和 Markdown 导出内容。',
  '- 离线交付：重新生成单 HTML 后检查全部路由和代表性交互；静态入口、脚本加载顺序、全部本地资源与 JavaScript 语法检查通过。',
  '',
  '## 验证方法与边界',
  '',
  '计算和状态机测试直接运行应用函数。交互测试使用真实应用脚本、LinkeDOM 的 HTML 解析、选择器和事件冒泡，以及可重复的模拟时钟。测试环境对存储、动画时钟、选择控件和下载对象作了必要适配。它不包含浏览器渲染引擎。',
  '',
  '**真实浏览器视觉和触屏验收未完成，未计作通过。** 受管理的预览服务因容器无法挂载 proc 而启动失败，浏览器连接也不可用。因此本轮不能确认 CSS 的最终像素布局、各浏览器字体、实体设备拖动手势、下载对话框、屏幕阅读器体验或浏览器性能。已实现响应式布局、点击连接与移动按钮作为操作方式，但这些仍需在真实设备上验收。',
  '',
  '所有科学结论还受模型范围约束：只支持收录的实验；理想反应与定性动画不能替代真实反应条件、动力学、平衡、传热或真实防护设计。白磷是无投料量的封闭概念展示，放射性是数学与粒子教学模型。',
  '',
  '## 本轮修复并回归的具体问题',
  '',
  '- 学习模式按钮的选择器限制在模式开关内，避免与页面模式属性混淆。',
  '- 原子页面异常元素参数回退到有效初始状态，超出电子层教学范围的元素不绘制错误的圆环模型。',
  '- 稳定核素不再被错误导航到无关放射性核素；周期表 d 区说明避免把全部 d 区元素一概称为过渡金属。',
  '- 实验室与公共引擎使用一致的锰原子量；分离实验限制盐水范围，避免初始条件或收集终点超出展示所假设的完全溶解范围。',
  '- 修正投料上限附近的浮点误差：容差内接受的数量归一到合法端点，避免刚添加成功后又被装置检查判为越界。',
  '- 反应计算明确输入纯物质或纯溶质数量，并说明温压只用于干气体体积换算，不重新预测相态。',
  '',
  '## 怎样复测',
  '',
  '需要 Node.js 22.17 或以上；测试依赖已随项目附带，不需要联网安装。测试按顺序在一个进程内执行，DOM 用例分别创建自己的应用 VM 与时钟。',
  '',
  '```bash',
  'node tests/run-report.cjs',
  '```',
  '',
  '该命令先重新生成离线 HTML，再检查资源与脚本，随后执行所有 `.test.cjs` 文件并更新本报告、`test-summary.json` 与 `test-results.tap`。任一测试失败会以非零退出码结束。',
  '',
  '后续真实设备验收建议：桌面 Chrome、Safari/Firefox；手机 Safari、Chrome。逐项查看导航、模式切换、周期表滚动、接口连接、器材移动、动画暂停、笔记导出与窄屏布局，记录实际浏览器和版本。',
  ''
].join('\n');
fs.writeFileSync(path.join(root,'docs','test-report.md'),report);
console.log(JSON.stringify(summary,null,2));
process.exitCode=passed?0:1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
