import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

export type CreateS3ObjectInput = Prisma.S3ObjectCreateInput;
export const s3ObjectQueries = {
  createS3Object: (data: CreateS3ObjectInput) =>
    tryCatchAsync(() =>
      prisma.s3Object.create({
        data: data,
      })
    ),
  createS3Objects: (data: CreateS3ObjectInput[]) =>
    tryCatchAsync(() =>
      prisma.s3Object.createMany({
        data: data,
      })
    ),
};
