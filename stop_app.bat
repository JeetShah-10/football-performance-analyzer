@echo off
title Eleven - Stop All Services

echo =====================================================================
echo           ELEVEN - STOPPING ALL APP SERVICES
echo =====================================================================
echo.

echo [1/2] Stopping processes listening on Port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/2] Stopping processes listening on Port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo =====================================================================
echo   All Eleven services have been stopped.
echo =====================================================================
echo.
timeout /t 2 /nobreak >nul
