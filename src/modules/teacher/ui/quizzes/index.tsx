import { getSession } from "@/app/auth/lib/session";


import SignInPage from "@/modules/auth/components/sign-in/page";
import { getQuizzesByClassroom } from "../../server/actions/quiz/quiz.queries";
import { QuizList } from "./components/quiz-list";
import { AddEditQuizDialog } from "./components/create-quiz-form";


export default async function Quizzes({ id }: { id: string }) {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const quizData = await getQuizzesByClassroom(id);
  console.log(quizData, "tis si quiz data")
  return (
    <div className="min-h-screen bg-background p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Quizzes
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your quizzes
            </p>
          </div>

          {/* keep your dialog here */}
          <div>
            <AddEditQuizDialog classroomId={id} />
          </div>
        </div>

        {/* Content */}
        <div>
          <QuizList quizzes={quizData} />
        </div>

      </div>
    </div>
  );
}