# Helper Release Docs

## Creating a release

Usually a release of the Helper Web App will be accompanied by changes to the bicep code. In which case a new symantec release tag needs to be chosen (0.8.2 or 0.8.5 etc).
There is a [GitHub action workflow](https://github.com/Azure/AKS-Construction/actions/workflows/release.yml) which is initiated manually but automates the release, all that needs to be provided is the new release tag.

- If you are not a member of the [AKS Construction Admins](https://github.com/orgs/Azure/teams/aks-construction-admins) or [AKS Construction Maintainers](https://github.com/orgs/Azure/teams/aks-construction-maintainers) groups, please ask a member of either group to be available to review your deployment - **you won't be able to complete the release without their review**
- Trigger the [Release bicep and helper](https://github.com/Azure/AKS-Construction/actions/workflows/release.yml) action, incrementing the release version by 1 (e.g. 0.10.1 :arrow_right: 0.10.2)
- Wait for the workflow to run to completion
  - If any errors occur, examine the output of the job that failed and troubleshoot the issue(s). You may need to submit a fix via PR, which will require an additional person to review and approve
  - If there are no errors, the action will pause on the "Deploy Web App to Prod Pages" job - you will need a repo admin or maintainer to review and approve this job to create the final release
- Navigate to the [Releases](https://github.com/Azure/AKS-Construction/releases) page and check your new release has appeared
  - It should be showing with the "Pre-release" label
  - Edit the release, scroll to the bottom of the page and select "Set as the latest release" and save the change
- Open that [AKS Construction helper](https://azure.github.io/AKS-Construction/) and verify that your release is now the current release

## Releasing just the Helper Web App

Occasionally there will be UI improvements that we want to release that do not have any dependencies in a new release.
For these scenarios, we use the same [GitHub action workflow](https://github.com/Azure/AKS-Construction/actions/workflows/release.yml) but choose not to create a new release. Instead, just repeating the release tag that is current.

## Rolling back the release

When the release workflow runs, it stores assets of the UI and bicep code in zip files.
If we need to rollback a *bad release* then process is as follows

1. In the [GitHub action workflow](https://github.com/Azure/AKS-Construction/actions/workflows/release.yml) history, locate the release you want to rollback to.
2. Download the artifact zip for the `HelperApp`
3. In you local git environment checkout the `gh-pages` branch
4. Extract the contents of the artifact zip over the top of branch
5. Commit and push to the `gh-pages` branch.
6. Wait for GitHub to process the new branch and release the app
