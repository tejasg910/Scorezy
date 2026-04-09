"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveQuestion } from "@/modules/teacher/server/actions/question/question.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuestionWithOptions } from "@/modules/teacher/types/question";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizId: string;
  editingQuestion?: QuestionWithOptions | null;
};

export function AddEditQuestionDialog({
  open,
  onOpenChange,
  quizId,
  editingQuestion,
}: Props) {
  const [state, action, pending] = useActionState(saveQuestion, {});
  const optionsJsonRef = useRef<HTMLInputElement>(null);

  // Form state
  const [body, setBody] = useState("");
  const [type, setType] = useState<"mcq" | "true_false">("mcq");
  const [optionList, setOptionList] = useState<{ text: string; isCorrect: boolean }[]>([]);

  // Reset / pre-fill when dialog opens or question changes
  useEffect(() => {
    if (open) {
      if (editingQuestion) {
        setBody(editingQuestion.body);
        setType(editingQuestion.type);
        setOptionList(
          editingQuestion.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
          }))
        );
      } else {
        // default new question
        setBody("");
        setType("mcq");
        setOptionList([
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]);
      }
    }
  }, [open, editingQuestion]);

  // Update hidden JSON field before submit
  useEffect(() => {
    if (optionsJsonRef.current) {
      optionsJsonRef.current.value = JSON.stringify(optionList);
    }
  }, [optionList]);

  // Auto-refresh page on success
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      // Refresh server data
      window.location.reload(); // simple & reliable (or use router.refresh() if you import useRouter)
    }
  }, [state.success, onOpenChange]);

  const handleCorrectChange = (index: number) => {
    setOptionList((prev) =>
      prev.map((opt, i) => ({
        ...opt,
        isCorrect: i === index,
      }))
    );
  };

  const isMcq = type === "mcq";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-6">
          <input type="hidden" name="quizId" value={quizId} />
          {editingQuestion && (
            <input type="hidden" name="questionId" value={editingQuestion.id} />
          )}
          <input ref={optionsJsonRef} type="hidden" name="optionsJson" />

          {/* Question Text */}
          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your question here..."
              required
              rows={3}
            />
          </div>

          {/* Question Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => {
                setType(v as "mcq" | "true_false");
                // Reset options when type changes
                if (v === "mcq") {
                  setOptionList([
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                  ]);
                } else {
                  setOptionList([
                    { text: "True", isCorrect: false },
                    { text: "False", isCorrect: false },
                  ]);
                }
              }}
              name="type"
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mcq" id="mcq" />
                <Label htmlFor="mcq">Multiple Choice (4 options)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true_false" id="tf" />
                <Label htmlFor="tf">True / False</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label>Options</Label>
            {optionList.map((opt, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correct"
                  checked={opt.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  className="mt-1"
                />
                <Input
                  value={opt.text}
                  onChange={(e) => {
                    const newList = [...optionList];
                    newList[index].text = e.target.value;
                    setOptionList(newList);
                  }}
                  placeholder={isMcq ? `Option ${index + 1}` : index === 0 ? "True" : "False"}
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : editingQuestion ? "Save Changes" : "Add Question"}
          </Button>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state.success && <p className="text-sm text-green-600">Saved successfully!</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}