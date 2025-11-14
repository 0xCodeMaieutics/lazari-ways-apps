"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Euro, ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmploymentTypeKey, GetVacancies } from "@workspace/server/db";
import { Badge } from "@workspace/ui/components/badge";
import { tryCatchAsync } from "@workspace/shared";
import { toast } from "sonner";
import { translationsContext } from "@/lib/context/translations";
import { Translations } from "@/i18n/translations";
import { useParams } from "next/navigation";

const employmentTypeLabels = {
  FULL_TIME: "სრული განაკვეთი",
  PART_TIME: "ნახევარი განაკვეთი",
  INTERN: "სტაჟირება",
  VOLUNTEER: "სტაჟირება",
} satisfies Record<EmploymentTypeKey, string>;

const VacancyCard = ({
  vacancy,
  lang,
}: {
  vacancy: GetVacancies[0];
  lang: string;
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
          <Badge className="absolute h-8 top-5 left-5 flex items-center gap-2 px-4">
            <span className="size-2.5 bg-accent rounded-full animate-pulse" />
            <span>{vacancy.location}</span>
          </Badge>
          <Badge
            role="button"
            onClick={async () => {
              (
                await tryCatchAsync(() =>
                  navigator.clipboard.writeText(vacancy.vacancyName)
                )
              ).match({
                ok: () => {
                  toast.success(`${vacancy.vacancyName} დააკოპირეთ`);
                },
                err: () => toast.error("მოხდა შეცდომა"),
              });
            }}
            aria-description="This button is clickable to copy the vacancy name"
            className="absolute h-8 top-5 right-5 flex items-center gap-2 px-4 bg-foreground text-background font-semibold cursor-pointer hover:bg-foreground/90 transition-colors"
          >
            <span>{vacancy.vacancyName}</span>
          </Badge>
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
            <Link href={`/${lang}/vacancies/${vacancy.id}`}>
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

export const VacanciesListingClient = ({
  vacancies,
  translations,
}: {
  vacancies: GetVacancies;
  translations: Translations;
}) => {
  const { lang } = useParams();

  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full bg-linear-to-b from-background via-background to-secondary/20">
        {/* Hero Section */}
        <section className="relative px-6 pt-40">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Briefcase className="size-4" />
                <span className="text-sm font-semibold">
                  {translations["header.badge"]}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {translations["header.title"]}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {translations["header.description"]}
              </p>
            </div>

            {/* Vacancies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(vacancies).map(([id, vacancy]) => (
                <VacancyCard key={id} vacancy={vacancy} lang={lang as string} />
              ))}
            </div>

            {/* Empty State */}
            {Object.keys(vacancies).length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="size-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  {translations["empty.title"]}
                </h3>
                <p className="text-muted-foreground">
                  {translations["empty.description"]}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 md:py-24 bg-secondary/30">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              {translations["cta.title"]}
            </h2>
            <p className="text-lg text-muted-foreground">
              {translations["cta.description"]}
            </p>
            <Button
              size="lg"
              className="text-lg font-semibold h-14 px-10"
              asChild
            >
              <Link href={`/${lang}#contact`}>
                {translations["cta.button"]}
                <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </translationsContext.Provider>
  );
};
