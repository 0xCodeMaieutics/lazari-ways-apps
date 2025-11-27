import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/server/auth";
import { redirect } from "next/navigation";
import { applicationQueries, userQueries } from "@workspace/server/db";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [x: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    console.error("SESSION_NOT_FOUND");
    return redirect(
      "/login?" +
        new URLSearchParams({
          vacancyId: params.vacancyId as string,
        }).toString()
    );
  }

  const userResult = await userQueries.getUserProfileById(session.user.id);

  if (userResult.isErr()) {
    console.error("USER_ERROR:", userResult.error);
    throw new Error("INTERNAL_SERVER_ERROR", {
      cause: userResult.error.cause,
    });
  }

  const user = userResult.value;
  if (user === null) {
    console.error("USER_NOT_FOUND");
    return redirect(
      "/login?" +
        new URLSearchParams({
          vacancyId: params.vacancyId as string,
        }).toString()
    );
  }

  const applicationsResult = await applicationQueries.getApplications({
    employeeId: user?.employee?.id,
  });

  if (applicationsResult.isErr()) {
    console.error("APPLICATIONS ERROR:", applicationsResult.error);
    throw new Error("INTERNAL_SERVER_ERROR", {
      cause: applicationsResult.error.cause,
    });
  }

  return (
    <OnboardingPageClient applications={applicationsResult.value} user={user} />
  );
}
