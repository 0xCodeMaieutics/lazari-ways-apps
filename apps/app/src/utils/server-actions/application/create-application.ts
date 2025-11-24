"use server";

import { applicationQueries, generateRandomString } from "@workspace/server/db";

import { putObjects } from "@workspace/file-upload/s3-client";
import { env } from "@/env";
import { ApplicationFormData } from "@/utils/models/applications";
import {
  ApplicationStatus,
  ApplicationType,
} from "@workspace/server/db/models";

export const createApplication = async ({
  employeeId,
  data,
  type,
}: {
  employeeId: string;
  // TODO: Change any to ApplicationFormData
  data: ApplicationFormData;
  type: ApplicationType;
}) => {
  // Prepare file uploads
  const files: File[] = [];
  const keys: string[] = [];
  const contentTypes: string[] = [];

  const now = Date.now();

  const applicationId = generateRandomString(32);

  const buildDocumentKey = ({
    filename,
    type,
    docType,
  }: {
    type: ApplicationType;
    filename: string;
    docType:
      | "passport"
      | "language-certificate"
      | "study-certificate"
      | "certificate-of-enrollment";
  }) =>
    `employees/${employeeId}/applications/${applicationId}/${type}/documents/${docType}/${now}-${filename}`;

  if (data.passport) {
    const key = buildDocumentKey({
      filename: data.passport.name,
      type,
      docType: "passport",
    });
    files.push(data.passport);
    keys.push(key);
    contentTypes.push(data.passport.type);
  }

  if (data.languageCertificate) {
    const key = buildDocumentKey({
      filename: data.languageCertificate.name,
      type,
      docType: "language-certificate",
    });
    files.push(data.languageCertificate);
    keys.push(key);
    contentTypes.push(data.languageCertificate.type);
  }

  if (data.certificateOfEnrollment) {
    const key = buildDocumentKey({
      filename: data.certificateOfEnrollment.name,
      type,
      docType: "certificate-of-enrollment",
    });
    files.push(data.certificateOfEnrollment);
    keys.push(key);
    contentTypes.push(data.certificateOfEnrollment.type);
  }

  if (data.studyCertificate) {
    const key = buildDocumentKey({
      filename: data.studyCertificate.name,
      type,
      docType: "study-certificate",
    });
    files.push(data.studyCertificate);
    keys.push(key);
    contentTypes.push(data.studyCertificate.type);
  }

  // Upload all files if any exist
  if (files.length > 0) {
    const uploadResult = await putObjects({
      bodies: files,
      bucketName: env.S3_BUCKET_NAME,
      contentTypes: contentTypes,
      keys: keys,
    });

    if (uploadResult.isErr()) {
      console.error(uploadResult.error);
      return {
        success: false,
        message: "Failed to upload application files.",
      };
    }
  }

  // Extract keys for database storage
  let keyIndex = 0;
  const passportKey = data.passport ? (keys[keyIndex++] ?? "") : "";
  const languageCertificateKey = data.languageCertificate
    ? (keys[keyIndex++] ?? "")
    : "";
  const studyCertificateKey = data.studyCertificate
    ? (keys[keyIndex++] ?? "")
    : "";

  const createdApplicationResult = await applicationQueries.createApplication({
    id: applicationId,
    type,
    employee: {
      connect: {
        id: employeeId,
      },
    },
    semesterBreakFrom: data.semesterBreakFrom
      ? new Date(data.semesterBreakFrom)
      : undefined,
    semesterBreakTo: data.semesterBreakTo
      ? new Date(data.semesterBreakTo)
      : undefined,
    passportKey: passportKey,
    certificateOfEnrollmentKey: "",
    languageCertificateKey: languageCertificateKey,
    status: ApplicationStatus.USER_SUBMITTED,
    studyCertificateKey: studyCertificateKey,
    studySubject: data.studySubject,
    university: data.university,
    allergies: data.allergies,
    canRideBike: data.canRideBike,
    clothingSize: data.clothingSize,
    driverLicense: data.driverLicense,
    emergencyContactName: data.emergencyContactName,
    emergencyContactPhone: data.emergencyPhone,
    germanLevel: data.germanLevel,
    hasBeenInGermanyBefore: data.hasBeenInGermanyBefore,
    healthRestrictions: data.healthRestrictions,
    otherLanguages: data.otherLanguages,
    previousStayPeriodFrom: data.previousStayPeriodFrom
      ? new Date(data.previousStayPeriodFrom)
      : undefined,
    previousStayPeriodTo: data.previousStayPeriodTo
      ? new Date(data.previousStayPeriodTo)
      : undefined,
    previousStayPlace: data.previousStayPlace,
    shiftWork: data.shiftWork,
    shoeSize: data.shoeSize,
  });

  if (createdApplicationResult.isErr()) {
    console.error(createdApplicationResult.error);
    return {
      success: false,
      message: "Failed to create application.",
    };
  }

  return {
    success: true,
    message: "Application created successfully.",
  };
};
