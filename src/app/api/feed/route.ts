/**
 * Feed API route for the backend-owned image feed endpoint.
 *
 * Description:
 * Returns one validated, normalized page of images from the internal service layer.
 *
 * Request example:
 * GET /api/feed?page=1&limit=10
 *
 * Success response example:
 * {
 *   "images": [],
 *   "page": 1,
 *   "hasMore": false
 * }
 *
 * Error response example:
 * {
 *   "error": {
 *     "code": "INVALID_PAGE",
 *     "message": "Page must be a positive integer."
 *   }
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { getFeedRouteHandlers } from "../../../services/server/feed-route-service";

const feedRouteHandlers = getFeedRouteHandlers();

/**
 * Route export used by Next.js for GET /api/feed.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return feedRouteHandlers.GET(request);
}
