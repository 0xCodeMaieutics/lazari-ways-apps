import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Header } from "./header";
import { Footer } from "./footer";

export const metadata = {
  title: "Lazari Ways - Jobs and Internships in Germany",
  description:
    "We help you find internships and jobs in Germany and other countries.",
};

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
