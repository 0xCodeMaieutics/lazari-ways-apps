"use server";
import {
  generateRandomString,
  s3ObjectQueries,
  vacancyQueries,
  type VacancyCreateInput,
} from "@workspace/server/db";
import { uploadFileToStorage } from "@workspace/file-upload/s3-client";
import { env } from "@/env";
import { NewVacancyFormData } from "@/app/(auth)/vacancies/new/schema";
import { S3Object } from "@workspace/server/db/models";
export const createVacancy = async ({ photo, ...data }: NewVacancyFormData) => {
  const id = generateRandomString(32);

  let photoKey: string | null = null;
  if (photo !== null && photo !== undefined) {
    const fileKey = `${env.S3_BUCKET_VACANCIES}/${id}/photo/${Date.now()}-${photo.name}`;
    const uploadResult = await uploadFileToStorage({
      file: photo,
      bucket: env.S3_BUCKET_NAME,
      fileKey: fileKey,
      ACL: "public-read",
    });

    if (uploadResult.isErr()) {
      console.error(uploadResult.error);
      return {
        isSuccess: false,
        errorCode: "PHOTO_UPLOAD_FAILED",
        errorMessage: "Failed to upload photo",
      };
    }
    photoKey = fileKey;
  }
  /**
   * TODO: implement handling of additional photos and videos
   */
  // data.photos
  // data.videos;
  const vacancyId = generateRandomString(32);
  const result = await vacancyQueries.createVacancy({
    id: vacancyId,
    accommodation: data.accommodation,
    beginDate: data.beginDate,
    duration: data.duration,
    jobDescription: data.jobDescription,
    languageLevel: data.languageLevel,
    location: data.location,
    meals: data.meals,
    salary: data.salary,
    schedule: data.schedule,
    title: data.title,
    availableTo: data.availableTo,
    additionalInfo: data.additionalInfo,
    hide: data.hide,
    acceptableApplicationTypes: ["KKB3", "KKB8", "STUDENT"], // TODO: make dynamic based on selected
    reviews: {}, // TODO: implement reviews
  } satisfies VacancyCreateInput);

  if (result.isErr()) {
    console.error(result.error);
    return {
      isSuccess: false,
      errorCode: "VACANCY_CREATION_FAILED",
      errorMessage: "Failed to create vacancy",
    };
  }

  if (photoKey) {
    const s3ObjectResult = await s3ObjectQueries.createS3Object({
      id: generateRandomString(32),
      type: S3Object.IMAGE,
      key: photoKey,
      vacancy: {
        connect: {
          id: vacancyId,
        },
      },
    });
    console.log({ photoKey });

    if (s3ObjectResult.isErr()) {
      return {
        isSuccess: false,
        errorCode: "S3_OBJECT_CREATION_FAILED",
        errorMessage: "Failed to create S3 object for vacancy photo",
      };
    }
  }

  return {
    isSuccess: true,
    id: result.value.id,
  };
};
