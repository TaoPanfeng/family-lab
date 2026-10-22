#!/usr/bin/env python3
"""生成只含可发布内容与对应源码的静态站；不包含 Git、凭据或依赖目录。"""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
TOP_FILES = ['index.html','source.html','catalog.json','README.md','AGENTS.md','LICENSE','THIRD_PARTY_NOTICES.md','package.json','.nojekyll']
EXCLUDE = shutil.ignore_patterns('.git','.ssh','.env','.env.*','*.pem','*.key','*.p12','*.pfx','node_modules','__pycache__','.DS_Store','Thumbs.db','tmp','artifacts','test-output','*.log')
for name in TOP_FILES:
    shutil.copy2(ROOT / name, OUT / name)
for name in ['projects','portal','tools','tests','docs']:
    shutil.copytree(ROOT / name, OUT / name, ignore=EXCLUDE)
print(f'Static site staged in {OUT}; this does NOT publish it.')
