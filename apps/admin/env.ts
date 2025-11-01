import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Mainly for environment variable validation - nothing more
export const env = createEnv({
  /**
   *   *---- Server/Client Environment Variable Definition ----*
   */

  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.url(),
    TELEGRAM_BOT_TOKEN: z.string().min(1),
    TELEGRAM_BOT_CHAT_ID: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    ENCRYPTION_KEY: z
      .string()
      .min(32)
      .describe("Hexadecimal string of 32 bytes"),

    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),

    JOSE_SECRET: z.string(),

    BETTER_AUTH_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {},

  /**
   *   *---- T3 Stack Config ----*
   */

  /**
   * ---- VERCEL EDGE RUNTIME SPECIFIC - WE DON'T CARE! ----
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_CHAT_ID: process.env.TELEGRAM_BOT_CHAT_ID,

    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,

    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,

    JOSE_SECRET: process.env.JOSE_SECRET,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  isServer: process.env.NODE_ENV === "test" || typeof window === "undefined",
});
