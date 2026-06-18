/**
 * Shared utilities for request-state classification.
 * This file exists to normalize errors into UI-friendly categories so the app can render graceful state variants consistently.
 * It interacts with state components, API clients, and route entry modules.
 */
import { AppRequestError, type RequestErrorKind } from "../types/api";

/**
 * Returns the UI-facing error kind for a status code or low-level fetch failure.
 */
export function inferRequestErrorKind(
  status?: number,
  error?: unknown,
): RequestErrorKind {
  if (status === 429) {
    return "rate_limit";
  }

  if (error instanceof TypeError) {
    return "network";
  }

  return "generic";
}

/**
 * Normalizes unknown thrown values into a typed request error.
 */
export function toAppRequestError(
  error: unknown,
  fallbackMessage: string,
): AppRequestError {
  if (error instanceof AppRequestError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppRequestError(error.message, {
      kind: inferRequestErrorKind(undefined, error),
    });
  }

  return new AppRequestError(fallbackMessage);
}
