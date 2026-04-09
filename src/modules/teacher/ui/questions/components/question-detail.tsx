"use client";

import { useState } from "react";
import { AddEditQuestionDialog } from "./question-form";
import type { QuestionWithOptions } from "@/modules/teacher/types/question";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuestionCard from "./question-card";
import { BulkAddQuestionsDialog } from "./bulk-question-form";
import { useSession } from "@/lib/auth-client";

export function QuizEditor({
  questions,
  quizId,
}: {
  questions: QuestionWithOptions[];
  quizId: string;
}) {
    const {data} = useSession()
  const [open, setOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithOptions | null>(null);

  const handleAdd = () => {
    setEditingQuestion(null);
    setOpen(true);
  };

  const handleEdit = (q: QuestionWithOptions) => {
    setEditingQuestion(q);
    setOpen(true);
  };

  return (
    <>
      {/* Add Button Area */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
        <Button onClick={handleAdd} variant="luxury" size="lg" className="w-full sm:w-auto px-8 h-14">
          + Add Question
        </Button>
        <BulkAddQuestionsDialog quizId={quizId} />
      </div>

    {/* Grid Layout - Questions in Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            onEdit={handleEdit}
            quizId={quizId}
            userId={data?.user.id!}
          />
        ))}
      </div>

      {/* Empty State */}
      {questions.length === 0 && (
        <Card className="border-white/5 border-dashed border-2 bg-[#15151e] py-24 rounded-none">
          <CardContent className="text-center space-y-4">
            <div className="text-5xl opacity-40 grayscale group-hover:grayscale-0 transition-all">🏗️</div>
            <div className="space-y-1">
              <p className="text-[#f0eeff] text-xl font-heading font-bold">No questions yet</p>
              <p className="text-[#71717a] text-sm max-w-xs mx-auto">
                Your assessment vault is empty. Add your first digital question to begin.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <AddEditQuestionDialog
        open={open}
        onOpenChange={setOpen}
        quizId={quizId}
        editingQuestion={editingQuestion}
      />
    </>
  );
}