import z from "zod";

const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const imageFile = (errorMsg: string) =>
  z.instanceof(File).refine((file) => acceptedImageTypes.includes(file.type), {
    message: errorMsg,
  });

const pdfFile = (errorMsg: string) =>
  z.instanceof(File).refine((file) => file.type === "application/pdf", {
    message: errorMsg,
  });

const germanLevels = z.enum(["A1", "A2", "B1", "B2", "C1"]);

export const applicationFormSchema = z.object({
  // University Application Fields
  university: z.string().optional(),
  studySubject: z.string().optional(),
  semesterBreakFrom: z.string().optional(),
  semesterBreakTo: z.string().optional(),
  studyCertificate: pdfFile("Nur PDF Dateien sind erlaubt").optional(),
  certificateOfEnrollment: pdfFile("Nur PDF Dateien sind erlaubt").optional(),

  germanLevel: germanLevels.optional(),
  otherLanguages: z.string().optional(),
  driverLicense: z.string().optional(),
  canRideBike: z.boolean().optional(),
  shiftWork: z.boolean().optional(),
  healthRestrictions: z.string().optional(),
  allergies: z.string().optional(),
  clothingSize: z.string().optional(),
  shoeSize: z.string().optional(),

  // Previous stay in Germany
  hasBeenInGermanyBefore: z.boolean().optional(),
  previousStayPlace: z.string().optional(),
  previousStayPeriodFrom: z.string().optional(),
  previousStayPeriodTo: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z
    .string()
    .min(1, "Notfall-Kontaktperson ist erforderlich"),
  emergencyPhone: z.string().min(1, "Notfall-Telefonnummer ist erforderlich"),

  // File Uploads
  passport: pdfFile("Nur PNG und JPEG Dateien sind erlaubt").optional(),
  languageCertificate: pdfFile("Nur PDF Dateien sind erlaubt").optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
