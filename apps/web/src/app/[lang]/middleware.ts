import { NextResponse, type NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import { i18n } from "@/i18n";

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();

  const cookiesLang = acceptLanguage.get(
    req.cookies.get(i18n.cookieName)?.value
  );
  const lng =
    cookiesLang ??
    acceptLanguage.get(req.headers.get("Accept-Language")) ??
    i18n.defaultLocale;

  const lngInPath = i18n.locales.find((loc) =>
    req.nextUrl.pathname.startsWith(`/${loc}`)
  );
  const headers = new Headers(req.headers);
  headers.set(i18n.headerName, lngInPath || lng);

  if (!lngInPath && !req.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  const refererLang = req.headers.get("referer");
  if (refererLang) {
    const refererUrl = new URL(refererLang);
    const lngInReferer = i18n.locales.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next({ headers });
    if (lngInReferer) response.cookies.set(i18n.cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};
