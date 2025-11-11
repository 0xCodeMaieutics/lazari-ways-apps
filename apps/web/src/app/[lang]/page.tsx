import { getTranslations } from "@/i18n/translations";
import { HomeClient } from "./page.client";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/server/db";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // const lang = "ka";
  const translations = await getTranslations(lang as Locale, "home");

  const vacancies = await vacancyQueries.getVacancies();

  if (vacancies.isErr()) {
    return notFound();
  }

  return <HomeClient translations={translations} vacancies={vacancies.value} />;
}
