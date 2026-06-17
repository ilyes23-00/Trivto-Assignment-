/**
 * Root page for the feed UI phase.
 * This file exists to load the first page of backend-fed images on the server and hand them to the presentation layer.
 * It interacts with src/services/server/picsum-service.ts and src/components/feed/image-feed.tsx.
 */
import { FeedErrorState } from "../components/feed/feed-error-state";
import { ImageFeed } from "../components/feed/image-feed";
import { DEFAULT_FEED_LIMIT, DEFAULT_FEED_PAGE } from "../lib/constants";
import { fetchPicsumFeedPage } from "../services/server/picsum-service";

/**
 * Loads the first feed page and renders the UI-only feed experience.
 */
export default async function HomePage() {
  try {
    const feedResponse = await fetchPicsumFeedPage({
      page: DEFAULT_FEED_PAGE,
      limit: DEFAULT_FEED_LIMIT,
    });

    return <ImageFeed images={feedResponse.images} />;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading images.";

    return <FeedErrorState message={message} />;
  }
}
