import { notFound } from "next/navigation";
import { VacanciesListingClient } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/server/db";

export default async function VacanciesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const translations = await getTranslations(lang, "vacancies");

  const vacancies = await vacancyQueries.getVacancies({
    hide: false,
  });

  if (vacancies.isErr()) {
    console.error(vacancies.error.message, vacancies.error.type);
    return notFound();
  }

  return (
    <VacanciesListingClient
      translations={translations}
      vacancies={vacancies.value}
    />
  );
}
