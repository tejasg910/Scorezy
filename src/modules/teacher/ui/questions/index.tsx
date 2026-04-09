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
    <div className="p-6 pt-32 lg:pt-20 max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
            Quiz <span className="text-[#8b5cf6]">Questions</span>
          </h1>
          <p className="text-[#a1a1aa] text-lg">
            Manage your assessment inventory for this quiz.
          </p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a]">
          {pagination.total} Questions Recorded
        </div>
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