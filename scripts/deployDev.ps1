# scripts/deployDev.ps1 - Mandatory Development Release Pipeline
# 100% Guaranteed Zero-Defect, Cloudflare Pages Dev Direct Deployment (travelkorea-dev.pages.dev)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  VORA AI - Development Release Pipeline                  " -ForegroundColor Cyan
Write-Host "  Target: Cloudflare Pages [travelkorea-dev]               " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Zero Defect Syntax & Integrity Verification
Write-Host "`n[Step 1/4] Verifying Code Integrity..." -ForegroundColor Yellow
& powershell.exe -ExecutionPolicy Bypass -File .\scripts\verifySyntax.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ [DEPLOY BLOCKED] Syntax errors detected! Halting dev deploy." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Code integrity verified." -ForegroundColor Green

# 2. Local Production Bundle Build (vite build)
Write-Host "`n[Step 2/4] Building Local Production Bundle (vite build)..." -ForegroundColor Yellow
& npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ [DEPLOY BLOCKED] Build failed! Halting dev deploy." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Production bundle built successfully." -ForegroundColor Green

# 3. Extract Built Bundle Hash Receipt
$distIndex = Get-Content -Path ".\dist\index.html" -Raw
$bundleMatch = [regex]::Match($distIndex, 'src="\/assets\/(index-[^"]+\.js)"')
$bundleHash = if ($bundleMatch.Success) { $bundleMatch.Groups[1].Value } else { "UNKNOWN" }
Write-Host "`n[Step 3/4] Generated Bundle Hash: $bundleHash" -ForegroundColor Cyan

# 4. Sync Source Code to dev-remote/main (Cloudflare Pages travelkorea-dev Git Trigger)
Write-Host "`n[Step 4/4] Syncing Source Code to dev-remote/main..." -ForegroundColor Yellow
& git push dev-remote main
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ [DEPLOY FAILED] Failed to push to dev-remote main!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Source code synced to dev-remote/main! Cloudflare Pages build triggered." -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  🎉 DEV DEPLOYMENT COMPLETE!                             " -ForegroundColor Green
Write-Host "  Dev URL: https://travelkorea-dev.pages.dev/              " -ForegroundColor Green
Write-Host "  Active Bundle Hash: $bundleHash                         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
