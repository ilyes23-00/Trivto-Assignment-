# Infinite Scroll Design

## Overview

The feed uses `IntersectionObserver` to watch a sentinel element placed after the rendered images inside the scroll container. When that sentinel approaches the visible area, the client requests the next backend page and appends the new images.

## Why `IntersectionObserver` Was Chosen

- It is purpose-built for visibility detection, which is exactly what infinite scrolling needs.
- It avoids high-frequency work on every scroll frame.
- It lets the browser optimize when intersection checks happen.
- It supports early prefetching through `rootMargin`, so the next page can load before the user reaches the end.
- It works cleanly with a dedicated scroll container by setting the observer `root`.

## Why Scroll Listeners Were Rejected

- Scroll listeners fire continuously and require manual throttling or debouncing to stay efficient.
- They push viewport math and edge detection into application code, which is easier to get wrong.
- They create more opportunities for duplicate fetches during fast scrolling.
- They are a worse fit for this requirement because the assignment explicitly asked for `IntersectionObserver`.

## Implementation Notes

### Early Loading

The observer uses the feed scroll container as its `root` and a positive bottom `rootMargin`. That causes the next page request to start before the sentinel fully enters view.

### Preventing Duplicate Requests

The hook keeps an in-flight flag in a ref and exits early when a request is already running. This prevents repeated observer callbacks from starting the same page load more than once.

### Loading States

- `isLoadingMore` shows a loading skeleton while the next page is being fetched.
- `loadMoreError` renders a lightweight inline error message when pagination fails.
- The initial page continues to be server-rendered, so infinite scrolling only manages follow-up pages.

### Handling Race Conditions

- Each pagination request gets a monotonically increasing request id.
- Responses are ignored if they are stale relative to the latest request id.
- The active request is aborted on unmount so late responses cannot update a removed component.
- Appended images are deduplicated by `id` as a final guard against repeated page data.
