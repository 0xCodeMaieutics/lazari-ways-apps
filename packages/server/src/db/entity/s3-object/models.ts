import { S3ObjectType as S3ObjectType } from "../../generated/prisma/enums.js";

export const S3Object = {
  DOCUMENT: S3ObjectType.DOCUMENT,
  IMAGE: S3ObjectType.IMAGE,
} satisfies Record<string, S3ObjectType>;

export type S3Object = S3ObjectType;
