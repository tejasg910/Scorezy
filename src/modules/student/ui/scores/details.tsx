"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AttemptDetailsUI({ attempt }: { attempt: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSubmitted = !!attempt.submittedAt;
  const passed = isSubmitted && attempt.score !== null && (attempt.passingMarks === null || attempt.score >= attempt.passingMarks);

  const q = attempt.questions[currentIndex];

  return (
    <div className="p-6 pt-32 lg:pt-20 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Summary (Premium Report Design) */}
        <div className="bg-[#15151e] border border-white/5 rounded-none p-6 md:p-10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex-1 space-y-4">
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8b5cf6]">Final Performance Archive</span>
               <div className="h-px flex-1 bg-white/5" />
             </div>
             <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-[#f0eeff] leading-none [text-wrap:balance]">
               {attempt.quizTitle}
             </h1>
             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Vault Locked: {attempt.submittedAt ? attempt.submittedAt.toLocaleString() : "Not submitted"}</span>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 p-6 md:p-8 bg-white/5 border border-white/5 w-full md:w-auto md:min-w-[200px]">
             <div className="text-center">
               <p className="text-[10px] text-[#71717a] font-bold uppercase tracking-[0.2em] mb-2">Efficiency Rating</p>
               <p className="text-5xl font-heading font-extrabold text-[#f0eeff]">
                 {attempt.score} <span className="text-lg font-bold text-[#71717a] uppercase">/ {attempt.total}</span>
               </p>
             </div>
             {isSubmitted && (
                passed ? (
                  <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-[0.2em]">Authorized / Pass</div>
                ) : (
                  <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em]">Restricted / Fail</div>
                )
             )}
          </div>
        </div>

        {/* Evaluation Navigation */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 border-b border-white/5 p-6 rounded-none">
             <h2 className="text-xl font-heading font-bold text-[#f0eeff] uppercase tracking-wider">Evaluation Log</h2>
             <div className="flex flex-wrap gap-2.5 justify-center mt-4 sm:mt-0">
                {attempt.questions.map((que: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "w-10 h-10 border transition-all duration-300 font-heading font-bold text-sm",
                      currentIndex === idx 
                        ? "bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] scale-110" 
                        : que.isCorrect
                        ? "bg-green-500/5 border-green-500/10 text-green-500/60 hover:border-green-500/30"
                        : "bg-red-500/5 border-red-500/10 text-red-400/60 hover:border-red-500/30"
                    )}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>
                ))}
             </div>
          </div>

          {/* Assessment Breakdown */}
          <div className="grid grid-cols-1 gap-10">
            {q && (
              <Card key={q.id} className="border-white/5 bg-[#15151e] rounded-none overflow-hidden shadow-2xl">
                <div className={cn(
                  "px-8 py-4 border-b border-white/5 flex justify-between items-center",
                  q.isCorrect ? 'bg-green-500/5' : 'bg-red-500/5'
                )}>
                   <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em]">Module {currentIndex + 1} Assessment</span>
                   {q.isCorrect ? (
                     <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                        Perfect Capture (+{q.marks} Marks)
                     </div>
                   ) : (
                     <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                        System Misalignment (0/{q.marks} Marks)
                     </div>
                   )}
                </div>
                <CardContent className="pt-12 px-10 pb-12">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#f0eeff] leading-tight mb-12">
                    {q.body}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt: any) => {
                      const isUserSelection = q.userAnswer === opt.id;
                      const isCorrectOption = opt.isCorrect;
                      
                      let variantStyle = "border-white/5 bg-white/5 text-[#a1a1aa]";
                      let statusText = null;

                      if (isCorrectOption) {
                        variantStyle = "border-green-500/50 bg-green-500/10 text-white";
                        statusText = "Correct Protocol";
                      } else if (isUserSelection && !isCorrectOption) {
                        variantStyle = "border-red-500/50 bg-red-500/10 text-white";
                        statusText = "Selected Fault";
                      } else if (isUserSelection) {
                         variantStyle = "border-[#8b5cf6]/50 bg-[#8b5cf6]/10 text-white";
                      }

                      return (
                        <div key={opt.id} className={cn(
                          "flex items-center justify-between p-6 rounded-none border-2 transition-all group",
                          variantStyle
                        )}>
                          <div className="flex items-center space-x-4">
                             <div className={cn(
                               "w-6 h-6 border-2 flex items-center justify-center transition-all",
                               isUserSelection ? 'border-[#8b5cf6] bg-[#8b5cf6]' : 'border-[#71717a]'
                             )}>
                               {isUserSelection && <div className="w-2 h-2 bg-white" />}
                             </div>
                             <Label className="flex-1 text-lg font-medium cursor-default">{opt.text}</Label>
                          </div>
                          {statusText && (
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{statusText}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
               <Button
                 variant="outline"
                 size="lg"
                 onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                 disabled={currentIndex === 0}
                 className="w-full sm:w-48 h-14 rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] transition-all font-heading font-bold tracking-widest uppercase"
               >
                 Previous
               </Button>
               
               <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.3em] order-3 sm:order-2">
                  Module {currentIndex + 1} <span className="mx-2">/</span> {attempt.questions.length}
               </div>

               <div className="w-full sm:w-48 order-2 sm:order-3 flex gap-2">
                 <Button
                   variant="outline"
                   size="lg"
                   onClick={() => setCurrentIndex(Math.min(attempt.questions.length - 1, currentIndex + 1))}
                   disabled={currentIndex === attempt.questions.length - 1}
                   className="flex-1 h-14 rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] transition-all font-heading font-bold tracking-widest uppercase"
                 >
                   Next
                 </Button>
                  <Button variant="luxury" size="icon" className="h-14 w-14">
                    <Link href="/student/scores">
                      <XCircle className="w-5 h-5" />
                    </Link>
                  </Button>
               </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
