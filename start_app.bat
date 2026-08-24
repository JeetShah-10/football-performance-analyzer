@echo off
setlocal enabledelayedexpansion
title Eleven - Football Player Style Dashboard Launcher

echo =====================================================================
echo           ELEVEN - FOOTBALL PLAYER STYLE DASHBOARD LAUNCHER
echo =====================================================================
echo.

:: Get workspace root directory
set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo [1/3] Checking prerequisites...

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    pause
    exit /b 1
)

:: Check Node.js / npm
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    pause
    exit /b 1
)

echo [OK] Python and Node.js detected.
echo.

echo [2/3] Starting FastAPI Backend (Port 8000)...
start "Eleven - Backend API (Port 8000)" cmd /k "cd /d "%ROOT_DIR%" && title Eleven Backend API && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [3/3] Starting Vite React Frontend (Port 5173)...
start "Eleven - Frontend UI (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && title Eleven Frontend UI && npm run dev"

echo.
echo =====================================================================
echo   Services are starting!
echo   - Backend API: http://localhost:8000
echo   - API Docs:    http://localhost:8000/docs
echo   - Frontend UI: http://localhost:5173
echo =====================================================================
echo.
echo Waiting 4 seconds for servers to initialize before opening browser...
timeout /t 4 /nobreak >nul

start http://localhost:5173

echo.
echo App launched in browser.
echo You can keep this window open or close it. (Child windows will keep running)
echo To stop the app at any time, run stop_app.bat or close the backend/frontend windows.
echo.
pause
