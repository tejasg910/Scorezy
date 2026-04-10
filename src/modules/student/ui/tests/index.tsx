import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getStudentQuizzes } from "../../server/actions/student.queries";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { TestsClientList } from "./tests-client";

export default async function StudentTestsRoot() {
  const session = await getSession();
  
  if (!session) return <SignInPage />;
  
  const studentData = session.user;
  const quizzes = await getStudentQuizzes(studentData.id);

  // We should maybe filter out "draft" status? Wait, getStudentQuizzes currently fetches all. Let's filter published.
  const activeQuizzes = quizzes.filter(q => q.status === "published");

  return (
    <div className="p-6 pt-32 lg:pt-20">
      <div className="max-w-6xl space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
              Available <span className="text-[#8b5cf6]">Tests</span>
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Assessments assigned to your enrolled classrooms.
            </p>
          </div>
        </div>

        <TestsClientList activeQuizzes={activeQuizzes} />

      </div>
    </div>
  );
}
