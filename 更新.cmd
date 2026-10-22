@echo off
setlocal
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 (
 echo Git is not installed. No changes were made.
 pause
 exit /b 1
)
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
 echo This is not a Git clone. A ZIP folder cannot use git pull.
 pause
 exit /b 1
)
for %%I in ("%~dp0.") do set "HERE=%%~fI"
for /f "delims=" %%I in ('git rev-parse --show-toplevel 2^>nul') do set "TOP=%%I"
set "TOP=%TOP:/=\%"
if /I not "%TOP%"=="%HERE%" (
 echo The Git root is not this project directory. No update performed.
 pause
 exit /b 1
)
git status --porcelain >nul 2>nul
if errorlevel 1 exit /b 1
for /f "delims=" %%L in ('git status --porcelain') do (
 echo Uncommitted changes detected. Save or commit them before updating.
 pause
 exit /b 1
)
git pull --ff-only
if errorlevel 1 (
 echo Update failed. No reset or forced merge was performed.
 pause
 exit /b 1
)
start "" "%~dp0index.html"
endlocal
