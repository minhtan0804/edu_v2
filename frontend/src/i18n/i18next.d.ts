import "i18next";

import type { TranslationKeys } from "./types";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: {
        [key in TranslationKeys]: string;
      };
    };
  }
}
