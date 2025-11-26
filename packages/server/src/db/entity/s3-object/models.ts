import {
  S3ObjectAcl as S3ObjectAclType,
  S3ObjectType,
} from "../../generated/prisma/enums.js";

export const S3Object = {
  DOCUMENT: S3ObjectType.DOCUMENT,
  IMAGE: S3ObjectType.IMAGE,
} satisfies Record<string, S3ObjectType>;

export type S3Object = S3ObjectType;

export const S3ObjectAcl = {
  PRIVATE: S3ObjectAclType.PRIVATE,
  PUBLIC_READ: S3ObjectAclType.PUBLIC_READ,
  PUBLIC_READ_WRITE: S3ObjectAclType.PUBLIC_READ_WRITE,
} satisfies Record<string, S3ObjectAclType>;

export type S3ObjectAcl = S3ObjectAclType;
