import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";

export type Vacancy = Prisma.VacancyGetPayload<{
  select: {
    id: true;
    location: true;
    createdAt: true;
    title: true;
    vacancyId: true;
    jobDescription: true;
    beginDate: true;
    accommodation: true;
    duration: true;
    meals: true;
    salary: true;
    availableTo: true;
    schedule: true;
    additionalInfo: true;
    languageLevel: true;
    photos: true;
    videos: true;
    reviews: true;
    hide: true;
  };
}>;

export type VacancyWhereInput = Prisma.VacancyWhereInput;
export type VacancyUpdateInput = Prisma.VacancyUpdateInput;
export type VacancyOrderByWithRelationInput =
  Prisma.VacancyOrderByWithRelationInput;

export const vacancyQueries = {
  getVacancies: async (
    where?: VacancyWhereInput,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: VacancyOrderByWithRelationInput;
    }
  ) =>
    (
      await tryCatchAsync(
        () =>
          prisma.vacancy.findMany({
            select: {
              id: true,
              location: true,
              createdAt: true,
              title: true,
              vacancyId: true,
              jobDescription: true,
              beginDate: true,
              accommodation: true,
              duration: true,
              meals: true,
              salary: true,
              availableTo: true,
              schedule: true,
              languageLevel: true,
              additionalInfo: true,
              photos: true,
              videos: true,
              reviews: true,
              hide: true,
            },
            where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy,
          }) satisfies Promise<Vacancy[]>
      )
    ).mapErr((err) => {
      console.log(err);

      return {
        type: "DB_GET_VACANCIES_ERROR" as const,
        message: "Failed to get vacancies",
      };
    }),
  getVacanciesCount: async (where?: Prisma.VacancyWhereInput) =>
    (
      await tryCatchAsync(
        () =>
          prisma.vacancy.count({
            where,
          }) satisfies Promise<number>
      )
    ).mapErr((err) => {
      console.log(err);

      return {
        type: "DB_GET_VACANCIES_COUNT_ERROR" as const,
        message: "Failed to get vacancies count",
      };
    }),

  updateVacancy: ({ id, data }: { id: string; data: VacancyUpdateInput }) =>
    tryCatchAsync(() =>
      prisma.vacancy.update({
        where: { id },
        data,
      })
    ),
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
            createdAt: true,
            title: true,
            vacancyId: true,
            jobDescription: true,
            beginDate: true,
            accommodation: true,
            reviews: true,
            availableTo: true,
            additionalInfo: true,
            duration: true,
            meals: true,
            salary: true,
            languageLevel: true,
            schedule: true,
            photos: true,
            videos: true,
            hide: true,
          },
        }) satisfies Promise<Vacancy | null>
    ),
};
