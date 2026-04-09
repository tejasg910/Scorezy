import { redirect } from "next/navigation";
import { getSession } from "../auth/lib/session";
import { StudentNav } from "@/modules/student/ui/components/student-nav";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "student") redirect("/teacher/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <StudentNav />
      {children}
    </div>
  );
}
