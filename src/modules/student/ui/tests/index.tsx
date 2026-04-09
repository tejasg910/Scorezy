import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getStudentQuizzes } from "../../server/actions/student.queries";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";
import Link from "next/link";

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

        {activeQuizzes.length === 0 ? (
          <div className="text-center py-20 border border-white/5 border-dashed rounded-none bg-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-heading font-bold text-[#f0eeff]">No active tests</h3>
            <p className="mt-2 text-[#a1a1aa] max-w-xs mx-auto">
              You are all caught up! Check back later or explore your classes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuizzes.map((quiz) => (
              <Card key={quiz.id} className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-heading font-bold tracking-tight text-[#f0eeff]">{quiz.title}</CardTitle>
                    {quiz.description && (
                      <CardDescription className="line-clamp-2 text-[#a1a1aa] text-sm leading-relaxed">
                        {quiz.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5 overflow-hidden">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Duration</span>
                      <span className="flex items-center gap-2 text-xs text-[#f0eeff] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" /> {quiz.timeLimit} mins
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Passing</span>
                      <span className="text-xs text-[#f0eeff] font-medium">{quiz.passingMarks} Marks</span>
                    </div>
                  </div>
                </CardHeader>

                <CardFooter className="bg-white/5 border-t border-white/5 px-6 py-6 mt-auto">
                  <Link href={`/student/tests/${quiz.id}`} className="w-full">
                    <Button className="w-full h-12 text-base" variant="luxury">
                      <PlayCircle className="w-5 h-5 mr-2" /> Start Test
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
