import { ClassroomCard } from "./class-list-card";

type Classroom = {
  id: string;
  teacherId: string;
  name: string;
  inviteCode: string;
  isActive: boolean;
  createdAt: string | Date;
};

export function ClassroomList({ data }: { data: Classroom[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((classroom) => (
        <ClassroomCard key={classroom.id} classroom={classroom} />
      ))}
    </div>
  );
}