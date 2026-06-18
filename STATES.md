# Graceful States

## Overview

The feed now uses a shared state system so loading, empty, error, network, rate-limit, and image-failure experiences all render intentionally instead of falling back to generic failures.

## Reusable Components

- `src/components/feed/feed-state-frame.tsx`
  Full-screen shared layout for blocking page states.
- `src/components/feed/feed-inline-state.tsx`
  Inline shared notice for non-blocking follow-up request failures.
- `src/components/feed/image-load-failure-state.tsx`
  Card-level fallback when one remote image fails to load.

## Where Each State Appears

### Loading State

Appears in:

- `src/app/loading.tsx` for the initial route load
- `src/components/feed/feed-skeleton.tsx` during infinite-scroll page fetches

Why:

- The first screen needs a calm blocking state while the server is resolving the initial feed.
- Follow-up pagination should stay non-blocking, so only the next-card area shows loading.

### Empty State

Appears in:

- `src/components/feed/feed-empty-state.tsx`

Why:

- A successful request can still return zero images, which is different from a failure and should be explained clearly.

### Error State

Appears in:

- `src/components/feed/feed-error-state.tsx` with the `generic` variant

Why:

- Some failures are neither connectivity issues nor rate limits. A dedicated generic error state prevents misleading messaging.

### Network Failure State

Appears in:

- `src/components/feed/feed-error-state.tsx` for initial page failures
- `src/components/feed/feed-inline-state.tsx` for pagination or like requests after the page is already visible

Why:

- Network loss is recoverable and should be described differently from application or provider failures.

### Rate Limit State

Appears in:

- `src/components/feed/feed-error-state.tsx` when the initial feed request is rate-limited
- `src/components/feed/feed-inline-state.tsx` if a later API request returns `429`

Why:

- Rate limiting is a specific backend/provider constraint. Showing that separately makes the state more truthful and easier to reason about.

### Image Load Failure State

Appears in:

- `src/components/feed/image-load-failure-state.tsx` inside `src/components/feed/feed-item.tsx`

Why:

- A broken image URL should not collapse the entire card or the whole feed. The failure is isolated to that one image, so the state is isolated too.

## State Strategy

- Blocking states use `FeedStateFrame`.
- Non-blocking states use `FeedInlineState`.
- Asset-specific failure uses `ImageLoadFailureState`.

This keeps the UI consistent while still matching the scope of the problem:

- page-level for first load
- inline for later requests
- card-level for broken images
