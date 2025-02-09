# ADR: Frontend Development Technology

* Status: Accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-02-09

## Context and Problem Statement

For the development of our application's frontend, we need to choose a suitable technology that allows us to build an efficient, maintainable, and scalable user interface. The decision must consider factors such as learning curve, ecosystem, performance, and community support.

## Decision Drivers

* Ease of learning and adoption by the team
* Ecosystem and community support
* Code maintainability and scalability
* Performance

## Considered Options

* Angular
* Plain JS with HTML and CSS
* React

## Decision Outcome

Chosen option: React, because it offers a balance between flexibility, ease of adoption, and a strong community. Additionally, it's the technology with which our frontend developers are more familiarized with.

### Positive Consequences

* Greater component reuse thanks to React's component-based model
* Strong community support and library ecosystem
* Better code maintainability due to its modular structure

### Negative Consequences

* The learning curve can be somewhat challenging for those with no prior experience in React

## Pros and Cons of the Options

### Angular

* Good, because it has a well-defined architecture and built-in tools
* Good, because it has strong enterprise support and documentation
* Bad, because it has a steep learning curve due to its complexity
* Bad, because it can be too restrictive for some use cases

### Plain JS with HTML and CSS

* Good, because it offers flexibility and simplicity without the need for additional frameworks
* Good, because it has lower performance overhead
* Bad, because it can become difficult to maintain in large projects
* Bad, because it lacks a robust ecosystem for reusable components

### React

* Good, because it enables a modular and reusable structure based on components
* Good, because it has a large community and many available libraries
* Good, because it is flexible and integrates well with other modern tools
* Bad, because it requires good state management to maintain efficiency

## Links

* [React Documentation](https://react.dev/)

