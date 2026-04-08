// app/teacher/server/quiz.actions.ts
"use server";

import { db } from "@/db";
import { quizzes, classrooms } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getQuizzesByClassroom(classroomId: string) {
  try {
    const quizList = await db
      .select({
        id: quizzes.id,
        classroomId: quizzes.classroomId,   // ← Added
        title: quizzes.title,
        description: quizzes.description,
        status: quizzes.status,
        opensAt: quizzes.opensAt,
        closesAt: quizzes.closesAt,
        createdAt: quizzes.createdAt,
      })
      .from(quizzes)
      .where(eq(quizzes.classroomId, classroomId))
      .orderBy(desc(quizzes.createdAt));

    return quizList;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}