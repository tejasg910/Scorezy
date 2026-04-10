import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getEnrolledClasses } from "../../server/actions/student.queries";
import { EnrollClassDialog } from "./components/enroll-dialog";
import { ClassList } from "./components/class-list";
import { Pagination } from "@/components/pagination";

export default async function StudentRoot({ page = 1 }: { page?: number }) {
  const session = await getSession();
  
  if (!session) return <SignInPage />;
  
  const studentData = session.user;
  const classes = await getEnrolledClasses(studentData.id);

  const limit = 10;
  const totalPages = Math.ceil(classes.length / limit);
  const offset = (page - 1) * limit;
  const paginatedClasses = classes.slice(offset, offset + limit);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0eeff] p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">
              Welcome, <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">{studentData.name}</span>
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Ready to master your classes today?
            </p>
          </div>

          <div className="flex items-center gap-4">
            <EnrollClassDialog studentId={studentData.id} />
          </div>
        </div>

        {/* Content */}
        <div>
          <ClassList data={paginatedClasses} />
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/student/dashboard"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
