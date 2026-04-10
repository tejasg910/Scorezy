import StudentsInClassroom from "@/modules/teacher/ui/students";
import { getSession } from "@/app/auth/lib/session";
import { redirect } from "next/navigation";

export default async function StudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "teacher") redirect("/student/dashboard");

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;

  return <StudentsInClassroom classroomId={id} page={page} />;
}
