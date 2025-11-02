import {
  I18NEXT_COOKIE_NAME,
  I18NEXT_FALLBACK_LANGUAGE,
  I18NEXT_HEADER_NAME,
  I18NEXT_LANGUAGES,
} from "@/utils/i18n/constants";
import { NextResponse, type NextRequest } from "next/server";
import acceptLanguage from "accept-language";

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();

  const cookiesLang = acceptLanguage.get(
    req.cookies.get(I18NEXT_COOKIE_NAME)?.value
  );
  const lng =
    cookiesLang ??
    acceptLanguage.get(req.headers.get("Accept-Language")) ??
    I18NEXT_FALLBACK_LANGUAGE;

  const lngInPath = I18NEXT_LANGUAGES.find((loc) =>
    req.nextUrl.pathname.startsWith(`/${loc}`)
  );
  const headers = new Headers(req.headers);
  headers.set(I18NEXT_HEADER_NAME, lngInPath || lng);

  if (!lngInPath && !req.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    );
  }

  const refererLang = req.headers.get("referer");
  if (refererLang) {
    const refererUrl = new URL(refererLang);
    const lngInReferer = I18NEXT_LANGUAGES.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next({ headers });
    if (lngInReferer) response.cookies.set(I18NEXT_COOKIE_NAME, lngInReferer);
    return response;
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)",
  ],
};
