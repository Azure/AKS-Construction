# ACE (Azure Cost Estimator)

[ACE](https://github.com/TheCloudTheory/arm-estimator) is a project created by Microsoft MVP [Kamil Mrzygłód](https://github.com/kamil-mrzyglod). It provides a mechanism to take a bicep/arm file with parameters and provide an estimated monthly cost of the deployment.

AKS Construction leverages ACE in two of the deployment workflows to showcase more advanced Infrastructure as Code practices that can be incorporated into workflows.

## The output

In addition to the job output, we persist a json file as an artifact. We could choose to query the costs and fail the workflow if the cost was too high.

## Adding the workflow

