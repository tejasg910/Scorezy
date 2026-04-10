import StudentDetail from "@/modules/teacher/ui/students/student-detail";
import { getSession } from "@/app/auth/lib/session";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { user, enrollments } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function StudentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; studentId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "teacher") redirect("/student/dashboard");

  const { id: classroomId, studentId } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;

  // Fetch student name + verify they're enrolled
  const [studentRow] = await db
    .select({ name: user.name })
    .from(user)
    .innerJoin(enrollments, and(
      eq(enrollments.studentId, user.id),
      eq(enrollments.classroomId, classroomId)
    ))
    .where(eq(user.id, studentId))
    .limit(1);

  if (!studentRow) return notFound();

  return (
    <StudentDetail
      classroomId={classroomId}
      studentId={studentId}
      studentName={studentRow.name}
      page={page}
    />
  );
}
