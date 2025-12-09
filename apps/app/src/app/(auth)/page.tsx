import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@workspace/server/auth";
import { redirect } from "next/navigation";
import {
  applicationQueries,
  employeeQueries,
  GetApplications,
} from "@workspace/server/db";
import { env } from "@/env";

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

  const employeeResult = await employeeQueries.getEmployeeByUserId(
    session.user.id
  );

  if (employeeResult.isErr()) {
    console.error("EMPLOYEE_ERROR:", employeeResult.error);
    throw new Error("INTERNAL_SERVER_ERROR", {
      cause: employeeResult.error.type,
    });
  }

  let employeeFoto: string | null = null;
  if (employeeResult.value !== null) {
    const employeeFotoResult = await employeeQueries.getEmployeeFotoSignedUrl(
      employeeResult.value.id
    );

    if (employeeFotoResult.isErr()) {
      console.error("EMPLOYEE_FOTO_ERROR:", employeeFotoResult.error);
      throw new Error("INTERNAL_SERVER_ERROR");
    }

    if (employeeFotoResult.value.amzSignedUrlSearchParams !== null) {
      employeeFoto = `${env.S3_ENDPOINT}/${process.env.NODE_ENV === "development" ? env.S3_BUCKET_NAME + "/" : ""}${employeeFotoResult.value.key}?${employeeFotoResult.value.amzSignedUrlSearchParams}`;
    }
  }

  let applications: GetApplications[] = [];

  if (employeeResult.value !== null) {
    const applicationsResult = await applicationQueries.getApplications({
      employeeId: employeeResult.value.id,
    });
    if (applicationsResult.isErr()) {
      console.error("APPLICATIONS ERROR:", applicationsResult.error);
      throw new Error("INTERNAL_SERVER_ERROR", {
        cause: applicationsResult.error.cause,
      });
    }
    applications = applicationsResult.value;
  }

  return (
    <OnboardingPageClient
      applications={applications}
      employee={employeeResult.value}
      employeeFoto={employeeFoto}
    />
  );
}
