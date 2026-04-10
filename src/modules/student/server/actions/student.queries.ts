import { db } from "@/db";
import { classrooms, enrollments, quizzes, attempts, questions, options, answers } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

export async function getEnrolledClasses(studentId: string) {
  const result = await db
    .select({
      id: classrooms.id,
      name: classrooms.name,
      teacherId: classrooms.teacherId,
      joinedAt: enrollments.joinedAt,
    })
    .from(enrollments)
    .innerJoin(classrooms, eq(enrollments.classroomId, classrooms.id))
    .where(eq(enrollments.studentId, studentId));
  
  return result;
}

export async function getStudentQuizzes(studentId: string) {
  const enrolled = await db
    .select({ classroomId: enrollments.classroomId })
    .from(enrollments)
    .where(eq(enrollments.studentId, studentId));
    
  if (enrolled.length === 0) return [];
  
  const classroomIds = enrolled.map(e => e.classroomId);
  
  const availableQuizzes = await db
    .select()
    .from(quizzes)
    .where(inArray(quizzes.classroomId, classroomIds));
    
  return availableQuizzes;
}

export async function getStudentAttempts(studentId: string) {
  return await db
    .select({
      id: attempts.id,
      quizId: attempts.quizId,
      score: attempts.score,
      total: attempts.total,
      startedAt: attempts.startedAt,
      submittedAt: attempts.submittedAt,
      quizTitle: quizzes.title,
      passingMarks: quizzes.passingMarks,
    })
    .from(attempts)
    .innerJoin(quizzes, eq(attempts.quizId, quizzes.id))
    .where(eq(attempts.studentId, studentId))
    .orderBy(attempts.startedAt);
}

export async function getAttemptDetails(attemptId: string, studentId: string) {
  // First verify attempt belongs to student
  const attemptArr = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.studentId, studentId)))
    .limit(1);

  if (!attemptArr.length) return null;
  const attempt = attemptArr[0];

  const quizArr = await db.select().from(quizzes).where(eq(quizzes.id, attempt.quizId)).limit(1);
  const quiz = quizArr[0];

  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, attempt.quizId))
    .orderBy(questions.orderIndex);

  const quizOptions = await db
    .select()
    .from(options)
    .innerJoin(questions, eq(options.questionId, questions.id))
    .where(eq(questions.quizId, attempt.quizId));

  const studentAnswers = await db
    .select()
    .from(answers)
    .where(eq(answers.attemptId, attemptId));

  const questionsWithDetails = quizQuestions.map(q => {
    const qOptions = quizOptions.filter(o => o.options.questionId === q.id).map(o => o.options);
    const userAnswer = studentAnswers.find(a => a.questionId === q.id);
    
    return {
      ...q,
      options: qOptions,
      userAnswer: userAnswer?.optionId || null,
      isCorrect: userAnswer?.isCorrect || false
    };
  });

  return {
    ...attempt,
    quizTitle: quiz?.title || "Unknown Quiz",
    passingMarks: quiz?.passingMarks,
    questions: questionsWithDetails
  };
}



export async function getAttemptDetailsForTeacher(attemptId: string) {
  const attemptArr = await db
    .select()
    .from(attempts)
    .where(eq(attempts.id, attemptId))
    .limit(1);

  if (!attemptArr.length) return null;
  const attempt = attemptArr[0];

  const quizArr = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, attempt.quizId))
    .limit(1);
  const quiz = quizArr[0];

  const quizQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, attempt.quizId))
    .orderBy(questions.orderIndex);

  const quizOptions = await db
    .select()
    .from(options)
    .innerJoin(questions, eq(options.questionId, questions.id))
    .where(eq(questions.quizId, attempt.quizId));

  const studentAnswers = await db
    .select()
    .from(answers)
    .where(eq(answers.attemptId, attemptId));

  const questionsWithDetails = quizQuestions.map((q) => {
    const qOptions = quizOptions
      .filter((o) => o.options.questionId === q.id)
      .map((o) => o.options);
    const userAnswer = studentAnswers.find((a) => a.questionId === q.id);

    return {
      ...q,
      options: qOptions,
      userAnswer: userAnswer?.optionId ?? null,
      isCorrect: userAnswer?.isCorrect ?? false,
    };
  });

  return {
    ...attempt,
    quizTitle: quiz?.title ?? "Unknown Quiz",
    passingMarks: quiz?.passingMarks,
    questions: questionsWithDetails,
  };
}
