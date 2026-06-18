/**
 * Feed item presentation component for the vertical image feed.
 * This file exists to render one image as one full-screen viewport with lightweight metadata overlay and like interaction UI.
 * It interacts with src/components/feed/image-feed.tsx, like-button.tsx, and src/types/feed.ts.
 */
"use client";

import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import type { FeedImage } from "../../types/feed";
import { ImageLoadFailureState } from "./image-load-failure-state";
import { LikeButton } from "./like-button";

const DOUBLE_TAP_MAX_DELAY_MS = 280;
const DOUBLE_TAP_MAX_MOVEMENT_PX = 14;
const DOUBLE_TAP_ANIMATION_MS = 700;

/**
 * Props for the FeedItem component.
 *
 * `image` provides the normalized image data that should fill one viewport.
 */
export interface FeedItemProps {
  readonly image: FeedImage;
  readonly liked?: boolean;
  readonly isLikePending?: boolean;
  readonly prioritizeImage?: boolean;
  readonly onToggleLike?: (imageId: string) => void;
}

/**
 * Renders a single full-screen feed card for one image.
 */
function FeedItemComponent({
  image,
  liked = false,
  isLikePending = false,
  prioritizeImage = false,
  onToggleLike,
}: FeedItemProps) {
  const [hasImageLoadFailed, setHasImageLoadFailed] = useState(false);
  const [showDoubleTapAnimation, setShowDoubleTapAnimation] = useState(false);
  const lastTapTimestampRef = useRef<number | null>(null);
  const lastTapPositionRef = useRef<Readonly<{ x: number; y: number }> | null>(null);
  const pointerDownPositionRef = useRef<Readonly<{ x: number; y: number }> | null>(null);
  const animationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  function resetTapTracking() {
    lastTapTimestampRef.current = null;
    lastTapPositionRef.current = null;
  }

  function isInteractiveTarget(target: EventTarget | null): boolean {
    return target instanceof HTMLElement && target.closest("button") !== null;
  }

  function playDoubleTapAnimation() {
    setShowDoubleTapAnimation(true);

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      setShowDoubleTapAnimation(false);
      animationTimeoutRef.current = null;
    }, DOUBLE_TAP_ANIMATION_MS);
  }

  function handleImageAreaPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!event.isPrimary || isInteractiveTarget(event.target)) {
      return;
    }

    pointerDownPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleImageAreaPointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (
      !event.isPrimary ||
      !onToggleLike ||
      isLikePending ||
      isInteractiveTarget(event.target)
    ) {
      return;
    }

    const pointerDownPosition = pointerDownPositionRef.current;

    if (!pointerDownPosition) {
      return;
    }

    const movementX = event.clientX - pointerDownPosition.x;
    const movementY = event.clientY - pointerDownPosition.y;
    const movementDistance = Math.hypot(movementX, movementY);

    if (movementDistance > DOUBLE_TAP_MAX_MOVEMENT_PX) {
      resetTapTracking();
      return;
    }

    const currentTapTimestamp = Date.now();
    const previousTapTimestamp = lastTapTimestampRef.current;
    const previousTapPosition = lastTapPositionRef.current;

    const isSecondTapWithinDelay =
      previousTapTimestamp !== null &&
      currentTapTimestamp - previousTapTimestamp <= DOUBLE_TAP_MAX_DELAY_MS;
    const isSecondTapNearFirst =
      previousTapPosition !== null &&
      Math.hypot(
        event.clientX - previousTapPosition.x,
        event.clientY - previousTapPosition.y,
      ) <= DOUBLE_TAP_MAX_MOVEMENT_PX;

    if (isSecondTapWithinDelay && isSecondTapNearFirst) {
      resetTapTracking();

      if (!liked) {
        playDoubleTapAnimation();
        onToggleLike(image.id);
      }

      return;
    }

    lastTapTimestampRef.current = currentTapTimestamp;
    lastTapPositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handleImageAreaPointerCancel() {
    pointerDownPositionRef.current = null;
    resetTapTracking();
  }

  return (
    <article
      className="relative min-h-dvh snap-start overflow-hidden bg-black touch-pan-y"
      onPointerDown={handleImageAreaPointerDown}
      onPointerUp={handleImageAreaPointerUp}
      onPointerCancel={handleImageAreaPointerCancel}
    >
      {hasImageLoadFailed ? (
        <ImageLoadFailureState author={image.author} />
      ) : (
        <Image
          src={image.downloadUrl}
          alt={`Photo by ${image.author}`}
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
          priority={prioritizeImage}
          loading={prioritizeImage ? "eager" : "lazy"}
          onError={() => {
            setHasImageLoadFailed(true);
          }}
        />
      )}
      {showDoubleTapAnimation ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="double-tap-heart flex h-28 w-28 items-center justify-center rounded-full bg-black/20 text-6xl text-white">
            ♥
          </div>
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-14 text-white">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-[min(18rem,calc(100vw-7rem))]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/60">
              Featured Image
            </p>
            <h2 className="mt-2 text-xl font-semibold">{image.author}</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
              Full-screen vertical presentation optimized for swipe-style browsing.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pb-2">
            <LikeButton
              liked={liked}
              disabled={isLikePending || !onToggleLike}
              onClick={() => {
                onToggleLike?.(image.id);
              }}
            />
            <span className="sr-only">
              Double tap the image area to like. Use the like button for keyboard and assistive technology access.
            </span>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/70">
              {isLikePending ? "Saving" : liked ? "Liked" : "Like"}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Memoized feed card used by the vertical image list.
 */
export const FeedItem = memo(FeedItemComponent);
