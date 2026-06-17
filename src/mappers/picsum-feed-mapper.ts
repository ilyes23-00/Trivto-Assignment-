/**
 * Mapper functions for converting Lorem Picsum payloads into internal feed models.
 * This file exists to keep provider-specific field names out of the rest of the application.
 * It interacts with src/types/picsum.ts, src/types/feed.ts, and src/services/server/picsum-service.ts.
 */
import type { FeedImage, FeedResponse } from "../types/feed";
import type { PicsumImageApiItem } from "../types/picsum";

/**
 * Transforms one Picsum image payload into the internal feed image format.
 */
export function mapPicsumImageToFeedImage(
  image: PicsumImageApiItem,
): FeedImage {
  return {
    id: image.id,
    author: image.author,
    width: image.width,
    height: image.height,
    url: image.url,
    downloadUrl: image.download_url,
  };
}

/**
 * Builds the internal paginated feed response from one Picsum page.
 */
export function buildFeedResponse(
  images: readonly PicsumImageApiItem[],
  pagination: Readonly<{ page: number; limit: number }>,
): FeedResponse {
  return {
    images: images.map(mapPicsumImageToFeedImage),
    page: pagination.page,
    hasMore: images.length === pagination.limit,
  };
}
