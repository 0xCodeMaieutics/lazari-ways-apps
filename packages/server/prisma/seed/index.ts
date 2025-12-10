import "dotenv/config";
import { generateRandomString } from "@workspace/shared/lib/random";
import { zodParse } from "@workspace/shared/error-handling/index";
import { createAdmin } from "./admin.js";
import { createApplications } from "./application.js";
import { createUsers } from "./user.js";
import z from "zod";
import { auth } from "../../src/auth/auth.js";
import { $Enums, ApplicationType, Prisma } from "db/client.js";
import {
  getSignedUrlForDownload,
  uploadFilePathToStorage,
} from "@workspace/file-upload/s3-client";
import path from "path";
import { prisma } from "../../src/db/client.js";
import { encrypt } from "../../src/utils/encrypt.js";
import { faker } from "@faker-js/faker";

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

  const envResult = zodParse(
    process.env,
    z.object({
      ENCRYPTION_KEY: z.string(),
      DATABASE_URL: z.string().url(),
      S3_BUCKET_NAME: z.string(),
    })
  );
  if (envResult.isErr()) {
    console.error("ENV_VARIABLE_PARSE_ERROR", envResult.error);
    return;
  }

  console.log(`⚙️  Seeding database: ${envResult.value.DATABASE_URL}`);

  const env = envResult.value;

  await prisma.$transaction(async (tx) => {
    console.log("👤 Creating admin and applicant user...");
    const ADMIN_EMAIL = "admin@lazariways.eu";
    const ADMIN_PASSWORD = encrypt("#AdminIsCool2025!", env.ENCRYPTION_KEY);
    await createAdmin(
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      tx
    );
    console.log("👤 Creating users data...");

    const userCount = 100;

    const userIds = Array.from({ length: userCount }).map(() =>
      generateRandomString(32)
    );

    const employeeIds = Array.from({ length: userCount }).map(() =>
      generateRandomString(32)
    );

    await createUsers({
      tx,
      userIds,
      employeeIds,
    });

    const employeeFotoKey = "employee/profile-picture.jpg";
    const employeeFotoUploadResult = await uploadFilePathToStorage({
      bucket: envResult.value.S3_BUCKET_NAME,
      fileKey: employeeFotoKey,
      filePath: path.resolve(import.meta.dirname, "profile-student.jpg"),
    });

    let employeeSignedUrlParams: string[] = [];

    for (const id of employeeIds) {
      const signedUrls = await getSignedUrlForDownload({
        bucket: envResult.value.S3_BUCKET_NAME,
        fileKey: employeeFotoKey,
        expiresInSeconds: 60 * 60 * 24, // 1 day
      });
      if (signedUrls.isErr()) {
        console.error("SIGNED_URL_GENERATION_ERROR", signedUrls.error);
        return;
      }

      employeeSignedUrlParams.push(
        new URL(signedUrls.value).searchParams.toString()
      );
    }

    await tx.s3Object.createMany({
      data: employeeIds.map(
        (id, i) =>
          ({
            id,
            key: employeeFotoKey,
            type: $Enums.S3ObjectType.IMAGE,
            employeeId: id,
            amzSignedUrlSearchParams: employeeSignedUrlParams[i],
          }) satisfies Prisma.S3ObjectCreateManyInput
      ),
    });

    if (employeeFotoUploadResult.isErr()) {
      console.error(
        "EMPLOYEE_FOTO_UPLOAD_ERROR",
        employeeFotoUploadResult.error
      );
      return;
    }

    console.log("📝 Creating applications with faker data...");
    const applicationIds = Array.from({ length: userCount }).map(() =>
      generateRandomString(32)
    );

    await createApplications({
      applicationIds,
      employeeIds,
      tx,
    });

    const BASE_VACANCY_ID = 375;

    const vacancyPhotoFileKey = "vacancies/hotels.webp";
    const vacancyPhotoUploadResult = await uploadFilePathToStorage({
      bucket: envResult.value.S3_BUCKET_NAME,
      fileKey: vacancyPhotoFileKey,
      filePath: path.resolve(import.meta.dirname, "hotels.webp"),
    });

    if (vacancyPhotoUploadResult.isErr()) {
      console.error(
        "VACANCY_PHOTO_UPLOAD_ERROR",
        vacancyPhotoUploadResult.error
      );
      return;
    }

    const vacancyIds = Array.from({ length: applicationIds.length }).map(() =>
      generateRandomString(32)
    );

    await tx.vacancy.createMany({
      data: vacancyIds.map((id, index) => {
        const vacancyId = BASE_VACANCY_ID + index;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - index);

        return {
          id,

          acceptableApplicationTypes: faker.helpers.arrayElements(
            Object.values(ApplicationType),
            faker.number.int({ min: 1, max: 2 })
          ),
          vacancyId,
          title: "მცხობელი",
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
          createdAt: createdAt.toISOString(),
        } satisfies Prisma.VacancyCreateManyInput;
      }),
    });

    const photosIds = vacancyIds.map(() => generateRandomString(32));
    const photoIds = vacancyIds.map(() => generateRandomString(32));

    await tx.s3Object.createMany({
      data: photosIds.map(
        (id) =>
          ({
            id,
            key: employeeFotoKey,
            type: $Enums.S3ObjectType.IMAGE,
          }) satisfies Prisma.S3ObjectCreateManyInput
      ),
    });
    await tx.s3Object.createMany({
      data: photoIds.map(
        (id) =>
          ({
            id,
            key: employeeFotoKey,
            type: $Enums.S3ObjectType.IMAGE,
          }) satisfies Prisma.S3ObjectCreateManyInput
      ),
    });

    // update vacancies with photo relation
    for (let i = 0; i < vacancyIds.length; i++) {
      const vacancyId = vacancyIds[i];
      const photoId = photoIds[i];

      await tx.vacancy.update({
        where: { id: vacancyId },
        data: {
          photo: {
            connect: { id: photoId },
          },
          photos: {
            connect: { id: photosIds[i] },
          },
        },
      });
    }

    // create vacancy reviews

    await tx.vacancyReview.createMany({
      data: vacancyIds.map(
        (vacancyId, index) =>
          ({
            id: generateRandomString(32),
            name: `მარიამ გოცირიძე ${index + 1}`,
            review: `სასტუმროში მუშაობა ძალიან სასიამოვნო იყო. გარემო მეგობრული და მხარდაჭერით სავსე იყო. ვურჩევ ყველას, ვინც ამ სფეროში მუშაობას აპირებს.`,
            instagram: `@mariam.gotsiridze${index + 1}`,
            vacancyId,
            imageId: photosIds[index],
          }) satisfies Prisma.VacancyReviewCreateManyInput
      ),
    });

    // connect some vacancies to applications
    for (let i = 0; i < applicationIds.length; i++) {
      if (i % 3 === 0) {
        const applicationId = applicationIds[i];
        const vacancyId = vacancyIds[i];

        await tx.application.update({
          where: { id: applicationId },
          data: {
            vacancy: {
              connect: { id: vacancyId },
            },
          },
        });
      }
    }

    console.log("✅ Seed completed successfully!");
    console.log(
      `Created 1 admin user and ${applicationIds.length} applications with realistic faker data`
    );
  });

  await prisma.$disconnect();
})();
