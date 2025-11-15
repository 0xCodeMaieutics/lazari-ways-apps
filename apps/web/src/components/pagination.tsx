"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@workspace/ui/components/button";
import clsx from "clsx";

export function Pagination({
  pageSize,
  currentPage,
  total,
}: {
  pageSize: number;
  currentPage: number;
  total: number;
}) {
  const searchParams = useSearchParams();

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  const previousPageParams = new URLSearchParams(searchParams);
  previousPageParams.set("page", Math.max(1, currentPage - 1).toString());

  const nextPageParams = new URLSearchParams(searchParams);
  nextPageParams.set("page", Math.min(currentPage + 1, lastPage).toString());

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (lastPage <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < lastPage - 2) {
        pages.push("...");
      }

      pages.push(lastPage);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            "h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-foreground text-background hover:bg-foreground/90 hover:text-background",
            currentPage <= 1 && "pointer-events-none opacity-50"
          )}
          asChild={currentPage > 1}
          disabled={currentPage <= 1}
        >
          {currentPage > 1 ? (
            <Link href={"?" + previousPageParams.toString()}>
              <ChevronLeft className="size-4 sm:size-5" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4 sm:size-5" />
            </span>
          )}
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 sm:px-2 text-base sm:text-lg text-muted-foreground"
              >
                …
              </span>
            );
          }

          const pageNum = page as number;
          const pageParams = new URLSearchParams(searchParams);
          pageParams.set("page", pageNum.toString());

          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? "default" : "ghost"}
              size="icon"
              className={clsx(
                "h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all",
                isActive
                  ? "bg-background/5 text-primary border-2 border-primary hover:bg-background/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
              asChild={!isActive}
            >
              {isActive ? (
                <span>{pageNum}</span>
              ) : (
                <Link href={"?" + pageParams.toString()}>{pageNum}</Link>
              )}
            </Button>
          );
        })}

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            "h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-foreground text-background hover:bg-foreground/90 hover:text-background",
            currentPage >= lastPage && "pointer-events-none opacity-50"
          )}
          asChild={currentPage < lastPage}
          disabled={currentPage >= lastPage}
        >
          {currentPage < lastPage ? (
            <Link href={"?" + nextPageParams.toString()}>
              <ChevronRight className="size-4 sm:size-5" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="size-4 sm:size-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
