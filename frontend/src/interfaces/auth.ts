import type { ApiResponse, User } from "./common";

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Auth Response Data Types
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  refreshExpiresIn: number; // seconds
  user: User;
}

export interface RegisterResponseData {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    emailVerified: boolean;
    createdAt: string;
  };
  message: string;
}

export interface MessageResponseData {
  message: string;
}

// Auth Response Types
export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<RegisterResponseData>;
export type ForgotPasswordResponse = ApiResponse<MessageResponseData>;
export type ResetPasswordResponse = ApiResponse<MessageResponseData>;
export type VerifyEmailResponse = ApiResponse<MessageResponseData>;
export type ResendVerificationResponse = ApiResponse<MessageResponseData>;
