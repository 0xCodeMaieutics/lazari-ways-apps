import { encrypt } from "../../src/utils/encrypt";
import { generateRandomString } from "../../src/lib/random";
import { faker } from "@faker-js/faker";
import { Prisma, $Enums } from "../../src/generated/client";

export const createUsers = async ({
  tx,
  userIds,
}: {
  tx: Prisma.TransactionClient;
  userIds: string[];
}) => {
  const emails = Array.from({ length: userIds.length }).map(() =>
    faker.internet.email()
  );
  const passwords = Array.from({ length: userIds.length }).map(() =>
    faker.internet.password({
      length: 12,
    })
  );

  // logs out first 3 users' credentials for testing purposes
  for (let i = 0; i < 3; i++) {
    console.log(
      `🧪 Test User ${i + 1}: Email: ${emails[i]}, Password: ${passwords[i]}`
    );
  }

  return Promise.all(
    userIds.map((id, index) =>
      tx.user.create({
        data: {
          id,
          email: emails[index] ?? "",
          name: faker.person.fullName(),
          role: $Enums.UserRole.USER,
          image: faker.image.avatar(),
          userSettings: {
            create: {
              id: generateRandomString(32),
            },
          },
          userInformation: {
            create: {
              id: generateRandomString(32),
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              birthCountry: faker.location.country(),
              birthDate: faker.date.birthdate({
                min: 18,
                max: 45,
                mode: "age",
              }),
              city: faker.location.city(),
              birthPlace: faker.location.city(),
              country: faker.location.country(),
              gender: faker.helpers.arrayElement(Object.values($Enums.Gender)),
              nationality: faker.location.country(),
              postalCode: faker.location.zipCode(),
              street: faker.location.streetAddress(),
            },
          },
          sessions: {
            create: {
              id: generateRandomString(32),
              expiresAt: new Date("2099-12-31T23:59:59.999Z"),
              token: generateRandomString(64),
            },
          },
          accounts: {
            create: {
              id: generateRandomString(32),
              accountId: generateRandomString(32),
              providerId: "credential",
              password: encrypt(
                passwords[index] ?? "",
                process.env.ENCRYPTION_KEY!
              ),
            },
          },
        },
      })
    )
  );
};
