# Performance Improvements

## Overview

The feed now includes a small set of targeted optimizations around image delivery, request sharing, and rerender control. These changes are intentionally limited to places where the current architecture benefits, rather than adding broad caching or memoization everywhere.

## Image Preloading

Problem:

- The feed is swipe-like and sequential, so the next image can feel late if it only starts loading once the user reaches it.

Solution:

- The first visible card is marked as prioritized in `src/components/feed/feed-item.tsx`.
- `src/hooks/use-image-preload.ts` preloads the next two likely images after the current first card.

Tradeoff:

- This improves the immediate next-scroll experience, but it does use some extra bandwidth and memory.
- To avoid overfetching, only the first card and the next couple of likely cards are preloaded.

## Memoization Where Justified

Problem:

- Liking one image causes the parent feed component to rerender, which can cascade through every card if the row components are not stable.

Solution:

- `src/components/feed/feed-item.tsx` is wrapped in `React.memo`.
- `src/components/feed/like-button.tsx` is wrapped in `React.memo`.
- `src/components/feed/image-feed.tsx` now passes a stable `handleToggleLike` callback instead of creating a new inline handler per render.

Tradeoff:

- Memoization adds comparison overhead and slightly increases component complexity.
- It is used only on repeated feed rows and the like button, where prop stability clearly reduces unnecessary rerenders.

## Request Deduplication

Problem:

- Repeated callers can ask for the same feed page or likes payload while an identical request is already in flight, wasting network work and producing avoidable duplicate parsing.

Solution:

- `src/services/api/feed-client.ts` shares in-flight promises for identical feed page requests when those requests are not caller-abortable.
- `src/services/api/likes-client.ts` shares in-flight promises for likes bootstrap and identical like writes.
- The existing hook-level in-flight guards still protect the UI layer from starting duplicate work in the first place.

Tradeoff:

- Shared requests must be scoped carefully so they do not break abort behavior.
- For that reason, only non-signaled requests are deduplicated in the API client layer; signaled requests still run independently.

## Reduced Re-renders

Problem:

- The feed parent rerenders whenever pagination or like state changes, and without stable row boundaries that can cause all visible cards to rerender.

Solution:

- Card props are kept primitive and stable where possible.
- The feed item and like button are memoized.
- The toggle callback is stabilized so unchanged cards keep the same props across renders.

Tradeoff:

- This does not eliminate parent rerenders, and that is fine.
- The goal is narrower: keep unchanged cards from re-rendering when only one item’s like state or the loading footer changes.
