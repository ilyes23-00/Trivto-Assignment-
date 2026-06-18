/**
 * Tests for the feed item presentation component.
 * This file exists to verify that one image is rendered as one full-screen viewport with the expected content.
 * It interacts with src/components/feed/feed-item.tsx and src/types/feed.ts.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { FeedItem } from "./feed-item";

describe("FeedItem", () => {
  it("renders one full-screen image viewport with image metadata", () => {
    const markup = renderToStaticMarkup(
      createElement(FeedItem, {
        image: {
          id: "7",
          author: "Alejandro Escamilla",
          width: 4728,
          height: 3168,
          url: "https://picsum.photos/id/7/4728/3168",
          downloadUrl: "https://picsum.photos/id/7/4728/3168",
        },
        liked: true,
      }),
    );

    expect(markup).toContain("Alejandro Escamilla");
    expect(markup).toContain(
      "url=https%3A%2F%2Fpicsum.photos%2Fid%2F7%2F4728%2F3168",
    );
    expect(markup).toContain("snap-start");
    expect(markup).toContain("min-h-dvh");
    expect(markup).toContain("Unlike image");
    expect(markup).toContain("Liked");
    expect(markup).toContain("Double tap the image area to like");
  });
});
