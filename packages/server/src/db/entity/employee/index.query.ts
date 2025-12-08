import {
  err,
  ok,
  tryCatchAsync,
} from "@workspace/shared/error-handling/result";
import { prisma } from "../../client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { getSignedUrlForDownload } from "@workspace/file-upload/s3-client";

export type GetEmployee = Prisma.EmployeeGetPayload<{}>;
export const employeeQueries = {
  getEmployeeByUserId: (id: string) =>
    tryCatchAsync(
      () =>
        prisma.employee.findUnique({
          where: {
            userId: id,
          },
        }) satisfies Promise<GetEmployee | null>
    ),
  getEmployeeFotoSignedUrl: async (id: string) => {
    const result = await tryCatchAsync(() =>
      prisma.employee.findUnique({
        where: {
          id,
        },
        select: {
          fotos: {
            take: 1,
            orderBy: {
              createdAt: "desc", // Get the most recent photo
            },
          },
        },
      })
    );
    if (result.isErr()) return err(result.error);
    if (result.value === null)
      return err({
        type: "EMPLOYEE_NOT_FOUND",
      });
    const [recentFoto] = result.value.fotos;
    if (recentFoto === undefined)
      return err({
        type: "FOTO_NOT_FOUND",
      });

    if (recentFoto.amzSignedUrlSearchParams === null)
      return err({
        type: "AMZ_SIGNED_URL_SEARCH_PARAMS_NOT_FOUND",
        message: "The S3 object does not have signed URL search parameters",
      });

    const urlSearchParams = new URLSearchParams(
      recentFoto.amzSignedUrlSearchParams
    );
    const amzDate = urlSearchParams.get("X-Amz-Date");
    const expiresAtValue = urlSearchParams.get("X-Amz-Expires");
    if (amzDate === null || expiresAtValue === null) {
      return err({
        type: "INVALID_SIGNED_URL",
        message:
          "Signed URL is missing required parameters (X-Amz-Date or X-Amz-Expires)",
      });
    }
    const amzExpiresInSeconds = Number(expiresAtValue);
    const amzDateTime = new Date(
      `${amzDate.slice(0, 4)}-${amzDate.slice(4, 6)}-${amzDate.slice(
        6,
        8
      )}T${amzDate.slice(9, 11)}:${amzDate.slice(11, 13)}:${amzDate.slice(13, 15)}Z`
    ).getTime();

    const expiryDate = new Date(amzDateTime + amzExpiresInSeconds * 1000);
    if (new Date() > expiryDate) {
      const newSignedUrl = await getSignedUrlForDownload({
        bucket: process.env.S3_BUCKET_NAME!,
        fileKey: recentFoto.key,
        expiresInSeconds: 24 * 3600, // 24 hours
      });

      if (newSignedUrl.isErr()) {
        return err(newSignedUrl.error);
      }

      const newSignedUrlValue = new URL(newSignedUrl.value);

      const updatedFoto = await prisma.s3Object.update({
        where: {
          id: recentFoto.id,
        },
        data: {
          amzSignedUrlSearchParams: newSignedUrlValue.search.toString(),
        },
      });
      return ok(updatedFoto);
    }

    return ok(recentFoto);
  },
};
