# Contribution Guide

A few important factoids to consume about the Repo, before you contribute.

## Opportunities to contribute

Start by looking through the active issues for [low hanging fruit](https://github.com/Azure/AKS-Construction/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
Another area that will help you get more familiar with the project is by running the Helper Web App locally and writing some new [Playwright web tests](helper/.playwrighttests) to make our web publishing/testing process more robust.

## Action Workflows

Various workflows run on Push / PR / Schedule.

| Workflow    | Fires on  | Purpose  |
|-------------|-----------|----------|
| Bicep Build | Every Push | `Quality` To run the bicep linter upon changes to the bicep files  |
| Greetings   | Issue / PR | `Community` Greeting new contributors to the repo |
| Stale bot   | Issue / PR | `Tidy` Marks old issues as stale |
| Labeller   | PR | `Tidy` Adds relevant labels to PR's based on files changed |
| Publish Helper | PR | `Quality` Tests changes to the UI work |
| Publish Helper | Push `main` | Publishes the UI to GitHub Pages |
| Check Markdown | PR | `Quality` Checks markdown files for spelling mistakes |
| Infra CI - Private Cluster | Push / PR / Schedule | `Quality` Low maturity IaC deployment example. Tests the most secure/private parameter config |
| Infra CI - Byo Vnet Cluster | Push / PR / Schedule | `Quality` High maturity IaC deployment example. Tests a typical production grade parameter config |
| Infra CI - Starter Cluster | Push / PR / Schedule | `Quality` Low maturity IaC deployment example. Tests a sandbox grade parameter config |
| InfraCI - Regression Validation | Push / PR / Schedule | `Quality` Validates multiple parameter files against the bicep code to cover regression scenarios |
| App CI | Manual | `Quality` Application deployment sample showing different application deployment practices and automation capabilities |

### Enforced PR Checks

Each has a *Validate job*, that is required to pass before merging to main. PR's tagged with `bug`, that contain changes to bicep or workflow files will need to pass all of the jobs in the relevant workflows before merge is possible.

### PR's from Forks

If you're creating a PR from a fork then we're unable to run the typical actions to ensure quality that the core team are able to use. This is because GitHub prevents Forks from leveraging secrets in this repository. PR's from forks will therefore require comprehensive checking from the core team before merging.

> If you are making any changes to the bicep files, then we require you run the `bicep build workflow` in your repo, and include the resulting compiled bicep in your PR.

## Branches

### Feature Branch

For the *most part* we try to use feature branches to PR to Main

```text
┌─────────────────┐         ┌───────────────┐
│                 │         │               │
│ Feature Branch  ├────────►│     Main      │
│                 │         │               │
└─────────────────┘         └───────────────┘

```

Branch Policies require the Validation stage of our GitHub Action Workflows to successfully run. The Validation stage does an Az Deployment WhatIf and Validation on an Azure Subscription, however later stages in the Actions that actually deploy resources do not run. This is because we've got a high degree of confidence in the Validate/WhatIf capability. We do run the full stage deploys on a weekly basis to give that warm fuzzy feeling. At some point, we'll run these as part of PR to main.

### The Develop Branch

Where there have been significant changes and we want the full gamut of CI testing to be run on real Azure Infrastructure - then the Develop branch is used.
It gives us the nice warm fuzzy feeling before merging into Main.
We anticipate the use of the Develop branch is temporary.

```text
┌─────────────────┐         ┌─────────────┐       ┌────────────┐
│                 │         │             │       │            │
│ Feature Branch  ├────────►│   Develop   ├──────►│    Main    │
│                 │         │             │       │            │
└─────────────────┘         └─────────────┘       └────────────┘
                                  ▲
┌─────────────────┐               │
│                 │               │
│ Feature Branch  ├───────────────┘
│                 │
└─────────────────┘

```

## Releases

Releases are used to capture a tested release (all stages, not just Validation), where there are significant new features or bugfixes. The release does not include CI Action files, just the Bicep code.

## Area change guidance

### Bicep code

When changing the Bicep code, try to build into your `developer inner loop` the following

- Review the linting warnings in VSCode. When you push, the bicep will be compiled to json with warnings/errors picked up
- If making a breaking change (eg. changing a parameter datatype), pay attention to the Regression parameter files. These will be checked during PR. If the change you're making isn't covered by an existing parameter file, then add one.

#### Breaking Changes

Should be avoided wherever possible, and where necessary highlight the breaking change in the release notes. Version 1.0 will signify a stricter policy around breaking  changes.

#### PSRule validation for Well Architected Analysis

[PSRule for Azure](https://azure.github.io/PSRule.Rules.Azure) provides analysis for IaC against the Well Architected Framework. It is leveraged in the GitHub actions that run on PR, but you can leverage it locally with the following script;

```powershell
Install-Module -Name 'PSRule.Rules.Azure' -Repository PSGallery -Scope CurrentUser

$paramPath="./.github/workflows_dep/regressionparams/optimised-for-well-architected.json"
test-path $paramPath
Assert-PSRule -Module 'PSRule.Rules.Azure' -InputPath $paramPath -Format File -outcome Processed

```

### The Wizard Web App

The [configuration experience](https://azure.github.io/AKS-Construction/) is hosted in GitHub pages. It's a static web app, written in NodeJS using [FluentUI](https://developer.microsoft.com/en-us/fluentui).

#### Playwright tests

Playwright is used to help verify that the app works properly, you can use Playwright in your local dev experience (see Codespaces below), but crucially it's also leveraged as part of the publish process. If the tests don't pass, then the app will not publish. The `fragile` keyword should be used in any tests where you're learning how they work and run. Once the test is of sufficient quality to be considered a core test, the `fragile` keyword is removed.

We're trying to ensure that PR's that contain Web UI changes have appropriate Playwright tests that use `data-testid` for navigating the dom.

### Dev Container / Codespaces

A dev container is present in the repo which makes dev and testing of the UI Helper component much easier.

#### Commands

Some helpful terminal commands for when you're getting started with DevContainer/Codespaces experience

Running the Wizard GUI app

```bash
cd helper
npm start
#Browser should automatically open. Web app runs on port 3000 on path /AKS-Construction
```

Running the playwright tests after starting the Wizard web app

```bash
#Open a new terminal window
cd helper
npx playwright install
npx playwright install-deps chromium
npm i -D playwright-expect
npx playwright test --browser chromium .playwrighttests/ --reporter list
```

## Issues

Issues that are inactive are marked as stale and then closed pretty aggressively. We'll periodically look through the stale issues to see if any genuine issues have snuck their way through.
