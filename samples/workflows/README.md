# Workflow docs

The AKS Construction repository uses GitHub action workflows extensively, in particular we use reusable workflows to expose common reusable workflows that can be leveraged from your own workflows.

In this section of the samples, various features and workflow jobs will be explained.

## Infrastructure Workflows

### InfraCI - Starter cluster

This workflow is one of the simplest for showing the fundamental steps of a IaC workflow.

1. Validation
1. Infra Deployment
1. App Deployment (smoke test)
1. Infra Cleanup/Destruction

## Reusable Workflows

Workflow | Purpose | Sample
-------- | ------- | ------
Deploy | Deploys AKSC infrastructure with minimal inputs |
Troubleshooting | |
CleanUp | Iterates over a resource group and removes all resources

## Job Showcase

Job | Purpose | Sample
--- | ------- | ------
Azure Cost Estimate | Estimates the monthly cost of an Azure Deployment | [sample](azureCostEstimator.md)
