"use client";

import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { joinPublicClassroom } from "@/modules/student/server/actions/student.actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function PublicClassList({ data, studentId }: { data: any[], studentId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="text-center py-20 border border-white/5 border-dashed rounded-none bg-white/5 backdrop-blur-sm">
        <h3 className="text-lg font-heading font-bold text-[#f0eeff]">No public classrooms</h3>
        <p className="mt-2 text-[#a1a1aa] max-w-xs mx-auto">
          There are no public classrooms available to join at this moment. Check back later!
        </p>
      </div>
    );
  }

  const handleJoin = (classId: string) => {
    setLoadingId(classId);
    startTransition(async () => {
      const result = await joinPublicClassroom(studentId, classId);
      setLoadingId(null);
      if (result.success) {
        router.push("/student/dashboard"); // Or wherever to show success
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((cls) => (
        <Card key={cls.id} className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none flex flex-col">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="flex-1 space-y-4">
            <div className="w-12 h-12 rounded-none bg-[#8b5cf6]/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-xl font-heading font-bold tracking-tight text-[#f0eeff]">{cls.name}</CardTitle>
            </div>
          </CardHeader>

          <CardFooter className="bg-white/5 border-t border-white/5 px-6 py-6 mt-auto">
            <Button 
              className="w-full h-12 text-base" 
              variant="luxury" 
              onClick={() => handleJoin(cls.id)}
              disabled={loadingId === cls.id || isPending}
            >
              {loadingId === cls.id ? "Joining..." : "Join Class"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
