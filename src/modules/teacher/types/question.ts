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
  orderIndex: number;
  options: Option[];
};