import Link from "next/link";
import { Locale } from "@/i18n";
import Image from "next/image";
import { PropsWithChildren } from "react";

export const Underline = () => (
  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out" />
);
export const LogoText = ({ children }: PropsWithChildren) => {
  return (
    <button className="relative group text-primary text-2xl sm:text-3xl font-bold max-w-max cursor-pointer pb-2">
      {children}
      <Underline />
    </button>
  );
};

export const LogoAndText = ({ lang }: { lang: Locale }) => {
  return (
    <Link href={`/${lang}`}>
      <Image
        src={"/images/logos/logo-text.svg"}
        alt="Lazary Ways image Logo"
        quality={100}
        width={254}
        height={60}
      />
    </Link>
  );
};
