/**
 * Tests for the feed list presentation component.
 * This file exists to verify list rendering, scroll snap layout, and empty state behavior for the feed UI phase.
 * It interacts with src/components/feed/image-feed.tsx and related feed state components.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { ImageFeed } from "./image-feed";

describe("ImageFeed", () => {
  it("renders the empty state when no images are available", () => {
    const markup = renderToStaticMarkup(createElement(ImageFeed, { images: [] }));

    expect(markup).toContain("No images available");
  });

  it("renders a snap-scrolling list when images are present", () => {
    const markup = renderToStaticMarkup(
      createElement(ImageFeed, {
        images: [
          {
            id: "1",
            author: "Author One",
            width: 100,
            height: 100,
            url: "https://picsum.photos/id/1/100/100",
            downloadUrl: "https://picsum.photos/id/1/100/100",
          },
          {
            id: "2",
            author: "Author Two",
            width: 100,
            height: 100,
            url: "https://picsum.photos/id/2/100/100",
            downloadUrl: "https://picsum.photos/id/2/100/100",
          },
        ],
      }),
    );

    expect(markup).toContain("snap-y");
    expect(markup).toContain("snap-mandatory");
    expect(markup).toContain("Author One");
    expect(markup).toContain("Author Two");
  });
});
