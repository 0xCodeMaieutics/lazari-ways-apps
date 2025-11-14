import { prisma } from "../../client";
import { Prisma } from "../../generated/prisma/client";

export type GetAllUserApplications = Prisma.ApplicationGetPayload<{
  select: {
    id: true;
    status: true;
    type: true;
    createdAt: true;
  };
}>[];

export const applicationQueries = {
  getAllUserApplications: (userId: string) =>
    prisma.application.findMany({
      select: {
        id: true,
        status: true,
        type: true,
        createdAt: true,
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) satisfies Promise<GetAllUserApplications>,
};
