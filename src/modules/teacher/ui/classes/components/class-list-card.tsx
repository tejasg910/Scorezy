
import { Card, CardContent } from "@/components/ui/card";
import { Classroom } from "../../../types/classroom";
import Link from "next/link";
import ClassViewButton from "./view-button";


export function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">
            {classroom.name}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full ${classroom.isActive
                ? "bg-green-100/10 text-green-500"
                : "bg-muted text-muted-foreground"
              }`}
          >
            {classroom.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Invite Code */}
        <div className="text-sm text-muted-foreground">
          Invite Code:{" "}
          <span className="font-mono text-foreground">
            {classroom.inviteCode}
          </span>
        </div>

        {/* Created Date */}
        <div className="text-xs text-muted-foreground/60">
          Created:{" "}
          {new Date(classroom.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <ClassViewButton id={classroom.id} />


        </div>
      </CardContent>
    </Card>
  );
}