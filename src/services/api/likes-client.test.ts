/**
 * Tests for the frontend likes API client.
 * This file exists to verify like bootstrap and persistence requests against the internal API contract.
 * It interacts with src/services/api/likes-client.ts and src/types/like.ts.
 */
import { describe, expect, it, vi } from "vitest";
import { fetchLikedImageIds, persistLikeState } from "./likes-client";

describe("likes client", () => {
  it("loads liked image ids from the API", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        likedImageIds: ["image-1", "image-2"],
      }),
    });

    await expect(fetchLikedImageIds({ fetcher })).resolves.toEqual({
      likedImageIds: ["image-1", "image-2"],
    });

    expect(fetcher).toHaveBeenCalledWith("/api/likes", {
      method: "GET",
      signal: undefined,
      cache: "no-store",
    });
  });

  it("persists one like payload through the API", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        imageId: "image-8",
        liked: true,
      }),
    });

    await expect(
      persistLikeState({ imageId: "image-8", liked: true }, { fetcher }),
    ).resolves.toEqual({
      success: true,
      imageId: "image-8",
      liked: true,
    });

    expect(fetcher).toHaveBeenCalledWith("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageId: "image-8", liked: true }),
      signal: undefined,
      cache: "no-store",
    });
  });

  it("throws the backend error message for failed writes", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to update like.",
        },
      }),
    });

    await expect(
      persistLikeState({ imageId: "image-9", liked: false }, { fetcher }),
    ).rejects.toThrow("Unable to update like.");
  });

  it("deduplicates bootstrap requests while one is in flight", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        likedImageIds: ["image-3"],
      }),
    });

    const [firstResponse, secondResponse] = await Promise.all([
      fetchLikedImageIds({ fetcher }),
      fetchLikedImageIds({ fetcher }),
    ]);

    expect(firstResponse).toEqual(secondResponse);
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
