import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { generateRandomString } from "@workspace/shared/lib/random";

export type GetUser = Prisma.UserGetPayload<{}>;
export type GetEmployee = Prisma.EmployeeGetPayload<{}>;
export type GetUserProfile = Prisma.UserGetPayload<{
  include: {
    employee: true;
  };
}>;

export type UpdateUserInput = Prisma.UserUpdateInput;
export const userQueries = {
  getUserById: (id: string) =>
    tryCatchAsync(
      () =>
        prisma.user.findUnique({
          where: {
            id,
          },
        }) satisfies Promise<GetUser | null>
    ),
  getUserProfileById: (id: string) =>
    tryCatchAsync(
      () =>
        prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            employee: true,
          },
        }) satisfies Promise<GetUserProfile | null>
    ),

  updateUser: (id: string, data: UpdateUserInput) =>
    tryCatchAsync(
      () =>
        prisma.user.update({
          where: { id },
          data,
        }) satisfies Promise<GetUser>
    ),
  getUserByEmail: (email: string) =>
    tryCatchAsync(
      () =>
        prisma.user.findUnique({
          where: {
            email,
          },
        }) satisfies Promise<GetUser | null>
    ),

  createEmployeeFoto: ({
    id,
    fileKey,
    amzSignedUrlSearchParams,
  }: {
    id: string;
    fileKey: string;
    amzSignedUrlSearchParams: string;
  }) =>
    tryCatchAsync(
      () =>
        prisma.employee.update({
          where: {
            id,
          },
          data: {
            fotos: {
              create: {
                id: generateRandomString(32),
                key: fileKey,
                type: "IMAGE",
                amzSignedUrlSearchParams,
              },
            },
          },
        }) satisfies Promise<GetEmployee>
    ),
};
