import { generateRandomString } from "@workspace/shared/lib/random";
import { prisma } from "../src/db/client.js";
import { employeeQueries } from "../src/db/entity/employee/index.query.js";
import {
  UpdateUserInput,
  userQueries,
} from "../src/db/entity/user/index.query.js";
import { auth } from "../src/auth/auth.js";
import { test, expect, describe, beforeAll } from "vitest";
import { getSignedUrlForDownload } from "@workspace/file-upload/s3-client";
import { Gender } from "../src/db/generated/prisma/enums.js";
import { zodParse } from "@workspace/shared/error-handling/index";
import z from "zod";

describe("employeeQueries", () => {
  let userId: string | null = null;
  let employeeId: string | null = null;

  beforeAll(async () => {
    const result = zodParse(
      process.env,
      z.object({ S3_BUCKET_NAME: z.string() })
    );
    if (result.isErr()) {
      throw new Error("Missing S3_BUCKET_NAME env variable");
    }
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email: "applicant@lazaryways.eu",
        name: "Anna Malazonia",
        password: "#ApplicantIsCool2025!",
      },
    });

    userId = signUpResponse.user.id;

    const updateUserData = {
      firstName: "Anna",
      lastName: "Malazonia",
      birthCountry: "Italy",
      birthDate: new Date("01-01-1998").toISOString(),
      birthPlace: "Rome",
      country: "Italy",
      gender: Gender.DIVERSE,
      city: "Rome",
      nationality: "Italian",
      postalCode: "00100",
      street: "Via Roma 1",
      // TODO: missing these
      phone: "",
      facebook: "",
      instagram: "",
      taxId: "",
    } satisfies Omit<
      NonNullable<NonNullable<UpdateUserInput["employee"]>["upsert"]>["create"],
      "id"
    >;

    employeeId = generateRandomString(32);
    await userQueries.updateUser(userId, {
      employee: {
        upsert: {
          create: {
            id: employeeId,
            ...updateUserData,
          },
          update: updateUserData,
          where: {
            userId,
          },
        },
      },
    });
  });

  test("employeeQueries.getEmployeeFoto without re-signing the url", async () => {
    const fileKey = "fake-key";
    const signedUrl = await getSignedUrlForDownload({
      bucket: process.env.S3_BUCKET_NAME!,
      fileKey,
      expiresInSeconds: 3600,
    });

    expect(signedUrl.isErr()).toBe(false);
    if (signedUrl.isErr()) return;

    const signedUrlSearchParams = new URLSearchParams(
      signedUrl.value.split("?")[1]
    );

    await userQueries.createEmployeeFoto({
      id: employeeId!,
      fileKey,
      amzSignedUrlSearchParams: signedUrlSearchParams.toString(),
    });

    const employeeQueryResult = await employeeQueries.getEmployeeFotoSignedUrl(
      employeeId!
    );
    expect(employeeQueryResult.isErr()).toBe(false);
    if (employeeQueryResult.isErr()) return;

    expect(employeeQueryResult.value.amzSignedUrlSearchParams).toBeDefined();
    const _searchParams2 = new URLSearchParams(
      employeeQueryResult.value.amzSignedUrlSearchParams!
    );
    expect(_searchParams2.has("X-Amz-Date")).toBe(true);
    expect(employeeQueryResult.value.amzSignedUrlSearchParams).toContain(
      signedUrlSearchParams.get("X-Amz-Date")!
    );
  });
  test("employeeQueries.getEmployeeFoto with signing the URL", async () => {
    const fileKey = "fake-key";
    const signedUrl = await getSignedUrlForDownload({
      bucket: process.env.S3_BUCKET_NAME!,
      fileKey,
      expiresInSeconds: 0,
    });

    expect(signedUrl.isErr()).toBe(false);

    if (signedUrl.isErr()) return;
    const signedUrlSearchParams = new URLSearchParams(
      signedUrl.value.split("?")[1]
    );
    expect(signedUrlSearchParams.get("X-Amz-Date")).toBeDefined();
    expect(signedUrlSearchParams.get("X-Amz-Expires")).toBeDefined();

    await userQueries.createEmployeeFoto({
      id: employeeId!,
      fileKey,
      amzSignedUrlSearchParams: signedUrlSearchParams.toString(),
    });

    const dbSignedUrl = await employeeQueries.getEmployeeFotoSignedUrl(
      employeeId!
    );
    if (dbSignedUrl.isErr()) {
      console.error(dbSignedUrl.error);
      expect(dbSignedUrl.isErr()).toBe(false);
      return;
    }

    const { key, amzSignedUrlSearchParams } = dbSignedUrl.value;

    expect(key).toContain(fileKey);
    expect(signedUrl.value).not.toEqual(
      `${process.env.S3_BUCKET_NAME}.localhost:9000/${fileKey}?${amzSignedUrlSearchParams}`
    );

    expect(dbSignedUrl.value.amzSignedUrlSearchParams).toBeDefined();
    const dbSignedUrlSearchParams = new URLSearchParams(
      dbSignedUrl.value.amzSignedUrlSearchParams!
    );
    expect(dbSignedUrlSearchParams.get("X-Amz-Date")).toBeDefined();
    expect(dbSignedUrlSearchParams.get("X-Amz-Expires")).toBeDefined();

    expect(signedUrlSearchParams.get("X-Amz-Expires")).not.toEqual(
      dbSignedUrlSearchParams.get("X-Amz-Expires")!
    );
  });
});
