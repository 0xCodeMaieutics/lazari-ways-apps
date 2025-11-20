import { DashboardTableContent } from "./page.client";
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
import { SearchInput } from "@/components/search-input";
import { Results } from "@workspace/shared/error-handling/result";
import {
  applicationQueries,
  ApplicationWhereInput,
} from "@workspace/server/db";

export const dynamic = "force-dynamic";

const TABLE_HEADERS = [
  "Name",
  "Email",
  "Instagram",
  "Phone",
  "Visa type",
  "Status",
];

const DEFAULT_PAGE = "1";
const DEFAULT_PAGE_SIZE = "25";
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

const buildApplicationSearchWhereClause = (search?: string) => {
  if (search === undefined || search.trim() === "") {
    return {};
  }
  return {
    OR: [],
  } as ApplicationWhereInput;
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

  const where = buildApplicationSearchWhereClause(search);

  const skip = (page - 1) * pageSize;
  const applicationResult = await Results.allAsync([
    applicationQueries.getApplicationsCount(where),
    applicationQueries.getApplications(where, {
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  if (applicationResult.isErr()) {
    throw applicationResult.error;
  }

  const [totalApplications, applications] = applicationResult.value;

  return (
    <div className="w-full mx-auto space-y-6 pt-10 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div>
          <SearchInput defaultValue={search} />
        </div>
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
                    Loading...
                  </TableCell>
                </TableRow>
              }
            >
              <DashboardTableContent
                applications={applications}
                currentPage={page}
                pageSize={pageSize}
                totalApplications={totalApplications}
              />
            </Suspense>
          </TableBody>
        </Table>
        <Suspense fallback={null}>
          <Pagination
            pageSize={pageSize}
            currentPage={page}
            total={totalApplications}
          />
        </Suspense>
      </div>
    </div>
  );
}
