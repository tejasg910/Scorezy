// app/teacher/server/quiz.actions.ts  (add to the same file)
"use server";

import { db } from "@/db";
import { questions, options, quizzes, classrooms } from "@/db/schema";
import { BulkQuestionState } from "@/modules/teacher/types/question";
import { eq, max, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type QuestionState = {
  error?: string;
  success?: boolean;
};

// Zod schema for validation
const saveQuestionSchema = z.object({
  body: z.string().min(5, "Question must be at least 5 characters"),
  type: z.enum(["mcq", "true_false"]),
  optionsJson: z.string().transform((val) => JSON.parse(val)),
});


const bulkQuestionSchema = z.object({
  questions: z.array(
    z.object({
      body: z.string().min(5, "Question must be at least 5 characters"),
      type: z.enum(["mcq", "true_false"]),
      marks: z.number().int().positive().optional().default(1),
      options: z.array(
        z.object({
          text: z.string().min(1, "Option text is required"),
          isCorrect: z.boolean(),
        })
      ),
    })
  ),
});

export async function saveQuestion(
  prevState: QuestionState,
  formData: FormData
): Promise<QuestionState> {
  const quizId = formData.get("quizId") as string;
  const questionId = formData.get("questionId") as string | null;
  const body = (formData.get("body") as string)?.trim();
  const type = formData.get("type") as "mcq" | "true_false";
  const marks = parseInt(formData.get("marks") as string) || 1;
  const optionsJson = formData.get("optionsJson") as string;

  if (!quizId || !body || !type || !optionsJson) {
    return { error: "Missing required fields" };
  }

  try {
    const parsed = saveQuestionSchema.parse({ body, type, optionsJson });
    const optionList = parsed.optionsJson as { text: string; isCorrect: boolean }[];

    const correctCount = optionList.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return { error: "Exactly one option must be marked as correct" };
    }

    if (type === "mcq" && optionList.length !== 4) {
      return { error: "MCQ must have exactly 4 options" };
    }
    if (type === "true_false" && optionList.length !== 2) {
      return { error: "True/False must have exactly 2 options" };
    }

    if (questionId) {
      // EDIT
      await db
        .update(questions)
        .set({ body, type, marks })
        .where(eq(questions.id, questionId));

      await db.delete(options).where(eq(options.questionId, questionId));

      await db.insert(options).values(
        optionList.map((opt, index) => ({
          id: crypto.randomUUID(),
          questionId,
          text: opt.text.trim(),
          isCorrect: opt.isCorrect,
          orderIndex: index,
        }))
      );
    } else {
      // CREATE
      const [lastOrder] = await db
        .select({ orderIndex: max(questions.orderIndex) })
        .from(questions)
        .where(eq(questions.quizId, quizId));

      const nextOrder = (lastOrder?.orderIndex ?? -1) + 1;

      const [newQuestion] = await db
        .insert(questions)
        .values({
          id: crypto.randomUUID(),
          quizId,
          body,
          type,
          marks,
          orderIndex: nextOrder,
        })
        .returning({ id: questions.id });

      await db.insert(options).values(
        optionList.map((opt, index) => ({
          id: crypto.randomUUID(),
          questionId: newQuestion.id,
          text: opt.text.trim(),
          isCorrect: opt.isCorrect,
          orderIndex: index,
        }))
      );
    }

    revalidatePath("/teacher/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return { error: err.message || "Validation error" };
    }
    return { error: "Failed to save question" };
  }
}


export async function bulkCreateQuestions(
  prevState: BulkQuestionState,
  formData: FormData
): Promise<BulkQuestionState> {
  const quizId = formData.get("quizId") as string;
  const rawJson = formData.get("questionsJson") as string;

  if (!quizId || !rawJson) {
    return { error: "Missing quizId or questions data" };
  }

  try {
    // Parse JSON safely
    let parsedData;
    try {
      parsedData = JSON.parse(rawJson);
    } catch (jsonErr) {
      return { error: "Invalid JSON format. Please check your syntax." };
    }

    const parsed = bulkQuestionSchema.parse({ questions: parsedData.questions });

    // ── 1. PRE-VALIDATION ──────────────────────────────────────────────────
    // Validate everything BEFORE any database writes
    for (const q of parsed.questions) {
      const correctCount = q.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        return { 
          error: `Question "${q.body}" must have exactly one correct option. No questions were added.` 
        };
      }
      
      if (q.type === "mcq" && q.options.length !== 4) {
        return { error: `MCQ "${q.body}" must have exactly 4 options. No questions were added.` };
      }
      if (q.type === "true_false" && q.options.length !== 2) {
        return { error: `True/False "${q.body}" must have exactly 2 options. No questions were added.` };
      }
    }

    // ── 2. DEDUPLICATION & PREPARATION ──────────────────────────────────────
    // Fetch existing question bodies to avoid duplicates
    const existingQuestions = await db
      .select({ body: questions.body })
      .from(questions)
      .where(eq(questions.quizId, quizId));
    
    const existingBodies = new Set(existingQuestions.map(q => q.body.toLowerCase().trim()));

    // Get next order index
    const [{ maxOrder = -1 }] = await db
      .select({ maxOrder: max(questions.orderIndex) })
      .from(questions)
      .where(eq(questions.quizId, quizId));

    let currentOrder = (maxOrder ?? -1) + 1;
    let totalCreated = 0;
    let totalSkipped = 0;

    // ── 3. EXECUTION ────────────────────────────────────────────────────────
    for (const q of parsed.questions) {
      const normalizedBody = q.body.toLowerCase().trim();
      
      // Skip if exists
      if (existingBodies.has(normalizedBody)) {
        totalSkipped++;
        continue;
      }

      // Create Question
      const [newQuestion] = await db
        .insert(questions)
        .values({
          id: crypto.randomUUID(),
          quizId,
          body: q.body.trim(),
          type: q.type,
          marks: q.marks ?? 1,
          orderIndex: currentOrder++,
        })
        .returning({ id: questions.id });

      // Create Options
      await db.insert(options).values(
        q.options.map((opt, index) => ({
          id: crypto.randomUUID(),
          questionId: newQuestion.id,
          text: opt.text.trim(),
          isCorrect: opt.isCorrect,
          orderIndex: index,
        }))
      );

      totalCreated++;
    }

    revalidatePath(`/teacher/dashboard`);

    return {
      success: true,
      createdCount: totalCreated,
    };
  } catch (err: any) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return { error: err.message || "Validation failed" };
    }
    return { error: err.message || "Failed to create questions" };
  }
}



// src/modules/teacher/server/actions/question/question.action.ts

export async function deleteQuestion(
  prevState: { error?: string; success?: boolean },
  formData: FormData
) {
  const questionId = formData.get("questionId") as string;
  const quizId = formData.get("quizId") as string;
  const userId = formData.get("userId") as string;

  if (!questionId || !quizId || !userId) {
    return { error: "Missing required fields" };
  }

  try {
    // Security Check: Verify question belongs to a quiz created by this teacher
    const [questionData] = await db
      .select({
        quizId: questions.quizId,
        classroomId: quizzes.classroomId,
        teacherId: classrooms.teacherId,
      })
      .from(questions)
      .innerJoin(quizzes, eq(questions.quizId, quizzes.id))
      .innerJoin(classrooms, eq(quizzes.classroomId, classrooms.id))
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!questionData || questionData.teacherId !== userId) {
      return { error: "Unauthorized: You can only delete your own questions" };
    }

    // Delete options first
    await db.delete(options).where(eq(options.questionId, questionId));

    // Delete question
    await db.delete(questions).where(eq(questions.id, questionId));

    revalidatePath(`/teacher/dashboard/${questionData.classroomId}/${quizId}`);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to delete question" };
  }
}

