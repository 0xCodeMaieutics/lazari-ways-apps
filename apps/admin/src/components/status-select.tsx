"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ApplicationStatus } from "@workspace/server/db/models";
import { updateApplicationStatus } from "@/utils/server-actions/application/update-status";
import { useTransition } from "react";
import { toast } from "sonner";
import clsx from "clsx";

const statusOptions = {
  [ApplicationStatus.USER_SUBMITTED]: {
    value: ApplicationStatus.USER_SUBMITTED,
    label: "Ausstehend",
    color: "text-yellow-700",
  },
  [ApplicationStatus.APPROVED_BY_AGENCY]: {
    value: ApplicationStatus.APPROVED_BY_AGENCY,
    label: "Genehmigt",
    color: "text-green-700",
  },
  [ApplicationStatus.APPROVED_BY_EMPLOYER]: {
    value: ApplicationStatus.APPROVED_BY_EMPLOYER,
    label: "Abgelehnt",
    color: "text-red-700",
  },
  [ApplicationStatus.REJECTED_BY_AGENCY]: {
    value: ApplicationStatus.REJECTED_BY_AGENCY,
    label: "Von Agentur abgelehnt",
    color: "text-red-700",
  },
  [ApplicationStatus.REJECTED_BY_EMPLOYER]: {
    value: ApplicationStatus.REJECTED_BY_EMPLOYER,
    label: "Von Arbeitgeber abgelehnt",
    color: "text-red-700",
  },
  [ApplicationStatus.IN_REVIEW_BY_AGENCY]: {
    value: ApplicationStatus.IN_REVIEW_BY_AGENCY,
    label: "In Prüfung durch Agentur",
    color: "text-yellow-700",
  },
  [ApplicationStatus.IN_REVIEW_BY_EMPLOYER]: {
    value: ApplicationStatus.IN_REVIEW_BY_EMPLOYER,
    label: "In Prüfung durch Arbeitgeber",
    color: "text-yellow-700",
  },
} satisfies Record<
  ApplicationStatus,
  { value: ApplicationStatus; label: string; color: string }
>;

export const StatusSelect = ({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, {
        status: newStatus,
      });

      if (!result.success)
        toast.error("Status konnte nicht aktualisiert werden");
      else toast.success("Bewerbungsstatus erfolgreich aktualisiert");
    });
  };

  const currentOption = Object.values(statusOptions).find(
    (option) => option.value === currentStatus
  );

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className={clsx("ml-auto", currentOption?.color)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.values(statusOptions).map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
