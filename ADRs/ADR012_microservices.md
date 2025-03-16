# ADR: Working Framework Choice

- Status: Accepted
- Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
- Date: 2025-03-07

## Context and Problem Statement

Since the system is based on multiple interconnected functionalities, it has been decided to adopt a microservices architecture to ensure scalability, maintainability, and separation of concerns. Each microservice will be deployed in its own container using Docker.

## Decision Drivers

- Clear separation of responsibilities
- Scalability and independent maintenance of each service
- Greater control over access and permissions
- The possibility of using specific technologies for each microservice

## Microservices Definition

Below are the implemented microservices and their respective functionalities:

1. Authentication Service:
   Handles user registration and authentication
   Provides secure login via JWT
   Verifies and refreshes session tokens

2. User Management Service:
   Manages user profiles
   Allows modification and updating of personal data
   Controls user status (active/inactive)

3. Singer Management Service:
   Manages information about singers in the voting process
   Allows the creation, modification, and deletion of singers
   Queries details about each singer

4. Voting Service:
   Manages the voting logic
   Allows users to cast their votes
   Ensures that each user can vote according to the established rules

5. Roles and Permissions Service:
   Manages user roles within the system
   Controls access permissions to different functionalities
   Allows dynamic assignment and modification of roles

## Decision Outcome

Positive Consequences

- Modularity: Each microservice has a well-defined responsibility.
- Scalability: They can be deployed and updated independently.
- Security: Authentication and authorization are centralized in specific services.
- Maintainability: Cleaner code and easier modifications without affecting other parts of the system.

Negative Consequences

- Increased complexity in communication between microservices.
- Need for advanced monitoring and management to avoid integration failures.
