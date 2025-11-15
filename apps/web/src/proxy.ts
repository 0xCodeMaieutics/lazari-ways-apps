import { NextRequest, NextResponse, userAgent } from "next/server";
import { i18n } from "./i18n";
import { getServerSideLocal } from "./i18n/translations";

export type DeviceType = "desktop" | "mobile" | "tablet" | "console";

const getDeviceType = (request: NextRequest) =>
  (userAgent(request).device.type ?? "desktop") as DeviceType;

export function proxy(request: NextRequest) {
  const pathnameHasLocale = i18n.locales.some(
    (locale) =>
      request.nextUrl.pathname.startsWith(`/${locale}/`) ||
      request.nextUrl.pathname === `/${locale}`
  );
  const searchParamsHasViewport = request.nextUrl.searchParams.has("viewport");

  if (pathnameHasLocale && searchParamsHasViewport) return;
  else if (!searchParamsHasViewport) {
    request.nextUrl.searchParams.set("viewport", getDeviceType(request));
    return NextResponse.redirect(request.nextUrl);
  }

  const locale = getServerSideLocal(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${locale}${request.nextUrl.pathname}`;

  return NextResponse.redirect(request.nextUrl, {
    headers: {
      viewport: getDeviceType(request),
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next|public|images|.well-known|favicon.ico|manifest.json|robots.txt).*)",
  ],
};
