/**
 * Feed list presentation component for the vertical image experience.
 * This file exists to render a mobile-first list of full-screen image cards with scroll snap behavior.
 * It interacts with src/components/feed/feed-item.tsx, feed-empty-state.tsx, and src/types/feed.ts.
 */
import type { FeedImage } from "../../types/feed";
import { FeedEmptyState } from "./feed-empty-state";
import { FeedItem } from "./feed-item";

/**
 * Props for the ImageFeed component.
 *
 * `images` is the normalized list of feed images that should be rendered in order.
 */
export interface ImageFeedProps {
  readonly images: readonly FeedImage[];
}

/**
 * Renders the feed list with one image per viewport and vertical snap scrolling.
 */
export function ImageFeed({ images }: ImageFeedProps) {
  if (images.length === 0) {
    return <FeedEmptyState />;
  }

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

      <div className="h-[calc(100dvh-4.5rem)] snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((image) => (
          <FeedItem key={image.id} image={image} />
        ))}
      </div>
    </main>
  );
}
