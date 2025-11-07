"use client";

import { useQuery } from "@tanstack/react-query";
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
import {
  ApplicationType,
  ApplicationStatus,
  applicationTypeToLabel,
} from "@/utils/models/applications";

type Application = {
  id: string;
  type: ApplicationType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ApplicationStatus;
  createdAt: string;
};

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    label: "Received by Admins",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  APPROVED: {
    label: "Confirmed",
    variant: "default",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
};

function ApplicationCard({ application }: { application: Application }) {
  const status = statusConfig[application.status];

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
                {applicationTypeToLabel[application.type]}
              </h3>
              <p className="text-sm text-muted-foreground">
                {application.firstName} {application.lastName}
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
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto p-4 flex flex-col items-start text-left hover:bg-accent"
    >
      <Link href={href}>
        <div className="flex items-center gap-2 mb-1">
          <Plus className="h-4 w-4" />
          <span className="font-semibold">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground whitespace-break-spaces">
          {description}
        </span>
      </Link>
    </Button>
  );
}

export function ApplicationsList() {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">აპლიკაციები</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Application Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            დაიწყეთ ახალი აპლიკაცია
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            <ApplicationTypeButton
              href="/applications/student-visa"
              label="სტუდენტური ვიზა"
              description="სტუდენტურ ვიზაზე განაცხადის შეტანა"
            />
            <ApplicationTypeButton
              href="/applications/kkb?visa_duration_in_months=3"
              label="KKB 3 თვე"
              description="Kurzzeitige kontingentierte Beschäftigung"
            />
            <ApplicationTypeButton
              href="/applications/kkb?visa_duration_in_months=8"
              label="KKB 8 თვე"
              description="Kurzzeitige kontingentierte Beschäftigung"
            />
          </div>
        </div>

        {/* Existing Applications */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            თქვენი აპლიკაციები
          </h3>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading applications...
            </div>
          ) : applications && applications.length > 0 ? (
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
              <p>ჯერ არ არის განაცხადები</p>
              <p className="text-sm">
                დაიწყეთ ზემოთ მოცემული ახალი აპლიკაციის შექმნით
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
