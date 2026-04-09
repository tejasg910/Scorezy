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
      <DialogTrigger >
        <Button variant="outline" className="border-dashed">
          📦 Bulk Add Questions (JSON)
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Add Multiple Questions</DialogTitle>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <form action={action} className="flex flex-col flex-1 overflow-hidden">
          <input type="hidden" name="quizId" value={quizId} />

          <div className="flex-1 overflow-auto py-4 pr-2">
            <Label className="mb-2 block">Paste JSON Array</Label>
            <Textarea
              name="questionsJson"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "questions": [\n    {\n      "body": "What is the capital of France?",\n      "type": "mcq",\n      "marks": 2,\n      "options": [\n        { "text": "Paris", "isCorrect": true }\n      ]\n    }\n  ]\n}`}
              className="font-mono text-sm min-h-[400px] resize-y"
            />
          </div>

          {/* Fixed Footer with Button */}
          <div className="pt-6 border-t mt-4 sticky bottom-0">
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Creating Questions..." : "Add Questions to Quiz"}
            </Button>
          </div>

          {/* Messages */}
          {state.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.success && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                ✅ Successfully added {state.createdCount} questions!
              </AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}