import { faker } from "@faker-js/faker";
import { generateRandomString } from "better-auth/crypto";
import { Prisma, $Enums } from "db/client";

export const createApplications = async ({
  applicationIds,
  employeeIds,
  tx,
}: {
  applicationIds: string[];
  employeeIds: string[];
  tx: Prisma.TransactionClient;
}) => {
  const allS3Objects: Array<{
    id: string;
    key: string;
    type: $Enums.S3ObjectType;
  }> = [];

  const applicationDocumentsMap = new Map<
    string,
    Array<{
      id: string;
      key: string;
      type: $Enums.ApplicationDocumentType;
      s3ObjectId: string;
      s3DocType: $Enums.S3ObjectType;
    }>
  >();

  applicationIds.forEach((appId) => {
    const applicationDocuments = Object.entries(
      $Enums.ApplicationDocumentType
    ).map(([_, value]) => ({
      id: generateRandomString(32),
      key: faker.string.uuid(),
      type: value,
      s3ObjectId: generateRandomString(32),
      s3DocType: $Enums.S3ObjectType.DOCUMENT,
    }));

    applicationDocumentsMap.set(appId, applicationDocuments);

    allS3Objects.push(
      ...applicationDocuments.map((doc) => ({
        id: doc.s3ObjectId,
        key: doc.key,
        type: doc.s3DocType,
      }))
    );
  });

  await tx.s3Object.createMany({
    data: allS3Objects,
  });

  return Promise.all(
    applicationIds.map((appId, index) => {
      const applicationDocuments = applicationDocumentsMap.get(appId)!;

      return tx.application.create({
        data: {
          id: appId,
          type: $Enums.ApplicationType.STUDENT,
          status: faker.helpers.arrayElement(
            Object.values($Enums.ApplicationStatus)
          ),
          emergencyContactPhone: faker.phone.number(),
          emergencyContactName: faker.person.fullName(),
          allergies:
            faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.3,
            }) || null,
          canRideBike: faker.datatype.boolean(),
          clothingSize: faker.helpers.arrayElement([
            "XS",
            "S",
            "M",
            "L",
            "XL",
            "XXL",
          ]),
          driverLicense: faker.helpers.arrayElement([
            "A",
            "B",
            "C",
            "D",
            "NONE",
          ]),
          germanLevel: faker.helpers.arrayElement([
            "A1",
            "A2",
            "B1",
            "B2",
            "C1",
            "C2",
          ]),
          healthRestrictions:
            faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.2,
            }) || null,

          otherLanguages: faker.helpers.maybe(
            () =>
              faker.helpers
                .arrayElements([
                  "Spanish",
                  "French",
                  "Italian",
                  "Russian",
                  "Chinese",
                  "Japanese",
                ])
                .join(", "),
            { probability: 0.4 }
          ),
          shiftWork: faker.helpers.maybe(() => faker.datatype.boolean(), {
            probability: 0.5,
          }),
          shoeSize: faker.helpers.maybe(
            () => faker.number.int({ min: 35, max: 48 }).toString(),
            { probability: 0.8 }
          ),
          previousStayPlace: faker.helpers.maybe(() => faker.location.city(), {
            probability: 0.3,
          }),
          previousStayPeriodFrom: faker.helpers.maybe(
            () => faker.date.past({ years: 5 }),
            { probability: 0.3 }
          ),
          previousStayPeriodTo: faker.helpers.maybe(
            () => faker.date.past({ years: 3 }),
            { probability: 0.3 }
          ),
          employee: {
            connect: { id: employeeIds[index] },
          },
          hasBeenInGermanyBefore: faker.datatype.boolean(),
          semesterBreakFrom: faker.helpers.maybe(
            () => faker.date.future({ years: 1 }),
            { probability: 0.4 }
          ),
          semesterBreakTo: faker.helpers.maybe(
            () => faker.date.future({ years: 1 }),
            { probability: 0.4 }
          ),
          studySubject: faker.helpers.maybe(() => faker.lorem.words(3), {
            probability: 0.5,
          }),
          university: faker.helpers.maybe(
            () => faker.company.name() + " University",
            { probability: 0.5 }
          ),
          documents: {
            createMany: {
              data: applicationDocuments.map((doc) => ({
                id: doc.id,
                type: doc.type,
                s3ObjectId: doc.s3ObjectId,
              })),
            },
          },
        } satisfies Prisma.ApplicationCreateInput,
      });
    })
  );
};
