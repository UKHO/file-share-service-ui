param(
    [Parameter(Mandatory = $true)] [string] $DeploymentResourceGroupName,
    [Parameter(Mandatory = $true)] [string] $DeploymentStorageAccountName,
    [Parameter(Mandatory = $true)] [string] $WorkSpace,
    [Parameter(Mandatory = $true)] [boolean] $ContinueEvenIfResourcesAreGettingDestroyed
)

cd $env:AGENT_BUILDDIRECTORY/DeploymentScripts/src

Write-Output "Executing terraform scripts for deployment in $WorkSpace enviroment"
terraform init -backend-config="resource_group_name=$DeploymentResourceGroupName" -backend-config="storage_account_name=$DeploymentStorageAccountName" -backend-config="key=terraform.deployment.tfplan"
if ( !$? ) { echo "Something went wrong during terraform initialization"; throw "Error" }

Write-Output "Selecting workspace"

$ErrorActionPreference = 'SilentlyContinue'
terraform workspace new $WorkSpace 2>&1 > $null
$ErrorActionPreference = 'Continue'

terraform workspace select $WorkSpace
if ( !$? ) { echo "Error while selecting workspace"; throw "Error" }

Write-Output "Validating terraform"
terraform validate
if ( !$? ) { echo "Something went wrong during terraform validation" ; throw "Error" }

Write-Output "Execute Terraform plan"
terraform plan -out "terraform.deployment.tfplan" | tee terraform_output.txt
if ( !$? ) { echo "Something went wrong during terraform plan" ; throw "Error" }

$totalDestroyLines=(Get-Content -Path terraform_output.txt | Select-String -Pattern "destroy" -CaseSensitive |  where {$_ -ne ""}).length
if($totalDestroyLines -ge 2) 
{
    Write-Host("Terraform is destroying some resources, please verify...................")
    if ( !$ContinueEvenIfResourcesAreGettingDestroyed) 
    {
        Write-Host("exiting...................")
        Write-Output $_
        exit 1
    }
    Write-Host("Continue executing terraform apply - as continueEvenIfResourcesAreGettingDestroyed param is set to true in pipeline")
}

Write-Output "Executing terraform apply"
terraform apply  "terraform.deployment.tfplan"
if ( !$? ) { echo "Something went wrong during terraform apply" ; throw "Error" }

Write-Output "Terraform output as json"
$terraformOutput = terraform output -json | ConvertFrom-Json

Write-Output "Set JSON output into pipeline variables"
Write-Host "##vso[task.setvariable variable=website_url;isOutput=true]$env:SERVICE_DNS_URL"
Write-Host "##vso[task.setvariable variable=website_storage_account_name]$($terraformOutput.website_storage_account_name.value)"
