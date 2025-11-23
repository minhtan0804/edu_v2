import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "@/components/LanguageSwitcher";
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
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              {t("common.appName")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            {t("auth.verifyEmail.error")}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mb-6">
            {errorMessage}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(PATHS.LOGIN)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {t("auth.verifyEmail.backToLogin")}
            </button>
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

