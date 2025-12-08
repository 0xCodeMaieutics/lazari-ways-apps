/*
  Warnings:

  - You are about to drop the column `acl` on the `S3Object` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "S3Object" DROP COLUMN "acl",
ADD COLUMN     "amzSignedUrlSearchParams" TEXT;

-- DropEnum
DROP TYPE "public"."S3ObjectAcl";
