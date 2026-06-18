/**
 * Like state hook for optimistic image interactions.
 * This file exists to bootstrap persisted likes, perform optimistic updates, protect in-flight writes, and roll back failed requests safely.
 * It interacts with src/components/feed/like-button.tsx, src/services/api/likes-client.ts, and src/types/like.ts.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  persistLikeState,
} from "../services/api/likes-client";
import type { AppRequestError } from "../types/api";

export interface UseLikesOptions {
  readonly initialLikedImageIds: readonly string[];
}

export interface UseLikesResult {
  readonly likedImageIds: ReadonlySet<string>;
  readonly pendingImageIds: ReadonlySet<string>;
  readonly loadError: AppRequestError | null;
  readonly toggleLike: (imageId: string) => Promise<void>;
  readonly isLiked: (imageId: string) => boolean;
  readonly isUpdating: (imageId: string) => boolean;
}

function cloneSet(values: ReadonlySet<string>): Set<string> {
  return new Set(values);
}

/**
 * Manages optimistic like state with backend persistence and rollback support.
 */
export function useLikes(options: UseLikesOptions): UseLikesResult {
  const [likedImageIds, setLikedImageIds] = useState<Set<string>>(
    () => new Set(options.initialLikedImageIds),
  );
  const [pendingImageIds, setPendingImageIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [loadError, setLoadError] = useState<AppRequestError | null>(null);

  const likedImageIdsRef = useRef(likedImageIds);
  const pendingImageIdsRef = useRef(pendingImageIds);
  const isMountedRef = useRef(true);

  useEffect(() => {
    likedImageIdsRef.current = likedImageIds;
  }, [likedImageIds]);

  useEffect(() => {
    pendingImageIdsRef.current = pendingImageIds;
  }, [pendingImageIds]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const toggleLike = useCallback(async (imageId: string) => {
    if (pendingImageIdsRef.current.has(imageId)) {
      return;
    }

    const wasLiked = likedImageIdsRef.current.has(imageId);
    const nextLiked = !wasLiked;

    setLoadError(null);
    setLikedImageIds((currentLikedImageIds) => {
      const nextLikedImageIds = cloneSet(currentLikedImageIds);

      if (nextLiked) {
        nextLikedImageIds.add(imageId);
      } else {
        nextLikedImageIds.delete(imageId);
      }

      return nextLikedImageIds;
    });
    setPendingImageIds((currentPendingImageIds) => {
      const nextPendingImageIds = cloneSet(currentPendingImageIds);
      nextPendingImageIds.add(imageId);
      return nextPendingImageIds;
    });

    try {
      await persistLikeState({
        imageId,
        liked: nextLiked,
      });
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      setLikedImageIds((currentLikedImageIds) => {
        const rolledBackLikedImageIds = cloneSet(currentLikedImageIds);

        if (wasLiked) {
          rolledBackLikedImageIds.add(imageId);
        } else {
          rolledBackLikedImageIds.delete(imageId);
        }

        return rolledBackLikedImageIds;
      });

      setLoadError(error instanceof Error ? (error as AppRequestError) : null);
    } finally {
      if (isMountedRef.current) {
        setPendingImageIds((currentPendingImageIds) => {
          const nextPendingImageIds = cloneSet(currentPendingImageIds);
          nextPendingImageIds.delete(imageId);
          return nextPendingImageIds;
        });
      }
    }
  }, []);

  return {
    likedImageIds,
    pendingImageIds,
    loadError,
    toggleLike,
    isLiked: (imageId: string) => likedImageIds.has(imageId),
    isUpdating: (imageId: string) => pendingImageIds.has(imageId),
  };
}
