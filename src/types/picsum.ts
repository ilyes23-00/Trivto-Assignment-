/**
 * Provider-specific types for the Lorem Picsum integration.
 * This file exists to isolate third-party response details from the rest of the application.
 * It interacts with src/mappers/picsum-feed-mapper.ts and src/services/server/picsum-service.ts.
 */
export interface PicsumImageApiItem {
  readonly id: string;
  readonly author: string;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly download_url: string;
}

export interface FetchPicsumFeedPageOptions {
  readonly page: number;
  readonly limit: number;
  readonly fetcher?: typeof fetch;
}

export type ImageProviderErrorCode =
  | "IMAGE_PROVIDER_REQUEST_FAILED"
  | "IMAGE_PROVIDER_INVALID_RESPONSE";
