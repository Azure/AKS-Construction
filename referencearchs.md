# AKS Reference Architectures

## The Secure Baseline

The AKS Construction bicep code is based on the AKS Secure Baseline.

The [Secure Baseline document](https://docs.microsoft.com/en-us/security/benchmark/azure/baselines/aks-security-baseline) has a reference implementation and a number of additional reference implementations that build on the base to show different patterns such as [multi region](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-multi-region/aks-multi-cluster) or [microservices](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices).
For each of the documented scenarios there is an accompanying implemenation guide that includes script snippets and an ARM Json file for the cluster infrastructure. The template  showcases an end to end deployment of all the infrastructure as well as a sample workload. The Arm templates by design take a minimal amount of parameters, with much configuration built in to the resources directly. This is great from a learning perspective, and as part of consuming the secure baseline you make the template your own.

Much of the code and configuration in this project is based off the work in the Secure Baseline, the philosphy however is different. This project aims to converge on a single IaC codebase, and vary behaviour through parameters, parameters which use *good defaults* to minimise needing to provide too many parameter values. The Secure Baseline covers much of the documentation and practices, and this project focusses on the implementation experience and automation samples.

When the AKS Secure Baseline is updated, changes are evaluated and rolled into this project.

### Deviations from the baseline (and why)
1. System pool and user pool seperation is made optional in interests of users seeking a cost optimised configuration.
2. Ingress. Different baselines showcase different Ingress.
3. Networking. Hub/Spoke networks typically already exist, and tightly bundling with Kubernetes doesn't work well here. BYO subnets are supported.

## Enterprise Scale

The Enterprise Scale Reference

The [Deployment Helper Wizard](https://azure.github.io/Aks-Construction/?default=es) has an Enterprise-Scale lense, with preset configurations for each landing zone area.

## The Enterprise-Scale for AKS project

This is the parent project that our work belongs to. The reference implementations in this repository all have a Enterprise-Scale lense, and typically include deployments of Hub/Spoke infrastructure and development vm's. It includes a Terraform implementation, and is again based on the AKS Secure Baseline.

## Cloud Adoption Framework and Enterprise Scale

