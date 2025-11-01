import { I18NEXT_DEFAULT_NAMESPACE, I18NEXT_HEADER_NAME } from "./constants";
import i18next from "./i18next";
import { headers } from "next/headers";

export async function getTranslations(
  ns: string | string[],
  options: { keyPrefix?: string } = {}
) {
  console.log({ ns, options });

  const headerList = await headers();
  const lng = headerList.get(I18NEXT_HEADER_NAME);
  if (lng && i18next.resolvedLanguage !== lng) {
    await i18next.changeLanguage(lng);
  }
  if (ns && !i18next.hasLoadedNamespace(ns)) {
    await i18next.loadNamespaces(ns);
  }
  return {
    t: i18next.getFixedT(
      lng ?? i18next.resolvedLanguage ?? I18NEXT_DEFAULT_NAMESPACE,
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix ?? ""
    ),
    i18n: i18next,
  };
}
