/**
 * Tests for the feed loading, empty, and error state components.
 * This file exists to verify the standalone UI states used by the feed view before interactive enhancements are added.
 * It interacts with src/components/feed/feed-skeleton.tsx, feed-empty-state.tsx, and feed-error-state.tsx.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { FeedEmptyState } from "./feed-empty-state";
import { FeedErrorState } from "./feed-error-state";
import { FeedSkeleton } from "./feed-skeleton";

describe("feed state components", () => {
  it("renders the skeleton layout", () => {
    const markup = renderToStaticMarkup(createElement(FeedSkeleton));

    expect(markup).toContain("animate-pulse");
    expect(markup).toContain("min-h-dvh");
  });

  it("renders the empty state message", () => {
    const markup = renderToStaticMarkup(createElement(FeedEmptyState));

    expect(markup).toContain("No images available");
  });

  it("renders the error state message", () => {
    const markup = renderToStaticMarkup(
      createElement(FeedErrorState, { message: "Unable to load feed." }),
    );

    expect(markup).toContain("Unable to load feed.");
  });
});
