import { ApplicationForm } from "@/components/forms/application-form";
import { ApplicationType } from "@workspace/server/db/models";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full mx-auto max-w-7xl space-y-6 pt-10 pb-10 px-10">
      <Button variant={"ghost"} className="flex max-w-max" asChild>
        <Link href={"/"}>
          <ArrowLeft className="mr-2" />
          Back
        </Link>
      </Button>
      <ApplicationForm type={params.type as ApplicationType} />
    </div>
  );
}
