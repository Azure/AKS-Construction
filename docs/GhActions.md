# CI Workflows

A number of CI workflows are leveraged in this repo to test the bicep files to ensure quality is high. The patterns and practices used can be replicated into your own IaC pipelines.

In this page all of the GitHub actions used in the repo will be described, as well as good IaC practices.

## Infrastructure as Code pipeline practices

### The Foundations

Often the term "Infrastructure as Code" is misinterpreted as representing your infrastructure as code. Done properly, IaC is about taking software engineering practices and applying them to infrastructure. Quality needs to be baked in from the beginning in order to instil confidence in those depending on the code that is produced. There's some good reading in the Azure Architecture Center on the subject of [Repeatable Infrastructure](https://docs.microsoft.com/en-us/azure/architecture/framework/devops/automation-infrastructure).

#### Branch policies

It's important to protect your main branch by enforcing Pull Requests to be used with an additional reviewer.
As part of the PR you can set various Actions to run, and crucially you can specify jobs in the pipelines that must always pass. For this repo, we're using `Validation` as the name of the job that must always pass [status checks](https://docs.github.com/v3/repos/statuses/).

### The workflow

Behind any IaC you write, you'll want to have some automation to assure quality. There is a compromise to be had when it comes to the amount of time and activities to include in the automation workflow. It's important to shift left as much as you can, to take advantage of quick wins to feedback to the engineer that's contributing the IaC. It's also important to consider the consumers of your IaC code;

- How are they going to be provided the IaC
- Do they know how to run it
- How does the deployment  behaviour change as the parameters vary
- How can they incorporate a new version of the template as you improve it

#### One of our workflows

Here's a sample of one of the workflows used in this project. We have multiple stages which are run conditionally based on the workflow trigger.

It's important to note that deploying applications from an infrastructure pipeline is an anti-pattern, and the applications that are being deployed in this workflow are serving as `smoke tests` of the infrastructure.

![sample workflow](docs/images/ghactionworkflow.jpg)

### Pre-deploy Validation

It's essential to shift left, and catch as many problems before a single resource is deployed to real infrastructure. There are a plethora of tools and techniques that can be leveraged to catch functional or syntactical problems depending on your authoring language and platform.

#### Bicep Build

Whenever code files in the bicep directory are changed on a push, the bicep build command is run. This action installs bicep and runs the `bicep build` command, if this fails then this is a very early indicator to the author that the bicep file is not valid. Ideally these problems would have surfaced earlier in the coding inner loop, but sometimes mistakes can happen and bad files can make it back into source control.

Running a bicep build initiates the [linter](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/linter), which will create warnings where best practices are not followed. Any errors that are encountered will fail the pipeline.

Warnings do not form part of the pass/fail of the action step, however you can use [linter configuration](https://github.com/Azure/bicep/blob/main/docs/linter.md#configuration) to achieve this.

#### PSRule for Azure

An interesting project for performing pre/post validation of Azure Resources against the Well Architected Framework is [PSRule for Azure](https://azure.github.io/PSRule.Rules.Azure/). Over [200 rules](https://azure.github.io/PSRule.Rules.Azure/en/baselines/Azure.All/) will be evaluated against your Arm template, ranging from Security configuration to naming conventions.

#### Using the AZ CLI to verify

As a minimum bar to assert the quality of the bicep code we really want to leverage some additional validation of "would this deploy successfully" and "what will this create", but without actually creating any actual Infrastructure resources.

To do this we need to talk to the Azure Control Plane, so we'll need a set of Azure Credentials, Subscription and a resource group with RBAC configured.

1. [Validation](https://docs.microsoft.com/en-us/cli/azure/deployment/group?view=azure-cli-latest#az_deployment_group_validate). Validation ensures the template compiles, that there are no errors in the bicep code, that the parameter file provides all mandatory parameters and that the ARM Control plane will accept the deployment. A great example of what Validate can do is that it will fail if you supply incompatible configuration through parameters, eg. You want a feature of an Azure service that comes with a Premium SKU but you've set the SKU to Standard.
1. [What-If](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-what-if). The what-if operation lets you see how resources will change if you deploy the template.

After running a What-If, we have the opportunity to leverage the output of the WhatIf to assert a level of quality of what's been written. This is especially useful when your bicep template contains a lot of conditional logic. EG. If you're using parameter values to choose whether or not to install certain resources it can be especially useful to write a couple of test cases around this.
There might also be a number of rules specific to your enterprise you wish may want to enforce to guide best practices that cannot be done using [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview), such as resource naming conventions.

### Deploying to an Azure Subscription

By running the Validation and WhatIf, you'll already have achieved a good level of rigour on quality, however there are gaps (Key Vault soft delete, Diagnostic Setting category validation, to name but two) with these validation tests - and the only way to know for sure if your template works is to deploy it.

Actually deploying your IaC template as part of the development process also supports;

- Enabling integration tests for more complex infrastructure deployments.
- Documented evidence of the IaC working with associated logs, great for future analysis if things break.
- Seeing the end to end time it takes to deploy, so you can provide guidance to the teams who consume your code template.

Consider how often you'll employ this technique, as there are `cost implications`. It also adds a significant delay into your pipeline.

In this repo we run a real deployment and integration tests each week on a schedule, not for every push of the code.

### Post-deploy Validation

The fact that a deployment completes successfully is a great sign in itself, however there are several post deployment checks that can be run to verify the usability of the IaC code that's been new'd up.

The first, and often easiest activity is to test using the service. Attempting to contact the service endpoint is firmly in the realm of integration testing, not just because of the many deployed services working together but also because of the configuration of those services and restrictions in place in the environment you're deploying to.

#### Workload smoke tests

Depending on the IaC workload will change the approach you'll employ for smoke testing the application. In the case of Kubernetes, we have a platform that runs containers so we can focus the smoke tests on deploying containers to that platform and testing they function correctly. For this we'll not use our own application, but leverage a known good application. We don't want to build technical debt on maintaining an application to test with, instead identifying a maintained application project will save time and provide an additional baseline for running workloads because if we can't run a sample application properly what hope does our application teams have?

For this project we're using the Azure Vote application, which is the de-facto app used in the AKS documentation. Where environment deployments include Application Gateway, it will be used as the testing entry point to ensure that it is configured correctly.

## Other actions used in this repo

### Check Markdown

This is a super simple action that runs a *spell check* on any `.md` files in the repo. It's useful to catch simple mistakes from quick edits or other peoples PR's. This action is also part of the branch policy for merging to main.

## CI breakdown

The CI Actions leveraged have a certain amount of commonality, they primarily vary by the parameter configuration of the resources they are deploying. As an example, the CI Actions that deploy an Application Gateway Ingress Controller deploy a specific workload onto AKS and then check that the Gateway is directing traffic properly.

### Validation stage

As detailed above, the validation stage is essential in creating a baseline of quality.

### Deployment stage

This stage captures all of the deployment and post deployment configuration activities and actually deploys the resources to an Azure subscription.

There are often configuration tasks that need to be done after AKS is installed, such as the [Log Analytics Fast Alerting Experience](https://docs.microsoft.com/en-us/azure/azure-monitor/containers/container-insights-enable-new-cluster) being enabled or a different ingress controller installed from a shell script.

### Infrastructure tests

This stage provides the opportunity for configuration to be checked. An example from the Private CI action is ensuring that the Cluster is able to provide logs to Log Analytics, which can trip up deployments where you bring your own networking and firewall.

### Workload Add

A great smoke test of fresh infrastructure is deploying a known good static application. This is especially true when using Ingress controllers that require specific configuration.

The Private CI action deploys both a public facing and private facing workload onto AKS using the [Application Gateway Ingress Controller](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-overview). After adding the workload, a basic integration test is performed by sending an http request to the frontend ip address on the Application Gateway and checking for the http response code being 200.

### Application Tests

This stage is really not to be part of an IaC pipeline, but inside the pipeline of your application teams. It's here to show *how easy it is* to run a security baseline against a deployed application, this practice can be recommended to application teams that use the IaC code template for their application deployment. ZAP provides a recognised baseline security scan.

### Cleanup

This stage will delete the resources created in Azure, after proving the configuration. If one of the previous stages fails then the infrastructure will be left in order to enable troubleshooting.

Each night the resource groups used for IaC testing are purged of all resources.

## CI Step Highlight

Different action workflow files showcase different complexities of CI/CD practices which are summarised below.

1. [Deployment Verification](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L100)
1. [Deployment What-If](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L111)
1. [Deployment What-If Pester Testing](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L141)
1. [Bicep Deployment](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L189)
1. [Post Deployment Addons](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L194)
1. [Verify Deployment Configuration](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetCI.yml#L261)
1. [Deploy Test workload](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L230)
1. [Verify Test workload](https://github.com/Azure/AKS-Construction/blob/ed15a8945ab019bd86469c366df85e6d59aeb8ab/.github/workflows/ByoVnetPrivateCI.yml#L278)
