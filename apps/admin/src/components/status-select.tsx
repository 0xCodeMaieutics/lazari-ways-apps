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

interface StatusSelectProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}
const statusOptions = [
  {
    value: ApplicationStatus.USER_SUBMITTED,
    label: "Pending",
    color: "text-yellow-700",
  },
  {
    value: ApplicationStatus.APPROVED_BY_AGENCY,
    label: "Approved",
    color: "text-green-700",
  },
  {
    value: ApplicationStatus.APPROVED_BY_EMPLOYER,
    label: "Rejected",
    color: "text-red-700",
  },
] satisfies { value: ApplicationStatus; label: string; color: string }[];

export const StatusSelect = ({
  applicationId,
  currentStatus,
}: StatusSelectProps) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, {
        status: newStatus,
      });

      if (result.success) {
        toast.success("Application status updated successfully");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const currentOption = statusOptions.find(
    (option) => option.value === currentStatus
  );

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className={`w-32 ${currentOption?.color || ""}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={option.color}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
