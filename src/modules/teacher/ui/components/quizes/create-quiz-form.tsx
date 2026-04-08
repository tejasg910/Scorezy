"use client";

import { useActionState, useEffect, useState } from "react";
import { saveQuiz } from "@/modules/teacher/server/actions/quiz/quiz.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import type { Quiz } from "@/modules/teacher/types/quiz";

type Props = {
  classroomId: string;
  editingQuiz?: Quiz | null;
  trigger?: React.ReactNode;
};

export function AddEditQuizDialog({ classroomId, editingQuiz, trigger }: Props) {
  const { data } = useSession();
  const [open, setOpen] = useState(false);

  const [state, action, pending] = useActionState(saveQuiz, {});

  useEffect(() => {
    if (editingQuiz) setOpen(true);
  }, [editingQuiz]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger >{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger>
          <Button>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <input type="hidden" name="quizId" value={editingQuiz?.id || ""} />
          <input type="hidden" name="classroomId" value={classroomId} />
          <input type="hidden" name="teacherId" value={data?.user?.id || ""} />

          <div className="space-y-2">
            <Label>Quiz Title</Label>
            <Input
              name="title"
              defaultValue={editingQuiz?.title}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              defaultValue={editingQuiz?.description || ""}
              placeholder="Short description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={editingQuiz?.status || "draft"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Limit (minutes)</Label>
              <Input
                name="timeLimit"
                type="number"
                defaultValue={editingQuiz?.timeLimit || ""}
                placeholder="30"
                min={1}
                max={180}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Passing Marks</Label>
            <Input
              name="passingMarks"
              type="number"
              defaultValue={editingQuiz?.passingMarks || ""}
              placeholder="e.g. 60"
              min={0}
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending 
              ? (editingQuiz ? "Updating..." : "Creating...") 
              : (editingQuiz ? "Update Quiz" : "Create Quiz")
            }
          </Button>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          {state?.success && (
            <p className="text-sm text-green-600">
              Quiz {editingQuiz ? "updated" : "created"} successfully!
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}