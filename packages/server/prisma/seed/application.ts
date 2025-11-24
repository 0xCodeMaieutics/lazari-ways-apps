import { faker } from "@faker-js/faker";
import { Prisma, $Enums } from "db/client";

export const createApplications = ({
  applicationIds,
  employerIds,
  tx,
}: {
  applicationIds: string[];
  employerIds: string[];
  tx: Prisma.TransactionClient;
}) =>
  Promise.all(
    applicationIds.map((appId, index) =>
      tx.application.create({
        data: {
          id: appId,
          type: $Enums.ApplicationType.STUDENT,
          status: faker.helpers.arrayElement(
            Object.values($Enums.ApplicationStatus)
          ),
          emergencyContactPhone: faker.phone.number(),
          emergencyContactName: faker.person.fullName(),
          passportKey:
            "applications/YyVNlWI8H2CiH6X5-TKO9hGFV3Of1eJV/passport.png",
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
          languageCertificateKey:
            "applications/YyVNlWI8H2CiH6X5-TKO9hGFV3Of1eJV/language_certificate.png",
          studyCertificateKey: faker.helpers.maybe(
            () =>
              "applications/YyVNlWI8H2CiH6X5-TKO9hGFV3Of1eJV/study_certificate.png",
            { probability: 0.6 }
          ),
          employee: {
            connect: { id: employerIds[index] },
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
          certificateOfEnrollmentKey: faker.helpers.maybe(
            () =>
              "applications/YyVNlWI8H2CiH6X5-TKO9hGFV3Of1eJV/certificate_of_enrollment.png",
            { probability: 0.5 }
          ),
        } satisfies Prisma.ApplicationCreateInput,
      })
    )
  );
