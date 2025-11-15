import { notFound, redirect } from "next/navigation";
import { VacanciesListingClient } from "./page.client";
import { getTranslations } from "@/i18n/translations";
import { Locale } from "@/i18n";
import { vacancyQueries } from "@workspace/server/db";
import { Results } from "@workspace/shared";
import { DeviceType } from "@/proxy";

const DEFAULT_PAGE = "1";
const getPaginationSearchParams = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get("page") ?? "1");
  if (isNaN(page) || page < 1) {
    searchParams.set("page", DEFAULT_PAGE);
    return redirect("?" + searchParams.toString());
  }
  return {
    page,
  };
};

const getPageSize = (deviceType: DeviceType) => {
  if (deviceType === "mobile") return 12;
  else if (deviceType === "tablet") return 16;
  else return 18;
};

export default async function VacanciesPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;

  const viewport = searchParams.viewport as DeviceType;

  const currentSearchParams = new URLSearchParams(
    Object.entries(searchParams)
      .map(([key, value]) =>
        value === undefined
          ? undefined
          : Array.isArray(value)
            ? undefined
            : [key, value]
      )
      .filter((entry) => entry !== undefined)
  );

  const { page } = getPaginationSearchParams(currentSearchParams);

  const { lang } = await params;

  const translations = await getTranslations(lang, "vacancies");

  const where = {
    hide: false,
  };
  const vacanciesResult = await Results.allAsync([
    vacancyQueries.getVacancies(where, {
      skip: (page - 1) * getPageSize(viewport),
      take: getPageSize(viewport),
    }),
    vacancyQueries.getVacanciesCount(where),
  ]);

  if (vacanciesResult.isErr()) {
    console.error(vacanciesResult?.error.message, vacanciesResult?.error.type);
    return notFound();
  }

  const [vacancies, vacanciesCount] = vacanciesResult.value;

  return (
    <VacanciesListingClient
      translations={translations}
      vacancies={vacancies}
      vacanciesTotal={vacanciesCount}
      currentPage={page}
      pageSize={getPageSize(viewport)}
    />
  );
}
