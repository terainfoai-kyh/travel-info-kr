$ErrorActionPreference = "Stop"

Write-Host "Compiling scripts/VoraUnify.cs..."
Add-Type -Path "scripts/VoraUnify.cs"

Write-Host "Running VoraMasterCrypto::ProcessUnification..."
$res = [VoraMasterCrypto]::ProcessUnification("scripts/original_voraDialogKnowledge.js", "src/data/voraQnaVault.js")
Write-Host $res
