"use server"

import { db } from "@/db";
import { classrooms, enrollments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function enrollStudentAction(studentId: string, inviteCode: string) {
  try {
    const classroom = await db
      .select()
      .from(classrooms)
      .where(eq(classrooms.inviteCode, inviteCode))
      .limit(1);

    if (!classroom.length) {
      return { success: false, message: "Invalid invite code" };
    }

    const classId = classroom[0].id;

    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.classroomId, classId), eq(enrollments.studentId, studentId)))
      .limit(1);

    if (existing.length) {
      return { success: false, message: "Already enrolled in this classroom" };
    }

    await db.insert(enrollments).values({
      id: crypto.randomUUID(),
      classroomId: classId,
      studentId: studentId,
      joinedAt: new Date(),
    });

    revalidatePath("/student/dashboard");
    return { success: true, message: "Successfully enrolled!" };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
}

export async function joinPublicClassroom(studentId: string, classId: string) {
  try {
    const classroom = await db
      .select()
      .from(classrooms)
      .where(and(eq(classrooms.id, classId), eq(classrooms.isPublic, true)))
      .limit(1);

    if (!classroom.length) {
      return { success: false, message: "Classroom not found or not public" };
    }

    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.classroomId, classId), eq(enrollments.studentId, studentId)))
      .limit(1);

    if (existing.length) {
      return { success: false, message: "Already enrolled in this classroom" };
    }

    await db.insert(enrollments).values({
      id: crypto.randomUUID(),
      classroomId: classId,
      studentId: studentId,
      joinedAt: new Date(),
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/public-classes");
    return { success: true, message: "Successfully joined public classroom!" };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
}
