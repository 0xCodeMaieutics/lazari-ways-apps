import { headers } from "next/headers";
import { OnboardingPageClient } from "./page.client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.session || !session.user) redirect("/login");
  return <OnboardingPageClient data={session} />;
}
