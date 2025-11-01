import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "./header";
import { Footer } from "./footer";
import { I18NEXT_LANGUAGES } from "@/utils/i18n/constants";
import { getTranslations } from "@/utils/i18n/server";

export async function generateStaticParams() {
  return I18NEXT_LANGUAGES.map((lng) => ({ lng }));
}

export async function generateMetadata() {
  const { t } = await getTranslations("common");
  return {
    title: t("title"),
    descption: t("description"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <Providers>
          <Header />
          <main className="flex-1 w-dvw gap-6 items-center justify-center">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
