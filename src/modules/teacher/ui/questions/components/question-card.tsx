"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { deleteQuestion } from "@/modules/teacher/server/actions/question.action";
import type { QuestionWithOptions } from "@/modules/teacher/types/question";

type Props = {
  question: QuestionWithOptions;
  index: number;
  quizId: string;
  userId: string;
  onEdit: (question: QuestionWithOptions) => void;
};

export default function QuestionCard({
  question,
  index,
  quizId,
  userId,
  onEdit
}: Props) {

  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("questionId", question.id);
      formData.append("quizId", quizId);
      formData.append("userId", userId);

      await deleteQuestion({}, formData);
    });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-5 flex items-center gap-5">
        {/* Question Number */}
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground flex-shrink-0">
          {index + 1}
        </div>

        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="text-xs font-medium">
              {question.type === "mcq" ? "MCQ" : "True/False"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {question.options.length} options
            </span>
          </div>
          <p className="text-[17px] leading-tight line-clamp-2 text-foreground">
            {question.body}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(question)}
            className="text-muted-foreground hover:text-primary"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-muted-foreground hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}