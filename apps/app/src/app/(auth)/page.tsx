import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/server/auth";
import { redirect } from "next/navigation";
import { applicationQueries, userQueries } from "@workspace/server/db";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  const userResult = await userQueries.getUserProfileById(session.user.id);

  if (userResult.isErr()) {
    console.error(userResult.error);
    redirect("/login");
  }

  const user = userResult.value;
  if (user === null) redirect("/login");

  const applicationsResult = await applicationQueries.getApplications({
    employeeId: user?.employee?.id,
  });

  if (applicationsResult.isErr()) throw applicationsResult.error;

  return (
    <OnboardingPageClient applications={applicationsResult.value} user={user} />
  );
}
