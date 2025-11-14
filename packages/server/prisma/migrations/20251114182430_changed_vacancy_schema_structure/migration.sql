/*
  Warnings:

  - You are about to drop the column `benefits` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `employmentType` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `priceMax` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `priceMin` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Vacancy` table. All the data in the column will be lost.
  - You are about to drop the column `vacancyName` on the `Vacancy` table. All the data in the column will be lost.
  - Added the required column `accommodation` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beginDate` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDescription` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meals` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Vacancy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Vacancy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "benefits",
DROP COLUMN "description",
DROP COLUMN "employmentType",
DROP COLUMN "imageUrl",
DROP COLUMN "priceMax",
DROP COLUMN "priceMin",
DROP COLUMN "requirements",
DROP COLUMN "startDate",
DROP COLUMN "vacancyName",
ADD COLUMN     "accommodation" TEXT NOT NULL,
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "beginDate" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "jobDescription" TEXT NOT NULL,
ADD COLUMN     "meals" TEXT NOT NULL,
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "salary" TEXT NOT NULL,
ADD COLUMN     "schedule" TEXT NOT NULL,
ADD COLUMN     "videos" TEXT[],
ALTER COLUMN "vacancyId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "instagram" TEXT,
    "vacancyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_vacancyId_fkey" FOREIGN KEY ("vacancyId") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
