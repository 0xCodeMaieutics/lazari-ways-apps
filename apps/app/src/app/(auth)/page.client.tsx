"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Pencil, ArrowLeft } from "lucide-react";
import { ApplicationsList } from "@/components/applications-list";
import { GetApplications, GetEmployee } from "@workspace/server/db";
import { ProfileForm } from "@/components/forms/profile-form";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

export function OnboardingPageClient({
  applications,
  employee,
  employeeFoto,
}: {
  applications: GetApplications[];
  employee: GetEmployee | null;
  employeeFoto: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const fullName = `${employee?.firstName ?? ""} ${
    employee?.lastName ?? ""
  }`.trim();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}

        {employee === null || isEditing ? (
          <Card>
            <CardHeader>
              {isEditing && employee !== null && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center max-w-max mb-4"
                >
                  <ArrowLeft className="size-5" />
                  Züruck zum Profil
                </Button>
              )}

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg md:text-xl">
                    Persönliche Informationen
                  </CardTitle>
                  <CardDescription>
                    Verwalten Sie Ihre persönlichen Daten
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <>
                <div className="pt-6">
                  <ProfileForm
                    userInformation={employee}
                    onSaveSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              </>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle>
                <div className="flex items-center gap-2.5">
                  {employeeFoto !== null && (
                    <div className="relative rounded-full overflow-hidden size-20">
                      <Image
                        src={employeeFoto}
                        fill
                        alt="Employee photo"
                        sizes="200x200"
                      />
                    </div>
                  )}
                  {fullName && employee.user.email && (
                    <div>
                      <p className="text-lg font-semibold">{fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.user.email}
                      </p>
                    </div>
                  )}
                </div>
              </CardTitle>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Bearbeite
              </Button>
            </CardHeader>
            <CardContent>
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {/* Gender */}
                  {employee?.gender && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geschlecht
                      </p>
                      <p className="text-base">
                        {employee.gender === "MALE"
                          ? "Männlich"
                          : employee.gender === "FEMALE"
                            ? "Weiblich"
                            : "Divers"}
                      </p>
                    </div>
                  )}

                  {/* Nationality */}
                  {employee?.nationality && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Staatsangehörigkeit
                      </p>
                      <p className="text-base">{employee?.nationality}</p>
                    </div>
                  )}

                  {/* Birth Date */}
                  {employee?.birthDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsdatum
                      </p>
                      <p className="text-base">
                        {new Date(employee?.birthDate).toLocaleDateString(
                          "de-DE",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Birth Place */}
                  {employee?.birthPlace && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsort
                      </p>
                      <p className="text-base">{employee.birthPlace}</p>
                    </div>
                  )}

                  {/* Birth Country */}
                  {employee?.birthCountry && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsland
                      </p>
                      <p className="text-base">{employee.birthCountry}</p>
                    </div>
                  )}
                </div>
              </>
            </CardContent>
          </Card>
        )}

        {/* Applications List */}
        {employee !== null && !isEditing && (
          <ApplicationsList applications={applications} />
        )}
      </div>
    </div>
  );
}
