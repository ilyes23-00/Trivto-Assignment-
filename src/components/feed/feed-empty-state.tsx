/**
 * Feed empty state component.
 * This file exists to provide a clean full-screen fallback when the backend returns no images.
 * It interacts with src/components/feed/image-feed.tsx and the page entry component.
 */
import { FeedStateFrame } from "./feed-state-frame";

/**
 * Renders the feed empty state when no images are available to display.
 */
export function FeedEmptyState() {
  return (
    <FeedStateFrame
      eyebrow="Empty Feed"
      title="No images available."
      description="The feed is connected, but this page did not return any images yet."
    />
  );
}
