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
    <div className="p-6 pt-32 lg:pt-20">
      <div className="max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-extrabold tracking-tight text-[#f0eeff]">
              Classrooms
            </h1>
            <p className="text-[#a1a1aa] text-lg">
              Manage and organize your elite educational spaces.
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