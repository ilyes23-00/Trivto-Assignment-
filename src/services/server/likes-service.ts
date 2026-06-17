/**
 * Server-side likes service that coordinates repository access for the likes API.
 * This file exists to keep business decisions about like reads and writes out of the route handlers.
 * It interacts with src/database/repositories/like-repository.ts and src/types/like.ts.
 */
import {
  getLikeRepository,
  type LikeRepository,
} from "../../database/repositories/like-repository";
import type {
  LikesResponse,
  UpdateLikeRequest,
  UpdateLikeResponse,
} from "../../types/like";

export type LikesServiceRepository = Pick<
  LikeRepository,
  "getLikedImageIds" | "saveLike"
>;

export interface LikesService {
  /**
   * Returns the current liked image ids for API consumers.
   */
  getLikes(): Promise<LikesResponse>;
  /**
   * Persists the latest liked state for one image.
   */
  updateLike(payload: UpdateLikeRequest): Promise<UpdateLikeResponse>;
}

/**
 * Creates the likes service with an injected repository dependency.
 */
export function createLikesService(
  repository: LikesServiceRepository,
): LikesService {
  return {
    /**
     * Loads the liked image ids through the repository layer.
     */
    async getLikes(): Promise<LikesResponse> {
      const likedImageIds = await repository.getLikedImageIds();
      return { likedImageIds };
    },

    /**
     * Persists one like payload and returns the API-facing write result.
     */
    async updateLike(
      payload: UpdateLikeRequest,
    ): Promise<UpdateLikeResponse> {
      const likeRecord = await repository.saveLike(payload);

      return {
        success: true,
        imageId: likeRecord.imageId,
        liked: likeRecord.liked,
      };
    },
  };
}

/**
 * Returns the default likes service backed by the like repository.
 */
export function getLikesService(): LikesService {
  return createLikesService(getLikeRepository());
}
