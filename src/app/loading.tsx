/**
 * Route-level loading state for the feed page.
 * This file exists to provide a graceful first-load screen while the server resolves the initial feed request.
 * It interacts with src/components/feed/feed-skeleton.tsx.
 */
import { FeedLoadingState, FeedSkeleton } from "../components/feed/feed-skeleton";

/**
 * Renders the route-level loading fallback while the initial page is resolving.
 */
export default function Loading() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <FeedLoadingState />
      <div className="hidden">
        <FeedSkeleton />
      </div>
    </main>
  );
}
