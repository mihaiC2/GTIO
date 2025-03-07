### Database Decision
- Status: accepted
- Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
- Date: 2025-03-04

## Context and Problem Statement
The team initially considered using a NoSQL database (MongoDB) for its scalability and flexibility. However, after further evaluation, we decided to switch to a relational database due to its advantages in data integrity, structured relationships, and transactional support. After considering multiple options, PostgreSQL was chosen as the primary database.

## Decision Drivers
- Data consistency and integrity
- Strong support for relational data modeling
- Ensuring a single vote per user with transactional guarantees
- Familiarity with SQL-based queries
- Long-term maintainability

## Considered Options
- MongoDB
- PostgreSQL
- SQLite

## Decision Outcome
Chosen option: "PostgreSQL".

### Positive Consequences
- Ensures data consistency and referential integrity
- Supports complex queries efficiently
- Strong ACID compliance, preventing duplicate votes
- Well-documented and widely adopted

### Negative Consequences
- Potentially more complex scaling compared to NoSQL solutions
- Requires careful schema design to accommodate future changes

## Pros and Cons of the Options

### PostgreSQL
- Good, because it provides strong transactional consistency
- Good, because it supports complex queries and indexing efficiently
- Good, because it ensures referential integrity and data constraints
- Bad, because horizontal scaling can be more challenging compared to NoSQL solutions

### SQLite
- Good, because it is lightweight and requires minimal setup
- Good, because it is file-based, making it easy to deploy for small-scale applications
- Bad, because it lacks robust concurrency support for high-traffic applications
- Bad, because it does not scale well for distributed environments

### MongoDB
- Good, because it is highly scalable with built-in sharding
- Good, because it allows a flexible schema, making future changes easier
- Bad, because ensuring data consistency and enforcing constraints requires additional logic

