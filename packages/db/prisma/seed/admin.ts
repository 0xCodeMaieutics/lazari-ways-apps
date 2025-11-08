import { Prisma, $Enums } from "../../src/generated/client";

import { generateRandomString } from "../../src/lib/random";
import { faker } from "@faker-js/faker";
import { encrypt } from "../../src/utils/encrypt";
const email = "anna@application.com";
const password = "#AdminIsCool2025";

export const createAdmin = (tx: Prisma.TransactionClient) =>
  tx.user.create({
    data: {
      id: generateRandomString(32),
      email,
      name: "Anna Admin",
      emailVerified: faker.datatype.boolean(),
      role: $Enums.UserRole.ADMIN,
      sessions: {
        create: {
          id: generateRandomString(32),
          expiresAt: new Date("2099-12-31T23:59:59.999Z"),
          token: generateRandomString(64),
        },
      },
      userSettings: {
        create: {
          id: generateRandomString(32),
        },
      },
      accounts: {
        create: {
          id: generateRandomString(32),
          accountId: generateRandomString(32),
          providerId: "credential",
          password: encrypt(password, process.env.ENCRYPTION_KEY!),
        },
      },
    },
  });
