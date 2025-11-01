import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session) redirect("/login");
  return (
    <div className="w-full h-full mx-auto max-w-6xl px-4 md:px-0">
      {children}
    </div>
  );
}
