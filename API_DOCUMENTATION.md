# API Documentation

## Overview

The backend API layer exposes three endpoints:

- `GET /api/feed`
- `GET /api/likes`
- `POST /api/likes`

Each route is intentionally thin. Validation and HTTP response shaping live in the route layer, while business logic lives in the service layer and persistence lives in the repository layer.

## Layer Responsibilities

### Route Layer

Files:

- `src/app/api/feed/route.ts`
- `src/app/api/likes/route.ts`

Responsibilities:

- parse requests
- validate inputs
- return proper HTTP status codes
- map service failures into safe JSON responses

### Service Layer

Files:

- `src/services/server/picsum-service.ts`
- `src/services/server/likes-service.ts`

Responsibilities:

- fetch and normalize image provider data
- coordinate like read and write behavior
- keep business logic out of route handlers

### Repository Layer

Files:

- `src/database/repositories/like-repository.ts`

Responsibilities:

- perform Prisma-backed database operations
- hide query details from API routes

## `GET /api/feed`

### Purpose

Returns one validated page of images from the backend-owned Lorem Picsum integration.

### Query Parameters

- `page`
  - positive integer
  - default: `1`
- `limit`
  - positive integer
  - default: `10`
  - maximum: `20`

### Success Response

Status:

- `200 OK`

Body:

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

### Validation Errors

Status:

- `400 Bad Request`

Examples:

```json
{
  "error": {
    "code": "INVALID_PAGE",
    "message": "Page must be a positive integer."
  }
}
```

```json
{
  "error": {
    "code": "INVALID_LIMIT",
    "message": "Limit must be a positive integer no greater than 20."
  }
}
```

### Upstream Provider Error

Status:

- usually `502` or the upstream provider status when available

Example:

```json
{
  "error": {
    "code": "IMAGE_PROVIDER_REQUEST_FAILED",
    "message": "Lorem Picsum request failed with status 503."
  }
}
```

## `GET /api/likes`

### Purpose

Returns all currently liked image identifiers from persistent storage.

### Success Response

Status:

- `200 OK`

Body:

```json
{
  "likedImageIds": ["12", "42"]
}
```

### Server Error

Status:

- `500 Internal Server Error`

Example:

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Unable to load likes."
  }
}
```

## `POST /api/likes`

### Purpose

Persists the latest liked state for one image through the likes service and repository layers.

### Request Body

```json
{
  "imageId": "12",
  "liked": true
}
```

### Success Response

Status:

- `200 OK`

Body:

```json
{
  "success": true,
  "imageId": "12",
  "liked": true
}
```

### Validation Errors

Status:

- `400 Bad Request`

Examples:

```json
{
  "error": {
    "code": "INVALID_JSON_BODY",
    "message": "Request body must be valid JSON."
  }
}
```

```json
{
  "error": {
    "code": "INVALID_IMAGE_ID",
    "message": "imageId is required."
  }
}
```

```json
{
  "error": {
    "code": "INVALID_LIKED_VALUE",
    "message": "liked must be a boolean."
  }
}
```

### Server Error

Status:

- `500 Internal Server Error`

Example:

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Unable to update like."
  }
}
```

## Why This Structure Was Chosen

- Route handlers stay readable and interview-friendly.
- Validation is explicit and easy to change.
- Service and repository layers are reusable and testable.
- The frontend depends only on internal APIs, never on Picsum or Prisma directly.
