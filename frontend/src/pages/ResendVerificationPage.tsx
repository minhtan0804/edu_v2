import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { CheckCircle, Mail, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { resendVerification } from "../api/auth";
import {
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "../utils/api-helpers";

type ResendForm = z.infer<ReturnType<typeof createResendSchema>>;

function createResendSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
  });
}

export default function ResendVerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get email from location state
  const emailFromState = (location.state as { email?: string })?.email || "";

  const resendSchema = createResendSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendForm>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: emailFromState,
    },
  });

  const onSubmit = async (data: ResendForm) => {
    try {
      setError("");
      const response = await resendVerification(data);

      if (isSuccessResponse(response)) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (isErrorResponse(response)) {
        setError(getErrorMessage(response));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("errors.resendVerificationFailed"));
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">
                  E
                </span>
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
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
              {t("auth.resendVerification.emailSent")}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mb-6">
              {t("auth.resendVerification.emailSentMessage")}
            </p>
            <p className="text-sm text-neutral-500">
              {t("auth.resendVerification.redirecting")}
            </p>
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
          <Link
            to="/login"
            className="text-sm sm:text-base text-primary-500 hover:text-primary-600 font-medium"
          >
            {t("auth.resendVerification.backToLogin")}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <MailCheck className="w-24 h-24 text-primary-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 text-center">
            {t("auth.resendVerification.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-8 text-center">
            {t("auth.resendVerification.subtitle")}
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.resendVerification.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.resendVerification.emailPlaceholder")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("auth.resendVerification.sending")
                : t("auth.resendVerification.sendVerification")}
            </button>
          </form>
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
