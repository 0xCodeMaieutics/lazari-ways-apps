export { prisma } from "./client";
export { PrismaClient } from "./generated/client";
export { auth } from "./auth";
export { generateRandomString } from "@workspace/shared";
export { decrypt, encrypt } from "./utils/encrypt";
export {
  type Application,
  ApplicationStatus,
  type ApplicationStatusKey,
  ApplicationType,
  type ApplicationTypeKey,
  type GetAllUserApplications,
  applicationQueries,
} from "./entity/applications";
export {
  type EmploymentTypeKey,
  type GetVacancies,
  type GetVacancyById,
  vacancyQueries,
} from "./entity/vacancy";

/**
 * Task: rename this repo to server and split the exports in two components:
 * 1. auth
 * 2. db
 *
 */
