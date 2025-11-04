import { createContext, useContext } from "react";

export const translationsContext = createContext<{
  translations: Record<string, string>;
}>({
  translations: {},
});

export const useTranslations = () => {
  const context = useContext(translationsContext);
  if (!context) {
    throw new Error(
      "useTranslations must be used within a TranslationsProvider"
    );
  }
  return context.translations;
};
