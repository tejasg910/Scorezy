import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getStudentAttempts } from "../../server/actions/student.queries";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function StudentScoresRoot() {
  const session = await getSession();
  
  if (!session) return <SignInPage />;
  
  const studentData = session.user;
  const attempts = await getStudentAttempts(studentData.id);

  // Sorting in JS by startedAt desc
  const sortedAttempts = [...attempts].sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

  return (
    <div className="p-6 pt-32 lg:pt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
              Completed <span className="text-[#8b5cf6]">Tests</span>
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Review your past performance and assessment archives.
            </p>
          </div>
        </div>

        {sortedAttempts.length === 0 ? (
          <div className="text-center py-20 border border-white/5 border-dashed rounded-none bg-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-heading font-bold text-[#f0eeff]">No attempts yet</h3>
            <p className="mt-2 text-[#a1a1aa] max-w-xs mx-auto">
              Go to the Tests tab to start your first performance challenge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAttempts.map((attempt) => {
              const isSubmitted = !!attempt.submittedAt;
              const passed = isSubmitted && attempt.score !== null && (attempt.passingMarks === null || attempt.score >= attempt.passingMarks);
              
              return (
                <Card key={attempt.id} className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardHeader className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-heading font-bold tracking-tight text-[#f0eeff] line-clamp-1">{attempt.quizTitle}</CardTitle>
                      {isSubmitted ? (
                        passed ? (
                          <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">Passed</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">Failed</span>
                        )
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse">
                           Ongoing
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
                      <Clock className="w-3.5 h-3.5" />
                      Started {attempt.startedAt.toLocaleDateString()}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-8">
                    {isSubmitted ? (
                      <div className="space-y-1">
                        <div className="text-4xl font-heading font-extrabold text-[#f0eeff]">
                          {attempt.score} <span className="text-sm font-bold text-[#71717a] uppercase tracking-widest">/ {attempt.total}</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b5cf6]">
                          Benchmark: {attempt.passingMarks || 0}
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-[#71717a] py-6 italic border border-white/5 text-center bg-white/5 uppercase font-bold tracking-widest">
                        Performance Pending
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="bg-white/5 border-t border-white/5 px-6 py-6 mt-auto">
                    {isSubmitted ? (
                      <Link href={`/student/scores/${attempt.id}`} className="w-full">
                        <Button variant="outline" className="w-full h-12 text-sm rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] transition-all font-heading font-bold uppercase tracking-widest">
                          Review Results
                        </Button>
                      </Link>
                    ) : (
                       <Link href={`/student/tests/${attempt.quizId}`} className="w-full">
                         <Button className="w-full h-12 text-sm" variant="luxury">Resume Test</Button>
                       </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
