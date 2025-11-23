import type {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
} from "@/interfaces/common";

/**
 * Type guard to check if response is success
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true && "data" in response;
}

/**
 * Type guard to check if response is error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Get error message from response
 */
export function getErrorMessage(response: ApiErrorResponse): string {
  return response.error.message;
}

/**
 * Get error code from response
 */
export function getErrorCode(response: ApiErrorResponse): string | undefined {
  return response.error.code;
}

/**
 * Get error details from response (for validation errors)
 */
export function getErrorDetails(
  response: ApiErrorResponse
): Record<string, string> | undefined {
  return response.error.details;
}

/**
 * Extract data from success response (throws error if not success)
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error.message);
}
