import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getEnrolledClasses } from "../../server/actions/student.queries";
import { EnrollClassDialog } from "./components/enroll-dialog";
import { ClassList } from "./components/class-list";

export default async function StudentRoot() {
  const session = await getSession();
  
  if (!session) return <SignInPage />;
  
  const studentData = session.user;
  const classes = await getEnrolledClasses(studentData.id);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome, {studentData.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here are your enrolled classes
            </p>
          </div>

          <div>
            <EnrollClassDialog studentId={studentData.id} />
          </div>
        </div>

        {/* Content */}
        <div>
          <ClassList data={classes} />
        </div>

      </div>
    </div>
  );
}
