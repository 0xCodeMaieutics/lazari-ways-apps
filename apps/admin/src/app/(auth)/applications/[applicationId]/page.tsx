import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { applicationQueries } from "@workspace/server/db";
import { notFound } from "next/navigation";

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

  const formatValue = (value?: string | number | boolean | null | Date) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  const fullName = `${application?.employee?.firstName || ""} ${
    application?.employee?.lastName || ""
  }`.trim();

  return (
    <div className="py-10">
      <div className="flex justify-between">
        <Button variant={"ghost"} className="flex max-w-max" asChild>
          <Link href={"/"}>
            <ArrowLeft className="mr-2" />
            Back
          </Link>
        </Button>
        <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
          <Button className="">Download pdf</Button>
          <Button className="">Download Guili&apos;s pdf</Button>
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-2xl mt-4">
          <span className="font-semibold">{fullName}&apos;s</span>{" "}
          Application{" "}
        </h1>
        <div className="space-y-4">
          <h1 className="text-xl text-muted-foreground font-semibold">
            Personal Information
          </h1>
          {Object.entries(application || {}).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2 sm:gap-4 sm:flex-row">
              <span className="text-muted-foreground">{`${key}:`}</span>
              <span className="font-semibold">
                {formatValue(application?.employee?.firstName)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
