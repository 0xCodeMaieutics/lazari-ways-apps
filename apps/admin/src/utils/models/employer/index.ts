import { $Enums } from "@prisma/client";

type EmployerTypeKey = keyof typeof $Enums.EmployerType;
export const EmployerType: Record<EmployerTypeKey, $Enums.EmployerType> = {
  DHL: $Enums.EmployerType.DHL,
  FILDER_PERSONAL: $Enums.EmployerType.FILDER_PERSONAL,
  GUILI: $Enums.EmployerType.GUILI,
};
