param(
    [Parameter(mandatory=$true)][string]$FssUiWebUrl,
    [Parameter(mandatory=$true)][string]$WaitTimeInMinutes
)

$sleepTimeInSecond = 15
$isServiceActive = 'false'

$stopWatch = New-Object -TypeName System.Diagnostics.Stopwatch
$timeSpan = New-TimeSpan -Minutes $waitTimeInMinute
$stopWatch.Start()

do {
    Write-Host "Polling url: $FssUiWebUrl..."

    try {
        $httpRequest  = [System.Net.WebRequest]::Create("$FssUiWebUrl")
        $httpResponse = $httpRequest.GetResponse() 
        $httpStatus   = $httpResponse.StatusCode
        Write-Host "Status code of web is $httpStatus..."
    
        if ($httpStatus -eq 200 ) {
            Write-Host "Website is up. Stopping Polling ..."
            $isServiceActive = 'true'
            break
        } else {
            Write-Host "Website not yet up. Status code: $httpStatus, re-checking after $sleepTimeInSecond sec..."
        }
    }
    catch [System.Net.WebException]
    {
        $httpStatus = $_.Exception.Response.StatusCode
        Write-Host "Website not yet up. Status code: $httpStatus, re-checking after $sleepTimeInSecond sec..."
    }    
    
    Start-Sleep -Seconds $sleepTimeInSecond
} until ($stopWatch.Elapsed -ge $timeSpan)

if ($httpResponse -ne $null) {
    $httpResponse.Close() 
}

if ($isServiceActive -eq 'true' ) {
    Write-Host "Website is up, returning from script..."
} else { 
    Write-Error "Website was not up in $WaitTimeInMinute, error in deployment."
    throw "Error"
}
