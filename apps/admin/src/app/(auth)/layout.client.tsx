"use client";
import { Button } from "@workspace/ui/components/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const LogoAndText = () => {
  return (
    <Link href={"/"}>
      <div className="relative h-12 w-[190px]">
        <Image
          src={"/images/logos/logo-text.svg"}
          alt="Lazary Ways image Logo"
          fill
        />
      </div>
    </Link>
  );
};

export const Header = () => {
  const pathname = usePathname();
  console.log(pathname);

  const logoRef = React.useRef<HTMLDivElement>(null);
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full pt-4 pb-2 md:py-6 px-4 bg-background border-b transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="relative" ref={logoRef}>
          <LogoAndText />
          <span className="absolute -bottom-0.5 left-13.5 font-semibold text-muted-foreground text-xs">
            Für Administratoren
          </span>
        </div>
        <nav className="flex-1 flex justify-center gap-3">
          <Button
            className={clsx(
              "flex items-center gap-2 relative font-normal group hover:no-underline text-lg px-0.5 cursor-pointer max-w-max",
              {
                "font-semibold": pathname === "/vacancies",
              }
            )}
            variant={"link"}
            asChild
          >
            <Link href={"/vacancies"}>Stellenanzeigen</Link>
          </Button>
          <Button
            className={clsx(
              "flex items-center gap-2 relative font-normal group hover:no-underline text-lg px-0.5 cursor-pointer max-w-max",
              {
                "font-semibold": pathname.includes("/applications"),
              }
            )}
            variant={"link"}
            asChild
          >
            <Link href="/applications">Bewerbungen</Link>
          </Button>
        </nav>
        <div
          style={{
            width: logoRef.current?.clientWidth,
          }}
          className="text-white"
        >
          placeholder
        </div>
      </div>
    </header>
  );
};
