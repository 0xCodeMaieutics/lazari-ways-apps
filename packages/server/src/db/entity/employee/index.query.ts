import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

export type GetEmployee = Prisma.EmployeeGetPayload<{}>;
export const employeeQueries = {
  getEmployeeByUserId: (id: string) =>
    tryCatchAsync(
      () =>
        prisma.employee.findUnique({
          where: {
            userId: id,
          },
        }) satisfies Promise<GetEmployee | null>
    ),
};
