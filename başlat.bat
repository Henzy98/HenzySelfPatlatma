@echo off
title Henzy Self Patlatma
color 0a

echo.
echo ========================================
echo        Henzy Self Patlatma
echo ========================================
echo.

if not exist "node_modules" (
    echo [*] Gerekli paketler indiriliyor...
    npm install discord.js-selfbot-v13
    if errorlevel 1 (
        echo [ERROR] Paket indirme hatasi!
        pause
        exit /b 1
    )
    echo [OK] Paketler indirildi!
) else (
    echo [OK] Paketler zaten mevcut!
)

echo.
echo [*] Tool baslatiliyor...
echo.

node index.js

echo.
echo [*] Tool kapandi. Cikmak icin herhangi bir tusa basin...
pause >nul
