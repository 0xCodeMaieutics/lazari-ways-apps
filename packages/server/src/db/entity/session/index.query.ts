import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

export type GetSession = Prisma.SessionGetPayload<{}>;

export type CreateSessionInput = Prisma.SessionCreateInput;

export const sessionQueries = {
  getSessionByToken: (token: string) =>
    tryCatchAsync(
      () =>
        prisma.session.findUnique({
          where: {
            token,
          },
        }) satisfies Promise<GetSession | null>
    ),

  createSession: (data: CreateSessionInput) =>
    tryCatchAsync(
      () =>
        prisma.session.create({
          data,
        }) satisfies Promise<GetSession>
    ),
};
