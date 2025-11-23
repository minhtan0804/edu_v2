import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui";
import { Typography } from "@/components/ui";
import { PATHS } from "@/constants/common";

export default function VerifyEmailErrorPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get error message from location state
  const errorMessage =
    (location.state as { error?: string })?.error ||
    t("errors.verificationFailed");

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
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <Typography variant="h1" className="mb-2">
            {t("auth.verifyEmail.error")}
          </Typography>
          <Typography variant="muted" className="mb-6">
            {errorMessage}
          </Typography>
          <div className="space-y-3">
            <Button
              onClick={() => navigate(PATHS.LOGIN)}
              className="w-full"
              size="lg"
            >
              {t("auth.verifyEmail.backToLogin")}
            </Button>
            <Link
              to={PATHS.RESEND_VERIFICATION}
              className="block text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              {t("auth.verifyEmail.resendVerification")}
            </Link>
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
