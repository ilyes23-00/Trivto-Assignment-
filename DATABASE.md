# Database Architecture

## Overview

The database layer is intentionally small and focused. It exists only to persist image likes through Prisma and SQLite without leaking database details into API routes or UI components.

The layer is split into four parts:

1. `prisma/schema.prisma`
   Defines the `Like` model and the SQLite datasource.
2. `src/lib/prisma.ts`
   Provides the shared Prisma client singleton.
3. `src/database/helpers/`
   Centralizes Prisma query shapes and mapping helpers.
4. `src/database/repositories/`
   Exposes the repository API that higher server-side layers should call.

## Why This Structure Was Chosen

- It keeps Prisma-specific code out of route handlers.
- It makes database access easier to test and explain.
- It creates one clear place for query intent and one clear place for persistence operations.
- It keeps the UI and future API layers independent from low-level database details.

## Prisma Schema

The database model is:

- `Like`
  - `imageId`
  - `liked`
  - `createdAt`
  - `updatedAt`

### Why this model exists

- `imageId` is the stable identifier for one feed image.
- `liked` stores the latest like state.
- `createdAt` shows when the record first appeared.
- `updatedAt` shows when the like state last changed.

This supports refresh persistence with minimal schema complexity.

## Prisma Client Setup

`src/lib/prisma.ts` owns client creation.

### Why it exists

- App Router code can otherwise create too many Prisma clients in development.
- A shared getter keeps repository code simple.
- It gives the rest of the server layer one safe access point.

## Helper Layer

`src/database/helpers/like-query-helpers.ts` contains:

- `buildFindLikedImageIdsQuery`
- `buildUpsertLikeQuery`
- `mapLikeRecordsToImageIds`

### Why helpers exist

- They make query intent explicit.
- They keep repository methods short.
- They make query shape tests straightforward.

## Repository Layer

`src/database/repositories/like-repository.ts` contains:

- `createLikeRepository`
- `getLikeRepository`
- `getLikedImageIds`
- `saveLike`

### Why the repository exists

- It isolates Prisma calls from higher layers.
- It gives future services one small persistence API.
- It makes later API route work simpler and more interview-friendly.

## Query Design

### Read query

The read query loads only image identifiers where `liked = true`, ordered by `updatedAt DESC`.

Why:

- The frontend eventually needs only the liked ids for bootstrap.
- Loading fewer columns keeps the query focused.
- Ordering by most recent update gives stable, explainable behavior.

### Write query

The write query uses `upsert` by `imageId`.

Why:

- It avoids a separate existence check.
- It keeps the persistence path idempotent.
- It works equally well for first-time likes and later toggles.

## Boundaries

This layer does not:

- build API routes
- call external services
- contain UI code
- depend on localStorage

That separation is intentional so the database logic stays reusable and easy to defend in an interview.
