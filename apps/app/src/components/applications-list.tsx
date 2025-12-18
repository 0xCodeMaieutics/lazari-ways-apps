"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { GetApplications } from "@workspace/server/db";
import {
  ApplicationStatus,
  ApplicationType,
} from "@workspace/server/db/models";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    icon: React.ReactNode;
    theme: string;
  }
> = {
  USER_SUBMITTED: {
    label: "Eingereicht",
    theme: "bg-amber-500 text-amber-500-foreground",
    icon: <Clock className="size-8" />,
  },
  IN_REVIEW_BY_AGENCY: {
    label: "In Prüfung durch Agentur",
    theme: "bg-blue-500 text-blue-500-foreground",
    icon: <Clock className="size-8" />,
  },
  APPROVED_BY_AGENCY: {
    label: "Von Agentur genehmigt",
    theme: "bg-green-500 text-green-500-foreground",
    icon: <CheckCircle className="size-8" />,
  },
  REJECTED_BY_AGENCY: {
    label: "Von Agentur abgelehnt",
    theme: "bg-red-500 text-red-500-foreground",
    icon: <XCircle className="size-8" />,
  },
  IN_REVIEW_BY_EMPLOYER: {
    label: "In Prüfung durch Arbeitgeber",
    theme: "bg-yellow-500 text-yellow-500-foreground",
    icon: <Clock className="size-8" />,
  },
  APPROVED_BY_EMPLOYER: {
    label: "Von Arbeitgeber genehmigt",
    theme: "bg-green-500 text-green-500-foreground",
    icon: <CheckCircle className="size-8" />,
  },
  REJECTED_BY_EMPLOYER: {
    label: "Von Arbeitgeber abgelehnt",
    theme: "bg-red-500 text-red-500-foreground",
    icon: <XCircle className="size-8" />,
  },
};

const applicationTypeToLabel = {
  KKB3: "KKB 3 Monate",
  KKB8: "KKB 8 Monate",
  STUDENT: "Studentenvisum",
} satisfies Record<ApplicationType, string>;

function ApplicationCard({ application }: { application: GetApplications }) {
  const applicationStatus =
    application.status ?? ApplicationStatus.USER_SUBMITTED;
  const status = statusConfig[applicationStatus];

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {
                  applicationTypeToLabel[
                    application.type ?? ApplicationType.STUDENT
                  ]
                }
              </h3>
            </div>
          </div>
          <div className="space-y-1">
            <p
              role="button"
              title="Klicken um zur Stellen-ID zu kopieren"
              onClick={() => {
                navigator.clipboard.writeText(
                  "LZRY-" + (application?.vacancy?.vacancyId?.toString() ?? "")
                );
                toast.success("Stellen-ID kopiert");
              }}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Stellen-ID:{" "}
              <span className="text-foreground font-semibold">
                LZRY-{application?.vacancy?.vacancyId}
              </span>
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Eingereicht {format(new Date(application.createdAt), "PPP")}
              </span>
            </div>
          </div>

          <Badge
            className={clsx(
              "flex items-center gap-1 h-12 w-full rounded-lg",
              status.theme
            )}
          >
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationTypeButton({
  onPush,
  label,
  description,
}: {
  onPush: () => void;
  label: string;
  description: string;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent"
      onClick={onPush}
    >
      <div className="flex items-center gap-2 mb-1">
        <Plus className="h-4 w-4" />
        <span className="font-semibold">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground whitespace-break-spaces">
        {description}
      </span>
    </Button>
  );
}

export function ApplicationsList({
  applications,
}: {
  applications: GetApplications[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPush = (type: ApplicationType) => {
    const vacancyId = searchParams.get("vacancyId");
    const error_type = searchParams.get("error_type");

    const showToast = () => {
      toast.info(
        <>
          <p>
            <span className="mr-1">
              Die angegebene Stelle wurde nicht gefunden. Bitte wählen Sie eine
              gültige Stelle aus, um eine Bewerbung zu starten.
            </span>
            <a
              className="underline cursor-pointer text-base"
              href={
                `${process.env.NEXT_PUBLIC_WEB_URL}/vacancies?` +
                new URLSearchParams({
                  application_type: type,
                  utm_url: window.location.href,
                  utm_code: "NO_VACANCY_ID",
                }).toString()
              }
            >
              hier
            </a>
          </p>
        </>
      );
    };

    if (error_type === "VACANCY_NOT_FOUND" || vacancyId === null) {
      return showToast();
    }

    return router.push(
      "/applications?" +
        new URLSearchParams({
          type,
          vacancyId,
        }).toString()
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Applications */}
      {applications.length > 0 && (
        <div>
          <h3 className="text-muted-foreground font-semibold mb-4">
            Ihre Bewerbungen
          </h3>
          {applications && applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Keine Bewerbungen vorhanden</p>
              <p className="text-sm">
                Beginnen Sie mit der Erstellung einer neuen Bewerbung oben
              </p>
            </div>
          )}
        </div>
      )}

      {/* New Application Section */}
      <div>
        <h3 className="text-muted-foreground font-semibold mb-4">
          Erstellen Sie eine neue Bewerbung
        </h3>
        <div className="grid gap-3 md:grid-cols-3">
          <ApplicationTypeButton
            onPush={() => onPush(ApplicationType.KKB8)}
            label="KKB 8 Monaten"
            description="Kurzzeitige kontingentierte Beschäftigung"
          />
          <ApplicationTypeButton
            onPush={() => onPush(ApplicationType.KKB3)}
            label="KKB 3 Monaten"
            description="Kurzzeitige kontingentierte Beschäftigung"
          />
          <ApplicationTypeButton
            onPush={() => onPush(ApplicationType.STUDENT)}
            label="Studentenvisum"
            description="Antrag auf ein Studentenvisum stellen"
          />
        </div>
      </div>
    </div>
  );
}
