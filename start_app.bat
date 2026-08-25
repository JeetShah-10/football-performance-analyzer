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

echo [1/4] Checking prerequisites...

:: Check for Virtual Environment or Global Python
if exist "%ROOT_DIR%venv\Scripts\python.exe" (
    set "PYTHON_CMD=%ROOT_DIR%venv\Scripts\python.exe"
    echo [OK] Using virtual environment Python: !PYTHON_CMD!
) else if exist "%ROOT_DIR%.venv\Scripts\python.exe" (
    set "PYTHON_CMD=%ROOT_DIR%.venv\Scripts\python.exe"
    echo [OK] Using virtual environment Python: !PYTHON_CMD!
) else (
    set "PYTHON_CMD=python"
    python --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo [ERROR] Python is not installed or not in PATH!
        pause
        exit /b 1
    )
    echo [OK] Using system Python.
)

:: Check Node.js / npm
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js / npm is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] Node.js / npm detected.
echo.

echo [2/4] Starting FastAPI Backend (Port 8000)...
start "Eleven - Backend API (Port 8000)" cmd /k "cd /d "%ROOT_DIR%" && title Eleven Backend API && "%PYTHON_CMD%" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [WAIT] Waiting for FastAPI Backend to initialize ML models and listen on Port 8000...

:: Actively poll backend health endpoint until it is online (max 20 seconds)
set "BACKEND_READY=0"
for /l %%i in (1,1,20) do (
    curl.exe -s -f http://127.0.0.1:8000/health >nul 2>&1
    if !errorlevel! equ 0 (
        set "BACKEND_READY=1"
        goto :backend_ready
    )
    timeout /t 1 /nobreak >nul
)

:backend_ready
if "!BACKEND_READY!"=="1" (
    echo [OK] FastAPI Backend is ONLINE and ready!
) else (
    echo [WARN] Backend initialization took longer than expected, proceeding with frontend launch...
)
echo.

echo [3/4] Starting Vite React Frontend (Port 5173)...
start "Eleven - Frontend UI (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && title Eleven Frontend UI && npm run dev"

echo [WAIT] Initializing Vite development server...
timeout /t 3 /nobreak >nul
echo.

echo [4/4] Opening Eleven Dashboard in browser...
start http://localhost:5173

echo.
echo =====================================================================
echo   Services are successfully running!
echo   - Frontend UI: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - API Docs:    http://localhost:8000/docs
echo =====================================================================
echo.
echo You can keep this window open or close it. (Child server windows will keep running)
echo To stop all services at any time, run stop_app.bat
echo.
pause
