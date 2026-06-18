/**
 * Tests for the frontend feed API client.
 * This file exists to verify response parsing and error handling for client-side pagination requests.
 * It interacts with src/services/api/feed-client.ts and the internal feed route contract.
 */
import { describe, expect, it, vi } from "vitest";
import { fetchFeedPage } from "./feed-client";

describe("feed client", () => {
  it("returns parsed feed data for successful responses", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        images: [],
        page: 2,
        hasMore: false,
      }),
    });

    await expect(
      fetchFeedPage({ page: 2, limit: 10, fetcher }),
    ).resolves.toEqual({
      images: [],
      page: 2,
      hasMore: false,
    });

    expect(fetcher).toHaveBeenCalledWith("/api/feed?page=2&limit=10", {
      method: "GET",
      signal: undefined,
      cache: "no-store",
    });
  });

  it("throws the API error message for failed responses", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: "IMAGE_PROVIDER_REQUEST_FAILED",
          message: "Lorem Picsum request failed with status 503.",
        },
      }),
    });

    await expect(
      fetchFeedPage({ page: 3, limit: 10, fetcher }),
    ).rejects.toThrow("Lorem Picsum request failed with status 503.");
  });

  it("deduplicates matching non-signaled page requests", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        images: [],
        page: 4,
        hasMore: false,
      }),
    });

    const [firstResponse, secondResponse] = await Promise.all([
      fetchFeedPage({ page: 4, limit: 10, fetcher }),
      fetchFeedPage({ page: 4, limit: 10, fetcher }),
    ]);

    expect(firstResponse).toEqual(secondResponse);
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
