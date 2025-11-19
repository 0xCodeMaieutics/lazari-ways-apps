import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/server/auth";
import { redirect } from "next/navigation";
import { applicationQueries } from "@workspace/server/db";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  const applicationsResult = await applicationQueries.getApplications({
    userId: session.user.id,
  });

  if (applicationsResult.isErr()) throw applicationsResult.error;

  return (
    <OnboardingPageClient
      data={session}
      applications={applicationsResult.value}
    />
  );
}
