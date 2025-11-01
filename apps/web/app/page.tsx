"use client";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { WHATSAPP_TEXT, WHATSAPP_NUMBER, WHATSAPP_URL } from "./constants";
import { ArrowDown } from "lucide-react";
import { EmployersGallery } from "@/components/employers-gallery";
import { TypeAnimation } from "react-type-animation";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import { HeroVideo } from "@/components/hero-video";
import { SectionHeader } from "@/components/section-header";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <section className="px-6 py-40 md:py-40">
        <div className="flex flex-col gap-20 md:flex-row md:items-center max-w-6xl mx-auto">
          <div className="text-center md:text-left flex-1 space-y-6">
            <div className="text-4xl md:text-6xl font-bold tracking-tight">
              Make it to Germany{" "}
              <div className="h-[42px] sm:h-[70px]">
                <TypeAnimation
                  sequence={["Fast", 2000, "Easy", 1500, "Reliable", 2000]}
                  wrapper="span"
                  speed={60}
                  // style={{ fontSize: "2em", display: "inline-block" }}
                  className="h-[70px] text-primary"
                  repeat={Infinity}
                />
              </div>
            </div>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground">
              We will help you with choosing an internship and finding a job in
              Germany and other countries.
            </p>
            <Button
              size={"lg"}
              className="flex gap-2 items-center text-xl font-semibold h-12 px-10 mx-auto max-w-max"
              onClick={(e) => {
                e.preventDefault();
                scrollSmoothlyToSection(SECTION_IDS.contact);
              }}
            >
              Contact us
              <ArrowDown className="animate-bounce size-4.5 font-semibold" />
            </Button>
          </div>
          <div className="flex-1">
            <HeroVideo />
          </div>
        </div>
      </section>

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

      <section id={SECTION_IDS.howItWork} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            onClick={() => {
              scrollSmoothlyToSection(SECTION_IDS.howItWork);
            }}
          >
            How it works
          </SectionHeader>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border p-6">
              <span className="text-sm font-medium text-slate-500">Step 1</span>
              <p className="mt-2 text-slate-700">
                Initial consultation and profile review.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <span className="text-sm font-medium text-slate-500">Step 2</span>
              <p className="mt-2 text-slate-700">
                Matching with verified employers and preparing documents.
              </p>
            </div>
            <div className="rounded-lg border p-6 ">
              <span className="text-sm font-medium text-slate-500">Step 3</span>
              <p className="mt-2 text-slate-700">
                Job placement support and relocation guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id={SECTION_IDS.advantages} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            onClick={() => {
              scrollSmoothlyToSection(SECTION_IDS.advantages);
            }}
          >
            What sets us apart?
          </SectionHeader>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border p-6 ">
              <h3 className="font-medium">Human-centered approach</h3>
              <p className="mt-2 text-slate-700">
                We focus on your goals and long-term success.
              </p>
            </div>
            <div className="rounded-lg border p-6 ">
              <h3 className="font-medium">Verified employers</h3>
              <p className="mt-2 text-slate-700">
                Work only with trusted partners across multiple countries.
              </p>
            </div>
            <div className="rounded-lg border p-6 ">
              <h3 className="font-medium">End-to-end support</h3>
              <p className="mt-2 text-slate-700">
                From application to relocation and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id={SECTION_IDS.aboutUs} className="px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            onClick={() => {
              scrollSmoothlyToSection(SECTION_IDS.aboutUs);
            }}
          >
            About Us
          </SectionHeader>
          <div className="mt-6 space-y-4 text-slate-700">
            <p>
              From a small office where two managers consulted clients, Mavista
              has grown into a large company that now employs over 75 people!
              Our main mission is to give people the opportunity to earn good
              money, see the world, and get only good impressions and memories
              from their trip.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border p-4  text-center">
                <div className="text-2xl font-bold">11+</div>
                <div className="text-sm text-slate-500">
                  Years of active work
                </div>
              </div>
              <div className="rounded-lg border p-4  text-center">
                <div className="text-2xl font-bold">1270</div>
                <div className="text-sm text-slate-500">Verified employers</div>
              </div>
              <div className="rounded-lg border p-4  text-center">
                <div className="text-2xl font-bold">8940</div>
                <div className="text-sm text-slate-500">Employed customers</div>
              </div>
              <div className="rounded-lg border p-4  text-center">
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-slate-500">
                  Countries for employment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id={SECTION_IDS.contact} className="px-6 pb-16">
        <div className="max-w-6xl mx-auto text-center border py-10 rounded-xl bg-accent text-accent-foreground">
          <h2 className="text-background text-2xl md:text-3xl font-semibold">
            Ready to start?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Reach out and we will get back to you shortly.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button asChild>
              <Link
                href={`${WHATSAPP_URL}/send/?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_TEXT}&type=phone_number&app_absent=0`}
                target="_blank"
              >
                WhatsApp
              </Link>
            </Button>
            {/* <Button asChild variant={"outline"}>
              <Link href="mailto:contact@example.com">Email us</Link>
            </Button> */}
          </div>
        </div>
      </section>
    </main>
  );
}
