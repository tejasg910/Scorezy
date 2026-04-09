// app/teacher/actions/classroom.actions.ts  (or wherever you keep server actions)
"use server";

import { db } from "@/db";
import { classrooms } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getClassrooms(teacherId: string) {
  try {
    const classroomsData = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.teacherId, teacherId))
      .orderBy(desc(classrooms.createdAt));

    return classroomsData;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return []; // Return empty array on error as requested
  }
}