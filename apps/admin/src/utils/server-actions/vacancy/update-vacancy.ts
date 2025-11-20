"use server";
import { VacancyUpdateInput, vacancyQueries } from "@workspace/server/db";

export const updateVacancy = async ({
  id,
  data,
}: {
  id: string;
  data: VacancyUpdateInput;
}) => {
  const result = await vacancyQueries.updateVacancy({
    id: id,
    data,
  });

  if (result.isErr()) {
    console.error(result.error);
    return {
      isSuccess: false,
    };
  }
  return {
    isSuccess: true,
  };
};
