/**
 * Feed empty state component.
 * This file exists to provide a clean full-screen fallback when the backend returns no images.
 * It interacts with src/components/feed/image-feed.tsx and the page entry component.
 */
/**
 * Renders the feed empty state when no images are available to display.
 */
export function FeedEmptyState() {
  return (
    <section className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <div className="max-w-sm space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
          Empty Feed
        </p>
        <h2 className="text-2xl font-semibold">No images available.</h2>
        <p className="text-sm leading-6 text-white/70">
          The feed is connected, but this page did not return any images yet.
        </p>
      </div>
    </section>
  );
}
