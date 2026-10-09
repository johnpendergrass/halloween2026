@echo off
setlocal

rem Reuse the project's server; it serves the repository root.
cd /d "%~dp0..\.."
set "CANDY_SWAP_PORT=8097"
set "CANDY_SWAP_PAGE=games/candy-swap/touch-preview.html"

rem Same address detection as start-local/start-halloween.bat.
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$udp = [System.Net.Sockets.UdpClient]::new(); try { $udp.Connect('8.8.8.8', 65530); $udp.Client.LocalEndPoint.Address.IPAddressToString } catch { 'YOUR-COMPUTER-IP' } finally { $udp.Dispose() }"`) do set "CANDY_SWAP_IP=%%I"

echo.
echo  Candy Swap - local touch test server
echo  -----------------------------------
echo  Computer: http://localhost:%CANDY_SWAP_PORT%/%CANDY_SWAP_PAGE%
echo  iPhone:   http://%CANDY_SWAP_IP%:%CANDY_SWAP_PORT%/%CANDY_SWAP_PAGE%
echo.
echo  Your browser will open automatically in a moment.
echo  Keep this window open while testing; close it to stop the server.
echo  Your iPhone must be on the same local network as this computer.
echo  If Windows asks, allow access on Private networks.
echo.

start "" cmd /c "timeout /t 2 >nul & start http://localhost:%CANDY_SWAP_PORT%/%CANDY_SWAP_PAGE%"

where py >nul 2>nul
if %errorlevel% equ 0 (
  py -3 "%~dp0..\..\start-local\no-cache-server.py" --port %CANDY_SWAP_PORT% --bind 0.0.0.0
  goto :end
)

where python >nul 2>nul
if %errorlevel% equ 0 (
  python "%~dp0..\..\start-local\no-cache-server.py" --port %CANDY_SWAP_PORT% --bind 0.0.0.0
  goto :end
)

echo Python was not found. Install Python to run the local test server.
pause

:end
endlocal
