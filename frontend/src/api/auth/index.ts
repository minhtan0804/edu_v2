import { request } from "@/api/axios";
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailResponse,
} from "@/interfaces/auth";

const AUTH_API_BASE = "/auth";

export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return request.post<LoginRequest, LoginResponse>(
    `${AUTH_API_BASE}/login`,
    data,
    { skipAuth: true }
  );
};

export const register = (data: RegisterRequest): Promise<RegisterResponse> => {
  return request.post<RegisterRequest, RegisterResponse>(
    `${AUTH_API_BASE}/register`,
    data,
    { skipAuth: true }
  );
};

export const forgotPassword = (
  data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  return request.post<ForgotPasswordRequest, ForgotPasswordResponse>(
    `${AUTH_API_BASE}/forgot-password`,
    data,
    { skipAuth: true }
  );
};

export const resetPassword = (
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return request.post<ResetPasswordRequest, ResetPasswordResponse>(
    `${AUTH_API_BASE}/reset-password`,
    data,
    { skipAuth: true }
  );
};

export const verifyEmail = (token: string): Promise<VerifyEmailResponse> => {
  return request.get<VerifyEmailResponse>(
    `${AUTH_API_BASE}/verify-email?token=${token}`,
    { skipAuth: true }
  );
};

export const resendVerification = (
  data: ResendVerificationRequest
): Promise<ResendVerificationResponse> => {
  return request.post<ResendVerificationRequest, ResendVerificationResponse>(
    `${AUTH_API_BASE}/resend-verification`,
    data,
    { skipAuth: true }
  );
};
