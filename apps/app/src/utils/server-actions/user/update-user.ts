"use server";

import { ProfileFormData } from "@/components/forms/profile-form/schema";
import {
  generateRandomString,
  UpdateUserInput,
  userQueries,
} from "@workspace/server/db";

import { uploadFileToStorage } from "@workspace/file-upload/s3-client";
import { env } from "@/env";

export const updateUser = async ({
  userId,
  data,
}: {
  userId: string;
  data: ProfileFormData;
}) => {
  const employeeId = generateRandomString(32);
  // Only upload new photo if provided
  let fileKey: string | undefined;
  if (data.foto) {
    fileKey = `employees/${employeeId}/profiles/${userId}/photo/${Date.now()}-${data.foto.name}`;
    const uploadResult = await uploadFileToStorage({
      file: data.foto,
      bucket: env.S3_BUCKET_NAME,
      fileKey: fileKey,
    });
    if (uploadResult.isErr()) {
      console.error(uploadResult.error);
      return {
        success: false,
        message: "Failed to upload photo.",
      };
    }
  }

  const updateUserData = {
    firstName: data.firstName,
    lastName: data.lastName,
    birthCountry: data.birthCountry,
    birthDate: new Date(data.birthDate).toISOString(),
    birthPlace: data.birthPlace,
    country: data.country,
    gender: data.gender,
    city: data.city,
    nationality: data.nationality,
    postalCode: data.postalCode,
    street: data.street,
    phone: "",
    facebook: "",
    instagram: "",
    taxId: "",
    fotoKey: fileKey ?? null,
  } satisfies Omit<
    NonNullable<NonNullable<UpdateUserInput["employee"]>["upsert"]>["create"],
    "id"
  >;

  const updateUserResult = await userQueries.updateUser(userId, {
    ...(fileKey && { image: fileKey }), // Only update image if new one was uploaded
    employee: {
      upsert: {
        create: {
          id: employeeId,
          ...updateUserData,
        },
        update: updateUserData,
        where: {
          userId,
        },
      },
    },
  });

  if (updateUserResult.isErr()) {
    console.error(updateUserResult.error);
    return {
      success: false,
      message: "Failed to update user information.",
    };
  }

  return {
    success: true,
    message: "User information updated successfully.",
  };
};
