import { vacancyQueries } from "@workspace/server/db";
import { VacancyProfile } from "./page.client";
import { notFound } from "next/navigation";

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ vacancyId: string }>;
}) {
  const { vacancyId } = await params;

  const vacancyResult = await vacancyQueries.getVacancyById(vacancyId);

  if (vacancyResult.isErr()) {
    throw vacancyResult.error;
  }

  if (!vacancyResult.value) {
    return notFound();
  }

  return <VacancyProfile vacancy={vacancyResult.value} />;
}
