/**
 * Feed list presentation component for the vertical image experience.
 * This file exists to render a mobile-first list of full-screen image cards with scroll snap behavior.
 * It interacts with src/components/feed/feed-item.tsx, feed-empty-state.tsx, and src/types/feed.ts.
 */
/**
 * Feed list presentation component for the vertical image experience.
 * This file exists to render a mobile-first list of full-screen image cards with scroll snap behavior.
 * It interacts with src/components/feed/feed-item.tsx, feed-empty-state.tsx, src/hooks/use-infinite-feed.ts, and src/types/feed.ts.
 */
"use client";

import { useCallback } from "react";
import { DEFAULT_FEED_LIMIT, DEFAULT_FEED_PAGE } from "../../lib/constants";
import { useInfiniteFeed } from "../../hooks/use-infinite-feed";
import { useImagePreload } from "../../hooks/use-image-preload";
import { useLikes } from "../../hooks/use-likes";
import type { RequestErrorKind } from "../../types/api";
import type { FeedImage } from "../../types/feed";
import { FeedEmptyState } from "./feed-empty-state";
import { FeedInlineState } from "./feed-inline-state";
import { FeedItem } from "./feed-item";
import { FeedSkeleton } from "./feed-skeleton";

/**
 * Props for the ImageFeed component.
 *
 * `images` is the normalized list of feed images that should be rendered in order.
 */
export interface ImageFeedProps {
  readonly initialImages: readonly FeedImage[];
  readonly initialLikedImageIds?: readonly string[];
  readonly initialPage?: number;
  readonly initialHasMore?: boolean;
  readonly pageSize?: number;
}

/**
 * Renders the feed list with one image per viewport and vertical snap scrolling.
 */
export function ImageFeed({
  initialImages,
  initialLikedImageIds = [],
  initialPage = DEFAULT_FEED_PAGE,
  initialHasMore = false,
  pageSize = DEFAULT_FEED_LIMIT,
}: ImageFeedProps) {
  const {
    images,
    hasMore,
    isLoadingMore,
    loadMoreError,
    scrollContainerRef,
    sentinelRef,
    retryLoadMore,
  } = useInfiniteFeed({
    initialImages,
    initialPage,
    limit: pageSize,
    initialHasMore,
  });
  const { loadError: likesError, toggleLike, isLiked, isUpdating } = useLikes({
    initialLikedImageIds,
  });
  useImagePreload(images);

  const handleToggleLike = useCallback(
    (imageId: string) => {
      void toggleLike(imageId);
    },
    [toggleLike],
  );

  if (images.length === 0) {
    return <FeedEmptyState />;
  }

  const getActionLabel = (kind: RequestErrorKind) =>
    kind === "rate_limit" ? "Try Again Soon" : "Retry";

  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="flex items-center justify-between px-4 py-3 text-white/80">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/50">
            Trivto Feed
          </p>
          <h1 className="mt-1 text-lg font-semibold">Vertical Image Stream</h1>
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-white/40">
          Page One
        </p>
      </section>

      <div
        ref={scrollContainerRef}
        className="h-[calc(100dvh-4.5rem)] snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image) => (
          <FeedItem
            key={image.id}
            image={image}
            prioritizeImage={image.id === images[0]?.id}
            liked={isLiked(image.id)}
            isLikePending={isUpdating(image.id)}
            onToggleLike={handleToggleLike}
          />
        ))}

        {isLoadingMore ? <FeedSkeleton /> : null}

        {loadMoreError ? (
          <FeedInlineState
            kind={loadMoreError.kind}
            message={loadMoreError.message}
            actionLabel={getActionLabel(loadMoreError.kind)}
            onAction={retryLoadMore}
          />
        ) : null}

        {likesError ? (
          <FeedInlineState kind={likesError.kind} message={likesError.message} />
        ) : null}

        {hasMore ? <div ref={sentinelRef} aria-hidden="true" className="h-px" /> : null}
      </div>
    </main>
  );
}
