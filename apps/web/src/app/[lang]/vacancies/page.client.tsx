"use client";
import {
  Card,
  CardContent,
  CardDescription,
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
  Euro,
  Copy,
  CheckCircle2,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Vacancy } from "@workspace/server/db";
import { Badge } from "@workspace/ui/components/badge";
import { tryCatchAsync } from "@workspace/shared";
import { toast } from "sonner";
import { translationsContext } from "@/lib/context/translations";
import { Translations } from "@/i18n/translations";
import { useParams } from "next/navigation";
import { useState } from "react";
import { sleep } from "@/utils/sleep";

const VACANCY_ID_PREFIX = "LZRY-";

const VacancyCard = ({ vacancy, lang }: { vacancy: Vacancy; lang: string }) => {
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

  const firstPhoto = vacancy.photos?.[0];
  const hasMedia = vacancy.photos?.length > 0 || vacancy.videos?.length > 0;

  return (
    <Card className="group py-0 flex flex-col h-full overflow-hidden border-2">
      {/* Image Header with Overlays */}
      <div className="relative w-full h-[280px] overflow-hidden bg-linear-to-br from-primary/10 to-primary/5">
        {firstPhoto ? (
          <>
            <Image
              src={firstPhoto}
              alt={vacancy.title}
              fill={true}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="size-24 text-primary/20" />
          </div>
        )}

        <Badge className="absolute top-4 left-4 h-9 flex items-center gap-2 px-4 bg-background/95 backdrop-blur-sm shadow-lg border-primary/20">
          <MapPin className="size-4 text-primary" />
          <span className="font-semibold text-primary">{vacancy.location}</span>
        </Badge>

        <Badge
          role="button"
          onClick={handleCopyVacancyId}
          className="absolute top-4 right-4 h-9 flex items-center gap-2 px-4 bg-foreground text-background font-bold cursor-pointer hover:bg-foreground/90 transition-all shadow-lg"
        >
          {copied ? (
            <CheckCircle2 className="size-4 animate-in zoom-in" />
          ) : (
            <Copy className="size-4" />
          )}
          <span>{vacancyIdWithPrefix}</span>
        </Badge>

        {hasMedia && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            {vacancy.photos?.length > 0 && (
              <Badge className="h-8 flex items-center gap-1.5 px-3 bg-background/95 backdrop-blur-sm">
                <ImageIcon className="size-3.5" />
                <span className="text-xs font-semibold">
                  {vacancy.photos.length}
                </span>
              </Badge>
            )}
            {vacancy.videos?.length > 0 && (
              <Badge className="h-8 flex items-center gap-1.5 px-3 bg-background/95 backdrop-blur-sm">
                <VideoIcon className="size-3.5" />
                <span className="text-xs font-semibold">
                  {vacancy.videos.length}
                </span>
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardHeader className="space-y-4 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold leading-tight transition-colors">
            {vacancy.title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed line-clamp-2">
            {vacancy.jobDescription}
          </CardDescription>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <Euro className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                ანაზღაურება
              </p>
              <p className="font-bold text-sm truncate">{vacancy.salary}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
            <Clock className="size-5 text-foreground shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                ხანგრძლივობა
              </p>
              <p className="font-bold text-sm truncate">{vacancy.duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg border border-border">
            <Calendar className="size-5 text-foreground shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">
                დაწყება
              </p>
              <p className="font-bold text-sm truncate">{vacancy.beginDate}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-6 mt-auto">
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
      </CardContent>
    </Card>
  );
};

export const VacanciesListingClient = ({
  vacancies,
  translations,
}: {
  vacancies: Vacancy[];
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
