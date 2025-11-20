import * as z from "zod";

export const adminLoginFormSchema = z.object({
  email: z.email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  password: z.string().min(1, "Bitte geben Sie Ihr Passwort ein"),
});
