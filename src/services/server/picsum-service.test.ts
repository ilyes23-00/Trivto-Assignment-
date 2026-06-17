/**
 * Tests for the Lorem Picsum integration service.
 * This file exists to verify pagination, transformation, and failure handling at the service boundary.
 * It interacts with src/services/server/picsum-service.ts and the mapper layer under src/mappers.
 */
import { describe, expect, it, vi } from "vitest";
import {
  ImageProviderError,
  fetchPicsumFeedPage,
} from "./picsum-service";

describe("picsum service", () => {
  it("fetches and transforms one page of images", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "7",
          author: "Alejandro Escamilla",
          width: 4728,
          height: 3168,
          url: "https://picsum.photos/id/7/4728/3168",
          download_url: "https://picsum.photos/id/7/4728/3168",
        },
      ],
    });

    await expect(
      fetchPicsumFeedPage({ page: 1, limit: 1, fetcher }),
    ).resolves.toEqual({
      images: [
        {
          id: "7",
          author: "Alejandro Escamilla",
          width: 4728,
          height: 3168,
          url: "https://picsum.photos/id/7/4728/3168",
          downloadUrl: "https://picsum.photos/id/7/4728/3168",
        },
      ],
      page: 1,
      hasMore: true,
    });
  });

  it("throws a provider error when Picsum responds with a failure status", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });

    await expect(
      fetchPicsumFeedPage({ page: 1, limit: 10, fetcher }),
    ).rejects.toMatchObject<ImageProviderError>({
      code: "IMAGE_PROVIDER_REQUEST_FAILED",
      status: 503,
    });
  });

  it("throws a provider error when the provider payload is not an array", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ invalid: true }),
    });

    await expect(
      fetchPicsumFeedPage({ page: 3, limit: 10, fetcher }),
    ).rejects.toMatchObject<ImageProviderError>({
      code: "IMAGE_PROVIDER_INVALID_RESPONSE",
    });
  });
});
