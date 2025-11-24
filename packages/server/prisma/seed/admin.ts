import { Prisma, PrismaClient, UserRole } from "db/client";

import { generateRandomString } from "@workspace/shared/lib/random";
import { faker } from "@faker-js/faker";
import { encrypt } from "../../src/utils/encrypt.js";
import { prisma } from "../../src/db/client.js";
import z from "zod";

export const createAdmin = (
  { email, password }: { email: string; password: string },
  tx: Prisma.TransactionClient | PrismaClient
) =>
  tx.user.create({
    data: {
      id: generateRandomString(32),
      email,
      name: "Anna Admin",
      emailVerified: faker.datatype.boolean(),
      role: UserRole.ADMIN,
      sessions: {
        create: {
          id: generateRandomString(32),
          expiresAt: new Date("2099-12-31T23:59:59.999Z"),
          token: generateRandomString(64),
        },
      },
      settings: {
        create: {
          id: generateRandomString(32),
        },
      },
      accounts: {
        create: {
          id: generateRandomString(32),
          accountId: generateRandomString(32),
          providerId: "credential",
          password,
        },
      },
    },
  });

const POSSIBLE_CONFIRMATIONS = ["y", "yes"];

const confirmWithYes = () => {
  return new Promise<void>(async (resolve) => {
    const readline = (await import("readline")).createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      "Are you sure you want to create an admin user? This action cannot be undone. Type 'yes' to confirm: ",
      (answer: string) => {
        if (POSSIBLE_CONFIRMATIONS.includes(answer.toLowerCase())) {
          resolve();
        } else {
          console.log("Action cancelled.");
          process.exit(0);
        }
        readline.close();
      }
    );
  });
};

if (import.meta.url === `file://${process.argv[1]}`) {
  void (async function () {
    /**
     * RUN: pnpm dotenv -e .env -- pnpm db:seed:admin --email=admin@lazariways.com --password=#AdminIsCool2025@!
     */

    const envZod = z.object({
      DATABASE_URL: z.string().url(),
      ENCRYPTION_KEY: z
        .string()
        .length(
          64,
          "ENCRYPTION_KEY must be 32 bytes in hex format (64 characters)"
        ),
    });
    const env = envZod.parse(process.env);
    const emailArg = process.argv.find((arg) => arg.startsWith("--email="));
    const passwordArg = process.argv.find((arg) =>
      arg.startsWith("--password=")
    );

    const email = emailArg?.split("=")[1];
    const password = passwordArg?.split("=")[1];

    console.log(JSON.stringify({ email, password }, null, 2));

    if (!email || !password) {
      throw new Error("Please provide --email and --password arguments");
    }

    console.log(
      `⚠️  You are about to create an admin user in the database: ${env.DATABASE_URL}`
    );

    await confirmWithYes();

    console.log("Creating admin user...");
    const admin = await createAdmin(
      {
        email,
        password: encrypt(password, env.ENCRYPTION_KEY),
      },
      prisma
    );
    console.log("Admin user created:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(admin);
    await prisma.$disconnect();
  })();
}
