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
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    PASSWORD_ENCRYPTION_KEY: z
      .string()
      .min(32)
      .describe("Hexadecimal string of 32 bytes"),
    JOSE_SECRET: z.string(),
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

    PASSWORD_ENCRYPTION_KEY: process.env.PASSWORD_ENCRYPTION_KEY,
    JOSE_SECRET: process.env.JOSE_SECRET,
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
