# v-bucket Contributing Guide

Hi! We're really excited that you are interested in contributing to v-bucket. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)

## Issue Reporting Guidelines

- Always use [bug_report template](https://github.com/mediv0/v-bucket/blob/master/.github/ISSUE_TEMPLATE/bug_report.md) to create new issues.

## Pull Request Guidelines

- The `master` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- If adding a new feature:

  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:

  - Provide a detailed description of the bug in the PR. Live demo preferred.

- It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

- Make sure tests pass!
