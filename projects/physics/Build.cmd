@echo off
cd /d "%~dp0"
node tools\build.cjs
if errorlevel 1 (pause & exit /b 1)
node --test tests\physics.test.cjs tests\server.test.cjs
pause
