/**
 * Backend integration service for the Lorem Picsum image provider.
 * This file exists to fetch paginated image data, validate provider responses, and return normalized feed data.
 * It interacts with src/mappers/picsum-feed-mapper.ts, src/types/picsum.ts, and src/types/feed.ts.
 */
import { buildFeedResponse } from "../../mappers/picsum-feed-mapper";
import type { FeedResponse } from "../../types/feed";
import type {
  FetchPicsumFeedPageOptions,
  ImageProviderErrorCode,
  PicsumImageApiItem,
} from "../../types/picsum";

const PICSUM_BASE_URL = "https://picsum.photos/v2/list";

/**
 * Error type raised when the image provider request or payload is invalid.
 */
export class ImageProviderError extends Error {
  readonly code: ImageProviderErrorCode;
  readonly status?: number;

  /**
   * Creates a typed image provider error that higher server layers can handle safely.
   */
  constructor(
    code: ImageProviderErrorCode,
    message: string,
    options?: Readonly<{ status?: number }>,
  ) {
    super(message);
    this.name = "ImageProviderError";
    this.code = code;
    this.status = options?.status;
  }
}

/**
 * Builds the Picsum request URL for one page of images.
 */
export function buildPicsumFeedUrl(page: number, limit: number): string {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return `${PICSUM_BASE_URL}?${searchParams.toString()}`;
}

/**
 * Validates that the provider payload is an array of image records.
 */
export function assertPicsumPayload(
  payload: unknown,
): asserts payload is PicsumImageApiItem[] {
  if (!Array.isArray(payload)) {
    throw new ImageProviderError(
      "IMAGE_PROVIDER_INVALID_RESPONSE",
      "Lorem Picsum returned an invalid payload.",
    );
  }
}

/**
 * Fetches one paginated page of images from Lorem Picsum and returns the internal feed shape.
 */
export async function fetchPicsumFeedPage(
  options: FetchPicsumFeedPageOptions,
): Promise<FeedResponse> {
  const fetcher = options.fetcher ?? fetch;
  const requestUrl = buildPicsumFeedUrl(options.page, options.limit);
  const response = await fetcher(requestUrl, { cache: "no-store" });

  if (!response.ok) {
    throw new ImageProviderError(
      "IMAGE_PROVIDER_REQUEST_FAILED",
      `Lorem Picsum request failed with status ${response.status}.`,
      { status: response.status },
    );
  }

  const payload: unknown = await response.json();
  assertPicsumPayload(payload);

  return buildFeedResponse(payload, {
    page: options.page,
    limit: options.limit,
  });
}
