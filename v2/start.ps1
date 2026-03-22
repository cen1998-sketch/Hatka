Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  HATKA V2 - МОЩНЫЙ ЗАПУСК (PowerShell Edition)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "[1/3] Проверка Docker..." -ForegroundColor Yellow
Set-Location server
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Docker не запущен или произошла ошибка!" -ForegroundColor Red
    Read-Host "Нажми Enter, чтобы выйти..."
    exit
}
Set-Location ..

Write-Host "[2/3] Запуск Backend в новом окне..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Write-Host "[3/3] Запуск Frontend в новом окне..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  ГОТОВО! Сервисы взлетают. Подробности в новых окнах." -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "===================================================" -ForegroundColor Cyan
Start-Sleep -Seconds 5
