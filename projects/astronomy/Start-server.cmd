@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 18+ is needed only for optional server mode.
  echo For normal use, run Start.cmd or open the HTML directly.
  pause
  exit /b 1
)
echo Open the local URL printed below in Chrome or Edge.
echo Close this window or press Ctrl+C to stop.
node tools\serve.cjs
pause
