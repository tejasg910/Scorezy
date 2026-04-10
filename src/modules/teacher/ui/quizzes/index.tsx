import { getSession } from "@/app/auth/lib/session";


import SignInPage from "@/modules/auth/components/sign-in/page";
import { getQuizzesByClassroom } from "../../server/actions/quiz.queries";
import { QuizList } from "./components/quiz-list";
import { AddEditQuizDialog } from "./components/create-quiz-form";
import { Button } from "@/components/ui/button";
import { getEntitlements } from "@/modules/billing/server/actions/entitlements.action";
import { PlanUsageBanner } from "@/modules/billing/ui/components/plan-usage-banner";
import { Pagination } from "@/components/pagination";

export default async function Quizzes({ id, page = 1 }: { id: string; page?: number }) {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const [quizData, entitlements] = await Promise.all([
    getQuizzesByClassroom(id),
    getEntitlements(),
  ]);
  
  const limit = 10;
  const totalPages = Math.ceil(quizData.length / limit);
  const offset = (page - 1) * limit;
  const paginatedData = quizData.slice(offset, offset + limit);

  return (
    <div className="p-6 pt-32 lg:pt-20">
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
              Quizzes
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Craft and manage your digital assessments.
            </p>
            {/* Usage counters — sits right beneath the subtitle */}
            <div className="pt-2">
              <PlanUsageBanner entitlements={entitlements} />
            </div>
          </div>

          <AddEditQuizDialog classroomId={id} canCreate={entitlements?.canCreateQuiz ?? true} />
        </div>

        {/* Content */}
        <div>
          <QuizList quizzes={paginatedData} />
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl={`/teacher/dashboard/${id}`}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}