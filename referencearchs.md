# AKS Reference Architectures

## The Secure Baseline

The AKS Construction bicep code is based on the AKS Secure Baseline.

The [Secure Baseline document](https://docs.microsoft.com/en-us/security/benchmark/azure/baselines/aks-security-baseline) has a reference implementation and then a number of additional reference implementations that build on the base to show different patterns such as multi region or microservices.
The template for the baseline is ARM JSON, it showcases an end to end deployment of all the infrastructure as well as a sample workload. The Arm templates by design take a minimal amount of parameters, with much configuration built in to the resources directly. This is great from a learning perspective, and as part of consuming the secure baseline you make the template your own.

Much of the code and configuration in this project is based off the work in the Secure Baseline, the philosphy however is different. This project aims to converge on a single IaC codebase and vary behaviour through parameters, parameters which use *good defaults* to minimise needing to provide too many parameter values.

When the AKS Secure Baseline is updated, changes are evaluated and rolled into this project.

### Deviations from the baseline (and why)
1. System pools.
2. Ingress. Different baselines showcase different Ingress.
3. Networking. Hub/Spoke networks typically already exist, and tightly bundling with Kubernetes doesn't work well here. BYO subnets are supported.

## The Enterprise-Scale for AKS project

## Cloud Adoption Framework and Enterprise Scale

Enterprise Scale brings a 
The GUI experience is tailored towards an Enterprise Scale scenario. 
