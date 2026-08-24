# Eleven - Football Player Style Dashboard & AI Scouting Engine
# PowerShell One-Click Runner

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "          ELEVEN - FOOTBALL PLAYER STYLE DASHBOARD LAUNCHER          " -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# 2. Check Node / npm
try {
    $nodeVersion = node --version 2>&1
    Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[1/2] Starting FastAPI Backend (Port 8000)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$RootDir`" && title Eleven - Backend API && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Starting Vite Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$RootDir\frontend`" && title Eleven - Frontend UI && npm run dev"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  Services launched successfully!                                    " -ForegroundColor Green
Write-Host "  - Frontend UI: http://localhost:5173                               " -ForegroundColor White
Write-Host "  - Backend API: http://localhost:8000                               " -ForegroundColor White
Write-Host "  - API Docs:    http://localhost:8000/docs                          " -ForegroundColor White
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
