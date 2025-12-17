import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administrator-Dashboard - Lazari Ways",
  description:
    "Verwaltungspanel zur Verwaltung von Bewerbungen und Stellenanzeigen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
