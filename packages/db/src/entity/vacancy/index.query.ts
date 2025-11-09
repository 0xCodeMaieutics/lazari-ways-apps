import { prisma } from "../../client";
import { Prisma } from "../../generated/client";

export type GetVacancies = Prisma.VacancyGetPayload<{
  select: {
    id: true;
    description: true;
    createdAt: true;
    imageUrl: true;
    title: true;
    employmentType: true;
    priceMax: true;
    priceMin: true;
  };
}>[];

export const vacancyQueries = {
  getVacancies: () =>
    prisma.vacancy.findMany({
      select: {
        id: true,
        description: true,
        createdAt: true,
        imageUrl: true,
        title: true,
        employmentType: true,
        priceMax: true,
        priceMin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) satisfies Promise<GetVacancies>,
};
