/**
 * Tests for transforming raw Lorem Picsum payloads into the internal feed shape.
 * This file exists to verify that provider-specific fields are normalized before the rest of the app sees them.
 * It interacts with src/mappers/picsum-feed-mapper.ts and src/types/feed.ts.
 */
import { describe, expect, it } from "vitest";
import {
  buildFeedResponse,
  mapPicsumImageToFeedImage,
} from "./picsum-feed-mapper";

describe("picsum feed mapper", () => {
  it("maps one Picsum image into the internal feed image format", () => {
    expect(
      mapPicsumImageToFeedImage({
        id: "10",
        author: "Paul Jarvis",
        width: 2500,
        height: 1667,
        url: "https://picsum.photos/id/10/2500/1667",
        download_url: "https://picsum.photos/id/10/2500/1667",
      }),
    ).toEqual({
      id: "10",
      author: "Paul Jarvis",
      width: 2500,
      height: 1667,
      url: "https://picsum.photos/id/10/2500/1667",
      downloadUrl: "https://picsum.photos/id/10/2500/1667",
    });
  });

  it("builds a paginated feed response and derives hasMore from the page size", () => {
    const response = buildFeedResponse(
      [
        {
          id: "1",
          author: "Author One",
          width: 100,
          height: 200,
          url: "https://example.com/1",
          download_url: "https://example.com/download-1",
        },
        {
          id: "2",
          author: "Author Two",
          width: 200,
          height: 300,
          url: "https://example.com/2",
          download_url: "https://example.com/download-2",
        },
      ],
      { page: 2, limit: 2 },
    );

    expect(response.page).toBe(2);
    expect(response.hasMore).toBe(true);
    expect(response.images).toHaveLength(2);
  });
});
