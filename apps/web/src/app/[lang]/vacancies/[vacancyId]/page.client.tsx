"use client";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { scrollSmoothlyToSection, SECTION_IDS } from "../../utils";
import {
  ArrowDown,
  CheckCircle2,
  Euro,
  Briefcase,
  MapPin,
  ArrowLeft,
  Sparkles,
  Clock,
  ArrowRight,
  Calendar,
  Home,
  UtensilsCrossed,
  Info,
  ImageIcon,
  VideoIcon,
  Copy,
  Star,
  Instagram,
  User,
  ListChecks,
  Languages,
  UserCheck,
} from "lucide-react";
import { Translations } from "@/i18n/translations";
import { translationsContext } from "@/lib/context/translations";
import Link from "next/link";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardHeader,
  CardFooter,
} from "@workspace/ui/components/card";
import { useParams } from "next/navigation";
import { CTASection } from "@/components/cta-section";
import { Vacancy } from "@workspace/server/db";
import { Badge } from "@workspace/ui/components/badge";
import { useState } from "react";
import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { toast } from "sonner";

export const VacancyClientPage = ({
  data,
  translations,
}: {
  data: Vacancy;
  translations: Translations;
}) => {
  const { lang } = useParams();
  const [copied, setCopied] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    type: "photo" | "video";
    url: string;
  } | null>(data.photos?.[0] ? { type: "photo", url: data.photos[0] } : null);

  const handleCopyVacancyId = async () => {
    (
      await tryCatchAsync(() =>
        navigator.clipboard.writeText(data.vacancyId.toString())
      )
    ).match({
      ok: () => {
        setCopied(true);
        toast.success(`ვაკანსიის ID ${data.vacancyId} დააკოპირეთ`);
        setTimeout(() => setCopied(false), 2000);
      },
      err: () => toast.error("მოხდა შეცდომა"),
    });
  };

  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full bg-linear-to-b from-background via-background to-secondary/20">
        {/* Hero Section with Modern Layout */}
        <section className="relative px-6 py-16 md:py-24">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Back Button */}
            <div className="py-5">
              <Button
                size={"lg"}
                asChild
                variant={"link"}
                className="flex items-center gap-2 h-12 text-xl font-semibold max-w-max mr-auto"
              >
                <Link href={`/${lang}#vacancies`}>
                  <ArrowLeft />
                  დაბრუნება
                </Link>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Title and Badges */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-md">
                      <MapPin className="size-4" />
                      {data.location}
                    </Badge>
                    {data.availableTo && (
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium shadow-md"
                      >
                        <UserCheck className="size-4" />
                        {data.availableTo}
                      </Badge>
                    )}
                    <Badge
                      role="button"
                      onClick={handleCopyVacancyId}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold cursor-pointer hover:opacity-90 transition-all shadow-md"
                    >
                      {copied ? (
                        <CheckCircle2 className="size-4 animate-in zoom-in" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      #{data.vacancyId}
                    </Badge>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                    {data.title}
                  </h1>
                </div>

                {/* Salary Card */}
                <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-primary/10 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                          <Euro className="size-5 text-primary" />
                          ანაზღაურება
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-primary">
                          {data.salary}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Begin Date */}
                  <Card className="border-2">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">
                            როდის იწყებთ
                          </p>
                          <p className="font-bold text-lg mt-1">
                            {data.beginDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Duration */}
                  <Card className="border-2">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">
                            რა ვადით
                          </p>
                          <p className="font-bold text-lg mt-1">
                            {data.duration}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Language Level */}
                  {data.languageLevel && (
                    <Card className="border-2 sm:col-span-2">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Languages className="size-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">
                              ენის დონე
                            </p>
                            <p className="font-bold text-lg mt-1">
                              {data.languageLevel}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Schedule */}
                  <Card className="border-2 sm:col-span-2">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="size-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground font-medium mb-2">
                            გრაფიკი
                          </p>
                          <div className="space-y-1">
                            {data.schedule.split("\n").map((item, idx) => (
                              <p key={idx} className="font-semibold text-base">
                                {item.trim()}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Perks */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    შეღავათები
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {data.accommodation && (
                      <Card className="border-2 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Home className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold mb-1">საცხოვრებელი</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {data.accommodation}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {data.meals && (
                      <Card className="border-2 border-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <UtensilsCrossed className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold mb-1">კვება</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {data.meals}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ListChecks className="size-5 text-primary" />
                    სამუშაოს არსი
                  </h3>
                  <div className="space-y-2">
                    {data.jobDescription.split("\n").map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <p className="text-base text-foreground">
                          {item.trim()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                {data.additionalInfo && (
                  <Card className="border-2 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                          <Info className="size-5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                            დამატებითი ინფორმაცია
                          </h3>
                          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                            {data.additionalInfo}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Button */}
                <Button
                  size="lg"
                  className="w-full sm:w-auto flex gap-2 items-center text-lg font-semibold h-14 px-8 shadow-lg hover:shadow-xl transition-all group"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollSmoothlyToSection(SECTION_IDS.contact);
                  }}
                >
                  <Sparkles className="size-5" />
                  განაცხადის გაგზავნა
                  <ArrowDown className="animate-bounce size-4 group-hover:translate-y-1 transition-transform" />
                </Button>
              </div>

              {/* Right Column - Media Gallery */}
              <div className="relative lg:sticky lg:top-8 space-y-6">
                {/* Main Media Display */}
                {selectedMedia && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary/50 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
                    <div className="relative w-full h-[400px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10 bg-black">
                      {selectedMedia.type === "photo" ? (
                        <Image
                          src={selectedMedia.url}
                          alt={data.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={selectedMedia.url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Media Thumbnails */}
                {((data.photos?.length ?? 0) > 0 ||
                  (data.videos?.length ?? 0) > 0) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ImageIcon className="size-4" />
                      <span>
                        გალერეა (
                        {(data.photos?.length ?? 0) +
                          (data.videos?.length ?? 0)}
                        )
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {data.photos?.map((photo, idx) => (
                        <button
                          key={`photo-${idx}`}
                          onClick={() =>
                            setSelectedMedia({ type: "photo", url: photo })
                          }
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                            selectedMedia?.url === photo
                              ? "border-primary ring-2 ring-primary/50"
                              : "border-border"
                          }`}
                        >
                          <Image
                            src={photo}
                            alt={`${data.title} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                        </button>
                      ))}
                      {data.videos?.map((video, idx) => (
                        <button
                          key={`video-${idx}`}
                          onClick={() =>
                            setSelectedMedia({ type: "video", url: video })
                          }
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105 bg-black flex items-center justify-center ${
                            selectedMedia?.url === video
                              ? "border-primary ring-2 ring-primary/50"
                              : "border-border"
                          }`}
                        >
                          <VideoIcon className="size-8 text-white" />
                          <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder if no media */}
                {!selectedMedia &&
                  (data.photos?.length ?? 0) === 0 &&
                  (data.videos?.length ?? 0) === 0 && (
                    <div className="w-full h-[400px] lg:h-[550px] rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 space-y-4">
                      <Briefcase className="size-24 text-primary/30" />
                      <p className="text-muted-foreground">
                        მედია არ არის ხელმისაწვდომი
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {data.reviews && data.reviews.length > 0 && (
          <section className="px-6 py-16 md:py-24 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                  <Star className="size-4" />
                  <span className="text-sm font-semibold">მიმოხილვები</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  რას ამბობენ ჩვენი კლიენტები?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="size-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {review.name}
                          </CardTitle>
                          {review.instagram && (
                            <a
                              href={`https://instagram.com/${review.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Instagram className="size-3.5" />@
                              {review.instagram}
                            </a>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <CTASection id={SECTION_IDS.contact}>
          <div className="h-full flex flex-col justify-center space-y-12">
            <div className="flex-1 flex flex-col justify-center space-y-12">
              <CardHeader className="text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary max-w-max">
                  <Clock className="size-4" />
                  <span className="text-sm font-semibold">
                    დაელოდეთ პასუხს 1 საათში
                  </span>
                </div>
                <CardTitle className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  მზად ხართ ახალი გამოწვევისთვის?
                </CardTitle>
                <CardDescription className="md:text-lg text-muted-foreground leading-relaxed">
                  გადადგით პირველი ნაბიჯი თქვენი კარიერული წინსვლისკენ
                  გერმანიაში. შეავსეთ განაცხადი და ჩვენი გუნდი დაუყოვნებლივ
                  დაგიკავშირდებათ.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="xs:text-lg font-semibold h-14 px-10 shadow-lg hover:shadow-xl transition-all group"
                  >
                    განაცხადის გაგზავნა
                    <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="xs:text-lg font-semibold h-14 px-10 border-2 hover:bg-secondary transition-all"
                    asChild
                  >
                    <Link href={`/${lang}/vacancies`}>
                      სხვა ვაკანსიები
                      <ArrowRight className="size-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
            <CardFooter className="flex flex-wrap gap-6 border-t p-6">
              {/* Trust indicators */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">100+ წარმატებული</p>
                  <p className="text-xs text-muted-foreground">განთავსება</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">სრული მხარდაჭერა</p>
                  <p className="text-xs text-muted-foreground">A-დან Z-მდე</p>
                </div>
              </div>
            </CardFooter>
          </div>
        </CTASection>
      </main>
    </translationsContext.Provider>
  );
};
