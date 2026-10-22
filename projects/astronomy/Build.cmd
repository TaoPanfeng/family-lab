@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Building requires Node.js 18+.
  echo Normal use needs no Node.js: just open the included HTML.
  pause
  exit /b 1
)
node tools\build.cjs
if errorlevel 1 goto :failed
node tests\test.cjs
if errorlevel 1 goto :failed
echo Build and science tests complete.
pause
exit /b 0
:failed
echo Build or tests failed. Read the error above.
pause
exit /b 1
