// app/teacher/server/quiz.actions.ts  (add to the same file)
"use server";

import { db } from "@/db";
import { questions, options } from "@/db/schema";
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

export async function saveQuestion(
  prevState: QuestionState,
  formData: FormData
): Promise<QuestionState> {
  const quizId = formData.get("quizId") as string;
  const questionId = formData.get("questionId") as string | null; // present only on edit
  const body = (formData.get("body") as string)?.trim();
  const type = formData.get("type") as "mcq" | "true_false";
  const optionsJson = formData.get("optionsJson") as string;

  if (!quizId || !body || !type || !optionsJson) {
    return { error: "Missing required fields" };
  }

  try {
    const parsed = saveQuestionSchema.parse({ body, type, optionsJson });
    const optionList: { text: string; isCorrect: boolean }[] = parsed.optionsJson;

    // Validation rules
    const correctCount = optionList.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      return { error: "Exactly one option must be marked as correct" };
    }


    if (type === "true_false" && optionList.length !== 2) {
      return { error: "True/False must have exactly 2 options" };
    }

    if (questionId) {
      // === EDIT MODE ===
      await db
        .update(questions)
        .set({ body, type })
        .where(eq(questions.id, questionId));

      // Delete old options
      await db.delete(options).where(eq(options.questionId, questionId));

      // Insert new options
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
      // === CREATE MODE ===
      // Get next order index
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
          orderIndex: nextOrder,
        })
        .returning({ id: questions.id });

      // Insert options
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

    revalidatePath("/teacher/dashboard"); // broad revalidation (safe)
    return { success: true };
  } catch (err: any) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return { error: err.message };
    }
    return { error: "Failed to save question" };
  }
}