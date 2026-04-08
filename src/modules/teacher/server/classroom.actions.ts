"use server";

import { db } from "@/db";
import { classrooms } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { ClassroomState } from "../types/classroom";

export async function createClassroom(
  prevState: ClassroomState,
  formData: FormData
): Promise<ClassroomState> {
  const name = formData.get("name") as string;
  const teacherId = formData.get("teacherId") as string;

  if (!name) {
    return { error: "Classroom name is required" };
  }

  try {
    await db.insert(classrooms).values({
      id: crypto.randomUUID(),
      name,
      teacherId,
      inviteCode: crypto.randomUUID().slice(0, 8),
    });

    revalidatePath("/teacher/dashboard");

    return { success: true };
  } catch (err) {
    return { error: "Failed to create classroom" };
  }
}