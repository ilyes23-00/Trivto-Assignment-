# Image Provider Integration

## Overview

The image provider layer is responsible for talking to Lorem Picsum from the backend only. Its job is to fetch paginated images, transform provider-specific fields into the internal feed format, and raise safe typed failures when the provider response is bad.

The layer is split into three parts:

1. `src/types/picsum.ts`
   Provider-specific request and response types.
2. `src/mappers/picsum-feed-mapper.ts`
   Transformation logic from Picsum payloads to internal feed models.
3. `src/services/server/picsum-service.ts`
   Backend-only fetch logic, pagination wiring, and failure handling.

## How Pagination Works

Lorem Picsum supports page-based pagination with query parameters:

- `page`
- `limit`

The service builds a request URL in this shape:

`https://picsum.photos/v2/list?page=<page>&limit=<limit>`

The service does not guess pagination on the frontend. Instead, the backend service accepts `page` and `limit`, calls Picsum, and returns the internal feed contract with:

- `images`
- `page`
- `hasMore`

`hasMore` is derived by comparing the number of returned images to the requested `limit`.

Why this works:

- if Picsum returns exactly `limit` items, there may be another page
- if it returns fewer than `limit`, pagination can stop

This keeps the pagination rule simple and easy to explain.

## How Transformation Works

Picsum returns provider-specific fields, including `download_url`.

The application uses a provider-agnostic internal format instead:

- `id`
- `author`
- `width`
- `height`
- `url`
- `downloadUrl`

The mapper layer is responsible for that conversion.

This separation exists so:

- the rest of the app does not depend on third-party naming
- future provider changes stay isolated
- the API layer can always return one stable contract

## How Failures Are Handled

The service handles two failure categories:

### 1. Request failure

If Picsum responds with a non-success HTTP status, the service throws `ImageProviderError` with:

- code: `IMAGE_PROVIDER_REQUEST_FAILED`
- message describing the failure
- status for server-side handling

### 2. Invalid response failure

If Picsum returns a payload that is not an array, the service throws `ImageProviderError` with:

- code: `IMAGE_PROVIDER_INVALID_RESPONSE`

This is important because a successful HTTP status does not guarantee a valid payload.

## Why The Frontend Never Talks To Picsum

The frontend should never call Lorem Picsum directly because:

- the assignment explicitly requires a backend proxy
- the backend should own external integration logic
- transformation and failure handling belong on the server
- the UI should depend on internal contracts, not third-party payloads

## Summary

This provider layer keeps the external API isolated behind:

- typed provider models
- a dedicated mapper layer
- a backend-only service

That makes the integration safer, easier to test, and easier to explain in an interview.
