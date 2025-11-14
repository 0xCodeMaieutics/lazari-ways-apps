/*
  Warnings:

  - Changed the type of `vacancyId` on the `Vacancy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "vacancyId",
ADD COLUMN     "vacancyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_vacancyId_key" ON "Vacancy"("vacancyId");
