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
    <div className="p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Completed Tests
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your past test attempts and scores
            </p>
          </div>
        </div>

        {sortedAttempts.length === 0 ? (
          <div className="text-center py-12 border border-dashed bg-background">
            <h3 className="mt-2 text-sm font-semibold text-foreground">No attempts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Go to the Tests tab to start your first quiz!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAttempts.map((attempt) => {
              const isSubmitted = !!attempt.submittedAt;
              const passed = isSubmitted && attempt.score !== null && (attempt.passingMarks === null || attempt.score >= attempt.passingMarks);
              
              return (
                <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{attempt.quizTitle}</CardTitle>
                      {isSubmitted ? (
                        passed ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 border-none">Passed</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 border-none">Failed</Badge>
                        )
                      ) : (
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/10 border-none">
                           Ongoing
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-2 text-xs">
                      <Clock className="w-3 h-3" />
                      Started: {attempt.startedAt.toLocaleDateString()} {attempt.startedAt.toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {attempt.score} <span className="text-base font-normal text-muted-foreground">/ {attempt.total}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Passing marks: {attempt.passingMarks || 0}
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground py-2 italic flex items-center justify-center">
                        This test is still in progress
                      </div>
                    )}
                  </CardContent>
                  {!isSubmitted && (
                     <CardFooter className="bg-muted/50 border-t px-6 py-4">
                       <Link href={`/student/tests/${attempt.quizId}`} className="w-full">
                         <Button className="w-full" variant="outline">Resume Test</Button>
                       </Link>
                     </CardFooter>
                  )}
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
