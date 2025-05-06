### Api gateway Decision
- Status: accepted
- Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
- Date: 2025-04-03

## Context and Problem Statement
As the application evolved to include authentication and access control, the team needed a mechanism to manage incoming API requests securely and scalably. We evaluated whether to implement our own API Gateway logic manually, or use Kong. Finally, we decided to use Kong Gateway, to handle API key validation and other cross-cutting concerns.

## Decision Drivers
- Need to authenticate API consumers using API Keys
- Reusability and maintainability of API gateway functionality
- Scalability

## Considered Options
- Custom API gateway
- Kong Gateway

## Decision Outcome
Chosen option: Kong Gateway.

### Positive Consequences
- Rapid implementation of API key authentication using built-in plugins
- Centralized management of gateway logic across all microservices
- Reduced technical debt by avoiding custom gateway code

### Negative Consequences
- Added operational complexity
- Learning curve for managing Kong’s configuration and plugins

## Pros and Cons of the Options
### Kong gateway
- Good, because it supports API key validation out of the box
- Good, because it’s extensible via plugins
- Bad, because initial configuration and deployment can be more complex

### Custom api gateway
- Good, because it gives full control over logic and behavior
- Good, because it avoids introducing a new external dependency
- Bad, because initial configuration and deployment can be more complex