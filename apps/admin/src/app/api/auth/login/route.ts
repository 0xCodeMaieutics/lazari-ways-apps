import { env } from "@/env";
import { generateRandomString } from "@workspace/shared";
import { ADMIN_SESSION_COOKIE } from "@/utils/constants";
import { decrypt } from "@/utils/encrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/token";
import {
  accountQueries,
  sessionQueries,
  userQueries,
} from "@workspace/server/db";
import { UserRole } from "@workspace/server/db/models";

export const POST = async (request: NextRequest) => {
  const c = await cookies();
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    if (!email || !password) {
      throw new Error("Missing email or password");
    }
    const userResult = await userQueries.getUserByEmail(String(email));
    if (userResult.isErr()) {
      throw new Error("User not found");
    }

    const user = userResult.value;

    if (user?.role !== UserRole.ADMIN) {
      throw new Error("User is not an admin");
    }
    const accountResult = await accountQueries.getAccountById(user.id);

    if (accountResult.isErr()) {
      throw new Error("Account not found");
    }
    const account = accountResult.value;

    if (!account?.password) {
      throw new Error("Account password is null");
    }

    const storedDecryptedPassword = decrypt(
      account.password,
      env.PASSWORD_ENCRYPTION_KEY
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

    await sessionQueries.createSession({
      id: generateRandomString(32),
      expiresAt,
      user: {
        connect: { id: user.id },
      },
      token: signedToken,
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
