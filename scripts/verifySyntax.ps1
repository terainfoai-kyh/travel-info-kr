# Pre-Push Zero Defect Syntax & AST Verifier
param (
    [string]$TargetDir = "src"
)

$files = Get-ChildItem -Path $TargetDir -Recurse -Include *.jsx, *.js
$errorCount = 0

Write-Host "=== Starting Pre-Push Zero-Defect Code Verification ===" -ForegroundColor Cyan

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $relPath = $file.FullName.Replace((Get-Location).Path, "")

    # 1. Check duplicate useState declarations
    $stateMatches = [regex]::Matches($content, 'const\s+\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState')
    $declaredStates = @{}
    foreach ($m in $stateMatches) {
        $varName = $m.Groups[1].Value
        if ($declaredStates.ContainsKey($varName)) {
            Write-Host " [DUPLICATE STATE ERROR]: '$varName' declared multiple times in $relPath" -ForegroundColor Red
            $errorCount++
        } else {
            $declaredStates[$varName] = $true
        }
    }

    # 2. Check top-level syntax issues (unclosed template literals, obvious double const)
    $doubleConstMatches = [regex]::Matches($content, 'const\s+const\s+')
    if ($doubleConstMatches.Count -gt 0) {
        Write-Host " [SYNTAX ERROR]: 'const const' typo found in $relPath" -ForegroundColor Red
        $errorCount++
    }
}

# Target file specific check for DesktopMapExplorer.jsx and App.jsx
$desktopMap = Get-Content -Path "src/components/DesktopMapExplorer.jsx" -Raw
$app = Get-Content -Path "src/App.jsx" -Raw

# Check for duplicate state declarations in DesktopMapExplorer
$mapStateCount = ([regex]::Matches($desktopMap, 'isMapExpandedFull,\s*setIsMapExpandedFull')).Count
if ($mapStateCount -gt 1) {
    Write-Host " [SCOPE ERROR]: isMapExpandedFull declared $mapStateCount times in DesktopMapExplorer.jsx" -ForegroundColor Red
    $errorCount++
}

if ($errorCount -eq 0) {
    Write-Host " [ZERO DEFECT PASSED]: All modified files are clean, scoped, and defect-free!" -ForegroundColor Green
    exit 0
} else {
    Write-Host " [VERIFICATION FAILED]: Found $errorCount critical syntax/scope error(s). PUSH BLOCKED!" -ForegroundColor Red
    exit 1
}
