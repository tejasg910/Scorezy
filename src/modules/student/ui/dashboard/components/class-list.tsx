import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import Link from "next/link";

export function ClassList({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 border-dashed rounded-[var(--radius)] bg-white/5 backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
          <Users className="w-6 h-6 text-[#71717a]" />
        </div>
        <h3 className="text-lg font-heading font-bold text-[#f0eeff]">No classes yet</h3>
        <p className="mt-2 text-[#a1a1aa] max-w-xs mx-auto">
          Get started by enrolling in your first classroom using an invite code provided by your teacher.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((classroom) => (
        <Link key={classroom.id} href={`/student/classrooms/${classroom.id}`} className="block">
          <Card className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight text-[#f0eeff]">{classroom.name}</CardTitle>
                  <div className="flex items-center gap-2 text-[#71717a]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Joined {new Date(classroom.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="bg-white/5 border-t border-white/5 px-6 py-4 mt-auto">
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-[#a1a1aa]">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Active Seat
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
                  Student Access
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
