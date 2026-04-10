import { getSession } from "@/app/auth/lib/session";
import { redirect } from "next/navigation";
import {
  getStudentAttemptsInClassroom,
  getClassroomName,
} from "../../server/actions/student.queries";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle, Clock, BookOpen } from "lucide-react";
import { Pagination } from "@/components/pagination";

type Props = { classroomId: string; studentId: string; studentName: string; page?: number };

export default async function StudentDetail({ classroomId, studentId, studentName, page = 1 }: Props) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");

  const [attempts, classroomName] = await Promise.all([
    getStudentAttemptsInClassroom(studentId, classroomId),
    getClassroomName(classroomId),
  ]);

  const submitted = attempts.filter((a) => a.submittedAt);
  const totalScore = submitted.reduce((s, a) => s + (a.score ?? 0), 0);
  const totalMax = submitted.reduce((s, a) => s + (a.total ?? 0), 0);

  const limit = 10;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(attempts.length / limit);
  const paginatedAttempts = attempts.slice(offset, offset + limit);

  return (
    <div className="p-6 pt-32 lg:pt-20 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl space-y-8">

        {/* Breadcrumb */}
        <Link
          href={`/teacher/dashboard/${classroomId}/students`}
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a] hover:text-[#b18aff] transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to {classroomName} · Students
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center font-heading font-bold text-xl text-[#b18aff] uppercase shrink-0">
              {studentName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
                {studentName}
              </h1>
              <p className="text-[#a1a1aa] text-sm">{classroomName}</p>
            </div>
          </div>

          {/* Aggregate stats */}
          <div className="flex flex-wrap w-full md:w-auto gap-3 mt-4 md:mt-0">
            <div className="flex-1 md:flex-none px-4 py-3 border border-white/10 bg-[#15151e] text-center">
              <p className="text-2xl font-heading font-extrabold text-[#f0eeff] tabular-nums">
                {submitted.length}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#52525b]">
                Submitted
              </p>
            </div>
            <div className="flex-1 md:flex-none px-4 py-3 border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 text-center">
              <p className="text-2xl font-heading font-extrabold text-[#b18aff] tabular-nums">
                {totalMax > 0 ? `${Math.round((totalScore / totalMax) * 100)}%` : "—"}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#52525b]">
                Avg Score
              </p>
            </div>
          </div>
        </div>

        {/* Attempts */}
        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <BookOpen className="w-12 h-12 text-white/10" />
            <p className="text-[#71717a] text-sm font-medium">
              No quiz attempts yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {paginatedAttempts.map((attempt) => {
              const isSubmitted = !!attempt.submittedAt;
              const passed =
                isSubmitted &&
                attempt.score !== null &&
                (attempt.passingMarks === null ||
                  attempt.score! >= attempt.passingMarks!);
              const pct =
                attempt.total && attempt.score !== null
                  ? Math.round((attempt.score! / attempt.total) * 100)
                  : null;

              return (
                <Link
                  key={attempt.id}
                  href={`/teacher/dashboard/${classroomId}/students/${studentId}/attempts/${attempt.id}`}
                  className="group block"
                >
                  <Card className="border-white/5 bg-[#15151e] hover:border-[#8b5cf6]/40 transition-all duration-200 rounded-none overflow-hidden">
                    <CardContent className="p-5 flex items-center gap-4">
                      {/* Status icon */}
                      <div className="shrink-0">
                        {!isSubmitted ? (
                          <Clock className="w-5 h-5 text-yellow-500/60" />
                        ) : passed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>

                      {/* Quiz title */}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-[#f0eeff] truncate">
                          {attempt.quizTitle}
                        </p>
                        <p className="text-xs text-[#71717a]">
                          {isSubmitted
                            ? `Submitted · ${new Date(attempt.submittedAt!).toLocaleDateString()}`
                            : "In progress"}
                        </p>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4 shrink-0">
                        {isSubmitted && (
                          <div className="text-right">
                            <p
                              className={`text-xl font-heading font-extrabold tabular-nums ${
                                passed ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {attempt.score} / {attempt.total}
                            </p>
                            {pct !== null && (
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#52525b]">
                                {pct}%
                              </p>
                            )}
                          </div>
                        )}

                        <span
                          className={`text-[10px] px-3 py-1 font-bold uppercase tracking-widest border ${
                            !isSubmitted
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : passed
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                        >
                          {!isSubmitted ? "In Progress" : passed ? "Pass" : "Fail"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  baseUrl={`/teacher/dashboard/${classroomId}/students/${studentId}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
