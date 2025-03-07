# API Testing Tool 

* Status: Accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-03-07

## Context and Problem Statement
The development team needs a tool to test and validate API endpoints, ensuring the correctness of microservices in the voting web application.

## Decision Drivers <!-- optional -->
* Ease of use and intuitive interface
* Support for automated and manual API testing
* Integration with CI/CD pipelines
* Collaboration features for team development

## Considered Options
* Postman
* Insomnia
* Swagger UI

## Decision Outcome
Chosen option: Postman, because it provides a comprehensive set of features for API testing and our development team has experience with the tool.

### Positive Consequences <!-- optional -->
* Enhances testing efficiency and API validation
* Facilitates collaboration with team members through shared collections

### Negative Consequences <!-- optional -->
* Some advanced features are behind a paywall
* The free plan of Postman limits collaboration to up to 3 team members.

## Pros and Cons of the Options <!-- optional -->
* **Postman**
    - Good, Comprehensive testing features, including automation
    - Good, Strong collaboration tools for teams and depelopment team's experience
    - Bad, Some features require a paid subscription

* **Insomnia**
    - Good, Lightweight and fast
    - Good, Simple and effective for quick API testing
    - Bad, Limited collaboration capabilities

* **Swagger UI**
    - Good, for documentation and API exploration
    - Bad, Not designed for extensive testing and automation
    - Bad, Lacks collaboration and CI/CD integration