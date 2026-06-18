# Like System Design

## Overview

The like system uses a client-side optimistic state layer backed by the internal `/api/likes` endpoints and SQLite persistence through Prisma. The first page bootstraps persisted likes on the server so refreshes render with the correct liked state immediately.

## Optimistic Updates

When a user taps the like button, the UI flips the local liked state immediately before waiting for the network response. This keeps the interaction fast and app-like instead of making the button feel blocked by backend latency.

The optimistic path is:

1. Read the current liked state for the image.
2. Compute the next liked state.
3. Update the local `Set` of liked image ids immediately.
4. Mark that image id as pending so repeated taps are ignored during the write.
5. Send `POST /api/likes` to persist the change.

## Rollback Logic

If the backend write fails, the hook restores the previous liked state for that image. That rollback uses the last known state from before the optimistic update, so the UI returns to a truthful state instead of leaving a failed like visible.

The rollback path is:

1. Capture whether the image was liked before the optimistic flip.
2. Try the backend write.
3. If the request fails, restore the original liked value.
4. Clear the image from the pending set.
5. Surface an inline error message so the user knows the write did not persist.

## Persistence Strategy

Persistence is handled in two layers:

- Server render bootstrap:
  `src/app/page.tsx` loads liked image ids from the likes service and passes them into the client feed. This makes refresh persistence immediate.
- Client API synchronization:
  `useLikes` revalidates with `GET /api/likes` and persists changes with `POST /api/likes`.

The backend persists likes in SQLite through Prisma using an upsert keyed by `imageId`, so the latest liked state survives refreshes and repeat writes.

## Loading Protection

- Each image id is added to a pending set while its write is in flight.
- Tapping a pending image does nothing until the current request finishes.
- This prevents duplicate writes and conflicting rapid toggles for the same image.

## Files

- `src/components/feed/like-button.tsx`
- `src/hooks/use-likes.ts`
- `src/services/api/likes-client.ts`
- `src/app/page.tsx`
