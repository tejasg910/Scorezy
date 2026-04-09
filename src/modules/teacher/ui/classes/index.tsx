import { getSession } from "@/app/auth/lib/session";
import { getClassrooms } from "../../server/actions/classroom.queries";
import { ClassroomList } from "./components/class-list";
import { AddClassRoomDialog } from "./components/form-dialog";
import SignInPage from "@/modules/auth/components/sign-in/page";

export default async function CLassRoom() {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const classRoomData = await getClassrooms(user?.user.id);

  return (
    <div className="min-h-screen bg-background p-6 pt-32">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Classrooms
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your classrooms
            </p>
          </div>

          {/* keep your dialog here */}
          <div>
            <AddClassRoomDialog />
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