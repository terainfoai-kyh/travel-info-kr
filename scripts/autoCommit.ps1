# Automated Zero-Prompt Commit Runner
param (
    [string]$DefaultMessage = "chore: automated verified commit"
)

$commitMsg = $DefaultMessage
if (Test-Path ".commit_msg") {
    $fileMsg = (Get-Content -Path ".commit_msg" -Raw).Trim()
    if ($fileMsg) {
        $commitMsg = $fileMsg
    }
    Remove-Item -Path ".commit_msg" -Force -ErrorAction SilentlyContinue
}

Remove-Item -Path "scripts\checkBundle.ps1", "scripts\testEnv.ps1" -Force -ErrorAction SilentlyContinue

git add -A
git commit -m $commitMsg
