// app/teacher/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "../auth/lib/session";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  if (!user) redirect("/auth/sign-in");

  return <>{children}</>;
}