"use client";
import Avatar from "boring-avatars";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Mail, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { Session, User } from "better-auth";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import { ApplicationsList } from "@/components/applications-list";
import { GetAllUserApplications } from "@workspace/server/db";

function AccountDetail({
  label,
  value,
  icon,
  isMonospace = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isMonospace?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div
        className={`p-3 rounded-md bg-muted ${isMonospace ? "font-mono text-sm break-all" : ""}`}
      >
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}

export function OnboardingPageClient({
  data,
  applications,
}: {
  data: { session: Session; user: User };
  applications: GetAllUserApplications;
}) {
  const { user, session } = data;

  const createdDate = format(new Date(user.createdAt), "PPP", { locale: ka });

  const loggedInDate = format(new Date(session.createdAt), "PPP p", {
    locale: ka,
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">პროფილი</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <Avatar name={user.name ?? ""} className="size-24" />

              {/* Basic Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* Email Verification Badge */}
                  <Badge
                    variant={user.emailVerified ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {user.emailVerified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              ანგარიშის დეტალები
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <AccountDetail
                label="პროფილი შეიქმნა"
                value={createdDate}
                icon={<Calendar className="h-4 w-4" />}
              />

              <AccountDetail
                label="შესული"
                value={loggedInDate}
                icon={<Calendar className="h-4 w-4" />}
              />

              <AccountDetail
                label="მომხმარებლის ID"
                value={user.id}
                isMonospace
              />
            </div>
          </CardContent>
        </Card>

        <ApplicationsList applications={applications} />
      </div>
    </div>
  );
}
