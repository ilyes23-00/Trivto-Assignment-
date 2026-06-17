/**
 * Repository layer for the Like model.
 * This file exists to isolate Prisma access behind a small database-facing API that other server code can reuse safely.
 * It interacts with src/lib/prisma.ts, src/database/helpers/like-query-helpers.ts, and src/types/like.ts.
 */
import { getPrismaClient } from "../../lib/prisma";
import type { LikeRecord, UpdateLikeRequest } from "../../types/like";
import {
  type FindLikedImageIdsQuery,
  type UpsertLikeQuery,
  buildFindLikedImageIdsQuery,
  buildUpsertLikeQuery,
  mapLikeRecordsToImageIds,
} from "../helpers/like-query-helpers";

export interface LikeRepositoryDelegate {
  findMany(args: FindLikedImageIdsQuery): Promise<readonly { imageId: string }[]>;
  upsert(args: UpsertLikeQuery): Promise<LikeRecord>;
}

export interface LikeRepository {
  /**
   * Returns all liked image identifiers from the database.
   */
  getLikedImageIds(): Promise<readonly string[]>;
  /**
   * Persists the current liked state for one image.
   */
  saveLike(payload: UpdateLikeRequest): Promise<LikeRecord>;
}

/**
 * Creates a repository backed by a Prisma Like delegate.
 */
export function createLikeRepository(
  delegate: LikeRepositoryDelegate,
): LikeRepository {
  return {
    /**
     * Reads liked image ids in the order they were most recently updated.
     */
    async getLikedImageIds(): Promise<readonly string[]> {
      // This query loads only liked rows so higher layers can bootstrap like state after refresh.
      // It exists to keep database filtering inside the repository instead of duplicating it elsewhere.
      const records = await delegate.findMany(buildFindLikedImageIdsQuery());
      return mapLikeRecordsToImageIds(records);
    },

    /**
     * Creates or updates the like record for a single image.
     */
    async saveLike(payload: UpdateLikeRequest): Promise<LikeRecord> {
      // This query upserts by imageId so the application can persist like toggles with one write path.
      // It exists to make repeated writes deterministic and avoid separate read-before-write logic.
      return delegate.upsert(buildUpsertLikeQuery(payload));
    },
  };
}

/**
 * Returns the default repository backed by the shared Prisma client.
 */
export function getLikeRepository(): LikeRepository {
  return createLikeRepository(getPrismaClient().like);
}
