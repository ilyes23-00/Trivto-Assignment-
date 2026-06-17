/**
 * Tests for the like repository contract.
 * This file exists to verify that the repository uses the expected query helpers and persistence delegate methods.
 * It interacts with src/database/repositories/like-repository.ts and the helper layer under src/database/helpers.
 */
import { describe, expect, it, vi } from "vitest";
import {
  createLikeRepository,
} from "./like-repository";

describe("like repository", () => {
  it("returns liked image identifiers from the persistence delegate", async () => {
    const findMany = vi.fn().mockResolvedValue([{ imageId: "image-3" }]);
    const upsert = vi.fn();
    const repository = createLikeRepository({
      findMany,
      upsert,
    });

    await expect(repository.getLikedImageIds()).resolves.toEqual(["image-3"]);
    expect(findMany).toHaveBeenCalledOnce();
  });

  it("persists liked state with an upsert query", async () => {
    const findMany = vi.fn();
    const upsert = vi.fn().mockResolvedValue(undefined);
    const repository = createLikeRepository({
      findMany,
      upsert,
    });

    await repository.saveLike({ imageId: "image-5", liked: false });

    expect(upsert).toHaveBeenCalledOnce();
    expect(upsert).toHaveBeenCalledWith({
      where: { imageId: "image-5" },
      create: { imageId: "image-5", liked: false },
      update: { liked: false },
    });
  });
});
