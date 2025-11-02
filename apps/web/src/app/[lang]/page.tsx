import { Locale } from "@/i18n";
import { HomeClient } from "./page.client";
import { getTranslations } from "@/i18n/translations";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const translations = await getTranslations(lang, "home");
  return <HomeClient translations={translations} />;
}
