import { env } from "@/env";
import { prisma } from "@/lib/db/prisma-client";
import { generateRandomString } from "@/lib/random";
import { ADMIN_SESSION_COOKIE } from "@/utils/constants";
import { decrypt } from "@/utils/encrypt";
import { UserRole } from "@/utils/models/user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/token";

export const POST = async (request: NextRequest) => {
  const c = await cookies();
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    if (!email || !password) {
      throw new Error("Missing email or password");
    }
    const user = await prisma.user.findUnique({
      where: {
        email: String(email),
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== UserRole.ADMIN) {
      throw new Error("User is not an admin");
    }
    const account = await prisma.account.findFirst({
      where: {
        userId: user?.id,
        providerId: "credential",
      },
    });

    if (!account || !account.password) {
      throw new Error("Account not found");
    }

    const storedDecryptedPassword = decrypt(
      account.password,
      env.ENCRYPTION_KEY
    );

    if (storedDecryptedPassword !== String(password)) {
      throw new Error("Invalid credentials");
    }
    const expiresAt = new Date("2099-12-31T23:59:59.999Z");
    const signedToken = await signToken(
      {
        userEmail: user.email,
        userId: user.id,
        userRole: user.role,
      },
      expiresAt
    );

    await prisma.session.create({
      data: {
        id: generateRandomString(32),
        expiresAt,
        userId: user.id,
        token: signedToken,
      },
    });
    c.set(ADMIN_SESSION_COOKIE, signedToken);
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during admin login:", error.message);
    } else {
      console.error("Unknown error during admin login");
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
};
