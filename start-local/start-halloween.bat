@echo off
setlocal

rem This file lives in start-local\ but the SITE lives one level up, where
rem index.html is. "%~dp0.." is this script's folder plus "..".
cd /d "%~dp0.."

set "HALLOWEEN_PORT=8091"
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$udp = [System.Net.Sockets.UdpClient]::new(); try { $udp.Connect('8.8.8.8', 65530); $udp.Client.LocalEndPoint.Address.IPAddressToString } catch { 'YOUR-COMPUTER-IP' } finally { $udp.Dispose() }"`) do set "HALLOWEEN_IP=%%I"

echo.
echo  Halloween 2026 - local test server
echo  ----------------------------------
echo  Computer: http://localhost:%HALLOWEEN_PORT%/
echo  iPhone:   http://%HALLOWEEN_IP%:%HALLOWEEN_PORT%/
echo.
echo  Your browser will open automatically in a moment.
echo  Keep this window open while testing; close it to stop the server.
echo  For iPhone testing, both devices must be on the same Wi-Fi network.
echo  If Windows asks, allow access on Private networks.
echo.

rem Open the browser a couple of seconds from now, after the server is up.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:%HALLOWEEN_PORT%/"

where py >nul 2>nul
if %errorlevel% equ 0 (
  py -3 "%~dp0no-cache-server.py" --port %HALLOWEEN_PORT% --bind 0.0.0.0
  goto :end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
  python "%~dp0no-cache-server.py" --port %HALLOWEEN_PORT% --bind 0.0.0.0
  goto :end
)

echo Python was not found. Install Python to run the local test server.
pause

:end
endlocal
