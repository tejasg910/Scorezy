"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "../../../types/quiz";

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const isActive = quiz.status === "published";

  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 space-y-3">
        {/* Title + Status */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{quiz.title}</h2>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              quiz.status === "published"
                ? "bg-green-100 text-green-700"
                : quiz.status === "closed"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {quiz.status === "published"
              ? "Published"
              : quiz.status === "closed"
              ? "Closed"
              : "Draft"}
          </span>
        </div>

        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
        )}

        {/* Dates */}
        <div className="text-xs text-gray-400 space-y-1">
          <div>Created: {new Date(quiz.createdAt).toLocaleDateString()}</div>
          
          {quiz.opensAt && (
            <div>Opens: {new Date(quiz.opensAt).toLocaleDateString()}</div>
          )}
          {quiz.closesAt && (
            <div>Closes: {new Date(quiz.closesAt).toLocaleDateString()}</div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline">
            View
          </Button>
          <Button size="sm">
            {quiz.status === "published" ? "Take Quiz" : "Edit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}