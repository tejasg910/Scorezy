// app/teacher/actions/classroom.actions.ts  (or wherever you keep server actions)
"use server";

import { db } from "@/db";
import { classrooms, enrollments } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";

export async function getClassrooms(teacherId: string) {
  try {
    const classroomsData = await db
      .select({
        id: classrooms.id,
        teacherId: classrooms.teacherId,
        name: classrooms.name,
        inviteCode: classrooms.inviteCode,
        isActive: classrooms.isActive,
        createdAt: classrooms.createdAt,
        studentCount: count(enrollments.studentId),
      })
      .from(classrooms)
      .leftJoin(enrollments, eq(enrollments.classroomId, classrooms.id))
      .where(eq(classrooms.teacherId, teacherId))
      .groupBy(
        classrooms.id,
        classrooms.teacherId,
        classrooms.name,
        classrooms.inviteCode,
        classrooms.isActive,
        classrooms.createdAt
      )
      .orderBy(desc(classrooms.createdAt));

    return classroomsData;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return [];
  }
}