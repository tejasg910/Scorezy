import { redirect } from "next/navigation";
import { getSession } from "../auth/lib/session";
import Link from "next/link";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/auth/sign-in");
  if (session.user.role !== "student") redirect("/teacher/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <nav className="bg-background/80 backdrop-blur border-b border-border px-6 pt-4 pb-0 flex gap-6 text-sm font-medium text-muted-foreground sticky top-20 z-40">
        <Link href="/student/dashboard" className="px-1 pb-4 hover:text-foreground hover:border-foreground border-b-2 border-transparent transition-colors">
          Dashboard
        </Link>
        <Link href="/student/tests" className="px-1 pb-4 hover:text-foreground hover:border-foreground border-b-2 border-transparent transition-colors">
          Tests
        </Link>
        <Link href="/student/scores" className="px-1 pb-4 hover:text-foreground hover:border-foreground border-b-2 border-transparent transition-colors">
          Completed Tests
        </Link>
      </nav>
      {children}
    </div>
  );
}
