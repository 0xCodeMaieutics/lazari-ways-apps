"use client";
import Avatar from "boring-avatars";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Mail, Pencil, ArrowLeft } from "lucide-react";
import { Session, User } from "@workspace/server/auth";
import { ApplicationsList } from "@/components/applications-list";
import { GetApplications, GetUserProfile } from "@workspace/server/db";
import { ProfileForm } from "@/components/forms/profile-form";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";

export function OnboardingPageClient({
  data,
  applications,
  user,
}: {
  data: { session: Session; user: User };
  applications: GetApplications[];
  user: GetUserProfile;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const { user: sessionUser } = data;

  const fullName = `${user.employee?.firstName ?? ""} ${
    user.employee?.lastName ?? ""
  }`.trim();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}

        {user.employee === null || isEditing ? (
          <Card>
            <CardHeader>
              {isEditing && user.employee !== null && (
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
                    userInformation={user.employee}
                    onSaveSuccess={() => setIsEditing(false)}
                    onCancel={() => setIsEditing(false)}
                  />
                </div>
              </>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg md:text-xl">Profil</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Bearbeiten
              </Button>
            </CardHeader>
            <CardContent>
              <>
                {/* User Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {fullName && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Vollständiger Name
                      </p>
                      <p className="text-base">{fullName}</p>
                    </div>
                  )}
                  {user.email && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        E-Mail
                      </p>
                      <p className="text-base">{user.email}</p>
                    </div>
                  )}

                  {/* Gender */}
                  {user.employee?.gender && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geschlecht
                      </p>
                      <p className="text-base">
                        {user.employee.gender === "MALE"
                          ? "Männlich"
                          : user.employee.gender === "FEMALE"
                            ? "Weiblich"
                            : "Divers"}
                      </p>
                    </div>
                  )}

                  {/* Nationality */}
                  {user.employee?.nationality && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Staatsangehörigkeit
                      </p>
                      <p className="text-base">{user.employee?.nationality}</p>
                    </div>
                  )}

                  {/* Birth Date */}
                  {user.employee?.birthDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsdatum
                      </p>
                      <p className="text-base">
                        {new Date(user.employee.birthDate).toLocaleDateString(
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
                  {user.employee?.birthPlace && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsort
                      </p>
                      <p className="text-base">{user.employee.birthPlace}</p>
                    </div>
                  )}

                  {/* Birth Country */}
                  {user.employee?.birthCountry && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsland
                      </p>
                      <p className="text-base">{user.employee.birthCountry}</p>
                    </div>
                  )}
                </div>
              </>
            </CardContent>
          </Card>
        )}

        {/* Profile Form */}
        {user.employee !== null && !isEditing && (
          <ApplicationsList applications={applications} />
        )}
      </div>
    </div>
  );
}
