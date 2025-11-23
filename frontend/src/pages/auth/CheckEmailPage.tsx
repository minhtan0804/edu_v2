import { Mail } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { PATHS } from "@/constants/common";

export default function CheckEmailPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from location state or query params
  const email =
    (location.state as { email?: string })?.email ||
    new URLSearchParams(location.search).get("email") ||
    "";

  // Redirect to register if no email (prevent direct access)
  useEffect(() => {
    if (!email) {
      navigate(PATHS.REGISTER, { replace: true });
    }
  }, [email, navigate]);

  const handleResendVerification = () => {
    navigate(PATHS.RESEND_VERIFICATION, {
      state: { email },
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

          {/* Right side: Language Switcher */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary-500" />
            </div>
          </div>

          {/* Title */}
          <Typography variant="h1" className="mb-4">
            {t("auth.checkEmail.title")}
          </Typography>

          {/* Description */}
          <Typography variant="p" className="mb-2">
            {t("auth.checkEmail.description")}
          </Typography>

          {/* Email display */}
          {email && (
            <Typography variant="large" className="text-primary-600 mb-6">
              {email}
            </Typography>
          )}

          {/* Instructions */}
          <Card className="mb-6 text-left">
            <CardContent className="p-6">
              <Typography variant="small" className="mb-2">
                {t("auth.checkEmail.instructions")}
              </Typography>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>{t("auth.checkEmail.step1")}</li>
                <li>{t("auth.checkEmail.step2")}</li>
                <li>{t("auth.checkEmail.step3")}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            {/* Resend Verification Button */}
            {email && (
              <Button
                onClick={handleResendVerification}
                className="w-full"
                size="lg"
              >
                {t("auth.checkEmail.resendButton")}
              </Button>
            )}

            {/* Login Button */}
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to={PATHS.LOGIN}>{t("auth.checkEmail.loginLink")}</Link>
            </Button>
          </div>
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
