/**
 * Route-facing service for the likes API endpoint.
 * This file exists to keep validation and response shaping out of the App Router entry module while delegating business logic to the likes service.
 * It interacts with src/app/api/likes/route.ts, src/services/server/likes-service.ts, and src/types/like.ts.
 */
import { NextRequest, NextResponse } from "next/server";
import { getLikesService, type LikesService } from "./likes-service";
import type {
  LikesResponse,
  UpdateLikeRequest,
  UpdateLikeResponse,
} from "../../types/like";

export type LikesRouteService = Pick<LikesService, "getLikes" | "updateLike">;

/**
 * Builds a consistent JSON error response for the likes route.
 */
function buildErrorResponse(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

/**
 * Reads and validates the POST body for like writes.
 */
async function parseUpdateLikeRequest(
  request: NextRequest,
): Promise<UpdateLikeRequest | NextResponse> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("Likes POST body parse error", error);
    return buildErrorResponse(400, "INVALID_JSON_BODY", "Request body must be valid JSON.");
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("imageId" in payload) ||
    typeof payload.imageId !== "string" ||
    payload.imageId.trim().length === 0
  ) {
    return buildErrorResponse(400, "INVALID_IMAGE_ID", "imageId is required.");
  }

  if (!("liked" in payload) || typeof payload.liked !== "boolean") {
    return buildErrorResponse(400, "INVALID_LIKED_VALUE", "liked must be a boolean.");
  }

  return {
    imageId: payload.imageId,
    liked: payload.liked,
  };
}

/**
 * Creates the likes route handlers with an injected service dependency.
 */
export function createLikesRouteHandlers(service: LikesRouteService): {
  GET(): Promise<NextResponse>;
  POST(request: NextRequest): Promise<NextResponse>;
} {
  return {
    /**
     * Returns the persisted liked image ids from the likes service.
     */
    async GET(): Promise<NextResponse> {
      try {
        const likesResponse: LikesResponse = await service.getLikes();
        return NextResponse.json(likesResponse, { status: 200 });
      } catch (error) {
        console.error("Likes GET API error", error);
        return buildErrorResponse(500, "INTERNAL_SERVER_ERROR", "Unable to load likes.");
      }
    },

    /**
     * Validates and persists one image like payload through the likes service.
     */
    async POST(request: NextRequest): Promise<NextResponse> {
      const payloadOrResponse = await parseUpdateLikeRequest(request);

      if (payloadOrResponse instanceof NextResponse) {
        return payloadOrResponse;
      }

      try {
        const updateResponse: UpdateLikeResponse = await service.updateLike(
          payloadOrResponse,
        );
        return NextResponse.json(updateResponse, { status: 200 });
      } catch (error) {
        console.error("Likes POST API error", error);
        return buildErrorResponse(500, "INTERNAL_SERVER_ERROR", "Unable to update like.");
      }
    },
  };
}

/**
 * Returns the default likes route handlers backed by the likes service.
 */
export function getLikesRouteHandlers(): {
  GET(): Promise<NextResponse>;
  POST(request: NextRequest): Promise<NextResponse>;
} {
  return createLikesRouteHandlers(getLikesService());
}
