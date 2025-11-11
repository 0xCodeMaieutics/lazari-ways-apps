import { $Enums, Prisma } from "../../generated/client";

export type Application = Prisma.ApplicationGetPayload<{
  select: {
    id: true;
    type: true;
    firstName: true;
    lastName: true;
    email: true;
    instagram: true;
    phone: true;
    status: true;
  };
}>;

export const ApplicationStatus = $Enums.ApplicationStatus;
export type ApplicationStatus = typeof $Enums.ApplicationStatus;
export type ApplicationStatusKey = keyof typeof ApplicationStatus;

export const ApplicationType = $Enums.ApplicationType;
export type ApplicationType = typeof $Enums.ApplicationType;
export type ApplicationTypeKey = keyof typeof ApplicationType;
