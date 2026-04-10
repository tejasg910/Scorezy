import { getSession } from "@/app/auth/lib/session";
import { redirect } from "next/navigation";
import {
  getClassroomStudents,
  getClassroomName,
} from "../../server/actions/student.queries";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, ChevronRight, ArrowLeft, GraduationCap } from "lucide-react";
import { Pagination } from "@/components/pagination";

type Props = { classroomId: string; page?: number };

export default async function StudentsInClassroom({ classroomId, page = 1 }: Props) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  const [studentsResult, classroomName] = await Promise.all([
    getClassroomStudents(classroomId, page, 10),
    getClassroomName(classroomId),
  ]);

  const { students, totalPages, currentPage } = studentsResult;

  return (
    <div className="p-6 pt-32 lg:pt-20 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl space-y-8">

        {/* Breadcrumb */}
        <Link
          href={`/teacher/dashboard/${classroomId}`}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#b18aff] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to {classroomName}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
              Students
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              {classroomName} · {students.length} enrolled
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5">
            <Users className="w-4 h-4 text-[#8b5cf6]" />
            <span className="text-sm font-bold text-[#f0eeff] tabular-nums">
              {students.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
              enrolled
            </span>
          </div>
        </div>

        {/* Student list */}
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <GraduationCap className="w-12 h-12 text-white/10" />
            <p className="text-[#71717a] text-sm font-medium">
              No students have enrolled yet.
            </p>
            <p className="text-[#52525b] text-xs">
              Share the invite code{" "}
              <span className="font-mono text-[#8b5cf6]">
                with your class
              </span>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {students.map((s) => (
              <Link
                key={s.studentId}
                href={`/teacher/dashboard/${classroomId}/students/${s.studentId}`}
                className="group block"
              >
                <Card className="border-white/5 bg-[#15151e] hover:border-[#8b5cf6]/40 transition-all duration-200 rounded-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-5 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-none bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center shrink-0 text-[#b18aff] font-heading font-bold text-sm uppercase">
                      {s.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-[#f0eeff] truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-[#71717a] truncate">{s.email}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525b]">
                          Joined
                        </p>
                        <p className="text-xs text-[#71717a]">
                          {new Date(s.joinedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 bg-white/5">
                        <BookOpen className="w-3 h-3 text-[#8b5cf6]" />
                        <span className="text-[10px] font-bold text-[#f0eeff] tabular-nums">
                          {s.attemptCount}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
                          attempts
                        </span>
                      </div>

                      <ChevronRight className="w-4 h-4 text-[#52525b] group-hover:text-[#b18aff] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/teacher/dashboard/${classroomId}/students`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
