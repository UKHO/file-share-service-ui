 $contentType = "application/json";
 $headers = @{ Authorization = 'Bearer $(System.AccessToken)' };
 $rawRequest = @{ daysValid = 365 * 2; definitionId = $(System.DefinitionId); ownerId = 'User:$(Build.RequestedForId)'; protectPipeline = $false; runId = $(Build.BuildId) };
 $request = ConvertTo-Json @($rawRequest);
 $uri = "$(System.CollectionUri)$(System.TeamProject)/_apis/build/retention/leases?api-version=7.0";

 Invoke-RestMethod -uri $uri -method POST -Headers $headers -ContentType $contentType -Body $request;

do
{
    Write-Host "Polling url: $fssUIWebUrl ..."
    try{
        $HttpRequest  = [System.Net.WebRequest]::Create("$fssUIWebUrl")
        $HttpResponse = $HttpRequest.GetResponse() 
        $HttpStatus   = $HttpResponse.StatusCode
        Write-Host "Status code of web is $HttpStatus ..."
    
        If ($HttpStatus -eq 200 ) {
            Write-Host "Website is up. Stopping Polling ..."
            $isServiceActive = 'true'
            break
        }
        Else {
            Write-Host "Website not yet Up. Status code: $HttpStatus re-checking after $sleepTimeInSecond sec ..."
        }
    }
    catch [System.Net.WebException]
    {
        $HttpStatus = $_.Exception.Response.StatusCode
        Write-Host "Website not yet Up.Status: $HttpStatus re-checking after $sleepTimeInSecond sec ..."
    }    
    
    Start-Sleep -Seconds $sleepTimeInSecond
}
until ($stopWatch.Elapsed -ge $timeSpan)


If ($HttpResponse -ne $null) { 
    $HttpResponse.Close() 
}

if ($isServiceActive -eq 'true' ) {
    Write-Host "Website is up returning from script ..."
}
Else { 
    Write-Error "Website was not up in $waitTimeInMinute, error while deployment ..."
    throw "Error"
}
