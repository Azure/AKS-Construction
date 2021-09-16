# Contribution Guide

A few important factoids to consume about the Repo, before you contribute.

## Action Workflows

Various workflows run on Push / PR / Schedule.
Each has a *Validate stage*, that is required to pass before merging to main.

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
