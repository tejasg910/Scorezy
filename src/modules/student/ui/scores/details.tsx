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
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Summary */}
        <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{attempt.quizTitle}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
               <Clock className="w-4 h-4" />
               Submitted: {attempt.submittedAt ? attempt.submittedAt.toLocaleString() : "Not submitted"}
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
            <div className="mr-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Your Score</p>
              <p className="text-3xl font-bold">{attempt.score} <span className="text-lg font-normal text-gray-400">/ {attempt.total}</span></p>
            </div>
            {isSubmitted && (
               passed ? (
                 <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-sm py-1 px-3 border-none">Passed</Badge>
               ) : (
                 <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-sm py-1 px-3 border-none">Failed</Badge>
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
                className={`w-7 h-7 rounded-md border text-[10px] font-bold transition-all ${
                  currentIndex === idx 
                    ? "bg-gray-900 border-gray-900 text-white scale-110 shadow-sm" 
                    : que.isCorrect
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-semibold">Detailed Results <span className="text-sm font-normal text-gray-500">(Q{currentIndex + 1})</span></h2>
           <Link href="/student/scores">
             <Button variant="outline">Back to Scores</Button>
           </Link>
        </div>

        {/* Questions Display */}
        <div className="space-y-6">
          {q && (
            <Card key={q.id}>
              <div className={`px-6 py-4 border-b flex justify-between items-center rounded-t-xl ${q.isCorrect ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                 <span className="text-sm font-semibold text-gray-600 uppercase tracking-tight">Question {currentIndex + 1}</span>
                 {q.isCorrect ? (
                   <span className="flex items-center text-sm font-bold text-green-600">
                     <CheckCircle2 className="w-4 h-4 mr-1" /> Correct (+{q.marks})
                   </span>
                 ) : (
                   <span className="flex items-center text-sm font-bold text-red-600">
                     <XCircle className="w-4 h-4 mr-1" /> Incorrect (0/{q.marks})
                   </span>
                 )}
              </div>
              <CardContent className="pt-8 px-8 pb-10">
                <h3 className="text-xl font-medium text-gray-900 leading-relaxed mb-8">{q.body}</h3>
                
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
