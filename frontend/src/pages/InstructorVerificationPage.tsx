import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, GraduationCap, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { getMyVerification, submitVerification } from "@/api/instructor";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PATHS } from "@/constants/common";
import { useAuthStore } from "@/store/authStore";
import {
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "@/utils/api-helpers";

type VerificationForm = z.infer<ReturnType<typeof createVerificationSchema>>;

function createVerificationSchema() {
  return z.object({
    bio: z.string().optional(),
    specialization: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    certificates: z.string().optional(),
  });
}

export default function InstructorVerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<{
    isVerified: boolean;
    verifiedAt?: string;
  } | null>(null);

  const verificationSchema = createVerificationSchema();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
  });

  useEffect(() => {
    // Check if user is logged in and is an instructor
    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }

    if (user.role !== "INSTRUCTOR") {
      navigate("/");
      return;
    }

    // Load existing verification
    const loadVerification = async () => {
      try {
        const response = await getMyVerification();
        if (isSuccessResponse(response)) {
          const data = response.data;
          setVerification({
            isVerified: data.isVerified,
            verifiedAt: data.verifiedAt,
          });
          reset({
            bio: data.bio || "",
            specialization: data.specialization || "",
            experience: data.experience || "",
            education: data.education || "",
            certificates: data.certificates || "",
          });
        }
      } catch (error) {
        console.error("Failed to load verification:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVerification();
  }, [user, navigate, reset]);

  const onSubmit = async (data: VerificationForm) => {
    try {
      const response = await submitVerification(data);

      if (isSuccessResponse(response)) {
        const responseData = response.data;
        setVerification({
          isVerified: responseData.isVerified,
          verifiedAt: responseData.verifiedAt,
        });
        toast.success(
          responseData.isVerified
            ? t("instructor.verification.updateSuccess")
            : t("instructor.verification.success")
        );
      } else if (isErrorResponse(response)) {
        toast.error(getErrorMessage(response));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit verification");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">E</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              {t("common.appName")}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-primary-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
                {t("instructor.verification.title")}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-neutral-600">
              {t("instructor.verification.subtitle")}
            </p>
          </div>

          {/* Verification Status */}
          {verification && (
            <div className="mb-6 p-4 rounded-lg border-2 border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3">
                {verification.isVerified ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-success-600" />
                    <div>
                      <div className="font-medium text-neutral-900">
                        {t("instructor.verification.verified")}
                      </div>
                      {verification.verifiedAt && (
                        <div className="text-sm text-neutral-600">
                          Verified on:{" "}
                          {new Date(
                            verification.verifiedAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-warning-600" />
                    <div>
                      <div className="font-medium text-neutral-900">
                        {t("instructor.verification.pending")}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {t("instructor.verification.successMessage")}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("instructor.verification.bio")}
              </label>
              <textarea
                {...register("bio")}
                id="bio"
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder={t("instructor.verification.bioPlaceholder")}
              />
            </div>

            {/* Specialization */}
            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("instructor.verification.specialization")}
              </label>
              <input
                {...register("specialization")}
                type="text"
                id="specialization"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder={t(
                  "instructor.verification.specializationPlaceholder"
                )}
              />
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("instructor.verification.experience")}
              </label>
              <textarea
                {...register("experience")}
                id="experience"
                rows={4}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder={t("instructor.verification.experiencePlaceholder")}
              />
            </div>

            {/* Education */}
            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("instructor.verification.education")}
              </label>
              <textarea
                {...register("education")}
                id="education"
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder={t("instructor.verification.educationPlaceholder")}
              />
            </div>

            {/* Certificates */}
            <div>
              <label
                htmlFor="certificates"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("instructor.verification.certificates")}
              </label>
              <textarea
                {...register("certificates")}
                id="certificates"
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                placeholder={t(
                  "instructor.verification.certificatesPlaceholder"
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || verification?.isVerified}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("instructor.verification.submitting")
                  : verification?.isVerified
                    ? t("instructor.verification.update")
                    : t("instructor.verification.submit")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
