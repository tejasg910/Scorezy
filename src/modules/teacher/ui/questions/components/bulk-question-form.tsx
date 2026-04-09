"use client";

import { useActionState, useState, useEffect } from "react";
import { bulkCreateQuestions } from "@/modules/teacher/server/actions/question.action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  quizId: string;
};

export function BulkAddQuestionsDialog({ quizId }: Props) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(bulkCreateQuestions, {});

  const [jsonInput, setJsonInput] = useState("");

  // Auto-close on success
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        setOpen(false);
        setJsonInput("");
      }, 1500);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 h-14">
            📦 Bulk Add Questions (JSON)
          </Button>
        }
      />

      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col border-white/10 bg-[#0a0a0f] text-[#f0eeff] rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold tracking-tight">Bulk Add Multiple Questions</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <form action={action} className="flex flex-col flex-1 overflow-hidden">
          <input type="hidden" name="quizId" value={quizId} />

          <div className="flex-1 overflow-auto py-6 pr-2 space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Paste JSON Assessment Vault</Label>
            <Textarea
              name="questionsJson"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "questions": [\n    {\n      "body": "What is the capital of France?",\n      "type": "mcq",\n      "marks": 2,\n      "options": [\n        { "text": "Paris", "isCorrect": true }\n      ]\n    }\n  ]\n}`}
              className="font-mono text-sm min-h-[400px] resize-y bg-white/5 border-white/5 text-[#f0eeff] focus:border-[#8b5cf6]/50 rounded-none transition-all p-6"
            />
          </div>

          {/* Fixed Footer with Button */}
          <div className="pt-6 border-t border-white/5 mt-4 sticky bottom-0 bg-[#0a0a0f]">
            <Button type="submit" variant="luxury" disabled={pending} className="w-full h-14 text-lg">
              {pending ? "Sealing Questions..." : "Vault Questions to Quiz"}
            </Button>
          </div>

          {/* Messages */}
          {state.error && (
            <Alert variant="destructive" className="mt-4 rounded-none border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400 font-bold tracking-tight">{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert className="mt-4 rounded-none border-[#8b5cf6]/20 bg-[#8b5cf6]/10">
              <AlertDescription className="text-[#b18aff] font-bold tracking-tight">
                ✅ Successfully vaulted {state.createdCount} questions!
              </AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}