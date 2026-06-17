/**
 * Tests for the likes server service.
 * This file exists to verify that the service delegates persistence work to the repository layer instead of embedding database logic.
 * It interacts with src/services/server/likes-service.ts and src/database/repositories/like-repository.ts.
 */
import { describe, expect, it, vi } from "vitest";
import {
  createLikesService,
  type LikesServiceRepository,
} from "./likes-service";

describe("likes service", () => {
  it("returns liked image ids from the repository", async () => {
    const repository: LikesServiceRepository = {
      getLikedImageIds: vi.fn().mockResolvedValue(["image-1", "image-2"]),
      saveLike: vi.fn(),
    };
    const service = createLikesService(repository);

    await expect(service.getLikes()).resolves.toEqual({
      likedImageIds: ["image-1", "image-2"],
    });
  });

  it("persists one like payload through the repository", async () => {
    const repository: LikesServiceRepository = {
      getLikedImageIds: vi.fn(),
      saveLike: vi.fn().mockResolvedValue({
        imageId: "image-4",
        liked: true,
        createdAt: new Date("2026-06-17T00:00:00.000Z"),
        updatedAt: new Date("2026-06-17T00:00:00.000Z"),
      }),
    };
    const service = createLikesService(repository);

    await expect(
      service.updateLike({ imageId: "image-4", liked: true }),
    ).resolves.toEqual({
      success: true,
      imageId: "image-4",
      liked: true,
    });
  });
});
