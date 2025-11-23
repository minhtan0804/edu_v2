import { Mail } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "@/components/LanguageSwitcher";
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
            <span className="text-lg sm:text-xl font-bold text-neutral-900">
              {t("common.appName")}
            </span>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            {t("auth.checkEmail.title")}
          </h1>

          {/* Description */}
          <p className="text-base text-neutral-600 mb-2">
            {t("auth.checkEmail.description")}
          </p>

          {/* Email display */}
          {email && (
            <p className="text-lg font-semibold text-primary-600 mb-6">
              {email}
            </p>
          )}

          {/* Instructions */}
          <div className="bg-neutral-50 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm text-neutral-700 mb-2">
              {t("auth.checkEmail.instructions")}
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              <li>{t("auth.checkEmail.step1")}</li>
              <li>{t("auth.checkEmail.step2")}</li>
              <li>{t("auth.checkEmail.step3")}</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Resend Verification Button */}
            {email && (
              <button
                onClick={handleResendVerification}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {t("auth.checkEmail.resendButton")}
              </button>
            )}

            {/* Login Button */}
            <Link
              to={PATHS.LOGIN}
              className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
            >
              {t("auth.checkEmail.loginLink")}
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




