"use client";

import {
  Card,
  CardContent,
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
import Link from "next/link";
import { format } from "date-fns";
import { GetApplications } from "@workspace/server/db";
import {
  ApplicationStatus,
  ApplicationType,
} from "@workspace/server/db/models";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  USER_SUBMITTED: {
    label: "Submitted",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  IN_REVIEW_BY_AGENCY: {
    label: "Under Review by Agency",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  APPROVED_BY_AGENCY: {
    label: "Approved by Agency",
    variant: "default",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  REJECTED_BY_AGENCY: {
    label: "Rejected by Agency",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  IN_REVIEW_BY_EMPLOYER: {
    label: "Under Review by Employer",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  APPROVED_BY_EMPLOYER: {
    label: "Approved by Employer",
    variant: "default",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  REJECTED_BY_EMPLOYER: {
    label: "Rejected by Employer",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
};

const applicationTypeToLabel = {
  KKB3: "KKB 3 months",
  KKB8: "KKB 8 months",
  STUDENT: "Student",
} satisfies Record<ApplicationType, string>;

function ApplicationCard({ application }: { application: GetApplications }) {
  const applicationStatus =
    application.status ?? ApplicationStatus.USER_SUBMITTED;
  const status = statusConfig[applicationStatus];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              <p className="text-sm text-muted-foreground">
                {/* FIXME: fetch user information in the server component and display */}
                {/* {application.firstName} {application.lastName} */}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Submitted {format(new Date(application.createdAt), "PPP")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Badge variant={status.variant} className="flex items-center gap-1">
              {status.icon}
              {status.label}
            </Badge>
          </div>
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
  const hasKKB8Application = applications.some(
    (app) => app.type === ApplicationType.KKB8
  );
  const hasKKB3Application = applications.some(
    (app) => app.type === ApplicationType.KKB3
  );
  const hasStudentApplication = applications.some(
    (app) => app.type === ApplicationType.STUDENT
  );

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
                "http://localhost:3000/vacancies?" +
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Bewerbugen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Application Section */}
        {hasKKB8Application &&
        hasKKB3Application &&
        hasStudentApplication ? null : (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Beginnen Sie mit der Erstellung einer neuen Bewerbung
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {!hasKKB8Application && (
                <ApplicationTypeButton
                  onPush={() => onPush(ApplicationType.KKB8)}
                  label="KKB 8 Monaten"
                  description="Kurzzeitige kontingentierte Beschäftigung"
                />
              )}
              {!hasKKB3Application && (
                <ApplicationTypeButton
                  onPush={() => onPush(ApplicationType.KKB3)}
                  label="KKB 3 Monaten"
                  description="Kurzzeitige kontingentierte Beschäftigung"
                />
              )}
              {!hasStudentApplication && (
                <ApplicationTypeButton
                  onPush={() => onPush(ApplicationType.STUDENT)}
                  label="Studentenvisum"
                  description="Antrag auf ein Studentenvisum stellen"
                />
              )}
            </div>
          </div>
        )}

        {/* Existing Applications */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
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
      </CardContent>
    </Card>
  );
}
