export const i18n = {
  defaultLocale: "ka",
  locales: ["ka"],
  // locales: ["en", "de", "ka"],
  cookieName: "lazari-ways-lang",
  headerName: "x-lazari-ways-lang",
} as const;

export type Locale = (typeof i18n)["locales"][number];
