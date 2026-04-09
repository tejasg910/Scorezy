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
    <Card className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none">
      <CardContent className="p-6 flex items-center gap-6">
        {/* Question Number (Squared) */}
        <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-sm font-heading font-extrabold text-[#f0eeff] flex-shrink-0 transition-all group-hover:bg-[#8b5cf6] group-hover:border-[#8b5cf6]">
          {String(index + 1).padStart(2, '0')}
        </div>
        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest bg-[#8b5cf6]/10 text-[#b18aff] border border-[#8b5cf6]/20">
              {question.type === "mcq" ? "MCQ" : "T/F"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
              {question.options.length} Options Defined
            </span>
          </div>
          <p className="text-lg leading-snug line-clamp-2 text-[#f0eeff] font-medium group-hover:text-white transition-colors">
            {question.body}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(question)}
            className="w-10 h-10 text-[#71717a] hover:text-[#8b5cf6] hover:bg-white/5 rounded-none"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="w-10 h-10 text-[#71717a] hover:text-red-500 hover:bg-white/5 rounded-none"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}