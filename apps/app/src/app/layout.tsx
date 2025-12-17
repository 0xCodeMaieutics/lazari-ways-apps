import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased"}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
