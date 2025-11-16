"use server";

import {
  applicationQueries,
  ApplicationUpdateInput,
} from "@workspace/server/db";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(
  applicationId: string,
  input: ApplicationUpdateInput
) {
  const updatedApplicationResult = await applicationQueries.updateApplication(
    applicationId,
    input
  );
  if (updatedApplicationResult.isErr()) {
    console.error(
      "Error updating application status:",
      updatedApplicationResult.error
    );
    return { success: false, error: "Failed to update status" };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
