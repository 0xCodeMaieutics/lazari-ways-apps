import { Prisma, PrismaClient, UserRole } from "db/client";

import { generateRandomString } from "@workspace/shared/lib/random";
import { faker } from "@faker-js/faker";
import { encrypt } from "../../src/utils/encrypt.js";
import { prisma } from "../../src/db/client.js";

const email = "admin-test@lazaryways.eu";
const password = "#AdminIsCool2025@!";

export const createAdmin = (tx: Prisma.TransactionClient | PrismaClient) =>
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
      userSettings: {
        create: {
          id: generateRandomString(32),
        },
      },
      accounts: {
        create: {
          id: generateRandomString(32),
          accountId: generateRandomString(32),
          providerId: "credential",
          password: encrypt(password, process.env.ENCRYPTION_KEY!),
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
    const emailArg = process.argv.find((arg) => arg.startsWith("--email="));
    const passwordArg = process.argv.find((arg) =>
      arg.startsWith("--password=")
    );

    const email = emailArg?.split("=")[1];
    const password = passwordArg?.split("=")[1];

    if (!email || !password) {
      throw new Error("Please provide --email and --password arguments");
    }

    const dbURL = process.env.DATABASE_URL || "";

    console.log(
      `⚠️  You are about to create an admin user in the database: ${dbURL}`
    );

    await confirmWithYes();

    console.log("Creating admin user...");
    const admin = await createAdmin(prisma);
    console.log("Admin user created:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(admin);
    await prisma.$disconnect();
  })();
}
