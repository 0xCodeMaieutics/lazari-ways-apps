"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowDown, ExternalLink } from "lucide-react";
import { EmployersGallery } from "@/components/employers-gallery";
import { TypeAnimation } from "react-type-animation";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import { HeroVideo } from "@/components/hero-video";
import { SectionHeader } from "@/components/section-header";

import { ServicesSection } from "./_ui/services-section";
import { translationsContext } from "@/lib/context/translations";
import { VacancySection } from "./_ui/vacancies-section";
import { CTASection } from "@/components/cta-section";

export const HomeClient = ({
  translations,
}: {
  translations: Record<string, string>;
}) => {
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
                className="flex items-center gap-2 text-lg sm:text-xl font-semibold h-12 px-12 mx-auto md:mx-0"
                onClick={(e) => {
                  e.preventDefault();
                  scrollSmoothlyToSection(SECTION_IDS.vacancies);
                }}
              >
                ვაკანსიების ნახვა
                <ArrowDown className="animate-bounce size-4.5 font-semibold" />
              </Button>
            </div>
            <div className="flex justify-end px-10 sm:px-0 mx-auto">
              <HeroVideo />
            </div>
          </div>
        </section>

        {/* Gallery */}
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

        <section id={SECTION_IDS.vacancies} className="px-6 py-16 md:py-24">
          <VacancySection />
        </section>

        <section id={SECTION_IDS.services} className="px-6 py-16 md:py-24">
          <ServicesSection />
        </section>

        <CTASection id={SECTION_IDS.contact}>
          {/**
           * TODO: look at vacancies detail page and copy some of the badges and information because this cta section looks too empty
           * */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-bold">
                მზად ხართ დასაწყებად?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                გადადგით პირველი ნაბიჯი თქვენი კარიერული გზისკენ. განაცხადი
                შეავსეთ ახლავე და ჩვენი გუნდი მალე დაგიკავშირდებათ.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8 md:pb-12">
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
        </CTASection>
      </main>
    </translationsContext.Provider>
  );
};
