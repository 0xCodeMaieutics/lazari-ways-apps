"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Calendar,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  LanguagesIcon,
  CheckCircle2,
  Copy,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GetVacancies } from "@workspace/server/db";
import { ApplicationType } from "@workspace/server/db/models";
import { Badge } from "@workspace/ui/components/badge";
import { translationsContext } from "@/lib/context/translations";
import { Translations } from "@/i18n/translations";
import { useParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { useState } from "react";
import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { toast } from "sonner";
import { sleep } from "@/utils/sleep";
import { LogoAndText } from "../text-logo";

const VACANCY_ID_PREFIX = "LZRY-";

const applicationTypeLabels: Record<ApplicationType, string> = {
  [ApplicationType.KKB3]: "KKB 3 თვე",
  [ApplicationType.KKB8]: "KKB 8 თვე",
  [ApplicationType.STUDENT]: "სტუდენტი",
};

const VacancyCard = ({
  vacancy,
  lang,
}: {
  vacancy: GetVacancies;
  lang: string;
}) => {
  const [copied, setCopied] = useState(false);
  const vacancyIdWithPrefix = `${VACANCY_ID_PREFIX}${vacancy.vacancyId}`;
  const handleCopyVacancyId = async () => {
    (
      await tryCatchAsync(() =>
        navigator.clipboard.writeText(vacancyIdWithPrefix)
      )
    ).match({
      ok: () => {
        setCopied(true);
        toast.success(`ვაკანსიის ID ${vacancyIdWithPrefix} დააკოპირეთ`);
        sleep(2000).then(() => setCopied(false));
      },
      err: () => toast.error("მოხდა შეცდომა"),
    });
  };

  return (
    <Card className="group pt-0 flex flex-col h-full gap-4 sm:gap-6 overflow-hidden border-2">
      {/* Image Header with Overlays */}
      <div className="relative">
        {vacancy.photo ? (
          <div className="relative w-full h-[280px]">
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_ENDPOINT}${vacancy.photo.key}`}
              fill
              alt={vacancy.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5">
            <LogoAndText lang="ka" />
          </div>
        )}

        <Badge className="absolute top-4 left-4 h-9 flex items-center gap-2 px-4 bg-background/95 backdrop-blur-sm shadow-lg border-primary/20">
          <MapPin className="size-4 text-primary" />
          <span className="font-semibold text-primary">{vacancy.location}</span>
        </Badge>

        <Badge
          role="button"
          onClick={handleCopyVacancyId}
          className="absolute bottom-4 right-4 h-9 flex items-center gap-2 px-4 bg-foreground text-background font-bold cursor-pointer hover:bg-foreground/90 transition-all shadow-lg"
        >
          {copied ? (
            <CheckCircle2 className="size-4 animate-in zoom-in" />
          ) : (
            <Copy className="size-4" />
          )}
          <span>{vacancyIdWithPrefix}</span>
        </Badge>
      </div>

      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold leading-tight transition-colors">
            {vacancy.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-3 rounded-lg border border-border">
            <Clock className="size-5 text-foreground shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                ხანგრძლივობა
              </p>
              <p className="font-bold text-sm truncate">{vacancy.duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg border border-border">
            <Calendar className="size-5 text-foreground shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                დაწყება
              </p>
              <p className="font-bold text-sm truncate">{vacancy.beginDate}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 rounded-lg border border-border">
          <LanguagesIcon className="size-5 text-foreground shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium">
              ენის ცოდნა
            </p>
            <p className="font-bold text-sm">{vacancy.languageLevel}</p>
          </div>
        </div>
        {vacancy.acceptableApplicationTypes &&
          vacancy.acceptableApplicationTypes.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-border">
              <UserCheck className="size-5 text-foreground shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  მიღებადი განაცხადის ტიპები
                </p>
                <div className="flex flex-wrap gap-2">
                  {vacancy.acceptableApplicationTypes.map((type) => (
                    <Badge key={type} className="text-xs font-semibold">
                      {applicationTypeLabels[type]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        <div className="space-y-2">
          <Button
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-xl transition-all"
            size="lg"
            asChild
          >
            <Link href={`/${lang}/vacancies/${vacancy.id}`}>
              დეტალურად ნახვა
              <ArrowRight className="size-5 ml-2-x-1 transition-transform" />
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
  vacanciesTotal,
  currentPage,
  pageSize,
}: {
  vacancies: GetVacancies[];
  translations: Translations;
  vacanciesTotal: number;
  currentPage: number;
  pageSize: number;
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
            <div className="space-y-6">
              {vacanciesTotal > 0 && (
                <div className="flex justify-end">
                  <p className="text-sm font-medium text-muted-foreground">
                    სულ{" "}
                    <span className="text-foreground font-bold">
                      {vacanciesTotal}
                    </span>{" "}
                    ვაკანსია
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vacancies.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    lang={lang as string}
                  />
                ))}
              </div>
              {vacanciesTotal > 0 && (
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={vacanciesTotal}
                />
              )}
            </div>

            {/* Empty State */}
            {vacancies.length === 0 && (
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
