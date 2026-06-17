# Architecture Plan

## 1. Architecture Overview

This assignment is best implemented as a **single Next.js 15 App Router application** with clear internal separation between UI, API, services, and database access.

The architecture is intentionally simple:

1. **Frontend UI layer**
   Renders the vertical full-screen feed, loading states, empty states, error states, and like interactions.

2. **Client state and data access layer**
   Manages feed pagination, infinite scroll state, and liked image state. This layer only talks to our internal API routes.

3. **Backend API layer**
   Next.js API routes own all HTTP access. They validate input, call server services, and return normalized responses.

4. **Server service layer**
   Encapsulates business logic:
   - one service for fetching and normalizing external image data from Lorem Picsum
   - one service for reading and writing likes through Prisma

5. **Persistence layer**
   Prisma + SQLite store likes so they persist after refresh and do not depend on localStorage.

### Why this architecture was chosen

- It fully satisfies the assignment requirement that the frontend must never call the external image provider directly.
- It keeps the solution production-like without overengineering.
- It is easy to explain in an interview because each layer has one clear responsibility.
- It keeps the backend “owned by us” even though the images come from an external provider.
- It minimizes setup complexity compared with separate frontend and backend projects.

### Why not split into separate apps

A separate frontend and backend would create stronger deployment boundaries, but for a take-home assignment it adds unnecessary complexity, more setup time, and a weaker speed-to-value story. A single Next.js app with clean internal boundaries is the best tradeoff here.

---

## 2. Folder Structure

Recommended structure:

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
      image-feed.tsx
      feed-item.tsx
      like-button.tsx
      feed-skeleton.tsx
      feed-empty-state.tsx
      feed-error-state.tsx

  hooks/
    use-infinite-feed.ts
    use-like-image.ts

  services/
    api/
      feed-client.ts
      likes-client.ts
    server/
      picsum-service.ts
      likes-service.ts

  lib/
    prisma.ts
    constants.ts
    utils.ts

  types/
    feed.ts
    like.ts
    api.ts

prisma/
  schema.prisma

public/

docs/
```

### Why this structure was chosen

- `app/` contains routing and page entry points because this is the App Router boundary.
- `app/api/` contains backend route handlers because these are the HTTP entry points.
- `components/feed/` keeps the feed feature grouped together instead of scattering UI files.
- `hooks/` isolates client-side behavior from presentation.
- `services/server/` isolates external API and database logic away from routes.
- `services/api/` isolates frontend fetch calls away from components.
- `lib/` stores shared infrastructure such as Prisma client initialization.
- `types/` centralizes contracts to keep frontend and backend aligned.

This structure follows the assignment’s clean architecture goal while staying small enough to understand quickly.

---

## 3. Database Design

The database only needs to persist image like state.

### Table / Model

**Like**

- `imageId`
- `liked`
- `createdAt`
- `updatedAt`

### Design decision

`imageId` should be unique, because each image only needs one persisted like record.

### Why this design was chosen

- It matches the assignment exactly.
- It keeps the schema minimal.
- It makes writes simple through upsert behavior.
- It supports persistence after refresh without introducing user accounts or session complexity.

### Why SQLite was chosen

- It is explicitly required.
- It is ideal for local take-home assignments because setup is minimal.
- It works well with Prisma.
- It keeps the demo easy to run for reviewers and interviewers.

### Why Prisma was chosen

- It provides type-safe database access.
- It reduces low-level SQL boilerplate.
- It makes the schema easier to explain and evolve.
- It gives a professional structure even in a small project.

---

## 4. API Design

The backend is the only layer allowed to talk to the external image provider and the database.

### Endpoint 1: `GET /api/feed?page=1&limit=10`

Purpose:

- Fetch one page of images from the backend proxy
- Normalize the response into our own feed contract

Response shape:

- `images`
- `page`
- `hasMore`

### Endpoint 2: `GET /api/likes`

Purpose:

- Return all currently liked image IDs

Response shape:

- `likedImageIds`

### Endpoint 3: `POST /api/likes`

Purpose:

- Persist a like or unlike event for one image

Request shape:

- `imageId`
- `liked`

Response shape:

- `success`
- `imageId`
- `liked`

### Why this API design was chosen

- It mirrors the assignment requirements exactly.
- It keeps frontend logic very simple.
- It avoids exposing external API details directly to the UI.
- It gives us a stable internal contract even if the external provider changes shape.

### Why normalize the external response

The frontend should depend on our contract, not on Picsum’s raw payload. That makes the app easier to maintain and easier to defend in an interview.

---

## 5. Data Flow Diagram

```text
User opens the app
  -> Next.js page renders the feed container
  -> client hook requests GET /api/feed?page=1&limit=10
  -> internal API route validates input
  -> server feed service requests data from Lorem Picsum
  -> service normalizes response
  -> API route returns feed payload
  -> UI renders one image per viewport

User scrolls down
  -> IntersectionObserver detects sentinel visibility
  -> client hook requests next page from /api/feed
  -> new images are appended to existing feed state

User likes an image
  -> UI updates local optimistic state
  -> client sends POST /api/likes
  -> likes API route validates payload
  -> likes service writes through Prisma to SQLite
  -> on refresh, GET /api/likes restores liked state
```

### Why this flow was chosen

- It keeps the frontend lightweight.
- It ensures the backend owns integration and persistence.
- It supports infinite scrolling cleanly.
- It keeps persistence real and server-backed.

---

## 6. Component Breakdown

### `page`

Responsibility:

- Render the feed feature entry point

Why:

- Keeps route-level code simple
- Makes the main page easy to explain

### `image-feed`

Responsibility:

- Orchestrate feed rendering
- Switch between loading, error, empty, and success states
- Coordinate infinite scrolling and like state hooks

Why:

- Central place for feature composition
- Keeps state orchestration out of leaf UI components

### `feed-item`

Responsibility:

- Render one full-screen image viewport
- Support one-image-per-screen behavior
- Handle image-level interactions like double tap

Why:

- Each feed item should be isolated and reusable
- Makes the viewport behavior easy to test and explain

### `like-button`

Responsibility:

- Show current liked state
- Trigger like toggle action

Why:

- Keeps interaction UI separate from layout
- Makes the button easier to change independently

### `feed-skeleton`

Responsibility:

- Render the loading experience for initial feed fetch

Why:

- Loading states deserve a dedicated component for clarity

### `feed-empty-state`

Responsibility:

- Render when the API returns no images

Why:

- Explicitly required by the assignment

### `feed-error-state`

Responsibility:

- Render when initial loading fails
- Offer retry behavior

Why:

- Prevents silent failure
- Improves user experience and interview credibility

---

## 7. State Management Plan

This project should use **local feature state with custom hooks**, not a global state library.

### Feed state

Managed by a dedicated feed hook.

State includes:

- current list of images
- current page
- `hasMore`
- initial loading state
- next-page loading state
- feed error state

### Like state

Managed by a dedicated like hook.

State includes:

- set of liked image IDs
- bootstrapping likes state
- pending like mutation state
- like mutation error state

### Why this approach was chosen

- The application is small and feature-focused.
- Redux or Zustand would add complexity without meaningful benefit.
- Local hooks keep the behavior close to the feed feature.
- This is easier to explain in an interview and easier to modify live.

### Why not localStorage as the primary source

The assignment explicitly requires SQLite + Prisma persistence. localStorage could only be a secondary enhancement at most, not the source of truth.

---

## 8. Infinite Scroll Strategy

Use **IntersectionObserver** with a sentinel element near the end of the list.

### Strategy

1. Render current feed items
2. Render a sentinel after the last visible item
3. Observe that sentinel
4. When it becomes visible, fetch the next page
5. Block duplicate requests while a fetch is in progress
6. Stop requesting when `hasMore` becomes false

### Why this strategy was chosen

- It is more efficient than scroll listeners.
- It is the most common production-ready approach for this kind of feed.
- It matches the assignment’s performance expectations.
- It is simple to explain and reason about.

### Why not use scroll events

Scroll listeners fire frequently, need more manual calculation, and are easier to get wrong on mobile. IntersectionObserver is cleaner and lower overhead.

### Scroll snap strategy

The scrolling container should use vertical snap behavior, and each feed item should occupy exactly one viewport height.

Why:

- It creates the TikTok-like one-item-per-screen experience
- It improves usability on mobile
- It maps directly to the assignment requirement

---

## 9. Performance Strategy

Performance should be handled with focused, practical decisions instead of premature optimization.

### Key strategies

- Use IntersectionObserver for pagination
- Keep one image per viewport
- Avoid duplicate page requests
- Avoid unnecessary re-renders by keeping props and state focused
- Preload only nearby upcoming images
- Use built-in browser and Next.js image loading behavior

### Why these strategies were chosen

- They provide strong improvement with low complexity.
- They are easy to justify in an interview.
- They directly support mobile-first behavior.

### What we are intentionally not doing

- No heavy global state management
- No virtualization in the first version
- No complex caching architecture

### Why those were not chosen

They would add complexity faster than they add value for this assignment. Simpler production-ready choices are better here.

---

## 10. Error Handling Strategy

Every async path should fail safely and visibly.

### Frontend error handling

- Show a full-screen loading state during initial fetch
- Show a full-screen error state if the first feed request fails
- Show an empty state if the feed returns no images
- Show a smaller retry area if pagination fails later
- Roll back optimistic likes if the save request fails

### Backend error handling

- Validate all input
- Return consistent error shapes
- Use appropriate status codes
- Log internal failures on the server
- Never expose raw exception details to the client

### Why this strategy was chosen

- It satisfies the assignment requirements directly.
- It creates a more professional user experience.
- It prevents silent failures.
- It gives a strong explanation of reliability choices in an interview.

---

## 11. Security Considerations

Even though this is a take-home assignment, security and boundary ownership still matter.

### Frontend must not call the external image API directly

Why:

- The assignment explicitly requires a backend proxy.
- It keeps integration logic on the server.
- It prevents the frontend from depending on a third-party contract directly.

### No secrets exposed to the frontend

Why:

- This is a baseline production rule.
- Even though Picsum does not require an API key, the architecture should still assume external integrations belong on the backend.

### Input validation on all API routes

Why:

- Prevents malformed or abusive requests
- Improves system stability
- Demonstrates backend ownership and production awareness

### Controlled response shapes

Why:

- Prevents leaking internal details
- Gives the frontend predictable error handling

### Database isolation

Why:

- UI components must never touch the database directly
- Prisma access should stay in the service layer

### Request limits

Why:

- Page and limit values should be validated and capped
- This avoids wasteful upstream requests and keeps the API behavior bounded

---

## 12. Interview Talking Points

### Why Next.js 15 App Router

- It gives a unified frontend and backend in one application
- It supports API routes naturally
- It reduces project setup overhead
- It is a strong practical fit for take-home delivery speed

### Why Prisma

- Type safety
- Good developer experience
- Simple schema management
- Easy to explain database access patterns

### Why SQLite

- Required by the assignment
- Lightweight and fast to set up
- Perfect for local demos and take-home projects

### Why a backend proxy

- Keeps the frontend decoupled from the external provider
- Gives us ownership over response shape, validation, and reliability
- Aligns with production API design principles

### Why IntersectionObserver

- Better performance than scroll listeners
- Cleaner infinite scroll implementation
- Easier to reason about on mobile

### Why local hooks instead of a state library

- The scope is small
- The logic is feature-local
- Simpler code is easier to explain under interview pressure

### Why scroll snap

- Required by the assignment
- Delivers the TikTok-like UX directly
- Keeps one image visible per viewport

### Likely interview questions

**Why did you choose a single Next.js app instead of separate frontend/backend services?**

Because the assignment benefits from a simpler setup while still allowing clean separation internally. I wanted production-like boundaries without overengineering.

**Why didn’t you store likes in localStorage?**

Because the assignment explicitly required persistence through SQLite and Prisma. localStorage would not satisfy backend-owned persistence.

**How does the frontend avoid talking to Picsum directly?**

All feed data is requested through `/api/feed`, and that route is the only place that calls Picsum.

**How would you scale this design later?**

I would keep the same contracts and split the server service layer into a standalone backend only if scale or team boundaries justified it. The current design keeps that path open without forcing it early.

**What tradeoff did you make intentionally?**

I chose simpler, well-bounded architecture over adding advanced caching or virtualization early. That keeps the solution easier to reason about and more interview-friendly.

---

## Final Recommendation

The strongest version of this assignment is a **cleanly layered single Next.js application** with:

- App Router pages for the UI
- API routes for backend ownership
- server services for Picsum and Prisma logic
- custom hooks for feed and likes state
- SQLite for real persistence
- IntersectionObserver for infinite scrolling
- scroll snap for TikTok-style UX

This design meets the requirements, stays readable, and gives you a strong story for both code quality and interview discussion.
