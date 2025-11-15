import { tryCatchAsync } from "@workspace/shared";
import { prisma } from "../../client";
import { Prisma } from "../../generated/prisma/client";

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
    schedule: true;
    additionalInfo: true;
    photos: true;
    videos: true;
    reviews: true;
    hide: true;
  };
}>;

export const vacancyQueries = {
  getVacancies: async (where?: Prisma.VacancyWhereInput) =>
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
              schedule: true,
              additionalInfo: true,
              photos: true,
              videos: true,
              reviews: true,
              hide: true,
            },
            where,
            orderBy: {
              createdAt: "desc",
            },
          }) satisfies Promise<Vacancy[]>
      )
    ).mapErr((err) => {
      console.log(err);

      return {
        type: "DB_GET_VACANCIES_ERROR" as const,
        message: "Failed to get vacancies",
      };
    }),
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
            additionalInfo: true,
            duration: true,
            meals: true,
            salary: true,
            schedule: true,
            photos: true,
            videos: true,
            hide: true,
          },
        }) satisfies Promise<Vacancy | null>
    ),
};
