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
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ClassroomState } from "../../../types/classroom";

export function AddClassRoomDialog({ canCreate = true }: { canCreate?: boolean }) {
  const { data } = useSession();

  const [state, action, pending] = useActionState<ClassroomState, FormData>(
  createClassroom,
  {}
);

  // ── Limit reached — show upgrade prompt instead of dialog ──
  if (!canCreate) {
    return (
      <div className="flex flex-col items-end gap-2">
        <Button variant="luxury" disabled className="opacity-50 cursor-not-allowed">
          Add Class Room
        </Button>
        <Link
          href="/teacher/billing"
          className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] hover:text-[#b18aff] transition-colors"
        >
          ✦ Upgrade to Pro for unlimited classrooms →
        </Link>
      </div>
    );
  }

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