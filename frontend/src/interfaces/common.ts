import { User } from "@/interfaces/auth";

/**
 * 1. Standard Error Structure
 */
export interface ApiError {
  message: string;
  code?: string; // Internal error code (e.g., 'VALIDATION_FAILED')
  details?: Record<string, string>; // Detailed errors for each field
}

/**
 * 2. Pagination Metadata Structure
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// ------------------------------------------------------------------

/**
 * 3. Common Response Structure
 *
 * This is a Discriminated Union based on 'success'.
 */
export type ApiSuccessResponse<T> = {
  success: true;

  /** Response data (can be object, array, string, etc.) */
  data: T;

  /**
   * Pagination metadata.
   * Only appears when 'data' is a paginated list.
   */
  pagination?: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiError;

  // Ensure data and pagination don't exist when error
  data?: never;
  pagination?: never;
};

/**
 * Final type to use for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Refresh Token Response
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  refreshExpiresIn: number; // seconds
  user: User;
}
