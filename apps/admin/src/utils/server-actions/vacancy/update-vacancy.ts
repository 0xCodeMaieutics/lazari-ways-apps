"use server";
import { VacancyFormData } from "@/app/(auth)/vacancies/[vacancyId]/schema";
import { vacancyQueries } from "@workspace/server/db";

export const updateVacancy = async ({
  id,
  data,
}: {
  id: string;
  data: VacancyFormData;
}) => {
  const result = await vacancyQueries.updateVacancy({
    id: id,
    data: {
      title: data.title,
      availableTo: data.availableTo || null,
      languageLevel: data.languageLevel || null,
      additionalInfo: data.additionalInfo || null,
      accommodation: data.accommodation,
      acceptableApplicationTypes: [], // FIXME: add this field to the form
      beginDate: data.beginDate,
      duration: data.duration,
      hide: data.hide,
      jobDescription: data.jobDescription,
      location: data.location,
      meals: data.meals,
      salary: data.salary,
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
