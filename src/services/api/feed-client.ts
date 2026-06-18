/**
 * Frontend feed API client.
 * This file exists to load paginated feed data from the internal backend route without exposing external provider details to the UI layer.
 * It interacts with src/app/api/feed/route.ts, src/hooks/use-infinite-feed.ts, and src/types/feed.ts.
 */
import type { ApiErrorResponse } from "../../types/api";
import { AppRequestError } from "../../types/api";
import type { FeedResponse } from "../../types/feed";
import { inferRequestErrorKind } from "../../lib/utils";

const inFlightFeedRequests = new Map<string, Promise<FeedResponse>>();

export interface FetchFeedPageOptions {
  readonly page: number;
  readonly limit: number;
  readonly signal?: AbortSignal;
  readonly fetcher?: typeof fetch;
}

async function executeFeedPageRequest(
  options: FetchFeedPageOptions,
): Promise<FeedResponse> {
  const fetcher = options.fetcher ?? fetch;
  const searchParams = new URLSearchParams({
    page: String(options.page),
    limit: String(options.limit),
  });
  let response: Response;

  try {
    response = await fetcher(`/api/feed?${searchParams.toString()}`, {
      method: "GET",
      signal: options.signal,
      cache: "no-store",
    });
  } catch (error) {
    throw new AppRequestError("Network connection lost while loading the feed.", {
      kind: inferRequestErrorKind(undefined, error),
    });
  }

  if (!response.ok) {
    let message = "Unable to load feed.";
    let code: string | undefined;

    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload.error.message) {
        message = payload.error.message;
      }
      code = payload.error.code;
    } catch {
      // Keep the fallback message when the error payload is not JSON.
    }

    throw new AppRequestError(message, {
      code,
      status: response.status,
      kind: inferRequestErrorKind(response.status),
    });
  }

  return (await response.json()) as FeedResponse;
}

/**
 * Loads one page of feed images from the internal API route.
 */
export async function fetchFeedPage(
  options: FetchFeedPageOptions,
): Promise<FeedResponse> {
  if (options.signal) {
    return executeFeedPageRequest(options);
  }

  const requestKey = `${options.page}:${options.limit}`;
  const existingRequest = inFlightFeedRequests.get(requestKey);

  if (existingRequest) {
    return existingRequest;
  }

  const requestPromise = executeFeedPageRequest(options).finally(() => {
    inFlightFeedRequests.delete(requestKey);
  });
  inFlightFeedRequests.set(requestKey, requestPromise);
  return requestPromise;
}
