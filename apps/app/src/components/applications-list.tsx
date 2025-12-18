"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
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
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { env } from "@/env";

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

const errorMessages: Record<
  | "INVALID_TYPE"
  | "VACANCY_NOT_FOUND"
  | "VACANCY_ID_NOT_SPECIFIED"
  | "APPLICATION_ALREADY_SUBMITTED"
  | "EMPLOYEE_NOT_FOUND",
  { title: string; description: string }
> = {
  INVALID_TYPE: {
    title: "Ungültiger Bewerbungstyp",
    description:
      "Der angegebene Bewerbungstyp ist ungültig. Bitte wählen Sie einen gültigen Typ aus.",
  },
  VACANCY_NOT_FOUND: {
    title: "Stelle nicht gefunden",
    description:
      "Die angegebene Stelle konnte nicht gefunden werden. Bitte überprüfen Sie die Stellen-ID.",
  },
  VACANCY_ID_NOT_SPECIFIED: {
    title: "Stellen-ID fehlt",
    description:
      "Es wurde keine Stellen-ID angegeben. Bitte geben Sie eine gültige Stellen-ID an.",
  },
  APPLICATION_ALREADY_SUBMITTED: {
    title: "Bewerbung bereits eingereicht",
    description:
      "Für diese Stelle wurde bereits eine Bewerbung eingereicht. Sie können keine weitere Bewerbung erstellen.",
  },
  EMPLOYEE_NOT_FOUND: {
    title: "Mitarbeiter nicht gefunden",
    description:
      "Ihr Benutzerkonto konnte nicht gefunden werden. Bitte kontaktieren Sie den Support.",
  },
};

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

const typeToLabel = {
  [ApplicationType.KKB8]: "KKB 8 Monaten",
  [ApplicationType.KKB3]: "KKB 3 Monaten",
  [ApplicationType.STUDENT]: "Studentenvisum",
} satisfies Record<ApplicationType, string>;

function ApplicationTypeButton({
  type,
  description,
}: {
  type: ApplicationType;
  description: string;
}) {
  const searchParams = useSearchParams();

  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent"
      asChild
    >
      <Link
        href={
          "/applications?" +
          new URLSearchParams({
            type,
            vacancyId: searchParams.get("vacancyId") as string,
          }).toString()
        }
      >
        <div className="flex items-center gap-2 mb-1">
          <Plus className="h-4 w-4" />
          <span className="font-semibold">{typeToLabel[type]}</span>
        </div>
        <span className="text-xs text-muted-foreground whitespace-break-spaces">
          {description}
        </span>
      </Link>
    </Button>
  );
}

export function ApplicationsList({
  applications,
}: {
  applications: GetApplications[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorType = (searchParams.get("error_type") ?? null) as
    | "INVALID_TYPE"
    | "VACANCY_NOT_FOUND"
    | "VACANCY_ID_NOT_SPECIFIED"
    | "APPLICATION_ALREADY_SUBMITTED"
    | "EMPLOYEE_NOT_FOUND"
    | undefined;

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (errorType) {
      setIsErrorDialogOpen(true);
    } else {
      setIsErrorDialogOpen(false);
    }
  }, [errorType]);

  const handleCloseErrorDialog = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error_type");
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/${newUrl}`, { scroll: false });
  };

  const errorMessage = errorType ? errorMessages[errorType] : null;

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
            type={ApplicationType.KKB8}
            description="Kurzzeitige kontingentierte Beschäftigung"
          />
          <ApplicationTypeButton
            type={ApplicationType.KKB3}
            description="Kurzzeitige kontingentierte Beschäftigung"
          />
          <ApplicationTypeButton
            type={ApplicationType.STUDENT}
            description="Antrag auf ein Studentenvisum stellen"
          />
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={handleCloseErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-destructive" />
              <DialogTitle>{errorMessage?.title || "Fehler"}</DialogTitle>
            </div>
            <DialogDescription>
              {errorMessage?.description ||
                "Ein unbekannter Fehler ist aufgetreten."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild type="button">
              <a href={`${env.NEXT_PUBLIC_WEB_URL}/vacancies`}>
                Geh zur Stellenansicht
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
