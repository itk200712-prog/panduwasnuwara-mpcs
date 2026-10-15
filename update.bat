@echo off
REM ============================================
REM  එක CLICK එකකින් website එක update කිරීම (Windows)
REM  භාවිතය: update.bat දෙපාර click කරන්න
REM ============================================

cd /d "%~dp0"

echo [1/3] Files එකතු කරමින්...
git add .

set MSG=%~1
if "%MSG%"=="" set MSG=Website update %date% %time%

echo [2/3] Commit කරමින්...
git commit -m "%MSG%"

echo [3/3] GitHub එකට push කරමින්...
git push

echo.
echo ============================================
echo  DONE! Vercel AUTO DEPLOY වෙනවා
echo  විනාඩි 1-2කින් site එක update වේ
echo ============================================
pause
