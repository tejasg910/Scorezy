import { Card, CardContent } from "@/components/ui/card";
import { Classroom } from "../../../types/classroom";
import Link from "next/link";
import ClassViewButton from "./view-button";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none">
      {/* top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <CardContent className="p-6 space-y-5">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-xl font-bold tracking-tight text-[#f0eeff]">
            {classroom.name}
          </h2>
          <span
            className={`text-[10px] px-3 py-1 font-bold uppercase tracking-widest shrink-0 ${
              classroom.isActive
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-white/5 text-[#71717a] border border-white/10"
            }`}
          >
            {classroom.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#71717a]">
          {/* Enrolled students */}
          <div className="flex flex-col gap-1">
            <span className="text-[#a1a1aa]/40">Students</span>
            <span className="flex items-center gap-1.5 text-[#f0eeff]">
              <Users className="w-3 h-3 text-[#8b5cf6]" />
              {classroom.studentCount ?? 0} enrolled
            </span>
          </div>

          {/* Invite Code */}
          <div className="flex flex-col gap-1">
            <span className="text-[#a1a1aa]/40">Invite Code</span>
            <span className="font-mono text-[#f0eeff] tracking-widest">
              {classroom.inviteCode}
            </span>
          </div>

          {/* Created Date */}
          <div className="flex flex-col gap-1">
            <span className="text-[#a1a1aa]/40">Created</span>
            <span>{new Date(classroom.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {/* View Quizzes */}
          <ClassViewButton id={classroom.id} />

          {/* View Students */}
          <Link href={`/teacher/dashboard/${classroom.id}/students`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 font-heading font-bold uppercase tracking-widest text-[10px] h-9 px-4"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              View Students
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}