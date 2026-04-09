// app/teacher/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "../auth/lib/session";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "teacher") redirect("/student/dashboard");

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="pl-20 md:pl-64 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}