import { ApplicationForm } from "@/components/forms/application-form";
import { auth } from "@workspace/server/auth";
import { applicationQueries, userQueries } from "@workspace/server/db";
import { ApplicationType } from "@workspace/server/db/models";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  const userResult = await userQueries.getUserProfileById(session.user.id);

  const foundApplication = await applicationQueries.getApplicationByType(
    params.type as ApplicationType
  );

  if (foundApplication.isErr()) {
    console.error(foundApplication.error);
    throw new Error("Failed to fetch application.");
  }
  if (foundApplication.value !== null) {
    redirect("/");
  }

  if (userResult.isErr()) {
    console.error(userResult.error);
    throw new Error("Failed to fetch application.");
  }

  const user = userResult.value;
  if (user === null) redirect("/login");

  if (user.employee?.id === undefined) redirect("/login");
  return (
    <div className="w-full mx-auto max-w-7xl space-y-6 pt-10 pb-10 px-10">
      <Button variant={"ghost"} className="flex max-w-max" asChild>
        <Link href={"/"}>
          <ArrowLeft className="mr-2" />
          Back
        </Link>
      </Button>
      <ApplicationForm
        employeeId={user.employee.id}
        type={params.type as ApplicationType}
      />
    </div>
  );
}
