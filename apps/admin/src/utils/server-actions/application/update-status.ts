"use server";

import { prisma } from "@/lib/db/prisma-client";
import { ApplicationStatus } from "@/utils/models/applications";
import { revalidatePath } from "next/cache";

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
) {
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
