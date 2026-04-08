import { QuizCard } from "./quiz-card";
import { Quiz } from "../../../types/quiz";

export function QuizList({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}