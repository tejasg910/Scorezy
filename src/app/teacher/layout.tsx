// app/teacher/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "../auth/lib/session";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "teacher") redirect("/student/dashboard");

  return <>{children}</>;
}