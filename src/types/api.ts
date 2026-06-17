/**
 * Shared API response types for predictable frontend and backend error handling.
 */
export interface ApiErrorResponse {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}
