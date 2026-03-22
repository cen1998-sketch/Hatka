@echo off
title Hatka Project Launcher
echo ===================================================
echo   HATKA V2 - ЗАПУСК ВСЕХ СЕРВИСОВ
echo ===================================================

echo [1/3] Запуск базы данных PostgreSQL в Docker...
cd server
docker-compose up -d
if %errorlevel% neq 0 (
    echo [!] Ошибка при запуске Docker. Убедись, что Docker Desktop запущен!
    pause
    exit /b
)
cd ..

echo [2/3] Запуск Backend в новом окне...
start "Hatka Backend" cmd /k "cd server && npm run dev"

echo [3/3] Запуск Frontend в новом окне...
start "Hatka Frontend" cmd /k "cd client && npm run dev"

echo ===================================================
echo   ГОТОВО! Сервисы запускаются...
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:5173
echo ===================================================
timeout /t 5
