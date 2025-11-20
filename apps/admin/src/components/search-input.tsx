"use client";

import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@/utils/hooks/use-debouce";
import { LoaderCircle, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";

export function SearchInput({ ...props }: ComponentPropsWithoutRef<"input">) {
  const { defaultValue = "" } = props as { defaultValue?: string };
  const router = useRouter();
  const [search, setSearch] = useState(defaultValue);
  const debouncedSearch = useDebounce(search, 500);
  const isLoading = (search ?? "") !== defaultValue;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (debouncedSearch !== undefined && debouncedSearch.length > 0) {
      searchParams.set("search", debouncedSearch);
    } else {
      searchParams.delete("search");
    }
    router.replace(`?${searchParams.toString()}`);
  }, [router, debouncedSearch]);

  return (
    <div className="flex items-center space-x-2 py-4">
      {isLoading ? (
        <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <SearchIcon className="size-4 text-muted-foreground" />
      )}
      <Input
        className="w-[300px]"
        type="search"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        defaultValue={defaultValue}
        {...props}
      />
    </div>
  );
}
