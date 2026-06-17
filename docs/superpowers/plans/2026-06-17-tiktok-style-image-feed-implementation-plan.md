# TikTok Style Image Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first TikTok-style vertical image feed in Next.js 15 with a backend proxy to Lorem Picsum, infinite scrolling, and SQLite-backed like persistence through Prisma.

**Architecture:** Use a single Next.js App Router application with clear internal layers: UI components, client hooks, API routes, server-side services, and Prisma-backed persistence. Keep routes thin, move all external and database logic into services, and favor local state with focused hooks for interview-friendly explainability.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, SQLite, React hooks, IntersectionObserver

---

## File Map

### Create

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.gitignore`
- `.env`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/api/feed/route.ts`
- `src/app/api/likes/route.ts`
- `src/components/feed/image-feed.tsx`
- `src/components/feed/feed-item.tsx`
- `src/components/feed/like-button.tsx`
- `src/components/feed/feed-skeleton.tsx`
- `src/components/feed/feed-empty-state.tsx`
- `src/components/feed/feed-error-state.tsx`
- `src/hooks/use-infinite-feed.ts`
- `src/hooks/use-like-image.ts`
- `src/services/api/feed-client.ts`
- `src/services/api/likes-client.ts`
- `src/services/server/picsum-service.ts`
- `src/services/server/likes-service.ts`
- `src/lib/prisma.ts`
- `src/lib/constants.ts`
- `src/lib/utils.ts`
- `src/types/feed.ts`
- `src/types/like.ts`
- `src/types/api.ts`
- `prisma/schema.prisma`
- `README.md`
- `AI_WORKFLOW.md`
- `INTERVIEW_NOTES.md`

### Modify

- No existing application files are expected in the current workspace root

### Verify

- Browser walkthrough on mobile viewport
- API route checks with local HTTP requests
- Prisma migration + SQLite file inspection

## Task 1: Scaffold the Next.js Application

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Test: local dev server boot

- [ ] **Step 1: Generate the Next.js 15 TypeScript and Tailwind project**

Run:

```powershell
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Expected:

```text
Success! Created project at I:\Me\Job Position task\Trivto
```

- [ ] **Step 2: Verify the generated project files exist**

Run:

```powershell
Get-ChildItem
Get-ChildItem src\app
```

Expected:

```text
package.json
src
layout.tsx
page.tsx
globals.css
```

- [ ] **Step 3: Replace the default app shell with the feed entry page**

Planned `src/app/page.tsx`:

```tsx
/**
 * Root page for the vertical image feed experience.
 * Delegates all interactive feed behavior to the feed feature components.
 */
import { ImageFeed } from "@/components/feed/image-feed";

export default function HomePage(): JSX.Element {
  return <ImageFeed />;
}
```

- [ ] **Step 4: Simplify the root layout for the assignment**

Planned `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trivto Image Feed",
  description: "Mobile-first TikTok-style image feed assignment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Run the app to confirm the scaffold is healthy**

Run:

```powershell
npm run dev
```

Expected:

```text
Local: http://localhost:3000
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold nextjs app router project"
```

## Task 2: Add the Feature Folder Structure and Shared Types

**Files:**
- Create: `src/components/feed/*`, `src/hooks/*`, `src/services/api/*`, `src/services/server/*`, `src/lib/constants.ts`, `src/lib/utils.ts`, `src/types/feed.ts`, `src/types/like.ts`, `src/types/api.ts`
- Test: TypeScript check

- [ ] **Step 1: Create the feature folders**

Run:

```powershell
New-Item -ItemType Directory -Force src\components\feed,src\hooks,src\services\api,src\services\server,src\lib,src\types
```

Expected:

```text
Directory: ...\src\components\feed
Directory: ...\src\hooks
Directory: ...\src\services\api
```

- [ ] **Step 2: Define the shared feed and like contracts first**

Planned `src/types/feed.ts`:

```ts
/**
 * Shared feed-related types used by API routes, services, and UI code.
 */
export interface FeedImage {
  readonly id: string;
  readonly author: string;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly downloadUrl: string;
}

export interface FeedResponse {
  readonly images: readonly FeedImage[];
  readonly page: number;
  readonly hasMore: boolean;
}
```

Planned `src/types/like.ts`:

```ts
/**
 * Shared like-related types used by the persistence and UI layers.
 */
export interface LikesResponse {
  readonly likedImageIds: readonly string[];
}

export interface UpdateLikeRequest {
  readonly imageId: string;
  readonly liked: boolean;
}

export interface UpdateLikeResponse {
  readonly success: true;
  readonly imageId: string;
  readonly liked: boolean;
}
```

- [ ] **Step 3: Define the API error shape**

Planned `src/types/api.ts`:

```ts
/**
 * Shared API response types for predictable frontend and backend error handling.
 */
export interface ApiErrorResponse {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}
```

- [ ] **Step 4: Add shared constants**

Planned `src/lib/constants.ts`:

```ts
/**
 * Shared constants used across the feed feature to keep behavior centralized.
 */
export const DEFAULT_FEED_PAGE = 1;
export const DEFAULT_FEED_LIMIT = 10;
export const MAX_FEED_LIMIT = 20;
export const FEED_SENTINEL_ROOT_MARGIN = "200px";
```

- [ ] **Step 5: Run the type checker**

Run:

```powershell
npm run lint
```

Expected:

```text
No ESLint warnings or errors
```

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat: add feed feature structure and shared types"
```

## Task 3: Set Up Prisma and SQLite Persistence

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`, `.env`
- Test: Prisma migration and client generation

- [ ] **Step 1: Install Prisma dependencies**

Run:

```powershell
npm install prisma @prisma/client
npx prisma init --datasource-provider sqlite
```

Expected:

```text
Your Prisma schema was created at prisma/schema.prisma
```

- [ ] **Step 2: Define the `Like` model in Prisma**

Planned `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Like {
  imageId   String   @id
  liked     Boolean
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 3: Point Prisma to a local SQLite file**

Planned `.env`:

```dotenv
DATABASE_URL="file:./dev.db"
```

- [ ] **Step 4: Create a Prisma client singleton for server code**

Planned `src/lib/prisma.ts`:

```ts
/**
 * Prisma client singleton for server-side database access in App Router.
 */
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

export { prismaClient };
```

- [ ] **Step 5: Run the first migration**

Run:

```powershell
npx prisma migrate dev --name init_likes
```

Expected:

```text
SQLite database dev.db created
Migration applied successfully
```

- [ ] **Step 6: Commit**

```bash
git add prisma .env src/lib/prisma.ts
git commit -m "feat: add prisma sqlite like persistence"
```

## Task 4: Build the Server Services and API Routes

**Files:**
- Create: `src/services/server/picsum-service.ts`, `src/services/server/likes-service.ts`, `src/app/api/feed/route.ts`, `src/app/api/likes/route.ts`
- Test: API route requests

- [ ] **Step 1: Create the Picsum server service**

Planned `src/services/server/picsum-service.ts`:

```ts
/**
 * Server service for fetching and normalizing paginated image data from Lorem Picsum.
 */
import { DEFAULT_FEED_LIMIT } from "@/lib/constants";
import type { FeedImage, FeedResponse } from "@/types/feed";

interface PicsumImageResponse {
  readonly id: string;
  readonly author: string;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly download_url: string;
}

/**
 * Fetches one page of images from Lorem Picsum through the backend layer.
 */
export async function fetchFeedPage(
  page: number,
  limit: number = DEFAULT_FEED_LIMIT,
): Promise<FeedResponse> {
  const response = await fetch(
    `https://picsum.photos/v2/list?page=${page}&limit=${limit}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch images from Picsum.");
  }

  const items = (await response.json()) as PicsumImageResponse[];
  const images: FeedImage[] = items.map((item) => ({
    id: item.id,
    author: item.author,
    width: item.width,
    height: item.height,
    url: item.url,
    downloadUrl: item.download_url,
  }));

  return {
    images,
    page,
    hasMore: images.length === limit,
  };
}
```

- [ ] **Step 2: Create the likes server service**

Planned `src/services/server/likes-service.ts`:

```ts
/**
 * Server service for reading and writing persistent like state through Prisma.
 */
import { prismaClient } from "@/lib/prisma";

/**
 * Returns all image IDs that are currently liked.
 */
export async function getLikedImageIds(): Promise<readonly string[]> {
  // This query exists to bootstrap the frontend like state from the database.
  const records = await prismaClient.like.findMany({
    where: { liked: true },
    select: { imageId: true },
  });

  return records.map((record) => record.imageId);
}

/**
 * Persists the current liked state for one image.
 */
export async function updateImageLike(
  imageId: string,
  liked: boolean,
): Promise<void> {
  // This query exists to keep like writes idempotent for refresh persistence.
  await prismaClient.like.upsert({
    where: { imageId },
    create: { imageId, liked },
    update: { liked },
  });
}
```

- [ ] **Step 3: Implement the feed API route with validation**

Planned `src/app/api/feed/route.ts`:

```ts
/**
 * API route for returning a normalized paginated feed from the backend proxy.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_FEED_LIMIT,
  DEFAULT_FEED_PAGE,
  MAX_FEED_LIMIT,
} from "@/lib/constants";
import { fetchFeedPage } from "@/services/server/picsum-service";

/**
 * Returns one page of feed images through the backend proxy layer.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? DEFAULT_FEED_PAGE);
    const limit = Number(searchParams.get("limit") ?? DEFAULT_FEED_LIMIT);

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: { code: "INVALID_PAGE", message: "Page must be a positive integer." } },
        { status: 400 },
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_FEED_LIMIT) {
      return NextResponse.json(
        { error: { code: "INVALID_LIMIT", message: "Limit must be between 1 and 20." } },
        { status: 400 },
      );
    }

    const feedResponse = await fetchFeedPage(page, limit);
    return NextResponse.json(feedResponse);
  } catch (error) {
    console.error("Feed API error", error);

    return NextResponse.json(
      { error: { code: "FEED_FETCH_FAILED", message: "Unable to load feed." } },
      { status: 502 },
    );
  }
}
```

- [ ] **Step 4: Implement the likes API route**

Planned `src/app/api/likes/route.ts`:

```ts
/**
 * API route for reading and updating persistent liked image state.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getLikedImageIds,
  updateImageLike,
} from "@/services/server/likes-service";

/**
 * Returns all liked image IDs for frontend state bootstrap.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const likedImageIds = await getLikedImageIds();
    return NextResponse.json({ likedImageIds });
  } catch (error) {
    console.error("Likes GET API error", error);

    return NextResponse.json(
      { error: { code: "LIKES_READ_FAILED", message: "Unable to load likes." } },
      { status: 500 },
    );
  }
}

/**
 * Persists one image like or unlike action.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { imageId?: string; liked?: boolean };

    if (typeof body.imageId !== "string" || body.imageId.trim().length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_IMAGE_ID", message: "imageId is required." } },
        { status: 400 },
      );
    }

    if (typeof body.liked !== "boolean") {
      return NextResponse.json(
        { error: { code: "INVALID_LIKED_VALUE", message: "liked must be a boolean." } },
        { status: 400 },
      );
    }

    await updateImageLike(body.imageId, body.liked);
    return NextResponse.json({ success: true, imageId: body.imageId, liked: body.liked });
  } catch (error) {
    console.error("Likes POST API error", error);

    return NextResponse.json(
      { error: { code: "LIKES_WRITE_FAILED", message: "Unable to update like." } },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 5: Verify the API routes locally**

Run:

```powershell
Invoke-WebRequest http://localhost:3000/api/feed?page=1&limit=10
Invoke-WebRequest http://localhost:3000/api/likes
```

Expected:

```text
StatusCode: 200
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api src/services/server
git commit -m "feat: add feed and likes api routes"
```

## Task 5: Build the Frontend API Clients and Feed Hooks

**Files:**
- Create: `src/services/api/feed-client.ts`, `src/services/api/likes-client.ts`, `src/hooks/use-infinite-feed.ts`, `src/hooks/use-like-image.ts`
- Test: lint and focused interaction checks

- [ ] **Step 1: Create the frontend feed client**

Planned `src/services/api/feed-client.ts`:

```ts
/**
 * Frontend API client for requesting paginated feed data from the internal backend.
 */
import type { FeedResponse } from "@/types/feed";

/**
 * Fetches one page of images from the backend feed endpoint.
 */
export async function fetchFeed(page: number, limit: number): Promise<FeedResponse> {
  const response = await fetch(`/api/feed?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to load the feed.");
  }

  return (await response.json()) as FeedResponse;
}
```

- [ ] **Step 2: Create the frontend likes client**

Planned `src/services/api/likes-client.ts`:

```ts
/**
 * Frontend API client for reading and updating persistent like state.
 */
import type { LikesResponse, UpdateLikeRequest, UpdateLikeResponse } from "@/types/like";

/**
 * Fetches the current liked image IDs from the backend.
 */
export async function fetchLikes(): Promise<LikesResponse> {
  const response = await fetch("/api/likes");

  if (!response.ok) {
    throw new Error("Failed to load likes.");
  }

  return (await response.json()) as LikesResponse;
}

/**
 * Persists a like or unlike action through the backend.
 */
export async function saveLike(
  payload: UpdateLikeRequest,
): Promise<UpdateLikeResponse> {
  const response = await fetch("/api/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save like.");
  }

  return (await response.json()) as UpdateLikeResponse;
}
```

- [ ] **Step 3: Build the infinite feed hook**

Planned `src/hooks/use-infinite-feed.ts`:

```ts
"use client";

/**
 * Client hook for paginated feed loading and infinite scroll append behavior.
 */
import { useEffect, useState } from "react";
import { DEFAULT_FEED_LIMIT, DEFAULT_FEED_PAGE } from "@/lib/constants";
import { fetchFeed } from "@/services/api/feed-client";
import type { FeedImage } from "@/types/feed";

interface UseInfiniteFeedResult {
  readonly images: readonly FeedImage[];
  readonly hasMore: boolean;
  readonly isInitialLoading: boolean;
  readonly isFetchingMore: boolean;
  readonly errorMessage: string | null;
  readonly loadNextPage: () => Promise<void>;
  readonly retryInitialLoad: () => Promise<void>;
}
```

Implementation notes:

- bootstrap page 1 on mount
- separate initial loading and pagination loading
- append new images without replacing old ones
- guard against duplicate concurrent requests

- [ ] **Step 4: Build the like state hook**

Planned `src/hooks/use-like-image.ts`:

```ts
"use client";

/**
 * Client hook for bootstrapping, reading, and updating liked image state.
 */
import { useEffect, useState } from "react";
import { fetchLikes, saveLike } from "@/services/api/likes-client";

interface UseLikeImageResult {
  readonly likedImageIds: ReadonlySet<string>;
  readonly isLoadingLikes: boolean;
  readonly mutationError: string | null;
  readonly isImageLiked: (imageId: string) => boolean;
  readonly toggleLike: (imageId: string) => Promise<void>;
}
```

Implementation notes:

- bootstrap liked IDs from `/api/likes`
- use optimistic updates for responsiveness
- rollback if `POST /api/likes` fails

- [ ] **Step 5: Run lint after hook creation**

Run:

```powershell
npm run lint
```

Expected:

```text
No ESLint warnings or errors
```

- [ ] **Step 6: Commit**

```bash
git add src/services/api src/hooks
git commit -m "feat: add feed fetching and like hooks"
```

## Task 6: Build the Feed UI and Core Mobile Layout

**Files:**
- Create: `src/components/feed/image-feed.tsx`, `src/components/feed/feed-item.tsx`, `src/components/feed/like-button.tsx`, `src/components/feed/feed-skeleton.tsx`, `src/components/feed/feed-empty-state.tsx`, `src/components/feed/feed-error-state.tsx`, `src/app/globals.css`
- Test: browser rendering and mobile viewport behavior

- [ ] **Step 1: Build the loading, empty, and error state components**

Planned `src/components/feed/feed-skeleton.tsx`:

```tsx
/**
 * Loading skeleton displayed while the first feed page is loading.
 */
export function FeedSkeleton(): JSX.Element {
  return <div className="h-dvh animate-pulse bg-neutral-200" />;
}
```

Planned `src/components/feed/feed-empty-state.tsx`:

```tsx
/**
 * Empty state displayed when the backend returns no images for the feed.
 */
export function FeedEmptyState(): JSX.Element {
  return <div className="flex h-dvh items-center justify-center">No images found.</div>;
}
```

Planned `src/components/feed/feed-error-state.tsx`:

```tsx
/**
 * Error state displayed when the initial feed request fails.
 */
export function FeedErrorState({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>): JSX.Element {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4">
      <p>{message}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}
```

- [ ] **Step 2: Build the like button**

Planned `src/components/feed/like-button.tsx`:

```tsx
"use client";

/**
 * Thumb-friendly like button rendered on top of each feed item.
 */
interface LikeButtonProps {
  readonly isLiked: boolean;
  readonly onToggle: () => void;
}
```

Implementation notes:

- fixed placement near bottom-right on mobile
- clear visual difference between liked and unliked
- no heavy icon package if inline SVG is enough

- [ ] **Step 3: Build one full-screen feed item**

Planned `src/components/feed/feed-item.tsx`:

```tsx
"use client";

/**
 * One full-screen image viewport in the vertical feed.
 */
import Image from "next/image";
import type { FeedImage } from "@/types/feed";

interface FeedItemProps {
  readonly image: FeedImage;
  readonly isLiked: boolean;
  readonly onToggleLike: (imageId: string) => void;
}
```

Implementation notes:

- wrapper uses `h-dvh snap-start`
- image fills the screen with `object-cover`
- author can be shown in a small overlay for extra context

- [ ] **Step 4: Build the main feed container**

Planned `src/components/feed/image-feed.tsx`:

```tsx
"use client";

/**
 * Main client component that renders the vertical image feed and coordinates all feed states.
 */
import { useRef } from "react";
import { FeedEmptyState } from "./feed-empty-state";
import { FeedErrorState } from "./feed-error-state";
import { FeedItem } from "./feed-item";
import { FeedSkeleton } from "./feed-skeleton";
```

Implementation notes:

- use `use-infinite-feed`
- use `use-like-image`
- render states in this order: loading, error, empty, feed
- include sentinel element after the last item

- [ ] **Step 5: Add mobile-first global styles for snap scrolling**

Planned `src/app/globals.css` additions:

```css
html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  background: #000;
  color: #fff;
}
```

Component-level Tailwind classes should provide:

- `h-dvh`
- `overflow-y-scroll`
- `snap-y`
- `snap-mandatory`

- [ ] **Step 6: Verify the base UI in the browser**

Run:

```powershell
npm run dev
```

Check:

```text
The page loads
The first image fills the viewport
The feed container snaps vertically
```

- [ ] **Step 7: Commit**

```bash
git add src/components/feed src/app
git commit -m "feat: build vertical feed ui"
```

## Task 7: Add IntersectionObserver Infinite Scrolling and Image Preload Behavior

**Files:**
- Modify: `src/components/feed/image-feed.tsx`, `src/hooks/use-infinite-feed.ts`, `src/components/feed/feed-item.tsx`
- Test: multi-page feed loading

- [ ] **Step 1: Add sentinel observation to the feed container**

Implementation notes for `image-feed.tsx`:

- create a `sentinelRef`
- observe it with `IntersectionObserver`
- call `loadNextPage` when visible
- disconnect on cleanup

Target hook shape inside the component:

```tsx
useEffect(() => {
  const sentinel = sentinelRef.current;

  if (!sentinel || !hasMore || isFetchingMore) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        void loadNextPage();
      }
    },
    { root: scrollContainerRef.current, rootMargin: FEED_SENTINEL_ROOT_MARGIN },
  );

  observer.observe(sentinel);

  return () => observer.disconnect();
}, [hasMore, isFetchingMore, loadNextPage]);
```

- [ ] **Step 2: Harden the hook against duplicate page requests**

Implementation notes for `use-infinite-feed.ts`:

- track `isFetchingMore`
- return early if request already exists
- stop incrementing when `hasMore` is false

- [ ] **Step 3: Preload nearby images without overcomplicating memory**

Implementation notes for `feed-item.tsx`:

- use `priority` only for the first visible item if needed
- use standard browser lazy loading for later images
- do not preload every image in the list

- [ ] **Step 4: Verify multiple pages load in sequence**

Check:

```text
Scroll to the end of page 1
Page 2 loads once
No duplicate page fetches occur
Snap scrolling remains intact
```

- [ ] **Step 5: Commit**

```bash
git add src/components/feed src/hooks
git commit -m "feat: add infinite scroll with intersection observer"
```

## Task 8: Add Like Persistence, Retry UX, and Stretch Double-Tap Support

**Files:**
- Modify: `src/hooks/use-like-image.ts`, `src/components/feed/feed-item.tsx`, `src/components/feed/like-button.tsx`
- Test: refresh persistence and rollback behavior

- [ ] **Step 1: Finish optimistic like persistence**

Implementation notes:

- immediately update the local set
- call `saveLike`
- rollback local state if request fails
- keep retry messaging lightweight and understandable

- [ ] **Step 2: Add disabled state for in-flight like writes**

Implementation notes for `like-button.tsx`:

- prevent repeated taps while the same image is saving
- show a simple visual loading indicator if desired

- [ ] **Step 3: Add double tap to like as the stretch goal**

Implementation notes for `feed-item.tsx`:

- detect quick double tap on the image area
- only trigger like when the image is not already liked
- show a small heart pop animation with CSS transitions

- [ ] **Step 4: Verify persistence**

Check:

```text
Tap like
Refresh the page
The same image remains liked
Unlike the image
Refresh again
The image is no longer liked
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks src/components/feed
git commit -m "feat: persist likes and add double tap interaction"
```

## Task 9: Add Final Error Handling, README, and Interview Docs

**Files:**
- Create: `README.md`, `AI_WORKFLOW.md`, `INTERVIEW_NOTES.md`
- Modify: any files that still need clearer messages or comments
- Test: final verification walkthrough

- [ ] **Step 1: Audit exported functions for JSDoc and file comments**

Checklist:

```text
Every exported function has JSDoc
Every component file has a top-level comment
Every API route file has a top-level comment
Every hook file has a top-level comment
Every service file has a top-level comment
Every Prisma query has a comment explaining why it exists
```

- [ ] **Step 2: Tighten final error states**

Implementation notes:

- initial feed load uses full-screen error state
- pagination failure uses inline retry region at the bottom
- like failure shows actionable text without breaking the feed

- [ ] **Step 3: Write `README.md`**

Sections:

- project overview
- setup and install commands
- run and migrate commands
- architecture summary
- tradeoffs and known limitations

- [ ] **Step 4: Write `AI_WORKFLOW.md`**

Sections:

- tools used
- real prompts used
- what AI helped generate
- one incorrect AI suggestion
- how the mistake was detected
- how it was fixed
- where human judgment was required

Concrete example to include:

```text
An early AI suggestion used localStorage for like persistence.
That was rejected because the assignment explicitly requires SQLite and Prisma as the primary persistence layer.
The mistake was detected by checking the prompt against the generated idea.
The fix was to move persistence into POST /api/likes backed by Prisma.
```

- [ ] **Step 5: Write `INTERVIEW_NOTES.md`**

Sections:

- architecture explanation
- data flow explanation
- why Next.js
- why Prisma
- why SQLite
- why IntersectionObserver
- why the API proxy matters
- likely interview questions
- short strong answers

- [ ] **Step 6: Run the final verification checklist**

Run:

```powershell
npm run lint
npx prisma validate
```

Manual verification:

```text
Scroll snapping works
Pagination works
Infinite loading works
Like persistence works
Error state works
Empty state works
Mobile viewport works
Refresh persistence works
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "docs: add final project and interview documentation"
```

## Self-Review

### Spec Coverage

- Full screen vertical image feed: covered by Tasks 6 and 7
- One image per viewport: covered by Task 6
- Scroll snap behavior: covered by Tasks 6 and 7
- Infinite scrolling: covered by Task 7
- Real external image API: covered by Task 4
- Backend proxy layer: covered by Task 4
- Like functionality: covered by Tasks 5 and 8
- Like persistence after refresh: covered by Tasks 3, 4, and 8
- Loading state: covered by Task 6
- Empty state: covered by Task 6
- Error state: covered by Task 9
- Mobile first: covered by Task 6
- Backend owned by us: covered by Task 4
- No API keys exposed to frontend: satisfied by architecture; no key is required for Picsum
- Clean architecture: covered by Tasks 2 through 5
- Production quality: covered by all tasks, especially validation and docs in Tasks 4 and 9

### Placeholder Scan

- No `TODO`, `TBD`, or vague “handle later” notes remain
- All major files and commands are named explicitly

### Type Consistency

- `FeedResponse`, `LikesResponse`, and `UpdateLikeRequest` are defined once and reused
- Route names and service names are consistent with the design spec

## Execution Notes

- The current workspace was not initialized as a Git repository when this plan was written, so commit commands are included for execution time but were not run during planning.
- If `create-next-app` refuses to scaffold into the current directory because files already exist, move `rules.md` into a temporary backup location, scaffold the app, then restore `rules.md` before continuing.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-17-tiktok-style-image-feed-implementation-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
