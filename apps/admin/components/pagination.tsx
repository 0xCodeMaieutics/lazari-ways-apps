"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import clsx from "clsx";

const APPLICATIONS = "applications";

export function Pagination({
  pageSize,
  currentPage,
  total,
}: {
  pageSize: number;
  currentPage: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPageSize, setSelectedPageSize] = useState(pageSize.toString());

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  const firstPageParams = new URLSearchParams(searchParams);
  firstPageParams.set("page", "1");

  const previousPageParams = new URLSearchParams(searchParams);
  previousPageParams.set("page", Math.max(1, currentPage - 1).toString());

  const nextPageParams = new URLSearchParams(searchParams);
  nextPageParams.set("page", Math.min(currentPage + 1, lastPage).toString());

  const lastPageParams = new URLSearchParams(searchParams);
  lastPageParams.set("page", lastPage.toString());

  return (
    <div className="my-4 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          {APPLICATIONS} pro Seite:
          <span>
            <Select
              value={selectedPageSize}
              onValueChange={(value) => {
                setSelectedPageSize(value);
                const url = new URL(window.location.href);
                const newParams = new URLSearchParams(url.searchParams);
                newParams.set("page", "1");
                newParams.set("pageSize", value);
                router.push("?" + newParams.toString());
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="10" />
                {selectedPageSize !== pageSize.toString() && (
                  <LoaderCircle className="ml-1 size-4 animate-spin text-muted-foreground" />
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </span>
        </span>
        <span>
          {total} {APPLICATIONS} total
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link
            href={"?" + firstPageParams.toString()}
            className={clsx(
              currentPage <= 1 &&
                "pointer-events-none cursor-not-allowed opacity-50"
            )}
          >
            <ChevronsLeft className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={"?" + previousPageParams.toString()}
            className={clsx(
              "flex gap-2",
              currentPage <= 1 &&
                "pointer-events-none cursor-not-allowed opacity-50"
            )}
          >
            <ChevronLeft className="size-4" />
            Vorherige Seite
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          Seite {currentPage} von {lastPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage >= lastPage}
        >
          <Link
            href={"?" + nextPageParams.toString()}
            className={clsx(
              "flex gap-2",
              currentPage >= lastPage &&
                "pointer-events-none cursor-not-allowed opacity-50"
            )}
          >
            Nächste Seite
            <ChevronRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={"?" + lastPageParams.toString()}
            className={clsx(
              "flex gap-2",
              currentPage >= lastPage &&
                "pointer-events-none cursor-not-allowed opacity-50"
            )}
          >
            <ChevronsRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
