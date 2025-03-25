@echo off
:: ================================
:: CONFIGURABLE VARIABLES
:: ================================

:: Set the directory where your HTML files are located
set "HTML_DIRECTORY=%~dp0" REM Uses the directory where the batch file is located

:: Set the port number for the HTTP server (default is 8000)
set "PORT=8000"

:: ================================
:: SCRIPT LOGIC BEGINS
:: ================================

:: Change the directory to where the HTML files are located
cd /d "%HTML_DIRECTORY%"

:: Check if Python is installed and available in the system path
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed or not found in PATH. Please install Python.
    pause
    exit /b
)

:: Start the Python HTTP server on the specified port in the background
echo Starting Python HTTP server on port %PORT%...
start /b python -m http.server %PORT%

:: Wait for the server to initialize (give it 2 seconds)
timeout /t 2 >nul

:: Open the default browser to the local server's address
echo Opening browser at http://localhost:%PORT%...
start http://localhost:%PORT%

:: Close the Command Prompt window
exit