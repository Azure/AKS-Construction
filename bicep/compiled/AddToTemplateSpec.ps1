$specName="AKSConstruction"
$resourceGroup="AKS-Construction"
$specVersion="0.5"
$templateFilePath="bicep\main.bicep"

if (Test-Path $templateFilePath) {
    New-AzTemplateSpec -Name $specName -Version $specVersion -ResourceGroupName $resourceGroup - $templateFilePath
}
else {
    Write-Error "Template file not found"
}