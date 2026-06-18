/**
 * Root page for the feed UI phase.
 * This file exists to load the first page of backend-fed images on the server and hand them to the presentation layer.
 * It interacts with src/services/server/picsum-service.ts and src/components/feed/image-feed.tsx.
 */
import { FeedErrorState } from "../components/feed/feed-error-state";
import { ImageFeed } from "../components/feed/image-feed";
import { DEFAULT_FEED_LIMIT, DEFAULT_FEED_PAGE } from "../lib/constants";
import { toAppRequestError } from "../lib/utils";
import { getLikesService } from "../services/server/likes-service";
import {
  fetchPicsumFeedPage,
  ImageProviderError,
} from "../services/server/picsum-service";

/**
 * Loads the first feed page and renders the UI-only feed experience.
 */
export default async function HomePage() {
  try {
    const likesService = getLikesService();
    const [feedResponse, likesResponse] = await Promise.all([
      fetchPicsumFeedPage({
        page: DEFAULT_FEED_PAGE,
        limit: DEFAULT_FEED_LIMIT,
      }),
      likesService.getLikes().catch((error) => {
        console.error("Unable to bootstrap likes on first page render", error);
        return { likedImageIds: [] };
      }),
    ]);

    return (
      <ImageFeed
        initialImages={feedResponse.images}
        initialLikedImageIds={likesResponse.likedImageIds}
        initialPage={feedResponse.page}
        initialHasMore={feedResponse.hasMore}
        pageSize={DEFAULT_FEED_LIMIT}
      />
    );
  } catch (error) {
    const requestError =
      error instanceof ImageProviderError && error.status === 429
        ? toAppRequestError(
            new Error(error.message),
            "The image service asked us to slow down.",
          )
        : toAppRequestError(
            error,
            "An unexpected error occurred while loading images.",
          );

    const kind =
      error instanceof ImageProviderError && error.status === 429
        ? "rate_limit"
        : requestError.kind;

    return (
      <FeedErrorState
        kind={kind}
        message={requestError.message}
        actionLabel="Retry"
        actionHref="/"
      />
    );
  }
}
