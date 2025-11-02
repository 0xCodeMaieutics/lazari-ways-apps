import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./i18n";
import { getServerSideLocal } from "./i18n/translations";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getServerSideLocal(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|public|employers|.well-known|favicon.ico|manifest.json|robots.txt).*)",
  ],
};
