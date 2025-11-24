"use client";
import { StatusSelect } from "@/components/status-select";
import { TableCell, TableRow } from "@workspace/ui/components/table";
import { GetApplications } from "@workspace/server/db";
import { ApplicationStatus } from "@workspace/server/db/models";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const DashboardTableContent = ({
  applications,
  totalApplications,
  currentPage,
  pageSize,
}: {
  applications: GetApplications[];
  totalApplications: number;
  currentPage: number;
  pageSize: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(totalApplications / pageSize));
    if (applications.length === 0 && currentPage > lastPage) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", lastPage.toString());
      router.push("?" + newSearchParams.toString());
    }
  }, [
    currentPage,
    applications,
    pageSize,
    router,
    searchParams,
    totalApplications,
  ]);

  return applications.map((application) => {
    const fullName = `${application.employee?.firstName || ""} ${
      application.employee?.lastName || ""
    }`.trim();

    return (
      <TableRow
        onClick={() => {
          router.push(`/${application.id}`);
        }}
        key={application.id}
        className="h-14 cursor-pointer"
      >
        <TableCell className="font-semibold">{fullName}</TableCell>
        <TableCell className="font-semibold">
          {application.employee?.user.email || "-"}
        </TableCell>
        <TableCell className="font-semibold">
          {application.employee?.instagram || "-"}
        </TableCell>
        <TableCell className="font-semibold">
          {application.employee?.phone}
        </TableCell>
        <TableCell className="font-semibold">
          {/* {applicationTypeToLabel[application.type] || "-"} */}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <StatusSelect
            applicationId={application.id}
            currentStatus={
              application.status || ApplicationStatus.USER_SUBMITTED
            }
          />
        </TableCell>
      </TableRow>
    );
  });
};
