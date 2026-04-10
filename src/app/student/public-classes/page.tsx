import { getSession } from "@/app/auth/lib/session";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getPublicClassrooms } from "@/modules/student/server/actions/student.queries";
import { PublicClassList } from "./components/public-class-list";

export default async function PublicClassesPage() {
  const session = await getSession();
  
  if (!session) return <SignInPage />;
  
  const studentData = session.user;
  const publicClasses = await getPublicClassrooms(studentData.id);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0eeff] p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">
              Explore <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">Public Classrooms</span>
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Discover and join open environments immediately.
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <PublicClassList data={publicClasses} studentId={studentData.id} />
        </div>

      </div>
    </div>
  );
}
