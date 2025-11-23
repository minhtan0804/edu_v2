import type { ApiResponse } from "./common";

// Instructor Verification Request Types
export interface SubmitVerificationRequest {
  bio?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  certificates?: string;
}

export interface VerifyInstructorRequest {
  userId: string;
  isVerified: boolean;
}

// Instructor Verification Response Data Types
export interface InstructorVerificationData {
  id: string;
  userId: string;
  bio?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  certificates?: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    role: "USER" | "INSTRUCTOR" | "ADMIN";
  };
}

// Instructor Verification Response Types
export type SubmitVerificationResponse = ApiResponse<InstructorVerificationData>;
export type GetMyVerificationResponse = ApiResponse<InstructorVerificationData>;
export type GetAllPendingVerificationsResponse = ApiResponse<
  InstructorVerificationData[]
>;
export type VerifyInstructorResponse = ApiResponse<InstructorVerificationData>;

