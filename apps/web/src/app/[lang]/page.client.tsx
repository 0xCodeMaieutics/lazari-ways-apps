"use client";
import { Button } from "@workspace/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { EmployersGallery } from "@/components/employers-gallery";
import { TypeAnimation } from "react-type-animation";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import { HeroVideo } from "@/components/hero-video";
import { SectionHeader } from "@/components/section-header";

import { ServicesSection } from "./_ui/services-section";
import { translationsContext } from "@/lib/context/translations";
import { CTASection } from "@/components/cta-section";
import { useParams } from "next/navigation";
import Link from "next/link";

export const HomeClient = ({
  translations,
}: {
  translations: Record<string, string>;
}) => {
  const { lang } = useParams();
  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full flex flex-col">
        {/* Hero Section */}
        <section className="px-6 pt-40 pb-8">
          <div className="flex flex-col gap-12 md:gap-20 md:flex-row md:items-center max-w-7xl mx-auto">
            <div className="flex-1 space-y-6">
              <div className="max-w-2xl text-center md:text-left text-4xl md:text-5xl md:text-6xl font-bold tracking-tight">
                {translations["hero.title"]}{" "}
                <TypeAnimation
                  sequence={translations["hero.typeAnimationWords"] as any}
                  wrapper="span"
                  speed={60}
                  className="h-[70px] text-primary"
                  repeat={Infinity}
                />
                <p className="mt-6 text-lg md:text-xl text-muted-foreground font-medium sm:max-w-lg">
                  {translations["hero.slogan"]}
                </p>
              </div>

              <Button
                size={"lg"}
                className="flex items-center gap-2 text-lg sm:text-xl font-semibold h-12 px-12 mx-auto md:mx-0 max-w-max"
                asChild
              >
                <Link href={`/${lang}/vacancies`}>
                  ვაკანსიების ნახვა
                  <ArrowRight className="animate-bounce-right size-4.5 font-semibold" />
                </Link>
              </Button>
            </div>
            <div className="flex justify-end px-10 sm:px-0 mx-auto">
              <HeroVideo />
            </div>
          </div>
        </section>

        <section id={SECTION_IDS.gallery} className="px-6 py-16 md:py-24">
          <div className="w-full max-w-7xl mx-auto">
            <SectionHeader
              onClick={() => {
                scrollSmoothlyToSection(SECTION_IDS.gallery);
              }}
              className="max-w-xs md:max-w-sm"
            >
              ჩვენი კლიენტების ფოტოები
            </SectionHeader>
            <EmployersGallery />
          </div>
        </section>

        <section id={SECTION_IDS.services} className="px-6 py-16 md:py-24">
          <ServicesSection />
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
                <CardTitle className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight sm:max-w-sm">
                  მზად ხართ დასაწყებად?
                </CardTitle>
                <CardDescription className="md:text-lg text-muted-foreground leading-relaxed">
                  გადადგით პირველი ნაბიჯი თქვენი კარიერული გზისკენ. განაცხადი
                  შეავსეთ ახლავე და ჩვენი გუნდი მალე დაგიკავშირდებათ.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="text-lg font-semibold h-12 w-full mx-auto max-w-xs"
                  asChild
                >
                  <a
                    target="_blank"
                    // FIXME: change the link to the actual application form
                    href={"http://app.localhost:3000"}
                    rel="noreferrer"
                  >
                    განაცხადის გაგზავნა
                    <ExternalLink className="animate-bounce" />
                  </a>
                </Button>
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
