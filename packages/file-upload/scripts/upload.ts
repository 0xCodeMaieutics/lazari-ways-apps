import {
  getSignedUrlForDownload,
  uploadToStorage,
} from "@workspace/file-upload/s3-client.ts";
import { keyBuilders } from "@workspace/file-upload/key-builder.ts";
import { zodParse } from "@workspace/shared/error-handling/index.ts";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import z from "zod";
import { generateRandomString } from "@workspace/shared/lib/random.ts";

void (async function main() {
  const s3BucketNameResult = zodParse(
    process.env.S3_BUCKET_NAME,
    z.string().min(1)
  );
  if (s3BucketNameResult.isErr()) {
    console.error("S3_BUCKET_ENV_LOAD_FAILED");
    return;
  }

  const id = randomUUID();

  const photoData = readFileSync("./scripts/photo.png");

  const employeeId = generateRandomString(32);
  const fileKey = keyBuilders.employees.photo.buildKey({
    employeeId,
    filename: "photo.png",
    now: Date.now(),
  });
  console.log({ fileKey });

  const uploadResult = await uploadToStorage({
    file: photoData,
    bucket: s3BucketNameResult.value,
    fileKey: fileKey,
  });

  if (uploadResult.isErr()) {
    console.error(uploadResult.error);
    return {
      isSuccess: false,
      errorCode: "PHOTO_UPLOAD_FAILED",
      errorMessage: "Failed to upload photo",
    };
  }

  const url = await getSignedUrlForDownload({
    bucket: s3BucketNameResult.value,
    fileKey,
    expiresInSeconds: 3600,
  });

  if (url.isErr()) {
    console.log("URL_GENERATION_FAILED");
    return;
  }
  console.log({
    signedUrl: url.value,
  });
})();
