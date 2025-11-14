import { getTranslations } from "@/i18n/translations";
import { HomeClient } from "./page.client";
import { Locale } from "@/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // const lang = "ka";
  const translations = await getTranslations(lang as Locale, "home");

  return <HomeClient translations={translations} />;
}
