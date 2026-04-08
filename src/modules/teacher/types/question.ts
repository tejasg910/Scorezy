export type QuestionType = "mcq" | "true_false";

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  orderIndex: number;
};

export type QuestionWithOptions = {
  id: string;
  quizId: string;
  body: string;
  type: QuestionType;
  marks: number;
  orderIndex: number;
  options: Option[];
};


export type BulkQuestionInput = {
  questions: Array<{
    body: string;                    // Question text
    type: "mcq" | "true_false";      // Must be one of these
    marks?: number;                  // Optional (default = 1)
    options: Array<{
      text: string;                  // Option text
      isCorrect: boolean;            // Exactly ONE true per question
    }>;
  }>;
};

export type BulkQuestionState = {
  error?: string;
  success?: boolean;
  createdCount?: number;
};