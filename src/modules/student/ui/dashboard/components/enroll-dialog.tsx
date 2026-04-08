"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { enrollStudentAction } from "../../../server/actions/student.actions";
import { useRouter } from "next/navigation";

export function EnrollClassDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    
    setLoading(true);
    setError("");
    
    const result = await enrollStudentAction(studentId, inviteCode.trim());
    
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      setInviteCode("");
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Enroll Classroom
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enroll in a Classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEnroll} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Invite Code</label>
            <Input 
              placeholder="Enter your teacher's invite code..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !inviteCode.trim()}>
              {loading ? "Enrolling..." : "Enroll"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
