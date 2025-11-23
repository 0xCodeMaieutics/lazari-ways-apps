import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/server/auth";
import { redirect } from "next/navigation";
import { applicationQueries, userQueries } from "@workspace/server/db";
import { Results } from "@workspace/shared/error-handling/result";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  const queryResult = await Results.allAsync([
    applicationQueries.getApplications({
      userId: session.user.id,
    }),
    userQueries.getUserProfileById(session.user.id),
  ]);

  if (queryResult.isErr()) throw queryResult.error;

  const [applications, user] = queryResult.value;

  if (user === null) redirect("/login");

  return (
    <OnboardingPageClient
      data={session}
      applications={applications}
      user={user}
    />
  );
}
