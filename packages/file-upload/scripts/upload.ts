import { uploadToStorage } from "@workspace/file-upload/s3-client.ts";
import { randomUUID } from "crypto";
import { read, readFile, readFileSync } from "fs";
import { env } from "process";

void (async function main() {
  const id = randomUUID();

  const photoData = readFileSync("./scripts/photo.png");
  const fileKey = `vacancies/${id}/photo/${Date.now()}-photo.png`;
  console.log({ fileKey });

  const uploadResult = await uploadToStorage({
    file: photoData,
    bucket: "lazari-ways-bucket",
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
