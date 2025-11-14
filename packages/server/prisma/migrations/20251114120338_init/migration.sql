-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('USER_SUBMITTED', 'IN_REVIEW_BY_AGENCY', 'IN_REVIEW_BY_EMPLOYER', 'APPROVED_BY_AGENCY', 'APPROVED_BY_EMPLOYER', 'REJECTED_BY_AGENCY', 'REJECTED_BY_EMPLOYER');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('KKB3', 'KKB8', 'STUDENT');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('EN', 'GE', 'DE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'DIVERSE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERN', 'VOLUNTEER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "type" "ApplicationType" NOT NULL,
    "agencyName" TEXT NOT NULL,
    "agencyAddress" TEXT NOT NULL,
    "germanLevel" TEXT,
    "otherLanguages" TEXT,
    "driverLicense" TEXT,
    "canRideBike" BOOLEAN,
    "shiftWork" BOOLEAN,
    "healthRestrictions" TEXT,
    "allergies" TEXT,
    "clothingSize" TEXT,
    "shoeSize" TEXT,
    "hasBeenInCountryBefore" BOOLEAN NOT NULL,
    "previousStayCountry" TEXT,
    "previousStayPlace" TEXT,
    "previousStayPeriodFrom" TIMESTAMP(3),
    "previousStayPeriodTo" TIMESTAMP(3),
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "taxId" TEXT,
    "instagram" TEXT,
    "fotoKey" TEXT NOT NULL,
    "passportKey" TEXT NOT NULL,
    "languageCertificateKey" TEXT,
    "studyCertificateKey" TEXT,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "status" "ApplicationStatus" DEFAULT 'USER_SUBMITTED',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStudent" (
    "id" TEXT NOT NULL,
    "university" TEXT,
    "studySubject" TEXT,
    "semesterBreakFrom" TIMESTAMP(3),
    "semesterBreakTo" TIMESTAMP(3),
    "certificateOfEnrollmentKey" TEXT,

    CONSTRAINT "ApplicationStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "UserRole" DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "theme" TEXT DEFAULT 'light',
    "lang" "Lang" DEFAULT 'EN',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInformation" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" "Gender",
    "nationality" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "birthCountry" TEXT,
    "street" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "city" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "vacancyId" INTEGER NOT NULL,
    "vacancyName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "priceMin" INTEGER NOT NULL,
    "priceMax" INTEGER NOT NULL,
    "requirements" TEXT[],
    "benefits" TEXT[],
    "employmentType" "EmploymentType" NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInformation_userId_key" ON "UserInformation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_vacancyId_key" ON "Vacancy"("vacancyId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStudent" ADD CONSTRAINT "ApplicationStudent_id_fkey" FOREIGN KEY ("id") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInformation" ADD CONSTRAINT "UserInformation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
