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
import { FeedInlineState } from "./feed-inline-state";
import { FeedLoadingState, FeedSkeleton } from "./feed-skeleton";

describe("feed state components", () => {
  it("renders the skeleton layout", () => {
    const markup = renderToStaticMarkup(createElement(FeedSkeleton));

    expect(markup).toContain("animate-pulse");
    expect(markup).toContain("min-h-dvh");
  });

  it("renders the first-load state message", () => {
    const markup = renderToStaticMarkup(createElement(FeedLoadingState));

    expect(markup).toContain("Preparing the image stream");
  });

  it("renders the empty state message", () => {
    const markup = renderToStaticMarkup(createElement(FeedEmptyState));

    expect(markup).toContain("No images available");
  });

  it("renders the error state message", () => {
    const markup = renderToStaticMarkup(
      createElement(FeedErrorState, {
        kind: "network",
        message: "Network connection lost while loading the feed.",
      }),
    );

    expect(markup).toContain("Connection lost while loading the feed");
  });

  it("renders the inline rate-limit state", () => {
    const markup = renderToStaticMarkup(
      createElement(FeedInlineState, {
        kind: "rate_limit",
        message: "The image service asked us to slow down.",
        actionLabel: "Try Again Soon",
        onAction: () => undefined,
      }),
    );

    expect(markup).toContain("Try Again Soon");
    expect(markup).toContain("slow down");
  });
});
