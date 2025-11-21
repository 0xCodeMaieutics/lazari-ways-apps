import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata = {
  title: "ადმინისტრატორის დაფა - Lazari Ways",
  description:
    "ადმინისტრაციული პანელი განაცხადებისა და ვაკანსიების მართვისთვის",
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
