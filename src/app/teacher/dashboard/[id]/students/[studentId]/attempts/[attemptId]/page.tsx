import { getSession } from "@/app/auth/lib/session";
import { redirect, notFound } from "next/navigation";
import { getAttemptDetailsForTeacher } from "@/modules/student/server/actions/student.queries";
import { AttemptDetailsUI } from "@/modules/student/ui/scores/details";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TeacherAttemptViewPage({
  params,
}: {
  params: Promise<{ id: string; studentId: string; attemptId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "teacher") redirect("/student/dashboard");

  const { id: classroomId, studentId, attemptId } = await params;

  const attempt = await getAttemptDetailsForTeacher(attemptId);
  if (!attempt) return notFound();

  return (
    <div>
      {/* Back link — overlaid above the AttemptDetailsUI */}
      <div className="fixed top-4 left-72 z-50">
        <Link
          href={`/teacher/dashboard/${classroomId}/students/${studentId}`}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#b18aff] transition-colors bg-[#0a0a0f]/80 backdrop-blur px-3 py-2 border border-white/10"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Student
        </Link>
      </div>

      {/* Reuse the exact same AttemptDetailsUI the student sees */}
      <AttemptDetailsUI attempt={attempt} />
    </div>
  );
}
