"use server";
import { vacancyQueries } from "@workspace/server/db";

export const updateVacancyHide = async ({
  id,
  hide,
}: {
  id: string;
  hide: boolean;
}) => {
  const result = await vacancyQueries.updateVacancy({
    id: id,
    data: {
      hide,
    },
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
