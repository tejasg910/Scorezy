// app/teacher/server/quiz.actions.ts
"use server";

import { db } from "@/db";
import { classrooms, quizzes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { QuizState } from "@/modules/teacher/types/quiz";



export async function createQuiz(
  prevState: QuizState,
  formData: FormData
): Promise<QuizState> {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const classroomId = formData.get("classroomId") as string;
  const teacherId = formData.get("teacherId") as string; // for security check

  if (!title || !classroomId) {
    return { error: "Quiz title is required" };
  }

  if (!teacherId) {
    return { error: "Unauthorized" };
  }

  try {
    // Optional: Verify that the classroom belongs to this teacher
    const [classroom] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(and(
        eq(classrooms.id, classroomId),
        eq(classrooms.teacherId, teacherId)
      ))
      .limit(1);

    if (!classroom) {
      return { error: "Classroom not found or access denied" };
    }

    // Check if quiz with same title already exists in this classroom
    const existing = await db
      .select()
      .from(quizzes)
      .where(and(
        eq(quizzes.classroomId, classroomId),
        eq(quizzes.title, title)
      ))
      .limit(1);

    if (existing.length > 0) {
      return { error: "A quiz with this title already exists in this classroom" };
    }

    // Create the quiz
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        id: crypto.randomUUID(),
        classroomId,
        title,
        description,
        status: "draft",           // default from schema
        opensAt: null,
        closesAt: null,
      })
      .returning({ id: quizzes.id });

    revalidatePath(`/teacher/dashboard/${classroomId}`);

    return { 
      success: true, 
      quizId: newQuiz.id 
    };

  } catch (err) {
    console.error("Create quiz error:", err);
    return { error: "Failed to create quiz. Please try again." };
  }
}