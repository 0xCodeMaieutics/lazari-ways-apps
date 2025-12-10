"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@workspace/ui/components/select";
import {
  ArrowLeft,
  Phone,
  Calendar,
  User,
  FileText,
  Download,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { GetApplication } from "@workspace/server/db";
import { ApplicationStatus } from "@workspace/server/db/models";
import { toast } from "sonner";
import { updateApplicationStatus } from "@/utils/server-actions/application/update-status";
import { WHATSAPP_URL } from "@/utils/constants";

const formatValue = (value?: string | number | boolean | null | Date) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) {
    return new Date(value).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return String(value);
};

export const InformationValue = ({
  children,
}: {
  children: string | number | boolean | Date | null | undefined;
}) => <p className="text-slate-900 font-medium">{formatValue(children)}</p>;

export const InformationItem = ({
  Icon,
  label,
  children,
}: {
  Icon?: LucideIcon | null;
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-start gap-4">
      {Icon && <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />}
      <div className={Icon ? "" : "ml-9"}>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        {children}
      </div>
    </div>
  );
};

export const InformationItemExternalLink = ({
  Icon,
  label,
  href,
  children,
}: {
  Icon?: LucideIcon | null;
  label: string;
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-start gap-4">
      {Icon && <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />}
      <div className={Icon ? "" : "ml-9"}>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-900 font-medium hover:underline"
        >
          {children}
        </a>
      </div>
    </div>
  );
};

export const InformationSection = ({
  title,
  titleIcon: TitleIcon,
  children,
}: {
  title: string;
  titleIcon?: LucideIcon;
  children: React.ReactNode;
}) => {
  return (
    <Card className="p-6 shadow-sm border-slate-200">
      <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
        {TitleIcon && <TitleIcon className="w-5 h-5 text-blue-500" />}
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </Card>
  );
};

const ApplicationStatusSelect = ({
  applicationId,
  currentStatus,
  placeholder,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus | null | undefined;
  placeholder?: string;
}) => {
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: async (status: ApplicationStatus) => {
      const result = await updateApplicationStatus(applicationId, {
        status,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }
      return result;
    },
    onSuccess: () => {
      router.refresh();
      toast.success("Status erfolgreich aktualisiert");
    },
    onError: (error) => {
      toast.error(error.message || "Fehler beim Aktualisieren des Status");
      console.error("Update error:", error);
    },
  });

  const handleStatusChange = (newStatus: string) => {
    updateMutation.mutate(newStatus as ApplicationStatus);
  };

  const statusOptions = {
    [ApplicationStatus.USER_SUBMITTED]: {
      label: "Eingereicht",
    },
    [ApplicationStatus.IN_REVIEW_BY_AGENCY]: {
      label: "In Prüfung durch Agentur",
    },
    [ApplicationStatus.IN_REVIEW_BY_EMPLOYER]: {
      label: "In Prüfung durch Arbeitgeber",
    },
    [ApplicationStatus.APPROVED_BY_AGENCY]: {
      label: "Von Agentur genehmigt",
    },
    [ApplicationStatus.APPROVED_BY_EMPLOYER]: {
      label: "Von Arbeitgeber genehmigt",
    },
    [ApplicationStatus.REJECTED_BY_AGENCY]: {
      label: "Von Agentur abgelehnt",
    },
    [ApplicationStatus.REJECTED_BY_EMPLOYER]: {
      label: "Von Arbeitgeber abgelehnt",
    },
  } satisfies Record<ApplicationStatus, { label: string }>;

  const value = currentStatus ?? ApplicationStatus.USER_SUBMITTED;

  return (
    <Select
      value={value}
      onValueChange={handleStatusChange}
      disabled={updateMutation.isPending}
    >
      <SelectTrigger className="py-0 px-5 font-semibold rounded-md w-auto">
        {statusOptions[value]?.label ?? placeholder}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusOptions).map(([value, option]) => (
          <SelectItem key={value} value={value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const ApplicationDetail = ({
  application,
  fotoUrl,
}: {
  application: GetApplication;
  fotoUrl: string | null;
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "employment">(
    "personal"
  );

  const employee = application.employee;
  const fullName =
    `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim();

  const formatValue = (value?: string | number | boolean | null | Date) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Ja" : "Nein";
    if (value instanceof Date) {
      return new Date(value).toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return String(value);
  };

  const formatStatus = (status?: GetApplication["status"]) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      USER_SUBMITTED: {
        label: "Eingereicht",
        color: "bg-blue-100 text-blue-800",
      },
      APPROVED_BY_AGENCY: {
        label: "Von Agentur genehmigt",
        color: "bg-green-100 text-green-800",
      },
      APPROVED_BY_EMPLOYER: {
        label: "Von Arbeitgeber genehmigt",
        color: "bg-green-100 text-green-800",
      },
      REJECTED: { label: "Abgelehnt", color: "bg-red-100 text-red-800" },
    };
    return statusMap[status || "USER_SUBMITTED"] || statusMap["USER_SUBMITTED"];
  };

  const statusInfo = formatStatus(application.status);

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast("Bewerber ID kopiert"));
  }

  return (
    <div className="min-h-screen bg-linear-to-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex items-center justify-between h-16">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/applications">
              <ArrowLeft className="w-4 h-4" />
              Zurück zu Bewerbungen
            </Link>
          </Button>
        </div>

        {/* Profile Header Card */}
        <Card className="overflow-hidden mb-8 shadow-sm border-0 pt-0">
          <div className="bg-linear-to-t from-primary/60 to-primary/100 h-32"></div>
          <div className="px-6 sm:px-8 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16">
              {fotoUrl !== null ? (
                <div className="relative h-40 w-40 rounded-lg border-4 border-background shadow-lg overflow-hidden">
                  <Image
                    src={fotoUrl}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 w-40 rounded-lg border-4 border-background shadow-lg bg-linear-to-t from-blue-100 to-blue-300 flex items-center justify-center">
                  <User className="w-20 h-20 text-primary" />
                </div>
              )}

              {/* Profile Info */}
              <div className="flex-1 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                    <button
                      onClick={
                        employee?.user.email !== undefined
                          ? () => copyToClipboard(employee.user.email)
                          : undefined
                      }
                      className="underline text-muted-foreground"
                    >
                      {employee?.user.email}
                    </button>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <ApplicationStatusSelect
                      applicationId={application.id}
                      currentStatus={application.status}
                      placeholder={statusInfo?.label || "Unbekannt"}
                    />
                    <Button className="h-10 py-0 mb-0 mt-0 pb-0">
                      <Download className="size-4" />
                      Herunterladen
                    </Button>
                  </div>
                  {/* <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${statusInfo?.color || ""}`}
                  ></div> */}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "personal"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Persönliche Informationen
            </button>
            <button
              onClick={() => setActiveTab("employment")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "employment"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Beschäftigung & Bewerbung
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <>
              <InformationSection title="Kontaktinformationen" titleIcon={User}>
                {employee?.phone && (
                  <InformationItemExternalLink
                    Icon={Phone}
                    label="Telefon"
                    href={`${WHATSAPP_URL}/send?phone=${employee.phone.replace(/[^0-9]/g, "")}`}
                  >
                    <InformationValue>{employee.phone}</InformationValue>
                  </InformationItemExternalLink>
                )}
                {employee?.instagram && (
                  <InformationItemExternalLink
                    Icon={null}
                    label="Instagram"
                    href={
                      employee.instagram.startsWith("http")
                        ? employee.instagram
                        : `https://instagram.com/${employee.instagram.replace(/^@/, "")}`
                    }
                  >
                    <InformationValue>{employee.instagram}</InformationValue>
                  </InformationItemExternalLink>
                )}
                <InformationItem Icon={Calendar} label="Geburtsdatum">
                  <InformationValue>{employee?.birthDate}</InformationValue>
                </InformationItem>
              </InformationSection>

              <InformationSection
                title="Bewerbungsdetails"
                titleIcon={FileText}
              >
                <InformationItem label="Nationalität">
                  <InformationValue>{employee?.nationality}</InformationValue>
                </InformationItem>
                <InformationItem label="Geschlecht">
                  <InformationValue>{employee?.gender}</InformationValue>
                </InformationItem>
                <InformationItem label="Geburtsort">
                  <InformationValue>{employee?.birthPlace}</InformationValue>
                </InformationItem>
                <InformationItem label="Wohnort">
                  <InformationValue>{employee?.city}</InformationValue>
                </InformationItem>
              </InformationSection>
            </>
          )}

          {/* Employment Information Tab */}
          {activeTab === "employment" && (
            <>
              <InformationSection
                title="Bewerbungsdetails"
                titleIcon={Calendar}
              >
                <InformationItem Icon={Calendar} label="Bewerbungsdatum">
                  <InformationValue>{application.createdAt}</InformationValue>
                </InformationItem>
                <InformationItem Icon={null} label="Anwendungstyp">
                  <InformationValue>{application.type}</InformationValue>
                </InformationItem>
                <InformationItem Icon={null} label="In Deutschland gewesen">
                  <InformationValue>
                    {application.hasBeenInGermanyBefore}
                  </InformationValue>
                </InformationItem>
                <InformationItem Icon={null} label="Führerschein">
                  <InformationValue>
                    {application.driverLicense}
                  </InformationValue>
                </InformationItem>
              </InformationSection>

              <InformationSection
                title="Bildung & Gesundheit"
                titleIcon={FileText}
              >
                <InformationItem label="Universität">
                  <InformationValue>{application.university}</InformationValue>
                </InformationItem>
                <InformationItem label="Studienrichtung">
                  <InformationValue>
                    {application.studySubject}
                  </InformationValue>
                </InformationItem>
                <InformationItem label="Deutsche Sprachkenntnisse">
                  <InformationValue>{application.germanLevel}</InformationValue>
                </InformationItem>
                <InformationItem label="Weitere Sprachen">
                  <InformationValue>
                    {application.otherLanguages}
                  </InformationValue>
                </InformationItem>
                <InformationItem label="Schichtarbeit möglich">
                  <InformationValue>{application.shiftWork}</InformationValue>
                </InformationItem>
                <InformationItem label="Fahrrad fahren möglich">
                  <InformationValue>{application.canRideBike}</InformationValue>
                </InformationItem>
                <InformationItem label="Gesundheitliche Einschränkungen">
                  <InformationValue>
                    {application.healthRestrictions}
                  </InformationValue>
                </InformationItem>
                <InformationItem label="Allergien">
                  <InformationValue>{application.allergies}</InformationValue>
                </InformationItem>
              </InformationSection>
            </>
          )}
        </div>

        {/* Description Section */}
        {/* Currently no description field in Application */}

        {/* Previous Stay Section */}
        {activeTab === "employment" && (
          <div className="mb-8">
            <InformationSection
              title="Vorherige Deutschlandaufenthalte"
              titleIcon={Calendar}
            >
              <InformationItem label="Ort des Aufenthalts">
                <InformationValue>
                  {application.previousStayPlace}
                </InformationValue>
              </InformationItem>
              <InformationItem label="Von">
                <InformationValue>
                  {application.previousStayPeriodFrom}
                </InformationValue>
              </InformationItem>
              <InformationItem label="Bis">
                <InformationValue>
                  {application.previousStayPeriodTo}
                </InformationValue>
              </InformationItem>
            </InformationSection>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            Bewerbungs-ID:{" "}
            <span className="font-mono text-slate-700">{application.id}</span>
          </p>
          <p className="mt-2">
            Eingereicht:{" "}
            {formatValue(application.createdAt as string | Date | undefined)}
          </p>
        </div>
      </div>
    </div>
  );
};
