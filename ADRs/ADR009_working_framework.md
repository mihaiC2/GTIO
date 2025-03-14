# ADR: Working Framework Choice

* Status: Accepted
* Deciders: Mihail, Yasin, Roberto, Nikol, Jazmin
* Date: 2025-03-14

## Context and Problem Statement

The team came to the conclusion that SCRUM would not be the ideal agile methodology to follow for our project and needed reconsideration.

## Decision Drivers

* Adaptability to changing requirements
* Efficient team collaboration
* Incremental and iterative development
* Transparency and continuous feedback
* Improved risk management

## Considered Options

* Waterfall development
* Traditional predictive methodology
* Metodología ágil adaptada al equipo

## Decision Outcome

Chosen option: we chose agile methodology adapted to the team.

The agile methodology we follow is similar to SCRUM but with some differences:
- There are no daily meetings, but 2 meetings every week.
- There are no roles as in SCRUM.
- There is no retrospective meeting, simply when an RFI is finished we discuss the aspects in which we have failed to correct in the next RFI.
- We do not work with Sprints, we work by RFIs.

The methodology we will follow will have the following steps:
1. Definition of requisites in the [Requisites](/Requisites/Requisites.md) file
2. Definition of jobs to do in the [Trello page](https://trello.com/b/RMn4UuXP/proyecto-votacion)
3. Job assignation for each designed use case
4. Implementation on a new branch
5. Once implemented, creation of a pull request with the changes
6. After at least one revision, merge the branch to main branch (Everyone should review the code in order to be aware of the state of the project)
7. Before merging, a set of tests should be run to ensure no previous funtionality has been broken. These tests will be authomatized with GitHub actions.

### Positive Consequences

* Increased adaptability to evolving project needs
* Enhanced collaboration and communication within the team
* Regular feedback loops leading to continuous improvement

### Negative Consequences

* Requires commitment to Agile principles and practices

## Pros and Cons of the Options

### Waterfall Development

* Good, because it provides a clear and structured approach
* Good, because it defines all requirements upfront
* Bad, because it lacks flexibility to accommodate changes
* Bad, because it can lead to long development cycles without early feedback

### Traditional Predictive Methodology

* Good, because it offers clear structures for each development phase.
* Bad, because it does not provide the same level of flexibility and adaptability as Agile methodologies.

### Metodología ágil adaptada al equipo

* Good, because it allows for iterative development and continuous feedback
* Good, because it enhances team collaboration and transparency
* Bad, because it requires discipline and commitment to Agile principles

## Links

* [Scrum Guide](https://scrumguides.org/)
* [Diferences between Methodologies](https://github.com/jbraz95/UPNA-GTIO/blob/main/2025/teoria/gestion.md#tradicional)
