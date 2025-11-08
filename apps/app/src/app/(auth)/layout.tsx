import { auth } from "@workspace/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");

  return children;
}
