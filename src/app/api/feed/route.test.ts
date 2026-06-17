/**
 * Tests for the feed API route handlers.
 * This file exists to verify validation, provider delegation, and error handling without requiring a running server.
 * It interacts with src/app/api/feed/route.ts and the feed provider service layer.
 */
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  createFeedRouteHandlers,
  type FeedRouteService,
} from "../../../services/server/feed-route-service";

describe("feed route", () => {
  it("returns a paginated feed response for valid query params", async () => {
    const service: FeedRouteService = {
      getFeedPage: vi.fn().mockResolvedValue({
        images: [],
        page: 2,
        hasMore: false,
      }),
    };
    const handlers = createFeedRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/feed?page=2&limit=5");

    const response = await handlers.GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      images: [],
      page: 2,
      hasMore: false,
    });
  });

  it("returns 400 when page is invalid", async () => {
    const service: FeedRouteService = {
      getFeedPage: vi.fn(),
    };
    const handlers = createFeedRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/feed?page=0&limit=10");

    const response = await handlers.GET(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "INVALID_PAGE",
      },
    });
    expect(service.getFeedPage).not.toHaveBeenCalled();
  });

  it("returns 400 when limit is invalid", async () => {
    const service: FeedRouteService = {
      getFeedPage: vi.fn(),
    };
    const handlers = createFeedRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/feed?page=1&limit=99");

    const response = await handlers.GET(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "INVALID_LIMIT",
      },
    });
  });

  it("returns upstream status when the provider service fails", async () => {
    const service: FeedRouteService = {
      getFeedPage: vi.fn().mockRejectedValue({
        code: "IMAGE_PROVIDER_REQUEST_FAILED",
        message: "Provider failed",
        status: 503,
      }),
    };
    const handlers = createFeedRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/feed?page=1&limit=10");

    const response = await handlers.GET(request);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "IMAGE_PROVIDER_REQUEST_FAILED",
      },
    });
  });
});
