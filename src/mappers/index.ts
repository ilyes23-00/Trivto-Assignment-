/**
 * Barrel file for image provider mapper exports.
 * This file exists to give services one import surface for response transformation logic.
 * It interacts with provider integration services and future backend callers.
 */
export { buildFeedResponse, mapPicsumImageToFeedImage } from "./picsum-feed-mapper";
