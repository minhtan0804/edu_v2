import { Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-neutral-600" />
        <span className="text-sm font-medium text-neutral-700">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-20">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors flex items-center gap-2 ${
                    i18n.language === lang.code
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-700"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {i18n.language === lang.code && (
                    <span className="ml-auto text-primary-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
