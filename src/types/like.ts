/**
 * Shared like-related types used by the persistence and UI layers.
 * This file exists to keep like data contracts consistent across the repository, API, and frontend layers.
 * It interacts with src/database/repositories/like-repository.ts and future API and UI files.
 */
export interface LikeRecord {
  readonly imageId: string;
  readonly liked: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LikesResponse {
  readonly likedImageIds: readonly string[];
}

export interface UpdateLikeRequest {
  readonly imageId: string;
  readonly liked: boolean;
}

export interface UpdateLikeResponse {
  readonly success: true;
  readonly imageId: string;
  readonly liked: boolean;
}
