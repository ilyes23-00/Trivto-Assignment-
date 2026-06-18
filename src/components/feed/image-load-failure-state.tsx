/**
 * Reusable image failure state for feed cards.
 * This file exists to keep broken remote images from collapsing the card into an empty black background.
 * It interacts with feed-item.tsx.
 */
export interface ImageLoadFailureStateProps {
  readonly author: string;
}

/**
 * Renders a fallback panel when one feed image cannot be displayed.
 */
export function ImageLoadFailureState({
  author,
}: ImageLoadFailureStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_45%)] px-6 text-center text-white">
      <div className="max-w-sm space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
          Image Unavailable
        </p>
        <h3 className="text-xl font-semibold">{author}</h3>
        <p className="text-sm leading-6 text-white/70">
          This photo could not be loaded from the remote source, but the feed keeps working and you can continue browsing.
        </p>
      </div>
    </div>
  );
}
