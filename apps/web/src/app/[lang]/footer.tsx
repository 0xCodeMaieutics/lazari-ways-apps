import Link from "next/link";
import { TextLogo } from "./text-logo";
import { APP_NAME } from "./constants";
import { Translations } from "@/i18n/translations";

export const Footer = ({ translations }: { translations: Translations }) => {
  return (
    <footer className="mt-auto border-t">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-4">
            <TextLogo>{APP_NAME}</TextLogo>
            <p>An employment agency that provides a wide range of services</p>
          </div>
          <div className="flex md:justify-end gap-4 text-slate-600">
            <Link href="#" aria-label="Instagram" className="hover:text-black">
              Instagram
            </Link>
            <Link href="#" aria-label="TikTok" className="hover:text-black">
              TikTok
            </Link>
            <Link href="#" aria-label="Facebook" className="hover:text-black">
              Facebook
            </Link>
            <Link href="#" aria-label="Telegram" className="hover:text-black">
              Telegram
            </Link>
            <Link
              href="https://wa.me/"
              target="_blank"
              aria-label="WhatsApp"
              className="hover:text-black"
            >
              WhatsApp
            </Link>
          </div>
        </div>
        <div className="mt-8 text-sm text-slate-500">© Larazi Ways 2025</div>
      </div>
    </footer>
  );
};
