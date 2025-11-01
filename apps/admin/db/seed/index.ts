import { config } from "dotenv";
config({
  path: ".env.local",
});
import { generateRandomString } from "../../lib/random";
import { $Enums, EmployerType, Prisma, PrismaClient } from "@prisma/client";
import { createAdmin } from "./admin";
import { createApplications } from "./application";
import { createUsers } from "./user";

void (async function () {
  const prisma = new PrismaClient();

  await prisma.$transaction(async (tx) => {
    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await tx.employer.deleteMany();
    await tx.userSettings.deleteMany();
    await tx.application.deleteMany();
    await tx.session.deleteMany();
    await tx.account.deleteMany();
    await tx.user.deleteMany();

    console.log("👤 Creating admin user...");
    await createAdmin(tx);

    console.log("👤 Creating users with faker data...");

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

    await tx.employer.createMany({
      data: Object.entries($Enums.EmployerType).map(([, value]) => {
        return {
          id: generateRandomString(32),
          name: EmployerType[value],
          type: value,
        } satisfies Prisma.EmployerCreateInput;
      }),
    });

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
