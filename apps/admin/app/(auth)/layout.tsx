import { prisma } from "@/lib/db/prisma-client";
import { verifyToken } from "@/lib/token";
import { ADMIN_SESSION_COOKIE } from "@/utils/constants";
import { UserRole } from "@/utils/models/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const LOGIN_PATH = "/login";

export default async function Layout({ children }: PropsWithChildren) {
  const c = await cookies();
  const tokenSession = c.get(ADMIN_SESSION_COOKIE);

  if (tokenSession?.value === undefined) redirect(LOGIN_PATH);

  const session = await prisma.session.findUnique({
    where: {
      token: tokenSession.value,
    },
  });
  if (!session) {
    redirect(LOGIN_PATH);
  }
  const currentDate = new Date();
  if (session.expiresAt && session.expiresAt < currentDate) {
    redirect(LOGIN_PATH);
  }

  const tokenPayload = await verifyToken(tokenSession.value);
  if (tokenPayload.payload.userRole !== UserRole.ADMIN) redirect(LOGIN_PATH);

  const user = await prisma.user.findUnique({
    where: {
      id: tokenPayload.payload.userId,
    },
  });
  if (!user) redirect(LOGIN_PATH);
  if (tokenPayload.payload.userEmail !== user?.email) redirect(LOGIN_PATH);
  if (user?.role !== UserRole.ADMIN) redirect(LOGIN_PATH);

  return (
    <div className="w-full h-full mx-auto max-w-6xl px-4 md:px-0">
      {children}
    </div>
  );
}
