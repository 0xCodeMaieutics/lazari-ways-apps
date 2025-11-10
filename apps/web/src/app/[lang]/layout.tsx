import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "./header";
import { Footer } from "./footer";
import { PropsWithChildren } from "react";
import { i18n, Locale } from "@/i18n";
import { getTranslations } from "@/i18n/translations";
import { Toaster } from "@workspace/ui/components/sonner";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ lang: Locale }>;
// }) {
//   const { lang } = await params;
//   const t = await getTranslations(lang);
//   return {
//     title: t.hello,
//   };
// }

export const metadata = {
  title: "Lazari Ways - საკონსულტაციო ფირმა",
  description:
    "Lazari Ways - საკონსულტაციო ფირმა არის თქვენი სანდო პარტნიორი საერთაშორისო სამუშაოს განთავსებისა და დასაქმების სერვისებისათვის.",
};

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }

const DEFAULT_LOCALE = "ka" as Locale;

export default async function RootLayout({
  children,
  params,
}: Readonly<PropsWithChildren> & { params: Promise<{ lang: string }> }) {
  const { lang = DEFAULT_LOCALE } = await params;
  const commonTranslations = await getTranslations(lang as Locale, "common");
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <Providers>
          <Header translations={commonTranslations["header"] ?? {}} />
          <main className="flex-1 w-dvw gap-6 flex items-center justify-center">
            {children}
          </main>
          <Footer translations={commonTranslations["footer"] ?? {}} />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
