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
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        className="rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 h-12 px-6 font-heading font-bold tracking-widest uppercase text-xs"
        render={
          <Link href={createPageUrl(currentPage - 1)}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Link>
        }
      />

      {/* Page Info */}
      <div className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#71717a] px-4">
        Page <span className="text-[#f0eeff]">{currentPage}</span> <span className="mx-2">/</span> {totalPages}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        className="rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 h-12 px-6 font-heading font-bold tracking-widest uppercase text-xs"
        render={
          <Link href={createPageUrl(currentPage + 1)}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        }
      />
    </div>
  );
}