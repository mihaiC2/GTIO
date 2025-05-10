# Deployment Plan Decision
* Status: accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-05-07

## Context and Problem Statement

Our project currently lacks a fully automated cloud deployment pipeline. We need to define how deployments are handled across different environments to ensure stability during development and efficiency in production.

## Decision Drivers

* Simplicity for development and testing
* Automation for production reliability
* Integration with GitHub repositories
* Clear separation of development and production environments

## Considered Options

* Fully manual deployment
* Hybrid: manual for development, automated for production using CI/CD
* Full CI/CD automation for all environments

## Decision Outcome

Chosen option: **Hybrid deployment strategy** – manual deployment for development environment, and automated deployment for production via GitHub Actions when changes are pushed to the `main` branch.

### Positive Consequences

* Developers can test quickly in dev without needing complex automation
* Production benefits from repeatable, consistent deployments
* GitHub Actions provides clear visibility of build and deploy steps

### Negative Consequences

* Development deployments might be inconsistent if not well documented
* Manual steps in dev may lead to configuration drift

## Pros and Cons of the Options

### Hybrid (manual dev, automatic prod)

* Good, because it balances simplicity with automation
* Good, because it allows fast iterations in development
* Bad, because development deployments may lack reproducibility

### Fully Manual

* Good, because it's very simple and quick to set up

### Fully Automated

* Good, because it ensures consistency and fewer errors
* Bad, because it's overkill for quick local testing and requires more setup