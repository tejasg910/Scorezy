"use client";

import { useEffect, useState } from "react";
import { useTestStore } from "../../store/use-test-store";
import { submitAttempt } from "../../server/actions/quiz.actions";
import { useRouter } from "next/navigation";
import Countdown from "react-countdown";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, TimerReset, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TestClientProps {
  attemptId: string;
  initialTimeRemaining: number;
  quiz: any;
}

export function TestClient({ attemptId, initialTimeRemaining, quiz }: TestClientProps) {
  const router = useRouter();
  const store = useTestStore();
  const [hydrated, setHydrated] = useState(false);
  const [targetDate, setTargetDate] = useState<number | null>(null);

  useEffect(() => {
    store.setAttempt(attemptId, quiz.id, initialTimeRemaining);
    setTargetDate(Date.now() + initialTimeRemaining * 1000);
    setHydrated(true);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Don't show warning if we are submitting or have already submitted
      if (document.body.dataset.isSubmitting === 'true') return;
      e.preventDefault();
      e.returnValue = ''; // Shows warning on tab close
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attemptId, quiz.id, initialTimeRemaining]); // we intentionally don't put store here to avoid loops

  if (!hydrated || targetDate === null) {
    return <div className="flex h-64 items-center justify-center border-2 border-dashed rounded-[var(--radius)] bg-muted/20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  const handleSubmit = async () => {
    store.setSubmitting(true);
    document.body.dataset.isSubmitting = 'true'; // Set a DOM flag for beforeunload handler
    const result = await submitAttempt(attemptId, store.answers);
    console.log(result, "this is result");
    if (result.success) {
      store.clearStore();
      window.location.href = `/student/scores/${attemptId}`;
    } else {
      store.setSubmitting(false);
      delete document.body.dataset.isSubmitting;
      alert(result.message || "Failed to submit attempt");
    }
  };

  const handleTimeUp = () => {
    if (!store.isSubmitting) {
      handleSubmit();
    }
  };

  // The countdown will render like: 14:05
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-red-500 font-bold flex items-center"><TimerReset className="w-4 h-4 mr-1"/> Time's up!</span>;
    }
    const m = String(minutes + hours * 60).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return <span className={`font-mono font-bold text-lg ${minutes < 5 ? 'text-red-500' : 'text-gray-700'}`}>{m}:{s}</span>;
  };

  const currentQuestion = quiz.questions[store.currentQuestionIndex];

  return (
    <div className="space-y-12">
      {/* Premium Header with Luxury Timer */}
      <div className="sticky top-16 z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5 -mt-6 -mx-6 p-6 px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 min-w-0 space-y-1">
          <h2 className="text-xl md:text-2xl font-heading font-extrabold tracking-tight text-[#f0eeff] break-words">
            {quiz.title}
          </h2>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#71717a]">
             <span className="text-[#8b5cf6]">Question {store.currentQuestionIndex + 1}</span> 
             <span className="w-1 h-1 rounded-full bg-white/10" />
             <span>Total {quiz.questions.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white/5 px-6 py-3 border border-white/10 rounded-none min-w-[120px] text-center shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] mb-1">Time Remaining</div>
            {initialTimeRemaining > 0 ? (
               <Countdown 
                 date={targetDate} 
                 renderer={renderer} 
                 onComplete={handleTimeUp} 
               />
            ) : (
               <span className="text-[#a1a1aa] font-heading font-bold">Untimed</span>
            )}
          </div>
          <Button 
            onClick={() => {
              if (confirm("Are you sure you want to submit?")) handleSubmit();
            }}
            disabled={store.isSubmitting}
            variant="outline"
            className="rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] hover:bg-white/5 h-12 px-6"
          >
            {store.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Early
          </Button>
        </div>
      </div>

      <div className="pb-20 max-w-4xl mx-auto space-y-10">
        {/* Navigation Indicator Blocks (Squared) */}
        <div className="flex flex-wrap gap-2.5 justify-center">
            {quiz.questions.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => store.setCurrentQuestionIndex(idx)}
                className={cn(
                  "w-10 h-10 border transition-all duration-300 font-heading font-bold text-sm",
                  store.currentQuestionIndex === idx 
                    ? "bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-110" 
                    : store.answers[quiz.questions[idx].id]
                    ? "bg-[#8b5cf6]/20 border-[#8b5cf6]/40 text-[#b18aff]"
                    : "bg-white/5 border-white/10 text-[#71717a] hover:border-[#a1a1aa] hover:text-[#f0eeff]"
                )}
              >
                {String(idx + 1).padStart(2, '0')}
              </button>
            ))}
        </div>

        {currentQuestion && (
          <Card key={currentQuestion.id} className="border-white/5 bg-[#15151e] rounded-none overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
               <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.2em]">Section Assessment</span>
               <div className="px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#b18aff] text-[10px] font-bold uppercase tracking-widest">
                 {currentQuestion.marks} Marks
               </div>
            </div>
            <CardContent className="pt-12 px-10 pb-12">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#f0eeff] leading-tight mb-12">
                {currentQuestion.body}
              </h3>
              
              <RadioGroup 
                value={store.answers[currentQuestion.id] || ""} 
                onValueChange={(val) => store.setAnswer(currentQuestion.id, val)}
                disabled={store.isSubmitting}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currentQuestion.options.map((opt: any) => (
                  <div 
                    key={opt.id} 
                    className={cn(
                      "flex items-center space-x-4 p-6 rounded-none border-2 transition-all duration-300 cursor-pointer group",
                      store.answers[currentQuestion.id] === opt.id 
                        ? "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_20px_rgba(139,92,246,0.1)]" 
                        : "border-white/5 hover:border-white/20 hover:bg-white/5"
                    )}
                    onClick={() => !store.isSubmitting && store.setAnswer(currentQuestion.id, opt.id)}
                  >
                    <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} className="hidden" />
                    <div className={cn(
                      "w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all",
                      store.answers[currentQuestion.id] === opt.id 
                        ? "border-[#8b5cf6] bg-[#8b5cf6]" 
                        : "border-[#71717a] group-hover:border-[#a1a1aa]"
                    )}>
                      {store.answers[currentQuestion.id] === opt.id && (
                        <div className="w-2 h-2 bg-white" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
                      )}
                    </div>
                    <Label htmlFor={`opt-${opt.id}`} className="flex-1 cursor-pointer text-lg font-medium text-[#f0eeff] transition-colors group-hover:text-white">
                      {opt.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Navigation Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => store.setCurrentQuestionIndex(Math.max(0, store.currentQuestionIndex - 1))}
              disabled={store.currentQuestionIndex === 0 || store.isSubmitting}
              className="w-full sm:w-48 h-14 rounded-none border-white/10 text-[#a1a1aa] hover:text-[#f0eeff] transition-all font-heading font-bold tracking-widest uppercase"
            >
              Previous
            </Button>
            
            <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-[0.3em] order-3 sm:order-2">
               Question {store.currentQuestionIndex + 1} <span className="mx-2">/</span> {quiz.questions.length}
            </div>

            <div className="w-full sm:w-48 order-2 sm:order-3">
              {store.currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button
                  variant="luxury"
                  size="lg"
                  onClick={() => store.setCurrentQuestionIndex(store.currentQuestionIndex + 1)}
                  disabled={store.isSubmitting}
                  className="w-full h-14"
                >
                  Next Question
                </Button>
              ) : (
                <Button 
                  variant="luxury"
                  size="lg"
                  onClick={() => {
                    if (confirm("Are you sure you want to finish and submit the test?")) handleSubmit();
                  }}
                  disabled={store.isSubmitting}
                  className="w-full h-14 bg-green-600 hover:bg-green-500"
                >
                  Finish Test
                </Button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
