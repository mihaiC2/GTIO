# ADR: Working Framework Choice

* Status: Accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-03-07

## Context and Problem Statement

The project requires a scalable, maintainable, and modular architecture that supports multiple microservices. We need to ensure efficient communication between services, efficient deployment, and ease of scaling.

## Decision Drivers

* Scalability and flexibility
* Maintainability and modularity
* Isolation and independence of services
* Efficient resource utilization
* Efficient communication between microservices

## Considered Options

* Monolithic Architecture
* Microservices Architecture with Dockerized Services
* Serverless Architecture

## Decision Outcome

Chosen option: Microservices Architecture with Dockerized Services

Our architecture is based on multiple microservices, each running in its own container using Docker. The system consists of:

- A frontend service running in its own container
- A backend gateway managing API requests, also in its own container
- Various microservices, each responsible for a specific domain (e.g., authentication, votes, singers, etc.), running independently in separate containers

### Positive Consequences

* High scalability and flexibility
* Easy deployment and updates via containerization
* Better fault isolation – failures in one service do not affect others
* Efficient resource utilization by running only necessary services

### Negative Consequences

* Increased complexity in managing inter-service communication
* Requires robust monitoring and logging
* Higher initial setup and learning curve

## Pros and Cons of the chosen option

Microservices Architecture with Dockerized Services
* Good, because it enables independent scaling and deployment
* Good, because it isolates failures and allows flexibility in tech choices
* Bad, because it adds complexity in managing multiple services and deployments
* Bad, because it requires careful monitoring and observability
