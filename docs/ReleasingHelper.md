# Helper Release Docs

## Creating a release

Usually a release of the Helper Web App will be accompanied by changes to the bicep code. In which case a new symantec release tag needs to be chosen (0.8.2 or 0.8.5 etc).
There is a [GitHub action workflow](https://github.com/Azure/AKS-Construction/actions/workflows/release.yml) which is initiated manually but automates the release, all that needs to be provided is the new release tag.

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
