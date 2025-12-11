-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN     "acceptedApplicationTypes" "ApplicationType"[] DEFAULT ARRAY[]::"ApplicationType"[];
