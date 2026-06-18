import type { RequestErrorKind } from "../../types/api";
import { FeedStateFrame } from "./feed-state-frame";

/**
 * Feed error state component.
 * This file exists to render a full-screen fallback when the feed cannot be loaded.
 * It interacts with src/components/feed/image-feed.tsx and the page entry component.
 */
/**
 * Props for the FeedErrorState component.
 *
 * `message` describes the user-facing reason the feed could not be rendered.
 */
export interface FeedErrorStateProps {
  readonly message: string;
  readonly kind?: RequestErrorKind;
  readonly actionLabel?: string;
  readonly actionHref?: string;
}

const STATE_CONTENT: Record<
  RequestErrorKind,
  Readonly<{ eyebrow: string; title: string; accentClassName: string }>
> = {
  generic: {
    eyebrow: "Feed Error",
    title: "Unable to load feed.",
    accentClassName: "text-red-300/80",
  },
  network: {
    eyebrow: "Network Issue",
    title: "Connection lost while loading the feed.",
    accentClassName: "text-amber-200/80",
  },
  rate_limit: {
    eyebrow: "Rate Limited",
    title: "The image service asked us to slow down.",
    accentClassName: "text-sky-200/80",
  },
};

/**
 * Renders a full-screen error message for feed loading failures.
 */
export function FeedErrorState({
  message,
  kind = "generic",
  actionLabel,
  actionHref,
}: FeedErrorStateProps) {
  const stateContent = STATE_CONTENT[kind];

  return (
    <FeedStateFrame
      eyebrow={stateContent.eyebrow}
      title={stateContent.title}
      description={message}
      accentClassName={stateContent.accentClassName}
    >
      {actionLabel && actionHref ? (
        <div className="pt-2">
          <a
            href={actionHref}
            className="inline-flex rounded-full border border-white/20 bg-black/40 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-black/60"
          >
            {actionLabel}
          </a>
        </div>
      ) : null}
    </FeedStateFrame>
  );
}
