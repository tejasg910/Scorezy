"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveQuestion } from "@/modules/teacher/server/actions/question.action";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a0a0f] text-[#f0eeff] rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
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
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Assessment Inquiry</Label>
            <Textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your question here..."
              required
              rows={3}
              className="bg-white/5 border-white/5 text-[#f0eeff] focus:border-[#8b5cf6]/50 rounded-none transition-all text-lg font-medium"
            />
          </div>

          {/* Question Type */}
          <div className="space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Assessment Methodology</Label>
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
              className="flex flex-col sm:flex-row gap-6"
            >
              <div className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 group transition-all hover:border-[#8b5cf6]/50">
                <RadioGroupItem value="mcq" id="mcq" className="border-[#71717a] text-[#8b5cf6]" />
                <Label htmlFor="mcq" className="font-heading font-bold text-sm cursor-pointer">Multiple Choice</Label>
              </div>
              <div className="flex items-center gap-3 p-4 border border-white/5 bg-white/5 group transition-all hover:border-[#8b5cf6]/50">
                <RadioGroupItem value="true_false" id="tf" className="border-[#71717a] text-[#8b5cf6]" />
                <Label htmlFor="tf" className="font-heading font-bold text-sm cursor-pointer">True / False</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Vault Options</Label>
            <div className="grid grid-cols-1 gap-3">
              {optionList.map((opt, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-white/5 bg-white/5">
                  <div 
                    onClick={() => handleCorrectChange(index)}
                    className={`w-6 h-6 border-2 flex items-center justify-center cursor-pointer transition-all ${
                      opt.isCorrect ? "border-[#8b5cf6] bg-[#8b5cf6]" : "border-[#71717a] hover:border-[#a1a1aa]"
                    }`}
                  >
                    {opt.isCorrect && <div className="w-2 h-2 bg-white" />}
                  </div>
                  <Input
                    value={opt.text}
                    onChange={(e) => {
                      const newList = [...optionList];
                      newList[index].text = e.target.value;
                      setOptionList(newList);
                    }}
                    placeholder={isMcq ? `Define Option ${index + 1}` : index === 0 ? "True" : "False"}
                    required
                    className="flex-1 bg-transparent border-none text-[#f0eeff] h-auto p-0 focus-visible:ring-0 placeholder:text-[#71717a]"
                  />
                  {opt.isCorrect && (
                    <span className="text-[8px] font-bold uppercase tracking-widest text-[#8b5cf6]">Correct Key</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="luxury" disabled={pending} className="w-full h-14 text-lg">
            {pending ? "Seal Question..." : editingQuestion ? "Update Assessment" : "Vault Question"}
          </Button>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state.success && <p className="text-sm text-green-600">Saved successfully!</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}