import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button, Input, Typography } from "@/components/ui";
import { PATHS } from "@/constants/common";
import { useRegister } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/api-helpers";

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
  const registerSchema = createRegisterSchema(t);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: registerUser, isPending: isSubmitting } = useRegister();

  const onSubmit = (data: RegisterForm) => {
    registerUser(data, {
      onError: (error: unknown) => {
        // Handle validation errors
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "data" in error.response
        ) {
          const errorData = error.response.data as {
            error?: { details?: Record<string, string> };
          };
          if (errorData?.error?.details) {
            Object.entries(errorData.error.details).forEach(
              ([field, message]) => {
                setError(field as keyof RegisterForm, { message });
              }
            );
          } else {
            toast.error(getErrorMessage(errorData as any));
          }
        }
      },
    });
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
            <Typography variant="h6" className="text-lg sm:text-xl">
              {t("common.appName")}
            </Typography>
          </div>

          {/* Right side: Language Switcher and Login Link */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-sm sm:text-base">
              <span className="text-muted-foreground">
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
          <Typography variant="h1" className="mb-2">
            {t("auth.register.title")}
          </Typography>
          <Typography variant="muted" className="mb-8">
            {t("auth.register.subtitle")}
          </Typography>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.register.fullName")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("fullName")}
                  type="text"
                  id="fullName"
                  className="pl-10"
                  placeholder={t("auth.register.fullNamePlaceholder")}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.register.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="pl-10"
                  placeholder={t("auth.register.emailPlaceholder")}
                />
              </div>
              {errors.email && (
                <Typography variant="small" className="mt-1 text-destructive">
                  {errors.email.message}
                </Typography>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.register.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="pl-10"
                  placeholder={t("auth.register.passwordPlaceholder")}
                />
              </div>
              {errors.password && (
                <Typography variant="small" className="mt-1 text-destructive">
                  {errors.password.message}
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
                ? t("auth.register.creatingAccount")
                : t("auth.register.createAccount")}
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
