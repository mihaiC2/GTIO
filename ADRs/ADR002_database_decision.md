  ### Database Decision
  - Status: accepted
  - Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
  - Date: 2025-02-07
  
  ## Context and Problem Statement
  The team needs to select a database technology that aligns with project requirements, ensuring scalability, performance, and ease of use.
  
  ## Decision Drivers
  - Scalability
  - Performance
  - Ease of use
  - Community support
  
  ## Considered Options
  - MongoDB
  - PostgreSQL
  - MySQL
  
  ## Decision Outcome
  Chosen option: "PostgreSQL", because it works better with many petitions and supports complex queries efficiently.
  
  ### Positive Consequences
  - Efficient handling of complex queries
  - Scales well for many concurrent requests
  
  ### Negative Consequences
  - The team lacks experience with PostgreSQL
  - Requires time to learn and implement best practices
  
  ## Pros and Cons of the Options
  
  ### MongoDB
  - Good, because it is highly scalable
  - Good, because it has a flexible schema
  - Bad, because it requires careful indexing for performance optimization
  
  ### PostgreSQL
  - Good, because it supports complex queries efficiently
  - Bad, because the team lacks experience with PostgreSQL
  
  ### MySQL
  - Good, because it is widely adopted and well-documented
  - Good, because it is optimized for read-heavy workloads
  - Bad, because it lacks native support for document-based data models

