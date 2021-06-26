Write-Host "Testing"

if ($psISE) {
	Write-Host "PS"
} else {
	Write-Host "No"
}

Write-Host $psISE.PowerShellTabs.Add()