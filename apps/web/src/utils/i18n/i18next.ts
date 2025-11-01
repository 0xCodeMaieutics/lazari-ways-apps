import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
// import LocizeBackend from 'i18next-locize-backend'
import { initReactI18next } from "react-i18next/initReactI18next";
import {
  I18NEXT_LANGUAGES,
  I18NEXT_DEFAULT_NAMESPACE,
  I18NEXT_FALLBACK_LANGUAGE,
} from "./constants";

const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      console.log({ language, namespace });
      return import("./locales/en/common.json");
    })
  )
  // .use(runsOnServerSide ? LocizeBackend : resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`))) // locize backend could be used, but prefer to keep it in sync with server side
  .init({
    // debug: true,
    supportedLngs: I18NEXT_LANGUAGES,
    fallbackLng: I18NEXT_FALLBACK_LANGUAGE,
    lng: undefined, // let detect the language on client side
    fallbackNS: I18NEXT_DEFAULT_NAMESPACE,
    defaultNS: I18NEXT_DEFAULT_NAMESPACE,
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
    preload: runsOnServerSide ? I18NEXT_LANGUAGES : [],
    // backend: {
    //   projectId: '01b2e5e8-6243-47d1-b36f-963dbb8bcae3'
    // }
  });

export default i18next;
