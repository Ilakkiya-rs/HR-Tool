# Django API for vani-assessment-module (profilers routes on port 8001)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Get-Content ".env.test" | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    Set-Item -Path "env:$($matches[1].Trim())" -Value $matches[2].Trim()
  }
}

$env:DATABASE_URL = "sqlite:///db.sqlite3"
$env:ENABLE_PROFILERS = "true"
$env:PYTHONPATH = $PSScriptRoot
$env:DJANGO_SETTINGS_MODULE = "my_skill_plus.settings_dev"

if (-not (Test-Path "db.sqlite3")) {
  .\.venv\Scripts\python.exe manage.py migrate --skip-checks
}

.\.venv\Scripts\python.exe scripts\seed_assessment_user.py
.\.venv\Scripts\python.exe manage.py runserver 8001 --settings=my_skill_plus.settings_dev --skip-checks
