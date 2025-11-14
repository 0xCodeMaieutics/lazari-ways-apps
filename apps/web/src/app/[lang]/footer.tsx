import Link from "next/link";
import { LogoAndText } from "./text-logo";
import { Translations } from "@/i18n/translations";
import { Locale } from "@/i18n";

export const Footer = ({ translations, lang }: { translations: Translations, lang: Locale }) => {
  return (
    <footer className="mt-auto border-t">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col gap-4">
            <LogoAndText lang={lang} />
            <p className="md:max-w-lg">
              დასაქმების სააგენტო, რომელიც გთავაზობთ მომსახურების ფართო სპექტრს
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:justify-end gap-4 text-slate-600">
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
