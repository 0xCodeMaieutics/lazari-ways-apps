/*
  Warnings:

  - You are about to drop the column `photoKey` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `videos` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[vacancyId]` on the table `S3Object` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "S3ObjectType" ADD VALUE 'VIDEO';

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_vacancyId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "vacancyId" TEXT;

-- AlterTable
ALTER TABLE "S3Object" ADD COLUMN     "vacancyId" TEXT,
ADD COLUMN     "vacancyPhotoId" TEXT,
ADD COLUMN     "vacancyVideoId" TEXT;

-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "photoKey",
DROP COLUMN "photos",
DROP COLUMN "videos",
ADD COLUMN     "acceptableApplicationTypes" "ApplicationType"[] DEFAULT ARRAY[]::"ApplicationType"[];

-- DropTable
DROP TABLE "public"."Review";

-- CreateTable
CREATE TABLE "VacancyReview" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageId" TEXT,
    "vacancyId" TEXT,

    CONSTRAINT "VacancyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VacancyReview_imageId_key" ON "VacancyReview"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "S3Object_vacancyId_key" ON "S3Object"("vacancyId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Object" ADD CONSTRAINT "S3Object_vacancyPhotoId_fkey" FOREIGN KEY ("vacancyPhotoId") REFERENCES "Vacancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Object" ADD CONSTRAINT "S3Object_vacancyVideoId_fkey" FOREIGN KEY ("vacancyVideoId") REFERENCES "Vacancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "S3Object" ADD CONSTRAINT "S3Object_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancyReview" ADD CONSTRAINT "VacancyReview_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "S3Object"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancyReview" ADD CONSTRAINT "VacancyReview_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
