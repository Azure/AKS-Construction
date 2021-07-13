# AKS-Construction

`Status: This project is currently a Work in Progress.`

This project provides a comprehensive, flexible templating approach to creating Azure Kubernetes Service clusters and related Azure services.
It unifies guidance provided by the [AKS Secure Baseline](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks/secure-baseline-aks), [Cloud Adoption Framework](https://azure.microsoft.com/en-gb/cloud-adoption-framework/) and [Enterprise-Scale](https://github.com/Azure/Enterprise-Scale) by providing tangible artifacts to deploy Azure resources from CLI or CI/CD systems.

## Components

### GUI experience

To help guide your AKS configuration, use the [Deployment Helper](https://azure.github.io/Aks-Construction/), which will provide a set of parameters and scripts to make deployment simple.

[![preview screenshot of the helper wizard](helper_preview.png)](https://azure.github.io/Aks-Construction/)

### Bicep templates

Templates have been modularised into their component areas. [Main.bicep](bicep/main.bicep) references them and they are expected to be present in the same directory. The Deployment Helper leverages a json compiled version of all the bicep files.

## Implementation Notes

### Configurations

Whilst the Deployment Helper lets you generate a fully flexible deployment, before merging template changes we run CI on several configuration presets.

| Config | CI Status | Notes
|--------|-----------|------|
| [ESLZ Byo peered vnet](.github/workflows_dep/AksDeploy-ByoVnet.parameters.json) | [![ByoVnetCI](https://github.com/Azure/Aks-Construction/actions/workflows/ByoVnetCI.yml/badge.svg?branch=main)](https://github.com/Azure/Aks-Construction/actions/workflows/ByoVnetCI.yml) | Takes full resource id's as parameters for existing subnets |
| [ESLZ Byo private vnet](.github/workflows_dep/AksDeploy-ByoVnetPrivate.parameters.json) | [![ByoVNetPrivateCI](https://github.com/Azure/Aks-Construction/actions/workflows/ByoVnetPrivateCI.yml/badge.svg)](https://github.com/Azure/Aks-Construction/actions/workflows/ByoVnetPrivateCI.yml)| as per ByoVnet, but Private |
| [ESLZ Sandbox](.github/workflows_dep/AksDeploy-Basic.parameters.json) | [![AksStandardCI](https://github.com/Azure/Aks-Construction/actions/workflows/StandardCI.yml/badge.svg)](https://github.com/Azure/Aks-Construction/actions/workflows/StandardCI.yml) | Deploys it's own network using default CIDRs |

### Preview Features

As a general rule, Preview Features will not be included in the Wizard.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
