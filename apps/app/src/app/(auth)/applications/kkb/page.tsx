import { ApplicationForm } from "@/components/forms/application-form";
import { ApplicationType } from "@workspace/server/db";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const KKBPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ visa_duration_in_months?: string | string[] }>;
}) => {
  const { visa_duration_in_months } = await searchParams;

  return (
    <div className="w-full mx-auto space-y-6 pt-32 pb-10">
      <Button variant={"ghost"} className="flex max-w-max" asChild>
        <Link href={"/"}>
          <ArrowLeft className="mr-2" />
          Back
        </Link>
      </Button>
      <ApplicationForm
        type={
          {
            "3": ApplicationType.KKB3,
            "8": ApplicationType.KKB8,
          }[visa_duration_in_months as string] || ApplicationType.KKB8
        }
      />
    </div>
  );
};

export default KKBPage;
