import { FeedStateFrame } from "./feed-state-frame";

/**
 * Feed loading skeleton component.
 * This file exists to represent the full-screen feed layout before image data is available.
 * It interacts with route-level loading flows and the feed page entry component.
 */
/**
 * Renders a full-screen placeholder card matching the feed layout.
 */
export function FeedSkeleton() {
  return (
    <div className="relative flex min-h-dvh animate-pulse snap-start overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%)]" />
      <div className="mt-auto w-full space-y-3 px-4 pb-8 pt-20">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="h-8 w-52 rounded-full bg-white/20" />
        <div className="h-4 w-72 max-w-full rounded-full bg-white/10" />
        <div className="h-4 w-56 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

/**
 * Renders the first-load state before feed data is ready.
 */
export function FeedLoadingState() {
  return (
    <FeedStateFrame
      eyebrow="Loading Feed"
      title="Preparing the image stream."
      description="We are fetching the first screen of images and setting up the vertical feed."
    >
      <div className="pt-2">
        <div className="mx-auto h-2 w-28 rounded-full bg-white/10" />
      </div>
    </FeedStateFrame>
  );
}
