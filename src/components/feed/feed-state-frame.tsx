/**
 * Reusable full-screen state frame for feed-level states.
 * This file exists to keep loading, empty, error, network, and rate-limit screens visually consistent.
 * It interacts with feed-empty-state.tsx, feed-error-state.tsx, and route-level loading flows.
 */
export interface FeedStateFrameProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly accentClassName?: string;
  readonly children?: React.ReactNode;
}

/**
 * Renders a centered full-screen state frame.
 */
export function FeedStateFrame({
  eyebrow,
  title,
  description,
  accentClassName = "text-white/50",
  children,
}: FeedStateFrameProps) {
  return (
    <section className="flex min-h-dvh items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <div className="max-w-sm space-y-4">
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentClassName}`}>
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm leading-6 text-white/70">{description}</p>
        {children}
      </div>
    </section>
  );
}
