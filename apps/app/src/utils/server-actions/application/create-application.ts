"use server";

import {
  applicationQueries,
  CreateS3ObjectInput,
  generateRandomString,
  s3ObjectQueries,
  vacancyQueries,
} from "@workspace/server/db";

import { ApplicationFormData } from "@/utils/models/applications";
import {
  ApplicationDocument,
  ApplicationStatus,
  ApplicationType,
  S3Object,
  S3ObjectAcl,
} from "@workspace/server/db/models";
import { keyBuilders } from "@workspace/file-upload/key-builder";

export const createApplication = async ({
  employeeId,
  vacancyId,
  data,
  type,
}: {
  employeeId: string;
  vacancyId: string;
  // TODO: Change any to ApplicationFormData
  data: ApplicationFormData;
  type: ApplicationType;
}) => {
  const foundVacancy = await vacancyQueries.getVacancyById(vacancyId);
  if (foundVacancy.isErr() || foundVacancy.value === null) {
    console.error(`Vacancy not found: ${vacancyId}`);
    return {
      success: false,
      type: "VACANCY_NOT_FOUND" as const,
      message: "Vacancy not found.",
    };
  }
  const now = Date.now();
  const applicationId = generateRandomString(32);

  type Document = {
    file: File;
    contentType: string;
    docType: ApplicationDocument;
  };

  const documents = [
    {
      file: data.passport,
      contentType: data.passport?.type,
      docType: ApplicationDocument.PASSPORT,
    },
    {
      file: data.languageCertificate,
      contentType: data.languageCertificate?.type,
      docType: ApplicationDocument.LANGUAGE_CERTIFICATE,
    },
    {
      file: data.studyCertificate,
      contentType: data.studyCertificate?.type,
      docType: ApplicationDocument.STUDY_CERTIFICATE,
    },
    {
      file: data.certificateOfEnrollment,
      contentType: data.certificateOfEnrollment?.type,
      docType: ApplicationDocument.CERTIFICATE_OF_ENROLLMENT,
    },
  ].filter(
    (doc): doc is Document =>
      doc.file !== undefined && doc.contentType !== undefined
  );

  const documentPaths = documents.map((doc) => {
    return keyBuilders.employees.application.document.buildKey({
      id: applicationId,
      employeeId,
      type,
      filename: doc.file.name,
      docType: doc.docType,
      now,
    });
  });

  const s3ObjectInputs = documents.map((doc, index) => ({
    id: generateRandomString(32),
    key: documentPaths[index]!,
    type: S3Object.DOCUMENT,
    acl: S3ObjectAcl.PRIVATE,
  })) satisfies CreateS3ObjectInput[];

  const s3ObjectCreateResult =
    await s3ObjectQueries.createS3Objects(s3ObjectInputs);
  if (s3ObjectCreateResult.isErr()) {
    console.error(s3ObjectCreateResult.error);
    return {
      success: false,
      type: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to create S3 object records.",
    };
  }

  const createdApplicationResult = await applicationQueries.createApplication({
    id: applicationId,
    type,
    employee: {
      connect: {
        id: employeeId,
      },
    },
    vacancy: {
      connect: {
        id: vacancyId,
      },
    },
    semesterBreakFrom: data.semesterBreakFrom
      ? new Date(data.semesterBreakFrom)
      : undefined,
    semesterBreakTo: data.semesterBreakTo
      ? new Date(data.semesterBreakTo)
      : undefined,
    documents: {
      createMany: {
        data: documents.map((input, index) => ({
          id: generateRandomString(32),
          type: input.docType,
          s3ObjectId: s3ObjectInputs[index]!.id,
        })),
      },
    },
    status: ApplicationStatus.USER_SUBMITTED,
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
      type: "INTERNAL_SERVER_ERROR" as const,
      message: "Failed to create application.",
    };
  }

  return {
    success: true,
    type: "APPLICATION_CREATED" as const,
    message: "Application created successfully.",
  };
};
