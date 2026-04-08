"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Classroom } from "../../types/classroom";


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
            className={`text-xs px-2 py-1 rounded-full ${
              classroom.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {classroom.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Invite Code */}
        <div className="text-sm text-gray-500">
          Invite Code:{" "}
          <span className="font-mono text-black">
            {classroom.inviteCode}
          </span>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-400">
          Created:{" "}
          {new Date(classroom.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline">
            View
          </Button>

          <Button size="sm">
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}