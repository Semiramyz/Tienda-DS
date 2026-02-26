# Script para verificar el backend sin iniciarlo

Write-Host "🔍 Verificando estado del backend..." -ForegroundColor Cyan

# Test 1: MySQL
Write-Host "`n📊 MySQL Service:" -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "   ✅ Running" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Stopped" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Not found" -ForegroundColor Red
}

# Test 2: Puerto 7261
Write-Host "`n🔌 Port 7261:" -ForegroundColor Yellow
$port7261 = Get-NetTCPConnection -LocalPort 7261 -ErrorAction SilentlyContinue
if ($port7261) {
    Write-Host "   ✅ In use (backend probably running)" -ForegroundColor Green
    Write-Host "   Process ID: $($port7261.OwningProcess)" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Not in use (backend not running)" -ForegroundColor Red
}

# Test 3: API Health Check
Write-Host "`n🏥 API Health Check:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://localhost:7261/api/health" -Method Get -SkipCertificateCheck -ErrorAction Stop
    Write-Host "   ✅ API is responding" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    Write-Host "   Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ API not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 4: Database Connection
Write-Host "`n💾 Database Connection:" -ForegroundColor Yellow
try {
    $connectionString = "server=localhost;port=3306;database=tienda-sd;user=root;password=12345;"
    $connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)
    $connection.Open()
    Write-Host "   ✅ Database reachable" -ForegroundColor Green
    $connection.Close()
} catch {
    Write-Host "   ❌ Cannot connect to database" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

# Test 5: Usuarios endpoint
Write-Host "`n👥 Usuarios Endpoint:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://localhost:7261/api/usuarios" -Method Get -SkipCertificateCheck -ErrorAction Stop
    Write-Host "   ✅ Endpoint responding" -ForegroundColor Green
    Write-Host "   Users count: $($response.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Endpoint not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "`n✨ Verification complete!" -ForegroundColor Cyan
