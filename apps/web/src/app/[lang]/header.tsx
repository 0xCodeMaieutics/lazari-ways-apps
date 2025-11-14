"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Menu, PhoneIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { TextLogo, Underline } from "./text-logo";
import { scrollSmoothlyToSection, SECTION_IDS } from "./utils";
import {
  APP_NAME,
  WHATSAPP_NUMBER,
  WHATSAPP_TEXT,
  WHATSAPP_URL,
} from "./constants";
import { useState } from "react";
import { sleep } from "@/utils/sleep";
import { Translations } from "@/i18n/translations";

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
  const [open, setOpen] = useState(false);
  const NAV_LINKS = [
    {
      href: SECTION_IDS.services,
      label: "სერვისები",
    },
    {
      href: SECTION_IDS.contact,
      label: "კონტაქტი",
    },
    {
      href: SECTION_IDS.vacancies,
      label: "ვაკანსიები",
    },
  ];

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full pt-6 pb-2 sm:py-6 px-4 bg-background border-b">
      <div className="flex justify-between max-w-7xl mx-auto">
        <TextLogo>{APP_NAME}</TextLogo>
        <nav className="hidden sm:flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Button
              className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
              variant={"link"}
              key={link.href}
              onClick={() => {
                scrollSmoothlyToSection(link.href);
              }}
            >
              {link.label}
              <Underline />
            </Button>
          ))}
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
          <SheetContent className="w-full py-10">
            <SheetHeader>
              <SheetTitle>
                <TextLogo>{APP_NAME}</TextLogo>
              </SheetTitle>
              <SheetDescription className="max-w-xs">
                სამუშაოს მაძიებლების დაკავშირება გერმანიასთან
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col items-center gap-y-3 mt-6">
              {NAV_LINKS.map((link) => (
                <Button
                  className="w-full max-w-max relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                  variant={"link"}
                  key={link.href}
                  onClick={() => {
                    setOpen(false);
                    sleep(300).then(() => {
                      scrollSmoothlyToSection(link.href);
                    });
                  }}
                >
                  {link.label}
                  <Underline />
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
