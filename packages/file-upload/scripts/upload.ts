import { uploadToStorage } from "@workspace/file-upload/s3-client.ts";
import { zodParse } from "@workspace/shared/error-handling/index.ts";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import z from "zod";

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
  const fileKey = `vacancies/${id}/photo/${Date.now()}-photo.png`;
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
})();
