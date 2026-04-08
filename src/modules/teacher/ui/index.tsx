import { getSession } from "@/app/auth/lib/session";
import { getClassrooms } from "../server/classroom.queries";
import { ClassroomList } from "./components/class-list";
import { AddQuizDialog } from "./components/quiz-form-dialog";
import SignInPage from "@/modules/auth/components/sign-in/page";

export default async function CLassRoom() {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const classRoomData = await getClassrooms(user?.user.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Classrooms
            </h1>
            <p className="text-sm text-gray-500">
              Manage and organize your classrooms
            </p>
          </div>

          {/* keep your dialog here */}
          <div>
            <AddQuizDialog />
          </div>
        </div>

        {/* Content */}
        <div>
          <ClassroomList data={classRoomData} />
        </div>

      </div>
    </div>
  );
}