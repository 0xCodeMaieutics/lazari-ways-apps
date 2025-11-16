import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client";
import { Prisma } from "@prisma/client";

export type GetAccountByUserId = Prisma.AccountGetPayload<{}>;

export const accountQueries = {
  getAccountById: (userId: string) =>
    tryCatchAsync(
      () =>
        prisma.account.findFirst({
          where: {
            userId,
            providerId: "credential",
          },
        }) satisfies Promise<GetAccountByUserId | null>
    ),
};
