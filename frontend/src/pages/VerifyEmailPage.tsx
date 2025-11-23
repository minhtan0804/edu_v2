import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";

import { verifyEmail } from "../api/auth";
import type { ApiResponse } from "../interfaces/common";
import {
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "../utils/api-helpers";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Use React Query to handle verify email API call
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => {
      if (!token) {
        throw new Error(t("auth.verifyEmail.invalidTokenMessage"));
      }
      return verifyEmail(token);
    },
    enabled: !!token, // Only run query if token exists
    retry: false, // Don't retry on failure
    staleTime: Infinity, // Don't refetch if already fetched
    gcTime: Infinity, // Keep in cache forever (since token can only be used once)
  });

  // Handle redirects based on query state
  useEffect(() => {
    // If no token, redirect to error page
    if (!token) {
      navigate("/verify-email/error", {
        replace: true,
        state: { error: t("auth.verifyEmail.invalidTokenMessage") },
      });
      return;
    }

    // If query is successful
    if (response && isSuccessResponse(response)) {
      // Redirect to login after 3 seconds
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }

    // If query has error
    if (isError && error) {
      let errorMessage = t("errors.verificationFailed") || "Verification failed";

      // Extract error from AxiosError
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<ApiResponse<unknown>>;
        const errorResponse = axiosError.response?.data;

        if (errorResponse && isErrorResponse(errorResponse)) {
          errorMessage = getErrorMessage(errorResponse);
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      navigate("/verify-email/error", {
        replace: true,
        state: { error: errorMessage },
      });
    }
  }, [token, response, isError, error, navigate, t]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">E</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              {t("common.appName")}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md text-center">
          {isLoading && (
            <div>
              <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                {t("auth.verifyEmail.verifying")}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600">
                {t("auth.verifyEmail.verifyingMessage")}
              </p>
            </div>
          )}

          {response && isSuccessResponse(response) && (
            <div>
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                {t("auth.verifyEmail.success")}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 mb-6">
                {response.data.message || t("auth.verifyEmail.successMessage")}
              </p>
              <p className="text-sm text-neutral-500">
                {t("auth.verifyEmail.redirecting")}
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-500">
          <span>{t("common.copyright")}</span>
          <Link
            to="/privacy-policy"
            className="hover:text-neutral-700 transition-colors"
          >
            {t("common.privacyPolicy")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
