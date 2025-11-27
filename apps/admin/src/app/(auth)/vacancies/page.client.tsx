"use client";
import { TableCell, TableRow } from "@workspace/ui/components/table";
import { GetVacancies } from "@workspace/server/db";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Switch } from "@workspace/ui/components/switch";
import { toast } from "sonner";
import { updateVacancyHide } from "@/utils/server-actions/vacancy/update-vacancy-hide";

const VACANCY_ID_PREFIX = "LZRY-";

export const VacanciesTableContent = ({
  vacanacies,
  totalVacancies,
  currentPage,
  pageSize,
}: {
  vacanacies: GetVacancies[];
  totalVacancies: number;
  currentPage: number;
  pageSize: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(totalVacancies / pageSize));
    if (vacanacies.length === 0 && currentPage > lastPage) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", lastPage.toString());
      router.push("?" + newSearchParams.toString());
    }
  }, [currentPage, vacanacies, pageSize, router, searchParams, totalVacancies]);

  return vacanacies.map((vacancy) => (
    <TableRow
      onClick={() => {
        router.push(`/vacancies/${vacancy.id}`);
      }}
      key={vacancy.id}
      className="h-14 cursor-pointer"
    >
      <TableCell className="font-semibold">
        {VACANCY_ID_PREFIX}
        {vacancy.vacancyId}
      </TableCell>
      <TableCell className="font-semibold">{vacancy.title}</TableCell>
      <TableCell className="font-semibold">{vacancy.location ?? "-"}</TableCell>
      <TableCell className="font-semibold">{vacancy.salary ?? "-"}</TableCell>
      <TableCell className="font-semibold">
        {vacancy.beginDate ?? "-"}
      </TableCell>
      <TableCell
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Switch
          checked={vacancy.hide ?? false}
          onCheckedChange={async () => {
            const result = await updateVacancyHide({
              hide: !(vacancy.hide ?? false),
              id: vacancy.id,
            });
            if (!result.isSuccess) toast("Error occurred updating result");
            router.refresh();
          }}
          id={`hide-${vacancy.id}`}
        />
      </TableCell>
    </TableRow>
  ));
};
