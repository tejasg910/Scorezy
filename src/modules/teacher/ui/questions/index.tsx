import { getQuestionsByQuiz } from "@/modules/teacher/server/actions/question.queries";

import { QuizEditor } from "./components/question-detail";
import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { Pagination } from "@/components/pagination";

export default async function QuizDetailPage({
  quizId,
  classroomId,
  currentPage,
}: {
  quizId: string,
  classroomId: string,
  currentPage: string
}) {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return <SignInPage />;
  }

  const page = parseInt(currentPage ?? "1");
  const pageSize = 10;

  const { questions, pagination } = await getQuestionsByQuiz(
    quizId,
    classroomId,
    userId,
    page,
    pageSize
  );

  const baseUrl = `/teacher/dashboard/${classroomId}/${quizId}`;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pt-32 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Quiz Questions</h1>
        <p className="text-sm text-muted-foreground">
          {pagination.total} Questions
        </p>
      </div>

      <QuizEditor questions={questions} quizId={quizId} />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        baseUrl={baseUrl}
        className="mt-12"
      />
    </div>
  );
}