/**
 * Route-level error boundary for unexpected rendering failures.
 * This file exists to provide a safe fallback when an uncaught error escapes the page-level data and UI flow.
 * It interacts with src/components/feed/feed-error-state.tsx.
 */
"use client";

import { useEffect } from "react";
import { FeedErrorState } from "../components/feed/feed-error-state";

/**
 * Renders a recoverable error fallback for the root route.
 */
export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Unhandled route error", error);
  }, [error]);

  return (
    <div>
      <FeedErrorState message={error.message || "An unexpected error occurred."} />
      <div className="fixed inset-x-0 bottom-8 flex justify-center px-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/20 bg-black/60 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-black/75"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
