import { auth } from "@workspace/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const h = await headers();
  const forwardedSearchParams = h.get("x-forwarded-search-params");
  console.log(forwardedSearchParams);

  const params = new URLSearchParams(forwardedSearchParams || "");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) {
    console.error("SESSION_NOT_FOUND");
    return redirect(
      "/login?" +
        new URLSearchParams({
          vacancyId: params.get("vacancyId") || "",
        }).toString()
    );
  }

  return children;
}
