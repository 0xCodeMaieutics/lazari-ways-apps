"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { ExternalLink, Menu, PhoneIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { LogoAndText, Underline } from "./text-logo";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import { WHATSAPP_NUMBER, WHATSAPP_TEXT, WHATSAPP_URL } from "./constants";
import { useState } from "react";
import { Translations } from "@/i18n/translations";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n";

const WhatsappLink = () => (
  <a
    href={`${WHATSAPP_URL}/send/?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_TEXT}&type=phone_number&app_absent=0`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex size-8 sm:size-7 justify-center items-center bg-emerald-500 p-2 rounded-full animate-bounce"
  >
    <PhoneIcon className="text-white size-6 sm:size-3" />
  </a>
);

export const Header = ({ translations }: { translations: Translations }) => {
  const { lang } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full pt-4 pb-2 sm:py-6 px-4 bg-background border-b">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <LogoAndText lang={lang as Locale} />
        <nav className="hidden sm:flex items-center gap-4">
          <Button
            className="flex items-center gap-2 relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer max-w-max"
            variant={"link"}
            asChild
          >
            <Link href={`/${lang}/vacancies`}>
              ვაკანსიები
              <Underline />
              <ExternalLink />
            </Link>
          </Button>
          <Button
            className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
            variant={"link"}
            onClick={() => scrollSmoothlyToSection(SECTION_IDS.services)}
          >
            სერვისები
            <Underline />
          </Button>
          <Button
            className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
            variant={"link"}
            onClick={() => scrollSmoothlyToSection(SECTION_IDS.contact)}
          >
            კონტაქტი
            <Underline />
          </Button>
        </nav>
        <div className="hidden sm:block">
          <Button
            variant={"link"}
            className="cursor-pointer font-semibold text-lg underline"
          >
            {WHATSAPP_NUMBER}
            <WhatsappLink />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <div className="sm:hidden flex items-center gap-4">
            <WhatsappLink />
            <SheetTrigger asChild>
              <button>
                <Menu size={24} />
              </button>
            </SheetTrigger>
          </div>
          <SheetContent className="w-full py-8">
            <SheetHeader className="space-y-2">
              <SheetTitle>
                <LogoAndText lang={lang as Locale} />
              </SheetTitle>
              <SheetDescription className="max-w-xs">
                სამუშაოს მაძიებლების დაკავშირება გერმანიასთან
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col items-center gap-y-3 mt-6">
              <Button
                className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                variant={"link"}
                onClick={() => scrollSmoothlyToSection(SECTION_IDS.services)}
              >
                სერვისები
                <Underline />
              </Button>
              <Button
                className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                variant={"link"}
                onClick={() => scrollSmoothlyToSection(SECTION_IDS.contact)}
              >
                კონტაქტი
                <Underline />
              </Button>
              <Button
                className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                variant={"link"}
                asChild
              >
                <Link href={`/${lang}/vacancies`}>
                  ვაკანსიები
                  <Underline />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
