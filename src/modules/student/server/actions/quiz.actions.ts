"use server"

import { db } from "@/db";
import { attempts, quizzes, answers, questions, options } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function startAttempt(studentId: string, quizId: string) {
  // Check if there is an ongoing attempt
  const existingAttempts = await db
    .select({
      id: attempts.id,
      startedAt: attempts.startedAt,
      timeLimit: quizzes.timeLimit,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .where(
      and(
        eq(attempts.studentId, studentId),
        eq(attempts.quizId, quizId),
        isNull(attempts.submittedAt)
      )
    )
    .limit(1);

  if (existingAttempts.length > 0) {
    const attempt = existingAttempts[0];
    const timeLimitS = (attempt.timeLimit || 30) * 60;
    const elapsedS = Math.floor((new Date().getTime() - attempt.startedAt.getTime()) / 1000);
    const timeRemaining = Math.max(0, timeLimitS - elapsedS);

    return { 
      success: true, 
      attemptId: attempt.id, 
      timeRemaining 
    };
  }

  // Create new attempt
  // First get the quiz to know its limits
  const quizArr = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  if (!quizArr.length) {
    return { success: false, message: "Quiz not found" };
  }

  const newAttemptId = crypto.randomUUID();
  await db.insert(attempts).values({
    id: newAttemptId,
    quizId: quizId,
    studentId: studentId,
    startedAt: new Date(),
  });

  return {
    success: true,
    attemptId: newAttemptId,
    timeRemaining: (quizArr[0].timeLimit || 30) * 60
  };
}

export async function submitAttempt(attemptId: string, studentAnswers: Record<string, string>) {
  // Check if attempt is valid
  const attemptArr = await db
    .select()
    .from(attempts)
    .where(eq(attempts.id, attemptId))
    .limit(1);

  if (!attemptArr.length) {
    return { success: false, message: "Attempt not found" };
  }

  const attempt = attemptArr[0];
  if (attempt.submittedAt) {
    return { success: false, message: "Attempt already submitted" };
  }

  // Fetch all quiz questions and options
  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, attempt.quizId));

  const quizOptions = await db
    .select()
    .from(options)
    .innerJoin(questions, eq(options.questionId, questions.id))
    .where(eq(questions.quizId, attempt.quizId));

  let score = 0;
  let totalMarks = 0;
  
  const answersToInsert = [];

  for (const question of quizQuestions) {
    totalMarks += question.marks;
    
    const selectedOptionId = studentAnswers[question.id];
    if (selectedOptionId) {
      // Find the option
      const selectedOption = quizOptions.find(o => o.options.id === selectedOptionId)?.options;
      const isCorrect = selectedOption?.isCorrect || false;
      
      if (isCorrect) {
        score += question.marks;
      }

      answersToInsert.push({
        id: crypto.randomUUID(),
        attemptId: attemptId,
        questionId: question.id,
        optionId: selectedOptionId,
        isCorrect: isCorrect,
      });
    }
  }

  // Transaction needed Ideally, but let's do sequentially
  if (answersToInsert.length > 0) {
    await db.insert(answers).values(answersToInsert);
  }

  await db.update(attempts)
    .set({
      score: score,
      total: totalMarks,
      submittedAt: new Date(),
    })
    .where(eq(attempts.id, attemptId));

  return { success: true, score, totalMarks };
}
