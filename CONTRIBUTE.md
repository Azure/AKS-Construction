# Contribution Guide

## Branches

For the *most part* we try to use feature branches to PR to Main

```
┌─────────────────┐         ┌───────────────┐
│                 │         │               │
│ Feature Branch  ├────────►│     Main      │
│                 │         │               │
└─────────────────┘         └───────────────┘

```

However, where there have been significant changes and we want the full gammit of CI testing to be run on real Azure Infrastucture - then the Develop branch is used.

```
┌─────────────────┐         ┌─────────────┐       ┌────────────┐
│                 │         │             │       │            │
│ Feature Branch  ├────────►│   Develop   ├──────►│    Main    │
│                 │         │             │       │            │
└─────────────────┘         └─────────────┘       └────────────┘

```
