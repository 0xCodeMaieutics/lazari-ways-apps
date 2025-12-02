import z from "zod";

const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const isImageFile = (errorMsg: string) =>
  z.instanceof(File).refine((file) => acceptedImageTypes.includes(file.type), {
    message: errorMsg,
  });

export const newVacancyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  photo: isImageFile("Only PNG and JPEG files are allowed").optional(),
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

export type NewVacancyFormData = z.infer<typeof newVacancyFormSchema>;
