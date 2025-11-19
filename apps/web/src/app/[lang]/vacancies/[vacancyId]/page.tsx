import { notFound } from "next/navigation";
import { VacancyClientPage } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/server/db";

export default async function VacanciesDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; vacancyId: string }>;
}) {
  const { lang, vacancyId } = await params;

  const translations = await getTranslations(lang, "services-detail");

  const vacancyData = await vacancyQueries.getVacancyById(vacancyId);

  if (vacancyData.isErr()) throw vacancyData.error;

  if (!vacancyData.value) {
    return notFound();
  }

  return (
    <VacancyClientPage translations={translations} data={vacancyData.value} />
  );
}
