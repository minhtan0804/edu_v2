import { request } from "@/api/axios";
import type {
  GetAllPendingVerificationsResponse,
  GetMyVerificationResponse,
  SubmitVerificationRequest,
  SubmitVerificationResponse,
  VerifyInstructorRequest,
  VerifyInstructorResponse,
} from "@/interfaces/instructor";

const INSTRUCTOR_API_BASE = "/instructor";

export const submitVerification = (
  data: SubmitVerificationRequest
): Promise<SubmitVerificationResponse> => {
  return request.post<SubmitVerificationRequest, SubmitVerificationResponse>(
    `${INSTRUCTOR_API_BASE}/verification`,
    data
  );
};

export const getMyVerification = (): Promise<GetMyVerificationResponse> => {
  return request.get<GetMyVerificationResponse>(
    `${INSTRUCTOR_API_BASE}/verification/my`
  );
};

export const getAllPendingVerifications =
  (): Promise<GetAllPendingVerificationsResponse> => {
    return request.get<GetAllPendingVerificationsResponse>(
      `${INSTRUCTOR_API_BASE}/verification/pending`
    );
  };

export const verifyInstructor = (
  data: VerifyInstructorRequest
): Promise<VerifyInstructorResponse> => {
  return request.put<VerifyInstructorRequest, VerifyInstructorResponse>(
    `${INSTRUCTOR_API_BASE}/verification/verify`,
    data
  );
};
