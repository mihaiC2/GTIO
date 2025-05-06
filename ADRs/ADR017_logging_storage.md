# Logging storage Decision
- Status: accepted
- Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
- Date: 2025-05-01

## Context and Problem Statement
Our team needs to store application and API logs for debugging and monitoring purposes. Initially, we considered storing logs in files for simplicity and local access. Finally, we decided to store logs in a NoSQL database to future integration with observability tools.

## Decision Drivers
- Scalability as log volume grows
- Centralized access for debugging and monitoring
- Future integration with dashboards or log analysis tools

## Considered Options
- Log files stored on disk
- MongoDB (NoSQL database)

## Decision Outcome
Chosen option: MongoDB.

### Positive Consequences
- Scales well as logs increase in volume
- Centralized and remote access to logs
- Easier integration with log visualization tools

### Negative Consequences
- Additional infrastructure overhead
- Added operational complexity

## Pros and Cons of the Options
### MongoDB
- Good, because it scales horizontally and stores large volumes efficiently
- Good, because it enables centralized access and integration with monitoring systems
- Bad, because it requires setting up and maintaining a MongoDB instance
- Bad, because indexing and storage management must be handled carefully

### Log Files
- Good, because they are simple to implement and have no external dependencies
- Bad, because they don’t scale well