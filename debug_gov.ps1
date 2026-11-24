$govLogin = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/login' -Method Post -Body (@{ email = 'admin@civic.gov'; password = 'GovAdmin123!' } | ConvertTo-Json) -ContentType 'application/json'
Write-Host "Token: $($govLogin.token)"
$me = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/me' -Headers @{ Authorization = "Bearer $($govLogin.token)" }
Write-Host "Me role: $($me.role)"
$me | ConvertTo-Json
