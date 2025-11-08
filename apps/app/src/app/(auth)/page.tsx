import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/db";
import { redirect } from "next/navigation";
import { applicationQueries } from "@workspace/db";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  const applications = await applicationQueries.getAllUserApplications(
    session.user.id
  );

  return <OnboardingPageClient data={session} applications={applications} />;
}
