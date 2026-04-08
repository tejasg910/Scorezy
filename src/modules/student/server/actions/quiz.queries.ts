import { db } from "@/db";
import { quizzes, questions, options } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getQuizWithQuestions(quizId: string) {
  const quizArr = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizArr.length) return null;

  const quiz = quizArr[0];

  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.orderIndex));

  const quizOptions = await db
    .select()
    .from(options)
    .innerJoin(questions, eq(options.questionId, questions.id))
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(options.orderIndex));

  const questionsWithOptions = quizQuestions.map(q => {
    return {
      ...q,
      options: quizOptions
        .filter(o => o.options.questionId === q.id)
        .map(o => ({
          id: o.options.id,
          text: o.options.text,
          orderIndex: o.options.orderIndex
          // IMPORTANT: Do NOT send `isCorrect` to the client for students!
        }))
    };
  });

  return {
    ...quiz,
    questions: questionsWithOptions
  };
}
