import { notFound } from "next/navigation";
import { VacanciesClientPage } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/db";

export default async function VacanciesDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; vacancyId: string }>;
}) {
  const { lang, vacancyId } = await params;

  const translations = await getTranslations(lang, "services-detail");

  const vacancyData = await vacancyQueries.getVacancyById(vacancyId);

  if (vacancyData.isErr()) return notFound();

  return (
    <VacanciesClientPage translations={translations} data={vacancyData.value} />
  );
}
