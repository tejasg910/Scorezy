"use client";

import { useEffect, useState } from "react";
import { useTestStore } from "../../store/use-test-store";
import { submitAttempt } from "../../server/actions/quiz.actions";
import { useRouter } from "next/navigation";
import Countdown from "react-countdown";
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
    <div className="space-y-6">
      {/* Sticky Header with Timer */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur border-b border-border shadow-sm -mt-6 -mx-6 p-4 px-6 md:px-10 flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-xl font-bold truncate max-w-[200px] md:max-w-none text-foreground">{quiz.title}</h2>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
             <span className="font-medium text-primary">Question {store.currentQuestionIndex + 1}</span> of {quiz.questions.length}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted px-4 py-2 border border-border rounded-[var(--radius)] min-w-[80px] text-center">
            {initialTimeRemaining > 0 ? (
               <Countdown 
                 date={targetDate} 
                 renderer={renderer} 
                 onComplete={handleTimeUp} 
               />
            ) : (
               <span className="text-muted-foreground font-mono">Untimed</span>
            )}
          </div>
          <Button 
            onClick={() => {
              if (confirm("Are you sure you want to submit?")) handleSubmit();
            }}
            disabled={store.isSubmitting}
            variant={store.currentQuestionIndex === quiz.questions.length - 1 ? "default" : "outline"}
            className={store.currentQuestionIndex === quiz.questions.length - 1 ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            {store.isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {store.currentQuestionIndex === quiz.questions.length - 1 ? "Finish & Submit" : "Submit Early"}
          </Button>
        </div>
      </div>

      <div className="pb-10 max-w-3xl mx-auto">
        {/* Navigation Indicator Dots */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {quiz.questions.map((_: any, idx: number) => (
              <button
                key={idx}
                onClick={() => store.setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-full border text-xs font-bold transition-all ${
                  store.currentQuestionIndex === idx 
                    ? "bg-primary border-primary text-primary-foreground scale-110" 
                    : store.answers[quiz.questions[idx].id]
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-background text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {idx + 1}
              </button>
            ))}
        </div>

        {currentQuestion && (
          <Card key={currentQuestion.id} className="border-border shadow-none">
            <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between items-center rounded-t-[var(--radius)]">
               <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Question {store.currentQuestionIndex + 1}</span>
               <Badge variant="outline" className="bg-background">{currentQuestion.marks} Marks</Badge>
            </div>
            <CardContent className="pt-8 px-8 pb-10">
              <h3 className="text-xl font-medium text-foreground leading-relaxed mb-8">{currentQuestion.body}</h3>
              
              <RadioGroup 
                value={store.answers[currentQuestion.id] || ""} 
                onValueChange={(val) => store.setAnswer(currentQuestion.id, val)}
                disabled={store.isSubmitting}
                className="space-y-4"
              >
                {currentQuestion.options.map((opt: any) => (
                  <div 
                    key={opt.id} 
                    className={`flex items-center space-x-3 p-4 rounded-[var(--radius)] border-2 transition-all cursor-pointer ${
                      store.answers[currentQuestion.id] === opt.id 
                        ? "border-primary bg-primary/10 shadow-sm" 
                        : "border-border hover:border-muted-foreground hover:bg-muted/20"
                    }`}
                    onClick={() => !store.isSubmitting && store.setAnswer(currentQuestion.id, opt.id)}
                  >
                    <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} className="hidden" />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      store.answers[currentQuestion.id] === opt.id ? "border-primary bg-primary" : "border-muted"
                    }`}>
                      {store.answers[currentQuestion.id] === opt.id && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                    </div>
                    <Label htmlFor={`opt-${opt.id}`} className="flex-1 cursor-pointer text-base font-medium text-foreground">{opt.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Next/Prev Navigation */}
        <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => store.setCurrentQuestionIndex(Math.max(0, store.currentQuestionIndex - 1))}
              disabled={store.currentQuestionIndex === 0 || store.isSubmitting}
              className="px-8"
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500 font-medium">
               Step {store.currentQuestionIndex + 1} of {quiz.questions.length}
            </div>

            {store.currentQuestionIndex < quiz.questions.length - 1 ? (
              <Button
                size="lg"
                onClick={() => store.setCurrentQuestionIndex(store.currentQuestionIndex + 1)}
                disabled={store.isSubmitting}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
                <Button 
                    size="lg"
                    onClick={() => {
                    if (confirm("Are you sure you want to finish and submit the test?")) handleSubmit();
                    }}
                    disabled={store.isSubmitting}
                    className="px-8 bg-green-600 hover:bg-green-700"
                >
                    Finish Test
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
