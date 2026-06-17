# PROJECT RULES

## Core Principles

Follow SOLID principles.

Follow clean architecture principles.

Prefer composition over inheritance.

Keep components small and focused.

Keep files single responsibility.

Do not create abstractions until needed.

Avoid premature optimization.

Code must be understandable by another developer within minutes.

## Project Structure Rules

Separate:

* components
* hooks
* services
* api
* types
* lib
* database

Never mix responsibilities.

UI components must not contain database logic.

API routes must not contain UI logic.

Database access must be isolated.

## TypeScript Rules

No any types.

Use explicit interfaces.

Use strict typing.

Prefer readonly when possible.

Avoid type assertions unless necessary.

## React Rules

Prefer functional components.

Prefer server components where possible.

Use client components only when required.

Keep state local when possible.

Avoid prop drilling.

Avoid unnecessary useEffect.

Memoize only when there is a measurable reason.

## API Rules

Validate all inputs.

Handle all error cases.

Return consistent response structures.

Never expose internal errors.

Log server errors.

Use meaningful status codes.

## Database Rules

Use Prisma.

Keep queries simple.

Avoid duplicated queries.

Add comments for complex queries.

Never perform database access directly from UI.

## Error Handling Rules

Every async operation must handle errors.

Every page must have:

* loading state
* error state
* empty state

Never silently fail.

Display meaningful user feedback.

## Documentation Rules

Every exported function must have JSDoc.

Every component must have a file comment.

Every API route must have a file comment.

Every custom hook must have a file comment.

Every service must have a file comment.

## Naming Rules

Use descriptive names.

Avoid abbreviations.

Bad:
img
btn
data

Good:
imageItem
likeButton
feedResponse

## Performance Rules

Use IntersectionObserver.

Avoid unnecessary renders.

Avoid duplicate requests.

Lazy load when possible.

Preload upcoming images.

Keep DOM size reasonable.

## Git Rules

Small commits.

One logical change per commit.

Write meaningful commit messages.

Examples:

feat: add feed pagination

feat: implement like persistence

fix: prevent duplicate page fetches

refactor: extract feed service

## AI Usage Rules

AI suggestions are never accepted blindly.

Review all generated code.

Verify all generated logic.

Rewrite unclear code.

Prefer understandable code over clever code.

Human is responsible for final implementation.

## Assignment Goal

Optimize for:

1. User experience
2. Reliability
3. Simplicity
4. Interview explainability
5. Maintainability

Not for maximum feature count.