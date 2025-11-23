import z from "zod";

const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const isImageFile = (errorMsg: string) =>
  z.instanceof(File).refine((file) => acceptedImageTypes.includes(file.type), {
    message: errorMsg,
  });

const isFilePDF = (errorMsg: string) =>
  z.instanceof(File).refine((file) => file.type === "application/pdf", {
    message: errorMsg,
  });

const germanLevels = z.enum(["A1", "A2", "B1", "B2", "C1"]);

export const applicationFormSchema = z.object({
  // Agentur Information
  agencyName: z.string().min(1, "Name der Agentur ist erforderlich"),
  agencyAddress: z.string().min(1, "Anschrift der Agentur ist erforderlich"),

  // Study Information
  semesterBreakFrom: z.string().optional(),
  semesterBreakTo: z.string().optional(),
  university: z.string().optional(),
  studySubject: z.string().optional(),
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
  previousStayInGermany: z.enum(["Ja", "Nein"]).optional(),
  previousStayPlace: z.string().optional(),
  previousStayPeriodFrom: z.string().optional(),
  previousStayPeriodTo: z.string().optional(),

  // Contact Information
  taxId: z.string().optional(),
  phone: z.string().min(1, "Telefonnummer ist erforderlich"),
  email: z.email("Gültige E-Mail-Adresse erforderlich"),
  instagram: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z
    .string()
    .min(1, "Notfall-Kontaktperson ist erforderlich"),
  emergencyPhone: z.string().min(1, "Notfall-Telefonnummer ist erforderlich"),

  // File Uploads
  foto: isImageFile("Nur PNG und JPEG Dateien sind erlaubt"),
  passport: isFilePDF("Nur PDF Dateien sind erlaubt").optional(),
  languageCertificate: isFilePDF("Nur PDF Dateien sind erlaubt").optional(),
  studyCertificate: isFilePDF("Nur PDF Dateien sind erlaubt").optional(),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
