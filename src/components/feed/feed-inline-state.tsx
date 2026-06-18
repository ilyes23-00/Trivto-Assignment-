/**
 * Reusable inline state component for non-blocking feed errors and notices.
 * This file exists to render pagination, likes, network, and rate-limit feedback inside the scrolling feed.
 * It interacts with image-feed.tsx and client hooks that surface follow-up request failures.
 */
import type { RequestErrorKind } from "../../types/api";

export interface FeedInlineStateProps {
  readonly kind?: RequestErrorKind;
  readonly message: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

const STATE_STYLES: Record<RequestErrorKind, string> = {
  generic: "border-red-300/20 bg-red-400/10 text-red-100",
  network: "border-amber-300/20 bg-amber-400/10 text-amber-100",
  rate_limit: "border-sky-300/20 bg-sky-400/10 text-sky-100",
};

/**
 * Renders a compact inline notice inside the feed.
 */
export function FeedInlineState({
  kind = "generic",
  message,
  actionLabel,
  onAction,
}: FeedInlineStateProps) {
  return (
    <div className="px-4 py-4 text-center text-sm">
      <div className={`mx-auto max-w-md rounded-3xl border px-4 py-4 ${STATE_STYLES[kind]}`}>
        <p>{message}</p>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 rounded-full border border-current/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white/10"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
