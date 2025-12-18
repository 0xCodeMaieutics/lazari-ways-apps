"use client";

import { ApplicationsList } from "@/components/applications-list";
import { GetApplications, GetEmployee } from "@workspace/server/db";
import { ProfileForm } from "@/components/forms/profile-form";

export function OnboardingPageClient({
  applications,
  employee,
}: {
  applications: GetApplications[];
  employee: GetEmployee | null;
}) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {employee === null && <ProfileForm />}
        {employee !== null && <ApplicationsList applications={applications} />}
      </div>
    </div>
  );
}
