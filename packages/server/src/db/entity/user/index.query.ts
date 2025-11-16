import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client";
import { Prisma } from "@prisma/client";

export type GetUser = Prisma.UserGetPayload<{}>;

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
