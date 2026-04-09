"use client";

import { useActionState } from "react";
import { createClassroom } from "../../../server/actions/classroom/classroom.actions";

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
      <DialogTrigger >
        <Button>Add Class Room</Button>
      </DialogTrigger>

      <DialogContent>
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
          />

          <Button type="submit" disabled={pending} className="w-full">
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