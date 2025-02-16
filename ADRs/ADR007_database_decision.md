### Database Decision
- Status: accepted
- Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
- Date: 2025-02-16

## Context and Problem Statement
The team initially chose PostgreSQL for its ability to handle complex queries efficiently. Due to the team's inexperience with the technology, we decided to change the database.

## Decision Drivers
- Team experience
- Scalability
- Flexibility in handling unstructured and semi-structured data
- Simpler horizontal scaling

## Considered Options
- MongoDB
- MySQL

## Decision Outcome
Chosen option: "MongoDB".

### Positive Consequences
- Improved scalability with horizontal scaling support
- Easier handling of dynamic and semi-structured data
- Simpler maintenance and schema evolution

### Negative Consequences
- Learning curve for some team members unfamiliar with MongoDB

## Pros and Cons of the Options

### MongoDB
- Good, because it is highly scalable with built-in sharding
- Good, because it allows a flexible schema, making future changes easier
- Bad, because indexing needs to be optimized for performance

### MySQL
- Good, because it is widely adopted and well-documented
- Good, because it is optimized for read-heavy workloads
- Bad, because it lacks native support for document-based data models

