/**
 * Shared feed-related types used by API routes, services, and UI code.
 * This file exists to define the provider-agnostic image feed contract used across backend and frontend layers.
 * It interacts with mapper functions, server services, and future API route responses.
 */
export interface FeedImage {
  readonly id: string;
  readonly author: string;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly downloadUrl: string;
}

export interface FeedResponse {
  readonly images: readonly FeedImage[];
  readonly page: number;
  readonly hasMore: boolean;
}
