"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PropsWithChildren } from "react";

export function Providers({
  children,
  // locale,
  // messages,
}: PropsWithChildren) {
  // }: PropsWithChildren<{ locale: string; messages: Record<string, unknown> }>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      // enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
