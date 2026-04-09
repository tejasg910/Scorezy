"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "../../../types/quiz";
import QuestionEditButton from "./view-button";
import { AddEditQuizDialog } from "./create-quiz-form";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const isActive = quiz.status === "published";

  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 space-y-3">
        {/* Title + Status */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{quiz.title}</h2>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              quiz.status === "published"
                ? "bg-green-500/10 text-green-500"
                : quiz.status === "closed"
                ? "bg-red-500/10 text-red-500"
                : "bg-yellow-500/10 text-yellow-500"
            }`}
          >
            {quiz.status === "published"
              ? "Published"
              : quiz.status === "closed"
              ? "Closed"
              : "Draft"}
          </span>
        </div>

        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
        )}

        {/* Dates */}
        <div className="text-xs text-muted-foreground/60 space-y-1">
          <div>Created: {new Date(quiz.createdAt).toLocaleDateString()}</div>
          
          {quiz.opensAt && (
            <div>Opens: {new Date(quiz.opensAt).toLocaleDateString()}</div>
          )}
          {quiz.closesAt && (
            <div>Closes: {new Date(quiz.closesAt).toLocaleDateString()}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <AddEditQuizDialog classroomId={quiz.classroomId} editingQuiz={quiz} trigger={<Button size="sm">Edit</Button>} />
         
          <QuestionEditButton id={quiz.classroomId} quizId={quiz.id} />
      
        </div>
      </CardContent>
    </Card>
  );
}