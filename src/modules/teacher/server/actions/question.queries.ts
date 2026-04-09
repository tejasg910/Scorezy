// app/teacher/server/quiz.actions.ts
"use server";

import { db } from "@/db";
import { questions, options, quizzes, classrooms } from "@/db/schema";
import { eq, inArray, asc, and, count } from "drizzle-orm";
import type { QuestionWithOptions } from "@/modules/teacher/types/question";

export type PaginatedQuestions = {
  questions: QuestionWithOptions[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export async function getQuestionsByQuiz(
  quizId: string,
  classroomId: string,
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedQuestions> {
  try {
    // Security Check
    const [accessCheck] = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .innerJoin(classrooms, eq(quizzes.classroomId, classrooms.id))
      .where(
        and(
          eq(quizzes.id, quizId),
          eq(quizzes.classroomId, classroomId),
          eq(classrooms.teacherId, userId)
        )
      )
      .limit(1);

    if (!accessCheck) {
      console.warn(`Access denied: Quiz=${quizId}, Classroom=${classroomId}, User=${userId}`);
      return {
        questions: [],
        pagination: { total: 0, page, pageSize, totalPages: 0, hasNext: false, hasPrev: false },
      };
    }

    const offset = (page - 1) * pageSize;

    // Count total questions
    const [{ total }] = await db
      .select({ total: count() })
      .from(questions)
      .where(eq(questions.quizId, quizId));

    // Fetch paginated questions
    const rawQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(asc(questions.orderIndex))
      .limit(pageSize)
      .offset(offset);

    let questionsWithOptions: QuestionWithOptions[] = [];

    if (rawQuestions.length > 0) {
      const rawOptions = await db
        .select()
        .from(options)
        .where(inArray(options.questionId, rawQuestions.map((q) => q.id)))
        .orderBy(asc(options.orderIndex));

      questionsWithOptions = rawQuestions.map((q) => ({
        ...q,
        options: rawOptions.filter((opt) => opt.questionId === q.id),
      }));
    }

    const totalPages = Math.ceil(total / pageSize);

    return {
      questions: questionsWithOptions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      questions: [],
      pagination: { total: 0, page, pageSize, totalPages: 0, hasNext: false, hasPrev: false },
    };
  }
}