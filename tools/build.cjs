'use strict';
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const [cwd, script] of [
  ['projects/astronomy','tools/build.cjs'],
  ['projects/physics','tools/build.cjs'],
  ['projects/posture','build.cjs'],
  ['projects/chemistry','build-offline.cjs'],
  ['.','tools/build-home.cjs']
]) {
  const result = spawnSync(process.execPath, [script], {cwd:path.join(root,cwd),stdio:'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
// 历史是原生静态多文件入口，不需要额外构建。
