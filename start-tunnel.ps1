# ─────────────────────────────────────────────────────────────────────────────
# start-tunnel.ps1  —  Gets a public HTTPS URL for Twilio webhooks using
#                       localtunnel (no account needed, no ngrok required)
# ─────────────────────────────────────────────────────────────────────────────
# Usage:  .\start-tunnel.ps1
# ─────────────────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Sanjeevani — Tunnel Launcher (localtunnel)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Make sure backend is reachable
$backendOk = $false
try {
    $resp = Invoke-WebRequest -Uri "http://localhost:8000/" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    $backendOk = $true
    Write-Host "  Backend:  http://localhost:8000  [OK]" -ForegroundColor Green
} catch {
    Write-Host "  Backend:  http://localhost:8000  [NOT RUNNING]" -ForegroundColor Yellow
    Write-Host "  Start backend first:" -ForegroundColor Yellow
    Write-Host "    cd backend" -ForegroundColor White
    Write-Host "    set BACKEND_PUBLIC_URL=<this URL>" -ForegroundColor White
    Write-Host "    uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
    Write-Host ""
}

Write-Host "  Starting localtunnel on port 8000..." -ForegroundColor Cyan
Write-Host "  (first visit will ask you to click a button — expected)" -ForegroundColor Gray
Write-Host ""

# Start localtunnel and capture URL
$ltOutput = lt --port 8000 --subdomain sanjeevani-api 2>&1 &

# Give it 3 seconds to start
Start-Sleep -Seconds 3

# Try to get the URL from background job
$job = Get-Job | Where-Object {$_.Command -like "*lt*"} | Select-Object -Last 1
if ($job) {
    $output = Receive-Job $job
    Write-Host $output
}

Write-Host ""
Write-Host "  Run localtunnel in a SEPARATE terminal with:" -ForegroundColor Cyan
Write-Host "    lt --port 8000 --subdomain sanjeevani-api" -ForegroundColor White
Write-Host ""
Write-Host "  It will print a URL like:" -ForegroundColor Gray
Write-Host "    your url is: https://sanjeevani-api.loca.lt" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Then set BACKEND_PUBLIC_URL and restart backend:" -ForegroundColor Cyan
Write-Host "    set BACKEND_PUBLIC_URL=https://sanjeevani-api.loca.lt" -ForegroundColor White
Write-Host "    uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor White
Write-Host ""
Write-Host "  And set Twilio webhook:" -ForegroundColor Cyan
Write-Host "    console.twilio.com -> Phone Numbers -> +17372212163" -ForegroundColor White
Write-Host "    -> Voice & Fax -> A Call Comes In:" -ForegroundColor White
Write-Host "    https://sanjeevani-api.loca.lt/twilio/voice" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
