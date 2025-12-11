import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { Results } from "@workspace/shared/error-handling/result";
import { vacancyQueries, VacancyWhereInput } from "@workspace/server/db";
import { VacanciesTableContent } from "./page.client";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";

export const dynamic = "force-dynamic";

const TABLE_HEADERS = [
  "Stellenanzeigen #ID",
  "Titel",
  "Standort",
  "Gehalt",
  "Startdatum",
  "Ausblenden",
];

const DEFAULT_PAGE = "1";
const DEFAULT_PAGE_SIZE = "10";
const DEFAULT_PAGES = [10, 25, 50, 100];

const getPaginationSearchParams = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get("page") ?? "1");
  if (isNaN(page) || page < 1) {
    searchParams.set("page", DEFAULT_PAGE);
    return redirect("?" + searchParams.toString());
  }

  const pageSize = parseInt(searchParams.get("pageSize") ?? "1");
  if (isNaN(pageSize) || !DEFAULT_PAGES.includes(pageSize)) {
    searchParams.set("pageSize", DEFAULT_PAGE_SIZE);
    return redirect("?" + searchParams.toString());
  }

  return {
    pageSize,
    page,
  };
};

const buildVacancySearchWhereClause = (search?: string) => {
  if (search === undefined || search.trim() === "") {
    return {};
  }
  return {
    OR: [
      {
        vacancyId: {
          equals: Number(search.replace("LZRY-", "")) || 0,
        },
      },
    ],
  } satisfies VacancyWhereInput;
};

export default async function DashboardPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

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

  const { page, pageSize } = getPaginationSearchParams(currentSearchParams);

  const where = {
    ...buildVacancySearchWhereClause(search),
  } satisfies VacancyWhereInput;

  const skip = (page - 1) * pageSize;
  const vacanciesResult = await Results.allAsync([
    vacancyQueries.getVacanciesCount(where),
    vacancyQueries.getVacancies(where, {
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  if (vacanciesResult.isErr()) {
    throw vacanciesResult.error;
  }

  const [totalVacancies, vacancies] = vacanciesResult.value;

  const isVacanciesEmpty = vacancies.length === 0;

  return (
    <div className="h-dvh w-full mx-auto space-y-6 pt-40 pb-10">
      <div className="flex justify-between items-center">
        {isVacanciesEmpty === false && (
          <div>
            <SearchInput
              placeholder="Stellenanzeigen ID"
              defaultValue={search}
            />
          </div>
        )}
        <Button asChild className="cursor-pointer">
          <Link href={"/vacancies/new"}>Neu erstellen</Link>
        </Button>
      </div>

      <div className="space-y-2">
        <Table className="w-full z-0">
          <TableHeader className="h-14 ssticky top-0 z-10 pb-1">
            <TableRow>
              {TABLE_HEADERS.map((header) => (
                <TableHead className="text-xs" key={header}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto">
            <Suspense
              fallback={
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center text-muted-foreground"
                  >
                    <LoaderCircle className="mr-2 inline-block size-4 animate-spin" />
                    Lädt...
                  </TableCell>
                </TableRow>
              }
            >
              {vacancies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEADERS.length}
                    className="text-center h-20 text-muted-foreground"
                  >
                    Keine Stellenanzeigen vorhanden.
                  </TableCell>
                </TableRow>
              ) : (
                <VacanciesTableContent
                  vacanacies={vacancies}
                  currentPage={page}
                  pageSize={pageSize}
                  totalVacancies={totalVacancies}
                />
              )}
            </Suspense>
          </TableBody>
        </Table>
        {isVacanciesEmpty === false && (
          <Suspense fallback={null}>
            <Pagination
              pageSize={pageSize}
              currentPage={page}
              total={totalVacancies}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
