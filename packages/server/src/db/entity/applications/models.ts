import {
  ApplicationStatus as ApplicationStatusEnum,
  ApplicationType as ApplicationTypeEnum,
  ApplicationDocumentType,
} from "../../generated/prisma/enums.js";

export const ApplicationStatus = ApplicationStatusEnum;
export type ApplicationStatus = ApplicationStatusEnum;
export const ApplicationType = ApplicationTypeEnum;
export type ApplicationType = ApplicationTypeEnum;

export const ApplicationDocument = {
  CERTIFICATE_OF_ENROLLMENT: ApplicationDocumentType.CERTIFICATE_OF_ENROLLMENT,
  LANGUAGE_CERTIFICATE: ApplicationDocumentType.LANGUAGE_CERTIFICATE,
  PASSPORT: ApplicationDocumentType.PASSPORT,
  STUDY_CERTIFICATE: ApplicationDocumentType.STUDY_CERTIFICATE,
};

export type ApplicationDocument = ApplicationDocumentType;

export type Application = {
  type: ApplicationType;
  status: ApplicationStatus;
  university?: string | null;
  studySubject?: string | null;
  semesterBreakFrom?: Date | null;
  semesterBreakTo?: Date | null;
  studyCertificateKey?: string | null;
  certificateOfEnrollmentKey?: string | null;
  passportKey: string;
  languageCertificateKey?: string | null;
  employeeId: string;
};
