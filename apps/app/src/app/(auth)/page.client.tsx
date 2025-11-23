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

  const fullName = `${user.userInformation?.firstName ?? ""} ${
    user.userInformation?.lastName ?? ""
  }`.trim();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}

        {user.userInformation === null || isEditing ? (
          <Card>
            <CardHeader>
              {isEditing && user.userInformation !== null && (
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
                    userInformation={user.userInformation}
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
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center pb-6 border-b">
                  <Avatar name={fullName} className="size-24" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold">{fullName}</h2>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{sessionUser.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {/* Gender */}
                  {user.userInformation?.gender && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geschlecht
                      </p>
                      <p className="text-base">
                        {user.userInformation.gender === "MALE"
                          ? "Männlich"
                          : user.userInformation.gender === "FEMALE"
                            ? "Weiblich"
                            : "Divers"}
                      </p>
                    </div>
                  )}

                  {/* Nationality */}
                  {user.userInformation?.nationality && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Staatsangehörigkeit
                      </p>
                      <p className="text-base">
                        {user.userInformation.nationality}
                      </p>
                    </div>
                  )}

                  {/* Birth Date */}
                  {user.userInformation?.birthDate && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsdatum
                      </p>
                      <p className="text-base">
                        {new Date(
                          user.userInformation.birthDate
                        ).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {/* Birth Place */}
                  {user.userInformation?.birthPlace && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsort
                      </p>
                      <p className="text-base">
                        {user.userInformation.birthPlace}
                      </p>
                    </div>
                  )}

                  {/* Birth Country */}
                  {user.userInformation?.birthCountry && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Geburtsland
                      </p>
                      <p className="text-base">
                        {user.userInformation.birthCountry}
                      </p>
                    </div>
                  )}
                </div>
              </>
            </CardContent>
          </Card>
        )}

        {/* Profile Form */}
        {user.userInformation !== null && !isEditing && (
          <ApplicationsList applications={applications} />
        )}
      </div>
    </div>
  );
}
