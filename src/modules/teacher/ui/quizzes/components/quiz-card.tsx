"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "../../../types/quiz";
import QuestionEditButton from "./view-button";
import { AddEditQuizDialog } from "./create-quiz-form";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const isActive = quiz.status === "published";

  return (
    <Card className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardContent className="p-6 space-y-6">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold tracking-tight text-[#f0eeff]">{quiz.title}</h2>
            {quiz.description && (
              <p className="text-sm text-[#a1a1aa] line-clamp-2 max-w-[280px]">{quiz.description}</p>
            )}
          </div>
          <span
            className={`text-[10px] px-3 py-1 font-bold uppercase tracking-widest ${
              quiz.status === "published"
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : quiz.status === "closed"
                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
            }`}
          >
            {quiz.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#71717a]">
          <div className="flex flex-col gap-1">
            <span className="text-[#a1a1aa]/40">Created</span>
            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
          </div>
          
          {quiz.opensAt && (
            <div className="flex flex-col gap-1">
              <span className="text-[#a1a1aa]/40">Opens</span>
              <span>{new Date(quiz.opensAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="flex-1 w-full">
            <AddEditQuizDialog 
              classroomId={quiz.classroomId} 
              editingQuiz={quiz} 
              trigger={
                <Button variant="outline" size="sm" className="w-full rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 font-heading font-bold uppercase tracking-widest text-[10px] h-9 px-4">
                  Edit Details
                </Button>
              } 
            />
          </div>
         
          <div className="flex-1 w-full">
            <QuestionEditButton id={quiz.classroomId} quizId={quiz.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}