import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { ApplicationType } from "./models.js";

export type ApplicationWhereInput = Prisma.ApplicationWhereInput;

export type ApplicationUpdateInput = Prisma.ApplicationUpdateInput;

export type GetApplication = Prisma.ApplicationGetPayload<{
  include: {
    employee: true;
  };
}>;

export type GetApplicationByType = Prisma.ApplicationGetPayload<{}>;

export type GetApplications = Prisma.ApplicationGetPayload<{
  include: {
    employee: {
      include: {
        user: true;
      };
    };
  };
}>;

export type ApplicationCreateInput = Prisma.ApplicationCreateInput;

export const applicationQueries = {
  getApplication: (applicationId: string) =>
    tryCatchAsync(
      () =>
        prisma.application.findUnique({
          where: { id: applicationId },
          include: {
            employee: true,
          },
        }) satisfies Promise<GetApplication | null>
    ),
  getEmployeeApplicationByType: ({
    employeeId,
    type,
  }: {
    employeeId: string;
    type: ApplicationType;
  }) =>
    tryCatchAsync(
      () =>
        prisma.application.findFirst({
          where: { employeeId, type },
        }) satisfies Promise<GetApplicationByType | null>
    ),
  getApplications: (
    where?: ApplicationWhereInput,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: Prisma.ApplicationOrderByWithRelationInput;
    }
  ) => {
    const { skip, take, orderBy = { createdAt: "desc" } } = options || {};
    return tryCatchAsync(
      () =>
        prisma.application.findMany({
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
          where,
          skip,
          take,
          orderBy,
        }) satisfies Promise<GetApplications[] | null>
    );
  },
  getApplicationsCount: (where?: ApplicationWhereInput) =>
    tryCatchAsync(() =>
      prisma.application.count({
        where,
      })
    ),

  updateApplication: (applicationId: string, data: ApplicationUpdateInput) =>
    tryCatchAsync(() =>
      prisma.application.update({
        where: { id: applicationId },
        data,
      })
    ),
  createApplication: (data: ApplicationCreateInput) =>
    tryCatchAsync(() =>
      prisma.application.create({
        data,
      })
    ),
};
