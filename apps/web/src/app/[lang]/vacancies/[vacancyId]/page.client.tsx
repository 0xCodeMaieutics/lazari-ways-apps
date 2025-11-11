"use client";
import Image from "next/image";
import { Button } from "@workspace/ui/components/button";
import { scrollSmoothlyToSection, SECTION_IDS } from "../../utils";
import {
  ArrowDown,
  CheckCircle2,
  Euro,
  Briefcase,
  TrendingUp,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
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
import { EmploymentTypeKey, GetVacancyById } from "@workspace/server/db";

const employmentTypeLabels = {
  FULL_TIME: "სრული განაკვეთი",
  PART_TIME: "ნახევარი განაკვეთი",
  INTERN: "სტაჟირება",
  VOLUNTEER: "სტაჟირება",
} satisfies Record<EmploymentTypeKey, string>;

export const VacanciesClientPage = ({
  data,
  translations,
}: {
  data: GetVacancyById;
  translations: Translations;
}) => {
  const { lang } = useParams();
  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full bg-gradient-to-b from-background via-background to-secondary/20">
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
                {/* Title and Employment Badge */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-md">
                      <Briefcase className="size-4" />
                      {
                        employmentTypeLabels[
                          data?.employmentType as EmploymentTypeKey
                        ]
                      }
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                      <MapPin className="size-4" />
                      გერმანია
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {data?.title}
                  </h1>
                </div>

                {/* Salary Range Card */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">
                          საათობრივი ანაზღაურება
                        </p>
                        <div className="flex items-baseline gap-2">
                          <Euro className="size-5 text-primary" />
                          <span className="text-3xl md:text-4xl font-bold text-primary">
                            {data?.priceMin.toFixed(2)}
                          </span>
                          <span className="text-2xl text-muted-foreground">
                            -
                          </span>
                          <span className="text-3xl md:text-4xl font-bold text-primary">
                            {data?.priceMax.toFixed(2)}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            /საათში
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary/20">
                        <TrendingUp className="size-8 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {data?.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex gap-2 items-center text-lg font-semibold h-14 px-8 shadow-lg hover:shadow-xl transition-all group"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollSmoothlyToSection(SECTION_IDS.requirements);
                    }}
                  >
                    <Sparkles className="size-5" />
                    დეტალების ნახვა
                    <ArrowDown className="animate-bounce size-4 group-hover:translate-y-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="relative lg:sticky lg:top-8">
                {data?.imageUrl ? (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
                    <div className="relative w-full h-[400px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl border-2 border-primary/10">
                      <Image
                        src={data.imageUrl}
                        alt={data.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-[400px] lg:h-[550px] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20">
                    <Briefcase className="size-24 text-primary/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section with Modern Cards */}
        <section id={SECTION_IDS.requirements} className="px-6 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="size-4" />
                <span className="text-sm font-semibold">მოთხოვნები</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                რა გჭირდებათ ამ პოზიციისთვის?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {data?.requirements.map((req, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        <CheckCircle2 className="size-5 text-primary" />
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed pt-1.5">
                        {req}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section with Icon Cards */}
        <section className="px-6 py-16 md:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Award className="size-4" />
                <span className="text-sm font-semibold">სარგებელი</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">რას გთავაზობთ?</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                თანამშრომლობის მთელი პერიოდის განმავლობაში მიიღებთ ყოველმხრივ
                მხარდაჭერას
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="size-6 text-primary-foreground" />
                      </div>
                      <p className="text-base md:text-lg text-foreground leading-relaxed pt-2 font-medium">
                        {benefit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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
                    onClick={(e) => {
                      e.preventDefault();
                      // TODO: Add application form link
                    }}
                  >
                    განაცხადის გაგზავნა
                    <ExternalLink className="size-5 animate-bounce" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="xs:text-lg font-semibold h-14 px-10 border-2 hover:bg-secondary transition-all"
                    asChild
                  >
                    <Link href={`/${lang}#vacancies`}>
                      სხვა ვაკანსიები
                      <ArrowRight className="animate-bounce-left" />
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
                  <Award className="size-5 text-primary" />
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
