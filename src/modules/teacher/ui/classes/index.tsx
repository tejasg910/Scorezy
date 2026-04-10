import { getSession } from "@/app/auth/lib/session";
import { getClassrooms } from "../../server/actions/classroom.queries";
import { ClassroomList } from "./components/class-list";
import { AddClassRoomDialog } from "./components/form-dialog";
import SignInPage from "@/modules/auth/components/sign-in/page";
import { getEntitlements } from "@/modules/billing/server/actions/entitlements.action";
import { PlanUsageBanner } from "@/modules/billing/ui/components/plan-usage-banner";
import { Pagination } from "@/components/pagination";

export default async function CLassRoom({ page = 1 }: { page?: number }) {
  const user = await getSession();
  if (!user) return <SignInPage />;
  const [classRoomData, entitlements] = await Promise.all([
    getClassrooms(user?.user.id),
    getEntitlements(),
  ]);

  const limit = 10;
  const totalPages = Math.ceil(classRoomData.length / limit);
  const offset = (page - 1) * limit;
  const paginatedData = classRoomData.slice(offset, offset + limit);

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
            {/* Usage counters — sits right beneath the subtitle */}
            <div className="pt-2">
              <PlanUsageBanner entitlements={entitlements} />
            </div>
          </div>

          {/* keep your dialog here */}
          <div>
            <AddClassRoomDialog canCreate={entitlements?.canCreateClassroom ?? true} />
          </div>
        </div>

        {/* Content */}
        <div>
          <ClassroomList data={paginatedData} />
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/teacher/dashboard"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}