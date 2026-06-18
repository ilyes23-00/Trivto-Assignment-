import { memo } from "react";

/**
 * Like button component for the feed overlay.
 * This file exists to render liked and unliked states, pending protection, and accessible button behavior for one image.
 * It interacts with src/components/feed/feed-item.tsx and src/hooks/use-likes.ts.
 */
export interface LikeButtonProps {
  readonly liked: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}

/**
 * Renders the floating like control for one feed image.
 */
function LikeButtonComponent({
  liked,
  disabled = false,
  onClick,
}: LikeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={liked ? "Unlike image" : "Like image"}
      className={`inline-flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-sm transition ${
        liked
          ? "border-rose-300/80 bg-rose-500/25 text-rose-100"
          : "border-white/20 bg-black/25 text-white"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:scale-[1.03] hover:border-white/40 hover:bg-black/35"
      }`}
    >
      <span className="text-2xl leading-none">{liked ? "♥" : "♡"}</span>
    </button>
  );
}

/**
 * Memoized like button used by each feed card.
 */
export const LikeButton = memo(LikeButtonComponent);
