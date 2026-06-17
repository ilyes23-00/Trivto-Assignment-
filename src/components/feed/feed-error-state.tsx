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
}

/**
 * Renders a full-screen error message for feed loading failures.
 */
export function FeedErrorState({ message }: FeedErrorStateProps) {
  return (
    <section className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <div className="max-w-sm space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300/80">
          Feed Error
        </p>
        <h2 className="text-2xl font-semibold">Unable to load feed.</h2>
        <p className="text-sm leading-6 text-white/70">{message}</p>
      </div>
    </section>
  );
}
