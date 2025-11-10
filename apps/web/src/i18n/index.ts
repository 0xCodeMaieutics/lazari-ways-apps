export const i18n = {
  defaultLocale: "en",
  locales: ["en", "de", "ka"],
  cookieName: "lazari-ways-lang",
  headerName: "x-lazari-ways-lang",
} as const;

export type Locale = (typeof i18n)["locales"][number];
