# Script para iniciar el backend y verificar su funcionamiento

Write-Host "🚀 Iniciando verificación del backend..." -ForegroundColor Cyan

# Verificar MySQL
Write-Host "`n📊 Verificando MySQL..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "✅ MySQL está corriendo" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL no está corriendo. Iniciando..." -ForegroundColor Red
        Start-Service -Name "MySQL80"
        Write-Host "✅ MySQL iniciado" -ForegroundColor Green
    }
} else {
    Write-Host "❌ MySQL80 no está instalado o no se encuentra" -ForegroundColor Red
}

# Verificar puerto 7261
Write-Host "`n🔍 Verificando puerto 7261..." -ForegroundColor Yellow
$port7261 = Get-NetTCPConnection -LocalPort 7261 -ErrorAction SilentlyContinue
if ($port7261) {
    Write-Host "⚠️ El puerto 7261 ya está en uso. Cerrando proceso..." -ForegroundColor Yellow
    $processId = $port7261.OwningProcess
    Stop-Process -Id $processId -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Puerto 7261 liberado" -ForegroundColor Green
} else {
    Write-Host "✅ Puerto 7261 disponible" -ForegroundColor Green
}

# Iniciar backend
Write-Host "`n🚀 Iniciando backend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\Tienda-DS.Server"

Write-Host "`n📝 Iniciando dotnet run..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener el servidor`n" -ForegroundColor Gray

dotnet run --project Tienda-DS.Server.csproj
