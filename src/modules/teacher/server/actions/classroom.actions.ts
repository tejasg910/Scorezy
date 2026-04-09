"use server";

import { db } from "@/db";
import { classrooms } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { ClassroomState } from "../../../types/classroom";

export async function createClassroom(
  prevState: ClassroomState,
  formData: FormData
): Promise<ClassroomState> {
  const name = (formData.get("name") as string)?.trim();
  const teacherId = formData.get("teacherId") as string;

  if (!name) {
    return { error: "Classroom name is required" };
  }

  if (!teacherId) {
    return { error: "Teacher ID is missing" };
  }

  try {
    // Check if classroom with same name already exists for this teacher
    const existing = await db
      .select()
      .from(classrooms)
      .where(and(eq(classrooms.teacherId, teacherId), eq(classrooms.name, name)))
      .limit(1);

    if (existing.length > 0) {
      return { error: "A classroom with this name already exists" };
    }

    await db.insert(classrooms).values({
      id: crypto.randomUUID(),
      name,
      teacherId,
      inviteCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
      isActive: true,
    });

    revalidatePath("/teacher/dashboard");

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to create classroom" };
  }
}