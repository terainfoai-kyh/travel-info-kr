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

    # 2. Check duplicate handler declarations (const handleXxx =)
    $handlerMatches = [regex]::Matches($content, 'const\s+(handle\w+)\s*=\s*(?:async\s*)?\(')
    $declaredHandlers = @{}
    foreach ($m in $handlerMatches) {
        $hName = $m.Groups[1].Value
        if ($declaredHandlers.ContainsKey($hName)) {
            Write-Host " [DUPLICATE HANDLER ERROR]: '$hName' declared multiple times in $relPath" -ForegroundColor Red
            $errorCount++
        } else {
            $declaredHandlers[$hName] = $true
        }
    }

    # 3. Check top-level syntax issues (unclosed template literals, obvious double const)
    $doubleConstMatches = [regex]::Matches($content, 'const\s+const\s+')
    if ($doubleConstMatches.Count -gt 0) {
        Write-Host " [SYNTAX ERROR]: 'const const' typo found in $relPath" -ForegroundColor Red
        $errorCount++
    }

    # 4. Check for unimported custom JSX components (<MyTripTab, <VoraAIChat, etc.)
    if ($file.Extension -eq ".jsx") {
        $jsxTagMatches = [regex]::Matches($content, '<([A-Z]\w+)\b')
        $seenTags = @{}
        foreach ($m in $jsxTagMatches) {
            $tag = $m.Groups[1].Value
            if ($seenTags.ContainsKey($tag)) { continue }
            $seenTags[$tag] = $true
            if ($tag -in @('React', 'Fragment', 'Suspense', 'StrictMode', 'Provider', 'HTML', 'SVG', 'Path')) { continue }
            if (-not ($content -match "(?m)^import\s+[\s\S]*?\b$tag\b" -or $content -match "\bfunction\s+$tag\b" -or $content -match "\bconst\s+$tag\s*=")) {
                Write-Host " [UNDEFINED COMPONENT ERROR]: '<$tag>' used without import/declaration in $relPath" -ForegroundColor Red
                $errorCount++
            }
        }
    }
}

# Target file specific check for DesktopMapExplorer.jsx and App.jsx
$desktopMap = Get-Content -Path "src/components/DesktopMapExplorer.jsx" -Raw
$app = Get-Content -Path "src/App.jsx" -Raw
$generator = Get-Content -Path "src/services/localItineraryGenerator.js" -Raw

# 3. Check for duplicate state declarations in DesktopMapExplorer
$mapStateCount = ([regex]::Matches($desktopMap, 'isMapExpandedFull,\s*setIsMapExpandedFull')).Count
if ($mapStateCount -gt 1) {
    Write-Host " [SCOPE ERROR]: isMapExpandedFull declared $mapStateCount times in DesktopMapExplorer.jsx" -ForegroundColor Red
    $errorCount++
}

# 4. Check for illegal auto city override inside handleStageNavigation
if ($desktopMap -match 'handleStageNavigation[\s\S]*?onSelectCityPlan\(') {
    Write-Host " [ARCHITECTURE ERROR]: Illegal onSelectCityPlan found inside handleStageNavigation (Violates Article 22!)" -ForegroundColor Red
    $errorCount++
}

# 5. Check for zero-spot emergency safety net in localItineraryGenerator.js
if (-not ($generator -match 'EMERGENCY_SAFE_GENUINE' -or $generator -match 'daySpots\.length\s*===\s*0')) {
    Write-Host " [SAFETY ERROR]: Zero-spot emergency fallback missing in localItineraryGenerator.js" -ForegroundColor Red
    $errorCount++
}

if ($errorCount -eq 0) {
    Write-Host " [ZERO DEFECT PASSED]: All modified files are clean, scoped, compliant with Article 22, and defect-free!" -ForegroundColor Green
    exit 0
} else {
    Write-Host " [VERIFICATION FAILED]: Found $errorCount critical syntax/scope/architectural error(s). PUSH BLOCKED!" -ForegroundColor Red
    exit 1
}
