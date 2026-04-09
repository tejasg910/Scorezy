"use client";

import { useActionState, useEffect, useState } from "react";
import { saveQuiz } from "@/modules/teacher/server/actions/quiz.actions";
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
  trigger?: React.ReactElement;
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
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger
          render={
            <Button variant="luxury">
              {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
            </Button>
          }
        />
      )}

      <DialogContent className="max-w-md border-white/10 bg-[#0a0a0f] text-[#f0eeff] rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold tracking-tight">
            {editingQuiz ? "Edit Quiz" : "Create New Quiz"}
          </DialogTitle>
        </DialogHeader>

        <form action={action} className="space-y-5">
          <input type="hidden" name="quizId" value={editingQuiz?.id || ""} />
          <input type="hidden" name="classroomId" value={classroomId} />
          <input type="hidden" name="teacherId" value={data?.user?.id || ""} />

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Quiz Title</Label>
            <Input
              name="title"
              defaultValue={editingQuiz?.title}
              placeholder="Enter quiz title"
              required
              className="bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 rounded-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Description</Label>
            <Textarea
              name="description"
              defaultValue={editingQuiz?.description || ""}
              placeholder="Short description (optional)"
              rows={3}
              className="bg-white/5 border-white/10 text-[#f0eeff] focus:border-[#8b5cf6]/50 rounded-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Status</Label>
              <Select name="status" defaultValue={editingQuiz?.status || "draft"}>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#f0eeff] h-12 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#15151e] border-white/10 text-[#f0eeff] rounded-none">
                  <SelectItem value="draft" className="focus:bg-white/5">Draft</SelectItem>
                  <SelectItem value="published" className="focus:bg-white/5">Published</SelectItem>
                  <SelectItem value="closed" className="focus:bg-white/5">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Time (mins)</Label>
              <Input
                name="timeLimit"
                type="number"
                defaultValue={editingQuiz?.timeLimit || ""}
                placeholder="30"
                min={1}
                max={180}
                required
                className="bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 rounded-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Passing Marks</Label>
            <Input
              name="passingMarks"
              type="number"
              defaultValue={editingQuiz?.passingMarks || ""}
              placeholder="e.g. 60"
              min={0}
              required
              className="bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 rounded-none transition-all"
            />
          </div>

          <Button type="submit" variant="luxury" disabled={pending} className="w-full h-12 text-base">
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