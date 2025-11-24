import {
  ApplicationStatus as ApplicationStatusEnum,
  ApplicationType as ApplicationTypeEnum,
} from "../../generated/prisma/enums.js";

export const ApplicationStatus = ApplicationStatusEnum;
export type ApplicationStatus = ApplicationStatusEnum;
export const ApplicationType = ApplicationTypeEnum;
export type ApplicationType = ApplicationTypeEnum;

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
