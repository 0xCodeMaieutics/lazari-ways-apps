import "dotenv/config";
import { generateRandomString, zodParse } from "@workspace/shared";
import { createAdmin } from "./admin";
import { createApplications } from "./application";
import { createUsers } from "./user";
import z from "zod";
import { auth } from "../../src/auth";
import { Prisma, $Enums, PrismaClient } from "db/client";
import {
  getSignedUrlForDownload,
  uploadFileToStorage,
} from "../../src/s3/s3-client";
import path from "path";
import { faker } from "@faker-js/faker";

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

    const BASE_VACANCY_ID = 375;
    const VACANCY_ID_PREFIX = "LZRY-";
    const s3Env = zodParse(
      process.env,
      z.object({
        S3_BUCKET_NAME: z.string(),
      })
    );

    if (s3Env.isErr()) process.exit(1);

    const fileKey = "vacancies/hotels.webp";
    const uploadResult = await uploadFileToStorage({
      bucket: s3Env.value.S3_BUCKET_NAME,
      fileKey: fileKey,
      filePath: path.resolve(__dirname, "hotels.webp"),
      ACL: "public-read",
    });

    if (uploadResult.isErr()) process.exit(1);

    const signedUrl = await getSignedUrlForDownload({
      bucket: s3Env.value.S3_BUCKET_NAME,
      fileKey,
      expiresInSeconds: 100 * 60 * 60, // 100 hours
    });

    if (signedUrl.isErr()) process.exit(1);

    await tx.vacancy.createMany({
      data: Array.from({ length: 20 }).map((_, index) => {
        const vacancyId = BASE_VACANCY_ID + index;
        const vacancyName = `${VACANCY_ID_PREFIX}${vacancyId}`;
        return {
          id: generateRandomString(32),
          description: `ვაკანსია ${vacancyName} მუშაობა სასტუმროში დასასვენებელ კომპლექსში`,
          title: faker.person.jobTitle(),
          location: "ნიუბერგის ახლოს",
          employmentType:
            $Enums.EmploymentType[
              Object.keys($Enums.EmploymentType)[
                index % Object.keys($Enums.EmploymentType).length
              ] as keyof typeof $Enums.EmploymentType
            ],
          priceMax: 50000 + index * 1000,
          priceMin: 30000 + index * 1000,
          startDate: new Date(2024, 0, 1 + index),
          vacancyId,
          vacancyName,
          benefits: Array.from({ length: 3 }).map(
            (_, benefitIndex) => `Benefit ${benefitIndex + 1}`
          ),
          requirements: Array.from({ length: 5 }).map(
            (_, reqIndex) => `Requirement ${reqIndex + 1}`
          ),
          imageUrl: signedUrl.value,
        } satisfies Prisma.VacancyCreateManyInput;
      }),
    });

    console.log("✅ Seed completed successfully!");
    console.log(
      `Created 1 admin user and ${applicationIds.length} applications with realistic faker data`
    );
  });

  await prisma.$disconnect();
})();
