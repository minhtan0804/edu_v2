import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { register as registerUser } from "@/api/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PATHS } from "@/constants/common";
import {
  getErrorDetails,
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "@/utils/api-helpers";

type RegisterForm = z.infer<ReturnType<typeof createRegisterSchema>>;

function createRegisterSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
    fullName: z.string().optional(),
  });
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const registerSchema = createRegisterSchema(t);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const response = await registerUser(data);

      if (isSuccessResponse(response)) {
        // TypeScript knows response.data exists and has type RegisterResponseData
        const responseData = response.data;
        toast.success(responseData.message || t("success.registrationSuccess"));
        // Navigate to check email page with email
        navigate("/check-email", {
          state: { email: data.email },
        });
      } else if (isErrorResponse(response)) {
        const errorMessage = getErrorMessage(response);
        const errorDetails = getErrorDetails(response);

        toast.error(errorMessage);

        // Set field errors if validation details exist
        if (errorDetails) {
          Object.entries(errorDetails).forEach(([field, message]) => {
            setError(field as keyof RegisterForm, { message });
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.registrationFailed"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">E</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              {t("common.appName")}
            </span>
          </div>

          {/* Right side: Language Switcher and Login Link */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-sm sm:text-base">
              <span className="text-neutral-600">
                {t("auth.register.alreadyHaveAccount")}{" "}
              </span>
              <Link
                to={PATHS.LOGIN}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {t("auth.register.signIn")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            {t("auth.register.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-8">
            {t("auth.register.subtitle")}
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.register.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("fullName")}
                  type="text"
                  id="fullName"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.register.fullNamePlaceholder")}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.register.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.register.emailPlaceholder")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.register.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.register.passwordPlaceholder")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("auth.register.creatingAccount")
                : t("auth.register.createAccount")}
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
