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
import { ContactVideo } from "@/components/contact-video";
import { VacancySection } from "./_ui/vacancies-section";
import { PropsWithChildren } from "react";
import { ContactSection } from "@/components/contact-section";

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
          <div className="flex flex-col gap-12 md:gap-20 md:flex-row md:items-center max-w-6xl mx-auto">
            <div className="text-center space-y-6 md:text-left flex-1">
              <div className="text-4xl md:text-5xl md:text-6xl font-bold tracking-tight">
                {translations["hero.title"]}{" "}
                <div className="h-[42px] md:h-[70px]">
                  <TypeAnimation
                    sequence={translations["hero.typeAnimationWords"] as any}
                    wrapper="span"
                    speed={60}
                    className="h-[70px] text-primary"
                    repeat={Infinity}
                  />
                </div>
              </div>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground font-medium">
                {translations["hero.slogan"]}
              </p>
              <Button
                size={"lg"}
                className="flex gap-2 items-center text-xl font-semibold h-12 px-10 mx-auto max-w-max"
                onClick={(e) => {
                  e.preventDefault();
                  scrollSmoothlyToSection(SECTION_IDS.contact);
                }}
              >
                {translations["hero.callToAction"]}
                <ArrowDown className="animate-bounce size-4.5 font-semibold" />
              </Button>
            </div>
            <div className="flex-1 mx-auto">
              <HeroVideo />
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section id={SECTION_IDS.gallery} className="px-6 py-16 md:py-24">
          <div className="w-full max-w-6xl mx-auto">
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

        <section id={SECTION_IDS.vacancies} className="px-6 py-16 md:py-24">
          <VacancySection />
        </section>

        <ContactSection id={SECTION_IDS.contact}>
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
        </ContactSection>
      </main>
    </translationsContext.Provider>
  );
};
