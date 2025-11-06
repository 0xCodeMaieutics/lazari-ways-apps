import { NextRequest, NextResponse } from "next/server";

export const GET = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/vacancies/student", request.url));
};
