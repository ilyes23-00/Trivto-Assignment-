/**
 * Feed item presentation component for the vertical image feed.
 * This file exists to render one image as one full-screen viewport with lightweight metadata overlay.
 * It interacts with src/components/feed/image-feed.tsx and src/types/feed.ts.
 */
import Image from "next/image";
import type { FeedImage } from "../../types/feed";

/**
 * Props for the FeedItem component.
 *
 * `image` provides the normalized image data that should fill one viewport.
 */
export interface FeedItemProps {
  readonly image: FeedImage;
}

/**
 * Renders a single full-screen feed card for one image.
 */
export function FeedItem({ image }: FeedItemProps) {
  return (
    <article className="relative min-h-dvh snap-start overflow-hidden bg-black">
      <Image
        src={image.downloadUrl}
        alt={`Photo by ${image.author}`}
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover"
        priority={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-4 pb-8 pt-20 text-white">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/60">
          Featured Image
        </p>
        <h2 className="mt-2 text-xl font-semibold">{image.author}</h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
          Full-screen vertical presentation optimized for swipe-style browsing.
        </p>
      </div>
    </article>
  );
}
