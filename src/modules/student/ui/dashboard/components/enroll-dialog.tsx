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
      <DialogTrigger 
        render={
          <Button variant="luxury" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Enroll Classroom
          </Button>
        }
      />
      <DialogContent className="border-white/10 bg-[#0a0a0f] text-[#f0eeff]">
        <DialogHeader>
          <DialogTitle>Enroll in a Classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEnroll} className="space-y-6 pt-4">
          <div className="space-y-3">
            <label className="text-sm font-bold tracking-widest text-[#71717a] uppercase font-heading">Invite Code</label>
            <Input 
              placeholder="Enter your teacher's invite code..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={loading}
              className="bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 transition-all"
            />
            {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              type="submit" 
              variant="luxury" 
              className="w-full h-12 text-base"
              disabled={loading || !inviteCode.trim()}
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="w-full border-white/10 text-[#71717a] hover:text-[#f0eeff]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
