/*
  Warnings:

  - You are about to drop the column `agencyAddress` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `agencyName` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `fotoKey` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `hasBeenInCountryBefore` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `previousStayCountry` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the `ApplicationStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApplicationStudent" DROP CONSTRAINT "ApplicationStudent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInformation" DROP CONSTRAINT "UserInformation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "agencyAddress",
DROP COLUMN "agencyName",
DROP COLUMN "email",
DROP COLUMN "fotoKey",
DROP COLUMN "hasBeenInCountryBefore",
DROP COLUMN "instagram",
DROP COLUMN "phone",
DROP COLUMN "previousStayCountry",
DROP COLUMN "taxId",
DROP COLUMN "userId",
ADD COLUMN     "certificateOfEnrollmentKey" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "hasBeenInGermanyBefore" BOOLEAN,
ADD COLUMN     "semesterBreakFrom" TIMESTAMP(3),
ADD COLUMN     "semesterBreakTo" TIMESTAMP(3),
ADD COLUMN     "studySubject" TEXT,
ADD COLUMN     "university" TEXT,
ALTER COLUMN "emergencyContactName" DROP NOT NULL,
ALTER COLUMN "emergencyContactPhone" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."ApplicationStudent";

-- DropTable
DROP TABLE "public"."UserInformation";

-- DropTable
DROP TABLE "public"."UserSettings";

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "theme" TEXT DEFAULT 'light',
    "lang" "Lang" DEFAULT 'EN',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthPlace" TEXT NOT NULL,
    "birthCountry" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "taxId" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "fotoKey" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
