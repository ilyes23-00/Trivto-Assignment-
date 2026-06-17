/**
 * Barrel file for database repository exports.
 * This file exists to give server-side callers one entrypoint into the repository layer.
 * It interacts with future service files and the repository implementation in this folder.
 */
export {
  createLikeRepository,
  getLikeRepository,
  type LikeRepository,
  type LikeRepositoryDelegate,
} from "./like-repository";
