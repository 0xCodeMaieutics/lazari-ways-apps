"use client";
import { Button } from "@workspace/ui/components/button";
import { ArrowDown, ExternalLink } from "lucide-react";
import { EmployersGallery } from "@/components/employers-gallery";
import { TypeAnimation } from "react-type-animation";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import { HeroVideo } from "@/components/hero-video";
import { SectionHeader } from "@/components/section-header";

import { ServicesSection } from "./_ui/services-section";
import { translationsContext } from "@/lib/context/translations";

export const HomeClient = ({
  translations,
}: {
  translations: Record<string, string>;
}) => {
  return (
    <translationsContext.Provider value={{ translations }}>
      <main className="min-h-screen w-full flex flex-col">
        {/* Hero Section */}
        <section className="px-6 py-40 md:py-40">
          <div className="flex flex-col gap-20 md:flex-row md:items-center max-w-6xl mx-auto">
            <div className="text-center md:text-left flex-1 space-y-6">
              <div className="text-4xl md:text-6xl font-bold tracking-tight">
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
              <p className="mt-6 text-lg md:text-xl text-muted-foreground">
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
            <div className="flex-1">
              <HeroVideo />
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section
          id={SECTION_IDS.gallery}
          className="w-full space-y-6 max-w-6xl mx-auto px-6"
        >
          <SectionHeader
            onClick={() => {
              scrollSmoothlyToSection(SECTION_IDS.gallery);
            }}
          >
            Happy Employers
          </SectionHeader>
          <EmployersGallery />
        </section>

        <ServicesSection />

        <section id={SECTION_IDS.contact} className="px-6 py-10 md:py-16">
          <div className="max-w-6xl mx-auto text-center space-y-6 p-8 md:p-12 rounded-2xl border bg-card shadow-lg bg-muted/30">
            <h2 className="text-3xl md:text-4xl font-bold">
              მზად ხართ დასაწყებად?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              გადადგით პირველი ნაბიჯი თქვენი კარიერული გზისკენ. განაცხადი
              შეავსეთ ახლავე და ჩვენი გუნდი მალე დაგიკავშირდებათ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg font-semibold h-12 px-10">
                <a
                  target="_blank"
                  // FIXME: change the link to the actual application form
                  href={"http://app.localhost:3000"}
                  rel="noreferrer"
                >
                  განაცხადის გაგზავნა
                </a>
                <ExternalLink />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </translationsContext.Provider>
  );
};
