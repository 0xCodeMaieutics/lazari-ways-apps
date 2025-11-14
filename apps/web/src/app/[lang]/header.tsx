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
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "./constants";
import { useEffect, useState } from "react";
import { Translations } from "@/i18n/translations";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Locale } from "@/i18n";
import { sleep } from "@/utils/sleep";
import clsx from "clsx";

const WhatsappLink = () => (
  <a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="flex size-8 md:size-7 justify-center items-center bg-emerald-500 p-2 rounded-full animate-bounce"
  >
    <PhoneIcon className="text-white size-6 md:size-3" />
  </a>
);

export const useIsHeaderVisible = () => {
  const [pagePosition, setPagePosition] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.pageYOffset;

      setIsHeaderVisible(pagePosition > moving);
      setPagePosition(moving);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return { isHeaderVisible, pagePosition };
};

export const Header = ({ translations }: { translations: Translations }) => {
  const { lang } = useParams();
  const router = useRouter();
  const _path = usePathname();
  const [open, setOpen] = useState(false);

  const extractLangFromParams = () => _path.replace(`${lang}`, "");

  const path = extractLangFromParams();

  const onHomeSectionClicked = (sectionId: string) => {
    if (path === "/") {
      sleep(300).then(() => {
        scrollSmoothlyToSection(sectionId);
      });
    } else {
      router.push(`/${lang}/#${sectionId}`);
    }
  };

  const { isHeaderVisible, pagePosition } = useIsHeaderVisible();

  return (
    <header
      className={clsx(
        `fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full pt-4 pb-2 md:py-6 px-4 bg-background border-b transition-transform duration-300 ease-in-out`,
        {
          "-translate-y-24": !isHeaderVisible && pagePosition > 0,
          "bg-background": isHeaderVisible && pagePosition > 0,
          "translate-y-0": isHeaderVisible,
        }
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <LogoAndText lang={lang as Locale} />
        <nav className="hidden md:flex items-center gap-4">
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
        <div className="hidden md:block">
          <Button
            variant={"link"}
            className="cursor-pointer font-semibold text-lg underline"
          >
            {WHATSAPP_NUMBER}
            <WhatsappLink />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <div className="md:hidden flex items-center gap-4">
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
                onClick={() => {
                  setOpen(false);
                  onHomeSectionClicked(SECTION_IDS.services);
                }}
              >
                სერვისები
                <Underline />
              </Button>
              <Button
                className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                variant={"link"}
                onClick={() => {
                  setOpen(false);
                  onHomeSectionClicked(SECTION_IDS.contact);
                }}
              >
                კონტაქტი
                <Underline />
              </Button>
              <Button
                className="relative font-semibold group hover:no-underline text-lg px-0.5 cursor-pointer"
                variant={"link"}
                asChild
              >
                <Link
                  href={`/${lang}/vacancies`}
                  onNavigate={() => {
                    setOpen(false);
                  }}
                >
                  ვაკანსიები
                  <Underline />
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
