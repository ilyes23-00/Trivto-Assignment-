/**
 * Infinite feed hook for paginated image loading.
 * This file exists to append feed pages with IntersectionObserver instead of scroll listeners while protecting the UI from duplicate requests and stale responses.
 * It interacts with src/components/feed/image-feed.tsx, src/services/api/feed-client.ts, and src/types/feed.ts.
 */
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { FEED_SENTINEL_ROOT_MARGIN } from "../lib/constants";
import { fetchFeedPage } from "../services/api/feed-client";
import type { AppRequestError } from "../types/api";
import type { FeedImage } from "../types/feed";

export interface UseInfiniteFeedOptions {
  readonly initialImages: readonly FeedImage[];
  readonly initialPage: number;
  readonly limit: number;
  readonly initialHasMore: boolean;
}

export interface UseInfiniteFeedResult {
  readonly images: readonly FeedImage[];
  readonly hasMore: boolean;
  readonly isLoadingMore: boolean;
  readonly loadMoreError: AppRequestError | null;
  readonly scrollContainerRef: RefObject<HTMLDivElement | null>;
  readonly sentinelRef: RefObject<HTMLDivElement | null>;
  readonly retryLoadMore: () => void;
}

function appendUniqueImages(
  currentImages: readonly FeedImage[],
  nextImages: readonly FeedImage[],
): readonly FeedImage[] {
  const imageIds = new Set(currentImages.map((image) => image.id));
  const uniqueImages = nextImages.filter((image) => !imageIds.has(image.id));

  return uniqueImages.length === 0
    ? currentImages
    : [...currentImages, ...uniqueImages];
}

/**
 * Manages infinite paging for the image feed using a sentinel observer.
 */
export function useInfiniteFeed(
  options: UseInfiniteFeedOptions,
): UseInfiniteFeedResult {
  const [images, setImages] = useState<readonly FeedImage[]>(options.initialImages);
  const [hasMore, setHasMore] = useState(options.initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<AppRequestError | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(options.initialPage);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(options.initialHasMore);
  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadNextPage = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) {
      return;
    }

    const nextPage = pageRef.current + 1;
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    abortControllerRef.current?.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await fetchFeedPage({
        page: nextPage,
        limit: options.limit,
        signal: abortController.signal,
      });

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      pageRef.current = response.page;
      hasMoreRef.current = response.hasMore;
      setImages((currentImages) =>
        appendUniqueImages(currentImages, response.images),
      );
      setHasMore(response.hasMore);
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }

      setLoadMoreError(
        error instanceof Error
          ? (error as AppRequestError)
          : null,
      );
    } finally {
      if (activeRequestIdRef.current === requestId) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [options.limit]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const sentinel = sentinelRef.current;

    if (!scrollContainer || !sentinel || !hasMore || loadMoreError) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting) {
          void loadNextPage();
        }
      },
      {
        root: scrollContainer,
        rootMargin: `0px 0px ${FEED_SENTINEL_ROOT_MARGIN} 0px`,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMoreError, loadNextPage]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    images,
    hasMore,
    isLoadingMore,
    loadMoreError,
    scrollContainerRef,
    sentinelRef,
    retryLoadMore: () => {
      void loadNextPage();
    },
  };
}
