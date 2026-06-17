/**
 * Query helper functions for the like persistence layer.
 * This file exists to centralize Prisma query shapes so the repository stays small and easy to explain.
 * It interacts with src/database/repositories/like-repository.ts and src/types/like.ts.
 */
import type { UpdateLikeRequest } from "../../types/like";

interface LikeImageIdRecord {
  readonly imageId: string;
}

export interface FindLikedImageIdsQuery {
  readonly where: {
    readonly liked: true;
  };
  readonly select: {
    readonly imageId: true;
  };
  readonly orderBy: {
    readonly updatedAt: "desc";
  };
}

export interface UpsertLikeQuery {
  readonly where: {
    readonly imageId: string;
  };
  readonly create: {
    readonly imageId: string;
    readonly liked: boolean;
  };
  readonly update: {
    readonly liked: boolean;
  };
}

/**
 * Builds the Prisma query used to read only liked image identifiers.
 */
export function buildFindLikedImageIdsQuery(): FindLikedImageIdsQuery {
  // This query reads only rows that are currently liked so refresh restores the frontend's liked state.
  // It exists to avoid loading unnecessary columns when the caller only needs image identifiers.
  return {
    where: { liked: true },
    select: { imageId: true },
    orderBy: { updatedAt: "desc" },
  };
}

/**
 * Builds the Prisma query used to create or update a like record by image id.
 */
export function buildUpsertLikeQuery(
  payload: UpdateLikeRequest,
): UpsertLikeQuery {
  // This query upserts one Like row by imageId so repeated like writes stay idempotent.
  // It exists to support refresh persistence without forcing callers to check whether a row already exists.
  return {
    where: { imageId: payload.imageId },
    create: {
      imageId: payload.imageId,
      liked: payload.liked,
    },
    update: {
      liked: payload.liked,
    },
  };
}

/**
 * Maps database records into the flat liked image id list expected by callers.
 */
export function mapLikeRecordsToImageIds(
  records: readonly LikeImageIdRecord[],
): readonly string[] {
  return records.map((record) => record.imageId);
}
