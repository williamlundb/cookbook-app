$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    $nodeFolder = Join-Path $runtimeRoot 'node\bin'
    if (-not (Test-Path -LiteralPath (Join-Path $nodeFolder 'node.exe'))) {
        throw 'Install Node.js 24 or later before starting the app.'
    }
    $env:Path = "$nodeFolder;$env:Path"
}
$packageRunner = Get-Command pnpm -ErrorAction SilentlyContinue
if ($packageRunner) {
    $pnpmPath = $packageRunner.Source
} else {
    $pnpmPath = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'
    if (-not (Test-Path -LiteralPath $pnpmPath)) {
        throw 'Install pnpm 11 before starting the app.'
    }
}
if (-not (Test-Path -LiteralPath 'node_modules\expo\package.json')) {
    & $pnpmPath install --frozen-lockfile
    if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
}
& $pnpmPath start
exit $LASTEXITCODE
