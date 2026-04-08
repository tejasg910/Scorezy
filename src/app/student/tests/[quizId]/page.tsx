import { getSession } from "@/app/auth/lib/session";
import { redirect } from "next/navigation";
import { startAttempt } from "@/modules/student/server/actions/quiz.actions";
import { getQuizWithQuestions } from "@/modules/student/server/actions/quiz.queries";
import { TestClient } from "@/modules/student/ui/tests/test-client";

export default async function TestPage({ params }: { params: { quizId: string } }) {
  const session = await getSession();
  
  if (!session) redirect("/auth/sign-in");
  
  const studentData = session.user;
  const { quizId } = await params;

  // 1. Fetch the Quiz data with questions and options (without answers)
  const quiz = await getQuizWithQuestions(quizId);
  if (!quiz) {
    return <div className="p-10 text-center">Quiz not found or you don't have access.</div>;
  }

  // 2. Start or Resume the attempt
  const attemptResult = await startAttempt(studentData.id, quizId);
  if (!attemptResult.success || !attemptResult.attemptId) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl text-red-500 font-bold mb-2">Error</h2>
        <p>{attemptResult.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
         <TestClient 
           quiz={quiz} 
           attemptId={attemptResult.attemptId} 
           initialTimeRemaining={attemptResult.timeRemaining || 0} 
         />
      </div>
    </div>
  );
}
