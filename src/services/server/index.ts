/**
 * Barrel file for backend service exports.
 * This file exists to provide one entrypoint for server-side integration services.
 * It interacts with future API routes and service consumers.
 */
export {
  buildPicsumFeedUrl,
  fetchPicsumFeedPage,
  ImageProviderError,
  assertPicsumPayload,
} from "./picsum-service";
