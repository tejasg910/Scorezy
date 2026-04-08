"use client";

import { useActionState } from "react";
import { createQuiz } from "@/modules/teacher/server/actions/quiz/quiz.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { QuizState } from "@/modules/teacher/types/quiz";

type AddQuizDialogProps = {
  classroomId: string;
};

export function AddQuizDialog({ classroomId }: AddQuizDialogProps) {
  const { data } = useSession();

  const [state, action, pending] = useActionState<QuizState, FormData>(
    createQuiz,
    {}
  );

  return (
    <Dialog>
      <DialogTrigger >
        <Button>Create New Quiz</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-4 pt-2">
          <input type="hidden" name="classroomId" value={classroomId} />
          <input type="hidden" name="teacherId" value={data?.user?.id || ""} />

          <Input name="title" placeholder="Quiz Title" required />

          <Textarea
            name="description"
            placeholder="Quiz Description (optional)"
            rows={3}
          />

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating Quiz..." : "Create Quiz"}
          </Button>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state?.success && (
            <p className="text-sm text-green-600">Quiz created successfully!</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}