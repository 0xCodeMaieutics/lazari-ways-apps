"use server";
import { vacancyQueries, type VacancyCreateInput } from "@workspace/server/db";
export const createVacancy = async (data: VacancyCreateInput) => {
  const result = await vacancyQueries.createVacancy(data);
  if (result.isErr()) {
    console.error(result.error);
    return {
      isSuccess: false,
    };
  }
  return {
    isSuccess: true,
    id: result.value.id,
  };
};
