'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const offline = process.argv.includes('--offline');
const chemistryFiles = fs.readdirSync(path.join(root,'projects/chemistry/tests')).filter(f=>f.endsWith('.test.cjs')).sort().map(f=>'tests/'+f);
const suites = [
  ['英语、编程与音乐教学模型','.', ['--test','tests/workshops-models.test.cjs']],
  ['语文字音、字形与备份边界','.', ['--test','tests/chinese-models.test.cjs']],
  ['教学语义、正式公式、化学守恒与显微光学','.', ['--test','tests/learning-models.test.cjs']],
  ['手机指针生命周期与手势隔离','.', ['--test','tests/mobile-touch.test.cjs']],
  ['数学知识结构、证明与定量模型','.', ['--test','tests/math-models.test.cjs']],
  ['公共首页', '.', ['--test','tests/portal.test.cjs']],
  ['新增四馆模型与资料','.', ['--test','tests/expansion-models.test.cjs']],
  ['可视化整改与光学数值','.', ['--test','tests/refactor-models.test.cjs']],
  ['日月地模型','projects/astronomy',['tests/test.cjs']],
  ['日月地学习与对照','projects/astronomy',['tests/v2-test.cjs']],
  ['物理','projects/physics',['--test','tests/physics.test.cjs','tests/server.test.cjs']],
  ['坐卧','projects/posture',['--test','tests/core.test.cjs','tests/server.test.cjs']],
  ['化学','projects/chemistry',['--test','--test-concurrency=1',...chemistryFiles]],
  ['历史数据','projects/history',['--test','tests/core-data.test.cjs']],
  ['历史文件完整性','projects/history',['tests/verify-package.cjs']]
];
if (!offline) suites.push(['历史 DOM 交互','projects/history',['--test','tests/ui-flow.test.cjs']]);
else console.log('范围说明：--offline 不包含依赖 jsdom 的历史 DOM 测试；浏览器测试另行执行。');
for (const [name,dir,args] of suites) {
  console.log('\n=== '+name+' ===');
  const result=spawnSync(process.execPath,args,{cwd:path.join(root,dir),stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
console.log('\n所选测试通过。浏览器、Windows 启动和线上发布不包含在这个命令内。');
