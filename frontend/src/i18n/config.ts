import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enTranslation from "../locales/en/translation.json";
import viTranslation from "../locales/vi/translation.json";

const resources = {
  vi: {
    translation: viTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Fallback language if detection fails
    supportedLngs: ["vi", "en"], // Supported languages
    detection: {
      // Order of language detection
      order: [
        "localStorage", // Check localStorage first
        "navigator", // Then check browser language
        "htmlTag", // Then check HTML lang attribute
      ],
      // Cache user language preference
      caches: ["localStorage"],
      // Key to store language in localStorage
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  });

export default i18n;

// Export typed t function for use in .ts files
export const t = i18n.t.bind(i18n);
