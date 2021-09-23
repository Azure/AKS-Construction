# CI Workflows

A number of CI workflows are leveraged in this repo to test the bicep files from validation through deployment and testing to ensure quality is high.

## CI breakdown

The CI Actions leveraged have a certain amount of commonality, they primarily vary by the parameter configuration of the resources they are deploying. As an example, the CI Actions that deploy an Application Gateway Ingress Controller deploy a specific workload onto AKS and then check that the Gateway is directing traffic properly.

### Validation stage

The validation stage of the pipelines do not deploy any resource to Azure, but they do talk to the Azure Controlplane. 
1. [Validation](https://docs.microsoft.com/en-us/cli/azure/deployment/group?view=azure-cli-latest#az_deployment_group_validate). Template validation is the first activity of the deployment pipelines. It ensures the template compiles, that there are no errors in the bicep code, that the parameter file provides all mandatory parameters and that the ARM Controlplane will accept the deployment. A great example of what Validate can do is that it will fail if you supply incompatible configuration through parameters, eg. You want a feature of an Azure service that comes with a Premium SKU but you've set the SKU to Standard.
1. [What-If](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-what-if). The what-if operation lets you see how resources will change if you deploy the template. 
1. [What-If tests] The output of the What-If is captured as JSON, and you can write code to assert expected configuration against the prediction from Azure. Eg. If your parameter specification defined a certain number of AKS nodes, or a particular IP Whitelist for the API Server then you can test for this.

### Deployment stage

This stage captures all of the deployment and post deployment configuration activities and actually deploys the resources to an Azure subscription. There are often configuration tasks that need to be done after AKS is installed, such as the [Log Analytics Fast Alerting Experience](https://docs.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-enable-new-cluster) being enabled or a different ingress controller installed.

### Infrastructure tests

This stage provides the opportunity for configuration to be checked. An example from the Private CI action is ensuring that the Cluster is able to provide logs to Log Analytics, which can trip up deployments where you bring your own networking and firewall.

### WorkloadAdd

A great smoke test of fresh infrastructure is deploying a known good static application. This is especially true when using Ingress controllers that require specific configuration. The Private CI action deploys both a public facing and private facing workload onto AKS using the [Application Gateway Ingress Controller](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-overview). After adding the workload, and integration test is performed by sending an http request to the frontend ip address on the Application Gateway and checking for the http response code.

### Application Tests

This stage shows some of the tests you might want to leverage in your pipeline for ensuring Application quality. ZAP provides a recognised baseline security scan.

### Cleanup

This stage will delete the resources created in Azure in order to keep costs optimised.

###

## CI Step Highlight

Different action workflow files showcase different complexities of CI/CD practices which are summarised below.

1. [Deployment Verification](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L100)
1. [Deployment What-If](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L111)
1. [Deployment What-If Pester Testing](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L141)
1. [Bicep Deployment](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L189)
1. [Post Deployment Addons](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L194)
1. [Verify Deployment Configuration](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L261)
1. [Deploy Test workload](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L230)
1. [Verify Test workload](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L278)
1. [Run App Security Scan](https://github.com/Azure/Aks-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/StandardCI.yml#L269)
