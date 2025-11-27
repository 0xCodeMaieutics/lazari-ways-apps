import z from "zod";

export const vacancyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  beginDate: z.string().min(1, "Begin date is required"),
  duration: z.string().min(1, "Duration is required"),
  salary: z.string().min(1, "Salary is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  schedule: z.string().min(1, "Schedule is required"),
  accommodation: z.string().min(1, "Accommodation information is required"),
  meals: z.string().min(1, "Meals information is required"),
  availableTo: z.string().nullable().optional(),
  languageLevel: z.string().nullable().optional(),
  additionalInfo: z.string().nullable().optional(),
  hide: z.boolean().nullable().optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export type VacancyFormData = z.infer<typeof vacancyFormSchema>;
