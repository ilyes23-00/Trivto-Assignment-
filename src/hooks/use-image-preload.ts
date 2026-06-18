/**
 * Image preloading hook for near-future feed cards.
 * This file exists to warm the browser cache for the next likely images in the vertical feed without broadly preloading the whole dataset.
 * It interacts with src/components/feed/image-feed.tsx and src/types/feed.ts.
 */
"use client";

import { useEffect, useRef } from "react";
import type { FeedImage } from "../types/feed";

const PRELOAD_AHEAD_COUNT = 2;

/**
 * Preloads the next few feed images after the first visible card.
 */
export function useImagePreload(images: readonly FeedImage[]) {
  const preloadedUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const nextImages = images.slice(1, PRELOAD_AHEAD_COUNT + 1);

    for (const image of nextImages) {
      if (preloadedUrlsRef.current.has(image.downloadUrl)) {
        continue;
      }

      const preloadImage = new Image();
      preloadImage.src = image.downloadUrl;
      preloadedUrlsRef.current.add(image.downloadUrl);
    }
  }, [images]);
}
