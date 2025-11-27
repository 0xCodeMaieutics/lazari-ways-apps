import { NextResponse } from "next/server";

export const middleware = async (request: Request) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  return NextResponse.next({
    headers: {
      "x-forwarded-search-params": searchParams.toString(),
    },
  });
};

export const matcher = ["/((?!api|_next/static|_next/image|favicon.ico).*)"];
