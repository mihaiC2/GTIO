# Microservices Communication

* Status: Accepted
* Deciders: Mihail, Roberto, Nikol, Yasin, Jazmín
* Date: 2025-03-07

## Context and Problem Statement

The microservices in the voting web application need a reliable and efficient communication mechanism to exchange data and trigger actions while maintaining scalability.

## Decision Drivers <!-- optional -->

* Ensure reliable communication between microservices
* Maintain scalability and flexibility
* Enhance fault tolerance and error handling

## Considered Options

* API Gateway for centralized communication
* Direct REST API communication between microservices
* Asynchronous communication using message queues

## Decision Outcome

Chosen option: API Gateway, because it provides a unified entry point, improves security, and simplifies service management.

### Positive Consequences <!-- optional -->

* Provides a single entry point for all requests, improving security and maintainability
* Reduces direct coupling between microservices
* Enhances scalability by distributing requests efficiently

### Negative Consequences <!-- optional -->

* Introduces a single point of failure if not properly managed
* Adds some latency due to request processing at the gateway level
* Requires additional infrastructure and configuration

## Pros and Cons of the Options <!-- optional -->

* **API Gateway for centralized communication**
    - Good, improves security and access control
    - Good, simplifies client interaction with microservices
    - Bad, adds complexity in setup and maintenance
    - Bad, can become a bottleneck if not properly scaled

* **Direct REST API communication between microservices**
    - Good, simple to implement and understand
    - Bad, increases coupling between services

* **Asynchronous communication using message queues**
    - Good, handles high loads efficiently without blocking
    - Bad, adds complexity in message queue management
    - Bad, potential delays in processing messages

