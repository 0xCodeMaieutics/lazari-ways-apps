import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client";
import { Prisma } from "../../generated/prisma/client";

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
