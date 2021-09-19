# CI Workflows

A number of CI workflows are leveraged in this repo to test the bicep files from validation through deployment and testing to ensure quality is high.

## CI breakdown

TODO

## CI Step Highlight

Different action workflow files showcase different complexities of CI/CD practices which are summarised below.

1. [Deployment Verification](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L100)
1. [Deployment What-If](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L111)
1. [Deployment What-If Pester Testing](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L141)
1. [Bicep Deployment](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L189)
1. [Post Deployment AddOns](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L194)
1. [Verify Deployment Configuration](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L261)
1. [Deploy Test workload](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L230)
1. [Verify Test workload](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L278)
1. [Run App Security Scan](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/StandardCI.yml#L269)
