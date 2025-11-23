import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  forgotPassword as forgotPasswordApi,
  login as loginApi,
  register as registerApi,
  resendVerification as resendVerificationApi,
  resetPassword as resetPasswordApi,
  verifyEmail as verifyEmailApi,
} from "@/api/auth";
import { PATHS } from "@/constants/common";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
} from "@/interfaces/auth";
import { useAuthStore } from "@/store/authStore";
import { getErrorMessage, isSuccessResponse } from "@/utils/api-helpers";

// ============================================================================
// Fetcher Functions
// ============================================================================

const loginFetcher = async (
  payload: LoginRequest
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}> => {
  const response = await loginApi(payload);
  if (isSuccessResponse(response)) {
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      refreshExpiresIn: response.data.refreshExpiresIn,
    };
  }
  throw new Error(getErrorMessage(response));
};

const registerFetcher = async (
  payload: RegisterRequest
): Promise<{ message: string; email: string }> => {
  const response = await registerApi(payload);
  if (isSuccessResponse(response)) {
    return {
      message: response.data.message,
      email: payload.email,
    };
  }
  throw new Error(getErrorMessage(response));
};

const forgotPasswordFetcher = async (
  payload: ForgotPasswordRequest
): Promise<string> => {
  const response = await forgotPasswordApi(payload);
  if (isSuccessResponse(response)) {
    return response.data.message;
  }
  throw new Error(getErrorMessage(response));
};

const resetPasswordFetcher = async (
  payload: ResetPasswordRequest
): Promise<string> => {
  const response = await resetPasswordApi(payload);
  if (isSuccessResponse(response)) {
    return response.data.message;
  }
  throw new Error(getErrorMessage(response));
};

const resendVerificationFetcher = async (
  payload: ResendVerificationRequest
): Promise<string> => {
  const response = await resendVerificationApi(payload);
  if (isSuccessResponse(response)) {
    return response.data.message;
  }
  throw new Error(getErrorMessage(response));
};

const verifyEmailFetcher = async (token: string): Promise<string> => {
  const response = await verifyEmailApi(token);
  if (isSuccessResponse(response)) {
    return response.data.message;
  }
  throw new Error(getErrorMessage(response));
};

// ============================================================================
// Mutation Hooks
// ============================================================================

export const useLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginFetcher,
    onSuccess: async (data) => {
      await login(
        data.accessToken,
        data.refreshToken,
        data.expiresIn,
        data.refreshExpiresIn
      );
      toast.success(t("auth.login.success") || "Login successful!");
      navigate(PATHS.HOME);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.loginFailed"));
      }
    },
  });
};

export const useRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerFetcher,
    onSuccess: (data) => {
      toast.success(data.message || t("success.registrationSuccess"));
      navigate(PATHS.CHECK_EMAIL, {
        state: { email: data.email },
      });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.registrationFailed"));
      }
    },
  });
};

export const useForgotPassword = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: forgotPasswordFetcher,
    onSuccess: (message) => {
      toast.success(message || t("auth.forgotPassword.emailSentMessage"));
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.sendEmailFailed"));
      }
    },
  });
};

export const useResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordFetcher,
    onSuccess: (message) => {
      toast.success(message || t("success.resetPasswordSuccess"));
      navigate(PATHS.LOGIN);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.resetPasswordFailed"));
      }
    },
  });
};

export const useResendVerification = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: resendVerificationFetcher,
    onSuccess: (message) => {
      toast.success(message || t("auth.resendVerification.emailSent"));
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.sendEmailFailed"));
      }
    },
  });
};

// ============================================================================
// Query Hooks
// ============================================================================

export const useVerifyEmail = (token: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.auth.verifyEmail(token || ""),
    queryFn: () => verifyEmailFetcher(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
