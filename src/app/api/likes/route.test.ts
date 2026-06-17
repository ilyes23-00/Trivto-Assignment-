/**
 * Tests for the likes API route handlers.
 * This file exists to verify request validation, service delegation, and response shaping for the likes endpoints.
 * It interacts with src/app/api/likes/route.ts and the likes service layer.
 */
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  createLikesRouteHandlers,
  type LikesRouteService,
} from "../../../services/server/likes-route-service";

describe("likes route", () => {
  it("returns liked image ids from the service layer", async () => {
    const service: LikesRouteService = {
      getLikes: vi.fn().mockResolvedValue({
        likedImageIds: ["image-1"],
      }),
      updateLike: vi.fn(),
    };
    const handlers = createLikesRouteHandlers(service);

    const response = await handlers.GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      likedImageIds: ["image-1"],
    });
  });

  it("returns 400 when imageId is missing in POST", async () => {
    const service: LikesRouteService = {
      getLikes: vi.fn(),
      updateLike: vi.fn(),
    };
    const handlers = createLikesRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/likes", {
      method: "POST",
      body: JSON.stringify({ liked: true }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await handlers.POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "INVALID_IMAGE_ID",
      },
    });
  });

  it("returns 400 when liked is not a boolean in POST", async () => {
    const service: LikesRouteService = {
      getLikes: vi.fn(),
      updateLike: vi.fn(),
    };
    const handlers = createLikesRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/likes", {
      method: "POST",
      body: JSON.stringify({ imageId: "image-3", liked: "yes" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await handlers.POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: {
        code: "INVALID_LIKED_VALUE",
      },
    });
  });

  it("persists valid POST payloads through the service layer", async () => {
    const service: LikesRouteService = {
      getLikes: vi.fn(),
      updateLike: vi.fn().mockResolvedValue({
        success: true,
        imageId: "image-8",
        liked: false,
      }),
    };
    const handlers = createLikesRouteHandlers(service);
    const request = new NextRequest("http://localhost:3000/api/likes", {
      method: "POST",
      body: JSON.stringify({ imageId: "image-8", liked: false }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await handlers.POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      imageId: "image-8",
      liked: false,
    });
  });
});
