import { applicationQueries, employeeQueries } from "@workspace/server/db";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { ApplicationDetail } from "./page.client";

export const dynamic = "force-dynamic";

const ApplicationDetailPage = async ({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) => {
  const { applicationId } = await params;

  const applicationResult =
    await applicationQueries.getApplication(applicationId);

  if (applicationResult.isErr()) return notFound();

  const application = applicationResult.value;

  if (application === null || application?.employee === null) return notFound();

  let fotoUrl: string | undefined;
  const fotoUrlResult = await employeeQueries.getEmployeeFotoSignedUrl(
    application.employee.id
  );

  if (fotoUrlResult.isOk()) {
    const { key, amzSignedUrlSearchParams } = fotoUrlResult.value;
    if (amzSignedUrlSearchParams !== null) {
      fotoUrl = `${env.S3_ENDPOINT}/${process.env.NODE_ENV === "development" ? env.S3_BUCKET_NAME + "/" : ""}${key}?${amzSignedUrlSearchParams}`;
    }
  }

  if (application.employee === null) return notFound();

  return (
    <ApplicationDetail
      application={application}
      employee={application.employee}
      fotoUrl={fotoUrl ?? null}
    />
  );
};

export default ApplicationDetailPage;
