import type { TFunction } from "i18next";
import { toast } from "react-toastify";

import type { ApiResponse } from "@/interfaces/common";

import { getErrorMessage, isErrorResponse } from "./api-helpers";

/**
 * Handle API error and show toast notification
 * @param error - The error object from API call
 * @param t - Translation function
 * @param defaultMessage - Default error message if error structure is invalid
 */
export function handleApiError(
  error: unknown,
  t: TFunction<"translation", undefined>,
  defaultMessage?: string
): void {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: unknown } };
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data as ApiResponse<unknown>;
      if (isErrorResponse(responseData)) {
        toast.error(getErrorMessage(responseData));
        return;
      }
    }
  }

  // Fallback to default message or generic error
  toast.error(
    defaultMessage ||
      t("errors.generic") ||
      "An error occurred. Please try again."
  );
}
