import { betterAuth, Session as BASession, User as BAUser } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/client";
import { toNextJsHandler } from "better-auth/next-js";

export type Session = BASession;
export type User = BAUser;

export const APP_SLUG = "lazari-ways";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  advanced: {
    cookiePrefix: APP_SLUG,
  },
});

export const authNextHandler = toNextJsHandler(auth.handler);
