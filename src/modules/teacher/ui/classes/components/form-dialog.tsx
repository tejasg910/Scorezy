"use client";

import { useActionState } from "react";
import { createClassroom } from "@/modules/teacher/server/actions/classroom.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useSession } from "@/lib/auth-client";
import { ClassroomState } from "../../../types/classroom";

export function AddClassRoomDialog() {
  const { data } = useSession();

  const [state, action, pending] = useActionState<ClassroomState, FormData>(
  createClassroom,
  {}
);

  return (
    <Dialog>
      <DialogTrigger 
        render={
          <Button variant="luxury">Add Class Room</Button>
        }
      />

      <DialogContent className="border-white/10 bg-[#0a0a0f] text-[#f0eeff]">
        <DialogHeader>
          <DialogTitle>Create New Class Room</DialogTitle>
        </DialogHeader>

        {/* FORM = modern Next.js pattern */}
        <form action={action} className="space-y-4 pt-2">
          
          {/* hidden teacherId */}
          <input type="hidden" name="teacherId" value={data?.user?.id || ""} />

          <Input
            name="name"
            placeholder="Classroom name"
            required
            className="bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 transition-all"
          />

          <Button type="submit" variant="luxury" disabled={pending} className="w-full  text-base">
            {pending ? "Creating..." : "Create Class Room"}
          </Button>

          {/* error handling */}
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          {/* success message */}
          {state?.success && (
            <p className="text-sm text-green-600">
              Classroom created successfully
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}