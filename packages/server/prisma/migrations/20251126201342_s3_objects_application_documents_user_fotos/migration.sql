/*
  Warnings:

  - You are about to drop the column `certificateOfEnrollmentKey` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `languageCertificateKey` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `passportKey` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `studyCertificateKey` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `fotoKey` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationDocumentType" AS ENUM ('PASSPORT', 'STUDY_CERTIFICATE', 'CERTIFICATE_OF_ENROLLMENT', 'LANGUAGE_CERTIFICATE');

-- CreateEnum
CREATE TYPE "S3ObjectType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "S3ObjectAcl" AS ENUM ('PRIVATE', 'PUBLIC_READ', 'PUBLIC_READ_WRITE');

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "certificateOfEnrollmentKey",
DROP COLUMN "languageCertificateKey",
DROP COLUMN "passportKey",
DROP COLUMN "studyCertificateKey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "fotoKey";

-- CreateTable
CREATE TABLE "ApplicationDocument" (
    "id" TEXT NOT NULL,
    "type" "ApplicationDocumentType" NOT NULL,
    "applicationId" TEXT NOT NULL,
    "s3ObjectId" TEXT,

    CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "S3Object" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "S3ObjectType" NOT NULL,
    "acl" "S3ObjectAcl" NOT NULL,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "S3Object_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationDocument_s3ObjectId_key" ON "ApplicationDocument"("s3ObjectId");

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_s3ObjectId_fkey" FOREIGN KEY ("s3ObjectId") REFERENCES "S3Object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Object" ADD CONSTRAINT "S3Object_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
