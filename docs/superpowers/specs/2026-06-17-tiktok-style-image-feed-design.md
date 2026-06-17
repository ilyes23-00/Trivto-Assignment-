# TikTok Style Image Feed Design

**Goal**

Build a mobile-first vertical image feed that behaves like a TikTok-style viewer while keeping the implementation simple, production-ready, and easy to explain in a live interview.

**Problem Statement**

The assignment requires a full-screen vertical image feed with one image per viewport, scroll snapping, infinite scrolling, a backend proxy to Lorem Picsum, and persistent likes stored in SQLite through Prisma. The frontend must never call Picsum directly or use localStorage as the primary persistence layer.

**Primary Design Priorities**

1. Correctness
2. Readability
3. Maintainability
4. Interview explainability
5. Production-safe architecture

## Recommended Approach

Use a single Next.js 15 App Router application with clear internal boundaries:

1. UI components for rendering the feed
2. Client hooks for feed and likes state
3. API routes owned by the application
4. Server-side services for Picsum and Prisma access
5. Prisma + SQLite for persistence

This approach is recommended because it keeps deployment and explanation simple while still respecting clean architecture. It avoids the unnecessary complexity of a separate backend service while preserving strict boundaries between UI, HTTP handling, and database access.

## Alternatives Considered

### Option 1: Single Next.js app with clean internal layers

**Recommendation**

This is the chosen design.

**Pros**

- Simple project setup
- Meets all assignment requirements
- Easy to explain during an interview
- Keeps backend ownership inside our app
- Avoids exposing API keys or direct external calls

**Cons**

- Backend and frontend live in one repo, so boundaries must be enforced by folder structure and discipline

### Option 2: Single Next.js app with route logic inlined

**Pros**

- Fastest to build initially

**Cons**

- Harder to test
- Harder to explain
- Mixes transport logic with business logic
- Becomes messy as features grow

This option is rejected because it would make the assignment less maintainable and less interview-friendly.

### Option 3: Separate frontend and backend applications

**Pros**

- Strong separation of concerns
- Closer to some large-scale production systems

**Cons**

- Overengineered for the assignment
- More setup and coordination overhead
- Harder to finish quickly with high polish

This option is rejected because it adds complexity without improving the interview story for this take-home.

## Architecture Plan

The application will be organized into five layers.

### 1. UI Layer

Responsible for rendering the mobile-first full-screen feed, loading state, empty state, error state, and like interactions.

Rules:

- Prefer server components by default
- Use client components only where interaction is needed
- Keep components focused on rendering and user interaction
- Do not perform database or external API work directly in UI code

### 2. Client Data Layer

Responsible for calling internal API routes and managing local UI state for pagination and likes.

Responsibilities:

- Fetch feed pages from `/api/feed`
- Fetch liked image IDs from `/api/likes`
- Persist like changes through `POST /api/likes`
- Coordinate loading, optimistic updates, and retries

### 3. API Layer

Responsible for validating input, calling server services, and returning consistent JSON responses.

Endpoints:

- `GET /api/feed?page=1&limit=10`
- `GET /api/likes`
- `POST /api/likes`

Rules:

- Validate all inputs
- Return safe errors
- Never expose raw exceptions
- Keep routes thin

### 4. Service Layer

Responsible for backend business logic.

Services:

- `picsum-service` fetches and normalizes external image data
- `likes-service` reads and writes like state through Prisma

This layer exists to keep API routes short and testable.

### 5. Database Layer

Responsible for Prisma configuration and SQLite persistence.

Responsibilities:

- Define schema
- Expose a safe Prisma client singleton
- Store like records

## Folder Structure

```text
src/
  app/
    api/
      feed/
        route.ts
      likes/
        route.ts
    globals.css
    layout.tsx
    page.tsx

  components/
    feed/
      feed-empty-state.tsx
      feed-error-state.tsx
      feed-item.tsx
      feed-skeleton.tsx
      image-feed.tsx
      like-button.tsx

  hooks/
    use-feed.ts
    use-infinite-feed.ts
    use-like-image.ts

  services/
    api/
      feed-client.ts
      likes-client.ts
    server/
      likes-service.ts
      picsum-service.ts

  lib/
    constants.ts
    prisma.ts
    utils.ts

  types/
    api.ts
    feed.ts
    like.ts

prisma/
  schema.prisma

docs/
  AI_WORKFLOW.md
  INTERVIEW_NOTES.md
```

## File Responsibilities

### `src/app/page.tsx`

Entry page that renders the feed screen. It should stay lightweight and delegate interactive behavior to feed components.

### `src/app/api/feed/route.ts`

Owns the feed endpoint. Validates pagination input and returns normalized images from the server service.

### `src/app/api/likes/route.ts`

Owns reading and updating liked image IDs.

### `src/components/feed/image-feed.tsx`

Owns the main vertical scrolling feed container and coordinates feed items, sentinel rendering, and UI states.

### `src/components/feed/feed-item.tsx`

Owns rendering one full-screen image viewport.

### `src/components/feed/like-button.tsx`

Owns like interaction UI and animation state.

### `src/hooks/use-infinite-feed.ts`

Owns paginated fetching, page tracking, append behavior, and `hasMore`.

### `src/hooks/use-like-image.ts`

Owns liked image state, optimistic updates, and persistence calls.

### `src/services/server/picsum-service.ts`

Owns external HTTP calls to Lorem Picsum and normalizes the response for internal use.

### `src/services/server/likes-service.ts`

Owns Prisma reads and writes for likes.

### `src/lib/prisma.ts`

Owns the Prisma singleton setup for App Router server usage.

## Data Flow Diagram

```text
Initial page load
  -> page.tsx renders feed shell
  -> client feed hook requests GET /api/feed?page=1&limit=10
  -> API route validates query params
  -> picsum-service fetches data from Lorem Picsum
  -> service normalizes response
  -> API route returns { images, page, hasMore }
  -> UI renders one image per viewport

Likes bootstrap
  -> client like hook requests GET /api/likes
  -> likes API route calls likes-service
  -> likes-service queries Prisma and SQLite
  -> API returns likedImageIds
  -> UI marks liked images

Infinite scrolling
  -> user scrolls to near end of rendered feed
  -> IntersectionObserver detects sentinel visibility
  -> next page fetch starts if hasMore is true and request is not already in flight
  -> new images append to existing list

Like interaction
  -> user taps like button or double taps image
  -> local optimistic state updates immediately
  -> POST /api/likes sends { imageId, liked }
  -> likes-service upserts SQLite row
  -> failure rolls back optimistic state and shows retry feedback
```

## API Contract

### `GET /api/feed?page=1&limit=10`

**Purpose**

Return a normalized page of images for the vertical feed.

**Query Parameters**

- `page`: positive integer
- `limit`: positive integer with a capped maximum to prevent abuse

**Response**

```ts
{
  images: Array<{
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    downloadUrl: string;
  }>;
  page: number;
  hasMore: boolean;
}
```

**Notes**

- The frontend never talks to Picsum directly
- The backend normalizes the external response
- `hasMore` is computed based on whether the current page returned the requested number of items

### `GET /api/likes`

**Purpose**

Return the list of currently liked image IDs.

**Response**

```ts
{
  likedImageIds: string[];
}
```

### `POST /api/likes`

**Purpose**

Persist a like or unlike action for one image.

**Request Body**

```ts
{
  imageId: string;
  liked: boolean;
}
```

**Response**

```ts
{
  success: true;
  imageId: string;
  liked: boolean;
}
```

### Error Response Shape

All endpoints should return a consistent error structure:

```ts
{
  error: {
    code: string;
    message: string;
  };
}
```

## State Management Plan

State management will stay local to the feature and use React hooks instead of introducing a global state library.

### Feed State

Managed by `use-infinite-feed.ts`.

State includes:

- `images`
- `page`
- `hasMore`
- `isInitialLoading`
- `isFetchingMore`
- `error`

### Likes State

Managed by `use-like-image.ts`.

State includes:

- `likedImageIds`
- `isBootstrappingLikes`
- `pendingLikeIds`
- `mutationError`

### Why This Approach

- Keeps the architecture simple
- Easy to explain in an interview
- Avoids Redux or Zustand overhead for a small assignment
- Prevents prop drilling by colocating logic in feature hooks

## Database Plan

SQLite will be used through Prisma.

### Prisma Schema

```prisma
model Like {
  imageId   String   @id
  liked     Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Why This Schema

- Matches the assignment directly
- `imageId` is unique and stable
- Supports upsert for simple write logic
- Keeps history fields for debugging and interview discussion

### Query Strategy

- Read liked IDs by filtering rows where `liked` is `true`
- Upsert on `imageId` for both like and unlike actions

This keeps writes idempotent and easy to reason about.

## Pagination Strategy

Use page-based pagination with a fixed default page size.

### Proposed Default

- `page = 1`
- `limit = 10`

### Why Page-Based Pagination

- Matches the assignment requirement exactly
- Easy to test
- Easy to explain
- Supported naturally by Lorem Picsum

### Backend Rules

- Validate `page` and `limit`
- Clamp `limit` to a safe maximum such as `20`
- Return `hasMore` to simplify frontend logic

## Infinite Scroll Strategy

Use `IntersectionObserver` instead of scroll event listeners.

### Flow

1. Render current feed items
2. Render a sentinel near the end of the list
3. Observe the sentinel
4. Fetch the next page when the sentinel becomes visible
5. Ignore repeated triggers while a request is in flight
6. Stop observing when `hasMore` is false

### Why This Approach

- Lower overhead than scroll listeners
- Cleaner code
- Strong interview explanation
- Better fit for mobile-first feeds

### Scroll Snap Strategy

- Outer container uses vertical snap classes
- Each item occupies `100dvh`
- Each item uses `snap-start`

This provides the one-image-per-viewport experience required by the assignment.

## Performance Strategy

The assignment explicitly asks for performance-conscious behavior without unnecessary complexity.

### Planned Optimizations

- Use `IntersectionObserver` for pagination
- Prevent duplicate page fetches
- Keep only a reasonable rendered list size for the assignment scope
- Preload upcoming images with standard browser behavior and targeted image priorities
- Avoid unnecessary re-renders by keeping state focused and component props stable

### Deliberate Non-Goals

- No virtualization in the first implementation
- No complex caching layer
- No global state library

These are intentionally excluded to keep the solution understandable and proportional.

## Error Handling Strategy

Every async path should handle failure explicitly.

### Backend

- Validate all inputs
- Use `try/catch` around route handlers
- Log internal server errors
- Return meaningful status codes
- Return safe error messages

### Frontend

- Initial loading skeleton during first feed request
- Dedicated error screen if initial feed load fails
- Inline retry behavior if loading additional pages fails
- Empty state if the feed returns no images
- Optimistic like rollback if persistence fails

### Error Categories

- Invalid query parameters
- Invalid request body
- Upstream Picsum failure
- Database failure
- Unexpected internal server failure

## UI Plan

The UI should feel mobile-first and deliberate, not generic.

### Feed Experience

- One image fills one viewport
- Smooth vertical swipe behavior
- Scroll snapping between items
- Like button anchored for thumb reach on mobile
- Minimal metadata to keep the focus on the image

### Required States

- Loading skeleton
- Empty state
- Error state
- Normal feed state

### Stretch Goal

Add double tap to like with a lightweight animation. This should be implemented only after the core persistence and scrolling behavior are stable.

## Testing and Verification Plan

The assignment includes a clear behavioral checklist.

### Must Verify

- Scroll snapping works
- Pagination requests advance correctly
- Infinite loading triggers once per threshold crossing
- Likes persist after refresh
- Error state appears when backend fails
- Empty state appears when no images are returned
- Mobile viewport layout is correct
- Refresh preserves like state

### Practical Verification Approach

- Manual browser verification for interaction and layout
- Targeted API checks against local routes
- Prisma inspection for persisted likes

## Documentation Plan

### `README.md`

Will explain:

- project purpose
- setup steps
- Prisma commands
- how the architecture is organized
- key tradeoffs

### `AI_WORKFLOW.md`

Will include:

- tools used
- real prompts used
- where AI helped
- one incorrect AI suggestion
- how the mistake was detected
- how it was fixed
- where human judgment was required

This document will explicitly avoid claiming that AI wrote everything.

### `INTERVIEW_NOTES.md`

Will include:

- architecture explanation
- data flow explanation
- why Next.js
- why Prisma
- why SQLite
- why IntersectionObserver
- why the API proxy exists
- likely interview questions
- strong model answers

## Phase Plan

Implementation will be delivered in the assignment’s requested order.

### Phase 1

- Project setup
- Folder structure
- Prisma setup
- Database setup

### Phase 2

- Backend API routes

### Phase 3

- Feed UI

### Phase 4

- Infinite scrolling

### Phase 5

- Like persistence

### Phase 6

- Error handling

### Phase 7

- Performance improvements

### Phase 8

- README

### Phase 9

- AI_WORKFLOW

At the end of each phase, the implementation notes should explain:

- what was built
- why it was built
- alternative approaches
- tradeoffs

## Open Decisions Resolved

To remove ambiguity before implementation, this design makes the following explicit decisions:

- Use a single Next.js application, not separate frontend and backend apps
- Use local React hooks instead of a global state library
- Use page-based pagination with limit `10`
- Use `IntersectionObserver` instead of scroll listeners
- Use Prisma upsert for like writes
- Treat the double tap animation as a stretch goal, not a core requirement

## Design Summary

This design meets every required assignment constraint while staying intentionally simple. It separates responsibilities clearly, keeps the frontend isolated from the external image provider, persists likes correctly in SQLite, and uses mobile-friendly infinite scrolling with scroll snap behavior. The result should be strong both as working software and as a solution the candidate can confidently explain and modify live.
