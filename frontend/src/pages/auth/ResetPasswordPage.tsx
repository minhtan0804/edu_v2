import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button, Input } from "@/components/ui";
import { Typography } from "@/components/ui";
import { useResetPassword } from "@/hooks/useAuth";

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
      color: "bg-destructive",
    };
  } else if (score === 3 || score === 4) {
    return {
      strength: "Fair",
      strengthKey: "auth.resetPassword.fair",
      percentage: 66,
      color: "bg-warning-DEFAULT",
    };
  } else if (score === 5) {
    return {
      strength: "Good",
      strengthKey: "auth.resetPassword.good",
      percentage: 85,
      color: "bg-info-DEFAULT",
    };
  } else {
    return {
      strength: "Excellent",
      strengthKey: "auth.resetPassword.excellent",
      percentage: 100,
      color: "bg-success-DEFAULT",
    };
  }
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const resetPasswordSchema = createResetPasswordSchema(t);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPasswordFn, isPending: isSubmitting } =
    useResetPassword();

  // eslint-disable-next-line react-hooks/incompatible-library
  const newPassword = watch("newPassword", "");
  const passwordStrength = newPassword
    ? calculatePasswordStrength(newPassword)
    : null;

  const onSubmit = (data: ResetPasswordForm) => {
    if (!token) {
      toast.error(t("errors.invalidToken"));
      return;
    }

    resetPasswordFn({
      token,
      password: data.newPassword,
    });
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
            <Typography variant="h6" className="text-lg sm:text-xl">
              {t("common.appName")}
            </Typography>
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
          <Typography variant="h1" className="mb-2 text-center">
            {t("auth.resetPassword.title")}
          </Typography>
          <Typography variant="muted" className="mb-8 text-center">
            {t("auth.resetPassword.subtitle")}
          </Typography>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Input */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.resetPassword.newPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("newPassword")}
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="pl-10 pr-10"
                  placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <Typography variant="small" className="mt-1 text-destructive">
                  {errors.newPassword.message}
                </Typography>
              )}

              {/* Password Strength Indicator */}
              {newPassword && passwordStrength && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <Typography
                      variant="small"
                      className="text-muted-foreground"
                    >
                      {t("auth.resetPassword.passwordStrength")}
                    </Typography>
                    <Typography
                      variant="small"
                      className={`font-medium ${
                        passwordStrength.strength === "Excellent"
                          ? "text-success-DEFAULT"
                          : passwordStrength.strength === "Good"
                            ? "text-info-DEFAULT"
                            : passwordStrength.strength === "Fair"
                              ? "text-warning-DEFAULT"
                              : "text-destructive"
                      }`}
                    >
                      {t(passwordStrength.strengthKey as never)}
                    </Typography>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
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
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.resetPassword.confirmPassword")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  id="confirmPassword"
                  className="pl-10"
                  placeholder={t(
                    "auth.resetPassword.confirmPasswordPlaceholder"
                  )}
                />
              </div>
              {errors.confirmPassword && (
                <Typography variant="small" className="mt-1 text-destructive">
                  {errors.confirmPassword.message}
                </Typography>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting
                ? t("auth.resetPassword.resetting")
                : t("auth.resetPassword.resetPassword")}
            </Button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>{t("common.copyright")}</span>
          <Link
            to="/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            {t("common.privacyPolicy")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
