@echo off
echo Module Fixer
cd %~dp0
call npm init -y
call npm install node-fetch@2 express body-parser noblox.js@latest readline fs path url
call npm install body-parser@^1.19.0
call npm install express@^4.17.1
call npm install noblox.js@^4.8.6
call npm install node-fetch@^2.6.1
call npm install regedit@^4.0.0
call npm install colorama
call npm audit fix
call npm audit fix --force
echo.
echo Done Fixing! -- NPS
pause 