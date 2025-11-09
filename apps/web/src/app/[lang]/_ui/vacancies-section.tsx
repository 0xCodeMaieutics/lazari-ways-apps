import { scrollSmoothlyToSection, SECTION_IDS } from "@/app/[lang]/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Euro, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { EmploymentTypeKey, GetVacancies } from "@workspace/db";

const employmentTypeLabels = {
  FULL_TIME: "სრული განაკვეთი",
  PART_TIME: "ნახევარი განაკვეთი",
  INTERN: "სტაჟირება",
  VOLUNTEER: "სტაჟირება",
} satisfies Record<EmploymentTypeKey, string>;

const VacancyCard = ({
  vacancy,
  id,
}: {
  vacancy: GetVacancies[0];
  id: string;
}) => {
  return (
    <Card className="group flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden pt-0">
      {vacancy.imageUrl && (
        <div className="relative w-full h-[300px] overflow-hidden">
          <Image
            src={vacancy.imageUrl}
            alt={vacancy.title}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl transition-colors">
              {vacancy.title}
            </CardTitle>
          </div>
          <span className="max-w-max shrink-0 px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md">
            {employmentTypeLabels[vacancy.employmentType as EmploymentTypeKey]}
          </span>
        </div>
        {/* Salary Info */}
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
          <Euro className="h-5 w-5 text-primary shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">ანაზღაურება</p>
            <p className="font-semibold text-lg">
              {vacancy.priceMin.toFixed(2)}€ - {vacancy.priceMax.toFixed(2)}€/სთ
            </p>
          </div>
        </div>

        <CardDescription className="text-base leading-relaxed">
          {vacancy.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-end space-y-6">
        <div className="flex justify-center">
          <Button
            className="max-w-xs mx-auto text-lg font-semibold h-12 cursor-pointer"
            size={"lg"}
            variant={"link"}
            asChild
          >
            <Link href={`/vacancies/${id}`}>
              დეტალურად
              <div className="border border-primary rounded-full p-1 animate-bounce-left ml-1">
                <ArrowRight className="size-4" />
              </div>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const VacancySection = ({ vacancies }: { vacancies: GetVacancies }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        onClick={() => {
          scrollSmoothlyToSection(SECTION_IDS.vacancies);
        }}
      >
        ვაკანსიები
      </SectionHeader>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(vacancies).map(([id, vacancy], index) => (
          <VacancyCard key={index} vacancy={vacancy} id={id} />
        ))}
      </div>
    </div>
  );
};
