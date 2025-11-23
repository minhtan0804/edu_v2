import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { login as loginUser } from "@/api/auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { PATHS } from "@/constants/common";
import { useAuthStore } from "@/store/authStore";
import {
  getErrorMessage,
  isErrorResponse,
  isSuccessResponse,
} from "@/utils/api-helpers";

type LoginForm = z.infer<ReturnType<typeof createLoginSchema>>;

function createLoginSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
    password: z.string().min(6, t("validation.passwordMin")),
  });
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginSchema = createLoginSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginUser(data);

      if (isSuccessResponse(response)) {
        const {
          accessToken,
          refreshToken,
          expiresIn,
          refreshExpiresIn,
          user,
        } = response.data;
        login(accessToken, refreshToken, expiresIn, refreshExpiresIn, user);
        toast.success(t("auth.login.success") || "Login successful!");
        navigate("/");
      } else if (isErrorResponse(response)) {
        toast.error(getErrorMessage(response));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("errors.loginFailed"));
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

          {/* Right side: Language Switcher and Register Link */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="text-sm sm:text-base">
              <span className="text-neutral-600">
                {t("auth.login.dontHaveAccount")}{" "}
              </span>
              <Link
                to={PATHS.REGISTER}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {t("auth.login.registerNow")}
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
            {t("auth.login.title")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-8">
            {t("auth.login.subtitle")}
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.login.emailPlaceholder")}
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
                {t("auth.login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder={t("auth.login.passwordPlaceholder")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <Link
                to={PATHS.FORGOT_PASSWORD}
                className="text-sm text-primary-500 hover:text-primary-600 mt-2 inline-block"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("auth.login.signingIn")
                : t("auth.login.continue")}
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
