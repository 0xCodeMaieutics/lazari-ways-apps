import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

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
