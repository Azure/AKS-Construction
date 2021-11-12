# Contribution Guide

A few important factoids to consume about the Repo, before you contribute.

## Action Workflows

Various workflows run on Push / PR / Schedule.

| Workflow    | Fires on  | Purpose  |
|-------------|-----------|----------|
| Bicep Build | Every Push | `Quality` To run the bicep linter upon changes to the bicep files  |
| Greetings   | Issue / PR | `Community` Greeting new contributors to the repo |
| Stale bot   | Issue / PR | `Tidy` Marks old issues as stale |
| Labeler   | PR | `Tidy` Adds relevant labels to PR's based on files changed |
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

## Branches

### Feature Branch

For the *most part* we try to use feature branches to PR to Main

```
┌─────────────────┐         ┌───────────────┐
│                 │         │               │
│ Feature Branch  ├────────►│     Main      │
│                 │         │               │
└─────────────────┘         └───────────────┘

```

Branch Policies require the Validation stage of our GitHub Action Workflows to successfully run. The Validation stage does an Az Deployment WhatIf and Validation on an Azure Subscription, however later stages in the Actions that actually deploy resources do not run. This is because we've got a high degree of confidence in the Validate/WhatIf capability. We do run the full stage deploys on a weekly basis to give that warm fuzzy feeling. At some point, we'll run these as part of PR to main.

### The Develop Branch

Where there have been significant changes and we want the full gammit of CI testing to be run on real Azure Infrastucture - then the Develop branch is used.
It gives us the nice warm fuzzy feeling before merging into Main. 
We anticipate the use of the Develop branch is temporary.

```
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

## Dev Container / Codespaces

A dev container is present in the repo which makes dev and testing of the UI Helper component much easier.

### Commands

Some helpful terminal commands for when you're getting started with DevContainer/Codespaces experience

Running the Wizard GUI app

```bash
cd helper
npm start
#Browser should automatically open. Web app runs on port 3000 on path /Aks-Construction
```

Running the playwright tests after starting the Wizard web app
```bash
#Open a new terminal window
cd helper
#npx playwright install
#npx playwright install-deps chromium
npx playwright test --browser chromium .playwrighttests/ --reporter list
```
