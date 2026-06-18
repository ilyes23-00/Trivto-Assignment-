/**
 * Shared API response types for predictable frontend and backend error handling.
 */
export interface ApiErrorResponse {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export type RequestErrorKind =
  | "generic"
  | "network"
  | "rate_limit";

/**
 * Typed request error shared across server and client request flows.
 */
export class AppRequestError extends Error {
  readonly code?: string;
  readonly kind: RequestErrorKind;
  readonly status?: number;

  constructor(
    message: string,
    options?: Readonly<{
      code?: string;
      kind?: RequestErrorKind;
      status?: number;
    }>,
  ) {
    super(message);
    this.name = "AppRequestError";
    this.code = options?.code;
    this.kind = options?.kind ?? "generic";
    this.status = options?.status;
  }
}
