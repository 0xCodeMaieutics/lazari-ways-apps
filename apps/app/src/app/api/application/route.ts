import { env } from "@/env";
import { applicationQueries, generateRandomString } from "@workspace/server/db";
import { putObjects } from "@workspace/file-upload/s3-client";
import { getImageExtension, ImageFileType } from "@/utils/file";
import { applicationFormSchema } from "@/utils/models/applications";
import { ApplicationType } from "@workspace/server/db/models";

const APPLICATIONS = "applications";

export const POST = async (request: Request) => {
  const formData = await request.formData();

  const type = formData.get("type") as ApplicationType;
  const userId = formData.get("userId") as string;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!type) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const foundApplicationResult =
    await applicationQueries.getApplicationByType(type);

  if (foundApplicationResult.isErr()) {
    return new Response("Internal Server Error", { status: 500 });
  }
  const foundApplication = foundApplicationResult.value;
  if (foundApplication) {
    return new Response("Application already exists", { status: 409 });
  }

  const result = applicationFormSchema.safeParse({
    birthDate: formData.get("birthDate"),
    birthPlace: formData.get("birthPlace"),
    birthCountry: formData.get("birthCountry"),
    street: formData.get("street"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    country: formData.get("country"),

    agencyName: formData.get("agencyName"),
    agencyAddress: formData.get("agencyAddress"),

    semesterBreakFrom: formData.get("semesterBreakFrom") ?? undefined,
    semesterBreakTo: formData.get("semesterBreakTo") ?? undefined,
    university: formData.get("university"),
    studySubject: formData.get("studySubject"),
    germanLevel: formData.get("germanLevel"),
    otherLanguages: formData.get("otherLanguages"),
    driverLicense: formData.get("driverLicense"),
    canRideBike: formData.get("canRideBike") === "true" ? true : false,
    shiftWork: formData.get("shiftWork") === "true" ? true : false,
    healthRestrictions: formData.get("healthRestrictions"),
    allergies: formData.get("allergies"),
    clothingSize: formData.get("clothingSize"),
    shoeSize: formData.get("shoeSize"),

    previousStayInGermany: formData.get("previousStayInGermany"),
    previousStayPlace: formData.get("previousStayPlace"),
    previousStayPeriodFrom: formData.get("previousStayPeriodFrom") ?? undefined,
    previousStayPeriodTo: formData.get("previousStayPeriodTo") ?? undefined,

    taxId: formData.get("taxId"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    instagram: formData.get("instagram"),

    emergencyContactName: formData.get("emergencyContactName"),
    emergencyPhone: formData.get("emergencyPhone"),

    foto: formData.get("foto"),
    passport: formData.get("passport") ?? undefined,
    studyCertificate: formData.get("studyCertificate") ?? undefined,
    languageCertificate: formData.get("languageCertificate") ?? undefined,
  });

  try {
    if (!result.success || !type) {
      throw new Error("Bad request");
    }

    const applicationId = generateRandomString(32);

    const constructPath = (key: string, type: ImageFileType) =>
      `${APPLICATIONS}/${applicationId}/${key}.${getImageExtension(type)}`;

    const bodies: Array<{ body: File; key: string }> = [
      { body: result.data.foto, key: "foto" },
      { body: result.data.passport, key: "passport" },
      { body: result.data.studyCertificate, key: "studyCertificate" },
      { body: result.data.languageCertificate, key: "languageCertificate" },
    ].filter(({ body }) => body !== undefined) as Array<{
      body: File;
      key: string;
    }>;
    const putObjectsResult = await putObjects({
      bodies: bodies.map((b) => b.body),
      keys: bodies.map((b) =>
        constructPath(b.key, b.body.type as ImageFileType)
      ),
      contentTypes: bodies.map((b) => b.body.type),
      bucketName: env.S3_BUCKET_NAME,
    });

    if (putObjectsResult.isErr()) {
      throw new Error("Failed to upload files");
    }

    const uploadedKeys = bodies.map((b) => b.key);

    const createdApplicationResult = await applicationQueries.createApplication(
      {
        id: applicationId,
        type,
        user: {
          connect: {
            id: userId,
          },
        },
        // Agency
        agencyName: result.data.agencyName,
        agencyAddress: result.data.agencyAddress,
        // Study Information
        germanLevel: result.data.germanLevel,
        otherLanguages: result.data.otherLanguages,
        driverLicense: result.data.driverLicense,
        canRideBike: result.data.canRideBike,
        shiftWork: result.data.shiftWork,
        healthRestrictions: result.data.healthRestrictions,
        allergies: result.data.allergies,
        clothingSize: result.data.clothingSize,
        shoeSize: result.data.shoeSize,
        // Previous stay in Germany
        hasBeenInCountryBefore: result.data.previousStayInGermany === "Ja",
        previousStayCountry: "Germany",
        previousStayPlace: result.data.previousStayPlace,
        previousStayPeriodFrom: result.data.previousStayPeriodFrom
          ? new Date(result.data.previousStayPeriodFrom)
          : null,
        previousStayPeriodTo: result.data.previousStayPeriodTo
          ? new Date(result.data.previousStayPeriodTo)
          : null,
        // Contact Information
        taxId: result.data.taxId,
        phone: result.data.phone,
        email: result.data.email,
        instagram: result.data.instagram,
        // Emergency Contact
        emergencyContactName: result.data.emergencyContactName,
        emergencyContactPhone: result.data.emergencyPhone,
        // File Uploads
        fotoKey: constructPath("foto", result.data.foto.type as ImageFileType),
        passportKey: uploadedKeys.includes("passport")
          ? constructPath(
              "passport",
              result.data.passport?.type as ImageFileType
            )
          : "",
        studyCertificateKey: uploadedKeys.includes("studyCertificate")
          ? constructPath(
              "studyCertificate",
              result.data.studyCertificate?.type as ImageFileType
            )
          : null,
        languageCertificateKey: uploadedKeys.includes("languageCertificate")
          ? constructPath(
              "languageCertificate",
              result.data.languageCertificate?.type as ImageFileType
            )
          : null,
      }
    );

    if (createdApplicationResult.isErr()) {
      throw createdApplicationResult.error;
    }
    return new Response("ok", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
