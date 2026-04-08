"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AttemptDetailsUI({ attempt }: { attempt: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isSubmitted = !!attempt.submittedAt;
  const passed = isSubmitted && attempt.score !== null && (attempt.passingMarks === null || attempt.score >= attempt.passingMarks);

  const q = attempt.questions[currentIndex];

  return (
    <div className="p-6 pt-32 min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Summary */}
        <div className="bg-card border border-border rounded-[var(--radius)] p-6 shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{attempt.quizTitle}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
               <Clock className="w-4 h-4" />
               Submitted: {attempt.submittedAt ? attempt.submittedAt.toLocaleString() : "Not submitted"}
            </div>
          </div>
          <div className="flex items-center gap-4 bg-muted p-4 rounded-[var(--radius)] border border-border">
            <div className="mr-4">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Your Score</p>
              <p className="text-3xl font-bold text-foreground">{attempt.score} <span className="text-lg font-normal text-muted-foreground">/ {attempt.total}</span></p>
            </div>
            {isSubmitted && (
               passed ? (
                 <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm py-1 px-3 border-none">Passed</Badge>
               ) : (
                 <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm py-1 px-3 border-none">Failed</Badge>
               )
            )}
          </div>
        </div>

        {/* Navigation Dots for Quick Access */}
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {attempt.questions.map((que: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-[var(--radius)] border text-[10px] font-bold transition-all ${
                  currentIndex === idx 
                    ? "bg-primary border-primary text-primary-foreground scale-110 shadow-sm" 
                    : que.isCorrect
                    ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20"
                    : "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-semibold text-foreground">Detailed Results <span className="text-sm font-normal text-muted-foreground">(Q{currentIndex + 1})</span></h2>
           <Link href="/student/scores">
             <Button variant="outline">Back to Scores</Button>
           </Link>
        </div>

        {/* Questions Display */}
        <div className="space-y-6">
          {q && (
            <Card key={q.id}>
              <div className={`px-6 py-4 border-b border-border flex justify-between items-center rounded-t-[var(--radius)] ${q.isCorrect ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                 <span className="text-sm font-semibold text-muted-foreground uppercase tracking-tight">Question {currentIndex + 1}</span>
                 {q.isCorrect ? (
                   <span className="flex items-center text-sm font-bold text-green-500">
                     <CheckCircle2 className="w-4 h-4 mr-1" /> Correct (+{q.marks})
                   </span>
                 ) : (
                   <span className="flex items-center text-sm font-bold text-red-500">
                     <XCircle className="w-4 h-4 mr-1" /> Incorrect (0/{q.marks})
                   </span>
                 )}
              </div>
              <CardContent className="pt-8 px-8 pb-10">
                <h3 className="text-xl font-medium text-foreground leading-relaxed mb-8">{q.body}</h3>
                
                <div className="space-y-3">
                  {q.options.map((opt: any) => {
                    const isUserSelection = q.userAnswer === opt.id;
                    const isCorrectOption = opt.isCorrect;
                    
                    let borderColor = "border-gray-100";
                    let bgColor = "bg-white";
                    let icon = null;

                    if (isCorrectOption) {
                      borderColor = "border-green-500";
                      bgColor = "bg-green-50/50";
                      icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                    } else if (isUserSelection && !isCorrectOption) {
                      borderColor = "border-red-500";
                      bgColor = "bg-red-50/50";
                      icon = <XCircle className="w-5 h-5 text-red-500" />;
                    } else if (isUserSelection) {
                       borderColor = "border-blue-400 shadow-sm";
                    }

                    return (
                      <div key={opt.id} className={`flex items-center justify-between space-x-3 p-4 rounded-xl border-2 transition-all ${borderColor} ${bgColor}`}>
                        <div className="flex items-center space-x-4">
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                             isUserSelection ? 'border-blue-500 bg-blue-500' : 'border-gray-200'
                           }`}>
                             {isUserSelection && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                           </div>
                           <Label className="flex-1 text-base font-medium">{opt.text}</Label>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination Buttons */}
          <div className="flex justify-between items-center py-4">
             <Button
               variant="outline"
               onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
               disabled={currentIndex === 0}
               className="w-32"
             >
               Previous
             </Button>
             
             <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Question {currentIndex + 1} of {attempt.questions.length}
             </div>

             <Button
               variant="outline"
               onClick={() => setCurrentIndex(Math.min(attempt.questions.length - 1, currentIndex + 1))}
               disabled={currentIndex === attempt.questions.length - 1}
               className="w-32"
             >
               Next
             </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
