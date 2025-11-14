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
import { prisma } from "../../src/db/client";

void (async function () {
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
          title: "Bäcker/in",
          jobDescription: `ვაკანსია ${vacancyName} მუშაობა სასტუმროში დასასვენებელ კომპლექსში`,
          location: "ნიუბერგის ახლოს",
          beginDate: new Date(2024, 0, 1 + index).toISOString(),
          vacancyId,
          accommodation: "სასტუმროში",
          duration: `${30 + index} დღე`,
          meals: "სამჯერადი",
          salary: `${800 + index * 10} EUR`,
          schedule: "სამუშაო დღეებში 8 საათი",
          additionalInfo: faker.lorem.paragraphs(2),
          createdAt: new Date().toISOString(),
          photos: [],
          videos: [],
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
