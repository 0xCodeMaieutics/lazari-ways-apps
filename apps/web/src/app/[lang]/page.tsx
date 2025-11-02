import { getTranslations } from "@/i18n/translations";
import { HomeClient } from "./page.client";
import { Locale } from "@/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const translations = await getTranslations(lang, "home");
  return <HomeClient translations={translations} />;
}
