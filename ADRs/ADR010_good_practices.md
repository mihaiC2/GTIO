# ADR: Working Framework Choice

* Status: Accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-03-07

## Context and Problem Statement

To ensure code quality, maintainability, and scalability in the project, it is essential to establish a set of best development practices. This will guarantee that the code is clean, easy to understand, and fosters efficient collaboration within the team.

## Decision Drivers

* Code quality and maintainability
* Efficient collaboration among developers
* Reduction of errors and bugs in production
* Ease of scaling and extending the system
* Transparency in development and code review

## Considered Options

* Not defining best practices
* Applying only basic best practices
* Establishing a solid set of best practices from the beginning

## Decision Outcome

Chosen option: Establishing a solid set of best practices from the beginning.

The best practices adopted in the project include:

- Testing: Implementation of unit, integration tests.
- Clean Code: Writing readable, maintainable, and well-structured code following industry standards.
- Version Control and Pull Requests: Using Git with a structured branching model and mandatory code reviews before merging.
- Endpoints Documentation: Clear and updated documentation of endpoints to facilitate development and integration.
- Good Microservices Architecture and Organization: Ensuring modularity, separation of concerns, and scalability.
- Error Handling and Logging: Implementing proper error handling mechanisms and logging for debugging and monitoring.
- Design Patterns: Applying suitable design patterns to improve code structure and reusability.

### Positive Consequences

* Improved code readability and maintainability
* Better collaboration and team efficiency
* Reduced risk of introducing bugs into production
* Easier debugging and troubleshooting

### Negative Consequences

* Requires knowledge to established practices
* Initial learning curve for team members unfamiliar with some practices

## Pros and Cons of the Options

No Best Practices
* Good: No initial setup time required
* Bad: Leads to messy and unmaintainable code
* Bad: Harder collaboration and debugging

Basic Best Practices
* Good: Covers fundamental aspects of development
* Bad: May not be enough to ensure high-quality code and scalability

Solid Best Practices Implementation
* Good: Ensures high-quality, maintainable, and scalable code
* Good: Facilitates onboarding of new developers and improves team efficiency
* Bad: Requires discipline and commitment from the team

## Links

* [Clean Code Guide](https://www.freecodecamp.org/news/clean-coding-for-beginners/)
* [Test Pyramid](https://github.com/jbraz95/UPNA-GTIO/blob/main/2025/teoria/gestion.md#tradicional)
