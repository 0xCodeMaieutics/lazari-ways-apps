import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

export type GetUser = Prisma.UserGetPayload<{}>;
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
};
