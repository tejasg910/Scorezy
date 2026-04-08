// modules/teacher/server/actions/quiz/quiz.actions.ts
"use server";

import { db } from "@/db";
import { quizzes, classrooms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type QuizState = {
  error?: string;
  success?: boolean;
  quizId?: string;
};

const saveQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
  passingMarks: z.number().int().min(0).optional().nullable(),
  timeLimit: z.number().int().min(1).max(180).optional().nullable(), // 1 to 180 minutes
});

export async function saveQuiz(
  prevState: QuizState,
  formData: FormData
): Promise<QuizState> {
  const quizId = formData.get("quizId") as string | null;
  const classroomId = formData.get("classroomId") as string;
  const teacherId = formData.get("teacherId") as string;

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const status = (formData.get("status") as 'draft' | 'published' | 'closed') || 'draft';
  const passingMarks = formData.get("passingMarks") 
    ? parseInt(formData.get("passingMarks") as string) 
    : null;
  const timeLimit = formData.get("timeLimit") 
    ? parseInt(formData.get("timeLimit") as string) 
    : null;

  if (!title || !classroomId || !teacherId) {
    return { error: "Title and classroom are required" };
  }

  try {
    const [classroom] = await db
      .select({ id: classrooms.id })
      .from(classrooms)
      .where(and(
        eq(classrooms.id, classroomId),
        eq(classrooms.teacherId, teacherId)
      ))
      .limit(1);

    if (!classroom) return { error: "Unauthorized access" };

    const validated = saveQuizSchema.parse({ 
      title, 
      description, 
      status, 
      passingMarks, 
      timeLimit 
    });

    const quizData = {
      title: validated.title,
      description: validated.description,
      status: validated.status,
      passingMarks: validated.passingMarks,
      timeLimit: validated.timeLimit,
    };

    if (quizId) {
      // EDIT
      await db.update(quizzes).set(quizData).where(eq(quizzes.id, quizId));
      revalidatePath(`/teacher/dashboard/${classroomId}/${quizId}`);
    } else {
      // CREATE
      const [newQuiz] = await db
        .insert(quizzes)
        .values({ ...quizData, classroomId, id: crypto.randomUUID() })
        .returning({ id: quizzes.id });

      revalidatePath(`/teacher/dashboard/${classroomId}`);
      return { success: true, quizId: newQuiz.id };
    }

    return { success: true, quizId };
  } catch (err: any) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return { error: err.message };
    }
    return { error: "Failed to save quiz" };
  }
}