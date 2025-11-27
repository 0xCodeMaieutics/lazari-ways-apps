import { auth } from "@workspace/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const h = await headers();
  const forwardedSearchParams = h.get("x-forwarded-search-params");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user)
    redirect("/login?" + forwardedSearchParams);

  return children;
}
