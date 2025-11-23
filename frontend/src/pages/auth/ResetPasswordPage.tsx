import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { resetPassword } from "@/api/auth";
import {
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "@/utils/api-helpers";

type ResetPasswordForm = z.infer<ReturnType<typeof createResetPasswordSchema>>;

function createResetPasswordSchema(t: TFunction<"translation", undefined>) {
  return z
    .object({
      newPassword: z
        .string()
        .min(8, t("validation.passwordMin8"))
        .regex(/[A-Z]/, t("validation.passwordUppercase"))
        .regex(/[a-z]/, t("validation.passwordLowercase"))
        .regex(/[0-9]/, t("validation.passwordNumber"))
        .regex(/[^A-Za-z0-9]/, t("validation.passwordSpecial")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
}

function calculatePasswordStrength(password: string): {
  strength: "Weak" | "Fair" | "Good" | "Excellent";
  strengthKey: string;
  percentage: number;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      strength: "Weak",
      strengthKey: "auth.resetPassword.weak",
      percentage: 33,
      color: "bg-red-500",
    };
  } else if (score === 3 || score === 4) {
    return {
      strength: "Fair",
      strengthKey: "auth.resetPassword.fair",
      percentage: 66,
      color: "bg-yellow-500",
    };
  } else if (score === 5) {
    return {
      strength: "Good",
      strengthKey: "auth.resetPassword.good",
      percentage: 85,
      color: "bg-blue-500",
    };
  } else {
    return {
      strength: "Excellent",
      strengthKey: "auth.resetPassword.excellent",
      percentage: 100,
      color: "bg-success-500",
    };
  }
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const resetPasswordSchema = createResetPasswordSchema(t);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword", "");
  const passwordStrength = newPassword
    ? calculatePasswordStrength(newPassword)
    : null;

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error(t("errors.invalidToken"));
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: data.newPassword,
      });

      if (isSuccessResponse(response)) {
        toast.success(
          response.data.message || t("success.resetPasswordSuccess")
        );
        navigate("/login");
      } else if (isErrorResponse(response)) {
        toast.error(getErrorMessage(response));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.resetPasswordFailed"));
      }
    }
  };

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
        <div className="w-full max-w-md">
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <KeyRound className="w-24 h-24 text-primary-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 text-center">
            {t("auth.resetPassword.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-8 text-center">
            {t("auth.resetPassword.subtitle")}
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Input */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.resetPassword.newPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("newPassword")}
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && passwordStrength && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-600">
                      {t("auth.resetPassword.passwordStrength")}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength === "Excellent"
                          ? "text-success-600"
                          : passwordStrength.strength === "Good"
                            ? "text-blue-600"
                            : passwordStrength.strength === "Fair"
                              ? "text-yellow-600"
                              : "text-red-600"
                      }`}
                    >
                      {t(passwordStrength.strengthKey as any)}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.resetPassword.confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t(
                    "auth.resetPassword.confirmPasswordPlaceholder"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
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
                ? t("auth.resetPassword.resetting")
                : t("auth.resetPassword.resetPassword")}
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
