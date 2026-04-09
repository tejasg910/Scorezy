import { getSession } from "@/app/auth/lib/session";


import SignInPage from "@/modules/auth/components/sign-in/page";
import { getQuizzesByClassroom } from "../../server/actions/quiz.queries";
import { QuizList } from "./components/quiz-list";
import { AddEditQuizDialog } from "./components/create-quiz-form";
import { Button } from "@/components/ui/button";


export default async function Quizzes({ id }: { id: string }) {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const quizData = await getQuizzesByClassroom(id);
  console.log(quizData, "tis si quiz data")
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
          </div>

          <AddEditQuizDialog classroomId={id}  />
        </div>

        {/* Content */}
        <div>
          <QuizList quizzes={quizData} />
        </div>

      </div>
    </div>
  );
}