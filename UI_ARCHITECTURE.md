# UI Architecture

## Overview

This phase implements only the feed rendering layer. The UI is intentionally focused on:

- mobile-first layout
- one image per viewport
- full-screen imagery
- vertical scroll snap
- clean, readable component boundaries

Infinite scrolling and likes are intentionally excluded from this phase.

## Rendering Flow

1. `src/app/page.tsx`
   Loads the first page of feed images on the server.
2. `src/components/feed/image-feed.tsx`
   Receives the image list and renders the overall vertical feed shell.
3. `src/components/feed/feed-item.tsx`
   Renders each image as one full-screen card.
4. `src/components/feed/feed-empty-state.tsx`
   Renders when the list is empty.
5. `src/components/feed/feed-error-state.tsx`
   Renders when the first page cannot be loaded.

## Why Server-Side First-Page Rendering

For this UI-only phase, server-side loading is the simplest clean approach because:

- it avoids adding client-side pagination behavior early
- it keeps the feed rendering easy to explain
- it still respects the backend-owned integration rule

The page loads one backend-fed list and passes normalized images to presentational components.

## Component Responsibilities

### `page.tsx`

- loads the first image page
- chooses between success and error rendering
- keeps data loading out of the visual components

### `image-feed.tsx`

- renders the top-level feed container
- handles the empty state
- applies snap scrolling to the list

### `feed-item.tsx`

- renders a single image
- ensures one image fills one viewport
- shows lightweight metadata overlay

### `feed-empty-state.tsx`

- provides a clear full-screen empty fallback

### `feed-error-state.tsx`

- provides a clean full-screen failure fallback

### `feed-skeleton.tsx`

- provides a visual loading shape for future loading integrations

## Layout Decisions

### One image per viewport

Each feed item uses `min-h-dvh` and `snap-start` so every card occupies one screen height and aligns naturally during scrolling.

### Full-screen image

Each image is absolutely positioned to fill the card and uses `object-cover` to preserve the immersive vertical feed feel.

### Scroll snap

The feed list uses:

- `snap-y`
- `snap-mandatory`
- `overflow-y-auto`

This creates the TikTok-style vertical movement without implementing infinite loading yet.

### Mobile-first styling

The spacing, overlay, and typography are designed for narrow screens first. Desktop also works, but the composition is optimized for handheld browsing.

## Boundaries

This UI phase does not:

- implement infinite scrolling
- implement like UI
- implement optimistic state
- add route business logic

Those behaviors belong to later phases.
