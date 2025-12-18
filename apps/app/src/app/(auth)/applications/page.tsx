import { ApplicationForm } from "@/components/forms/application-form";
import { auth } from "@workspace/server/auth";
import {
  applicationQueries,
  employeeQueries,
  vacancyQueries,
} from "@workspace/server/db";
import { ApplicationType } from "@workspace/server/db/models";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const applicationTypeToLabel = {
  KKB3: "Kontingentierte Beschäftigung - 3 Monate",
  KKB8: "Kontingentierte Beschäftigung - 8 Monate",
  STUDENT: "Antrag auf ein Studentenvisum",
} satisfies Record<ApplicationType, string>;

export default async function ApplicationsPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<
    string | Record<string, string> | string[][] | URLSearchParams | undefined
  >;
}) {
  const searchParams = new URLSearchParams(await searchParamsPromise);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user)
    redirect("/login?" + searchParams.toString());

  const type = searchParams.get("type") as ApplicationType | null;
  const vacancyId = searchParams.get("vacancyId") || null;

  const isValidType = Object.values(ApplicationType).includes(
    type as ApplicationType
  );

  if (vacancyId === null) {
    redirect(
      "/?" +
        new URLSearchParams({
          error_type: "VACANCY_ID_NOT_SPECIFIED",
        }).toString()
    );
  }

  if (type === null) {
    redirect(
      "/?" +
        new URLSearchParams({
          error_type: "TYPE_NOT_SPECIFIED",
          vacancyId: vacancyId,
        }).toString()
    );
  }
  if (!isValidType) {
    searchParams.set("error_type", "INVALID_TYPE");
    redirect("/?" + searchParams.toString());
  }

  const foundVacancy = await vacancyQueries.getVacancyById(vacancyId ?? "");
  if (foundVacancy.isErr()) {
    throw new Error("Failed to fetch vacancy.");
  }

  if (foundVacancy.value === null) {
    searchParams.set("error_type", "VACANCY_NOT_FOUND");
    redirect(
      "/?" +
        new URLSearchParams({
          error_type: "VACANCY_NOT_FOUND",
          vacancyId,
        }).toString()
    );
  }

  const employeeResult = await employeeQueries.getEmployeeByUserId(
    session.user.id
  );

  if (employeeResult.isErr()) {
    throw new Error("Failed to fetch application.");
  }
  const employee = employeeResult.value;
  if (employee === null) {
    redirect(
      "/login?" +
        new URLSearchParams({
          error_type: "EMPLOYEE_NOT_FOUND",
          vacancyId: vacancyId ?? "",
        }).toString()
    );
  }

  const foundApplication =
    await applicationQueries.getEmployeeApplicationByType({
      type,
      employeeId: employee.id,
      vacancyId,
    });

  if (foundApplication.isErr()) {
    throw new Error("Failed to fetch application.");
  }

  if (foundApplication.value !== null) {
    redirect(
      "/?" +
        new URLSearchParams({
          error_type: "APPLICATION_ALREADY_SUBMITTED",
          vacancyId: vacancyId ?? "",
        }).toString()
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-6">
      <Button variant={"ghost"} className="flex max-w-max" asChild>
        <Link
          href={
            "/?" +
            new URLSearchParams({
              vacancyId,
            }).toString()
          }
        >
          <ArrowLeft className="mr-2" />
          Zurück zur Bewerbungsliste
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{applicationTypeToLabel[type]}</CardTitle>
          <CardDescription>
            Bitte füllen Sie alle erforderlichen Felder aus.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <ApplicationForm employeeId={employee.id} type={type} />
        </CardContent>
      </Card>
    </div>
  );
}
