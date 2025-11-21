import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  return NextResponse.redirect(new URL("/vacancies", request.url));
};
