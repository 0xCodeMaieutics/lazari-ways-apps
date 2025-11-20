import "dotenv/config";
import { generateRandomString, zodParse } from "@workspace/shared";
import { createAdmin } from "./admin.js";
import { createApplications } from "./application.js";
import { createUsers } from "./user.js";
import z from "zod";
import { auth } from "../../src/auth/auth.js";
import { Prisma } from "db/client.js";
import {
  getSignedUrlForDownload,
  uploadFileToStorage,
} from "../../src/s3/s3-client.js";
import path from "path";
import { prisma } from "../../src/db/client.js";

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
    const s3Env = zodParse(
      process.env,
      z.object({
        S3_BUCKET_NAME: z.string(),
      })
    );

    if (s3Env.isErr()) {
      console.error(
        "❌ Missing S3_BUCKET_NAME environment variable for seeding vacancies"
      );

      process.exit(1);
    }

    const fileKey = "vacancies/hotels.webp";
    const uploadResult = await uploadFileToStorage({
      bucket: s3Env.value.S3_BUCKET_NAME,
      fileKey: fileKey,
      filePath: path.resolve(import.meta.dirname, "hotels.webp"),
      ACL: "public-read",
    });

    if (uploadResult.isErr()) {
      console.error(
        "❌ Failed to upload file to S3 storage for seeding vacancies",
        uploadResult.error
      );
      process.exit(1);
    }

    const signedUrl = await getSignedUrlForDownload({
      bucket: s3Env.value.S3_BUCKET_NAME,
      fileKey,
      expiresInSeconds: 100 * 60 * 60, // 100 hours
    });

    if (signedUrl.isErr()) {
      console.error(
        "❌ Failed to get signed URL from S3 storage for seeding vacancies"
      );
      process.exit(1);
    }

    await tx.vacancy.createMany({
      data: Array.from({ length: 100 }).map((_, index) => {
        const vacancyId = BASE_VACANCY_ID + index;
        return {
          id: generateRandomString(32),
          vacancyId,
          title: "Bäcker/in",
          jobDescription: `ვაკანსია მუშაობა სასტუმროში დასასვენებელ კომპლექსში`,
          location: "ნიუბერგის ახლოს",
          beginDate: "2024-09-01",
          accommodation: "სასტუმროში",
          duration: `${30 + index} დღე`,
          meals: "სამჯერადი",
          salary: `${800 + index * 10} EUR`,
          languageLevel: "ინგლისური ან რუსული ენის მინიმალური დონე",
          hide: false,
          availableTo:
            index % 2 === 0 ? "მხოლოდ ქალბატონებისთვის" : "ყველასთვის",
          schedule:
            "- სამუშაო დღეებში 8 საათი\n- შაბათ-კვირას თავისუფალი\n- საღამოები თავისუფალი",
          additionalInfo: "გამოცდილება სასურველია, მაგრამ არა აუცილებელი.",
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
