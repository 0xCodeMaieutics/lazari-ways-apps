import "server-only";

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, Locale } from ".";

export type Translations = Record<string, string>;

const translations = {
  en: (namespace?: string) =>
    import(`./translations/${namespace}/en.json`).then(
      (module) => module.default satisfies Translations
    ),
  de: (namespace?: string) =>
    import(`./translations/${namespace}/de.json`).then(
      (module) => module.default satisfies Translations
    ),
  ka: (namespace?: string) =>
    import(`./translations/${namespace}/ka.json`).then(
      (module) => module.default satisfies Translations
    ),
};

export const getTranslations = async (
  locale: "en" | "de" | "ka",
  namespace = "common"
) => translations[locale](namespace);

export const getServerSideLocal = (acceptLanguage?: string | null) => {
  if (!acceptLanguage) return i18n.defaultLocale;
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();
  return match(languages, i18n.locales, i18n.defaultLocale) as Locale;
};
