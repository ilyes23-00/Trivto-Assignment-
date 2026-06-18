# Interview Notes

## Architecture Walkthrough

The app is a single Next.js 15 App Router project with clear internal boundaries.

### 1. Page and Routing Layer

- `src/app/page.tsx`
- `src/app/loading.tsx`
- `src/app/api/feed/route.ts`
- `src/app/api/likes/route.ts`

What it does:

- server-renders the first feed page
- bootstraps liked image IDs
- exposes internal API routes for feed and likes

### 2. UI Layer

- `src/components/feed/*`

What it does:

- renders one image per viewport
- renders reusable graceful states
- renders the like button
- handles card-level image failure UI
- supports double tap to like

### 3. Client Behavior Layer

- `src/hooks/use-infinite-feed.ts`
- `src/hooks/use-likes.ts`
- `src/hooks/use-image-preload.ts`

What it does:

- manages pagination with `IntersectionObserver`
- applies optimistic likes with rollback
- lightly preloads the next likely images

### 4. Server Service Layer

- `src/services/server/picsum-service.ts`
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-service.ts`
- `src/services/server/likes-route-service.ts`

What it does:

- fetches Picsum data on the server only
- normalizes external payloads
- keeps route handlers thin
- coordinates like reads and writes

### 5. Persistence Layer

- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/database/helpers/*`
- `src/database/repositories/*`

What it does:

- persists likes in SQLite
- isolates Prisma access behind a small repository

## Likely Interview Questions

### Why did you choose a single Next.js app instead of separate frontend and backend services?

Answer:

For a take-home assignment, a single Next.js app gives the simplest deployment and setup while still allowing clean internal boundaries. I still kept the frontend, route layer, server services, and persistence separate, so the architecture remains explainable and maintainable without the extra complexity of two repos or two deploy targets.

### Why did you use `IntersectionObserver` instead of scroll listeners?

Answer:

The requirement explicitly asked for it, and it is the better fit here anyway. It lets the browser handle visibility detection efficiently and avoids high-frequency scroll math in application code. It also made it easy to trigger loading slightly before the user reached the end by using a positive bottom `rootMargin`.

### How are likes persisted?

Answer:

Likes are stored in SQLite through Prisma. The frontend talks only to `GET /api/likes` and `POST /api/likes`. On the backend, the repository upserts by `imageId`, so each image has one latest liked state that survives refreshes.

### How did you handle optimistic updates safely?

Answer:

The UI flips the like state immediately, marks that image as pending, sends the backend write, and rolls back if the request fails. While an image is pending, repeat taps on that image are ignored so conflicting writes do not pile up.

### How did you avoid unnecessary performance work?

Answer:

I only optimized repeated hot paths:

- memoized the feed row and like button
- stabilized the like callback
- deduplicated identical in-flight non-signaled requests
- preloaded only the first and next couple of likely images

I did not add virtualization or aggressive caching because the current scale does not justify it yet.

## Likely Follow-up Questions

### Why is the first page server-rendered but later pages client-loaded?

Answer:

It gives a faster and cleaner first paint while still allowing an interactive infinite scroll experience. The server can fetch the first page and liked IDs before hydration, then the client takes over for later pages and user interactions.

### Why not keep likes in localStorage?

Answer:

The assignment asked for backend persistence. Also, storing likes in SQLite gives a more production-like flow and makes refresh persistence independent of one browser storage mechanism.

### How do you handle remote image failures?

Answer:

Each card detects image load failures independently and swaps to a card-level fallback state. That keeps one broken remote asset from breaking the whole feed.

### Why does double tap only like and not unlike?

Answer:

That matches the common mobile pattern more closely and reduces accidental toggling. Unlike remains available through the explicit button, which is also the accessible control.

## Tradeoffs

- Single Next.js app
  Easier to build and explain, but weaker hard deployment boundaries than separate services.
- SQLite
  Great for local setup, but not the long-term choice for multi-user production scale.
- Optimistic likes
  Better UX, but requires rollback and pending-state protection.
- Lightweight preloading
  Helps the next swipe, but uses some extra bandwidth.
- No virtualization
  Simpler implementation, but may need revisiting if the feed becomes very large.

## Alternative Approaches

### Separate backend service

Pros:

- stronger separation of concerns
- independent scaling and deployment

Cons:

- unnecessary complexity for this assignment

### Cursor-based pagination

Pros:

- more flexible for large or mutable datasets

Cons:

- Picsum integration here is already page-based, so cursor logic would add complexity without much value

### State library for client interactions

Pros:

- could centralize feed and likes state

Cons:

- overkill for a project this size
- hooks are enough and easier to explain

### Virtualized list

Pros:

- reduced DOM size for very large feeds

Cons:

- more implementation complexity
- unnecessary at the current scale of one-screen cards and assignment scope
