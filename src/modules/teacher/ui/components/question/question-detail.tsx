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
      {/* Add Button */}
      <div className="mb-8">
        <Button onClick={handleAdd} size="lg" className="bg-violet-600 hover:bg-violet-700">
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
        <Card className="border-dashed border-2 py-20">
          <CardContent className="text-center">
            <p className="text-gray-400 text-lg">No questions yet</p>
            <p className="text-gray-500 mt-1">Add your first question to get started</p>
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