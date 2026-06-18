# Trivto Image Feed

Mobile-first TikTok-style image feed built with Next.js 15, Prisma, and SQLite. The app renders one image per viewport, loads additional pages with `IntersectionObserver`, persists likes on the backend, and includes graceful states for loading, empty, error, network, rate-limit, and image-failure cases.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- SQLite
- Vitest

## Prerequisites

- Node.js 20+ recommended
- npm

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

4. Apply the existing Prisma migration and create the local SQLite database:

```bash
npx prisma migrate deploy
```

This creates `prisma/dev.db` if it does not already exist.

## Running Locally

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

Useful checks:

```bash
npm test
npm run lint
npm run build
```

## Setup Notes

- `.env.example` defines `DATABASE_URL="file:./dev.db"`, which resolves to `prisma/dev.db` for this project.
- The app talks to Lorem Picsum only from the backend service layer.
- Likes are stored in SQLite and survive refreshes.
- No additional API keys or third-party credentials are required.

## Troubleshooting

If Prisma complains about a missing client:

```bash
npx prisma generate
```

If the database file or table is missing:

```bash
npx prisma migrate deploy
```

If you want to inspect the local database in a browser:

```bash
npx prisma studio
```

## Architecture Overview

The project is a single Next.js application with clear internal layers:

1. UI layer
   `src/components/feed/*` renders the vertical feed, card UI, like controls, and state components.
2. Client behavior layer
   `src/hooks/*` manages infinite scroll, likes, and image preloading.
3. API layer
   `src/app/api/feed/route.ts` and `src/app/api/likes/route.ts` expose internal endpoints for the frontend.
4. Server service layer
   `src/services/server/*` contains Picsum integration, route-facing services, and business logic.
5. Persistence layer
   `src/database/*`, `src/lib/prisma.ts`, and `prisma/schema.prisma` handle SQLite-backed like persistence.

This shape keeps the frontend from calling the external provider directly and makes each responsibility easy to explain in an interview.

## API Explanation

### `GET /api/feed?page=1&limit=10`

Returns one normalized page of images.

Example response:

```json
{
  "images": [
    {
      "id": "7",
      "author": "Alejandro Escamilla",
      "width": 4728,
      "height": 3168,
      "url": "https://picsum.photos/id/7/4728/3168",
      "downloadUrl": "https://picsum.photos/id/7/4728/3168"
    }
  ],
  "page": 1,
  "hasMore": true
}
```

Notes:

- The route validates `page` and `limit`.
- The backend normalizes Picsum fields before returning them.
- `hasMore` is derived from the page size.

### `GET /api/likes`

Returns all liked image IDs currently stored in SQLite.

Example response:

```json
{
  "likedImageIds": ["12", "42"]
}
```

### `POST /api/likes`

Persists one like or unlike action.

Request:

```json
{
  "imageId": "12",
  "liked": true
}
```

Response:

```json
{
  "success": true,
  "imageId": "12",
  "liked": true
}
```

## Database Explanation

The database model is intentionally small:

```prisma
model Like {
  imageId   String   @id
  liked     Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Why this works:

- `imageId` is the stable identifier for each feed image.
- `liked` stores the latest truth value.
- `upsert` by `imageId` keeps writes simple and idempotent.
- SQLite keeps local setup minimal for a take-home project.

## Future Improvements

- Add automated end-to-end verification against a running browser session.
- Add virtualization if the feed grows large enough for DOM size to matter.
- Add analytics around image load failures and like retries.
- Add user accounts so likes become user-specific instead of app-wide.
- Add E2E browser tests for scroll, like, and double-tap flows.
- Add reduced-motion handling for the double-tap animation.

## Known Limitations

- Likes are global to the local database, not per authenticated user.
- The image provider is external, so rate limits and remote image failures are outside app control.
- Feed pagination is page-based and does not preserve a cross-session scroll position.
- The project uses `next lint`, which Next.js has marked as deprecated for future major versions.
