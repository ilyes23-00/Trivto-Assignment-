/**
 * Route-facing service for the feed API endpoint.
 * This file exists to keep validation and response shaping out of the App Router entry module while still delegating data loading to the Picsum service.
 * It interacts with src/app/api/feed/route.ts, src/services/server/picsum-service.ts, and src/types/feed.ts.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_FEED_LIMIT,
  DEFAULT_FEED_PAGE,
  MAX_FEED_LIMIT,
} from "../../lib/constants";
import {
  fetchPicsumFeedPage,
  ImageProviderError,
} from "./picsum-service";
import type { FeedResponse } from "../../types/feed";

export type FeedRouteService = {
  getFeedPage(page: number, limit: number): Promise<FeedResponse>;
};

/**
 * Parses and validates the page query parameter.
 */
function parsePageParam(rawPage: string | null): number | null {
  const page = Number(rawPage ?? DEFAULT_FEED_PAGE);
  return Number.isInteger(page) && page > 0 ? page : null;
}

/**
 * Parses and validates the limit query parameter.
 */
function parseLimitParam(rawLimit: string | null): number | null {
  const limit = Number(rawLimit ?? DEFAULT_FEED_LIMIT);
  return Number.isInteger(limit) && limit > 0 && limit <= MAX_FEED_LIMIT
    ? limit
    : null;
}

/**
 * Builds a consistent JSON error response for feed route failures.
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
 * Creates the feed route handlers with an injected service dependency.
 */
export function createFeedRouteHandlers(service: FeedRouteService): {
  GET(request: NextRequest): Promise<NextResponse>;
} {
  return {
    /**
     * Returns one validated page of feed images from the provider service layer.
     */
    async GET(request: NextRequest): Promise<NextResponse> {
      const { searchParams } = new URL(request.url);
      const page = parsePageParam(searchParams.get("page"));

      if (page === null) {
        return buildErrorResponse(
          400,
          "INVALID_PAGE",
          "Page must be a positive integer.",
        );
      }

      const limit = parseLimitParam(searchParams.get("limit"));

      if (limit === null) {
        return buildErrorResponse(
          400,
          "INVALID_LIMIT",
          `Limit must be a positive integer no greater than ${MAX_FEED_LIMIT}.`,
        );
      }

      try {
        const feedResponse = await service.getFeedPage(page, limit);
        return NextResponse.json(feedResponse, { status: 200 });
      } catch (error) {
        if (error instanceof ImageProviderError) {
          return buildErrorResponse(
            error.status ?? 502,
            error.code,
            error.message,
          );
        }

        if (
          typeof error === "object" &&
          error !== null &&
          "code" in error &&
          "message" in error
        ) {
          const providerError = error as {
            code: string;
            message: string;
            status?: number;
          };

          return buildErrorResponse(
            providerError.status ?? 502,
            providerError.code,
            providerError.message,
          );
        }

        console.error("Feed API error", error);
        return buildErrorResponse(500, "INTERNAL_SERVER_ERROR", "Unable to load feed.");
      }
    },
  };
}

/**
 * Returns the default feed route handlers backed by the Picsum integration service.
 */
export function getFeedRouteHandlers(): {
  GET(request: NextRequest): Promise<NextResponse>;
} {
  return createFeedRouteHandlers({
    /**
     * Loads one page of feed images from the Picsum integration service.
     */
    async getFeedPage(page: number, limit: number): Promise<FeedResponse> {
      return fetchPicsumFeedPage({ page, limit });
    },
  });
}
