"use server";

import { db } from "@/db";
import { enrollments, user, attempts, quizzes, classrooms } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";

/** All students enrolled in a classroom with their attempt count (paginated) */
export async function getClassroomStudents(classroomId: string, page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  // Get total count
  const [{ count: totalCount }] = await db
    .select({ count: count(enrollments.studentId) })
    .from(enrollments)
    .where(eq(enrollments.classroomId, classroomId));

  const totalPages = Math.ceil(totalCount / limit);
  const rows = await db
    .select({
      studentId: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      joinedAt: enrollments.joinedAt,
      attemptCount: count(attempts.id),
    })
    .from(enrollments)
    .innerJoin(user, eq(enrollments.studentId, user.id))
    .leftJoin(attempts, eq(attempts.studentId, user.id))
    .where(eq(enrollments.classroomId, classroomId))
    .groupBy(
      user.id,
      user.name,
      user.email,
      user.image,
      enrollments.joinedAt
    )
    .limit(limit)
    .offset(offset);

  return { students: rows, totalPages, currentPage: page };
}

/** All attempts a student has made across quizzes in a specific classroom */
export async function getStudentAttemptsInClassroom(
  studentId: string,
  classroomId: string
) {
  const rows = await db
    .select({
      id: attempts.id,
      quizId: attempts.quizId,
      quizTitle: quizzes.title,
      score: attempts.score,
      total: attempts.total,
      passingMarks: quizzes.passingMarks,
      startedAt: attempts.startedAt,
      submittedAt: attempts.submittedAt,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .innerJoin(classrooms, eq(quizzes.classroomId, classrooms.id))
    .where(
      and(
        eq(attempts.studentId, studentId),
        eq(classrooms.id, classroomId)
      )
    )
    .orderBy(attempts.startedAt);

  return rows;
}

/** Classroom name for breadcrumbs */
export async function getClassroomName(classroomId: string) {
  const [row] = await db
    .select({ name: classrooms.name })
    .from(classrooms)
    .where(eq(classrooms.id, classroomId))
    .limit(1);
  return row?.name ?? "Classroom";
}
