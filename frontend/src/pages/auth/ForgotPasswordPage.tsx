import { zodResolver } from "@hookform/resolvers/zod";
import type { TFunction } from "i18next";
import { CheckCircle, Mail, MailQuestion } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button, Input } from "@/components/ui";
import { Typography } from "@/components/ui";
import { PATHS } from "@/constants/common";
import { useForgotPassword } from "@/hooks/useAuth";

type ForgotPasswordForm = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

function createForgotPasswordSchema(t: TFunction<"translation", undefined>) {
  return z.object({
    email: z.string().email(t("validation.emailInvalid")),
  });
}

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordSchema = createForgotPasswordSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: forgotPasswordFn, isPending: isSubmitting } =
    useForgotPassword();

  const onSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordFn(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
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
              <Typography variant="h6" className="text-lg sm:text-xl">
                {t("common.appName")}
              </Typography>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-600" />
            </div>
            <Typography variant="h1" className="mb-2">
              {t("auth.forgotPassword.emailSent")}
            </Typography>
            <Typography variant="muted" className="mb-6">
              {t("auth.forgotPassword.emailSentMessage")}
            </Typography>
            <Link
              to={PATHS.LOGIN}
              className="inline-block text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              {t("auth.forgotPassword.backToLogin")}
            </Link>
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
          <Link
            to={PATHS.LOGIN}
            className="text-sm sm:text-base text-primary-500 hover:text-primary-600 font-medium"
          >
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <MailQuestion className="w-24 h-24 text-primary-400" />
          </div>

          {/* Title */}
          <Typography variant="h1" className="mb-2 text-center">
            {t("auth.forgotPassword.title")}
          </Typography>
          <Typography variant="muted" className="mb-8 text-center">
            {t("auth.forgotPassword.subtitle")}
          </Typography>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                {t("auth.forgotPassword.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="pl-10"
                  placeholder={t("auth.forgotPassword.emailPlaceholder")}
                />
              </div>
              {errors.email && (
                <Typography variant="small" className="mt-1 text-destructive">
                  {errors.email.message}
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
                ? t("auth.forgotPassword.sending")
                : t("auth.forgotPassword.sendEmail")}
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
