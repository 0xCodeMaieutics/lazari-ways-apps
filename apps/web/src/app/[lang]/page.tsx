import { getTranslations } from "@/i18n/translations";
import { HomeClient } from "./page.client";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/db";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  // const { lang } = await params;
  const lang = "ka";
  const translations = await getTranslations(lang, "home");

  const vacancies = await vacancyQueries.getVacancies();

  return <HomeClient translations={translations} vacancies={vacancies} />;
}
