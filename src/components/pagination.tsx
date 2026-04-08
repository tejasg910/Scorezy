// components/ui/pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;           // e.g. "/teacher/dashboard/[classroomId]/[quizId]"
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        
      >
        <Link href={createPageUrl(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>
      </Button>

      {/* Page Info */}
      <div className="text-sm text-gray-600 font-medium px-4">
        Page <span className="text-black">{currentPage}</span> of {totalPages}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        
      >
        <Link href={createPageUrl(currentPage + 1)}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}