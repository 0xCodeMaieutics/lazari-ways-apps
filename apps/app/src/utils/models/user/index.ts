import { $Enums } from "@prisma/client";

export const userSettingsLangToLocale: Record<$Enums.Lang, string> = {
  DE: "de-DE",
  EN: "en-US",
  GE: "ka-GE",
};

type UserRoleKey = keyof typeof $Enums.UserRole;
export type UserRole = $Enums.UserRole;
export const UserRole: Record<UserRoleKey, UserRole> = {
  ADMIN: $Enums.UserRole.ADMIN,
  USER: $Enums.UserRole.USER,
};
