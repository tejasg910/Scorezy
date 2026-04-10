"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, PlayCircle, Search } from "lucide-react";
import Link from "next/link";

export function TestsClientList({ activeQuizzes }: { activeQuizzes: any[] }) {
  const [search, setSearch] = useState("");

  const filteredQuizzes = activeQuizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(search.toLowerCase()) || 
    (quiz.description && quiz.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#a1a1aa]" />
        </div>
        <Input
          type="search"
          placeholder="Search quizzes by title or description..."
          className="pl-10 bg-white/5 border-white/10 text-[#f0eeff] h-12 focus:border-[#8b5cf6]/50 transition-all rounded-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-20 border border-white/5 border-dashed rounded-none bg-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-heading font-bold text-[#f0eeff]">No tests found</h3>
          <p className="mt-2 text-[#a1a1aa] max-w-xs mx-auto">
            {search ? "Try adjusting your search terms." : "You are all caught up! Check back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="group relative border-white/5 bg-[#15151e] overflow-hidden hover:border-[#8b5cf6]/50 transition-all duration-300 rounded-none flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="flex-1 space-y-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-heading font-bold tracking-tight text-[#f0eeff]">{quiz.title}</CardTitle>
                  {quiz.description && (
                    <CardDescription className="line-clamp-2 text-[#a1a1aa] text-sm leading-relaxed">
                      {quiz.description}
                    </CardDescription>
                  )}
                </div>
                
                <div className="flex items-center gap-6 pt-4 border-t border-white/5 overflow-hidden">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Duration</span>
                    <span className="flex items-center gap-2 text-xs text-[#f0eeff] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" /> {quiz.timeLimit} mins
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">Passing</span>
                    <span className="text-xs text-[#f0eeff] font-medium">{quiz.passingMarks} Marks</span>
                  </div>
                </div>
              </CardHeader>

              <CardFooter className="bg-white/5 border-t border-white/5 px-6 py-6 mt-auto">
                <Link href={`/student/tests/${quiz.id}`} className="w-full">
                  <Button className="w-full h-12 text-base" variant="luxury">
                    <PlayCircle className="w-5 h-5 mr-2" /> Start Test
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
