import { Gender } from "@workspace/server/db/models";
import * as z from "zod";

const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const isImageFile = (errorMsg: string) =>
  z.instanceof(File).refine((file) => acceptedImageTypes.includes(file.type), {
    message: errorMsg,
  });

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  gender: z.enum(Gender, {
    message: "Geschlecht ist erforderlich",
  }),
  nationality: z.string().min(1, "Staatsangehörigkeit ist erforderlich"),
  birthDate: z.string().min(1, "Geburtsdatum ist erforderlich"),
  birthPlace: z.string().min(1, "Geburtsort ist erforderlich"),
  birthCountry: z.string().min(1, "Geburtsland ist erforderlich"),
  street: z.string().min(1, "Straße und Hausnummer sind erforderlich"),
  postalCode: z.string().min(1, "Postleitzahl ist erforderlich"),
  city: z.string().min(1, "Stadt ist erforderlich"),
  country: z.string().min(1, "Land ist erforderlich"),
  phone: z
    .string()
    .refine(
      (val) =>
        val.trim() === "" ||
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(
          val.trim()
        ),
      "Ungültiges Telefonnummernformat"
    )
    .optional(),
  instagram: z
    .string()
    .refine(
      (val) => val.trim() === "" || /^[\w\.]+$/.test(val.trim()),
      "Ungültiges Instagram-Format (nur Benutzername ohne @)"
    )
    .optional(),
  facebook: z
    .string()
    .refine(
      (val) => val.trim() === "" || /^[\w\.]+$/.test(val.trim()),
      "Ungültiges Facebook-Format (nur Benutzername oder Profilname)"
    )
    .optional(),
  taxId: z.string().optional(),
  foto: isImageFile("Nur PNG und JPEG Dateien sind erlaubt").optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
