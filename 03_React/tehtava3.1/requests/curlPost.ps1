$Url = 'http://localhost:3001/api/persons'
$Body = @{
    name = "Nalle"
    number = "Ebin"
    }

$response = Invoke-RestMethod -Method POST -Uri $Url -Body $Body -ContentType 'application/json'

# Write-Output $response