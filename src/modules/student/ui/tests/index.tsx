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
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Available Tests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tests assigned to your enrolled classrooms
            </p>
          </div>
        </div>

        {activeQuizzes.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg bg-white">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No active tests</h3>
            <p className="mt-1 text-sm text-gray-500">
              You are all caught up! Check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <CardDescription className="line-clamp-2 mt-2">
                      {quiz.description}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 border-t pt-4 border-gray-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {quiz.timeLimit} mins
                    </span>
                    <span className="flex items-center gap-1">
                      Passing: {quiz.passingMarks}
                    </span>
                  </div>
                </CardHeader>
                <CardFooter className="bg-gray-50 rounded-b-xl border-t px-6 py-4 mt-auto">
                  <Link href={`/student/tests/${quiz.id}`} className="w-full">
                    <Button className="w-full" variant="default">
                      <PlayCircle className="w-4 h-4 mr-2" /> Start Test
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
