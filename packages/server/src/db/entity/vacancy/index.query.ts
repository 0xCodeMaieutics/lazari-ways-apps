import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client";
import { Prisma } from "../../generated/prisma";

export type GetVacancies = Prisma.VacancyGetPayload<{
  select: {
    id: true;
    location: true;
    description: true;
    createdAt: true;
    imageUrl: true;
    title: true;
    employmentType: true;
    priceMax: true;
    priceMin: true;
    requirements: true;
    benefits: true;
    vacancyId: true;
    // NOTE: might not need this since title
    vacancyName: true;
    startDate: true;
  };
}>[];

export type GetVacancyById = Prisma.VacancyGetPayload<{
  select: {
    id: true;
    location: true;
    description: true;
    createdAt: true;
    imageUrl: true;
    title: true;
    employmentType: true;
    priceMax: true;
    priceMin: true;
    requirements: true;
    benefits: true;
    vacancyId: true;
    // NOTE: might not need this since title
    vacancyName: true;
    startDate: true;
  };
}> | null;

export const vacancyQueries = {
  getVacancies: async () =>
    (
      await tryCatchAsync(
        () =>
          prisma.vacancy.findMany({
            select: {
              id: true,
              location: true,
              description: true,
              createdAt: true,
              imageUrl: true,
              title: true,
              employmentType: true,
              priceMax: true,
              priceMin: true,
              requirements: true,
              benefits: true,
              vacancyId: true,
              // NOTE: might not need this since title
              vacancyName: true,
              startDate: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          }) satisfies Promise<GetVacancies>
      )
    ).mapErr((err) => ({
      type: "DB_GET_VACANCIES_ERROR" as const,
      message: "Failed to get vacancies",
    })),
  getVacancyById: (vacancyId: string) =>
    tryCatchAsync(
      () =>
        prisma.vacancy.findUnique({
          where: {
            id: vacancyId,
          },
          select: {
            id: true,
            location: true,
            description: true,
            createdAt: true,
            imageUrl: true,
            title: true,
            employmentType: true,
            priceMax: true,
            priceMin: true,
            requirements: true,
            benefits: true,
            vacancyId: true,
            // NOTE: might not need this since title
            vacancyName: true,
            startDate: true,
          },
        }) satisfies Promise<GetVacancyById>
    ),
};
