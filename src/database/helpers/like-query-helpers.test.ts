/**
 * Tests for the database query helper functions.
 * This file exists to lock down the exact Prisma query shapes used by the like repository.
 * It interacts with src/database/helpers/like-query-helpers.ts and protects repository behavior from accidental drift.
 */
import { describe, expect, it } from "vitest";
import {
  buildFindLikedImageIdsQuery,
  buildUpsertLikeQuery,
  mapLikeRecordsToImageIds,
} from "./like-query-helpers";

describe("like query helpers", () => {
  it("returns the query used to read only liked image identifiers", () => {
    expect(buildFindLikedImageIdsQuery()).toEqual({
      where: { liked: true },
      select: { imageId: true },
      orderBy: { updatedAt: "desc" },
    });
  });

  it("returns the query used to upsert a like record by image identifier", () => {
    expect(buildUpsertLikeQuery({ imageId: "image-1", liked: true })).toEqual({
      where: { imageId: "image-1" },
      create: { imageId: "image-1", liked: true },
      update: { liked: true },
    });
  });

  it("maps database records into a flat image id list", () => {
    expect(
      mapLikeRecordsToImageIds([
        { imageId: "image-2" },
        { imageId: "image-1" },
      ]),
    ).toEqual(["image-2", "image-1"]);
  });
});
