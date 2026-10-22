@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Node.js 18+ is needed only for this optional local server. & pause & exit /b 1)
node tools\serve.cjs
pause
