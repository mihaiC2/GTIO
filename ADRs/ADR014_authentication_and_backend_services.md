# Authentication and Backend Services

* Status: Accepted
* Deciders: Mihail, Roberto, Nikol, Yasin, Jazmín
* Date: 2025-03-07

## Context and Problem Statement

The voting web application requires a reliable authentication system, real-time data handling, and backend services that are easy to integrate and maintain. The solution should support modern authentication methods and provide a PostgreSQL database.

## Decision Drivers <!-- optional -->

* Comprehensive authentication system with various login methods
* Real-time data synchronization and event handling
* Seamless integration with frontend frameworks
* Open-source
* Cost-effective and developer-friendly

## Considered Options

* Supabase
* Firebase Authentication + Firestore
* Custom backend with PostgreSQL and Node.js

## Decision Outcome

Chosen option: "Supabase", because it provides a complete backend solution, including authentication.

### Positive Consequences <!-- optional -->

* Simplifies authentication and user management
* Enables real-time voting updates and event-driven interactions
* Provides full control over security policies with Row-Level Security (RLS)

### Negative Consequences <!-- optional -->

* Some features are still evolving compared to Firebase
* Requires manual optimization for large-scale applications

## Pros and Cons of the Options <!-- optional -->

* **Supabase**
    - Good, open-source
    - Good, built-in authentication with multiple providers
    - Good, real-time database with PostgreSQL and RLS
    - Bad, some advanced features are still in development

* **Firebase Authentication + Firestore**
    - Good, fully managed and easy to set up
    - Good, strong integration with Google Cloud services
    - Good, real-time database updates
    - Bad, firestore is NoSQL, which may not suit relational data needs
    - Bad, limited control over authentication and database security

* **Custom backend with PostgreSQL and Node.js**
    - Good, full control over authentication and backend logic
    - Good, highly customizable and scalable
    - Bad, requires significant development effort
    - Bad, needs manual implementation of security and authentication

