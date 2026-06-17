/**
 * Likes API route for reading and updating persistent liked image state.
 *
 * Description:
 * Exposes thin GET and POST handlers that validate requests and delegate business logic to the likes service.
 *
 * Request examples:
 * GET /api/likes
 * POST /api/likes
 * {
 *   "imageId": "12",
 *   "liked": true
 * }
 *
 * Success response examples:
 * {
 *   "likedImageIds": ["12", "42"]
 * }
 *
 * {
 *   "success": true,
 *   "imageId": "12",
 *   "liked": true
 * }
 *
 * Error response example:
 * {
 *   "error": {
 *     "code": "INVALID_IMAGE_ID",
 *     "message": "imageId is required."
 *   }
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { getLikesRouteHandlers } from "../../../services/server/likes-route-service";

const likesRouteHandlers = getLikesRouteHandlers();

/**
 * Route export used by Next.js for GET /api/likes.
 */
export async function GET(): Promise<NextResponse> {
  return likesRouteHandlers.GET();
}

/**
 * Route export used by Next.js for POST /api/likes.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return likesRouteHandlers.POST(request);
}
