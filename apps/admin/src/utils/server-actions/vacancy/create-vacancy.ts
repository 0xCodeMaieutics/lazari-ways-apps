"use server";
import { vacancyQueries, type VacancyCreateInput } from "@workspace/server/db";
import { uploadFileToStorage } from "@workspace/file-upload/s3-client";
import { env } from "@/env";

export type VacancyCreateInputServerAction = {
  data: VacancyCreateInput;
  photo: File | null;
};

export const createVacancy = async ({
  data,
  photo,
}: VacancyCreateInputServerAction) => {
  let photoKey: string | undefined = undefined;

  if (photo !== null) {
    const fileKey = `${env.S3_BUCKET_VACANCIES}/${data.id}/photo/${Date.now()}-${photo.name}`;
    const uploadResult = await uploadFileToStorage({
      file: photo,
      bucket: env.S3_BUCKET_NAME,
      fileKey: fileKey,
    });

    if (uploadResult.isErr()) {
      console.error(uploadResult.error);
      return {
        isSuccess: false,
      };
    }

    photoKey = fileKey;
  }

  const result = await vacancyQueries.createVacancy({
    ...data,
    photoKey,
  });

  if (result.isErr()) {
    console.error(result.error);
    return {
      isSuccess: false,
    };
  }
  return {
    isSuccess: true,
    id: result.value.id,
  };
};
