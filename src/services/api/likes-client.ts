/**
 * Frontend likes API client.
 * This file exists to read and persist liked image state through the internal backend route.
 * It interacts with src/app/api/likes/route.ts, src/hooks/use-likes.ts, and src/types/like.ts.
 */
import { inferRequestErrorKind } from "../../lib/utils";
import { AppRequestError, type ApiErrorResponse } from "../../types/api";
import type { LikesResponse, UpdateLikeRequest, UpdateLikeResponse } from "../../types/like";

let inFlightLikedImageIdsRequest: Promise<LikesResponse> | null = null;
const inFlightLikePersistenceRequests = new Map<string, Promise<UpdateLikeResponse>>();

export interface LikesClientRequestOptions {
  readonly signal?: AbortSignal;
  readonly fetcher?: typeof fetch;
}

function getErrorMessage(payload: unknown, fallbackMessage: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "object" &&
    payload.error !== null &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return fallbackMessage;
}

/**
 * Loads the liked image ids from the internal API route.
 */
async function executeFetchLikedImageIds(
  options: LikesClientRequestOptions = {},
): Promise<LikesResponse> {
  const fetcher = options.fetcher ?? fetch;
  let response: Response;

  try {
    response = await fetcher("/api/likes", {
      method: "GET",
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    throw new AppRequestError("Network connection lost while loading likes.", {
      kind: inferRequestErrorKind(undefined, error),
    });
  }

  if (!response.ok) {
    let payload: ApiErrorResponse | null = null;

    try {
      payload = (await response.json()) as ApiErrorResponse;
    } catch {
      // Keep the fallback message when the error payload is not JSON.
    }

    throw new AppRequestError(getErrorMessage(payload, "Unable to load likes."), {
      status: response.status,
      code: payload?.error.code,
      kind: inferRequestErrorKind(response.status),
    });
  }

  return (await response.json()) as LikesResponse;
}

/**
 * Loads the liked image ids from the internal API route.
 */
export async function fetchLikedImageIds(
  options: LikesClientRequestOptions = {},
): Promise<LikesResponse> {
  if (options.signal) {
    return executeFetchLikedImageIds(options);
  }

  if (inFlightLikedImageIdsRequest) {
    return inFlightLikedImageIdsRequest;
  }

  inFlightLikedImageIdsRequest = executeFetchLikedImageIds(options).finally(() => {
    inFlightLikedImageIdsRequest = null;
  });
  return inFlightLikedImageIdsRequest;
}

/**
 * Persists one image like state through the internal API route.
 */
async function executePersistLikeState(
  payload: UpdateLikeRequest,
  options: LikesClientRequestOptions = {},
): Promise<UpdateLikeResponse> {
  const fetcher = options.fetcher ?? fetch;
  let response: Response;

  try {
    response = await fetcher("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    throw new AppRequestError("Network connection lost while saving your like.", {
      kind: inferRequestErrorKind(undefined, error),
    });
  }

  if (!response.ok) {
    let errorPayload: ApiErrorResponse | null = null;

    try {
      errorPayload = (await response.json()) as ApiErrorResponse;
    } catch {
      // Keep the fallback message when the error payload is not JSON.
    }

    throw new AppRequestError(getErrorMessage(errorPayload, "Unable to update like."), {
      status: response.status,
      code: errorPayload?.error.code,
      kind: inferRequestErrorKind(response.status),
    });
  }

  return (await response.json()) as UpdateLikeResponse;
}

/**
 * Persists one image like state through the internal API route.
 */
export async function persistLikeState(
  payload: UpdateLikeRequest,
  options: LikesClientRequestOptions = {},
): Promise<UpdateLikeResponse> {
  if (options.signal) {
    return executePersistLikeState(payload, options);
  }

  const requestKey = `${payload.imageId}:${payload.liked}`;
  const existingRequest = inFlightLikePersistenceRequests.get(requestKey);

  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = executePersistLikeState(payload, options).finally(() => {
    inFlightLikePersistenceRequests.delete(requestKey);
  });
  inFlightLikePersistenceRequests.set(requestKey, requestPromise);
  return requestPromise;
}
