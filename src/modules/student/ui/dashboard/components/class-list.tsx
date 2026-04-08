import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

export function ClassList({ data }: { data: any[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-[var(--radius)] bg-background">
        <h3 className="mt-2 text-sm font-semibold text-foreground">No classes</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by enrolling in your first classroom using an invite code.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((classroom) => (
        <Card key={classroom.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{classroom.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  Joined: {new Date(classroom.joinedAt).toLocaleDateString()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="bg-muted border-t px-6 py-4">
            <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> Enrolled
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
