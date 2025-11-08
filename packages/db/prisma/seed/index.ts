import "dotenv/config";
import { generateRandomString } from "../../src/lib/random";
import { createAdmin } from "./admin";
import { createApplications } from "./application";
import { createUsers } from "./user";
import z from "zod";
import { auth } from "../../src/auth";
import { prisma } from "../../src/client";
import { Prisma, $Enums } from "../../src/generated/client";

void (async function () {
  console.log("🗑️  Clearing existing data...");
  z.array(
    z.object({
      table_name: z.string(),
    })
  )
    .parse(
      await prisma.$queryRaw`SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  `
    )
    .filter(
      (tableNames) => !["_prisma_migrations"].includes(tableNames.table_name)
    )
    .map(async (tableInfo) => {
      console.log(`Truncating table: ${tableInfo.table_name}`);
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${tableInfo.table_name}" RESTART IDENTITY CASCADE;`
      );
    });
  console.log("✅ Existing data cleared!");

  console.log("👤 Creating applicant user...");
  await auth.api.signUpEmail({
    body: {
      email: "applicant@lazaryways.eu",

      name: "Anna Malazonia",
      password: "#ApplicantIsCool2025!",
    },
  });

  await prisma.$transaction(async (tx) => {
    console.log("👤 Creating admin and applicant user...");
    await createAdmin(tx);
    console.log("👤 Creating users data...");

    const userCount = 100;

    const userIds = Array.from({ length: userCount }).map(() =>
      generateRandomString(32)
    );

    await createUsers({
      tx,
      userIds,
    });

    console.log("📝 Creating applications with faker data...");
    const applicationIds = Array.from({ length: userCount }).map(() =>
      generateRandomString(32)
    );

    await createApplications({
      applicationIds,
      userIds,
      tx,
    });

    console.log("✅ Seed completed successfully!");
    console.log(
      `Created 1 admin user and ${applicationIds.length} applications with realistic faker data`
    );
  });

  await prisma.$disconnect();
})();
