import * as crypto from "node:crypto";
import { createReadStream } from "node:fs";
import { performance } from "node:perf_hooks";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  tryCatchAsync,
  Err,
  err,
  Results,
} from "@workspace/shared/error-handling/result";
import z from "zod";
import { zodParse } from "@workspace/shared/error-handling/index";

export const getS3Client = () => {
  const result = zodParse(
    {
      S3_REGION: process.env.S3_REGION,
      S3_ENDPOINT: process.env.S3_ENDPOINT,
      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
      S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    },
    z.object({
      S3_REGION: z.string().min(1),
      S3_ENDPOINT: z.string().min(1),
      S3_ACCESS_KEY: z.string().min(1),
      S3_SECRET_KEY: z.string().min(1),
    })
  );
  if (result.isErr()) {
    throw new Error(
      `S3 Client configuration error: ${JSON.stringify(result.error)}`
    );
  }

  return new S3Client({
    region: result.value.S3_REGION,
    endpoint: result.value.S3_ENDPOINT,
    credentials: {
      accessKeyId: result.value.S3_ACCESS_KEY,
      secretAccessKey: result.value.S3_SECRET_KEY,
    },
    forcePathStyle: process.env.NODE_ENV === "development",
  });
};

export async function uploadFileToStorage({
  file,
  bucket,
  fileKey,
  lockUntil = null,
  ACL = "public-read",
}: {
  file: File;
  bucket: string;
  fileKey: string;
  lockUntil?: Date | null;
  ACL?: "private" | "public-read" | "public-read-write";
}) {
  const fileBufferResult = await tryCatchAsync(async () =>
    Buffer.from(await file.arrayBuffer())
  );
  if (fileBufferResult.isErr()) {
    return err(fileBufferResult.error);
  }
  const fileBuffer = fileBufferResult.value;
  return await uploadToStorage({
    file: fileBuffer,
    bucket,
    fileKey,
    lockUntil,
  });
}

export async function uploadToStorage({
  file,
  bucket,
  fileKey,
  lockUntil = null,
}: {
  file: Uint8Array;
  bucket: string;
  fileKey: string;
  lockUntil?: Date | null;
}) {
  return await tryCatchAsync(
    () =>
      new Promise<{ uploadCompletedAt: Date }>(async (resolve, reject) => {
        const startChecksumTime = performance.now();
        const sha1ChecksumResult = await calculateSha1Checksum(file);
        const endChecksumTime = performance.now();
        console.log(
          `Calculating SHA1 checksum took ${(endChecksumTime - startChecksumTime).toFixed(3)} ms`,
          { Bucket: bucket, Key: fileKey }
        );
        if (sha1ChecksumResult.isErr()) {
          return reject(sha1ChecksumResult.error);
        }
        const sha1Checksum = sha1ChecksumResult.value;

        const uploadStartTime = performance.now();

        const upload = new Upload({
          client: getS3Client(),
          params: {
            Bucket: bucket,
            Key: fileKey,
            Body: file,
            ChecksumAlgorithm: "SHA1",
            ChecksumSHA1: sha1Checksum,
            ...(lockUntil === null
              ? {}
              : {
                  ObjectLockMode: "COMPLIANCE", // nobody is ever able to delete the file until the lock expires
                  ObjectLockRetainUntilDate: lockUntil,
                }),
          },
        });
        const uploadResult = await tryCatchAsync(() => upload.done());
        if (uploadResult.isErr()) {
          return reject(uploadResult.error);
        }
        const uploadEndTime = performance.now();
        console.log(
          `File upload took ${(uploadEndTime - uploadStartTime).toFixed(3)} ms`,
          {
            Bucket: bucket,
            Key: fileKey,
            ChecksumSHA1: sha1Checksum,
          }
        );
        resolve({ uploadCompletedAt: new Date() });
      }),
    (error) => {
      if (error instanceof Err) {
        if (error.error.type === "ERROR_CALCULATING_SHA1_CHECKSUM") {
          return error.error as ChecksumError;
        }
        return {
          type: "UNKNOWN_ERROR",
          cause: error.error,
        };
      }
      if (error instanceof Error) {
        if (error.name === "InvalidBucketName") {
          return {
            type: "ERROR_UPLOADING_FILE_TO_STORAGE",
            subtype: "INVALID_BUCKET_NAME",
            bucketName: bucket,
            cause: error,
          };
        }
        return {
          type: "ERROR_UPLOADING_FILE_TO_STORAGE",
          subtype: "UNKNOWN_UPLOAD_ERROR",
          message: "Unknown error uploading file to storage.",
          errorName: error.name,
          cause: error,
        };
      }
      return {
        type: "ERROR_UPLOADING_FILE_TO_STORAGE",
        subtype: "UNKNOWN_UPLOAD_ERROR",
        message: "Unknown thrown value while uploading file to storage.",
        errorName: null,
        cause: error,
      };
    }
  );
}

export async function uploadFilePathToStorage({
  filePath,
  bucket,
  fileKey,
  lockUntil = null,
  ACL = "public-read",
}: {
  filePath: string;
  bucket: string;
  fileKey: string;
  lockUntil?: Date | null;
  ACL?: "private" | "public-read" | "public-read-write";
}) {
  return await tryCatchAsync(
    () =>
      new Promise<{ uploadCompletedAt: Date }>(async (resolve, reject) => {
        const startChecksumTime = performance.now();
        const sha1ChecksumResult = await sha1ChecksumForFile(filePath);
        const endChecksumTime = performance.now();
        console.debug(
          `Calculating SHA1 checksum took ${(endChecksumTime - startChecksumTime).toFixed(3)} ms`,
          { Bucket: bucket, Key: fileKey }
        );
        if (sha1ChecksumResult.isErr()) {
          return reject(sha1ChecksumResult.error);
        }
        const sha1Checksum = sha1ChecksumResult.value;

        const fileStream = createReadStream(filePath);

        fileStream.on("error", (error) => {
          reject(error);
        });

        const uploadStartTime = performance.now();
        const upload = new Upload({
          client: getS3Client(),
          params: {
            Bucket: bucket,
            Key: fileKey,
            Body: fileStream,
            ACL,
            ChecksumAlgorithm: "SHA1",
            ChecksumSHA1: sha1Checksum,
            ...(lockUntil === null
              ? {}
              : {
                  ObjectLockMode: "COMPLIANCE", // nobody is ever able to delete the file until the lock expires
                  ObjectLockRetainUntilDate: lockUntil,
                }),
          },
        });
        await upload.done();
        const uploadEndTime = performance.now();
        console.debug(
          `File upload took ${(uploadEndTime - uploadStartTime).toFixed(3)} ms`,
          {
            Bucket: bucket,
            Key: fileKey,
            ChecksumSHA1: sha1Checksum,
          }
        );
        resolve({ uploadCompletedAt: new Date() });
      }),
    (error) => {
      if (error instanceof Err) {
        if (error.error.type === "ERROR_CALCULATING_SHA1_CHECKSUM") {
          return error.error as ChecksumError;
        }
        return {
          type: "UNKNOWN_ERROR",
          cause: error.error,
        };
      }
      if (error instanceof Error) {
        if (error.name === "InvalidBucketName") {
          return {
            type: "ERROR_UPLOADING_FILE_TO_STORAGE",
            subtype: "INVALID_BUCKET_NAME",
            bucketName: bucket,
            cause: error,
          };
        }
        if (
          error.name === "Error" &&
          (error as Error & Record<string, unknown>).code === "ENOENT"
        ) {
          return {
            type: "ERROR_UPLOADING_FILE_TO_STORAGE",
            subtype: "FILE_NOT_FOUND",
            message: "File to upload does not exist.",
            path: filePath,
            cause: error,
          };
        }
        return {
          type: "ERROR_UPLOADING_FILE_TO_STORAGE",
          subtype: "UNKNOWN_UPLOAD_ERROR",
          message: "Unknown error uploading file to storage.",
          errorName: error.name,
          cause: error,
        };
      }
      return {
        type: "ERROR_UPLOADING_FILE_TO_STORAGE",
        subtype: "UNKNOWN_UPLOAD_ERROR",
        message: "Unknown thrown value while uploading file to storage.",
        errorName: null,
        cause: error,
      };
    }
  );
}

type ChecksumError = {
  type: "ERROR_CALCULATING_SHA1_CHECKSUM";
  message: string;
  errorName: string | null;
  cause: Error;
};
function sha1ChecksumForFile(path: string) {
  return tryCatchAsync(
    () =>
      new Promise<string>((resolve, reject) => {
        const stream = createReadStream(path);
        const hash = crypto.createHash("sha1");
        stream.on("error", reject);
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("base64")));
      }),
    (error) =>
      ({
        type: "ERROR_CALCULATING_SHA1_CHECKSUM",
        message: "Error calculating SHA1 checksum.",
        errorName: error instanceof Error ? error.name : null,
        cause:
          error instanceof Error
            ? error
            : new Error("Unknown thrown value", { cause: error }),
      }) satisfies ChecksumError
  );
}

function calculateSha1Checksum(data: Uint8Array) {
  return tryCatchAsync(
    async () => {
      const hash = crypto.createHash("sha1");
      hash.update(Buffer.from(data));
      return hash.digest("base64");
    },
    (error) =>
      ({
        type: "ERROR_CALCULATING_SHA1_CHECKSUM",
        message: "Error calculating SHA1 checksum for response body.",
        errorName: error instanceof Error ? error.name : null,
        cause:
          error instanceof Error
            ? error
            : new Error("Unknown thrown value", { cause: error }),
      }) satisfies ChecksumError
  );
}

export async function deleteFileFromStorage({
  bucket,
  fileKey,
}: {
  bucket: string;
  fileKey: string;
}) {
  return await tryCatchAsync(
    () =>
      getS3Client().send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: fileKey,
        })
      ),
    (error) => ({
      type: "ERROR_DELETING_FILE_FROM_STORAGE",
      message: "Error deleting file from storage.",
      errorName: error instanceof Error ? error.name : null,
      cause:
        error instanceof Error
          ? error
          : new Error("Unknown thrown value", { cause: error }),
    })
  );
}

export async function downloadFileFromStorage({
  bucket,
  fileKey,
}: {
  bucket: string;
  fileKey: string;
}) {
  return await tryCatchAsync(
    async () => {
      const downloadStartTime = performance.now();

      const response = await getS3Client().send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: fileKey,
        })
      );

      const downloadEndTime = performance.now();
      console.debug(
        `File download took ${(downloadEndTime - downloadStartTime).toFixed(3)} ms`,
        {
          Bucket: bucket,
          Key: fileKey,
        }
      );

      return {
        body: response.Body,
        async getBuffer() {
          return await tryCatchAsync(
            async () => {
              if (response.Body === undefined) {
                throw new Error("File body is empty");
              }
              return Buffer.from(await response.Body.transformToByteArray());
            },
            (error) => ({
              type: "ERROR_READING_FILE_TO_BUFFER",
              message: "Fehler beim Herunterladen der Datei.",
              cause: error,
            })
          );
        },
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        metadata: response.Metadata,
        eTag: response.ETag,
        lastModified: response.LastModified,
      };
    },
    (error) => ({
      type: "ERROR_DOWNLOADING_FILE_FROM_STORAGE",
      message: "Fehler beim Herunterladen der Datei.",
      bucket,
      fileKey,
      errorName: error instanceof Error ? error.name : null,
      cause:
        error instanceof Error
          ? error
          : new Error("Unknown thrown value", { cause: error }),
    })
  );
}

export async function getSignedUrlForDownload({
  bucket,
  fileKey,
  expiresInSeconds = 60 * 10,
}: {
  bucket: string;
  fileKey: string;
  expiresInSeconds?: number;
}) {
  return await tryCatchAsync(
    async () => {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      });
      return await getSignedUrl(getS3Client(), command, {
        expiresIn: expiresInSeconds,
      });
    },
    (error) => ({
      type: "ERROR_GETTING_DOWNLOAD_URL_FOR_FILE",
      message: "Es konnte kein Download Link für die Datei erstellt werden.",
      bucket,
      fileKey,
      errorName: error instanceof Error ? error.name : null,
      cause: error,
    })
  );
}

export const putObjects = ({
  keys,
  bodies,
  bucketName,
  contentTypes = [],
}: {
  keys: string[];
  bodies: (Buffer | Uint8Array | Blob | string)[];
  contentTypes: string[];
  bucketName: string;
}) => {
  if (keys.length !== bodies.length) {
    throw new Error("Keys and bodies must have the same length");
  }
  if (contentTypes.length > 0 && contentTypes.length !== keys.length) {
    throw new Error(
      "ContentTypes must be empty or have the same length as keys"
    );
  }
  const resultAsyncs = keys.map((k, i) =>
    tryCatchAsync(() =>
      new Upload({
        client: getS3Client(),
        params: {
          Bucket: bucketName,
          Key: k,
          Body: bodies[i],
          ContentType: contentTypes[i] || "application/octet-stream",
        },
      }).done()
    )
  );
  return Results.allAsync(resultAsyncs);
};
