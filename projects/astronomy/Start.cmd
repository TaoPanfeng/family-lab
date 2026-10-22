@echo off
setlocal
cd /d "%~dp0"
for %%F in ("%~dp0*.html") do (
  start "" "%%~fF"
  exit /b 0
)
echo App HTML not found. Please extract the entire ZIP first.
pause
